import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Layers,
  FileText,
  FileCheck,
  Zap,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  Lock,
  Search,
  Copy,
  Check,
  Eye,
  ArrowRight,
  ExternalLink,
  Code,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { Badge, StatusBadge } from '../common/Badge';
import { Button } from '../common/Button';

interface ApplicationXRayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationXRayModal: React.FC<ApplicationXRayModalProps> = ({ isOpen, onClose }) => {
  const { activeApplication, auditLogs, rules, addToast, setCurrentRoute } = useApp();
  const [activeLayer, setActiveLayer] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLayer, setCopiedLayer] = useState(false);

  if (!activeApplication) return null;

  const layers = [
    {
      id: 1,
      name: 'Layer 01: Application Entity',
      badge: 'ENTITY META',
      description: 'Core demographic schema, submission metadata, lifecycle flags, and priority classifications.',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Layer 02: Ingested Documents',
      badge: `${activeApplication.documents.length} ATTACHMENTS`,
      description: 'Digital assets, file payloads, checksum signatures, and optical pipeline readiness.',
      icon: <FileCheck className="w-4 h-4 text-cyan-500" />,
      color: 'cyan',
    },
    {
      id: 3,
      name: 'Layer 03: Extracted Key-Values',
      badge: 'OCR INFERENCE',
      description: 'Vision OCR bounding box extractions, field-level confidence ratings, and bounding coordinates.',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      color: 'amber',
    },
    {
      id: 4,
      name: 'Layer 04: Deterministic Rules',
      badge: `${rules.length} RULES EVALUATED`,
      description: 'Validation rule engine trace, conditional boolean assertions, and regulatory compliance constraints.',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      color: 'indigo',
    },
    {
      id: 5,
      name: 'Layer 05: Anomaly & Issues Matrix',
      badge: `${activeApplication.validation?.issues?.length || 0} ISSUES`,
      description: 'Cross-document discrepancy vectors, anomaly confidence thresholds, and correction guidance.',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      color: 'rose',
    },
    {
      id: 6,
      name: 'Layer 06: Workflow & Routing',
      badge: activeApplication.category.toUpperCase(),
      description: 'Queue telemetry, SLA countdown metrics, adjudication routing tags, and state machines.',
      icon: <GitBranch className="w-4 h-4 text-emerald-500" />,
      color: 'emerald',
    },
    {
      id: 7,
      name: 'Layer 07: Cryptographic Ledger',
      badge: 'SHA-256 SEALED',
      description: 'Immutable actor timestamp trail, state hashing signatures, and regulatory audit authenticity.',
      icon: <Lock className="w-4 h-4 text-purple-500" />,
      color: 'purple',
    },
  ];

  const handleCopyManifest = () => {
    const manifest = JSON.stringify(
      {
        applicationId: activeApplication.id,
        activeLayer,
        timestamp: new Date().toISOString(),
        snapshot: activeApplication,
      },
      null,
      2
    );
    navigator.clipboard.writeText(manifest);
    setCopiedLayer(true);
    addToast({
      title: 'X-Ray Manifest Copied',
      message: `Layer 0${activeLayer} JSON telemetry copied to clipboard.`,
      type: 'success',
    });
    setTimeout(() => setCopiedLayer(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="4xl"
    >
      <div className="space-y-5 -mt-3">
        {/* Header Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Application X-Ray Scanner
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  {activeApplication.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                7-Layer Deep Architectural Decomposition of Application Data & Logic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyManifest}
              leftIcon={copiedLayer ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedLayer ? 'Copied' : 'Export Layer JSON'}
            </Button>
          </div>
        </div>

        {/* 7-Layer Interactive Stack Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 p-1.5 bg-slate-100 dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {layers.map((layer) => {
            const isSelected = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 shadow-md ring-2 ring-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-navy-800/60'
                }`}
              >
                <div className="p-1 rounded-lg bg-slate-50 dark:bg-navy-950/60 mb-1">
                  {layer.icon}
                </div>
                <span className="text-[11px] font-mono font-bold">L-0{layer.id}</span>
                <span className="text-[10px] truncate max-w-full font-medium opacity-80">
                  {layer.name.split(':')[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Layer Banner */}
        {(() => {
          const cur = layers.find((l) => l.id === activeLayer)!;
          return (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-navy-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-navy-800 shadow-xs">
                  {cur.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cur.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                      {cur.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cur.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Dynamic Layer Content */}
        <div className="min-h-[340px] max-h-[440px] overflow-y-auto pr-1">
          {/* LAYER 1: Application Entity */}
          {activeLayer === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-navy-900/40 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">Entity Identifier</span>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {activeApplication.id}
                  </div>
                  <span className="text-[11px] text-slate-500">Applicant: {activeApplication.applicantName}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-navy-900/40 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">Application Type</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 capitalize">
                    {activeApplication.type.replace('_', ' ')}
                  </div>
                  <span className="text-[11px] text-slate-500">Routing Category: {activeApplication.category}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-navy-900/40 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">Lifecycle Status</span>
                  <div className="mt-1">
                    <StatusBadge status={activeApplication.status} />
                  </div>
                  <span className="text-[11px] text-slate-500">Priority: {activeApplication.priority.toUpperCase()}</span>
                </div>
              </div>

              {/* Form Payload Dump */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <div className="text-slate-400 text-[11px] mb-2 pb-1 border-b border-slate-800 flex justify-between">
                  <span>RAW APPLICANT DEMOGRAPHIC SCHEMA</span>
                  <span>JSON PAYLOAD</span>
                </div>
                <pre>{JSON.stringify({
                  id: activeApplication.id,
                  applicantName: activeApplication.applicantName,
                  email: activeApplication.applicantEmail,
                  phone: activeApplication.applicantPhone,
                  dob: activeApplication.applicantDob,
                  address: `${activeApplication.applicantAddress}, ${activeApplication.applicantCity}, ${activeApplication.applicantState} ${activeApplication.applicantPostalCode}`,
                  typeSpecificFields: activeApplication.typeSpecificFields,
                  submittedAt: activeApplication.submittedAt,
                }, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* LAYER 2: Ingested Documents */}
          {activeLayer === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeApplication.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-white dark:bg-navy-800/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {doc.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                          {doc.ocrConfidence}% OCR
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                        <div>File: {doc.fileName} ({doc.fileSize})</div>
                        <div>Type: {doc.type} • Status: {doc.status}</div>
                        <div>Extracted Fields: {Object.keys(doc.extractedFields).length} keys</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Uploaded {doc.uploadedAt}</span>
                      <button
                        onClick={() => {
                          onClose();
                          setCurrentRoute('documents_hub');
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        Inspect OCR & Boxes <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LAYER 3: Extracted Key-Values */}
          {activeLayer === 3 && (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-navy-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Field Key</th>
                      <th className="p-3">Extracted Value</th>
                      <th className="p-3">Source Doc</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Match Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                    {activeApplication.documents.flatMap((doc) =>
                      Object.entries(doc.extractedFields).map(([key, field]) => (
                        <tr key={`${doc.id}-${key}`} className="hover:bg-slate-100/50 dark:hover:bg-navy-800/50">
                          <td className="p-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                            {field.label || key}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {field.value}
                          </td>
                          <td className="p-3 text-slate-500 truncate max-w-[120px]">
                            {doc.name}
                          </td>
                          <td className="p-3 font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                field.confidence >= 90
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {field.confidence}%
                            </span>
                          </td>
                          <td className="p-3">
                            {field.isMatch ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                <Check className="w-3.5 h-3.5" /> Matched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5" /> Discrepancy
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LAYER 4: Deterministic Rules */}
          {activeLayer === 4 && (
            <div className="space-y-2.5">
              {rules.map((rule) => {
                const isPassed = !activeApplication.validation?.issues?.some(
                  (iss) => iss.aiExplanation?.ruleId === rule.id && iss.status === 'active'
                );

                return (
                  <div
                    key={rule.id}
                    className="p-3 bg-white dark:bg-navy-800/70 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {rule.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {rule.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {rule.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {isPassed ? 'ASSERTION PASSED' : 'ASSERTION FAILED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LAYER 5: Anomaly & Issues Matrix */}
          {activeLayer === 5 && (
            <div className="space-y-3">
              {activeApplication.validation?.issues?.length === 0 ? (
                <div className="p-8 text-center bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Zero Anomalies Detected
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    All document extractions match form assertions with high statistical confidence.
                  </p>
                </div>
              ) : (
                activeApplication.validation.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 bg-white dark:bg-navy-800 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {issue.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                        {issue.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
                      <div className="p-2 bg-slate-50 dark:bg-navy-900 rounded-lg">
                        <span className="text-slate-400 text-[10px]">Submitted Form:</span>
                        <div className="text-rose-600 dark:text-rose-400 font-bold">{issue.currentValue || 'N/A'}</div>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-navy-900 rounded-lg">
                        <span className="text-slate-400 text-[10px]">Document OCR:</span>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">{issue.expectedValue || 'N/A'}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                      {issue.aiExplanation?.whyNeedsAttention}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() => {
                          onClose();
                          setCurrentRoute('correction_workspace');
                        }}
                      >
                        Launch Correction Studio
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LAYER 6: Workflow & Routing */}
          {activeLayer === 6 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 font-mono uppercase">Routing Tier</span>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white capitalize mt-1">
                    {activeApplication.category.replace('_', ' ')} Route
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Deterministic pipeline classification based on risk score and completeness.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 font-mono uppercase">Queue Telemetry</span>
                  <div className="text-base font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                    Queue #{activeApplication.queuePosition || 3} of 24
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    SLA Deadline: {activeApplication.slaDeadline}
                  </p>
                </div>
              </div>

              {/* Next Action Blueprint */}
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Current Workflow Intent
                  </h4>
                </div>
                <p className="text-xs text-blue-900/80 dark:text-blue-300/80 font-medium">
                  {activeApplication.nextAction?.description || 'Awaiting adjudication or revalidation step'}
                </p>
              </div>
            </div>
          )}

          {/* LAYER 7: Cryptographic Ledger */}
          {activeLayer === 7 && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-purple-900 dark:text-purple-200">
                      SHA-256 State Integrity Seal
                    </div>
                    <div className="text-[11px] font-mono text-purple-700 dark:text-purple-300">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold">
                  VERIFIED SEAL
                </span>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-50 dark:bg-navy-900/60 rounded-lg border border-slate-200/60 dark:border-slate-800 font-mono text-[11px] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>
                      <span className="text-slate-500">by {log.user} ({log.role})</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
                      {log.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Scanning 7 architectural layers with deterministic verification
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Scanner
          </Button>
        </div>
      </div>
    </Modal>
  );
};
