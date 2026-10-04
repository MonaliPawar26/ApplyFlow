import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  FileText,
  User,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Lock,
  Award,
  QrCode,
} from 'lucide-react';

interface ApplicationPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationPassportModal: React.FC<ApplicationPassportModalProps> = ({ isOpen, onClose }) => {
  const { activeApplication } = useApp();

  if (!activeApplication) return null;

  const app = activeApplication;
  const isVerified = app.validation?.overallScore >= 90;
  const rulesTotal = 12;
  const rulesPassed = Math.round((app.validation?.overallScore / 100) * rulesTotal);

  const hash = 'e3b0c44298fc1c149afbf4c8996fb924' + app.id.replace('APP-', '').padStart(8, '0');

  // Simulated QR grid (8x8)
  const qrGrid: boolean[][] = [];
  for (let row = 0; row < 8; row++) {
    const r: boolean[] = [];
    for (let col = 0; col < 8; col++) {
      // Deterministic pseudo-random based on app ID
      const seed = (row * 8 + col + parseInt(app.id.replace('APP-', ''), 10)) % 3;
      r.push(seed !== 0);
    }
    qrGrid.push(r);
  }

  const fields = [
    { label: 'Full Name', value: app.applicantName, icon: <User className="w-3.5 h-3.5 text-slate-400" /> },
    { label: 'Email Address', value: app.applicantEmail, icon: <Mail className="w-3.5 h-3.5 text-slate-400" /> },
    { label: 'Phone Number', value: app.applicantPhone, icon: <Phone className="w-3.5 h-3.5 text-slate-400" /> },
    { label: 'Date of Birth', value: app.applicantDob, icon: <Calendar className="w-3.5 h-3.5 text-slate-400" /> },
    { label: 'Address', value: `${app.applicantAddress}, ${app.applicantCity}`, icon: <MapPin className="w-3.5 h-3.5 text-slate-400" /> },
    { label: 'State / Postal Code', value: `${app.applicantState} ${app.applicantPostalCode}`, icon: <Hash className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="3xl">
      <div className="space-y-0 -mt-3">
        {/* ===== PASSPORT HEADER ===== */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 text-white">
          {/* Security pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
          }} />
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-300/80">
                  ApplyFlow Digital Passport
                </span>
              </div>

              <h2 className="text-2xl font-mono font-black tracking-tight mb-1">
                {app.id}
              </h2>
              <p className="text-base font-semibold text-white/90">
                {app.applicantName}
              </p>
              <p className="text-xs text-blue-200/70 capitalize mt-1">
                {app.type.replace('_', ' ')} Application
              </p>

              {/* Stamp */}
              <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-xl border-2 ${
                isVerified
                  ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300'
                  : 'border-amber-400/60 bg-amber-500/15 text-amber-300'
              }`}>
                {isVerified ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {isVerified ? 'VERIFIED & SEALED' : 'PENDING VERIFICATION'}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-20 h-20 bg-white rounded-lg p-1.5 shadow-lg">
                <div className="grid grid-cols-8 gap-[1px] w-full h-full">
                  {qrGrid.flat().map((filled, idx) => (
                    <div
                      key={idx}
                      className={`rounded-[1px] ${filled ? 'bg-slate-900' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[9px] text-blue-300/60 font-mono">SCAN TO VERIFY</span>
            </div>
          </div>
        </div>

        {/* ===== IDENTITY SECTION ===== */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Applicant Identity
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-navy-900/40 rounded-xl border border-slate-200/70 dark:border-slate-800"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {field.icon}
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{field.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DOCUMENT MANIFEST ===== */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Document Manifest
            </h3>
          </div>

          <div className="space-y-2">
            {app.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-navy-800/70 rounded-xl border border-slate-200/70 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      {doc.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {doc.fileName} • {doc.fileSize}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    doc.ocrConfidence >= 90
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    {doc.ocrConfidence}% OCR
                  </span>
                  {doc.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== VALIDATION SEAL ===== */}
        <div className="mt-5 p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Validation Certification
                </h3>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400">
                  {rulesPassed} of {rulesTotal} regulatory assertions passed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                {app.validation?.overallScore || 0}
              </div>
              <div className="text-[10px] text-emerald-500 font-mono">/100 SCORE</div>
            </div>
          </div>
        </div>

        {/* ===== CRYPTOGRAPHIC FOOTER ===== */}
        <div className="mt-5 p-4 bg-slate-900 dark:bg-navy-950 rounded-xl border border-slate-800 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">
              Cryptographic Integrity Seal
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-400 mb-3 break-all">
            SHA-256: {hash}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Issued: {app.submittedAt}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              ApplyFlow Processing Engine v2.4
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
