import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Cpu,
  ShieldCheck,
  FileCheck2,
  User,
  Sparkles,
} from 'lucide-react';
import { TimelineEvent } from '../../types';

export const TimelineView: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'submitted':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'document_processed':
        return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'ocr_completed':
        return <Cpu className="w-4 h-4 text-emerald-500" />;
      case 'validation_started':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'issue_detected':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'correction_requested':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'correction_submitted':
        return <FileCheck2 className="w-4 h-4 text-emerald-500" />;
      case 'revalidated':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventDotStyle = (severity: TimelineEvent['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-emerald-500 ring-4 ring-emerald-500/20 text-white';
      case 'warning':
        return 'bg-amber-500 ring-4 ring-amber-500/20 text-white';
      case 'error':
        return 'bg-rose-500 ring-4 ring-rose-500/20 text-white';
      default:
        return 'bg-blue-600 ring-4 ring-blue-500/20 text-white';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {events.map((evt, idx) => {
        const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
            className="relative"
          >
            {/* Dot */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-sm ${getEventDotStyle(
                evt.severity
              )}`}
            >
              {getEventIcon(evt.type)}
            </div>

            {/* Event Body */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-subtle hover:shadow-sm transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{timeStr}</span>
                </div>
              </div>

              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {evt.actor.name}
                </span>
                <span>•</span>
                <span>{evt.actor.role}</span>
                {evt.actor.isAi && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[9px] flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> AI Automated
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
