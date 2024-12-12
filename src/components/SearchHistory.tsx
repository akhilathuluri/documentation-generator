import React from 'react';
import { History, X } from 'lucide-react';
import { Button } from './ui/Button';

interface SearchHistoryProps {
  onSelect: (url: string) => void;
}

export function SearchHistory({ onSelect }: SearchHistoryProps) {
  const [history, setHistory] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('search_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (url: string) => {
    const newHistory = [url, ...history.filter(item => item !== url)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const removeFromHistory = (url: string) => {
    const newHistory = history.filter(item => item !== url);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('search_history');
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        icon={<History className="w-4 h-4" />}
        title="Search History"
      />
      
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Clear All
              </Button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">No recent searches</p>
          ) : (
            <div className="space-y-1">
              {history.map((url) => (
                <div
                  key={url}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <button
                    className="text-sm text-gray-700 truncate flex-1 text-left"
                    onClick={() => onSelect(url)}
                  >
                    {url}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromHistory(url)}
                    icon={<X className="w-4 h-4" />}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 