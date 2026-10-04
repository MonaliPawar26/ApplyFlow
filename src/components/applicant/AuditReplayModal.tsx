import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface ReplayStep {
  time: string;
  stage: string;
  statusText: string;
  healthScore: number;
  description: string;
  actor: string;
  highlightCategory: string;
}

const REPLAY_STEPS: ReplayStep[] = [
  {
    time: '10:32 AM',
    stage: 'APPLICATION SUBMISSION',
    statusText: 'Submitted (Ingestion Ready)',
    healthScore: 60,
    description: 'Applicant Rahul Sharma submitted initial metadata for NovaTech Digital Solutions.',
    actor: 'Rahul Sharma (Applicant)',
    highlightCategory: 'Metadata',
  },
  {
    time: '10:32 AM',
    stage: 'MULTI-DOCUMENT INGESTION',
    statusText: '3 Documents Ingested',
    healthScore: 65,
    description: 'Uploaded PAN Card, National ID, and Address Proof file streams.',
    actor: 'Ingestion Service',
    highlightCategory: 'Documents',
  },
  {
    time: '10:33 AM',
    stage: 'VISION OCR EXTRACTION',
    statusText: 'OCR Complete (1 Blur Detected)',
    healthScore: 68,
    description: 'PAN parsed at 97% confidence. Address proof scan damaged and illegible (22% clarity).',
    actor: 'ApplyFlow Vision Engine',
    highlightCategory: 'OCR Engine',
  },
  {
    time: '10:34 AM',
    stage: 'VALIDATION RULE EXECUTION',
    statusText: 'Correction Required (3 Issues)',
    healthScore: 68,
    description: 'Rule Engine flagged 3 anomalies: address proof missing, middle initial omission, 8-digit phone.',
    actor: 'Rule Engine v4.2',
    highlightCategory: 'Rule Engine',
  },
  {
    time: '10:41 AM',
    stage: 'APPLICANT CORRECTION',
    statusText: 'Issues Resolved in Workspace',
    healthScore: 88,
    description: 'Applicant uploaded clean BESCOM electricity bill (99% OCR), aligned legal name, fixed phone.',
    actor: 'Rahul Sharma (Applicant)',
    highlightCategory: 'Correction Workspace',
  },
  {
    time: '10:42 AM',
    stage: '6-STAGE REVALIDATION',
    statusText: '100% Validation Passed',
    healthScore: 98,
    description: 'Automated compliance pipeline verified all checksums without warnings. Auto-routed to Standard Queue.',
    actor: 'Automated Pipeline',
    highlightCategory: 'Revalidation',
  },
  {
    time: '10:43 AM',
    stage: 'OFFICER ADJUDICATION & COMPLETION',
    statusText: 'Completed & Certified',
    healthScore: 100,
    description: 'Senior Officer Elena Rostova reviewed verification proof and digitally sealed MCA registration.',
    actor: 'Elena Rostova (Senior Officer)',
    highlightCategory: 'Officer Adjudication',
  },
];

export const AuditReplayModal: React.FC = () => {
  const { isAuditReplayOpen, setAuditReplayOpen, activeApplication } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= REPLAY_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2400 / speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  if (!isAuditReplayOpen) return null;

  const currentStep = REPLAY_STEPS[currentStepIndex];

  return (
    <Modal
      isOpen={isAuditReplayOpen}
      onClose={() => setAuditReplayOpen(false)}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Application Lifecycle Replay Engine
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Simulate end-to-end processing history for {activeApplication.id}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* Playback Control Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsPlaying(!isPlaying)}
              leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 font-bold"
            >
              {isPlaying ? 'Pause Replay' : 'Play Lifecycle'}
            </Button>

            <button
              onClick={() => {
                if (currentStepIndex < REPLAY_STEPS.length - 1) {
                  setCurrentStepIndex(currentStepIndex + 1);
                }
              }}
              disabled={currentStepIndex >= REPLAY_STEPS.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Restart from Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed selector & Progress label */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              Stage {currentStepIndex + 1} of {REPLAY_STEPS.length}
            </span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setSpeed(1)}
                className={`px-2 py-0.5 rounded text-[11px] ${speed === 1 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeed(2)}
                className={`px-2 py-0.5 rounded text-[11px] ${speed === 2 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
              >
                2x
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic State Simulator Box */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-elevated space-y-4"
        >
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {currentStep.time}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {currentStep.stage}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {currentStep.statusText}
              </h4>
            </div>

            {/* Health Score Counter */}
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Health Score
              </span>
              <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                {currentStep.healthScore} / 100
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Actor: <strong className="text-slate-700 dark:text-slate-200">{currentStep.actor}</strong></span>
            <span>Focus: {currentStep.highlightCategory}</span>
          </div>
        </motion.div>

        {/* Timeline Scrubber Bar */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-7 gap-1.5">
            {REPLAY_STEPS.map((step, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  idx <= currentStepIndex
                    ? idx === currentStepIndex
                      ? 'bg-blue-600 ring-2 ring-blue-500/30'
                      : 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
                title={`${step.time}: ${step.stage}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>10:32 AM Submission</span>
            <span>10:43 AM Certified</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
