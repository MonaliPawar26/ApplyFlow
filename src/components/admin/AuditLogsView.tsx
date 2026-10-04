import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  User,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      (log.applicationId && log.applicationId.toLowerCase().includes(q));

    const matchCategory = selectedCategory === 'all' || log.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Compliance Audit Trail & System Logs
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              IMMUTABLE
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cryptographically timestamped record of every extraction, rule execution, and officer adjudication.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, or application ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus-ring"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'CORRECTION', 'VALIDATION', 'OCR', 'OFFICER', 'SUBMISSION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const time = new Date(log.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold">
                  {log.category}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    {log.applicationId && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {log.applicationId}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300 font-normal">
                    {log.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-slate-400 font-mono text-[11px]">
                <div className="text-right">
                  <span className="block text-slate-700 dark:text-slate-200 font-bold">
                    {log.user}
                  </span>
                  <span>IP: {log.ip}</span>
                </div>
                <span>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
