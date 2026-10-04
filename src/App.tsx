import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/landing/AuthPage';
import { ApplicantDashboard } from './components/applicant/ApplicantDashboard';
import { NewApplicationWizard } from './components/applicant/NewApplicationWizard';
import { ValidationCenter } from './components/applicant/ValidationCenter';
import { ValidationGraph } from './components/pipeline/ValidationGraph';
import { CorrectionWorkspace } from './components/applicant/CorrectionWorkspace';
import { DocumentIntelligenceWorkspace } from './components/applicant/DocumentIntelligenceWorkspace';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { ApplicationReviewDetail } from './components/officer/ApplicationReviewDetail';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { RuleEngine } from './components/admin/RuleEngine';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { ControlRoomBoard } from './components/intelligence/ControlRoomBoard';

const MainContent: React.FC = () => {
  const { currentRoute } = useApp();

  // Landing & Auth are full-page without the app shell
  if (currentRoute === 'landing') {
    return <LandingPage />;
  }
  if (currentRoute === 'login') {
    return <AuthPage />;
  }

  return (
    <Shell>
      {(() => {
        switch (currentRoute) {
          case 'applicant_dashboard':
            return <ApplicantDashboard />;
          case 'new_application':
            return <NewApplicationWizard />;
          case 'validation_center':
            return <ValidationCenter />;
          case 'validation_graph':
            return <ValidationGraph />;
          case 'correction_workspace':
            return <CorrectionWorkspace />;
          case 'documents_hub':
            return <DocumentIntelligenceWorkspace />;
          case 'control_room':
            return <ControlRoomBoard />;
          case 'officer_dashboard':
            return <OfficerDashboard />;
          case 'officer_review':
            return <ApplicationReviewDetail />;
          case 'analytics':
            return <AnalyticsDashboard />;
          case 'rules':
            return <RuleEngine />;
          case 'audit_logs':
            return <AuditLogsView />;
          case 'notifications':
            return <NotificationCenter />;
          default:
            return <ApplicantDashboard />;
        }
      })()}
    </Shell>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
