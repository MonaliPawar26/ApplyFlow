import React, { useState } from 'react';
import { ApplicationData, ApplicationDnaDimensions } from '../../types';
import { ShieldCheck, Zap, AlertTriangle, FileText, CheckCircle2, TrendingUp, Sparkles, HelpCircle, Layers } from 'lucide-react';

interface ApplicationDnaProps {
  application: ApplicationData;
  compact?: boolean;
  onDrillDown?: (dimension: keyof ApplicationDnaDimensions) => void;
  showComparison?: boolean;
  previousDna?: ApplicationDnaDimensions;
}

interface DimensionConfig {
  key: keyof ApplicationDnaDimensions;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ReactNode;
  weight: string;
  goodThreshold: number;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'completeness',
    label: 'Data Completeness',
    shortLabel: 'Complete',
    description: 'All mandatory fields populated with required supplementary documents attached.',
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    weight: '20%',
    goodThreshold: 90,
  },
  {
    key: 'consistency',
    label: 'Cross-Doc Consistency',
    shortLabel: 'Consistent',
    description: 'Entity identifiers, dates, and names match exactly across form and document OCR.',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    weight: '25%',
    goodThreshold: 85,
  },
  {
    key: 'confidence',
    label: 'OCR Confidence',
    shortLabel: 'OCR Conf.',
    description: 'Optical character recognition machine confidence score across all uploaded scans.',
    icon: <Zap className="w-4 h-4 text-amber-500" />,
    weight: '15%',
    goodThreshold: 80,
  },
  {
    key: 'validation',
    label: 'Validation Health',
    shortLabel: 'Validation',
    description: 'Pass rate against deterministic compliance rules and regulatory format constraints.',
    icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
    weight: '20%',
    goodThreshold: 85,
  },
  {
    key: 'complexity',
    label: 'Processing Simplicity',
    shortLabel: 'Simplicity',
    description: 'Inverse structural complexity metric indicating low risk of manual escalation.',
    icon: <Layers className="w-4 h-4 text-purple-500" />,
    weight: '10%',
    goodThreshold: 70,
  },
  {
    key: 'slaHealth',
    label: 'SLA Schedule Health',
    shortLabel: 'SLA Health',
    description: 'Time elapsed against regulatory processing target and queue turnaround SLA.',
    icon: <TrendingUp className="w-4 h-4 text-cyan-500" />,
    weight: '10%',
    goodThreshold: 75,
  },
];

