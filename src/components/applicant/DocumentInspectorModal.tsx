import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Download,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const DocumentInspectorModal: React.FC = () => {
  const {
    selectedDocumentForInspection,
    setSelectedDocumentForInspection,
    activeApplication,
  } = useApp();

  if (!selectedDocumentForInspection) return null;

  const doc = selectedDocumentForInspection;
  const fields = Object.entries(doc.extractedFields || {});

  return (
    <Modal
      isOpen={!!selectedDocumentForInspection}
      onClose={() => setSelectedDocumentForInspection(null)}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Document & OCR Optical Inspector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {doc.fileName} • {doc.fileSize} • {activeApplication.id}
            </p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
        {/* LEFT: Document Preview with Laser Scanner (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Visual Document Scan</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Optical Layer Active
            </span>
          </div>

          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 min-h-[340px] flex flex-col items-center justify-center overflow-hidden text-center group">
            {/* Animated Laser Scanline */}
            <div className="scanner-line" />

            {/* Document Mock Graphics */}
            <div className="w-full max-w-xs bg-slate-800/90 rounded-xl p-5 border border-slate-700 shadow-2xl text-left space-y-3">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  {doc.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Govt Record</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-900/80 rounded border border-blue-500/40">
                  <span className="text-[9px] text-slate-400 uppercase">Beneficiary Name</span>
                  <p className="font-mono font-bold text-white">
                    {doc.extractedFields.fullName?.value ||
                      doc.extractedFields.consumerName?.value ||
                      doc.extractedFields.name?.value ||
                      'Rahul K. Sharma'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                    <span className="text-[9px] text-slate-400 uppercase">Doc Code</span>
                    <p className="font-mono font-bold text-white">
                      {doc.extractedFields.panNumber?.value || 'ABCDE1234F'}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-700">
                    <span className="text-[9px] text-slate-400 uppercase">Status</span>
                    <p className="font-mono font-bold text-emerald-400">VERIFIED</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Security Stamp: MCA-VERIFIED</span>
                <span>SHA-256 Valid</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Cryptographic OCR Confidence Floor: 85% • Extraction: {doc.ocrConfidence}%
            </p>
          </div>
        </div>

        {/* RIGHT: Extracted Information Table (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Extracted Structured Metadata
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {doc.ocrConfidence}% Confidence
            </span>
          </div>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto">
            {fields.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No OCR fields extracted. Document scan failed threshold.
              </div>
            ) : (
              fields.map(([key, field]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {field.label}
                    </span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {field.value}
                    </p>
                    {field.mismatchDetail && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                        ⚠ {field.mismatchDetail}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      {field.confidence}% Match
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {field.isMatch ? '✓ Aligned' : '⚠ Anomaly'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDocumentForInspection(null)}
            >
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
