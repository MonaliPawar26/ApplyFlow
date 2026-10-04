import React, { useState } from 'react';
import {
  FileText,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Sparkles,
  Eye,
  FileCheck2,
  XCircle,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge, PriorityBadge, CategoryBadge, ScoreBadge } from '../common/Badge';
import { TimelineView } from '../applicant/TimelineView';

export const ApplicationReviewDetail: React.FC = () => {
  const {
    activeApplication,
    setCurrentRoute,
    updateApplicationOfficerDecision,
    setSelectedDocumentForInspection,
    setManualReviewModalApp,
    timeline,
    auditLogs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'validation' | 'timeline' | 'audit'>('overview');
  const [officerNotesInput, setOfficerNotesInput] = useState<string>(activeApplication.officerNotes || '');
  const [isProcessingDecision, setIsProcessingDecision] = useState(false);

  const appTimeline = timeline.filter((t) => t.applicationId === activeApplication.id);
  const appAudit = auditLogs.filter((a) => a.applicationId === activeApplication.id);

  const handleDecision = (decision: 'approve' | 'request_correction' | 'manual_review') => {
    setIsProcessingDecision(true);
    setTimeout(() => {
      updateApplicationOfficerDecision(activeApplication.id, decision, officerNotesInput);
      setIsProcessingDecision(false);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setCurrentRoute('officer_dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Operations Queue
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Assigned Officer:</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {activeApplication.assignedOfficer || 'Elena Rostova'}
          </span>
        </div>
      </div>

      {/* Application Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              {activeApplication.id}
            </span>
            <StatusBadge status={activeApplication.status} size="lg" />
            <CategoryBadge category={activeApplication.category} />
            <PriorityBadge priority={activeApplication.priority} />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            {activeApplication.typeSpecificFields.businessName || activeApplication.applicantName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Applicant: <strong className="text-slate-700 dark:text-slate-200">{activeApplication.applicantName}</strong> ({activeApplication.applicantEmail}) • Contact: {activeApplication.applicantPhone}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Trust Score</span>
            <div className="mt-0.5">
              <ScoreBadge score={activeApplication.validation.overallScore} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Content Tabs (lg:col-span-8), Right Decision Drawer (lg:col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {[
              { id: 'overview', label: 'Applicant Information' },
              { id: 'documents', label: `Documents (${activeApplication.documents.length})` },
              { id: 'validation', label: 'Validation Diagnostic' },
              { id: 'timeline', label: 'Audit Timeline' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Applicant & Entity Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400">Full Legal Name</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {activeApplication.applicantName}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400">Contact Phone</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {activeApplication.applicantPhone}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400">Date of Birth</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {activeApplication.applicantDob}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400">Registered Address</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {activeApplication.applicantAddress}, {activeApplication.applicantCity}, {activeApplication.applicantState} {activeApplication.applicantPostalCode}
                  </p>
                </div>
              </div>

              {/* Dynamic Type Specific Details */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                  Category Attributes
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(activeApplication.typeSpecificFields).map(([k, v]) => (
                    <div key={k} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                      <span className="text-[10px] text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{String(v)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {activeApplication.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-subtle"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {doc.fileName} • {doc.fileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">
                      {doc.ocrConfidence}% OCR
                    </span>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setSelectedDocumentForInspection(doc)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect Optical OCR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VALIDATION */}
          {activeTab === 'validation' && (
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rule Engine Evaluation Log
              </h3>
              <div className="space-y-2 text-xs">
                {activeApplication.validation.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-300 font-medium">
                    ✓ All checks passed. 100% compliance met.
                  </div>
                ) : (
                  activeApplication.validation.issues.map((i) => (
                    <div
                      key={i.id}
                      className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1"
                    >
                      <p className="font-bold text-amber-900 dark:text-amber-200">{i.title}</p>
                      <p className="text-slate-600 dark:text-slate-300">{i.aiExplanation.whyNeedsAttention}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <Card className="p-6">
              <TimelineView events={appTimeline} />
            </Card>
          )}
        </div>

        {/* Right Column: Officer Decision Drawer (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <Card className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-elevated space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Officer Adjudication
              </h3>
              <Shield className="w-4 h-4 text-blue-500" />
            </div>

            {/* Officer Decision Buttons */}
            <div className="space-y-2.5">
              <Button
                variant="success"
                size="md"
                isLoading={isProcessingDecision}
                onClick={() => handleDecision('approve')}
                leftIcon={<Award className="w-4 h-4" />}
                className="w-full justify-center font-bold"
              >
                Approve & Issue Certificate
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecision('request_correction')}
                leftIcon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
                className="w-full justify-center text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50"
              >
                Request Applicant Correction
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setManualReviewModalApp(activeApplication)}
                leftIcon={<User className="w-4 h-4 text-purple-500" />}
                className="w-full justify-center text-purple-700 dark:text-purple-300 hover:bg-purple-50"
              >
                Escalate to Manual Adjudication
              </Button>
            </div>

            {/* Officer Notes Editor */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Internal Officer Audit Notes
              </label>
              <textarea
                rows={3}
                value={officerNotesInput}
                onChange={(e) => setOfficerNotesInput(e.target.value)}
                placeholder="Enter internal verification comments..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus-ring"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
