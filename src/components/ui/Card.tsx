import React from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Card({ title, subtitle, icon, className = '', children }: CardProps) {
  return (
    <div className={`w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-slideIn ${className}`}>
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            {icon}
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6 dark:text-gray-200">{children}</div>
    </div>
  );
} 