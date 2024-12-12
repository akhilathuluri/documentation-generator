import React, { useState } from 'react';
import { PieChart, BarChart2, GitBranch, Activity, Calendar, Users } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';

interface RepositoryInsightsProps {
  files: RepositoryFile[];
}

interface FilePattern {
  type: string;
  count: number;
  description: string;
}

interface CodeComplexity {
  category: string;
  score: number;
  details: string[];
}

export function RepositoryInsights({ files }: RepositoryInsightsProps) {
  const [activeTab, setActiveTab] = useState<'patterns' | 'complexity' | 'architecture'>('patterns');

  const analyzePatterns = (): FilePattern[] => {
    const patterns: FilePattern[] = [];

    // Analyze testing patterns
    const testFiles = files.filter(f => 
      f.path.includes('test') || 
      f.path.includes('spec') || 
      f.path.includes('__tests__')
    );
    patterns.push({
      type: 'Testing',
      count: testFiles.length,
      description: `${testFiles.length} test files found`
    });

    // Analyze component patterns
    const componentFiles = files.filter(f => 
      f.path.includes('component') || 
      f.path.includes('components')
    );
    patterns.push({
      type: 'Components',
      count: componentFiles.length,
      description: `${componentFiles.length} component files identified`
    });

    // Analyze utility patterns
    const utilFiles = files.filter(f => 
      f.path.includes('util') || 
      f.path.includes('utils') ||
      f.path.includes('helpers')
    );
    patterns.push({
      type: 'Utilities',
      count: utilFiles.length,
      description: `${utilFiles.length} utility files found`
    });

    // Analyze service patterns
    const serviceFiles = files.filter(f => 
      f.path.includes('service') || 
      f.path.includes('api') ||
      f.path.includes('client')
    );
    patterns.push({
      type: 'Services',
      count: serviceFiles.length,
      description: `${serviceFiles.length} service files identified`
    });

    return patterns;
  };

  const analyzeComplexity = (): CodeComplexity[] => {
    const metrics: CodeComplexity[] = [];

    // Analyze file size complexity
    const largeFiles = files.filter(f => f.content.length > 500).length;
    metrics.push({
      category: 'File Size',
      score: Math.max(0, 100 - (largeFiles * 10)),
      details: [
        `${largeFiles} large files found`,
        largeFiles > 5 ? 'Consider splitting large files' : 'Good file size management'
      ]
    });

    // Analyze code organization
    const hasGoodStructure = files.some(f => 
      f.path.includes('src/') || 
      f.path.includes('lib/') || 
      f.path.includes('components/')
    );
    metrics.push({
      category: 'Organization',
      score: hasGoodStructure ? 90 : 60,
      details: [
        hasGoodStructure ? '✓ Well-organized code structure' : '! Consider better code organization',
        hasGoodStructure ? 'Good directory structure' : 'Improve directory hierarchy'
      ]
    });

    // Analyze documentation
    const hasDocs = files.some(f => 
      f.path.toLowerCase().includes('readme') || 
      f.path.toLowerCase().includes('docs/')
    );
    metrics.push({
      category: 'Documentation',
      score: hasDocs ? 85 : 50,
      details: [
        hasDocs ? '✓ Documentation present' : '! Missing documentation',
        hasDocs ? 'Good documentation coverage' : 'Add more documentation'
      ]
    });

    return metrics;
  };

  const renderPatterns = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {analyzePatterns().map(pattern => (
          <div 
            key={pattern.type}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-bold text-blue-500">{pattern.count}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{pattern.type}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{pattern.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComplexity = () => (
    <div className="space-y-6">
      {analyzeComplexity().map(metric => (
        <div key={metric.category} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {metric.category}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {metric.score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                metric.score >= 80 ? 'bg-green-500' :
                metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metric.score}%` }}
            />
          </div>
          <div className="space-y-1">
            {metric.details.map((detail, index) => (
              <div 
                key={index}
                className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
              >
                {detail.startsWith('✓') ? (
                  <span className="text-green-500">•</span>
                ) : detail.startsWith('!') ? (
                  <span className="text-red-500">•</span>
                ) : null}
                {detail.replace(/^[✓!] /, '')}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card
      title="Repository Insights"
      icon={<Activity className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-4 border-b dark:border-gray-700">
          <button
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === 'patterns'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('patterns')}
          >
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Code Patterns
            </div>
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === 'complexity'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('complexity')}
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Code Complexity
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {activeTab === 'patterns' && renderPatterns()}
          {activeTab === 'complexity' && renderComplexity()}
        </div>
      </div>
    </Card>
  );
} 