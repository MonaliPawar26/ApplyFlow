import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, CheckCircle2, AlertTriangle, FileText, Cpu, Layers } from 'lucide-react';
import { Card } from './Card';
import { HealthScoreBreakdown } from '../../types';

interface HealthScoreCardProps {
  health: HealthScoreBreakdown;
  className?: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ health, className = '' }) => {
  const [animatedScore, setAnimatedScore] = useState(health.overall);

  useEffect(() => {
    let start = animatedScore;
    const end = health.overall;
    if (start === end) return;

    const duration = 400;
    const steps = 20;
    const stepTime = duration / steps;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [health.overall]);

  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-emerald-500';
    if (val >= 75) return 'text-blue-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getBarColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-500';
    if (val >= 75) return 'bg-blue-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const isPerfect = health.overall >= 95;

  return (
    <Card className={`p-5 sm:p-6 bg-slate-900 text-white dark:bg-navy-950 border-slate-800 shadow-elevated ${className}`}>
      <div className="flex items-start justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400">
            Automated Compliance Index
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
            Application Health Score
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Shield className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Main Score Display */}
      <div className="py-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${getScoreColor(animatedScore)}`}>
            {animatedScore}
          </span>
          <span className="text-xl font-bold text-slate-500 font-mono">/ 100</span>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase ${
            isPerfect
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {isPerfect ? '✓ Fully Verified' : '⚠ Action Needed'}
        </span>
      </div>

      {/* 4 Health Breakdown Sub-bars */}
      <div className="space-y-3 pt-2">
        {/* 1. Document Completeness */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Document Completeness
            </span>
            <span className="font-mono font-bold">{health.documentCompleteness}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(health.documentCompleteness)}`}
              style={{ width: `${health.documentCompleteness}%` }}
            />
          </div>
        </div>

        {/* 2. Field Validity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Field Format Validity
            </span>
            <span className="font-mono font-bold">{health.fieldValidity}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(health.fieldValidity)}`}
              style={{ width: `${health.fieldValidity}%` }}
            />
          </div>
        </div>

        {/* 3. Cross-Document Consistency */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Cross-Document Consistency
            </span>
            <span className="font-mono font-bold">{health.crossDocumentConsistency}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(health.crossDocumentConsistency)}`}
              style={{ width: `${health.crossDocumentConsistency}%` }}
            />
          </div>
        </div>

        {/* 4. OCR Optical Confidence */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Vision OCR Confidence Floor
            </span>
            <span className="font-mono font-bold">{health.ocrConfidence}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(health.ocrConfidence)}`}
              style={{ width: `${health.ocrConfidence}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
