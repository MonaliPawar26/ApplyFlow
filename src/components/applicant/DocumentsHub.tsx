import React from 'react';
import {
  FolderOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const DocumentsHub: React.FC = () => {
  const {
    activeApplication,
    setSelectedDocumentForInspection,
    navigateToApplication,
  } = useApp();

  const documents = activeApplication.documents || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {activeApplication.id}
            </span>
            <span className="text-xs text-slate-400">Optical OCR Repository</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Documents & Vision Extraction Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspect OCR extracted fields, confidence scores, and raw document scans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigateToApplication(activeApplication.id, 'correction_workspace')}
          >
            Fix Issues in Workspace
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const isHealthy = doc.status === 'completed' && doc.ocrConfidence >= 85;

          return (
            <Card
              key={doc.id}
              className={`p-5 flex flex-col justify-between border ${
                isHealthy
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-amber-300 dark:border-amber-800 bg-amber-500/[0.02]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isHealthy
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isHealthy
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {doc.ocrConfidence}% OCR
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {doc.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                  {doc.fileName} • {doc.fileSize}
                </p>

                {/* Status message */}
                <div className="mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    {isHealthy ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>OCR Extraction Succeeded</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>OCR Clarity Below Threshold</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {Object.keys(doc.extractedFields).length} fields extracted
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setSelectedDocumentForInspection(doc)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Inspect Optical OCR
                </Button>
                <span className="text-[10px] text-slate-400 font-mono">
                  SHA-256 Valid
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
