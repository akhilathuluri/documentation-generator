import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';

interface FileTreeProps {
  files: RepositoryFile[];
  onFileSelect: (file: RepositoryFile) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children: TreeNode[];
  content?: string;
}

export function FileTree({ files, onFileSelect }: FileTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const buildTree = (files: RepositoryFile[]): TreeNode[] => {
    const root: { [key: string]: TreeNode } = {};

    files.forEach(file => {
      const parts = file.path.split('/');
      let current = root;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: index === parts.length - 1 ? file.type : 'directory',
            children: [],
            content: file.content
          };
        }
        if (index < parts.length - 1) {
          current = current[part].children.reduce((acc, child) => {
            acc[child.name] = child;
            return acc;
          }, {} as { [key: string]: TreeNode });
        }
      });
    });

    return Object.values(root).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedPaths.has(node.path);
    const paddingLeft = `${level * 1.5}rem`;

    return (
      <div key={node.path} className="animate-slideIn" style={{ '--delay': `${level * 50}ms` } as React.CSSProperties}>
        <div
          className={`flex items-center gap-1 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-lg transition-all duration-200
            ${node.type === 'file' ? 'hover:translate-x-1' : ''}`}
          style={{ paddingLeft }}
          onClick={() => node.type === 'directory' ? toggleExpand(node.path) : onFileSelect(node as RepositoryFile)}
        >
          {node.type === 'directory' && (
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.path);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          )}
          {node.type === 'directory' ? (
            <Folder className={`w-4 h-4 ${isExpanded ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
          ) : (
            <File className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {node.name}
          </span>
        </div>
        {node.type === 'directory' && isExpanded && (
          <div className="animate-slideIn">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(files);

  return (
    <Card
      title="File Tree"
      subtitle="Click directories to expand/collapse"
      icon={<Folder className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-auto max-h-[600px]">
        <div className="p-2 space-y-0.5">
          {tree.map(node => renderNode(node))}
        </div>
      </div>
    </Card>
  );
} 