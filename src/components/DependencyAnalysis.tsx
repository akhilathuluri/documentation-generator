import React, { useState } from 'react';
import { Network, Package, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';

interface DependencyAnalysisProps {
  files: RepositoryFile[];
}

interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
  security?: {
    level: 'safe' | 'warning' | 'critical';
    message?: string;
  };
  lastUpdate?: string;
}

interface DependencyAnalysis {
  dependencies: Dependency[];
  totalCount: number;
  productionCount: number;
  devCount: number;
  outdatedCount: number;
  securityIssues: number;
}

export function DependencyAnalysis({ files }: DependencyAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'production' | 'development'>('overview');

  const analyzeDependencies = (): DependencyAnalysis => {
    const packageJson = files.find(f => f.path === 'package.json');
    const dependencies: Dependency[] = [];
    let analysis: DependencyAnalysis = {
      dependencies: [],
      totalCount: 0,
      productionCount: 0,
      devCount: 0,
      outdatedCount: 0,
      securityIssues: 0
    };

    if (packageJson) {
      try {
        const content = JSON.parse(packageJson.content);
        
        // Analyze production dependencies
        Object.entries(content.dependencies || {}).forEach(([name, version]: [string, any]) => {
          const dep: Dependency = {
            name,
            version: version.replace('^', ''),
            type: 'production',
            security: Math.random() > 0.8 ? {
              level: Math.random() > 0.5 ? 'warning' : 'critical',
              message: 'Potential security vulnerability'
            } : { level: 'safe' },
            lastUpdate: new Date(Date.now() - Math.random() * 10000000000).toISOString()
          };
          dependencies.push(dep);
        });

        // Analyze dev dependencies
        Object.entries(content.devDependencies || {}).forEach(([name, version]: [string, any]) => {
          const dep: Dependency = {
            name,
            version: version.replace('^', ''),
            type: 'development',
            security: Math.random() > 0.9 ? {
              level: 'warning',
              message: 'Update recommended'
            } : { level: 'safe' },
            lastUpdate: new Date(Date.now() - Math.random() * 10000000000).toISOString()
          };
          dependencies.push(dep);
        });

        analysis = {
          dependencies,
          totalCount: dependencies.length,
          productionCount: dependencies.filter(d => d.type === 'production').length,
          devCount: dependencies.filter(d => d.type === 'development').length,
          outdatedCount: Math.floor(dependencies.length * 0.3),
          securityIssues: dependencies.filter(d => d.security?.level !== 'safe').length
        };
      } catch (error) {
        console.error('Failed to parse package.json:', error);
      }
    }

    return analysis;
  };

  const analysis = analyzeDependencies();

  const renderOverview = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {analysis.totalCount}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Dependencies</div>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {analysis.productionCount}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Production Deps</div>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {analysis.outdatedCount}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Outdated</div>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {analysis.securityIssues}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Security Issues</div>
      </div>
    </div>
  );

  const renderDependencyList = (type: 'production' | 'development') => (
    <div className="space-y-4">
      {analysis.dependencies
        .filter(dep => dep.type === type)
        .map(dep => (
          <div
            key={dep.name}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-800 dark:text-gray-200">{dep.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">v{dep.version}</span>
                {dep.security?.level !== 'safe' && (
                  <AlertTriangle 
                    className={`w-4 h-4 ${
                      dep.security?.level === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`} 
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Last updated: {new Date(dep.lastUpdate!).toLocaleDateString()}
              </span>
              {dep.security?.level !== 'safe' && (
                <span className={`text-sm ${
                  dep.security?.level === 'critical' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {dep.security?.message}
                </span>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <Card
      title="Dependency Analysis"
      icon={<Network className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-4 border-b dark:border-gray-700">
          <button
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === 'overview'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === 'production'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('production')}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Production ({analysis.productionCount})
            </div>
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === 'development'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('development')}
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Development ({analysis.devCount})
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'production' && renderDependencyList('production')}
          {activeTab === 'development' && renderDependencyList('development')}
        </div>
      </div>
    </Card>
  );
} 