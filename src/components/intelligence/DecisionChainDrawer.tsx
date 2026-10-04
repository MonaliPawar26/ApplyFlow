import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  ScanSearch,
  GitCompareArrows,
  ClipboardCheck,
  Scale,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  Cpu,
} from 'lucide-react';
import { ValidationIssue, DecisionChainStep } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface DecisionChainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issue: ValidationIssue | null;
}

interface ChainStepData {
  stepNumber: number;
  label: string;
  tag: string;
  value: string;
  details?: string;
  status: 'pass' | 'fail' | 'warning' | 'neutral';
  icon: React.ReactNode;
}

const stepStatusColors: Record<string, { border: string; bg: string; dot: string; text: string; tagBg: string; tagText: string }> = {
  pass: {
    border: 'border-emerald-500/40 dark:border-emerald-500/30',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    tagBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    tagText: 'text-emerald-700 dark:text-emerald-300',
  },
  fail: {
    border: 'border-rose-500/40 dark:border-rose-500/30',
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    tagBg: 'bg-rose-100 dark:bg-rose-900/40',
    tagText: 'text-rose-700 dark:text-rose-300',
  },
  warning: {
    border: 'border-amber-500/40 dark:border-amber-500/30',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    tagBg: 'bg-amber-100 dark:bg-amber-900/40',
    tagText: 'text-amber-700 dark:text-amber-300',
  },
  neutral: {
    border: 'border-blue-500/40 dark:border-blue-500/30',
    bg: 'bg-blue-50/40 dark:bg-blue-950/20',
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    tagBg: 'bg-blue-100 dark:bg-blue-900/40',
    tagText: 'text-blue-700 dark:text-blue-300',
  },
};

function buildMockChain(issue: ValidationIssue): ChainStepData[] {
  const isFail = issue.severity === 'error';
  const isWarning = issue.severity === 'warning';
  const resultStatus = isFail ? 'fail' : isWarning ? 'warning' : 'pass';

  const docName = issue.affectedDocument || issue.aiExplanation.affectedDocument || 'Submitted Document';
  const extractedValue = issue.currentValue || 'Extracted value';
  const expectedValue = issue.expectedValue || 'Expected value';
  const ruleId = issue.aiExplanation.ruleId || 'R-001';
  const recommendation = issue.aiExplanation.recommendedChange || issue.aiExplanation.suggestedCorrection || 'Review and correct the flagged field';

  return [
    {
      stepNumber: 1,
      label: 'SOURCE',
      tag: 'Document Analyzed',
      value: docName,
      details: 'Input document fed into the OCR vision pipeline',
      status: 'neutral',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      stepNumber: 2,
      label: 'EXTRACTED VALUE',
      tag: 'OCR Output',
      value: extractedValue,
      details: 'Value extracted via optical character recognition tensor',
      status: 'neutral',
      icon: <ScanSearch className="w-3.5 h-3.5" />,
    },
    {
      stepNumber: 3,
      label: 'COMPARED AGAINST',
      tag: 'Cross-Reference',
      value: `Application field: ${issue.field}`,
      details: 'Cross-document consistency check against submitted form data',
      status: 'neutral',
      icon: <GitCompareArrows className="w-3.5 h-3.5" />,
    },
    {
      stepNumber: 4,
      label: 'APPLICATION VALUE',
      tag: 'Form Data',
      value: expectedValue,
      details: 'Value declared by applicant in the submission form',
      status: resultStatus === 'pass' ? 'pass' : 'neutral',
      icon: <ClipboardCheck className="w-3.5 h-3.5" />,
    },
    {
      stepNumber: 5,
      label: 'RULE',
      tag: 'Rule Triggered',
      value: `${ruleId}: ${issue.title}`,
      details: issue.aiExplanation.detectedIssue,
      status: resultStatus === 'pass' ? 'pass' : 'warning',
      icon: <Scale className="w-3.5 h-3.5" />,
    },
    {
      stepNumber: 6,
      label: 'RESULT',
      tag: issue.severity === 'error' ? 'FAILED' : issue.severity === 'warning' ? 'WARNING' : 'PASSED',
      value: `${issue.severity.toUpperCase()} — ${issue.status === 'resolved' ? 'Resolved' : 'Requires Attention'}`,
      details: issue.aiExplanation.whyNeedsAttention,
      status: resultStatus,
      icon: resultStatus === 'fail' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      stepNumber: 7,
      label: 'ACTION',
      tag: 'Recommended',
      value: recommendation,
      details: issue.aiExplanation.suggestedCorrection
        ? `Suggested: "${issue.aiExplanation.suggestedCorrection}"`
        : undefined,
      status: resultStatus === 'pass' ? 'pass' : 'warning',
      icon: <Lightbulb className="w-3.5 h-3.5" />,
    },
  ];
}

