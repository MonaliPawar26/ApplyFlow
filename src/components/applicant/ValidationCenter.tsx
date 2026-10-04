import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Shield,
  HelpCircle,
  ExternalLink,
  Layers,
  RotateCcw,
  Clock,
  UserCheck,
  Network,
  History,
  Award,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge, ScoreBadge } from '../common/Badge';
import { HealthScoreCard } from '../common/HealthScoreCard';
import { SlaTimerBadge } from '../common/SlaTimerBadge';
import { ValidationIssue } from '../../types';
import { ApplicationDna } from '../intelligence/ApplicationDna';

export const ValidationCenter: React.FC = () => {
  const {
    activeApplication,
    navigateToApplication,
    setRevalidationModalOpen,
    setSelectedDocumentForInspection,
    setManualReviewModalApp,
    setAuditReplayOpen,
    setSelectedIssueForChain,
    setXRayModalOpen,
    setTimeMachineOpen,
    setPassportModalOpen,
    setCurrentRole,
    setCurrentRoute,
  } = useApp();

  const [expandedIssueId, setExpandedIssueId] = useState<string | null>('issue_missing_address');

  const { validation, status, id, priorityReason, slaDeadline } = activeApplication;
  const isValidated = status === 'validated' || status === 'completed';
  const activeIssues = validation.issues.filter((i) => i.status === 'active');
  const resolvedIssues = validation.issues.filter((i) => i.status === 'resolved');

  const toggleIssue = (issueId: string) => {
    setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {id}
            </span>
            <StatusBadge status={status} size="lg" />
            <SlaTimerBadge deadline={slaDeadline} priorityReason={priorityReason} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Automated Application Validation Center
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time optical extraction, cross-document checksums, and compliance rules.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setXRayModalOpen(true)}
            leftIcon={<Eye className="w-4 h-4 text-blue-500" />}
          >
            7-Layer X-Ray
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeMachineOpen(true)}
            leftIcon={<Clock className="w-4 h-4 text-indigo-500" />}
          >
            Time Machine
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPassportModalOpen(true)}
            leftIcon={<Award className="w-4 h-4 text-purple-500" />}
          >
            Passport
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRoute('validation_graph')}
            leftIcon={<Network className="w-4 h-4 text-purple-500" />}
          >
            Validation Graph
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuditReplayOpen(true)}
            leftIcon={<History className="w-4 h-4 text-cyan-500" />}
          >
            Replay History
          </Button>

          {!isValidated ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateToApplication(id, 'correction_workspace')}
                leftIcon={<AlertTriangle className="w-4 h-4" />}
                className="bg-amber-600 hover:bg-amber-700 border-amber-600 text-white font-semibold shadow-sm"
              >
                Open Correction Workspace ({activeIssues.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCurrentRole('officer');
                  setCurrentRoute('officer_dashboard');
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
              >
                Officer Adjudication Queue
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Top Validation Score & Category Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Dynamic Health Score Breakdown Card (md:col-span-5) */}
        <div className="md:col-span-5">
          <HealthScoreCard health={validation.healthBreakdown} />
        </div>

        {/* 4 Category Status Pills (md:col-span-7) */}
        <div className="md:col-span-7 grid grid-cols-2 gap-3">
          {/* Identity */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Identity Registry</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">✓ Verified</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PAN & UID active</p>
            </div>
          </div>

          {/* Application Data */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                isValidated
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                  : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
              }`}
            >
              {isValidated ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Application Data</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isValidated ? '✓ Verified' : '⚠ Attention'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isValidated ? 'All fields valid' : 'Phone checksum invalid'}
              </p>
            </div>
          </div>

          {/* Documents */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                isValidated
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                  : 'bg-rose-50 dark:bg-rose-950 text-rose-600'
              }`}
            >
              {isValidated ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Mandatory Documents</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isValidated ? '✓ Verified (3/3)' : '✗ Missing Proof'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isValidated ? 'Address proof verified' : 'Address proof failed OCR'}
              </p>
            </div>
          </div>

          {/* Consistency */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                isValidated
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                  : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
              }`}
            >
              {isValidated ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Cross-Consistency</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isValidated ? '✓ 100% Match' : '⚠ 1 Mismatch'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isValidated ? 'Name aligned' : 'Middle initial omitted'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Validation Diagnostic Report
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {validation.issues.length} Diagnostic Checks
            </span>
          </div>

          <span className="text-xs text-slate-400">
            Click any item to inspect AI-assisted explanation
          </span>
        </div>

        {/* Passed checks summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                PAN Format & Checksum
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">✓ ABCDE1234F Verified</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Identity Document Integrity
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">✓ 97% Optical OCR Confidence</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Date of Birth Match
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">✓ 15/08/2002 (Age: 24)</p>
            </div>
          </div>
        </div>

        {/* 6-Axis Application DNA Biometric Integrity Fingerprint */}
        <ApplicationDna application={activeApplication} />

        {/* Active and Resolved Issue Cards */}
        <div className="space-y-3 pt-2">
          {validation.issues.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                All Validation Rules Passed!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                No active discrepancies found. The application is verified and ready for officer approval.
              </p>
            </div>
          ) : (
            validation.issues.map((issue) => {
              const isExpanded = expandedIssueId === issue.id;
              const isResolved = issue.status === 'resolved';

              return (
                <div
                  key={issue.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isResolved
                      ? 'bg-slate-50/60 dark:bg-slate-900/40 border-emerald-200 dark:border-emerald-900/60'
                      : issue.severity === 'error'
                      ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/60 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 shadow-sm'
                  }`}
                >
                  {/* Issue Header */}
                  <div
                    onClick={() => toggleIssue(issue.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : issue.severity === 'error'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {isResolved ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : issue.severity === 'error' ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : issue.severity === 'error'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {isResolved ? 'Resolved' : issue.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            [{issue.category.toUpperCase()}]
                          </span>
                        </div>
                        <h4 className="mt-1 text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                          {issue.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isResolved ? (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Ready for revalidation
                        </span>
                      ) : (
                        <span className="hidden sm:inline-flex text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                          Correction Required
                        </span>
                      )}
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded AI Explanation Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-5 sm:p-6 space-y-4"
                      >
                        {/* AI Explanation Box */}
                        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>WHY THIS WAS FLAGGED (AI-ASSISTED EXPLANATION)</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                            {issue.aiExplanation.whyNeedsAttention}
                          </p>
                        </div>

                        {/* Side by side diff context */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                              Current Application Value
                            </span>
                            <p className="mt-1 font-mono font-bold text-rose-700 dark:text-rose-400">
                              {issue.currentValue || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">
                              Expected / Suggested Value
                            </span>
                            <p className="mt-1 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              {issue.expectedValue || issue.aiExplanation.suggestedCorrection || 'Valid Document Scan'}
                            </p>
                          </div>
                        </div>

                        {/* What applicant needs to change */}
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">
                            Recommended Action
                          </span>
                          <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium">
                            {issue.aiExplanation.recommendedChange}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setManualReviewModalApp(activeApplication);
                              }}
                              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                            >
                              Request Officer Manual Review
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedIssueForChain(issue)}
                              leftIcon={<Network className="w-3.5 h-3.5 text-blue-500" />}
                            >
                              Decision Chain
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => navigateToApplication(id, 'correction_workspace')}
                              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Fix in Correction Workspace
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
