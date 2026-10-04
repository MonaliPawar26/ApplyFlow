import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  glow?: 'none' | 'blue' | 'green' | 'amber';
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  className = '',
  glow = 'none',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const glowClasses = {
    none: '',
    blue: 'shadow-glow-blue border-blue-300 dark:border-blue-800',
    green: 'shadow-glow-green border-emerald-300 dark:border-emerald-800',
    amber: 'shadow-glow-amber border-amber-300 dark:border-amber-800',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-xl shadow-subtle ${
        hover ? 'transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5' : ''
      } ${paddingClasses[padding]} ${glowClasses[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
