import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, HelpCircle, Loader2, Users, Timer, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhyWaitingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyWaitingDrawer: React.FC<WhyWaitingDrawerProps> = ({ isOpen, onClose }) => {
  const { activeApplication, applications } = useApp();

  if (!activeApplication) return null;

  const queuePosition = activeApplication.queuePosition || 4;
  const totalInQueue = applications.filter(
    (a) => a.status === 'processing' || a.status === 'validating' || a.status === 'submitted'
  ).length;

  // Simulated queue insights
  const slaDeadline = new Date(activeApplication.slaDeadline);
  const now = new Date();
  const slaRemainingMs = Math.max(0, slaDeadline.getTime() - now.getTime());
  const slaHours = Math.floor(slaRemainingMs / (1000 * 60 * 60));
  const slaMinutes = Math.floor((slaRemainingMs % (1000 * 60 * 60)) / (1000 * 60));

  const statusToStepLabel: Record<string, string> = {
    submitted: 'Queue Intake & Prioritization',
    processing: 'Document Ingestion & OCR',
    validating: 'Rule Engine Validation',
    correction_required: 'Applicant Correction Review',
    revalidating: 'Revalidation Pipeline',
    categorized: 'Automatic Categorization',
    manual_review: 'Officer Adjudication',
    validated: 'Final Certification',
    completed: 'Processing Complete',
  };

  const nextStep = statusToStepLabel[activeApplication.status] || 'Processing';

  const queueItems = [
    {
      label: 'Queue Position',
      value: `#${queuePosition}`,
      detail: `of ${totalInQueue} applications in active pipeline`,
      icon: <Users className="w-4 h-4 text-blue-500" />,
    },
    {
      label: 'Current Stage',
      value: nextStep,
      detail: `Status: ${activeApplication.status.replace('_', ' ')}`,
      icon: <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />,
    },
    {
      label: 'Estimated Next Step',
      value: activeApplication.status === 'correction_required' ? 'Revalidation' : 'Categorization',
      detail: 'Deterministic routing based on validation score',
      icon: <ArrowRight className="w-4 h-4 text-emerald-500" />,
    },
    {
      label: 'SLA Remaining',
      value: `${String(slaHours).padStart(2, '0')}h ${String(slaMinutes).padStart(2, '0')}m`,
      detail: `Deadline: ${activeApplication.slaDeadline}`,
      icon: <Timer className="w-4 h-4 text-amber-500" />,
    },
  ];

  const reasons = [
    activeApplication.status === 'correction_required' &&
      'Your application has validation discrepancies that need correction before it can advance.',
    activeApplication.status === 'submitted' &&
      'Your application is in the ingestion queue awaiting document OCR processing.',
    activeApplication.status === 'processing' &&
      'Documents are being read by the Vision OCR engine. This typically takes 30–90 seconds.',
    activeApplication.status === 'validating' &&
      'The rule engine is evaluating your data against regulatory compliance checks.',
    activeApplication.status === 'manual_review' &&
      'An officer has been assigned and will review your application during business hours.',
    queuePosition > 5 && `There are ${queuePosition - 1} applications ahead of yours in the processing queue.`,
    'All applications are processed in strict FIFO order within their priority tier.',
  ].filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-[420px] max-w-[90vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Why Am I Waiting?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent queue intelligence for {activeApplication.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Queue KPIs */}
              <div className="grid grid-cols-2 gap-3">
                {queueItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-3 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.icon}
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-sm font-mono font-extrabold text-slate-900 dark:text-white">
                      {item.value}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.detail}</p>
                  </motion.div>
                ))}
              </div>

              {/* Pipeline Progress */}
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-800/60">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Processing Pipeline Status
                  </span>
                </div>

                {/* Mini pipeline */}
                <div className="flex items-center gap-1">
                  {['Intake', 'OCR', 'Validate', 'Correct', 'Route', 'Complete'].map((step, idx) => {
                    const statusOrder = ['submitted', 'processing', 'validating', 'correction_required', 'categorized', 'completed'];
                    const currentIdx = statusOrder.indexOf(activeApplication.status);
                    const isPast = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <React.Fragment key={step}>
                        <div
                          className={`flex-1 h-2 rounded-full transition-all ${
                            isPast
                              ? 'bg-emerald-500'
                              : isCurrent
                              ? 'bg-blue-500 animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] font-mono text-slate-400">
                  {['Intake', 'OCR', 'Validate', 'Correct', 'Route', 'Done'].map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Explanatory Reasons */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Detailed Explanation
                </h4>
                {reasons.map((reason, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.06 }}
                    className="flex items-start gap-2.5 p-2.5 bg-white dark:bg-navy-800 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-navy-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{idx + 1}</span>
                    </div>
                    <span>{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
