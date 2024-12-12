import React, { useState } from 'react';
import { File, Folder, X, Copy, Check } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';

interface FileExplorerProps {
  files: RepositoryFile[];
  selectedFile: RepositoryFile | null;
  onFileSelect: (file: RepositoryFile | null) => void;
}

export function FileExplorer({ files, selectedFile, onFileSelect }: FileExplorerProps) {
  const [copied, setCopied] = useState(false);

  const sortedFiles = [...files].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.path.localeCompare(b.path);
  });

  const handleFileSelect = (file: RepositoryFile) => {
    onFileSelect(file);
  };

  const handleCopyCode = async () => {
    if (selectedFile) {
      try {
        await navigator.clipboard.writeText(selectedFile.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Code copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy code');
      }
    }
  };

  return (
    <>
      <Card
        title="Repository Files"
        subtitle={`${files.length} files found • Click on a file to preview its contents`}
        icon={<Folder className="w-5 h-5 text-blue-500" />}
        className="animate-slideIn"
      >
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {sortedFiles.map((file) => (
              <div
                key={file.path}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer
                  ${file.type === 'file' ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  ${selectedFile?.path === file.path ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                onClick={() => file.type === 'file' && handleFileSelect(file)}
              >
                {file.type === 'directory' ? (
                  <Folder className="w-5 h-5 text-blue-500" />
                ) : (
                  <File className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate" title={file.path}>
                  {file.path}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden animate-scaleIn">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate flex items-center gap-2">
                <File className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                {selectedFile.path}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  icon={copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  title="Copy code"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileSelect(null)}
                  icon={<X className="w-4 h-4" />}
                />
              </div>
            </div>
            <pre className="p-4 overflow-auto max-h-[calc(80vh-4rem)] bg-gray-50 dark:bg-gray-900">
              <code className="text-sm text-gray-800 dark:text-gray-200">{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
} 