import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export const SlaTimerBadge: React.FC<{
  deadline: string;
  priorityReason?: string;
  showIcon?: boolean;
}> = ({ deadline, priorityReason, showIcon = true }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isBreached: boolean }>({
    hours: 2,
    minutes: 14,
    seconds: 32,
    isBreached: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(deadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isBreached: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isBreached: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes;
  let colorClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (timeLeft.isBreached) {
    colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold';
  } else if (totalMinutes < 30) {
    colorClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse-subtle font-bold';
  } else if (totalMinutes < 60) {
    colorClass = 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono border transition-colors ${colorClass}`}
      title={priorityReason ? `SLA Risk: ${priorityReason}` : 'Automated SLA Countdown'}
    >
      {showIcon && (
        timeLeft.isBreached ? (
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        ) : totalMinutes < 30 ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        ) : (
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )
      )}
      <span>
        {timeLeft.isBreached
          ? 'BREACHED'
          : `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`}
      </span>
    </span>
  );
};
