import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { USERS } from '../../data/mockData';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const { setCurrentRole, setCurrentRoute, resetDemoScenario } = useApp();

  const [email, setEmail] = useState('rahul.sharma@enterprise-hub.in');
  const [password, setPassword] = useState('••••••••••••');

  const handlePersonaLogin = (role: UserRole) => {
    if (role === 'applicant') {
      resetDemoScenario();
    }
    setCurrentRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div
          onClick={() => setCurrentRoute('landing')}
          className="inline-flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ApplyFlow
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 font-medium">
          Smart Application Processing Platform • ALG-AUTO-02
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-elevated space-y-6">
          {/* Quick Demo One-Click Access Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                One-Click Demo Personas
              </span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                INSTANT ACCESS
              </span>
            </div>

            <button
              onClick={() => handlePersonaLogin('applicant')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={USERS.applicant.avatar}
                  alt="Rahul"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Continue as Applicant (Rahul Sharma)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Signature 3-issue demo scenario ready for correction
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
            </button>

            <button
              onClick={() => handlePersonaLogin('officer')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={USERS.officer.avatar}
                  alt="Elena"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-300"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Continue as Verification Officer (Elena Rostova)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Operations Center, Live Queue & Adjudication
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handlePersonaLogin('admin')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={USERS.admin.avatar}
                  alt="Sarah"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-300"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Continue as System Admin (Sarah Chen)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Rule Engine, Optical Thresholds & Audit Trails
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">
                Or Sign In with Credentials
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePersonaLogin('applicant');
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus-ring"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center font-bold"
            >
              Sign In to Organization
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentRoute('landing')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              ← Return to Landing Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
