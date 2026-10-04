import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'success' | 'warning' | 'auto';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  variant = 'auto',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  let colorClass = 'bg-blue-600';
  if (variant === 'success' || (variant === 'auto' && clamped === 100)) {
    colorClass = 'bg-emerald-500';
  } else if (variant === 'warning' || (variant === 'auto' && clamped < 75)) {
    colorClass = 'bg-amber-500';
  } else if (variant === 'brand') {
    colorClass = 'bg-blue-600';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Completion</span>
          <span className="font-mono">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
};
