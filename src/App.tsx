import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FileText, Github, AlertCircle } from 'lucide-react';
import { UrlInput } from './components/UrlInput';
import { DocumentationPreview } from './components/DocumentationPreview';
import { FileExplorer } from './components/FileExplorer';
import { FileSearch } from './components/FileSearch';
import { RepositoryStats } from './components/RepositoryStats';
import { ProgressBar } from './components/ProgressBar';
import { LanguageStats } from './components/LanguageStats';
import { FileSizeAnalysis } from './components/FileSizeAnalysis';
import { ThemeToggle } from './components/ThemeToggle';
import { SearchHistory } from './components/SearchHistory';
import { FileTree } from './components/FileTree';
import { CodeQualityAnalysis } from './components/CodeQualityAnalysis';
import { RepositoryInsights } from './components/RepositoryInsights';
import { RepositoryTimeline } from './components/RepositoryTimeline';
import { DependencyAnalysis } from './components/DependencyAnalysis';
import { fetchRepository } from './services/github';
import { generateDocumentation } from './services/ai';
import { logger } from './services/logger';
import type { GeneratedDoc, Repository, RepositoryFile } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDoc | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasRequiredKeys, setHasRequiredKeys] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RepositoryFile | null>(null);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const checkApiKeys = () => {
      const githubKey = localStorage.getItem('github_key');
      const geminiKey = localStorage.getItem('gemini_key');
      
      console.log('Current API keys:', {
        github: githubKey ? 'present' : 'missing',
        gemini: geminiKey ? 'present' : 'missing'
      });

      if (!githubKey || !geminiKey) {
        toast.dismiss('api-keys-required');
        toast((t) => (
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <div className="font-medium mb-1">API Keys Required</div>
              <div className="text-sm text-gray-600">
                Please add both {!githubKey && 'GitHub Token'} 
                {!githubKey && !geminiKey && ' and '} 
                {!geminiKey && 'Gemini API Key'} to proceed.
              </div>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'bottom-center',
          id: 'api-keys-required',
        });
      }
    };

    // Check immediately
    checkApiKeys();

    // Check whenever localStorage changes
    window.addEventListener('storage', checkApiKeys);
    return () => window.removeEventListener('storage', checkApiKeys);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const handleSubmit = async (url: string) => {
    const githubKey = localStorage.getItem('github_key');
    const geminiKey = localStorage.getItem('gemini_key');

    if (!githubKey || !geminiKey) {
      toast.error(
        `Please add both ${!githubKey ? 'GitHub Token' : ''} ${!githubKey && !geminiKey ? 'and' : ''} ${!geminiKey ? 'Gemini API Key' : ''} before proceeding.`,
        { duration: 5000 }
      );
      return;
    }

    logger.clear();
    setIsLoading(true);
    setIsGenerating(true);
    setRepository(null);
    setGeneratedDoc(null);
    
    try {
      logger.log('Starting repository analysis', 'info');
      const repo = await fetchRepository(url);
      setRepository(repo);
      setIsLoading(false);
      
      const documentation = await generateDocumentation(repo);
      setGeneratedDoc({ content: documentation, repository: repo });
      logger.log('Documentation process completed successfully', 'success');
    } catch (error) {
      logger.log(error instanceof Error ? error.message : 'An error occurred', 'error');
      setGeneratedDoc(null);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }

    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    const newHistory = [url, ...history.filter((item: string) => item !== url)].slice(0, 5);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const handleDownload = () => {
    if (!generatedDoc) return;
    
    try {
      logger.log('Preparing documentation download', 'info');
      const blob = new Blob([generatedDoc.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      logger.log('Documentation downloaded successfully', 'success');
    } catch (error) {
      logger.log('Failed to download documentation', 'error');
    }
  };

  const filteredFiles = repository?.files.filter(file => 
    !searchQuery || file.path.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-blue-500" />
            <Github className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GitHub Documentation Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate comprehensive documentation for your GitHub repositories using AI.
            Simply paste your repository URL below to get started.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-3xl flex items-center gap-2">
            <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {(isLoading || isGenerating) && (
            <>
              <ProgressBar 
                progress={logger.getProgress()} 
                status={isLoading ? 'Fetching Repository...' : 'Generating Documentation...'}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                <span className="text-gray-600">
                  {isLoading ? 'Fetching repository data...' : 'Generating documentation...'}
                </span>
              </div>
            </>
          )}

          {repository && !isLoading && (
            <>
              <RepositoryStats repository={repository} />
              <CodeQualityAnalysis files={repository.files} />
              <RepositoryInsights files={repository.files} />
              <DependencyAnalysis files={repository.files} />
              <RepositoryTimeline repository={repository} />
              <LanguageStats files={repository.files} />
              <FileSizeAnalysis files={repository.files} />
              
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    File Tree
                  </h3>
                  <FileTree 
                    files={repository.files} 
                    onFileSelect={(file) => {
                      setSelectedFile(file);
                      const fileExplorer = document.querySelector('.file-explorer');
                      if (fileExplorer) {
                        fileExplorer.scrollIntoView({ behavior: 'smooth' });
                      }
                    }} 
                  />
                </div>

                <div className="file-explorer">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    File Explorer
                  </h3>
                  <div className="mb-3">
                    <FileSearch onSearch={setSearchQuery} />
                  </div>
                  <FileExplorer 
                    files={filteredFiles}
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                  />
                </div>
              </div>
            </>
          )}

          {generatedDoc && !isGenerating && (
            <DocumentationPreview 
              doc={generatedDoc} 
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </div>
  );
}

export default App;