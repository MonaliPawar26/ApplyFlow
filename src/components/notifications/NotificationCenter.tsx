import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateToApplication,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notification Center
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              DISPATCH
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time automated alerts regarding document validation, correction requirements, and officer approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={markAllNotificationsRead}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              markNotificationRead(item.id);
              if (item.applicationId) {
                navigateToApplication(item.applicationId, item.actionUrl as any || 'validation_center');
              }
            }}
            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
              !item.isRead
                ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  item.type === 'correction_required'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : item.type === 'validated'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }`}
              >
                {item.type === 'correction_required' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : item.type === 'validated' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.message}
                </p>
                <span className="mt-2 block text-[11px] text-slate-400 font-mono">
                  {item.timestamp}
                </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
