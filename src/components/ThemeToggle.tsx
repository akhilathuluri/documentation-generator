import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      icon={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    />
  );
} 