import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './services/store';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AlertDetailsPage } from './components/pages/AlertDetailsPage';
import { AlertsListPage } from './components/pages/AlertsListPage';
import { CopilotPage } from './components/pages/CopilotPage';
import { GeneralChatPage } from './components/pages/GeneralChatPage';
import { MapPage } from './components/pages/MapPage';
import { ContactsPage } from './components/pages/ContactsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { OnboardingPage } from './components/pages/OnboardingPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { SheltersPage } from './components/pages/SheltersPage';
import { IncidentReportPage } from './components/pages/IncidentReportPage';
import { FamilySafetyPage } from './components/pages/FamilySafetyPage';
import { CommandCenterPage } from './components/pages/CommandCenterPage';
import { RecoveryPage } from './components/pages/RecoveryPage';
import { SimulationLabPage } from './components/pages/SimulationLabPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { SafetyGuidePage } from './components/pages/SafetyGuidePage';
import { AuthModal } from './components/pages/AuthModal';

const AppContent: React.FC = () => {
  const { currentPath, user, isAuthenticated } = useApp();
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const isHighContrast = user?.accessibility?.highContrast;
  const isLargeText = user?.accessibility?.largeText;

  // Render view by route
  const renderRoute = () => {
    // 1. Landing & Auth
    if (currentPath === '/') return <LandingPage />;
    if (currentPath === '/login') return <LoginPage />;
    if (currentPath === '/signup') return <SignupPage />;
    if (currentPath === '/onboarding') return <OnboardingPage />;

    // 2. Main Dashboard
    if (currentPath === '/dashboard') return <DashboardPage />;

    // 3. Alerts
    if (currentPath === '/alerts') return <AlertsListPage />;
    if (currentPath.startsWith('/alerts/')) return <AlertDetailsPage />;

    // 4. Map
    if (currentPath === '/map') return <MapPage />;

    // 5. AI Safety Assistant (Alert-Context Aware)
    if (currentPath.startsWith('/safety-assistant')) return <CopilotPage />;

    // 6. General AI Chat with Persistent History
    if (currentPath.startsWith('/chat')) return <GeneralChatPage />;

    // 7. Verified Emergency Contacts
    if (currentPath === '/contacts') return <ContactsPage />;

    // 8. Profile & Settings
    if (currentPath === '/profile') return <ProfilePage />;
    if (currentPath === '/settings') return <SettingsPage />;

    // 9. Operational Shelters, Command Center & Recovery
    if (currentPath === '/shelters') return <SheltersPage />;
    if (currentPath === '/command-center') return <CommandCenterPage />;
    if (currentPath === '/recovery') return <RecoveryPage />;
    if (currentPath === '/simulation-lab') return <SimulationLabPage />;
    if (currentPath === '/safety-guides') return <SafetyGuidePage />;
    if (currentPath === '/incident-report') return <IncidentReportPage />;
    if (currentPath === '/family-safety') return <FamilySafetyPage />;

    // Fallback
    return isAuthenticated ? <DashboardPage /> : <LandingPage />;
  };

  // Hide general footer on full-height interactive map and chat screens for optimal viewport ergonomics
  const isFullScreenView = currentPath === '/map' || currentPath.startsWith('/chat');

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white ${
        isHighContrast ? 'contrast-125 saturate-150' : ''
      } ${isLargeText ? 'text-lg' : 'text-sm'}`}
    >
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Navbar />
      <AuthModal />
      <main className="flex-1">{renderRoute()}</main>
      {!isFullScreenView && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
