import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DemoBanner } from './DemoBanner';
import { CommandPalette } from '../common/CommandPalette';
import { ToastContainer } from '../common/ToastContainer';
import { RevalidationModal } from '../pipeline/RevalidationModal';
import { DocumentInspectorModal } from '../applicant/DocumentInspectorModal';
import { ManualReviewModal } from '../officer/ManualReviewModal';
import { AuditReplayModal } from '../applicant/AuditReplayModal';
import { RuleSimulatorModal } from '../admin/RuleSimulatorModal';
import { DemoScenariosModal } from './DemoScenariosModal';
import { ApplicationXRayModal } from '../intelligence/ApplicationXRayModal';
import { TimeMachineModal } from '../intelligence/TimeMachineModal';
import { ApplicationPassportModal } from '../intelligence/ApplicationPassportModal';
import { ApplicationStoryModal } from '../intelligence/ApplicationStoryModal';
import { DecisionChainDrawer } from '../intelligence/DecisionChainDrawer';
import { WhyWaitingDrawer } from '../intelligence/WhyWaitingDrawer';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, LayoutDashboard, FileSpreadsheet, FileCheck2, AlertCircle, FolderOpen, Bell, BarChart3, Sliders, ShieldAlert, Network } from 'lucide-react';
import { ViewRoute } from '../../types';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRoute, setCurrentRoute, currentRole, activeApplication, notifications,
    isXRayModalOpen, setXRayModalOpen,
    isTimeMachineOpen, setTimeMachineOpen,
    isPassportModalOpen, setPassportModalOpen,
    isStoryModalOpen, setStoryModalOpen,
    isWhyWaitingOpen, setWhyWaitingOpen,
    selectedIssueForChain, setSelectedIssueForChain,
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const activeIssuesCount = activeApplication?.validation?.issues?.filter((i) => i.status === 'active').length || 0;

  const mobileNavItems = [
    { id: currentRole === 'officer' ? 'officer_dashboard' : 'applicant_dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'validation_center', label: 'Validation Center', icon: <FileCheck2 className="w-5 h-5" /> },
    { id: 'validation_graph', label: 'Validation Graph', icon: <Network className="w-5 h-5" /> },
    { id: 'correction_workspace', label: 'Correction Workspace', icon: <AlertCircle className="w-5 h-5" />, badge: activeIssuesCount > 0 ? `${activeIssuesCount}` : undefined },
    { id: 'documents_hub', label: 'Documents & OCR', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount > 0 ? `${unreadCount}` : undefined },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'rules', label: 'Rule Engine', icon: <Sliders className="w-5 h-5" /> },
    { id: 'audit_logs', label: 'Audit Trail', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex flex-col antialiased">
      {/* 1. Persistent Top Demo Guide Banner */}
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Desktop Sidebar */}
        <Sidebar />

        {/* 3. Mobile Slide-out Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <div className="relative w-72 max-w-[85vw] bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shadow-2xl z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                      ApplyFlow
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {mobileNavItems.map((item) => {
                    const isActive = currentRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentRoute(item.id as ViewRoute);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px]">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

          <main className="flex-1 pb-16">
            {children}
          </main>
        </div>
      </div>

      {/* Global Modals, Command Palette, Replay, Simulator & Toast System */}
      <CommandPalette />
      <RevalidationModal />
      <DocumentInspectorModal />
      <ManualReviewModal />
      <AuditReplayModal />
      <RuleSimulatorModal />
      <DemoScenariosModal />

      {/* Intelligence Layer Modals & Drawers */}
      <ApplicationXRayModal isOpen={isXRayModalOpen} onClose={() => setXRayModalOpen(false)} />
      <TimeMachineModal isOpen={isTimeMachineOpen} onClose={() => setTimeMachineOpen(false)} />
      <ApplicationPassportModal isOpen={isPassportModalOpen} onClose={() => setPassportModalOpen(false)} />
      <ApplicationStoryModal isOpen={isStoryModalOpen} onClose={() => setStoryModalOpen(false)} />
      <DecisionChainDrawer isOpen={!!selectedIssueForChain} onClose={() => setSelectedIssueForChain(null)} issue={selectedIssueForChain} />
      <WhyWaitingDrawer isOpen={isWhyWaitingOpen} onClose={() => setWhyWaitingOpen(false)} />

      <ToastContainer />
    </div>
  );
};
