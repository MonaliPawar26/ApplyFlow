import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  Layers,
  Award,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface RevalidationCheckStep {
  id: string;
  title: string;
  description: string;
  durationMs: number;
}

const CHECK_STEPS: RevalidationCheckStep[] = [
  {
    id: 'step_fields',
    title: 'Checking Required Form Fields',
    description: 'Validating presence of legal entity details and applicant contact metadata',
    durationMs: 400,
  },
  {
    id: 'step_docs',
    title: 'Checking Mandatory Documents & OCR Integrity',
    description: 'Verifying PAN Card, Address Proof, and National ID optical clarity (>85%)',
    durationMs: 450,
  },
  {
    id: 'step_format',
    title: 'Checking Format Checksums & Regex',
    description: 'Validating PAN format ABCDE1234F and E.164 phone 10-digit checksum',
    durationMs: 400,
  },
  {
    id: 'step_compare',
    title: 'Comparing Cross-Document Information',
    description: 'Running fuzzy string alignment: "Rahul K. Sharma" across PAN and premise bill',
    durationMs: 500,
  },
  {
    id: 'step_consistency',
    title: 'Running Compliance Consistency Engine',
    description: 'Evaluating MCA business registration criteria against live rule engine',
    durationMs: 400,
  },
  {
    id: 'step_final',
    title: 'Generating Automated Result & Categorization',
    description: 'Computing composite trust index and dispatching queue assignment',
    durationMs: 350,
  },
];

export const RevalidationModal: React.FC = () => {
  const {
    isRevalidationModalOpen,
    setRevalidationModalOpen,
    activeApplication,
    triggerRevalidation,
    setCurrentRoute,
    setCurrentRole,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRevalidationModalOpen) {
      setCurrentStepIndex(0);
      setIsCompleted(false);
      setIsRunning(false);
      return;
    }

    // Auto start execution sequence
    setIsRunning(true);
    let current = 0;

    const executeStep = () => {
      if (current < CHECK_STEPS.length) {
        setTimeout(() => {
          current += 1;
          setCurrentStepIndex(current);
          if (current >= CHECK_STEPS.length) {
            triggerRevalidation(activeApplication.id);
            setIsCompleted(true);
            setIsRunning(false);
          } else {
            executeStep();
          }
        }, CHECK_STEPS[current].durationMs);
      }
    };

    executeStep();
  }, [isRevalidationModalOpen, activeApplication.id, triggerRevalidation]);

  return (
    <Modal
      isOpen={isRevalidationModalOpen}
      onClose={() => setRevalidationModalOpen(false)}
      maxWidth="2xl"
      showCloseButton={!isRunning}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Automated Revalidation Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Running deep verification checks on {activeApplication.id}
            </p>
          </div>
        </div>
      }
    >
      <div className="py-2 space-y-6">
        {!isCompleted ? (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                Pipeline Progress ({Math.min(currentStepIndex, CHECK_STEPS.length)} of {CHECK_STEPS.length} stages)
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {Math.round((Math.min(currentStepIndex, CHECK_STEPS.length) / CHECK_STEPS.length) * 100)}%
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {CHECK_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isWaiting = idx > currentStepIndex;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all ${
                      isPassed
                        ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50'
                        : isCurrent
                        ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200/60 dark:bg-slate-800/30 dark:border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-bold ${
                            isPassed
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : isCurrent
                              ? 'text-blue-900 dark:text-blue-200'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        {isPassed && (
                          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ PASSED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                            SCANNING...
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Celebration Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300 dark:border-emerald-800/80 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-glow-green mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                100% Validation Passed
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Application Successfully Validated!
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                All 3 remediation items have been verified. Identity consistency, address proof OCR, and phone format checksums are 100% compliant.
              </p>

              {/* Categorization Callout */}
              <div className="mt-5 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-3 text-left shadow-subtle">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Automated Routing Assigned:
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Standard Processing Queue (MCA Compliance Fast-Track)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRevalidationModalOpen(false);
                  setCurrentRoute('validation_center');
                }}
              >
                View Validation Report
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setRevalidationModalOpen(false);
                  setCurrentRole('officer');
                  setCurrentRoute('officer_dashboard');
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
              >
                Switch to Officer Queue to Approve
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};
