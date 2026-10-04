import React from 'react';
import {
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
  Building,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Zap,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { DEMO_SCENARIOS } from '../../data/mockData';

export const DemoScenariosModal: React.FC = () => {
  const { isDemoScenariosModalOpen, setDemoScenariosModalOpen, loadDemoScenario } = useApp();

  if (!isDemoScenariosModalOpen) return null;

  return (
    <Modal
      isOpen={isDemoScenariosModalOpen}
      onClose={() => setDemoScenariosModalOpen(false)}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              6 Dedicated Judge & Presentation Demo Scenarios
            </h3>
            <p className="text-xs text-slate-500">
              Select any scenario to load its simulated state, role perspective, and live telemetry instantly.
            </p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
        {DEMO_SCENARIOS.map((scen) => {
          return (
            <div
              key={scen.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between space-y-4 shadow-subtle group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    Scenario {scen.scenarioNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {scen.focusRole}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {scen.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {scen.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {scen.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  Initial Health: {scen.initialScore}%
                </span>

                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => {
                    loadDemoScenario(scen.id);
                    setDemoScenariosModalOpen(false);
                  }}
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  className="bg-blue-600 hover:bg-blue-700 font-bold"
                >
                  Launch
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
