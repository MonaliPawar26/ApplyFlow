export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'processing'
  | 'validating'
  | 'correction_required'
  | 'revalidating'
  | 'validated'
  | 'categorized'
  | 'manual_review'
  | 'completed'
  | 'rejected';

export type ApplicationType =
  | 'business_registration'
  | 'scholarship'
  | 'loan'
  | 'general_service';

export type ApplicationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type ProcessingCategory =
  | 'standard'
  | 'expedited'
  | 'priority'
  | 'manual_escalation'
  | 'pending_verification';

export type UserRole = 'applicant' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  organization: string;
}

export type DocumentType =
  | 'pan_card'
  | 'address_proof'
  | 'identity_proof'
  | 'income_certificate'
  | 'business_license'
  | 'bank_statement'
  | 'medical_license';

export type DocumentProcessingState =
  | 'queued'
  | 'uploading'
  | 'reading'
  | 'extracting'
  | 'comparing'
  | 'completed'
  | 'failed';

export interface BoundingBox {
  x: number; // percentage (0-100)
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  isMatch: boolean;
  mismatchDetail?: string;
  boundingBox?: BoundingBox;
}

export interface DocumentItem {
  id: string;
  applicationId: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: DocumentProcessingState;
  ocrStatus: 'pending' | 'processing' | 'extracted' | 'low_confidence' | 'failed';
  ocrConfidence: number;
  previewUrl?: string;
  extractedFields: Record<string, ExtractedField>;
  validationError?: string;
  isRequired?: boolean;
}

export type ValidationSeverity = 'success' | 'warning' | 'error';
export type ValidationCategory =
  | 'identity'
  | 'application_data'
  | 'documents'
  | 'consistency'
  | 'format'
  | 'confidence';

export interface DecisionChainStep {
  stepNumber: number;
  label: string;
  value: string;
  type: 'source' | 'extracted' | 'compared' | 'rule' | 'result' | 'action';
  status?: 'pass' | 'fail' | 'warning' | 'neutral';
  details?: string;
}

export interface DecisionChain {
  ruleId: string;
  title: string;
  severity: ValidationSeverity;
  steps: DecisionChainStep[];
}

export interface AiExplanation {
  whyNeedsAttention: string;
  detectedIssue: string;
  affectedDocument: string;
  recommendedChange: string;
  suggestedCorrection?: string;
  ruleId?: string;
  decisionChain?: DecisionChain;
}

export interface ValidationIssue {
  id: string;
  field: string;
  category: ValidationCategory;
  title: string;
  severity: ValidationSeverity;
  status: 'active' | 'resolved' | 'acknowledged';
  currentValue?: string;
  expectedValue?: string;
  affectedDocument?: string;
  aiExplanation: AiExplanation;
  resolvedAt?: string;
  correctionDraft?: string;
}

export interface ValidationCategorySummary {
  status: 'verified' | 'attention' | 'missing' | 'mismatch';
  count: number;
  label: string;
}

export interface ApplicationDnaDimensions {
  completeness: number; // 0-100
  consistency: number; // 0-100
  confidence: number; // 0-100
  validation: number; // 0-100
  complexity: number; // 0-100
  slaHealth: number; // 0-100
}

export interface HealthScoreBreakdown {
  overall: number; // 0-100
  documentCompleteness: number; // 0-100
  fieldValidity: number; // 0-100
  crossDocumentConsistency: number; // 0-100
  ocrConfidence: number; // 0-100
}

export interface ValidationResult {
  overallScore: number;
  healthBreakdown: HealthScoreBreakdown;
  dna?: ApplicationDnaDimensions;
  status: ApplicationStatus;
  categories: {
    identity: ValidationCategorySummary;
    applicationData: ValidationCategorySummary;
    documents: ValidationCategorySummary;
    consistency: ValidationCategorySummary;
  };
  issues: ValidationIssue[];
  lastValidatedAt: string;
}

export interface ApplicationData {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantDob: string;
  applicantAddress: string;
  applicantCity: string;
  applicantState: string;
  applicantPostalCode: string;
  type: ApplicationType;
  typeSpecificFields: Record<string, string | number | boolean>;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  priorityReason?: string;
  category: ProcessingCategory;
  progress: number;
  submittedAt: string;
  lastUpdatedAt: string;
  slaDeadline: string; // ISO timestamp
  queuePosition?: number;
  nextAction?: {
    title: string;
    description: string;
    actionText: string;
    targetRoute: ViewRoute;
    urgency: 'critical' | 'normal' | 'info';
  };
  storySummary?: string;
  documents: DocumentItem[];
  validation: ValidationResult;
  assignedOfficer?: string;
  officerNotes?: string;
}

export interface TimelineEvent {
  id: string;
  applicationId: string;
  timestamp: string;
  type:
    | 'submitted'
    | 'document_processed'
    | 'ocr_completed'
    | 'validation_started'
    | 'issue_detected'
    | 'correction_requested'
    | 'correction_submitted'
    | 'revalidated'
    | 'categorized'
    | 'officer_review'
    | 'manual_review'
    | 'completed'
    | 'rejected';
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  actor: {
    name: string;
    role: string;
    isAi?: boolean;
  };
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  relativeMs: string;
  module: 'INGESTION' | 'VISION_OCR' | 'RULE_ENGINE' | 'CONSISTENCY' | 'CORRECTION' | 'ROUTING';
  message: string;
  latencyMs: number;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  applicationId?: string;
  action: string;
  category: 'SUBMISSION' | 'OCR' | 'VALIDATION' | 'CORRECTION' | 'OFFICER' | 'ADMIN' | 'SYSTEM';
  user: string;
  role: string;
  details: string;
  ip: string;
  severity: 'normal' | 'notice' | 'warning' | 'critical';
}

export interface NotificationItem {
  id: string;
  userId: string;
  applicationId?: string;
  type: 'correction_required' | 'validated' | 'submitted' | 'processing' | 'completed' | 'manual_review' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  category: 'required_field' | 'document' | 'format' | 'consistency' | 'confidence';
  enabled: boolean;
  threshold?: number;
  description: string;
  severity: 'error' | 'warning';
  targetType: ApplicationType | 'all';
  triggerCondition: string;
  suggestedAction: string;
  lastUpdated: string;
}

export interface DemoScenario {
  id: string;
  scenarioNumber: string;
  title: string;
  applicant: string;
  type: ApplicationType;
  description: string;
  initialIssuesCount: number;
  initialScore: number;
  targetAppId: string;
  focusRole: UserRole;
  tags: string[];
}

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export type ViewRoute =
  | 'landing'
  | 'login'
  | 'applicant_dashboard'
  | 'new_application'
  | 'validation_center'
  | 'validation_graph'
  | 'validation_galaxy'
  | 'correction_workspace'
  | 'application_detail'
  | 'officer_dashboard'
  | 'control_room'
  | 'officer_review'
  | 'analytics'
  | 'rules'
  | 'audit_logs'
  | 'notifications'
  | 'documents_hub';
