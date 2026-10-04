import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Zap,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';

interface ApplicationStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationStoryModal: React.FC<ApplicationStoryModalProps> = ({ isOpen, onClose }) => {
  const { activeApplication, timeline } = useApp();

  if (!activeApplication) return null;

  const app = activeApplication;
  const score = app.validation?.overallScore || 0;
  const issueCount = app.validation?.issues?.filter((i) => i.status === 'active').length || 0;
  const resolvedCount = app.validation?.issues?.filter((i) => i.status === 'resolved').length || 0;
  const docCount = app.documents?.length || 0;

  // Build narrative paragraphs
  const paragraphs: { icon: React.ReactNode; color: string; text: string }[] = [
    {
      icon: <FileText className="w-4 h-4" />,
      color: 'text-blue-600 dark:text-blue-400',
      text: `On ${app.submittedAt}, ${app.applicantName} submitted a ${app.type.replace('_', ' ')} application (${app.id}) through the ApplyFlow submission wizard. The application included ${docCount} supporting document${docCount !== 1 ? 's' : ''} and was assigned ${app.priority} priority.`,
    },
    {
      icon: <Zap className="w-4 h-4" />,
      color: 'text-cyan-600 dark:text-cyan-400',
      text: `The Vision OCR engine processed all ${docCount} documents, extracting key-value pairs with an average confidence of ${
        Math.round(app.documents.reduce((sum, d) => sum + d.ocrConfidence, 0) / Math.max(1, docCount))
      }%. Bounding box coordinates were mapped to source scan regions for visual traceability.`,
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      text: `The deterministic rule engine evaluated ${12} regulatory compliance assertions against the extracted data. ${
        issueCount + resolvedCount > 0
          ? `${issueCount + resolvedCount} discrepanc${issueCount + resolvedCount === 1 ? 'y was' : 'ies were'} detected across identity matching, format validation, and cross-document consistency checks.`
          : 'All assertions passed without discrepancies.'
      }`,
    },
  ];

  if (resolvedCount > 0) {
    paragraphs.push({
      icon: <RefreshCw className="w-4 h-4" />,
      color: 'text-purple-600 dark:text-purple-400',
      text: `The applicant addressed ${resolvedCount} issue${resolvedCount !== 1 ? 's' : ''} through the Correction Workspace, updating form values to match document OCR extractions. Each correction triggered incremental health score recalculation.`,
    });
  }

  if (issueCount > 0) {
    paragraphs.push({
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'text-amber-600 dark:text-amber-400',
      text: `Currently, ${issueCount} issue${issueCount !== 1 ? 's remain' : ' remains'} unresolved. The application is awaiting applicant action in the Correction Workspace before it can proceed to revalidation and categorization.`,
    });
  }

  if (score >= 90) {
    paragraphs.push({
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      text: `With a health score of ${score}/100, this application has met or exceeded all compliance thresholds and has been cleared for ${app.status === 'completed' ? 'final certification' : 'automatic categorization and officer adjudication'}.`,
    });
  }

  // Story summary
  const storySummary = app.storySummary || `${app.applicantName}'s ${app.type.replace('_', ' ')} application is ${
    score >= 90 ? 'fully validated and ready for processing' :
    issueCount > 0 ? 'awaiting corrections before it can advance' :
    'currently being processed through the validation pipeline'
  }.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="3xl">
      <div className="space-y-5 -mt-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Application Story
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-generated natural language narrative for {app.id}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            NARRATIVE ENGINE
          </span>
        </div>

        {/* Summary Card */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-navy-900/50 dark:to-blue-950/20 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] text-slate-400 font-mono uppercase">Executive Summary</span>
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {storySummary}
          </p>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Submitted {app.submittedAt}
            </span>
            <span className="font-mono font-bold">Score: {score}/100</span>
            <span>{issueCount} active issues</span>
          </div>
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Detailed Narrative
          </h3>

          {paragraphs.map((para, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-3 p-3.5 bg-white dark:bg-navy-800/70 rounded-xl border border-slate-200/60 dark:border-slate-800"
            >
              <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-navy-900 flex-shrink-0 ${para.color}`}>
                {para.icon}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {para.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline snapshot */}
        {timeline.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Key Events
            </h3>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {timeline.slice(0, 8).map((evt, idx) => (
                <div
                  key={evt.id}
                  className="flex items-center gap-3 p-2 bg-slate-50/50 dark:bg-navy-900/30 rounded-lg text-xs"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    evt.severity === 'error' ? 'bg-rose-500' :
                    evt.severity === 'warning' ? 'bg-amber-500' :
                    evt.severity === 'success' ? 'bg-emerald-500' : 'bg-blue-400'
                  }`} />
                  <span className="font-mono text-[10px] text-slate-400 w-16 flex-shrink-0">
                    {evt.timestamp}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {evt.title}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Generated by ApplyFlow Narrative Engine v1.2
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
