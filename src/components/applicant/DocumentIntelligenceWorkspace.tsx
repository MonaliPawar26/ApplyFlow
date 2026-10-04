import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Shield,
  Layers,
  Eye,
  Check,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DocumentItem, ExtractedField } from '../../types';

export const DocumentIntelligenceWorkspace: React.FC = () => {
  const { activeApplication, navigateToApplication, setSelectedDocumentForInspection } = useApp();

  const documents = activeApplication.documents || [];
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'doc_pan_1024');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [activeHighlightedKey, setActiveHighlightedKey] = useState<string | null>('fullName');
  const [docSearchQuery, setDocSearchQuery] = useState<string>('');

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const fields = Object.entries(currentDoc?.extractedFields || {});

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 80));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { label: 'High Confidence', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800' };
    if (confidence >= 75) return { label: 'Medium Confidence', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-800' };
    return { label: 'Low Confidence (Manual Review)', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-800' };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Document Intelligence & Vision Workspace
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {activeApplication.id}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            High-precision optical extraction, bounding-box tensor alignment, and cross-document verification.
          </p>
        </div>

        {/* Document Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => {
                setSelectedDocId(doc.id);
                setActiveHighlightedKey(Object.keys(doc.extractedFields)[0] || null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDocId === doc.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {doc.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 3-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: Interactive Document Viewer (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Controls bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomOut}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono px-1 text-[11px] text-slate-400">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleRotate}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white ml-2"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <span className="font-mono text-[10px] text-emerald-400 font-bold">
              ✓ Optical Scan Active
            </span>
          </div>

          {/* Viewer Container */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 min-h-[420px] flex flex-col items-center justify-center overflow-hidden">
            {/* Laser scan line */}
            <div className="scanner-line" />

            {/* Document Surface */}
            <div
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              className="relative w-full max-w-sm bg-slate-900/90 rounded-2xl p-6 border border-slate-700 shadow-2xl text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="font-mono text-xs font-extrabold uppercase text-blue-400">
                  {currentDoc?.name || 'Tax Identity Record'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">SHA-256</span>
              </div>

              {/* Document Mock Elements with Bounding Boxes */}
              <div className="space-y-3 text-xs">
                {fields.map(([k, f]) => {
                  const isHighlighted = activeHighlightedKey === k;
                  return (
                    <div
                      key={k}
                      onClick={() => setActiveHighlightedKey(k)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isHighlighted
                          ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-500/50 shadow-glow-blue'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">
                        {f.label}
                      </span>
                      <p className="font-mono font-bold text-white mt-0.5">{f.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
                <span>MCA Security Seal</span>
                <span>Verified Extraction</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Extracted Information & Confidence (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Extracted Metadata
                </h3>
                <p className="text-xs text-slate-500">{fields.length} Optical Token Groups</p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {currentDoc?.ocrConfidence}% OCR
              </span>
            </div>

            <div className="space-y-2.5">
              {fields.map(([k, f]) => {
                const isSelected = activeHighlightedKey === k;
                const conf = getConfidenceLevel(f.confidence);

                return (
                  <div
                    key={k}
                    onClick={() => setActiveHighlightedKey(k)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{f.label}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {f.confidence}%
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-1 font-semibold truncate">
                      {f.value}
                    </p>
                    {f.mismatchDetail && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                        ⚠ {f.mismatchDetail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* COLUMN 3: Validation Rules & AI Explanation (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-5 space-y-4 bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Validation & AI Diagnosis
              </span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>

            {/* AI Explanation Callout */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>AI Guidance:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {activeApplication.validation.issues[0]?.aiExplanation.whyNeedsAttention ||
                  'All extracted fields comply with configured MCA compliance rule sets.'}
              </p>
            </div>

            {/* Action */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigateToApplication(activeApplication.id, 'correction_workspace')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full justify-center font-bold bg-blue-600 hover:bg-blue-700"
              >
                Open Correction Workspace
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
