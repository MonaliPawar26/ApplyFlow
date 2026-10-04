import React from 'react';
import {
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { ApplicationQueueTable } from './ApplicationQueueTable';
import { ProcessingEngineTelemetry } from '../pipeline/ProcessingEngineTelemetry';

export const OfficerDashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Application Operations Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              LIVE QUEUE
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor, validate and process incoming applications with automated AI diagnostic assistance.
          </p>
        </div>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Applications"
          value="1,248"
          subtitle="All-time intake"
          variant="default"
        />
        <StatCard
          title="Pending Queue"
          value="186"
          subtitle="In automated OCR"
          icon={<Clock className="w-4 h-4" />}
          variant="info"
        />
        <StatCard
          title="Correction Req."
          value="214"
          subtitle="Applicant fixing"
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="warning"
        />
        <StatCard
          title="Validated"
          value="742"
          subtitle="100% checks passed"
          icon={<CheckCircle2 className="w-4 h-4" />}
          variant="success"
        />
        <StatCard
          title="Manual Review"
          value="15"
          subtitle="Low OCR confidence"
          icon={<UserCheck className="w-4 h-4" />}
          variant="purple"
        />
        <StatCard
          title="Completed"
          value="91"
          subtitle="Certified today"
          icon={<Award className="w-4 h-4" />}
          variant="success"
        />
      </div>

      {/* Live Ingestion Telemetry Stream */}
      <ProcessingEngineTelemetry />

      {/* Live Application Queue Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Operations Intake Queue
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Ingestion Stream
            </span>
          </div>
        </div>

        <ApplicationQueueTable />
      </div>
    </div>
  );
};
