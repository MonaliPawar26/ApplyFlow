import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'warning' | 'success' | 'info' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  onClick,
}) => {
  // Animated number counter if numeric
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/,/g, ''), 10);
  const isNumber = !isNaN(numericValue);
  const [displayCount, setDisplayCount] = useState(isNumber ? 0 : value);

  useEffect(() => {
    if (!isNumber) {
      setDisplayCount(value);
      return;
    }

    let start = 0;
    const duration = 600;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = numericValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayCount(numericValue);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, isNumber, numericValue]);

  const variantAccent = {
    default: 'text-slate-900 dark:text-slate-100',
    warning: 'text-amber-600 dark:text-amber-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  const iconBg = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    info: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
  };

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h4 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${variantAccent[variant]}`}>
              {typeof displayCount === 'number' ? displayCount.toLocaleString() : displayCount}
            </h4>
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-semibold ${
                  trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ${iconBg[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
