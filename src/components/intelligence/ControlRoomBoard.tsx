import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import {
  Inbox,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Layers,
  CheckCircle2,
  Search,
  Activity,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';
import { ApplicationData, ApplicationStatus } from '../../types';
import { ScoreBadge } from '../common/Badge';

interface ColumnConfig {
  id: string;
  label: string;
  statuses: ApplicationStatus[];
  color: string;
  bgLight: string;
  bgDark: string;
  icon: React.ReactNode;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    statuses: ['submitted', 'draft'],
    color: 'border-blue-500',
    bgLight: 'bg-blue-50/40',
    bgDark: 'dark:bg-blue-950/20',
    icon: <Inbox className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'processing',
    label: 'Processing',
    statuses: ['processing'],
    color: 'border-purple-500',
    bgLight: 'bg-purple-50/40',
    bgDark: 'dark:bg-purple-950/20',
    icon: <Cpu className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'validation',
    label: 'Validation',
    statuses: ['validating'],
    color: 'border-indigo-500',
    bgLight: 'bg-indigo-50/40',
    bgDark: 'dark:bg-indigo-950/20',
    icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'correction',
    label: 'Correction',
    statuses: ['correction_required'],
    color: 'border-amber-500',
    bgLight: 'bg-amber-50/40',
    bgDark: 'dark:bg-amber-950/20',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'revalidation',
    label: 'Revalidation',
    statuses: ['revalidating'],
    color: 'border-cyan-500',
    bgLight: 'bg-cyan-50/40',
    bgDark: 'dark:bg-cyan-950/20',
    icon: <RefreshCw className="w-4 h-4 text-cyan-500" />,
  },
  {
    id: 'categorization',
    label: 'Categorization',
    statuses: ['categorized', 'manual_review'],
    color: 'border-emerald-500',
    bgLight: 'bg-emerald-50/40',
    bgDark: 'dark:bg-emerald-950/20',
    icon: <Layers className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'complete',
    label: 'Complete',
    statuses: ['completed', 'validated', 'rejected'],
    color: 'border-emerald-600',
    bgLight: 'bg-emerald-50/40',
    bgDark: 'dark:bg-emerald-950/20',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
];

const getPriorityDotColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-rose-500';
    case 'high': return 'bg-amber-500';
    case 'normal': return 'bg-blue-400';
    default: return 'bg-slate-300';
  }
};

export const ControlRoomBoard: React.FC = () => {
  const { applications, navigateToApplication } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) return applications;
    const term = searchTerm.toLowerCase();
    return applications.filter(
      (a) =>
        a.id.toLowerCase().includes(term) ||
        a.applicantName.toLowerCase().includes(term)
    );
  }, [applications, searchTerm]);

  const columnData = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      apps: filteredApps.filter((app) => col.statuses.includes(app.status)),
    }));
  }, [filteredApps]);

  const totalActive = applications.filter((a) => a.status !== 'completed' && a.status !== 'rejected').length;

  return (
    <div className="p-6 space-y-5 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Processing Control Room
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time application flow across all processing stages •{' '}
              <span className="font-mono font-bold">{totalActive}</span> active
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 -mx-1">
        <div className="flex gap-3 min-w-max px-1">
          {columnData.map((col) => (
            <div
              key={col.id}
              className={`w-[220px] flex-shrink-0 rounded-2xl border-t-3 ${col.color} bg-white dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden`}
              style={{ borderTopWidth: '3px' }}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400">
                    {col.apps.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="p-2 space-y-2 min-h-[200px] max-h-[520px] overflow-y-auto">
                {col.apps.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
                    No applications
                  </div>
                ) : (
                  col.apps.map((app, idx) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => navigateToApplication(app.id)}
                      className={`p-2.5 rounded-xl border bg-white dark:bg-navy-800 border-slate-200/70 dark:border-slate-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all group`}
                    >
                      {/* App ID & Priority */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">
                          {app.id}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getPriorityDotColor(app.priority)}`} />
                      </div>

                      {/* Name */}
                      <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate flex items-center gap-1.5 mb-1.5">
                        <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        {app.applicantName}
                      </div>

                      {/* Score & SLA */}
                      <div className="flex items-center justify-between">
                        <ScoreBadge score={app.validation?.overallScore || 0} />
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3" />
                          {app.queuePosition ? `#${app.queuePosition}` : '--'}
                        </div>
                      </div>

                      {/* Hover arrow */}
                      <div className="flex justify-end mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3 h-3 text-blue-500" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
