import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Shield,
  FileText,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const ManualReviewModal: React.FC = () => {
  const {
    manualReviewModalApp,
    setManualReviewModalApp,
    updateApplicationOfficerDecision,
  } = useApp();

  const [overrideValue, setOverrideValue] = useState<string>('Dr. Ananya Roy (WBMC-9941)');
  const [officerJustification, setOfficerJustification] = useState<string>('Verified physical embossed state council medical registration stamp.');

  if (!manualReviewModalApp) return null;

  const app = manualReviewModalApp;

  const handleManualVerification = () => {
    updateApplicationOfficerDecision(
      app.id,
      'approve',
      `Officer manual verification completed. ${officerJustification}`
    );
    setManualReviewModalApp(null);
  };

  return (
    <Modal
      isOpen={!!manualReviewModalApp}
      onClose={() => setManualReviewModalApp(null)}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Manual Adjudication & Low-Confidence Review
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {app.id} • {app.applicantName}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Anomaly Reason Banner */}
        <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-purple-950 dark:text-purple-200">
              Low OCR Confidence Threshold Escalation (61% Recognition)
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              Automated rule engine requires officer human-in-the-loop signoff due to holographic shimmer on state council registration seal.
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
              Officer Confirmed Value
            </label>
            <input
              type="text"
              value={overrideValue}
              onChange={(e) => setOverrideValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus-ring"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
              Audit Compliance Justification
            </label>
            <textarea
              rows={3}
              value={officerJustification}
              onChange={(e) => setOfficerJustification(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setManualReviewModalApp(null)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={handleManualVerification}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Certify & Approve Manually
          </Button>
        </div>
      </div>
    </Modal>
  );
};
