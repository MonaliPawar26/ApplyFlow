import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Shield,
  BarChart3,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './Badge';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    applications,
    navigateToApplication,
    setCurrentRoute,
    setCurrentRole,
    toggleDarkMode,
    isDarkMode,
    resetDemoScenario,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on route change or clean up
  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  const navigationItems = [
    {
      id: 'nav_applicant_dash',
      title: 'Applicant Dashboard',
      subtitle: 'Track active submissions and pending items',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      action: () => {
        setCurrentRole('applicant');
        setCurrentRoute('applicant_dashboard');
      },
    },
    {
      id: 'nav_val_center',
      title: 'Validation Center (APP-1024)',
      subtitle: 'Review cross-document validation issues & scores',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      action: () => {
        navigateToApplication('APP-1024', 'validation_center');
      },
    },
    {
      id: 'nav_correction_ws',
      title: 'Correction Workspace (APP-1024)',
      subtitle: 'Fix active application anomalies with AI assistance',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      action: () => {
        navigateToApplication('APP-1024', 'correction_workspace');
      },
    },
    {
      id: 'nav_new_app',
      title: 'Start New Application Wizard',
      subtitle: '5-step smart application submission pipeline',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      action: () => {
        setCurrentRoute('new_application');
      },
    },
    {
      id: 'nav_officer_queue',
      title: 'Operations Center (Officer Queue)',
      subtitle: 'Live queue of incoming enterprise applications',
      icon: <UserCheck className="w-4 h-4 text-blue-500" />,
      action: () => {
        setCurrentRole('officer');
        setCurrentRoute('officer_dashboard');
      },
    },
    {
      id: 'nav_rules',
      title: 'Admin Rule Engine',
      subtitle: 'Configure automated validation policies & thresholds',
      icon: <Shield className="w-4 h-4 text-purple-500" />,
      action: () => {
        setCurrentRole('admin');
        setCurrentRoute('rules');
      },
    },
    {
      id: 'nav_analytics',
      title: 'Platform Analytics',
      subtitle: 'Throughput, correction rate, and latency metrics',
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
      action: () => {
        setCurrentRole('admin');
        setCurrentRoute('analytics');
      },
    },
  ];

  const quickActions = [
    {
      id: 'act_demo_reset',
      title: 'Reset Demo Scenario (APP-1024)',
      subtitle: 'Restore initial 3-issue state for presentation demonstration',
      icon: <RotateCcw className="w-4 h-4 text-amber-500" />,
      action: () => resetDemoScenario(),
    },
    {
      id: 'act_theme',
      title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle theme preference',
      icon: isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />,
      action: () => toggleDarkMode(),
    },
  ];

  const filteredApps = useMemo(() => {
    if (!query.trim()) return applications.slice(0, 4);
    const q = query.toLowerCase();
    return applications.filter(
      (app) =>
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.type.toLowerCase().includes(q) ||
        app.status.toLowerCase().includes(q)
    );
  }, [applications, query]);

  const filteredNav = useMemo(() => {
    if (!query.trim()) return navigationItems;
    const q = query.toLowerCase();
    return navigationItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
  }, [navigationItems, query]);

  const allItems = useMemo(() => {
    return [
      ...filteredApps.map((app) => ({
        type: 'app' as const,
        id: app.id,
        title: `${app.id} — ${app.applicantName}`,
        subtitle: `${app.type.replace('_', ' ').toUpperCase()} • Score: ${app.validation.overallScore}%`,
        status: app.status,
        action: () => navigateToApplication(app.id, 'validation_center'),
      })),
      ...filteredNav.map((item) => ({
        type: 'nav' as const,
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        icon: item.icon,
        action: item.action,
      })),
      ...quickActions.map((act) => ({
        type: 'action' as const,
        id: act.id,
        title: act.title,
        subtitle: act.subtitle,
        icon: act.icon,
        action: act.action,
      })),
    ];
  }, [filteredApps, filteredNav, quickActions, navigateToApplication]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].action();
          setCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, selectedIndex, allItems, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Palette Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, search application ID, applicant, or page..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          <span className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No matching applications or commands found.
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.type === 'app' ? (
                        <FileText className="w-4 h-4 text-blue-600" />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.type === 'app' && item.status && (
                      <StatusBadge status={item.status} size="sm" />
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span className="font-mono text-slate-400">ApplyFlow Enterprise v2.4</span>
        </div>
      </motion.div>
    </div>
  );
};
