import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Code, GitBranch, FileCode } from 'lucide-react';
import type { RepositoryFile } from '../types';
import { Card } from './ui/Card';

interface CodeQualityAnalysisProps {
  files: RepositoryFile[];
}

interface QualityMetrics {
  score: number;
  issues: string[];
  suggestions: string[];
  bestPractices: string[];
}

export function CodeQualityAnalysis({ files }: CodeQualityAnalysisProps) {
  const analyzeCodeQuality = (): QualityMetrics => {
    const metrics: QualityMetrics = {
      score: 0,
      issues: [],
      suggestions: [],
      bestPractices: []
    };

    let totalScore = 0;
    let checks = 0;

    // Check for configuration files
    const hasConfig = files.some(f => 
      f.path.includes('config') || 
      f.path.endsWith('.json') || 
      f.path.endsWith('.yml') ||
      f.path.endsWith('.yaml')
    );
    if (hasConfig) {
      totalScore += 10;
      metrics.bestPractices.push('✓ Configuration files present');
    } else {
      metrics.suggestions.push('Consider adding configuration files');
    }

    // Check for testing
    const hasTests = files.some(f => 
      f.path.includes('test') || 
      f.path.includes('spec') || 
      f.path.includes('__tests__')
    );
    if (hasTests) {
      totalScore += 15;
      metrics.bestPractices.push('✓ Test files present');
    } else {
      metrics.issues.push('No test files found');
    }

    // Check for documentation
    const hasDocs = files.some(f => 
      f.path.toLowerCase().includes('readme') || 
      f.path.toLowerCase().includes('docs/')
    );
    if (hasDocs) {
      totalScore += 10;
      metrics.bestPractices.push('✓ Documentation present');
    } else {
      metrics.suggestions.push('Add documentation files');
    }

    // Check for code organization
    const hasGoodStructure = files.some(f => 
      f.path.includes('src/') || 
      f.path.includes('lib/') || 
      f.path.includes('components/')
    );
    if (hasGoodStructure) {
      totalScore += 10;
      metrics.bestPractices.push('✓ Good code organization');
    } else {
      metrics.suggestions.push('Consider organizing code into directories');
    }

    // Check for type definitions
    const hasTypes = files.some(f => 
      f.path.endsWith('.d.ts') || 
      f.path.includes('types/')
    );
    if (hasTypes) {
      totalScore += 10;
      metrics.bestPractices.push('✓ Type definitions present');
    } else {
      metrics.suggestions.push('Consider adding type definitions');
    }

    // Check file size
    const largeSrcFiles = files.filter(f => 
      f.type === 'file' && 
      f.content.length > 500 && 
      !f.path.includes('vendor/') &&
      !f.path.includes('dist/')
    );
    if (largeSrcFiles.length > 0) {
      metrics.issues.push(`${largeSrcFiles.length} large source files found`);
    } else {
      totalScore += 10;
      metrics.bestPractices.push('✓ Good file size management');
    }

    // Calculate final score
    metrics.score = Math.round((totalScore / 65) * 100);

    return metrics;
  };

  const metrics = analyzeCodeQuality();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  return (
    <Card
      title="Code Quality Analysis"
      icon={<Code className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="space-y-6">
        {/* Score Section */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            {getScoreIcon(metrics.score)}
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quality Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.score)}`}>
                {metrics.score}%
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Issues</div>
              <div className="text-xl font-semibold text-red-500">
                {metrics.issues.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Best Practices</div>
              <div className="text-xl font-semibold text-green-500">
                {metrics.bestPractices.length}
              </div>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Best Practices */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Best Practices
            </h3>
            <div className="space-y-1">
              {metrics.bestPractices.map((practice, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {practice}
                </div>
              ))}
            </div>
          </div>

          {/* Issues & Suggestions */}
          <div className="space-y-4">
            {metrics.issues.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Issues
                </h3>
                <div className="space-y-1">
                  {metrics.issues.map((issue, index) => (
                    <div key={index} className="text-sm text-red-600 dark:text-red-400">
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {metrics.suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Suggestions
                </h3>
                <div className="space-y-1">
                  {metrics.suggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-yellow-600 dark:text-yellow-400">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 