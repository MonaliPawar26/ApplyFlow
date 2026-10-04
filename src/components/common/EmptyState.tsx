import React from 'react';
import { Button } from './Button';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FolderOpen className="w-10 h-10 text-slate-400" />,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 ${className}`}
    >
      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-subtle border border-slate-200 dark:border-slate-700/80 mb-4">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
