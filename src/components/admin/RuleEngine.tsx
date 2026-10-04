import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ValidationRule } from '../../types';

export const RuleEngine: React.FC = () => {
  const { rules, toggleRule, updateRuleThreshold } = useApp();

  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [ocrFloorInput, setOcrFloorInput] = useState<number>(85);

  const handleSliderChange = (newVal: number) => {
    setOcrFloorInput(newVal);
    const ocrRule = rules.find((r) => r.category === 'confidence');
    if (ocrRule) {
      updateRuleThreshold(ocrRule.id, newVal);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Compliance Rule Engine & Thresholds
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              POLICY V4.2
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure automated optical thresholds, mandatory document policies, and cross-consistency tolerances.
          </p>
        </div>
      </div>

      {/* OCR Confidence Floor Slider Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/10 via-slate-900/5 to-transparent border border-blue-200 dark:border-blue-900/60 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-glow-blue">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Global Optical OCR Confidence Threshold Floor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extractions below this floor are automatically routed to Officer Manual Review.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
              {ocrFloorInput}%
            </span>
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Minimum Floor
            </span>
          </div>
        </div>

        <input
          type="range"
          min={70}
          max={98}
          value={ocrFloorInput}
          onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
          className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
          <span>70% (Relaxed)</span>
          <span>85% (Standard Default)</span>
          <span>98% (High Precision)</span>
        </div>
      </Card>

      {/* Rules List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Validation Rule Sets ({rules.length})
          </h3>
          <span className="text-xs text-slate-400">Click a rule to inspect parameters</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => {
            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(rule)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-4 shadow-subtle group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      rule.enabled
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {rule.name}
                      </h4>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {rule.description}
                    </p>
                  </div>
                </div>

                {/* Right Toggle */}
                <div className="flex items-center gap-4 shrink-0">
                  {rule.threshold && (
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline-block">
                      {rule.threshold}% Threshold
                    </span>
                  )}

                  {/* Toggle switch */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRule(rule.id);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule Detail Modal */}
      {selectedRule && (
        <Modal
          isOpen={!!selectedRule}
          onClose={() => setSelectedRule(null)}
          maxWidth="lg"
          title={
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>{selectedRule.name}</span>
            </div>
          }
        >
          <div className="space-y-4 text-xs py-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Rule Scope</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Category: {selectedRule.category.toUpperCase()} • Severity: {selectedRule.severity.toUpperCase()}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                Rule Policy Description
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                {selectedRule.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant={selectedRule.enabled ? 'danger' : 'success'}
                size="sm"
                onClick={() => {
                  toggleRule(selectedRule.id);
                  setSelectedRule({ ...selectedRule, enabled: !selectedRule.enabled });
                }}
              >
                {selectedRule.enabled ? 'Disable Rule' : 'Enable Rule'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRule(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