export const ApplicationDna: React.FC<ApplicationDnaProps> = ({
  application,
  compact = false,
  onDrillDown,
  showComparison = false,
  previousDna,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<keyof ApplicationDnaDimensions | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'breakdown'>('radar');

  const dna = application.validation?.dna || {
    completeness: 100,
    consistency: application.validation?.overallScore > 80 ? 96 : 74,
    confidence: 96,
    validation: application.validation?.overallScore || 64,
    complexity: 78,
    slaHealth: 92,
  };

  // Helper to compute polygon points for 6-axis radar (center 120, 120, radius 90)
  const cx = 120;
  const cy = 120;
  const maxR = 85;

  const getCoordinates = (values: ApplicationDnaDimensions) => {
    return DIMENSIONS.map((dim, i) => {
      const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
      const val = Math.max(10, Math.min(100, values[dim.key] || 50));
      const r = (val / 100) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return { x, y, angle, val, label: dim.shortLabel, key: dim.key };
    });
  };

  const currentPoints = getCoordinates(dna);
  const polygonPath = currentPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const prevPoints = previousDna ? getCoordinates(previousDna) : null;
  const prevPolygonPath = prevPoints ? prevPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') : null;

  // Compute composite score
  const compositeScore = Math.round(
    (dna.completeness * 0.2) +
    (dna.consistency * 0.25) +
    (dna.confidence * 0.15) +
    (dna.validation * 0.2) +
    (dna.complexity * 0.1) +
    (dna.slaHealth * 0.1)
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  if (compact) {
    return (
      <div className="p-3 bg-white dark:bg-navy-800/90 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Application DNA
            </span>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${getScoreColor(compositeScore)}`}>
            {compositeScore}/100
          </span>
        </div>
        
        {/* Compact Bar Grid */}
        <div className="grid grid-cols-3 gap-2">
          {DIMENSIONS.map((dim) => {
            const val = dna[dim.key];
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="truncate">{dim.shortLabel}</span>
                  <span className="font-mono font-bold">{val}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-navy-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(val)}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-navy-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Application DNA
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-semibold">
                6-AXIS HEALTH MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-dimensional biometric fingerprint of application data integrity
            </p>
          </div>
        </div>

        {/* Tab & Composite Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-navy-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'radar'
                  ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Radar Map
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'breakdown'
                  ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Matrix Breakdown
            </button>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${getScoreColor(compositeScore)}`}>
            <span className="text-xs font-medium">DNA Score:</span>
            <span className="text-base font-mono font-extrabold">{compositeScore}</span>
            <span className="text-[10px] text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Radar SVG or Grid */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-50/50 dark:bg-navy-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/60 relative">
          {activeTab === 'radar' ? (
            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 240 240" className="w-full h-full filter drop-shadow-sm">
                {/* Concentric rings: 20%, 40%, 60%, 80%, 100% */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, idx) => {
                  const ringRadius = maxR * scale;
                  const ringPoints = DIMENSIONS.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
                    const x = cx + ringRadius * Math.cos(angle);
                    const y = cy + ringRadius * Math.sin(angle);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={idx}
                      points={ringPoints}
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={scale === 1 ? 'none' : '3 3'}
                      className="text-slate-200 dark:text-slate-700/60"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axis lines from center */}
                {DIMENSIONS.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
                  const x = cx + maxR * Math.cos(angle);
                  const y = cy + maxR * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={x}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-700/60"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Previous Polygon (if comparison enabled) */}
                {prevPolygonPath && (
                  <polygon
                    points={prevPolygonPath}
                    fill="rgba(148, 163, 184, 0.2)"
                    stroke="rgba(148, 163, 184, 0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Main Current Polygon */}
                <polygon
                  points={polygonPath}
                  fill="url(#dnaGradient)"
                  stroke="url(#dnaStroke)"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out"
                />

                {/* Node Circles */}
                {currentPoints.map((p, idx) => {
                  const isHovered = selectedDimension === p.key;
                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => setSelectedDimension(p.key)}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 6 : 4}
                        className={`transition-all duration-300 ${
                          p.val >= 80 ? 'fill-emerald-500' : p.val >= 60 ? 'fill-amber-500' : 'fill-rose-500'
                        } stroke-white dark:stroke-navy-900`}
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}

                {/* Axis Labels */}
                {DIMENSIONS.map((dim, i) => {
                  const angle = (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2;
                  const labelR = maxR + 22;
                  const x = cx + labelR * Math.cos(angle);
                  const y = cy + labelR * Math.sin(angle);
                  const isSelected = selectedDimension === dim.key;

                  return (
                    <text
                      key={i}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-mono cursor-pointer transition-colors ${
                        isSelected
                          ? 'fill-blue-600 dark:fill-blue-400 font-bold'
                          : 'fill-slate-500 dark:fill-slate-400 hover:fill-slate-800 dark:hover:fill-slate-200'
                      }`}
                      onClick={() => setSelectedDimension(dim.key)}
                    >
                      {dim.shortLabel}
                    </text>
                  );
                })}

                {/* Gradients */}
                <defs>
                  <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="dnaStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ) : (
            <div className="w-full space-y-2.5">
              {DIMENSIONS.map((dim) => {
                const val = dna[dim.key];
                return (
                  <div
                    key={dim.key}
                    onClick={() => setSelectedDimension(dim.key)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      selectedDimension === dim.key
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                        : 'bg-white dark:bg-navy-800 border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                        {dim.icon}
                        <span>{dim.label}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[10px] text-slate-400">Weight: {dim.weight}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{val}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-navy-900 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getBarColor(val)}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick status footnote */}
          <div className="mt-3 flex items-center justify-between w-full text-[11px] text-slate-500 dark:text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Calculated real-time across 6 data layers
            </span>
            <span className="font-mono text-[10px]">v2.4 Engine</span>
          </div>
        </div>

        {/* Right: Dimension Detail & Explanations */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Dimension Analysis</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
              Click dimension to inspect
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {DIMENSIONS.map((dim) => {
              const val = dna[dim.key];
              const isSelected = selectedDimension === dim.key;
              const isHealthy = val >= dim.goodThreshold;

              return (
                <div
                  key={dim.key}
                  onClick={() => setSelectedDimension(dim.key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-navy-900/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1 rounded-lg bg-white dark:bg-navy-800 shadow-xs">
                      {dim.icon}
                    </div>
                    <span
                      className={`text-xs font-mono font-extrabold px-1.5 py-0.5 rounded-md ${
                        isHealthy
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950'
                          : 'text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950'
                      }`}
                    >
                      {val}%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {dim.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {dim.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Dimension Inspector Card */}
          {selectedDimension && (() => {
            const activeConfig = DIMENSIONS.find((d) => d.key === selectedDimension)!;
            const activeVal = dna[selectedDimension];
            return (
              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 animate-fadeIn">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {activeConfig.icon}
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      {activeConfig.label} Insight
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                    {activeVal}% (Target: &gt;={activeConfig.goodThreshold}%)
                  </span>
                </div>
                <p className="text-xs text-blue-900/80 dark:text-blue-300/80">
                  {activeConfig.description}
                </p>
                {activeVal < activeConfig.goodThreshold && (
                  <div className="mt-2 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Score below compliance threshold. Resolving document discrepancies in the Correction Workspace will raise this score.
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
