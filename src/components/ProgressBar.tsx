import React from 'react';
import { Loader } from 'lucide-react';
import { Card } from './ui/Card';

interface ProgressBarProps {
  progress: number;
  status: string;
}

export function ProgressBar({ progress, status }: ProgressBarProps) {
  return (
    <Card
      title="Progress"
      icon={<Loader className="w-5 h-5 text-blue-500 animate-spin" />}
      className="animate-slideIn"
    >
      <div className="space-y-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{status}</span>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
} 