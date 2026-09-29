import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationDrawer } from './components/NotificationDrawer';

import { LandingPage } from './views/LandingPage';
import { AuthView } from './views/AuthView';
import { CitizenDashboard } from './views/CitizenDashboard';
import { EmergencyReportView } from './views/EmergencyReportView';
import { CommunityMapView } from './views/CommunityMapView';
import { ShelterFinderView } from './views/ShelterFinderView';
import { RequestHelpView } from './views/RequestHelpView';
import { PostDisasterRecoveryView } from './views/PostDisasterRecoveryView';
import { PreparednessView } from './views/PreparednessView';
import { VolunteerDashboard } from './views/VolunteerDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { EmergencyContactsView } from './views/EmergencyContactsView';
import { EmergencyStatusView } from './views/EmergencyStatusView';
import { ConclusionView } from './views/ConclusionView';
import { WeatherDashboardView } from './views/WeatherDashboardView';
import { CapAlertsView } from './views/CapAlertsView';
import { SmartDisasterChatbot } from './components/SmartDisasterChatbot';
import { EmergencySosModal } from './components/sos/EmergencySosModal';
import { VoiceEmergencyAssistantModal } from './components/voice/VoiceEmergencyAssistantModal';
import { AiDisasterAnalysisCenter } from './components/analysis/AiDisasterAnalysisCenter';
import { DeepfakeMediaVerificationView } from './components/verification/DeepfakeMediaVerificationView';
import { VolunteerGroupManager } from './components/groups/VolunteerGroupManager';
import { AiRiskAndReplayView } from './views/AiRiskAndReplayView';

