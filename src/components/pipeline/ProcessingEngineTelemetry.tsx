import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { TelemetryEvent } from '../../types';

export const ProcessingEngineTelemetry: React.FC = () => {
  const { telemetry } = useApp();
  const [isPaused, setIsPaused] = useState(false);
  const [localEvents, setLocalEvents] = useState<TelemetryEvent[]>(telemetry);

  useEffect(() => {
    if (isPaused) return;
    setLocalEvents(telemetry);
  }, [telemetry, isPaused]);

  return (
    <Card className="p-5 bg-slate-950 text-white border-slate-800 shadow-2xl space-y-3">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              ApplyFlow Core Engine Telemetry
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              Live processing stream • 100% deterministic rules
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* Stream Terminal Output */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto font-mono text-xs pr-1">
        {localEvents.map((evt) => {
          let statusColor = 'text-blue-400';
          if (evt.status === 'success') statusColor = 'text-emerald-400';
          if (evt.status === 'warning') statusColor = 'text-amber-400';
          if (evt.status === 'error') statusColor = 'text-rose-400';

          return (
            <div
              key={evt.id}
              className="p-2 rounded bg-slate-900/70 border border-slate-900/90 flex items-start justify-between gap-3 text-[11px] hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-slate-500 shrink-0 font-bold">[{evt.timestamp}]</span>
                <span className={`px-1 rounded text-[9px] font-bold shrink-0 bg-slate-800 ${statusColor}`}>
                  {evt.module}
                </span>
                <span className="text-slate-300 truncate">{evt.message}</span>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span>{evt.latencyMs}ms</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
