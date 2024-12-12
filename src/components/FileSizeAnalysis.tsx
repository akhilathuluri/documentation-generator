import React from 'react';
import { BarChart, FileText } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';

interface FileSizeAnalysisProps {
  files: RepositoryFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function FileSizeAnalysis({ files }: FileSizeAnalysisProps) {
  const fileSizes = files
    .filter(f => f.type === 'file')
    .map(f => ({
      path: f.path,
      size: new Blob([f.content]).size
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  const maxSize = Math.max(...fileSizes.map(f => f.size));

  return (
    <Card
      title="Largest Files"
      subtitle="Top 5 files by size"
      icon={<BarChart className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="space-y-4">
        {fileSizes.map(({ path, size }) => (
          <div key={path} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-gray-700 truncate" title={path}>
                  {path}
                </span>
              </div>
              <span className="text-gray-500 font-medium">{formatFileSize(size)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(size / maxSize) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 