function buildFromDecisionChain(chain: NonNullable<ValidationIssue['aiExplanation']['decisionChain']>, issue: ValidationIssue): ChainStepData[] {
  const stepIconMap: Record<string, React.ReactNode> = {
    source: <FileText className="w-3.5 h-3.5" />,
    extracted: <ScanSearch className="w-3.5 h-3.5" />,
    compared: <GitCompareArrows className="w-3.5 h-3.5" />,
    rule: <Scale className="w-3.5 h-3.5" />,
    result: <CheckCircle2 className="w-3.5 h-3.5" />,
    action: <Lightbulb className="w-3.5 h-3.5" />,
  };

  const tagMap: Record<string, string> = {
    source: 'Document Analyzed',
    extracted: 'OCR Output',
    compared: 'Cross-Reference',
    rule: 'Rule Triggered',
    result: issue.severity === 'error' ? 'FAILED' : issue.severity === 'warning' ? 'WARNING' : 'PASSED',
    action: 'Recommended',
  };

  return chain.steps.map((step: DecisionChainStep) => ({
    stepNumber: step.stepNumber,
    label: step.label,
    tag: tagMap[step.type] || step.label,
    value: step.value,
    details: step.details,
    status: step.status || 'neutral',
    icon: stepIconMap[step.type] || <Cpu className="w-3.5 h-3.5" />,
  }));
}

const severityBadgeVariant: Record<string, 'error' | 'warning' | 'success'> = {
  error: 'error',
  warning: 'warning',
  success: 'success',
};

export const DecisionChainDrawer: React.FC<DecisionChainDrawerProps> = ({
  isOpen,
  onClose,
  issue,
}) => {
  const { setCurrentRoute } = useApp();

  const chainSteps = useMemo<ChainStepData[]>(() => {
    if (!issue) return [];
    if (issue.aiExplanation.decisionChain?.steps?.length) {
      return buildFromDecisionChain(issue.aiExplanation.decisionChain, issue);
    }
    return buildMockChain(issue);
  }, [issue]);

  const handleOpenCorrectionStudio = () => {
    onClose();
    setCurrentRoute('correction_workspace');
  };

  return (
    <AnimatePresence>
      {isOpen && issue && (
        <>
          {/* Backdrop */}
          <motion.div
            key="decision-chain-backdrop"
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            key="decision-chain-drawer"
            className="fixed right-0 inset-y-0 z-[71] w-[460px] max-w-[95vw] flex flex-col
              bg-white dark:bg-[#090D16] border-l border-slate-200 dark:border-slate-800
              shadow-2xl shadow-black/10 dark:shadow-black/40"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                      Decision Chain Trace
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                    {issue.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={severityBadgeVariant[issue.severity] || 'default'}
                      size="sm"
                    >
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500">
                      {issue.id}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-500 capitalize">
                      {issue.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 dark:text-slate-600
                    hover:text-slate-600 dark:hover:text-slate-300
                    hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chain Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="relative">
                {chainSteps.map((step, index) => {
                  const colors = stepStatusColors[step.status] || stepStatusColors.neutral;
                  const isLast = index === chainSteps.length - 1;

                  return (
                    <motion.div
                      key={step.stepNumber}
                      className="relative flex gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
                    >
                      {/* Vertical connector line + dot */}
                      <div className="flex flex-col items-center flex-shrink-0 w-6">
                        {/* Dot */}
                        <div
                          className={`w-3 h-3 rounded-full ${colors.dot} ring-2 ring-white dark:ring-[#090D16]
                            flex-shrink-0 mt-3 z-10 shadow-sm shadow-current/20`}
                        />
                        {/* Vertical line */}
                        {!isLast && (
                          <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 min-h-[16px]" />
                        )}
                      </div>

                      {/* Step card */}
                      <div
                        className={`flex-1 mb-3 rounded-xl border ${colors.border} ${colors.bg}
                          p-3.5 transition-all duration-200 hover:shadow-sm`}
                      >
                        {/* Step header row */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`${colors.text}`}>
                              {step.icon}
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
                              {step.label}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded
                              ${colors.tagBg} ${colors.tagText}`}
                          >
                            {step.tag}
                          </span>
                        </div>

                        {/* Step value */}
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                          {step.value}
                        </p>

                        {/* Step details */}
                        {step.details && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1 leading-relaxed">
                            {step.details}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* AI Explanation summary card */}
              {issue.aiExplanation.whyNeedsAttention && (
                <motion.div
                  className="mt-2 rounded-xl border border-slate-200 dark:border-slate-800
                    bg-slate-50/80 dark:bg-slate-900/40 p-3.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: chainSteps.length * 0.06 + 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Cpu className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                      AI Analysis
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {issue.aiExplanation.whyNeedsAttention}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 px-5 py-4">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={handleOpenCorrectionStudio}
                className="w-full"
              >
                Open Correction Studio
              </Button>
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 mt-2">
                Navigate to the Correction Workspace to resolve this issue
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DecisionChainDrawer;
