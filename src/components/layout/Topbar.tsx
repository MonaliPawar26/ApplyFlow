import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Moon,
  Sun,
  Menu,
  Sparkles,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { USERS } from '../../data/mockData';
import { UserRole } from '../../types';

export const Topbar: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const {
    currentRoute,
    setCurrentRoute,
    setCommandPaletteOpen,
    isDarkMode,
    toggleDarkMode,
    currentUser,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activeApplication,
    navigateToApplication,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const getPageTitle = () => {
    switch (currentRoute) {
      case 'applicant_dashboard':
        return 'Applicant Overview';
      case 'new_application':
        return 'New Application Intake';
      case 'validation_center':
        return `Validation Center • ${activeApplication?.id || 'APP-1024'}`;
      case 'correction_workspace':
        return `Correction Workspace • ${activeApplication?.id || 'APP-1024'}`;
      case 'officer_dashboard':
        return 'Operations Center & Queue';
      case 'officer_review':
        return `Officer Review • ${activeApplication?.id || 'APP-1024'}`;
      case 'analytics':
        return 'Platform Throughput & Analytics';
      case 'rules':
        return 'Rule Engine Configuration';
      case 'audit_logs':
        return 'Compliance Audit Logs';
      case 'notifications':
        return 'Notification Center';
      case 'documents_hub':
        return 'Document & OCR Archive';
      default:
        return 'ApplyFlow';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile hamburger & breadcrumb/page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Enterprise Pipeline • ALG-AUTO-02
          </p>
        </div>
      </div>

      {/* Center: Global Search Bar Button */}
      <div className="flex-1 max-w-md hidden lg:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm group"
        >
          <span className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-slate-500 dark:text-slate-400">Search application ID, applicant, or command...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-subtle">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search icon on mobile */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick New Application button */}
        <Button
          size="sm"
          variant="primary"
          onClick={() => setCurrentRoute('new_application')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="hidden sm:inline-flex shadow-sm"
        >
          New Application
        </Button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-navy-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-scale-in">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Notifications
                  </h4>
                  {unreadNotifications.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                      {unreadNotifications.length} unread
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.applicationId) {
                          navigateToApplication(n.applicationId, n.actionUrl as any || 'validation_center');
                        }
                        setIsNotifOpen(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.type === 'correction_required' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : n.type === 'validated' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {n.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="mt-1 block text-[10px] text-slate-400">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
                <button
                  onClick={() => {
                    setCurrentRoute('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User / Role Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                {currentRole}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-scale-in">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Switch Role Persona
                </p>
                <p className="text-[11px] text-slate-400">
                  Experience ApplyFlow from different viewpoints
                </p>
              </div>

              {(['applicant', 'officer', 'admin'] as UserRole[]).map((role) => {
                const user = USERS[role];
                const isSelected = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-100 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-medium">{role}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                );
              })}

              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setCurrentRoute('landing');
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Exit to Landing Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
