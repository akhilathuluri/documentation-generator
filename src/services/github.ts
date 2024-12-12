import type { Repository, RepositoryFile } from '../types';
import { logger } from './logger';

function getHeaders() {
  const token = localStorage.getItem('github_key');
  return token ? { 
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  } : undefined;
}

async function fetchFileContent(url: string): Promise<string> {
  logger.log(`Fetching file content from: ${url}`, 'info', false);
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    logger.log(`Failed to fetch file content: ${response.statusText}`, 'warn', false);
    return '';
  }
  const data = await response.json();
  logger.log(`Successfully fetched file content`, 'info', false);
  return data.content ? atob(data.content) : '';
}

async function fetchDirectoryContents(owner: string, repo: string, path: string = ''): Promise<RepositoryFile[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  logger.log(`Fetching directory contents from: ${url}`, 'info', false);
  
  const response = await fetch(url, { headers: getHeaders() });
  
  if (response.status === 403) {
    const error = 'API rate limit exceeded. Please provide a GitHub token.';
    logger.log(error, 'error');
    throw new Error(error);
  }
  
  if (!response.ok) {
    const error = 'Failed to fetch repository contents';
    logger.log(error, 'error');
    throw new Error(error);
  }
  
  const contents = await response.json();
  const files: RepositoryFile[] = [];

  for (const item of Array.isArray(contents) ? contents : [contents]) {
    logger.log(`Processing ${item.type}: ${item.path}`, 'info', false);
    
    if (item.type === 'file') {
      const content = await fetchFileContent(item.url);
      files.push({
        name: item.name,
        path: item.path,
        content,
        type: 'file'
      });
    } else if (item.type === 'dir') {
      const subFiles = await fetchDirectoryContents(owner, repo, item.path);
      files.push({
        name: item.name,
        path: item.path,
        content: '',
        type: 'directory'
      });
      files.push(...subFiles);
    }
  }

  logger.log(`Successfully fetched ${files.length} files from ${path || 'root'}`, 'info', false);
  return files;
}

export async function fetchRepository(url: string): Promise<Repository> {
  logger.log(`Starting repository fetch: ${url}`, 'info');
  
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    const error = 'Invalid GitHub repository URL';
    logger.log(error, 'error');
    throw new Error(error);
  }

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  logger.log(`Fetching repository metadata from: ${apiUrl}`, 'info', false);

  try {
    const response = await fetch(apiUrl, { headers: getHeaders() });
    
    if (response.status === 403) {
      const error = 'API rate limit exceeded. Please provide a GitHub token.';
      logger.log(error, 'error');
      throw new Error(error);
    }
    
    if (!response.ok) {
      const error = 'Repository not found';
      logger.log(error, 'error');
      throw new Error(error);
    }
    
    const data = await response.json();
    logger.log(`Successfully fetched repository metadata`, 'success', false);
    
    logger.log(`Starting to fetch repository contents`, 'info', false);
    const files = await fetchDirectoryContents(owner, repo);
    logger.log(`Successfully fetched all repository contents`, 'success', false);

    const readmeFile = files.find(f => 
      f.name.toLowerCase() === 'readme.md' || 
      f.name.toLowerCase() === 'readme'
    );

    if (readmeFile) {
      logger.log(`Found existing README file: ${readmeFile.path}`, 'info', false);
    }

    const repository: Repository = {
      url,
      name: data.name,
      description: data.description || '',
      files,
      readme: readmeFile?.content || '',
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      license: data.license?.name,
      lastUpdate: data.updated_at
    };

    logger.log(`Repository fetch completed successfully`, 'success');
    return repository;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const errorMsg = 'Failed to fetch repository data';
    logger.log(errorMsg, 'error');
    throw new Error(errorMsg);
  }
}