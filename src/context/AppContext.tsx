import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ViewRoute,
  ApplicationData,
  TimelineEvent,
  AuditLogEntry,
  NotificationItem,
  ValidationRule,
  Toast,
  DocumentItem,
  TelemetryEvent,
  DemoScenario,
} from '../types';
import {
  USERS,
  INITIAL_RULES,
  SIGNATURE_DEMO_APP,
  INITIAL_APPLICATIONS,
  INITIAL_TIMELINE,
  INITIAL_TELEMETRY,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEMO_SCENARIOS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentRoute: ViewRoute;
  setCurrentRoute: (route: ViewRoute) => void;
  applications: ApplicationData[];
  activeApplicationId: string;
  activeApplication: ApplicationData;
  setActiveApplicationId: (id: string) => void;
  timeline: TimelineEvent[];
  telemetry: TelemetryEvent[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];
  rules: ValidationRule[];
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isRevalidationModalOpen: boolean;
  setRevalidationModalOpen: (open: boolean) => void;
  isAuditReplayOpen: boolean;
  setAuditReplayOpen: (open: boolean) => void;
  isRuleSimulatorOpen: boolean;
  setRuleSimulatorOpen: (open: boolean) => void;
  isDemoScenariosModalOpen: boolean;
  setDemoScenariosModalOpen: (open: boolean) => void;
  selectedDocumentForInspection: DocumentItem | null;
  setSelectedDocumentForInspection: (doc: DocumentItem | null) => void;
  manualReviewModalApp: ApplicationData | null;
  setManualReviewModalApp: (app: ApplicationData | null) => void;
  isNetworkSimOffline: boolean;
  setNetworkSimOffline: (offline: boolean) => void;

  // Intelligence Layer Modals
  isXRayModalOpen: boolean;
  setXRayModalOpen: (open: boolean) => void;
  isTimeMachineOpen: boolean;
  setTimeMachineOpen: (open: boolean) => void;
  isPassportModalOpen: boolean;
  setPassportModalOpen: (open: boolean) => void;
  isStoryModalOpen: boolean;
  setStoryModalOpen: (open: boolean) => void;
  isWhyWaitingOpen: boolean;
  setWhyWaitingOpen: (open: boolean) => void;
  selectedIssueForChain: import('../types').ValidationIssue | null;
  setSelectedIssueForChain: (issue: import('../types').ValidationIssue | null) => void;

  // Business Actions
  resolveIssue: (applicationId: string, issueId: string, correctedValue: string) => void;
  uploadReplacementDocument: (applicationId: string, docType: string, fileInfo: { name: string; size: string }) => Promise<void>;
  triggerRevalidation: (applicationId: string) => Promise<boolean>;
  submitNewApplication: (formData: any, docs: any[]) => string;
  updateApplicationOfficerDecision: (
    appId: string,
    decision: 'approve' | 'request_correction' | 'manual_review',
    notes?: string
  ) => void;
  toggleRule: (ruleId: string) => void;
  updateRuleThreshold: (ruleId: string, threshold: number) => void;
  resetDemoScenario: () => void;
  loadDemoScenario: (scenarioId: string) => void;
  navigateToApplication: (id: string, view?: ViewRoute) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('applicant');
  const [currentUser, setCurrentUser] = useState<User>(USERS.applicant);
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>('landing');
  const [applications, setApplications] = useState<ApplicationData[]>(INITIAL_APPLICATIONS);
  const [activeApplicationId, setActiveApplicationId] = useState<string>('APP-10284');
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>(INITIAL_TELEMETRY);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [rules, setRules] = useState<ValidationRule[]>(INITIAL_RULES);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isRevalidationModalOpen, setRevalidationModalOpen] = useState<boolean>(false);
  const [isAuditReplayOpen, setAuditReplayOpen] = useState<boolean>(false);
  const [isRuleSimulatorOpen, setRuleSimulatorOpen] = useState<boolean>(false);
  const [isDemoScenariosModalOpen, setDemoScenariosModalOpen] = useState<boolean>(false);
  const [selectedDocumentForInspection, setSelectedDocumentForInspection] = useState<DocumentItem | null>(null);
  const [manualReviewModalApp, setManualReviewModalApp] = useState<ApplicationData | null>(null);
  const [isNetworkSimOffline, setNetworkSimOffline] = useState<boolean>(false);

  // Intelligence Layer States
  const [isXRayModalOpen, setXRayModalOpen] = useState<boolean>(false);
  const [isTimeMachineOpen, setTimeMachineOpen] = useState<boolean>(false);
  const [isPassportModalOpen, setPassportModalOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setStoryModalOpen] = useState<boolean>(false);
  const [isWhyWaitingOpen, setWhyWaitingOpen] = useState<boolean>(false);
  const [selectedIssueForChain, setSelectedIssueForChain] = useState<import('../types').ValidationIssue | null>(null);

  // Sync current user when role changes
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentUser(USERS[role]);
    if (role === 'applicant') {
      setCurrentRoute('applicant_dashboard');
    } else if (role === 'officer') {
      setCurrentRoute('officer_dashboard');
    } else if (role === 'admin') {
      setCurrentRoute('analytics');
    }
    addToast({
      title: `Switched to ${USERS[role].name}`,
      message: `Role: ${role.toUpperCase()} • ${USERS[role].title}`,
      type: 'info',
      duration: 3000,
    });
  };

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newToast: Toast = { id, duration: 4500, ...toast };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast({
      title: 'All notifications marked as read',
      type: 'info',
    });
  };

  const activeApplication =
    applications.find((app) => app.id === activeApplicationId) || applications[0] || SIGNATURE_DEMO_APP;

  const navigateToApplication = (id: string, view: ViewRoute = 'validation_center') => {
    setActiveApplicationId(id);
    setCurrentRoute(view);
  };

  // Resolve an issue in the Correction Workspace with Dynamic Health recalculation
  const resolveIssue = (applicationId: string, issueId: string, correctedValue: string) => {
    setApplications((prevApps) =>
      prevApps.map((app) => {
        if (app.id !== applicationId) return app;

        const updatedIssues = app.validation.issues.map((issue) => {
          if (issue.id !== issueId) return issue;
          return {
            ...issue,
            status: 'resolved' as const,
            correctionDraft: correctedValue,
            resolvedAt: new Date().toISOString(),
          };
        });

        const activeCount = updatedIssues.filter((i) => i.status === 'active').length;
        const newScore = Math.min(100, Math.round(100 - activeCount * 11));

        // Recalculate health metrics
        const newHealth = {
          overall: newScore,
          documentCompleteness: updatedIssues.some((i) => i.category === 'documents' && i.status === 'active') ? 66 : 100,
          fieldValidity: updatedIssues.some((i) => i.category === 'format' && i.status === 'active') ? 74 : 100,
          crossDocumentConsistency: updatedIssues.some((i) => i.category === 'consistency' && i.status === 'active') ? 60 : 100,
          ocrConfidence: updatedIssues.some((i) => i.category === 'documents' && i.status === 'active') ? 71 : 98,
        };

        let updatedApp = {
          ...app,
          lastUpdatedAt: new Date().toISOString(),
          validation: {
            ...app.validation,
            overallScore: newScore,
            healthBreakdown: newHealth,
            issues: updatedIssues,
          },
        };

        if (issueId === 'issue_name_mismatch') {
          updatedApp.applicantName = correctedValue;
        }
        if (issueId === 'issue_invalid_phone') {
          updatedApp.applicantPhone = correctedValue;
        }

        return updatedApp;
      })
    );

    addToast({
      title: 'Issue Resolved',
      message: `Field updated with value: "${correctedValue}". Health score updated.`,
      type: 'success',
    });

    // Add Telemetry Event
    const newTelem: TelemetryEvent = {
      id: `tel_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + '.024',
      relativeMs: '+24ms',
      module: 'CORRECTION',
      message: `Applicant corrected issue [${issueId}] -> "${correctedValue}". Health score updated.`,
      latencyMs: 16,
      status: 'success',
    };
    setTelemetry((prev) => [newTelem, ...prev]);

    // Add audit log
    const newAudit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      applicationId,
      action: 'ISSUE_CORRECTED',
      category: 'CORRECTION',
      user: currentUser.name,
      role: currentUser.role,
      details: `Applicant updated issue [${issueId}] with value: ${correctedValue}`,
      ip: '49.37.142.89',
      severity: 'normal',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Simulate uploading a replacement document and optical OCR extraction
  const uploadReplacementDocument = async (
    applicationId: string,
    docType: string,
    fileInfo: { name: string; size: string }
  ) => {
    const newDocId = `doc_replaced_${Date.now()}`;
    const newDoc: DocumentItem = {
      id: newDocId,
      applicationId,
      type: docType as any,
      name: 'Registered Address Proof (Utility Bill)',
      fileName: fileInfo.name || 'bangalore_bescom_electricity_bill_verified.pdf',
      fileSize: fileInfo.size || '1.2 MB',
      uploadedAt: new Date().toISOString(),
      status: 'completed',
      ocrStatus: 'extracted',
      ocrConfidence: 99,
      previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      isRequired: true,
      extractedFields: {
        consumerName: {
          label: 'Consumer Name',
          value: 'Rahul K. Sharma',
          confidence: 99,
          isMatch: true,
          boundingBox: { x: 12, y: 22, width: 45, height: 12 },
        },
        premiseAddress: {
          label: 'Premises Address',
          value: 'Suite 402, Innovate Tower, Cyber Park, Bengaluru 560100',
          confidence: 98,
          isMatch: true,
          boundingBox: { x: 12, y: 44, width: 65, height: 18 },
        },
        billDate: {
          label: 'Bill Generation Date',
          value: '22/09/2026',
          confidence: 99,
          isMatch: true,
          boundingBox: { x: 12, y: 70, width: 35, height: 10 },
        },
        utilityProvider: {
          label: 'Electricity Supply Company',
          value: 'BESCOM Karnataka',
          confidence: 99,
          isMatch: true,
          boundingBox: { x: 12, y: 84, width: 40, height: 10 },
        },
      },
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        const existingDocs = app.documents.filter((d) => d.type !== docType);
        const updatedDocs = [...existingDocs, newDoc];

        const updatedIssues = app.validation.issues.map((issue) => {
          if (issue.category === 'documents' || issue.id === 'issue_missing_address') {
            return {
              ...issue,
              status: 'resolved' as const,
              resolvedAt: new Date().toISOString(),
              currentValue: `${newDoc.fileName} (Verified 99% Confidence)`,
            };
          }
          return issue;
        });

        const activeCount = updatedIssues.filter((i) => i.status === 'active').length;
        const newScore = Math.min(100, 100 - activeCount * 11);

        return {
          ...app,
          documents: updatedDocs,
          lastUpdatedAt: new Date().toISOString(),
          validation: {
            ...app.validation,
            overallScore: newScore,
            healthBreakdown: {
              ...app.validation.healthBreakdown,
              overall: newScore,
              documentCompleteness: 100,
              ocrConfidence: 99,
            },
            categories: {
              ...app.validation.categories,
              documents: { status: 'verified', count: updatedDocs.length, label: 'Mandatory Documents' },
            },
            issues: updatedIssues,
          },
        };
      })
    );

    addToast({
      title: 'Document OCR Complete',
      message: `Extracted address proof with 99% optical confidence. Issue marked as resolved.`,
      type: 'success',
    });

    const newTelem: TelemetryEvent = {
      id: `tel_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + '.412',
      relativeMs: '+412ms',
      module: 'VISION_OCR',
      message: `Optical vision tensor extracted 4 key-value pairs from ${newDoc.fileName} (99% OCR confidence)`,
      latencyMs: 140,
      status: 'success',
    };
    setTelemetry((prev) => [newTelem, ...prev]);

    const newAudit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      applicationId,
      action: 'DOCUMENT_REPLACED_OCR',
      category: 'OCR',
      user: currentUser.name,
      role: currentUser.role,
      details: `Replaced address proof with ${newDoc.fileName}. OCR Confidence: 99%.`,
      ip: '49.37.142.89',
      severity: 'normal',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Full 6-Stage Revalidation Pipeline
  const triggerRevalidation = async (applicationId: string): Promise<boolean> => {
    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) return false;

    const remainingActiveIssues = targetApp.validation.issues.filter((i) => i.status === 'active');
    const allResolved = remainingActiveIssues.length === 0;

    if (allResolved) {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== applicationId) return app;
          return {
            ...app,
            status: 'validated',
            progress: 100,
            category: 'standard',
            lastUpdatedAt: new Date().toISOString(),
            validation: {
              ...app.validation,
              overallScore: 98,
              healthBreakdown: {
                overall: 98,
                documentCompleteness: 100,
                fieldValidity: 100,
                crossDocumentConsistency: 96,
                ocrConfidence: 98,
              },
              status: 'validated',
              lastValidatedAt: new Date().toISOString(),
              categories: {
                identity: { status: 'verified', count: 2, label: 'Identity Verification' },
                applicationData: { status: 'verified', count: 4, label: 'Application Data Format' },
                documents: { status: 'verified', count: 3, label: 'Mandatory Documents' },
                consistency: { status: 'verified', count: 2, label: 'Cross-Document Consistency' },
              },
              issues: [],
            },
            officerNotes: 'Automated revalidation passed 100% compliance. Auto-routed to Standard Fast-Track.',
          };
        })
      );

      const timelineEvent: TimelineEvent = {
        id: `evt_${Date.now()}`,
        applicationId,
        timestamp: new Date().toISOString(),
        type: 'revalidated',
        title: 'Application Revalidated (Health Score: 68 → 98)',
        description: 'All remediation items resolved. Revalidation pipeline completed with 100% compliance.',
        severity: 'success',
        actor: { name: 'Automated Pipeline', role: 'System', isAi: true },
      };
      setTimeline((prev) => [timelineEvent, ...prev]);

      const newTelem: TelemetryEvent = {
        id: `tel_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + '.890',
        relativeMs: '+890ms',
        module: 'ROUTING',
        message: `Application ${applicationId} transitioned to VALIDATED. Routed to Standard Processing Queue.`,
        latencyMs: 12,
        status: 'success',
      };
      setTelemetry((prev) => [newTelem, ...prev]);

      const auditLog: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        applicationId,
        action: 'REVALIDATION_PASSED',
        category: 'VALIDATION',
        user: currentUser.name,
        role: currentUser.role,
        details: 'Passed 6-stage validation pipeline with 100% compliance. Status changed to VALIDATED.',
        ip: '10.240.0.1',
        severity: 'notice',
      };
      setAuditLogs((prev) => [auditLog, ...prev]);

      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: 'usr_rahul_01',
        applicationId,
        type: 'validated',
        title: `Application ${applicationId} Validated Successfully`,
        message: `Your corrected submission has passed all automated checks and is now categorized for Standard Processing.`,
        timestamp: 'Just now',
        isRead: false,
        actionUrl: 'validation_center',
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast({
        title: 'Validation Passed (Score: 98/100)!',
        message: `Application ${applicationId} has been verified and categorized for Standard Processing.`,
        type: 'success',
      });

      return true;
    } else {
      addToast({
        title: 'Correction Required',
        message: `There are still ${remainingActiveIssues.length} unresolved issue(s). Please fix all fields before revalidating.`,
        type: 'warning',
      });
      return false;
    }
  };

  // Submit a new application from the 5-step wizard
  const submitNewApplication = (formData: any, docs: any[]): string => {
    const newId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const formattedDocs: DocumentItem[] = docs.map((d, index) => ({
      id: `doc_new_${index}_${Date.now()}`,
      applicationId: newId,
      type: d.type || 'pan_card',
      name: d.name || 'Submitted Verification Document',
      fileName: d.fileName || 'uploaded_document.pdf',
      fileSize: d.fileSize || '1.8 MB',
      uploadedAt: now,
      status: 'completed',
      ocrStatus: 'extracted',
      ocrConfidence: 96,
      previewUrl: '',
      isRequired: true,
      extractedFields: {
        legalName: { label: 'Extracted Full Name', value: formData.fullName || 'Rahul Sharma', confidence: 97, isMatch: true, boundingBox: { x: 10, y: 25, width: 45, height: 12 } },
        dob: { label: 'Date of Birth', value: formData.dob || '2002-08-15', confidence: 98, isMatch: true, boundingBox: { x: 10, y: 55, width: 35, height: 10 } },
      },
    }));

    const newApp: ApplicationData = {
      id: newId,
      applicantId: currentUser.id,
      applicantName: formData.fullName || 'Rahul Sharma',
      applicantEmail: formData.email || 'rahul.sharma@enterprise-hub.in',
      applicantPhone: formData.phone || '9876543210',
      applicantDob: formData.dob || '2002-08-15',
      applicantAddress: formData.address || '123 Innovation Boulevard',
      applicantCity: formData.city || 'Bengaluru',
      applicantState: formData.state || 'Karnataka',
      applicantPostalCode: formData.postalCode || '560001',
      type: formData.type || 'business_registration',
      typeSpecificFields: formData.typeSpecificFields || {},
      status: 'validating',
      priority: 'normal',
      priorityReason: 'Automated intake in progress',
      category: 'standard',
      progress: 60,
      submittedAt: now,
      lastUpdatedAt: now,
      slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      documents: formattedDocs,
      validation: {
        overallScore: 94,
        healthBreakdown: {
          overall: 94,
          documentCompleteness: 100,
          fieldValidity: 95,
          crossDocumentConsistency: 92,
          ocrConfidence: 96,
        },
        status: 'validating',
        lastValidatedAt: now,
        categories: {
          identity: { status: 'verified', count: 2, label: 'Identity Verification' },
          applicationData: { status: 'verified', count: 4, label: 'Application Data Format' },
          documents: { status: 'verified', count: formattedDocs.length, label: 'Mandatory Documents' },
          consistency: { status: 'verified', count: 1, label: 'Cross-Document Consistency' },
        },
        issues: [],
      },
      assignedOfficer: 'Elena Rostova',
      officerNotes: 'Fresh application ingested into automated processing pipeline.',
    };

    setApplications((prev) => [newApp, ...prev]);
    setActiveApplicationId(newId);

    const timelineEvent: TimelineEvent = {
      id: `evt_new_${Date.now()}`,
      applicationId: newId,
      timestamp: now,
      type: 'submitted',
      title: `Application ${newId} Submitted`,
      description: `New application submitted by ${formData.fullName || 'Applicant'}. Documents ingested for OCR.`,
      severity: 'info',
      actor: { name: currentUser.name, role: 'Applicant' },
    };
    setTimeline((prev) => [timelineEvent, ...prev]);

    addToast({
      title: `Application ${newId} Created`,
      message: 'Ingestion pipeline complete. Automated validation checks in progress.',
      type: 'success',
    });

    return newId;
  };

  const updateApplicationOfficerDecision = (
    appId: string,
    decision: 'approve' | 'request_correction' | 'manual_review',
    notes?: string
  ) => {
    let newStatus: ApplicationData['status'] = 'completed';
    let title = 'Application Approved';
    let severity: 'success' | 'warning' | 'info' = 'success';

    if (decision === 'approve') {
      newStatus = 'completed';
      title = 'Application Approved & Certified';
      severity = 'success';
    } else if (decision === 'request_correction') {
      newStatus = 'correction_required';
      title = 'Officer Requested Applicant Correction';
      severity = 'warning';
    } else if (decision === 'manual_review') {
      newStatus = 'manual_review';
      title = 'Application Escalated for Manual Adjudication';
      severity = 'info';
    }

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: newStatus,
          progress: decision === 'approve' ? 100 : app.progress,
          officerNotes: notes || app.officerNotes,
          lastUpdatedAt: new Date().toISOString(),
        };
      })
    );

    const evt: TimelineEvent = {
      id: `evt_dec_${Date.now()}`,
      applicationId: appId,
      timestamp: new Date().toISOString(),
      type: decision === 'approve' ? 'completed' : decision === 'request_correction' ? 'correction_requested' : 'manual_review',
      title,
      description: notes || `Officer Elena Rostova updated status to ${newStatus.toUpperCase()}.`,
      severity,
      actor: { name: currentUser.name, role: currentUser.role },
    };
    setTimeline((prev) => [evt, ...prev]);

    if (decision === 'approve') {
      const compNotif: NotificationItem = {
        id: `notif_comp_${Date.now()}`,
        userId: 'usr_rahul_01',
        applicationId: appId,
        type: 'completed',
        title: `✓ APPLICATION COMPLETED: ${appId}`,
        message: 'Your application has been successfully processed.',
        timestamp: 'Just now',
        isRead: false,
        actionUrl: 'applicant_dashboard',
      };
      setNotifications((prev) => [compNotif, ...prev]);
    }

    addToast({
      title: `Application ${appId} Certified`,
      message: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
      type: severity,
    });
  };

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled, lastUpdated: new Date().toISOString() } : r))
    );
    const rule = rules.find((r) => r.id === ruleId);
    addToast({
      title: `Rule ${rule?.name || ruleId}`,
      message: `Rule ${rule?.enabled ? 'disabled' : 'enabled'} across validation pipelines.`,
      type: 'info',
    });
  };

  const updateRuleThreshold = (ruleId: string, threshold: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, threshold, lastUpdated: new Date().toISOString() } : r))
    );
    addToast({
      title: 'Threshold Updated',
      message: `Rule threshold updated to ${threshold}%.`,
      type: 'success',
    });
  };

  const resetDemoScenario = () => {
    setApplications((prev) => {
      const otherApps = prev.filter((a) => a.id !== 'APP-1024');
      return [JSON.parse(JSON.stringify(SIGNATURE_DEMO_APP)), ...otherApps];
    });
    setActiveApplicationId('APP-1024');
    setTimeline(INITIAL_TIMELINE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRoleState('applicant');
    setCurrentUser(USERS.applicant);
    setCurrentRoute('validation_center');

    addToast({
      title: 'Demo Scenario Reset',
      message: 'APP-1024 restored to "Correction Required" state with 3 deliberate issues (Health: 68/100).',
      type: 'info',
      duration: 5000,
    });
  };

  const loadDemoScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setActiveApplicationId(scenario.targetAppId);
    setCurrentRoleState(scenario.focusRole);
    setCurrentUser(USERS[scenario.focusRole]);

    if (scenario.focusRole === 'officer') {
      setCurrentRoute('officer_review');
    } else {
      setCurrentRoute('validation_center');
    }

    addToast({
      title: `Loaded Scenario ${scenario.scenarioNumber}`,
      message: `${scenario.title} (${scenario.applicant})`,
      type: 'info',
      duration: 4000,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        currentRoute,
        setCurrentRoute,
        applications,
        activeApplicationId,
        activeApplication,
        setActiveApplicationId,
        timeline,
        telemetry,
        auditLogs,
        notifications,
        rules,
        toasts,
        addToast,
        removeToast,
        markNotificationRead,
        markAllNotificationsRead,
        isDarkMode,
        toggleDarkMode,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isSidebarCollapsed,
        setSidebarCollapsed,
        isRevalidationModalOpen,
        setRevalidationModalOpen,
        isAuditReplayOpen,
        setAuditReplayOpen,
        isRuleSimulatorOpen,
        setRuleSimulatorOpen,
        isDemoScenariosModalOpen,
        setDemoScenariosModalOpen,
        selectedDocumentForInspection,
        setSelectedDocumentForInspection,
        manualReviewModalApp,
        setManualReviewModalApp,
        isNetworkSimOffline,
        setNetworkSimOffline,
        isXRayModalOpen,
        setXRayModalOpen,
        isTimeMachineOpen,
        setTimeMachineOpen,
        isPassportModalOpen,
        setPassportModalOpen,
        isStoryModalOpen,
        setStoryModalOpen,
        isWhyWaitingOpen,
        setWhyWaitingOpen,
        selectedIssueForChain,
        setSelectedIssueForChain,
        resolveIssue,
        uploadReplacementDocument,
        triggerRevalidation,
        submitNewApplication,
        updateApplicationOfficerDecision,
        toggleRule,
        updateRuleThreshold,
        resetDemoScenario,
        loadDemoScenario,
        navigateToApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
