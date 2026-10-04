import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  FileCheck,
  Building2,
  GraduationCap,
  Landmark,
  FileText,
} from 'lucide-react';
import { ApplicationData } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const ApplicationCard: React.FC<{ application: ApplicationData }> = ({ application }) => {
  const { navigateToApplication, setRevalidationModalOpen } = useApp();

  const getAppTypeIcon = (type: ApplicationData['type']) => {
    switch (type) {
      case 'business_registration':
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'scholarship':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'loan':
        return <Landmark className="w-4 h-4 text-amber-500" />;
      case 'general_service':
        return <FileText className="w-4 h-4 text-purple-500" />;
    }
  };

  const getAppTypeLabel = (type: ApplicationData['type']) => {
    switch (type) {
      case 'business_registration':
        return 'Business Registration';
      case 'scholarship':
        return 'Scholarship Grant';
      case 'loan':
        return 'Commercial SME Loan';
      case 'general_service':
        return 'Statutory License';
    }
  };

  const activeIssues = application.validation.issues.filter((i) => i.status === 'active');
  const hasIssues = activeIssues.length > 0 || application.status === 'correction_required';

  const formattedDate = new Date(application.submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 transition-all shadow-subtle hover:shadow-elevated ${
        hasIssues
          ? 'border-amber-200/90 dark:border-amber-900/60 bg-gradient-to-b from-amber-500/[0.02] to-transparent'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Top row: ID, Type, Status */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {application.id}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {getAppTypeIcon(application.type)}
              {getAppTypeLabel(application.type)}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {application.typeSpecificFields.businessName ||
              application.typeSpecificFields.courseName ||
              application.typeSpecificFields.serviceType ||
              application.applicantName}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={application.priority} />
          <StatusBadge status={application.status} />
        </div>
      </div>

      {/* Issues callout if correction required */}
      {hasIssues && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {activeIssues.length} issue{activeIssues.length === 1 ? '' : 's'} require applicant attention
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            Action Needed
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span>Validation Health</span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
            {application.validation.overallScore}% Score
          </span>
        </div>
        <ProgressBar
          progress={application.progress}
          variant={application.status === 'validated' ? 'success' : hasIssues ? 'warning' : 'brand'}
          size="sm"
        />
      </div>

      {/* Metadata footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Submitted {formattedDate}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {application.documents.length} Docs
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {hasIssues ? (
            <Button
              size="xs"
              variant="primary"
              onClick={() => navigateToApplication(application.id, 'correction_workspace')}
              leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
              className="bg-amber-600 hover:bg-amber-700 border-amber-600 text-white font-semibold"
            >
              Continue Correction
            </Button>
          ) : application.status === 'validated' ? (
            <Button
              size="xs"
              variant="outline"
              onClick={() => navigateToApplication(application.id, 'validation_center')}
              leftIcon={<FileCheck className="w-3.5 h-3.5 text-emerald-500" />}
            >
              View Validation Report
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              onClick={() => navigateToApplication(application.id, 'validation_center')}
              rightIcon={<ArrowRight className="w-3 h-3" />}
            >
              Track Status
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
