import React from 'react';
import { Clock, GitCommit, GitPullRequest, GitMerge, Calendar, AlertCircle } from 'lucide-react';
import type { Repository } from '../types';
import { Card } from './ui/Card';

interface RepositoryTimelineProps {
  repository: Repository;
}

interface TimelineEvent {
  type: 'commit' | 'pr' | 'issue' | 'release';
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

export function RepositoryTimeline({ repository }: RepositoryTimelineProps) {
  const [view, setView] = React.useState<'list' | 'calendar'>('list');

  // Generate mock timeline events based on repository data
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    const currentDate = new Date();
    const lastUpdate = new Date(repository.lastUpdate);
    
    // Add last update event
    events.push({
      type: 'commit',
      title: 'Repository Updated',
      description: 'Latest changes were made to the repository',
      date: lastUpdate.toLocaleDateString(),
      icon: <GitCommit className="w-4 h-4" />,
      color: 'bg-blue-500'
    });

    // Add mock PR event
    const prDate = new Date(lastUpdate);
    prDate.setDate(prDate.getDate() - 2);
    events.push({
      type: 'pr',
      title: 'Pull Request Merged',
      description: 'Feature implementation and bug fixes',
      date: prDate.toLocaleDateString(),
      icon: <GitMerge className="w-4 h-4" />,
      color: 'bg-purple-500'
    });

    // Add mock issue event
    if (repository.issues > 0) {
      const issueDate = new Date(lastUpdate);
      issueDate.setDate(issueDate.getDate() - 5);
      events.push({
        type: 'issue',
        title: 'New Issue Reported',
        description: `Issue #${repository.issues} was created`,
        date: issueDate.toLocaleDateString(),
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'bg-red-500'
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const events = generateTimelineEvents();

  const renderListView = () => (
    <div className="space-y-6">
      <div className="relative">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4 mb-8 relative">
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div className="absolute left-[17px] top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
            
            {/* Event dot */}
            <div className={`w-9 h-9 rounded-full ${event.color} flex items-center justify-center text-white shrink-0`}>
              {event.icon}
            </div>
            
            {/* Event content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 35 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (34 - i));
        const hasEvent = events.some(e => new Date(e.date).toDateString() === date.toDateString());
        
        return (
          <div
            key={i}
            className={`aspect-square rounded-sm ${
              hasEvent 
                ? 'bg-blue-500 dark:bg-blue-600' 
                : 'bg-gray-100 dark:bg-gray-700'
            } hover:opacity-75 transition-opacity cursor-pointer`}
            title={date.toLocaleDateString()}
          />
        );
      })}
    </div>
  );

  return (
    <Card
      title="Repository Timeline"
      icon={<Clock className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="space-y-6">
        {/* View toggle */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <GitCommit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'calendar'
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {view === 'list' ? renderListView() : renderCalendarView()}
      </div>
    </Card>
  );
} 