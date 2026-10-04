import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  AlertCircle,
  Bell,
  BarChart3,
  Sliders,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  FolderOpen,
  Network,
  History,
  Activity,
  Clock,
  Award,
  BookOpen,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewRoute } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    currentRole,
    currentUser,
    isSidebarCollapsed,
    setSidebarCollapsed,
    activeApplication,
    notifications,
    setAuditReplayOpen,
    setRuleSimulatorOpen,
    setXRayModalOpen,
    setTimeMachineOpen,
    setPassportModalOpen,
    setStoryModalOpen,
    setWhyWaitingOpen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const activeIssuesCount = activeApplication?.validation?.issues?.filter((i) => i.status === 'active').length || 0;

  interface NavItem {
    id: ViewRoute;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
    roles?: string[];
  }

  const navItems: NavItem[] = [
    {
      id: currentRole === 'officer' ? 'officer_dashboard' : 'applicant_dashboard',
      label: currentRole === 'officer' ? 'Officer Queue' : 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'control_room',
      label: 'Control Room',
      icon: <Activity className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'validation_center',
      label: 'Validation Center',
      icon: <FileCheck2 className="w-5 h-5 shrink-0" />,
      badge: activeApplication.id,
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[10px]',
    },
    {
      id: 'validation_graph',
      label: 'Validation Graph',
      icon: <Network className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'correction_workspace',
      label: 'Corrections',
      icon: <AlertCircle className="w-5 h-5 shrink-0" />,
      badge: activeIssuesCount > 0 ? `${activeIssuesCount} issues` : 'Clear',
      badgeColor:
        activeIssuesCount > 0
          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[10px]'
          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]',
    },
    {
      id: 'documents_hub',
      label: 'Documents & OCR',
      icon: <FolderOpen className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold text-[10px]',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      id: 'rules',
      label: 'Rule Engine',
      icon: <Sliders className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'audit_logs',
      label: 'Audit Trail',
      icon: <ShieldAlert className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out select-none z-30 shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div
          onClick={() => setCurrentRoute('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition-colors shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  ApplyFlow
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
                Smart Application Engine
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core items */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Workspace
            </p>
          )}
          {navItems
            .filter((item) => !item.roles || item.roles.includes(currentRole))
            .map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRoute(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-subtle border border-blue-200/60 dark:border-blue-800/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
        </div>

        {/* Intelligence Suite Section */}
        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          {!isSidebarCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Intelligence Suite</span>
              <span className="text-[9px] font-mono text-blue-500 font-bold">LIVE</span>
            </p>
          )}

          <button
            onClick={() => setXRayModalOpen(true)}
            title={isSidebarCollapsed ? '7-Layer X-Ray Scanner' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Eye className="w-4 h-4 text-blue-500 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">7-Layer X-Ray</span>}
          </button>

          <button
            onClick={() => setTimeMachineOpen(true)}
            title={isSidebarCollapsed ? 'Time Machine Scrubber' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">Time Machine</span>}
          </button>

          <button
            onClick={() => setPassportModalOpen(true)}
            title={isSidebarCollapsed ? 'Digital Passport' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/60 dark:hover:bg-purple-950/40 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Award className="w-4 h-4 text-purple-500 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">Digital Passport</span>}
          </button>

          <button
            onClick={() => setStoryModalOpen(true)}
            title={isSidebarCollapsed ? 'Application Story' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">App Life Story</span>}
          </button>

          <button
            onClick={() => setWhyWaitingOpen(true)}
            title={isSidebarCollapsed ? 'Why Am I Waiting?' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-amber-950/40 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">Why Am I Waiting?</span>}
          </button>

          <button
            onClick={() => setAuditReplayOpen(true)}
            title={isSidebarCollapsed ? 'Audit Replay' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <History className="w-4 h-4 text-cyan-500 shrink-0" />
            {!isSidebarCollapsed && <span className="flex-1 text-left truncate">Audit Replay</span>}
          </button>
        </div>

        {/* Administration Section */}
        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          {!isSidebarCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              System Governance
            </p>
          )}
          {adminNavItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentRoute(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-subtle border border-blue-200/60 dark:border-blue-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / User Profile Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 ${
            isSidebarCollapsed ? 'justify-center p-1.5' : ''
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