function MainAppContent() {
  const {
    isAuthenticated,
    activeRole,
    isEmergencySosModalOpen,
    closeEmergencySosModal,
    isVoiceModeOpen,
    closeVoiceMode,
  } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('auth');
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Sync currentTab on login/logout state changes
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentTab !== 'auth') {
        setCurrentTab('auth');
      }
    } else if (currentTab === 'auth') {
      if (activeRole === 'admin') setCurrentTab('admin_dashboard');
      else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
      else setCurrentTab('citizen_dashboard');
    }
  }, [isAuthenticated, activeRole, currentTab]);

  const renderCurrentView = () => {
    // STRICT SECURITY GATE: No views accessible without login!
    if (!isAuthenticated) {
      return <AuthView setCurrentTab={setCurrentTab} />;
    }

    // STRICT ROLE SEPARATION: Citizen only gets Citizen views
    if (activeRole === 'citizen') {
      switch (currentTab) {
        case 'citizen_dashboard':
          return <CitizenDashboard setCurrentTab={setCurrentTab} />;
        case 'report_emergency':
          return <EmergencyReportView setCurrentTab={setCurrentTab} />;
        case 'community_map':
          return <CommunityMapView />;
        case 'shelters':
          return <ShelterFinderView setCurrentTab={setCurrentTab} />;
        case 'requests':
          return <RequestHelpView setCurrentTab={setCurrentTab} />;
        case 'emergency_contacts':
          return <EmergencyContactsView setCurrentTab={setCurrentTab} />;
        case 'emergency_status':
          return <EmergencyStatusView setCurrentTab={setCurrentTab} />;
        case 'weather':
          return <WeatherDashboardView setCurrentTab={setCurrentTab} />;
        case 'cap_alerts':
          return <CapAlertsView setCurrentTab={setCurrentTab} />;
        case 'preparedness':
          return <PreparednessView setCurrentTab={setCurrentTab} />;
        case 'ai_risk_roads':
        case 'district_explorer':
        case 'risk_intelligence':
        case 'decision_replay':
        case 'road_accessibility':
          return <AiRiskAndReplayView setCurrentTab={setCurrentTab} />;
        case 'recovery':
          return <PostDisasterRecoveryView setCurrentTab={setCurrentTab} />;
        case 'conclusion':
        case 'impact':
          return <ConclusionView setCurrentTab={setCurrentTab} />;
        case 'home':
          return <LandingPage setCurrentTab={setCurrentTab} />;
        default:
          return <CitizenDashboard setCurrentTab={setCurrentTab} />;
      }
    }

    // STRICT ROLE SEPARATION: Volunteer only gets Volunteer views
    if (activeRole === 'volunteer') {
      switch (currentTab) {
        case 'volunteer_dashboard':
          return <VolunteerDashboard setCurrentTab={setCurrentTab} />;
        case 'volunteer_groups':
          return <VolunteerGroupManager />;
        case 'community_map':
          return <CommunityMapView />;
        case 'requests':
          return <RequestHelpView setCurrentTab={setCurrentTab} />;
        case 'shelters':
          return <ShelterFinderView setCurrentTab={setCurrentTab} />;
        case 'emergency_status':
          return <EmergencyStatusView setCurrentTab={setCurrentTab} />;
        case 'weather':
          return <WeatherDashboardView setCurrentTab={setCurrentTab} />;
        case 'cap_alerts':
          return <CapAlertsView setCurrentTab={setCurrentTab} />;
        case 'ai_risk_roads':
        case 'district_explorer':
        case 'risk_intelligence':
        case 'decision_replay':
        case 'road_accessibility':
          return <AiRiskAndReplayView setCurrentTab={setCurrentTab} />;
        case 'report_emergency':
          return <EmergencyReportView setCurrentTab={setCurrentTab} />;
        case 'emergency_contacts':
          return <EmergencyContactsView setCurrentTab={setCurrentTab} />;
        case 'preparedness':
          return <PreparednessView setCurrentTab={setCurrentTab} />;
        case 'recovery':
          return <PostDisasterRecoveryView setCurrentTab={setCurrentTab} />;
        case 'conclusion':
        case 'impact':
          return <ConclusionView setCurrentTab={setCurrentTab} />;
        case 'home':
          return <LandingPage setCurrentTab={setCurrentTab} />;
        default:
          return <VolunteerDashboard setCurrentTab={setCurrentTab} />;
      }
    }

    // STRICT ROLE SEPARATION: Admin only gets Admin views
    if (activeRole === 'admin') {
      switch (currentTab) {
        case 'admin_dashboard':
          return <AdminDashboard setCurrentTab={setCurrentTab} />;
        case 'ai_risk_roads':
        case 'district_explorer':
        case 'risk_intelligence':
        case 'decision_replay':
        case 'road_accessibility':
          return <AiRiskAndReplayView setCurrentTab={setCurrentTab} />;
        case 'ai_analysis':
          return <AiDisasterAnalysisCenter />;
        case 'deepfake_locator':
        case 'media_verification':
          return <DeepfakeMediaVerificationView />;
        case 'volunteer_groups':
          return <VolunteerGroupManager />;
        case 'community_map':
          return <CommunityMapView />;
        case 'shelters':
          return <ShelterFinderView setCurrentTab={setCurrentTab} />;
        case 'requests':
          return <RequestHelpView setCurrentTab={setCurrentTab} />;
        case 'emergency_status':
          return <EmergencyStatusView setCurrentTab={setCurrentTab} />;
        case 'weather':
          return <WeatherDashboardView setCurrentTab={setCurrentTab} />;
        case 'cap_alerts':
          return <CapAlertsView setCurrentTab={setCurrentTab} />;
        case 'recovery':
          return <PostDisasterRecoveryView setCurrentTab={setCurrentTab} />;
        case 'preparedness':
          return <PreparednessView setCurrentTab={setCurrentTab} />;
        case 'report_emergency':
          return <EmergencyReportView setCurrentTab={setCurrentTab} />;
        case 'emergency_contacts':
          return <EmergencyContactsView setCurrentTab={setCurrentTab} />;
        case 'conclusion':
        case 'impact':
          return <ConclusionView setCurrentTab={setCurrentTab} />;
        case 'home':
          return <LandingPage setCurrentTab={setCurrentTab} />;
        default:
          return <AdminDashboard setCurrentTab={setCurrentTab} />;
      }
    }

    return <AuthView setCurrentTab={setCurrentTab} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation - ONLY WHEN LOGGED IN (removed from login page as requested) */}
      {isAuthenticated && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          openNotifications={() => setNotificationsOpen(true)}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Application Footer - ONLY AFTER LOGIN */}
      {isAuthenticated ? (
        <Footer />
      ) : (
        /* Minimal copyright for login screen with zero application options */
        <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
          © 2026 SAHAAY. All rights reserved.
        </footer>
      )}

      {/* Floating Corner Chatbot - ONLY AFTER LOGIN (hidden on citizen hub for clean, simple layout) */}
      {isAuthenticated && currentTab !== 'citizen_dashboard' && (
        <SmartDisasterChatbot setCurrentTab={setCurrentTab} />
      )}

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Global Satellite Emergency SOS Modal (Accessible outside & inside login) */}
      <EmergencySosModal
        isOpen={isEmergencySosModalOpen}
        onClose={closeEmergencySosModal}
      />

      {/* Global Voice Emergency Assistant Modal */}
      <VoiceEmergencyAssistantModal
        isOpen={isVoiceModeOpen}
        onClose={closeVoiceMode}
        onNavigate={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </AppProvider>
  );
}
