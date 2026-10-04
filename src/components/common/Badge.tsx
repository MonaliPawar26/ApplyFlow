import React from 'react';
import { ApplicationStatus, ApplicationPriority, ProcessingCategory, ValidationSeverity } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  Layers, 
  UserCheck, 
  XCircle, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60',
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  };

  const dotColors = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ApplicationStatus; size?: 'sm' | 'md' | 'lg' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'draft':
      return (
        <Badge variant="neutral" size={size} dot>
          <Clock className="w-3 h-3 text-slate-500" />
          Draft
        </Badge>
      );
    case 'submitted':
      return (
        <Badge variant="info" size={size} dot>
          <Clock className="w-3 h-3 text-blue-500" />
          Submitted
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="info" size={size} dot>
          <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
          Processing
        </Badge>
      );
    case 'validating':
      return (
        <Badge variant="purple" size={size} dot>
          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
          Validating
        </Badge>
      );
    case 'correction_required':
      return (
        <Badge variant="warning" size={size} dot className="font-semibold shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Correction Required
        </Badge>
      );
    case 'validated':
      return (
        <Badge variant="success" size={size} dot className="font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Validated
        </Badge>
      );
    case 'categorized':
      return (
        <Badge variant="info" size={size} dot>
          <Layers className="w-3 h-3 text-blue-500" />
          Categorized
        </Badge>
      );
    case 'manual_review':
      return (
        <Badge variant="purple" size={size} dot>
          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
          Manual Review
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="success" size={size} dot>
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
          Completed
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="error" size={size} dot>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Action Needed
        </Badge>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: ApplicationPriority }> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <Badge variant="error" size="sm">
          <ShieldAlert className="w-3 h-3 text-rose-500" />
          Urgent
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="warning" size="sm">
          High
        </Badge>
      );
    case 'normal':
      return (
        <Badge variant="neutral" size="sm">
          Normal
        </Badge>
      );
    case 'low':
      return (
        <Badge variant="neutral" size="sm">
          Low
        </Badge>
      );
  }
};

export const CategoryBadge: React.FC<{ category: ProcessingCategory }> = ({ category }) => {
  switch (category) {
    case 'expedited':
      return <Badge variant="success" size="sm">⚡ Expedited</Badge>;
    case 'standard':
      return <Badge variant="info" size="sm">Standard Processing</Badge>;
    case 'priority':
      return <Badge variant="purple" size="sm">Priority Track</Badge>;
    case 'manual_escalation':
      return <Badge variant="warning" size="sm">Manual Escalation</Badge>;
    case 'pending_verification':
      return <Badge variant="neutral" size="sm">Pending Verification</Badge>;
  }
};

export const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  if (score >= 90) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono">
        {score}%
      </span>
    );
  }
  if (score >= 75) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono">
        {score}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-mono">
      {score}%
    </span>
  );
};
