import React, { useState } from 'react';
import {
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export const RuleSimulatorModal: React.FC = () => {
  const { isRuleSimulatorOpen, setRuleSimulatorOpen, rules, addToast } = useApp();

  const [selectedRuleId, setSelectedRuleId] = useState<string>('RULE_NAME_MATCH_001');
  const [testAppName, setTestAppName] = useState<string>('Rahul Kumar');
  const [testDocName, setTestDocName] = useState<string>('Rahul Sharma');
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(92);
  const [simulationResult, setSimulationResult] = useState<{
    status: 'pass' | 'fail';
    score: number;
    reason: string;
    action: string;
    affectedCount: number;
    passingCount: number;
    failingCount: number;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!isRuleSimulatorOpen) return null;

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      // Simulate Levenshtein check
      const isMatch = testAppName.toLowerCase().trim() === testDocName.toLowerCase().trim();
      const score = isMatch ? 100 : 76;
      const passed = score >= similarityThreshold;

      setSimulationResult({
        status: passed ? 'pass' : 'fail',
        score,
        reason: passed
          ? `String similarity (${score}%) meets the ${similarityThreshold}% tolerance floor.`
          : `String similarity (${score}%) is below the ${similarityThreshold}% tolerance floor. Middle/Last name divergence detected.`,
        action: passed ? 'Categorize for Automated Processing' : 'Flag for Correction-First Workspace',
        affectedCount: 14,
        passingCount: passed ? 14 : 11,
        failingCount: passed ? 0 : 3,
      });
      setIsRunning(false);
    }, 450);
  };

  return (
    <Modal
      isOpen={isRuleSimulatorOpen}
      onClose={() => setRuleSimulatorOpen(false)}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Compliance Rule Simulator & Impact Workbench
            </h3>
            <p className="text-xs text-slate-500">
              Test policy adjustments and preview live pipeline impact before publishing
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* Rule Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
              Select Validation Policy
            </label>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring font-semibold"
            >
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
              Tolerance Threshold Floor ({similarityThreshold}%)
            </label>
            <input
              type="range"
              min={70}
              max={100}
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer mt-3"
            />
          </div>
        </div>

        {/* Test Payload Form */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Test Payload Injection
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                Application Submitted Name
              </label>
              <input
                type="text"
                value={testAppName}
                onChange={(e) => setTestAppName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus-ring"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                OCR Extracted Document Name
              </label>
              <input
                type="text"
                value={testDocName}
                onChange={(e) => setTestDocName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus-ring"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              size="sm"
              variant="primary"
              isLoading={isRunning}
              onClick={handleRunSimulation}
              leftIcon={<Play className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              Run Policy Simulation
            </Button>
          </div>
        </div>

        {/* Simulation Output & Impact Diff */}
        {simulationResult && (
          <div className="space-y-4">
            {/* Outcome Card */}
            <div
              className={`p-4 rounded-2xl border ${
                simulationResult.status === 'pass'
                  ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                  : 'bg-rose-50/70 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {simulationResult.status === 'pass' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  )}
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Simulation Outcome: {simulationResult.status === 'pass' ? 'RULE PASSED ✓' : 'CORRECTION REQUIRED ⚠'}
                  </h4>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  Computed Match: {simulationResult.score}%
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                {simulationResult.reason}
              </p>
            </div>

            {/* Impact Preview on Active Applications */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200">
                <span>Rule Impact Preview</span>
                <span className="font-mono">{simulationResult.affectedCount} Applications in Scope</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Passing Under Policy</span>
                  <p className="text-sm font-mono font-bold text-emerald-600 mt-0.5">
                    {simulationResult.passingCount} applications
                  </p>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Failing Under Policy</span>
                  <p className="text-sm font-mono font-bold text-rose-600 mt-0.5">
                    {simulationResult.failingCount} applications
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
