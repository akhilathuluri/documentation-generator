import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/Button';
import { ApiKeyManager } from './ApiKeyManager';
import { SearchHistory } from './SearchHistory';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (window.location.search) {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      const cleanUrl = url.trim().replace(/\/$/, '').split('?')[0];
      onSubmit(cleanUrl);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
            className="w-full px-4 py-3 pr-36 text-gray-800 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <SearchHistory onSelect={(selectedUrl) => {
              setUrl(selectedUrl);
              onSubmit(selectedUrl);
            }} />
            <ApiKeyManager />
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              icon={<Search className="w-4 h-4" />}
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
}