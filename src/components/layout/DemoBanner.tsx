import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Play,
  CheckCircle2,
  User,
  ShieldCheck,
  Sliders,
  History,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const DemoBanner: React.FC = () => {
  const {
    activeApplication,
    currentRole,
    setCurrentRole,
    resetDemoScenario,
    navigateToApplication,
    currentRoute,
    setAuditReplayOpen,
    setRuleSimulatorOpen,
    setDemoScenariosModalOpen,
  } = useApp();

  const isDemoApp = activeApplication.id === 'APP-10284' || activeApplication.id === 'APP-1024';
  const hasIssues = activeApplication.status === 'correction_required';

  return (
    <div className="bg-gradient-to-r from-slate-950 via-navy-900 to-slate-950 text-white border-b border-slate-800 px-4 py-2 sm:py-2.5 shadow-sm text-xs sm:text-sm z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Product & Scenario Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setDemoScenariosModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>6 Demo Scenarios</span>
          </button>

          <span className="hidden md:inline-block text-slate-300 truncate">
            {hasIssues ? (
              <span>
                Active Demo: <strong className="text-white">{activeApplication.id} ({activeApplication.typeSpecificFields.authorizedSignatory || 'Rahul Sharma'})</strong> — Health: <span className="font-mono text-amber-400 font-bold">{activeApplication.validation.overallScore}/100</span> (3 issues detected).
              </span>
            ) : activeApplication.status === 'validated' ? (
              <span className="text-emerald-300 font-medium inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeApplication.id} 100% Validated (Health: {activeApplication.validation.overallScore}/100)! Auto-routed to Standard Queue.
              </span>
            ) : (
              <span>Enterprise Smart Application Processing & Validation Engine</span>
            )}
          </span>
        </div>

        {/* Right: Quick Tools & Role Personas */}
        <div className="flex items-center gap-2">
          {/* Audit Replay Launcher */}
          <button
            onClick={() => setAuditReplayOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            title="Replay Application Lifecycle"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Replay</span>
          </button>

          {/* Rule Simulator Launcher */}
          <button
            onClick={() => setRuleSimulatorOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            title="Open Compliance Rule Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulator</span>
          </button>

          {/* Quick Persona Pills */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setCurrentRole('applicant')}
              className={`px-2 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                currentRole === 'applicant'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Applicant
            </button>
            <button
              onClick={() => setCurrentRole('officer')}
              className={`px-2 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                currentRole === 'officer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Officer
            </button>
            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-2 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                currentRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetDemoScenario}
            title="Reset APP-1024 back to initial Correction Required state"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition-colors border border-white/10"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
