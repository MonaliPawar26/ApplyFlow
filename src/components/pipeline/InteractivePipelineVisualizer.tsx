import React from 'react';
import {
  FileText,
  Upload,
  Cpu,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Layers,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

interface StageInfo {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}

const STAGES: StageInfo[] = [
  {
    id: 'submitted',
    label: 'Submission',
    shortLabel: 'Submitted',
    icon: <FileText className="w-4 h-4" />,
    description: 'Application metadata and contact profile recorded.',
  },
  {
    id: 'documents',
    label: 'Doc Ingestion',
    shortLabel: 'Ingestion',
    icon: <Upload className="w-4 h-4" />,
    description: 'Cryptographic file intake and multi-format parsing.',
  },
  {
    id: 'ocr',
    label: 'Vision OCR',
    shortLabel: 'OCR Extract',
    icon: <Cpu className="w-4 h-4" />,
    description: 'High-precision optical character recognition & field mapping.',
  },
  {
    id: 'validation',
    label: 'Rule Engine',
    shortLabel: 'Validation',
    icon: <ShieldCheck className="w-4 h-4" />,
    description: 'Cross-document consistency and format checksums.',
  },
  {
    id: 'correction',
    label: 'Correction Workspace',
    shortLabel: 'Correction',
    icon: <AlertCircle className="w-4 h-4" />,
    description: 'AI-assisted remediation for missing or mismatched data.',
  },
  {
    id: 'revalidation',
    label: 'Revalidation',
    shortLabel: 'Revalidated',
    icon: <RefreshCw className="w-4 h-4" />,
    description: 'Automated 6-stage compliance verification.',
  },
  {
    id: 'categorized',
    label: 'Categorization',
    shortLabel: 'Categorized',
    icon: <Layers className="w-4 h-4" />,
    description: 'Automated routing to Standard or Expedited queue.',
  },
  {
    id: 'processing',
    label: 'Officer Adjudication',
    shortLabel: 'Officer Review',
    icon: <UserCheck className="w-4 h-4" />,
    description: 'Officer inspection and final digital certification.',
  },
  {
    id: 'completed',
    label: 'Completion',
    shortLabel: 'Completed',
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: 'Application certified & applicant notified.',
  },
];

export const InteractivePipelineVisualizer: React.FC<{
  currentStatus: ApplicationStatus;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}> = ({ currentStatus, onSelectStage, className = '' }) => {
  // Map current application status to step index
  const getActiveStepIndex = (status: ApplicationStatus): number => {
    switch (status) {
      case 'draft':
      case 'submitted':
        return 0;
      case 'processing':
        return 2;
      case 'validating':
        return 3;
      case 'correction_required':
        return 4;
      case 'validated':
        return 5;
      case 'categorized':
        return 6;
      case 'manual_review':
        return 7;
      case 'completed':
        return 8;
      default:
        return 4;
    }
  };

  const activeIndex = getActiveStepIndex(currentStatus);

  return (
    <div className={`w-full overflow-x-auto py-2 ${className}`}>
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;

          let stepStyle = 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-500';
          let lineStyle = 'bg-slate-200 dark:bg-slate-800';

          if (isDone) {
            stepStyle = 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800 shadow-sm';
            lineStyle = 'bg-emerald-500';
          } else if (isCurrent) {
            if (stage.id === 'correction' || currentStatus === 'correction_required') {
              stepStyle = 'bg-amber-500 text-white border-amber-500 shadow-glow-amber ring-4 ring-amber-500/20 animate-pulse-subtle';
            } else {
              stepStyle = 'bg-blue-600 text-white border-blue-600 shadow-glow-blue ring-4 ring-blue-500/20';
            }
          }

          return (
            <React.Fragment key={stage.id}>
              {/* Node */}
              <div
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                className={`flex flex-col items-center group cursor-pointer text-center select-none transition-all flex-1 min-w-[70px]`}
                title={`${stage.label}: ${stage.description}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${stepStyle}`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : stage.icon}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-semibold tracking-tight truncate max-w-[80px] ${
                    isCurrent
                      ? 'text-slate-900 dark:text-white font-bold'
                      : isDone
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {stage.shortLabel}
                </span>
                <span className="text-[9px] text-slate-400 hidden sm:block">
                  {isDone ? 'Completed' : isCurrent ? 'Active Stage' : 'Queued'}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STAGES.length - 1 && (
                <div className={`h-[2px] flex-1 min-w-[16px] rounded-full transition-colors ${lineStyle}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
