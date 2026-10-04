import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Layers,
  FileCheck2,
  Clock,
  UserCheck,
  Building,
  RotateCcw,
  Zap,
  Lock,
  ChevronRight,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { InteractivePipelineVisualizer } from '../pipeline/InteractivePipelineVisualizer';
import { ApplicationStatus } from '../../types';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, setCurrentRole, resetDemoScenario, navigateToApplication } = useApp();

  const [heroStatus, setHeroStatus] = useState<ApplicationStatus>('correction_required');

  const pipelineStages: ApplicationStatus[] = [
    'submitted',
    'processing',
    'validating',
    'correction_required',
    'validated',
    'completed',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-100 dark:border-slate-800/80 sticky top-0 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentRoute('landing')}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                ApplyFlow
              </span>
              <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                ALG-AUTO-02
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentRoute('login')}
              className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5"
            >
              Sign In
            </button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                resetDemoScenario();
                navigateToApplication('APP-10284', 'applicant_dashboard');
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm font-semibold"
            >
              Try Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Next-Gen Enterprise Application Processing Engine</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Smart Application Processing,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
              Without the Manual Bottleneck.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Automate application validation, optical document OCR, correction-first workflows, and applicant communication from one intelligent platform.
          </p>
        </motion.div>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={() => {
              setCurrentRole('applicant');
              setCurrentRoute('new_application');
            }}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto px-8 font-bold shadow-elevated bg-blue-600 hover:bg-blue-700"
          >
            Start Application
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              resetDemoScenario();
              navigateToApplication('APP-10284', 'applicant_dashboard');
            }}
            leftIcon={<Play className="w-4 h-4 text-blue-500" />}
            className="w-full sm:w-auto font-semibold"
          >
            Try Live Demo
          </Button>
        </motion.div>

        {/* Interactive Application Processing Visualization Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white dark:bg-navy-950 border border-slate-800 shadow-2xl text-left space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-wider">
                  Interactive Processing Lifecycle Simulator
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                From Submission to Optical Validation & Correction
              </h3>
            </div>

            {/* Quick State Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl text-xs">
              {pipelineStages.map((s) => (
                <button
                  key={s}
                  onClick={() => setHeroStatus(s)}
                  className={`px-2.5 py-1 rounded-lg transition-all font-semibold capitalize ${
                    heroStatus === s
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <InteractivePipelineVisualizer currentStatus={heroStatus} />

          {/* Mini Live Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">
                  Signature Philosophy: Correction-First Processing
                </p>
                <p className="text-slate-400 mt-0.5">
                  Never simply reject. Highlight exact discrepancies, provide AI explanations, and empower instant revalidation.
                </p>
              </div>
            </div>

            <Button
              size="xs"
              variant="subtle"
              onClick={() => {
                resetDemoScenario();
                navigateToApplication('APP-1024', 'correction_workspace');
              }}
              className="shrink-0 bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30"
            >
              Test Correction Workspace →
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 8 Core Feature Sections */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section 1: The Problem & The Solution */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The Paradigm Shift
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Eliminate Manual Bottlenecks & Endless Rejections
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Traditional application systems reject applications outright without explaining why, clogging support lines and causing multi-week delays. ApplyFlow reimagines the entire flow.
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Vision OCR & Optical Integrity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extracts key metadata across PAN Cards, Identity records, and Utility Bills with 98%+ optical precision and cryptographic checksum validation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Correction-First Workspace
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Auto-scrolls to conflicting fields, highlights exact Levenshtein discrepancies, and lets applicants resolve issues in a side-by-side workspace.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Automated Revalidation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Executes a 6-stage compliance verification pipeline within 3.4 seconds, auto-categorizing clean submissions for instant officer approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Personas Quick Launch Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Persona Workspaces
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored Experiences for Applicants & Processing Officers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Persona 1: Applicant */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Rahul"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Applicant: Rahul Sharma
                  </h4>
                  <p className="text-xs text-slate-400">Founder & Applicant</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Experience the 5-step intake wizard, side-by-side Correction Workspace, and 100% revalidation pipeline.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetDemoScenario();
                setCurrentRole('applicant');
                setCurrentRoute('validation_center');
              }}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Enter as Applicant (Demo)
            </Button>
          </div>

          {/* Persona 2: Officer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                  alt="Elena"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Officer: Elena Rostova
                  </h4>
                  <p className="text-xs text-slate-400">Senior Verification Officer</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Access the Live Queue, multi-category filters, OCR comparisons, and human-in-the-loop manual review.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentRole('officer');
                setCurrentRoute('officer_dashboard');
              }}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Enter Operations Center
            </Button>
          </div>

          {/* Persona 3: Admin */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Sarah"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Admin: Sarah Chen
                  </h4>
                  <p className="text-xs text-slate-400">Compliance & Automation Lead</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Configure Rule Engine thresholds, adjust optical confidence floors, and view immutable audit trails.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentRole('admin');
                setCurrentRoute('analytics');
              }}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Enter Admin Engine
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8 bg-slate-50 dark:bg-navy-950 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-white">ApplyFlow</span>
            <span>— Submit Once. Validate Automatically. Correct Smarter.</span>
          </div>
          <span className="font-mono text-slate-400">
            ALG-AUTO-02 Production Prototype • Enterprise Grade
          </span>
        </div>
      </footer>
    </div>
  );
};
