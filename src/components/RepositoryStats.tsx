import React from 'react';
import { Star, GitFork, AlertCircle, Scale, Clock, Info, ExternalLink } from 'lucide-react';
import type { Repository } from '../types';
import { Card } from './ui/Card';

interface RepositoryStatsProps {
  repository: Repository;
}

export function RepositoryStats({ repository }: RepositoryStatsProps) {
  return (
    <Card
      title="Repository Information"
      icon={<Info className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <a 
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 hover:text-blue-500 transition-colors"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {repository.name}
            </h3>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {repository.description || 'No description available'}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Primary Language: <span className="font-medium">{repository.language}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg transition-all hover:scale-105">
            <Star className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-white">{repository.stars}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Stars</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all hover:scale-105">
            <GitFork className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-white">{repository.forks}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Forks</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 rounded-lg transition-all hover:scale-105">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-white">{repository.issues}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Issues</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg transition-all hover:scale-105">
            <Scale className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">{repository.license || 'No License'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">License</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Clock className="w-4 h-4" />
        Last updated: {new Date(repository.lastUpdate).toLocaleDateString()}
      </div>
    </Card>
  );
} 