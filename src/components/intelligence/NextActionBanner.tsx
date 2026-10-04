import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, AlertTriangle, CheckCircle2, Sparkles, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ViewRoute } from '../../types';

export const NextActionBanner: React.FC = () => {
  const { activeApplication, setCurrentRoute, currentRole } = useApp();

  if (!activeApplication) return null;

  const nextAction = activeApplication.nextAction;
  if (!nextAction) return null;

  const urgencyConfig = {
    critical: {
      bg: 'bg-gradient-to-r from-rose-50 via-rose-50/60 to-amber-50/30 dark:from-rose-950/40 dark:via-rose-950/30 dark:to-amber-950/20',
      border: 'border-rose-200 dark:border-rose-800/60',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60',
      iconColor: 'text-rose-600 dark:text-rose-400',
      textColor: 'text-rose-900 dark:text-rose-200',
      subTextColor: 'text-rose-700/80 dark:text-rose-300/80',
      btnBg: 'bg-rose-600 hover:bg-rose-700',
      icon: <AlertTriangle className="w-5 h-5" />,
      pulse: true,
    },
    normal: {
      bg: 'bg-gradient-to-r from-blue-50 via-blue-50/60 to-indigo-50/30 dark:from-blue-950/40 dark:via-blue-950/30 dark:to-indigo-950/20',
      border: 'border-blue-200 dark:border-blue-800/60',
      iconBg: 'bg-blue-100 dark:bg-blue-900/60',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-200',
      subTextColor: 'text-blue-700/80 dark:text-blue-300/80',
      btnBg: 'bg-blue-600 hover:bg-blue-700',
      icon: <Sparkles className="w-5 h-5" />,
      pulse: false,
    },
    info: {
      bg: 'bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-cyan-50/30 dark:from-emerald-950/40 dark:via-emerald-950/30 dark:to-cyan-950/20',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-900 dark:text-emerald-200',
      subTextColor: 'text-emerald-700/80 dark:text-emerald-300/80',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
      icon: <CheckCircle2 className="w-5 h-5" />,
      pulse: false,
    },
  };

  const config = urgencyConfig[nextAction.urgency] || urgencyConfig.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-4 shadow-sm`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Icon + Message */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className={`p-2.5 rounded-xl ${config.iconBg} ${config.iconColor} flex-shrink-0 ${config.pulse ? 'animate-pulse' : ''}`}>
            {config.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className={`text-sm font-bold ${config.textColor} truncate`}>
                {nextAction.title}
              </h3>
              {nextAction.urgency === 'critical' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white animate-pulse">
                  ACTION REQUIRED
                </span>
              )}
            </div>
            <p className={`text-xs ${config.subTextColor} line-clamp-1`}>
              {nextAction.description}
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <button
          onClick={() => setCurrentRoute(nextAction.targetRoute)}
          className={`flex items-center gap-2 px-4 py-2 ${config.btnBg} text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:shadow-md active:scale-[0.98] flex-shrink-0`}
        >
          <Zap className="w-3.5 h-3.5" />
          {nextAction.actionText}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Decorative element */}
      <div className="absolute right-0 top-0 w-32 h-full opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <path d="M20 10 L50 40 L80 20 L110 50 L80 70 L50 50 L20 70 Z" fill="currentColor" className={config.iconColor} />
        </svg>
      </div>
    </motion.div>
  );
};
