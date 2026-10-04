import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface TimeMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeStop {
  index: number;
  time: string;
  label: string;
  description: string;
  status: string;
  score: number;
  issuesCount: number;
  icon: React.ReactNode;
  color: string;
  dna: { completeness: number; consistency: number; confidence: number; validation: number; complexity: number; slaHealth: number };
  diff?: { field: string; before: string; after: string };
}

const TIME_STOPS: TimeStop[] = [
  {
    index: 0,
    time: '10:32:14',
    label: 'Application Submitted',
    description: 'Applicant completed the 5-step submission wizard and uploaded 3 supporting documents. Application entered the processing queue at position #4.',
    status: 'submitted',
    score: 100,
    issuesCount: 0,
    icon: <FileText className="w-5 h-5" />,
    color: 'blue',
    dna: { completeness: 100, consistency: 100, confidence: 100, validation: 100, complexity: 78, slaHealth: 100 },
  },
  {
    index: 1,
    time: '10:33:02',
    label: 'OCR Processing Complete',
    description: 'Vision OCR engine ingested 3 documents, extracting 14 key-value pairs with avg. 94.2% confidence. Bounding box coordinates mapped to source scans.',
    status: 'processing',
    score: 100,
    issuesCount: 0,
    icon: <Zap className="w-5 h-5" />,
    color: 'cyan',
    dna: { completeness: 100, consistency: 100, confidence: 94, validation: 100, complexity: 78, slaHealth: 98 },
  },
  {
    index: 2,
    time: '10:34:18',
    label: 'Validation Complete — Issues Found',
    description: 'Rule engine evaluated 12 deterministic assertions. 3 discrepancies detected: name mismatch across PAN card, DOB format inconsistency, and low OCR confidence on address proof.',
    status: 'correction_required',
    score: 64,
    issuesCount: 3,
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'amber',
    dna: { completeness: 100, consistency: 68, confidence: 94, validation: 48, complexity: 78, slaHealth: 92 },
    diff: { field: 'Validation Score', before: '100 / 100', after: '64 / 100 (3 issues)' },
  },
  {
    index: 3,
    time: '10:41:33',
    label: 'Corrections Applied',
    description: 'Applicant corrected 2 of 3 issues in the Correction Workspace. Name field updated to match PAN card OCR extraction. DOB format standardized. Address confidence still below threshold.',
    status: 'correction_required',
    score: 88,
    issuesCount: 1,
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'purple',
    dna: { completeness: 100, consistency: 92, confidence: 94, validation: 82, complexity: 78, slaHealth: 85 },
    diff: { field: 'Active Issues', before: '3 issues', after: '1 issue remaining' },
  },
  {
    index: 4,
    time: '10:42:07',
    label: 'Revalidated — Near Perfect',
    description: 'Revalidation pipeline re-evaluated all 12 rules. Score improved from 88 to 98. Final remaining issue auto-acknowledged by officer review waiver. Application cleared for categorization.',
    status: 'validated',
    score: 98,
    issuesCount: 0,
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'emerald',
    dna: { completeness: 100, consistency: 98, confidence: 96, validation: 98, complexity: 78, slaHealth: 82 },
    diff: { field: 'Health Score', before: '88 / 100', after: '98 / 100 — CLEARED' },
  },
];

export const TimeMachineModal: React.FC<TimeMachineModalProps> = ({ isOpen, onClose }) => {
  const { activeApplication } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = TIME_STOPS[currentStep];

  // Auto-play through steps
  React.useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= TIME_STOPS.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, TIME_STOPS.length - 1));
    }, 2200);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-500',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800',
      dot: 'bg-cyan-500',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      dot: 'bg-purple-500',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    },
  };

  const clr = colorMap[stop.color] || colorMap.blue;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getBarColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-500';
    if (val >= 75) return 'bg-blue-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="4xl">
      <div className="space-y-5 -mt-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Time Machine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scrub through the lifecycle of {activeApplication?.id || 'APP-1024'} in real time
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${clr.bg} ${clr.text} ${clr.border} border`}>
            T {stop.time}
          </span>
        </div>

        {/* Snapshot Card (morphs per step) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className={`p-5 rounded-2xl border ${clr.border} ${clr.bg}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Left info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${clr.text}`}>
                    {stop.icon}
                  </div>
                  <h3 className={`text-base font-bold ${clr.text}`}>
                    {stop.label}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {stop.description}
                </p>

                {/* Status & Issues */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300 uppercase">
                    {stop.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500">
                    {stop.issuesCount === 0
                      ? 'No active issues'
                      : `${stop.issuesCount} issue${stop.issuesCount > 1 ? 's' : ''} detected`}
                  </span>
                </div>
              </div>

              {/* Right: Score & DNA */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="text-center">
                  <div className={`text-3xl font-mono font-black ${getScoreColor(stop.score)}`}>
                    {stop.score}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">/100 HEALTH</div>
                </div>

                {/* Mini DNA bars */}
                <div className="grid grid-cols-3 gap-1.5 w-36">
                  {Object.entries(stop.dna).map(([key, val]) => (
                    <div key={key} className="space-y-0.5">
                      <div className="text-[9px] text-slate-400 font-mono truncate capitalize">
                        {key === 'slaHealth' ? 'SLA' : key.slice(0, 5)}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-navy-900 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getBarColor(val)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline Scrubber */}
        <div className="space-y-3">
          {/* Step indicators */}
          <div className="flex items-center justify-between px-1">
            {TIME_STOPS.map((ts, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              const tsClr = colorMap[ts.color] || colorMap.blue;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    isActive
                      ? `${tsClr.dot} border-white dark:border-slate-900 ring-4 ring-offset-0 ring-${ts.color}-200 dark:ring-${ts.color}-900/40`
                      : isPast
                      ? `${tsClr.dot} border-white/80 dark:border-slate-800`
                      : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'
                  }`} />
                  <span className={`text-[10px] font-mono ${
                    isActive ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}>
                    {ts.time}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-slate-100 dark:bg-navy-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
              animate={{ width: `${(currentStep / (TIME_STOPS.length - 1)) * 100}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            />
          </div>

          {/* Transport controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700 disabled:opacity-30 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (currentStep >= TIME_STOPS.length - 1) {
                  setCurrentStep(0);
                }
                setIsPlaying(!isPlaying);
              }}
              className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(TIME_STOPS.length - 1, prev + 1))}
              disabled={currentStep === TIME_STOPS.length - 1}
              className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700 disabled:opacity-30 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* What Changed Diff */}
        {stop.diff && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-slate-50 dark:bg-navy-900/60 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <div className="text-[11px] text-slate-400 font-mono uppercase mb-2">
              What Changed at This Step
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-rose-50/60 dark:bg-rose-950/30 rounded-lg border border-rose-200/60 dark:border-rose-900/40">
                <span className="text-[10px] text-rose-400 font-mono">BEFORE</span>
                <div className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300 mt-1">
                  {stop.diff.before}
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-[10px] text-emerald-400 font-mono">AFTER</span>
                <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {stop.diff.after}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};
