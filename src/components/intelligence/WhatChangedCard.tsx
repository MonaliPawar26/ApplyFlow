import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownRight, Minus, FileText, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhatChangedCard: React.FC = () => {
  const { activeApplication } = useApp();

  if (!activeApplication) return null;

  // Derive changes from validation issues that have been resolved
  const resolvedIssues = activeApplication.validation?.issues?.filter((i) => i.status === 'resolved') || [];
  const activeIssues = activeApplication.validation?.issues?.filter((i) => i.status === 'active') || [];

  // Simulated before/after snapshots
  const changes = resolvedIssues.map((issue) => ({
    field: issue.field,
    title: issue.title,
    before: issue.currentValue || 'Missing',
    after: issue.correctionDraft || issue.expectedValue || issue.currentValue || 'Corrected',
    type: 'corrected' as const,
  }));

  // Add any pending issues as "still pending"
  const pending = activeIssues.map((issue) => ({
    field: issue.field,
    title: issue.title,
    before: issue.currentValue || 'N/A',
    after: issue.expectedValue || 'Needs correction',
    type: 'pending' as const,
  }));

  const allChanges = [...changes, ...pending];

  if (allChanges.length === 0) {
    return (
      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
          No Changes Detected
        </h4>
        <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-1">
          Application data has not been modified since initial submission.
        </p>
      </div>
    );
  }

  const correctedCount = changes.length;
  const pendingCount = pending.length;

  return (
    <div className="bg-white dark:bg-navy-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                What Changed
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Before vs. After diff summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {correctedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">
                {correctedCount} CORRECTED
              </span>
            )}
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                {pendingCount} PENDING
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Changes List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {allChanges.map((change, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-navy-900/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {change.type === 'corrected' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {change.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {change.field}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-rose-50/60 dark:bg-rose-950/30 rounded-lg border border-rose-200/60 dark:border-rose-900/40">
                <span className="text-[10px] text-rose-400 font-mono uppercase block mb-0.5">Before</span>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300 line-through decoration-rose-400/50">
                  {change.before}
                </span>
              </div>
              <div className={`p-2 rounded-lg border ${
                change.type === 'corrected'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40'
                  : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40'
              }`}>
                <span className={`text-[10px] font-mono uppercase block mb-0.5 ${
                  change.type === 'corrected' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {change.type === 'corrected' ? 'After' : 'Expected'}
                </span>
                <span className={`text-xs font-mono font-bold ${
                  change.type === 'corrected'
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {change.after}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
