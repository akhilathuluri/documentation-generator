import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Repository, RepositoryFile } from '../types';
import { logger } from './logger';

function analyzeFileStructure(files: RepositoryFile[]): string {
  const structure: { [key: string]: any } = {};
  
  files.forEach(file => {
    const parts = file.path.split('/');
    let current = structure;
    
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = file.type === 'file' ? null : {};
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });

  function formatStructure(obj: any, indent: number = 0): string {
    return Object.entries(obj)
      .map(([key, value]) => {
        const prefix = '  '.repeat(indent);
        if (value === null) {
          return `${prefix}- 📄 ${key}`;
        }
        return `${prefix}- 📁 ${key}\n${formatStructure(value, indent + 1)}`;
      })
      .join('\n');
  }

  return formatStructure(structure);
}

function analyzeCodePatterns(files: RepositoryFile[]): string {
  const patterns: string[] = [];
  
  const configFiles = files.filter(f => 
    f.name.includes('config') || 
    f.name.endsWith('.json') || 
    f.name.endsWith('.yaml') || 
    f.name.endsWith('.yml')
  );
  
  if (configFiles.length > 0) {
    patterns.push('Configuration Management');
  }

  const testFiles = files.filter(f => 
    f.path.includes('test') || 
    f.path.includes('spec') || 
    f.name.endsWith('.test.ts') || 
    f.name.endsWith('.spec.ts')
  );
  
  if (testFiles.length > 0) {
    patterns.push('Testing Framework');
  }

  return patterns.join('\n');
}

export async function generateDocumentation(repository: Repository): Promise<string> {
  logger.setProgress(0);
  logger.log('Starting documentation generation', 'info');
  
  try {
    const apiKey = localStorage.getItem('gemini_key');
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please add your API key first.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    logger.setProgress(10);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    logger.log('Initialized Gemini AI model', 'info', false);

    logger.setProgress(20);
    logger.log('Analyzing repository components', 'info', false);
    const fileStructure = analyzeFileStructure(repository.files);
    const codePatterns = analyzeCodePatterns(repository.files);
    
    logger.setProgress(40);
    logger.log('Processing source files', 'info', false);
    const sourceFiles = repository.files
      .filter(f => f.type === 'file' && f.content)
      .map(f => `${f.path}:\n\`\`\`${getFileExtension(f.path)}\n${f.content.slice(0, 500)}${f.content.length > 500 ? '...' : ''}\n\`\`\``)
      .join('\n\n');

    logger.setProgress(60);
    logger.log('Preparing AI prompt', 'info', false);
    const prompt = `You are a technical documentation expert. Create a professional, comprehensive GitHub README.md for this repository.

Repository Details:
- Name: ${repository.name}
- Description: ${repository.description}
- Primary Language: ${repository.language}
- Stars: ${repository.stars}
- Forks: ${repository.forks}
- Open Issues: ${repository.issues}
- License: ${repository.license || 'Not specified'}
- Last Updated: ${repository.lastUpdate}

Repository Structure:
${fileStructure}

Key Features and Patterns:
${codePatterns}

Source Code Analysis:
${sourceFiles}

Create a detailed README.md following these guidelines:

1. Start with an eye-catching header including:
   - Project logo or banner (suggest an appropriate emoji if no logo)
   - Project name in a large heading
   - Concise one-line description
   - Status badges (build, version, license)
   - Quick links (docs, demo, etc.)

2. Project Overview:
   - Detailed description of the project's purpose
   - Key features and capabilities
   - Screenshots or GIFs demonstrating functionality (suggest placeholders)
   - Target audience and use cases

3. Technical Architecture:
   - High-level system design
   - Key components and their interactions
   - Technology stack with version information
   - System requirements

4. Getting Started:
   - Prerequisites (with version numbers)
   - Step-by-step installation instructions
   - Configuration steps
   - Environment setup

5. Usage Guide:
   - Basic usage examples with code snippets
   - Common use cases
   - Configuration options
   - API documentation (if applicable)
   - Best practices

6. Development:
   - Development setup instructions
   - Testing procedures
   - Code style guidelines
   - Contribution guidelines
   - Build and deployment procedures

7. Additional Information:
   - Troubleshooting guide
   - FAQ section
   - Performance considerations
   - Security notes
   - Changelog or version history
   - License details
   - Credits and acknowledgments

Format Requirements:
- Use proper Markdown syntax
- Include syntax highlighting in code blocks
- Use tables for structured information
- Include emojis for better readability
- Add anchors for table of contents
- Ensure proper heading hierarchy
- Include inline code formatting
- Add badges where appropriate

Make the documentation engaging, professional, and easy to follow. Focus on clarity and completeness while maintaining a professional tone.`;

    logger.setProgress(60);
    logger.log('Generating documentation with AI', 'info');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Post-process the response
    let documentation = response.text();
    
    // Add table of contents if not present
    if (!documentation.includes('## Table of Contents')) {
      const sections = documentation.match(/^## .+$/gm) || [];
      if (sections.length > 0) {
        const toc = '## Table of Contents\n\n' + sections
          .map(section => {
            const title = section.replace('## ', '');
            const anchor = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            return `- [${title}](#${anchor})`;
          })
          .join('\n');
        documentation = toc + '\n\n' + documentation;
      }
    }

    // Add badges if not present
    if (!documentation.includes('![')) {
      const badges = [
        `![License](https://img.shields.io/badge/license-${encodeURIComponent(repository.license || 'Unknown')}-blue.svg)`,
        `![Language](https://img.shields.io/badge/${repository.language}-language-blue.svg)`,
        `![Stars](https://img.shields.io/badge/Stars-${repository.stars}-yellow.svg)`,
        `![Forks](https://img.shields.io/badge/Forks-${repository.forks}-blue.svg)`
      ].join(' ');
      documentation = documentation.replace(/^# .*$/m, `$&\n\n${badges}`);
    }

    logger.setProgress(100);
    logger.log('Documentation generated successfully', 'success');
    
    return documentation;
  } catch (error) {
    logger.setProgress(0);
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate documentation';
    logger.log(errorMsg, 'error');
    throw new Error(errorMsg);
  }
}

// Helper function to get file extension for syntax highlighting
function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'py':
      return 'python';
    case 'rb':
      return 'ruby';
    case 'java':
      return 'java';
    case 'php':
      return 'php';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'cs':
      return 'csharp';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'md':
      return 'markdown';
    case 'json':
      return 'json';
    case 'yml':
    case 'yaml':
      return 'yaml';
    default:
      return ext;
  }
}