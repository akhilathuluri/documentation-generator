import React from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';

interface LanguageStats {
  [key: string]: {
    count: number;
    color: string;
    bytes: number;
  };
}

const languageColors: { [key: string]: string } = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  html: '#e34c26',
  css: '#563d7c',
  json: '#292929',
  markdown: '#083fa1',
  python: '#3572A5',
  java: '#b07219',
  ruby: '#701516',
  php: '#4F5D95',
  go: '#00ADD8',
  rust: '#dea584',
  cpp: '#f34b7d',
  c: '#555555',
  csharp: '#178600',
  swift: '#ffac45',
  kotlin: '#F18E33',
  vue: '#41b883',
  react: '#61dafb',
  scss: '#c6538c',
  less: '#1d365d',
  yaml: '#cb171e',
  xml: '#0060ac',
  sql: '#e38c00',
  shell: '#89e051',
  powershell: '#012456',
  perl: '#0298c3',
  lua: '#000080',
  r: '#198ce7',
  dart: '#00B4AB',
  elixir: '#6e4a7e',
};

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'py':
      return 'python';
    case 'rb':
      return 'ruby';
    case 'php':
      return 'php';
    case 'go':
      return 'go';
    case 'rs':
      return 'rust';
    case 'cpp':
    case 'cc':
    case 'cxx':
      return 'cpp';
    case 'c':
      return 'c';
    case 'cs':
      return 'csharp';
    case 'swift':
      return 'swift';
    case 'kt':
      return 'kotlin';
    case 'vue':
      return 'vue';
    case 'scss':
      return 'scss';
    case 'less':
      return 'less';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'shell';
    case 'ps1':
      return 'powershell';
    case 'pl':
      return 'perl';
    case 'lua':
      return 'lua';
    case 'r':
      return 'r';
    case 'dart':
      return 'dart';
    case 'ex':
    case 'exs':
      return 'elixir';
    default:
      return ext;
  }
}

interface LanguageStatsProps {
  files: RepositoryFile[];
}

export function LanguageStats({ files }: LanguageStatsProps) {
  const [showBySize, setShowBySize] = React.useState(false);

  const stats = files.reduce((acc: LanguageStats, file) => {
    if (file.type === 'file') {
      const lang = getFileExtension(file.path);
      if (lang) {
        if (!acc[lang]) {
          acc[lang] = {
            count: 0,
            bytes: 0,
            color: languageColors[lang] || '#808080'
          };
        }
        acc[lang].count++;
        acc[lang].bytes += new Blob([file.content]).size;
      }
    }
    return acc;
  }, {});

  const totalCount = Object.values(stats).reduce((sum, { count }) => sum + count, 0);
  const totalBytes = Object.values(stats).reduce((sum, { bytes }) => sum + bytes, 0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <Card
      title="Language Distribution"
      icon={showBySize ? <PieChart className="w-5 h-5 text-blue-500" /> : <BarChart2 className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowBySize(!showBySize)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Show by {showBySize ? 'count' : 'size'}
        </button>
      </div>

      <div className="h-4 w-full rounded-full overflow-hidden flex mb-6 shadow-inner bg-gray-100 dark:bg-gray-800">
        {Object.entries(stats)
          .sort((a, b) => (showBySize ? b[1].bytes - a[1].bytes : b[1].count - a[1].count))
          .map(([lang, { count, bytes, color }]) => (
            <div
              key={lang}
              style={{
                backgroundColor: color,
                width: `${(showBySize ? bytes / totalBytes : count / totalCount) * 100}%`
              }}
              className="h-full transition-all duration-300 hover:opacity-80"
              title={`${lang}: ${count} files (${showBySize ? formatBytes(bytes) : ((count / totalCount) * 100).toFixed(1) + '%'})`}
            />
          ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(stats)
          .sort((a, b) => (showBySize ? b[1].bytes - a[1].bytes : b[1].count - a[1].count))
          .map(([lang, { count, bytes, color }]) => (
            <div key={lang} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
              <div
                className="w-3 h-3 rounded-full group-hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700 dark:text-gray-300 capitalize truncate">
                  {lang}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {count} {count === 1 ? 'file' : 'files'} • {formatBytes(bytes)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
} 