import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Upload,
  FileText,
  RotateCcw,
  Check,
  ShieldCheck,
  Building,
  User,
  Phone,
  FileCheck2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/Badge';

export const CorrectionWorkspace: React.FC = () => {
  const {
    activeApplication,
    resolveIssue,
    uploadReplacementDocument,
    setRevalidationModalOpen,
    resetDemoScenario,
    navigateToApplication,
  } = useApp();

  const [selectedIssueId, setSelectedIssueId] = useState<string>('issue_missing_address');
  const [nameInput, setNameInput] = useState<string>('Rahul K. Sharma');
  const [phoneInput, setPhoneInput] = useState<string>('9876543210');
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Refs for scrolling to fields
  const addressRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const { validation, id } = activeApplication;
  const issues = validation.issues;
  const activeIssues = issues.filter((i) => i.status === 'active');
  const resolvedIssues = issues.filter((i) => i.status === 'resolved');

  const scrollToField = (issueId: string) => {
    setSelectedIssueId(issueId);
    if (issueId === 'issue_missing_address' && addressRef.current) {
      addressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (issueId === 'issue_name_mismatch' && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (issueId === 'issue_invalid_phone' && phoneRef.current) {
      phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFixName = () => {
    resolveIssue(id, 'issue_name_mismatch', nameInput);
  };

  const handleFixPhone = () => {
    resolveIssue(id, 'issue_invalid_phone', phoneInput);
  };

  const handleUploadReplacement = async () => {
    setIsUploadingDoc(true);
    setUploadProgress(15);

    setTimeout(() => setUploadProgress(45), 400);
    setTimeout(() => setUploadProgress(80), 800);
    setTimeout(async () => {
      setUploadProgress(100);
      await uploadReplacementDocument(id, 'address_proof', {
        name: 'bangalore_bescom_electricity_bill_verified.pdf',
        size: '1.2 MB',
      });
      setIsUploadingDoc(false);
    }, 1200);
  };

  const isNameResolved = issues.find((i) => i.id === 'issue_name_mismatch')?.status === 'resolved';
  const isPhoneResolved = issues.find((i) => i.id === 'issue_invalid_phone')?.status === 'resolved';
  const isAddressResolved = issues.find((i) => i.id === 'issue_missing_address')?.status === 'resolved';

  const allResolved = activeIssues.length === 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-glow-amber">
              Correction-First Workspace
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Smart Correction & Issue Remediation
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Address highlighted discrepancies with AI assistance, then trigger automated revalidation.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            Reset Demo State
          </button>
          <Button
            variant="outline"
            onClick={() => navigateToApplication(id, 'validation_center')}
          >
            Validation Diagnostics
          </Button>
        </div>
      </div>

      {/* Main Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Issue Checklist (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-elevated">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Remediation Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  {activeIssues.length} unresolved • {resolvedIssues.length} fixed
                </p>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  allResolved
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {resolvedIssues.length}/{issues.length} Fixed
              </span>
            </div>

            <div className="space-y-2.5">
              {issues.map((issue, idx) => {
                const isSelected = selectedIssueId === issue.id;
                const isResolved = issue.status === 'resolved';

                return (
                  <div
                    key={issue.id}
                    onClick={() => scrollToField(issue.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 shadow-subtle ring-2 ring-blue-500/20'
                        : isResolved
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/60'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isResolved ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs font-bold truncate ${
                              isResolved
                                ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-75'
                                : isSelected
                                ? 'text-blue-950 dark:text-blue-200'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {issue.title}
                          </p>
                          {isResolved ? (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                              Fixed
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {issue.aiExplanation.detectedIssue}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Demo Assist Button */}
            {!allResolved && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={async () => {
                    handleFixName();
                    handleFixPhone();
                    await handleUploadReplacement();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Auto-Resolve All 3 Issues (Demo Fast-Track)
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Editable Target Fields & Document Uploader (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Missing Address Proof Document Card */}
          <div
            ref={addressRef}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
              selectedIssueId === 'issue_missing_address'
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
                : 'border-slate-200 dark:border-slate-800'
            } ${
              isAddressResolved
                ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isAddressResolved
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      1. Registered Address Proof Document
                    </h3>
                    {isAddressResolved ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        OCR Failed (22%)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Premise: Suite 402, Innovate Tower, Cyber Park, Bengaluru 560100
                  </p>
                </div>
              </div>
            </div>

            {/* AI Explanation Callout */}
            <div className="mb-4 p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>AI Optical Diagnosis:</span>
              </div>
              <p>
                Original file <span className="font-mono text-rose-600">unreadable_electricity_bill_damaged.pdf</span> was illegible. Upload a clean Utility Bill or Lease Agreement.
              </p>
            </div>

            {/* Upload Area / Resolved Document Display */}
            {!isAddressResolved ? (
              <div className="space-y-3">
                <div
                  onClick={handleUploadReplacement}
                  className="border-2 border-dashed border-blue-300 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-600 rounded-xl p-6 text-center cursor-pointer bg-blue-50/30 dark:bg-blue-950/20 transition-all group"
                >
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:-translate-y-1 transition-transform" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Drop replacement Electricity Bill or Lease Deed here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports high-res PDF, JPG, PNG (Max 15MB)
                  </p>

                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="primary"
                      isLoading={isUploadingDoc}
                      leftIcon={<Upload className="w-4 h-4" />}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUploadingDoc ? 'Scanning & Running OCR...' : 'Upload Valid Utility Bill (Demo)'}
                    </Button>
                  </div>
                </div>

                {isUploadingDoc && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-blue-900 dark:text-blue-300">
                      <span>Vision OCR Engine Ingesting...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500 text-white shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      bangalore_bescom_electricity_bill_verified.pdf
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-0.5">
                      ✓ OCR Extracted: 99% Confidence • Address matched: Suite 402, Innovate Tower
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  99% OCR CONFIDENCE
                </span>
              </div>
            )}
          </div>

          {/* 2. Name Consistency Mismatch Card */}
          <div
            ref={nameRef}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
              selectedIssueId === 'issue_name_mismatch'
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
                : 'border-slate-200 dark:border-slate-800'
            } ${
              isNameResolved
                ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isNameResolved
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      2. Applicant Legal Name Alignment
                    </h3>
                    {isNameResolved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ Aligned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Match basic application record with PAN & National ID records
                  </p>
                </div>
              </div>
            </div>

            {/* Side-by-side Before & After comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Before (Application Form)
                </span>
                <p className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  Rahul Sharma
                </p>
                <span className="text-[10px] text-slate-400">Omitted middle initial "K."</span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  Detected on Official PAN (98% OCR)
                </span>
                <p className="text-sm font-mono font-bold text-blue-900 dark:text-blue-200 mt-0.5">
                  Rahul K. Sharma
                </p>
                <span className="text-[10px] text-blue-600 dark:text-blue-400">Official Government Record</span>
              </div>
            </div>

            {/* Edit Field */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full legal name"
                />
              </div>

              <Button
                variant={isNameResolved ? 'success' : 'primary'}
                onClick={handleFixName}
                leftIcon={isNameResolved ? <Check className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                className="w-full sm:w-auto shrink-0"
              >
                {isNameResolved ? 'Updated & Resolved' : 'Apply Legal Name'}
              </Button>
            </div>
          </div>

          {/* 3. Contact Phone Number Checksum Card */}
          <div
            ref={phoneRef}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
              selectedIssueId === 'issue_invalid_phone'
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
                : 'border-slate-200 dark:border-slate-800'
            } ${
              isPhoneResolved
                ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isPhoneResolved
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      3. Applicant Mobile Number Checksum
                    </h3>
                    {isPhoneResolved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ 10-Digits Valid
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Standard 10-digit mobile prefix for automated SMS compliance notices
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Old Value (8 Digits)
                </span>
                <p className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  98765432
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Target Valid Format (10 Digits)
                </span>
                <p className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  9876543210
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                maxLength={10}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit mobile number"
              />
              <Button
                variant={isPhoneResolved ? 'success' : 'primary'}
                onClick={handleFixPhone}
                leftIcon={isPhoneResolved ? <Check className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                className="w-full sm:w-auto shrink-0"
              >
                {isPhoneResolved ? 'Phone Validated' : 'Apply Phone Number'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Revalidation Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900/95 text-white dark:bg-navy-950/95 border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              allResolved ? 'bg-emerald-500 text-white shadow-glow-green' : 'bg-amber-500 text-white'
            }`}
          >
            {allResolved ? <Check className="w-6 h-6 stroke-[3]" /> : `${activeIssues.length}`}
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              {allResolved
                ? 'All Remediation Items Resolved!'
                : `${activeIssues.length} Issue(s) Remaining to Fix`}
            </h4>
            <p className="text-xs text-slate-400">
              {allResolved
                ? 'Ready to execute 6-stage compliance revalidation pipeline.'
                : 'Fix all highlighted fields above before triggering revalidation.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            variant="primary"
            onClick={() => setRevalidationModalOpen(true)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className={`w-full sm:w-auto font-bold shadow-lg ${
              allResolved
                ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-glow-green animate-pulse-subtle'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Revalidate Application Now
          </Button>
        </div>
      </div>
    </div>
  );
};
