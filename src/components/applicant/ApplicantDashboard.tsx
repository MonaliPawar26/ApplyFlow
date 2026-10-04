import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { ApplicationCard } from './ApplicationCard';
import { Button } from '../common/Button';
import { InteractivePipelineVisualizer } from '../pipeline/InteractivePipelineVisualizer';
import { NextActionBanner } from '../intelligence/NextActionBanner';
import { ApplicationDna } from '../intelligence/ApplicationDna';
import { WhatChangedCard } from '../intelligence/WhatChangedCard';

export const ApplicantDashboard: React.FC = () => {
  const {
    currentUser,
    applications,
    setCurrentRoute,
    navigateToApplication,
    activeApplication,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'attention' | 'processing' | 'completed'>('all');

  // Compute stats
  const activeCount = applications.filter((a) => a.status !== 'completed' && a.status !== 'rejected').length;
  const correctionCount = applications.filter((a) => a.status === 'correction_required').length;
  const processingCount = applications.filter((a) => a.status === 'processing' || a.status === 'validating').length;
  const completedCount = applications.filter((a) => a.status === 'completed' || a.status === 'validated').length;

  const filteredApps = applications.filter((app) => {
    if (filterTab === 'attention') return app.status === 'correction_required';
    if (filterTab === 'processing') return app.status === 'processing' || app.status === 'validating' || app.status === 'submitted';
    if (filterTab === 'completed') return app.status === 'completed' || app.status === 'validated';
    return true;
  });

  const hasAttentionNeeded = correctionCount > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]}.
            </h2>
            <span className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your applications and resolve issues before they delay processing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setCurrentRoute('new_application')}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sm"
          >
            Start New Application
          </Button>
        </div>
      </div>

      {/* Prominent Next Action Directive Banner */}
      <NextActionBanner />

      {/* Top 4 KPI Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Applications"
          value={activeCount}
          subtitle="Currently in pipeline"
          icon={<FileText className="w-5 h-5" />}
          variant="info"
          onClick={() => setFilterTab('all')}
        />
        <StatCard
          title="Correction Required"
          value={correctionCount}
          subtitle="Remediation needed"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="warning"
          trend={{ value: 'Actionable', isPositive: false }}
          onClick={() => setFilterTab('attention')}
        />
        <StatCard
          title="Processing & OCR"
          value={processingCount}
          subtitle="Automated checks running"
          icon={<Clock className="w-5 h-5" />}
          variant="default"
          onClick={() => setFilterTab('processing')}
        />
        <StatCard
          title="Completed / Validated"
          value={completedCount}
          subtitle="Approved or verified"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
          trend={{ value: '+99.2% SLA', isPositive: true }}
          onClick={() => setFilterTab('completed')}
        />
      </div>

      {/* Urgent Attention Alert Banner (If APP-1024 or other requires correction) */}
      {hasAttentionNeeded && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-glow-amber shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  {activeApplication.id}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Correction Required — 3 issues detected by automated rule engine
                </h4>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Fix missing address proof, name inconsistency, and contact phone in our side-by-side workspace to proceed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigateToApplication(activeApplication.id, 'validation_center')}
            >
              View Reasons
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigateToApplication(activeApplication.id, 'correction_workspace')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-amber-600 hover:bg-amber-700 border-amber-600 text-white font-semibold"
            >
              Fix Application Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Interactive Process Pipeline Hero Widget */}
      <div className="rounded-2xl p-5 sm:p-6 bg-slate-900 text-white dark:bg-navy-950 border border-slate-800 shadow-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30">
                ACTIVE APPLICATION PIPELINE
              </span>
              <span className="font-mono text-xs text-slate-300">
                {activeApplication.id} • {activeApplication.typeSpecificFields.businessName || activeApplication.applicantName}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              Automated Lifecycle Progress Tracker
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => navigateToApplication(activeApplication.id, 'validation_center')}
              className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            >
              Inspect Validation Rules
            </Button>
          </div>
        </div>

        <InteractivePipelineVisualizer
          currentStatus={activeApplication.status}
          onSelectStage={(stageId) => {
            if (stageId === 'correction') {
              navigateToApplication(activeApplication.id, 'correction_workspace');
            } else if (stageId === 'validation' || stageId === 'revalidation') {
              navigateToApplication(activeApplication.id, 'validation_center');
            } else if (stageId === 'ocr' || stageId === 'documents') {
              setCurrentRoute('documents_hub');
            }
          }}
        />
      </div>

      {/* Application Intelligence: 6-Axis DNA Matrix & Mutation Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicationDna application={activeApplication} />
        </div>
        <div className="lg:col-span-1">
          <WhatChangedCard />
        </div>
      </div>

      {/* Applications Section with Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              My Applications
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {applications.length} Total
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilterTab('attention')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filterTab === 'attention'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Needs Attention ({correctionCount})
            </button>
            <button
              onClick={() => setFilterTab('processing')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'processing'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Processing ({processingCount})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      </div>
    </div>
  );
};
