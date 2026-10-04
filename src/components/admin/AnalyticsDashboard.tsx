import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../common/Card';
import { StatCard } from '../common/StatCard';
import { ProgressBar } from '../common/ProgressBar';

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('7d');

  const statusDistribution = [
    { label: 'Validated & Certified', count: 742, percentage: 59.4, color: 'bg-emerald-500' },
    { label: 'Correction Required', count: 214, percentage: 17.1, color: 'bg-amber-500' },
    { label: 'In Automated OCR', count: 186, percentage: 14.9, color: 'bg-blue-500' },
    { label: 'Completed (Issued)', count: 91, percentage: 7.3, color: 'bg-purple-500' },
    { label: 'Manual Review', count: 15, percentage: 1.2, color: 'bg-rose-500' },
  ];

  const categoryDistribution = [
    { label: 'Business Registration', count: 540, percentage: 43.2 },
    { label: 'Commercial SME Loans', count: 320, percentage: 25.6 },
    { label: 'Scholarship Grants', count: 260, percentage: 20.8 },
    { label: 'Statutory Licenses', count: 128, percentage: 10.2 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Intelligence & Analytics
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              SLA METRICS
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time throughput, automated OCR accuracy, and correction resolution velocity.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'today'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '7d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '30d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Past 30 Days
          </button>
        </div>
      </div>

      {/* Top 4 Performance KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg. Processing Time"
          value="3.4 min"
          subtitle="vs. 4.2 days manual baseline"
          icon={<Clock className="w-5 h-5" />}
          variant="success"
          trend={{ value: '98.5% Faster', isPositive: true }}
        />
        <StatCard
          title="Correction-First Rate"
          value="94.6%"
          subtitle="Fixed on 1st applicant attempt"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="info"
          trend={{ value: '+4.2% MoM', isPositive: true }}
        />
        <StatCard
          title="Optical OCR Precision"
          value="97.8%"
          subtitle="Across 3,840 documents"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="purple"
          trend={{ value: 'High Confidence', isPositive: true }}
        />
        <StatCard
          title="Dispute / Manual Rate"
          value="1.2%"
          subtitle="15 cases requiring officer call"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="warning"
          trend={{ value: '-82% Reduction', isPositive: true }}
        />
      </div>

      {/* Charts & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applications by Status Breakdown (lg:col-span-7) */}
        <Card className="lg:col-span-7 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Application Status Distribution
              </h3>
              <p className="text-xs text-slate-500">1,248 Total Ingested Applications</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              Live Aggregate
            </span>
          </div>

          <div className="space-y-4">
            {statusDistribution.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500">{item.count}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Breakdown & SLA Metrics (lg:col-span-5) */}
        <Card className="lg:col-span-5 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Applications by Category
              </h3>
              <p className="text-xs text-slate-500">Statutory processing streams</p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryDistribution.map((cat) => (
              <div key={cat.label} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{cat.label}</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{cat.count} apps ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
