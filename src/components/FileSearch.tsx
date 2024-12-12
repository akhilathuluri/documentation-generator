import React, { useState, useEffect } from 'react';
import { Search, X, Filter, SortAsc } from 'lucide-react';
import { Button } from './ui/Button';

interface FileSearchProps {
  onSearch: (query: string) => void;
}

export function FileSearch({ onSearch }: FileSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('file_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);

    // Save to recent searches
    if (value.trim()) {
      const updated = [value, ...recentSearches.filter(s => s !== value)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('file_searches', JSON.stringify(updated));
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative group animate-slideIn">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search files..."
            className="w-full px-4 py-2 pr-20 text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                icon={<X className="w-4 h-4" />}
                title="Clear search"
              />
            )}
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          icon={<Filter className="w-4 h-4" />}
          title="Show filters"
        />
        <Button
          variant="secondary"
          size="sm"
          icon={<SortAsc className="w-4 h-4" />}
          title="Sort files"
        />
      </div>

      {/* Recent Searches Dropdown */}
      {recentSearches.length > 0 && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 animate-scaleIn">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent Searches</div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                onClick={() => {
                  setQuery(search);
                  onSearch(search);
                }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 animate-scaleIn">
          <div className="p-4 space-y-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded text-blue-500" />
                Only show files
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded text-blue-500" />
                Only show directories
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded text-blue-500" />
                Match case
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 