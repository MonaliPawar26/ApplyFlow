import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  AlertTriangle,
  Sparkles,
  Layers,
  GraduationCap,
  Landmark,
  FileText,
  Clock,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ApplicationType } from '../../types';

export const NewApplicationWizard: React.FC = () => {
  const { submitNewApplication, setCurrentRoute, navigateToApplication } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@enterprise-hub.in',
    phone: '9876543210',
    dob: '2002-08-15',
    address: 'Suite 402, Innovate Tower, Cyber Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100',
    type: 'business_registration' as ApplicationType,
    typeSpecificFields: {
      businessName: 'NovaTech Digital Systems Pvt Ltd',
      entityType: 'Private Limited Company',
      annualTurnoverEstimated: '₹45,00,000',
    },
  });

  // Real-time live validations for Step 1
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = /^\d{10}$/.test(formData.phone);
  const isPostalValid = /^\d{6}$/.test(formData.postalCode);
  const isNameValid = formData.fullName.trim().length >= 3;

  // Documents state for Step 3
  const [docs, setDocs] = useState([
    {
      id: 'doc_up_1',
      type: 'pan_card',
      name: 'PAN Card (National Tax ID)',
      fileName: 'rahul_pan_card.pdf',
      fileSize: '1.4 MB',
      status: 'completed',
      ocrConfidence: 98,
    },
    {
      id: 'doc_up_2',
      type: 'identity_proof',
      name: 'National Identity Proof (Aadhaar/Passport)',
      fileName: 'national_id_card.pdf',
      fileSize: '2.1 MB',
      status: 'completed',
      ocrConfidence: 96,
    },
    {
      id: 'doc_up_3',
      type: 'address_proof',
      name: 'Registered Address Proof (Utility Bill)',
      fileName: 'bescom_electricity_bill_latest.pdf',
      fileSize: '1.1 MB',
      status: 'completed',
      ocrConfidence: 99,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newId = submitNewApplication(formData, docs);
      setIsSubmitting(false);
      navigateToApplication(newId, 'validation_center');
    }, 1200);
  };

  const steps = [
    { num: 1, label: 'Basic Information' },
    { num: 2, label: 'Application Details' },
    { num: 3, label: 'Documents & OCR' },
    { num: 4, label: 'Pre-check & Review' },
    { num: 5, label: 'Submit Application' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Automated Intake Pipeline
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            New Enterprise Application
          </h2>
        </div>

        <button
          onClick={() => setCurrentRoute('applicant_dashboard')}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Cancel & Return
        </button>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((s) => {
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <div key={s.num} className="text-center">
              <div
                className={`h-2 rounded-full mb-2 transition-all ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-blue-600'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
              <span
                className={`text-[11px] font-semibold block truncate ${
                  isCurrent
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                0{s.num} {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content with Animated Transitions */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-elevated overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 1 — Applicant Basic Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Real-time regex and format validation is applied automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Legal Name
                    </label>
                    {isNameValid ? (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold">Min 3 characters</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                    placeholder="Legal name"
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    {isEmailValid ? (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Valid email
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold">Invalid format</span>
                    )}
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                    placeholder="name@organization.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mobile Phone Number
                    </label>
                    {isPhoneValid ? (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> 10-digit format
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> 10 digits required
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus-ring"
                    placeholder="9876543210"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Premise / Registered Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                    placeholder="Suite, Street, Industrial Area"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Postal PIN Code
                    </label>
                    {isPostalValid && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus-ring"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Application Details (Dynamic Types) */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 2 — Application Category & Dynamic Fields
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Selecting a category dynamically updates required documents and compliance rules.
                </p>
              </div>

              {/* Application Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    type: 'business_registration' as ApplicationType,
                    label: 'Business Registration',
                    icon: <Building2 className="w-5 h-5" />,
                  },
                  {
                    type: 'scholarship' as ApplicationType,
                    label: 'Scholarship Grant',
                    icon: <GraduationCap className="w-5 h-5" />,
                  },
                  {
                    type: 'loan' as ApplicationType,
                    label: 'Commercial Loan',
                    icon: <Landmark className="w-5 h-5" />,
                  },
                  {
                    type: 'general_service' as ApplicationType,
                    label: 'Statutory License',
                    icon: <FileText className="w-5 h-5" />,
                  },
                ].map((item) => {
                  const isSelected = formData.type === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setFormData({ ...formData, type: item.type })}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500/30 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="mx-auto w-8 h-8 rounded-lg flex items-center justify-center mb-2">
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold block">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Type Specific Fields */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <span className="text-xs font-bold uppercase text-slate-400">
                  Dynamic Fields for {formData.type.replace('_', ' ').toUpperCase()}
                </span>

                {formData.type === 'business_registration' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Proposed Corporate / Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.typeSpecificFields.businessName || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            typeSpecificFields: { ...formData.typeSpecificFields, businessName: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Entity Structure
                      </label>
                      <select
                        value={formData.typeSpecificFields.entityType || 'Private Limited'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            typeSpecificFields: { ...formData.typeSpecificFields, entityType: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                      >
                        <option value="Private Limited Company">Private Limited Company</option>
                        <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership Firm">Partnership Firm</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.type === 'scholarship' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Academic Institution / University
                      </label>
                      <input
                        type="text"
                        defaultValue="Indian Institute of Technology"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Program of Study
                      </label>
                      <input
                        type="text"
                        defaultValue="M.Tech Computer Science"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                      />
                    </div>
                  </div>
                )}

                {formData.type === 'loan' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Requested Loan Facility Amount (INR)
                      </label>
                      <input
                        type="text"
                        defaultValue="₹50,00,000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Tenure (Months)
                      </label>
                      <input
                        type="number"
                        defaultValue={36}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus-ring"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Document Upload */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 3 — Mandatory Document Upload & Optical OCR
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  High-resolution documents are parsed instantly to pre-fill validation checks.
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-2xl p-6 text-center bg-blue-50/30 dark:bg-blue-950/20">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Drop files to upload or browse
                </p>
                <p className="text-xs text-slate-500 mt-0.5">PDF, PNG, JPG up to 15MB each</p>
              </div>

              {/* Uploaded Documents List with OCR badges */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase text-slate-400">
                  Ingested Verification Documents (3/3 Ready)
                </span>

                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {doc.fileName} • {doc.fileSize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {doc.ocrConfidence}% OCR Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review & Live Pre-check */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 4 — Automated Pre-Submission Compliance Scan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Preliminary validation run. No critical syntax blockers found.
                </p>
              </div>

              {/* Pre-check Report Box */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>PRE-SUBMISSION VERIFICATION INDEX: 96% HEALTHY</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Form formats, phone checksums, and mandatory document streams have passed preliminary inspection.
                </p>
              </div>

              {/* Summary Table */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Application Category:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formData.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Contact Phone:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Attached Documents:</span>
                  <span className="font-bold text-emerald-600">3 Verified PDFs</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Final Submission */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-glow-blue mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Ready to Ingest Application into ApplyFlow
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Submitting will trigger our automated OCR extractor, cross-document consistency engine, and intelligent routing queue.
              </p>

              <div className="pt-4">
                <Button
                  size="lg"
                  variant="primary"
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg"
                >
                  {isSubmitting ? 'Ingesting & Validating...' : 'Submit Application Now'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Controls */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 1}
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Step 0{currentStep + 1}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
