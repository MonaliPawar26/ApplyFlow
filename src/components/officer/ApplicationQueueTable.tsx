import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationData, ApplicationStatus, ApplicationType, ApplicationPriority } from '../../types';
import { StatusBadge, PriorityBadge, CategoryBadge, ScoreBadge } from '../common/Badge';
import { SlaTimerBadge } from '../common/SlaTimerBadge';
import { Button } from '../common/Button';

export const ApplicationQueueTable: React.FC = () => {
  const { applications, navigateToApplication } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.applicantEmail.toLowerCase().includes(q) ||
        (app.typeSpecificFields.businessName &&
          (app.typeSpecificFields.businessName as string).toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesType = typeFilter === 'all' || app.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });
  }, [applications, searchQuery, statusFilter, typeFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, applicant name, business name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus-ring"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-ring"
          >
            <option value="all">All Statuses</option>
            <option value="correction_required">Correction Required</option>
            <option value="validated">Validated</option>
            <option value="processing">Processing</option>
            <option value="validating">Validating</option>
            <option value="manual_review">Manual Review</option>
            <option value="completed">Completed</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-ring"
          >
            <option value="all">All Categories</option>
            <option value="business_registration">Business Registration</option>
            <option value="scholarship">Scholarship</option>
            <option value="loan">Commercial Loan</option>
            <option value="general_service">General Service</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus-ring"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>

          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
                setPriorityFilter('all');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Applications Queue Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Applicant & Entity</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Routing</th>
                <th className="py-3.5 px-4">Health</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">SLA Remaining</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    No applications match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  return (
                    <tr
                      key={app.id}
                      onClick={() => navigateToApplication(app.id, 'officer_review')}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {app.id}
                      </td>

                      {/* Applicant */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {app.applicantName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {app.typeSpecificFields.businessName || app.applicantEmail}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <span className="capitalize">{app.type.replace('_', ' ')}</span>
                      </td>

                      {/* Routing */}
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={app.category} />
                      </td>

                      {/* Validation Score */}
                      <td className="py-3.5 px-4">
                        <ScoreBadge score={app.validation.overallScore} />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={app.priority} />
                      </td>

                      {/* SLA Countdown Timer */}
                      <td className="py-3.5 px-4">
                        <SlaTimerBadge deadline={app.slaDeadline} priorityReason={app.priorityReason} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToApplication(app.id, 'officer_review');
                          }}
                          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                          className="group-hover:text-blue-600 font-semibold"
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredApps.length} of {applications.length} applications</span>
          <span className="font-mono text-slate-400">Live Ingestion Stream Active</span>
        </div>
      </div>
    </div>
  );
};
