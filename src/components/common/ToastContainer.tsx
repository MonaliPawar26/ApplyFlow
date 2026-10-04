import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          };

          const borderColors = {
            success: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/90 dark:bg-slate-900/95',
            warning: 'border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-slate-900/95',
            error: 'border-rose-200 dark:border-rose-800/60 bg-rose-50/90 dark:bg-slate-900/95',
            info: 'border-blue-200 dark:border-blue-800/60 bg-blue-50/90 dark:bg-slate-900/95',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 ${borderColors[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
