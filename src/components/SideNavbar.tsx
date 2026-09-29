import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Compass,
  AlertTriangle,
  MapPin,
  Home,
  Package,
  PhoneCall,
  Clock,
  Sparkles,
  HeartHandshake,
  LayoutDashboard,
  ShieldAlert,
  Shield,
  Heart,
  Wifi,
  WifiOff,
  LogOut,
  Radio,
  LifeBuoy,
  FileCheck,
  Languages,
  Bot,
  Bell,
  TrendingUp,
  FileText,
  CloudRain,
  BrainCircuit,
} from 'lucide-react';

interface SideNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLogout: () => void;
}

export const SideNavbar: React.FC<SideNavbarProps> = ({
  isOpen,
  onClose,
  currentTab,
  setCurrentTab,
  onOpenLogout,
}) => {
  const {
    currentUser,
    activeRole,
    offlineMode,
    toggleOfflineMode,
    isEffectiveOffline,
    isAuthenticated,
  } = useApp();

  const { language, setLanguage, t } = useLanguage();

  // STRICT ACCESS GATE: Never display or open when unauthenticated
  if (!isOpen || !isAuthenticated) return null;

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    onClose();
  };

  return (
    <>
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Long Side Navbar Drawer */}
      <aside className="fixed inset-y-0 left-0 w-80 sm:w-88 max-w-[85vw] h-full min-h-screen bg-slate-950 text-white z-50 shadow-2xl border-r border-slate-800 flex flex-col justify-between overflow-y-auto animate-slide-in">
        {/* Top Header Section */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => handleNavigate('home')}
              title="Go to Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <h1 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
                  SAHAAY
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                  {activeRole === 'admin' ? `🛡️ ${t('Admin Portal')}` : activeRole === 'volunteer' ? `🤝 ${t('Volunteer Portal')}` : `👤 ${t('Citizen Portal')}`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Official Tagline */}
          <p className="text-[11px] font-bold text-teal-300/90 mt-2.5 leading-snug font-['Outfit']">
            “{t('tagline')}”
          </p>

          {/* Emergency SOS Immediate Action Button (Citizen & Volunteer) */}
          {activeRole !== 'admin' && (
            <button
              onClick={() => handleNavigate('report_emergency')}
              className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer btn-danger-3d"
            >
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span>{t('EMERGENCY SOS REPORT')}</span>
            </button>
          )}
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="p-4 space-y-5 flex-1">
          {/* ========================================================= */}
          {/* CORE SAHAAY PRIMARY NAVIGATION (AS REQUESTED)             */}
          {/* ========================================================= */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="w-3 h-3 text-teal-400" />
                <span>{t('Navigation')}</span>
              </span>
              <span className="text-[9px] text-teal-400/80 font-mono">SAHAAY Core</span>
            </div>

            {/* 1. Dashboard */}
            <button
              onClick={() => handleNavigate(activeRole === 'admin' ? 'admin_dashboard' : activeRole === 'volunteer' ? 'volunteer_dashboard' : 'citizen_dashboard')}
              id="sidebar-nav-dashboard"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                ['citizen_dashboard', 'volunteer_dashboard', 'admin_dashboard'].includes(currentTab)
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>{t('Dashboard')}</span>
            </button>

            {/* 2. Live Map */}
            <button
              onClick={() => handleNavigate('community_map')}
              id="sidebar-nav-map"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                currentTab === 'community_map'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{t('Live Map')}</span>
            </button>

            {/* 3. Alerts */}
            <button
              onClick={() => handleNavigate('emergency_status')}
              id="sidebar-nav-alerts"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentTab === 'emergency_status'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>{t('Status & Incidents')}</span>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">LIVE</span>
            </button>

            {/* 3a. Early Warning & Weather */}
            <button
              onClick={() => handleNavigate('weather')}
              id="sidebar-nav-weather"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentTab === 'weather'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>{t('Weather Intelligence')}</span>
              </div>
              <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono font-bold">RADAR</span>
            </button>

            {/* 3b. CAP Alerts Ecosystem */}
            <button
              onClick={() => handleNavigate('cap_alerts')}
              id="sidebar-nav-cap-alerts"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentTab === 'cap_alerts'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>{t('Alert Protocol (CAP)')}</span>
              </div>
              <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold">CAP</span>
            </button>

            {/* 4. Reports */}
            <button
              onClick={() => handleNavigate('report_emergency')}
              id="sidebar-nav-reports"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentTab === 'report_emergency'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{t('Reports')}</span>
              </div>
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">SOS</span>
            </button>

            {/* 5. Shelters */}
            <button
              onClick={() => handleNavigate('shelters')}
              id="sidebar-nav-shelters"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                currentTab === 'shelters'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-teal-400" />
              <span>{t('Shelters')}</span>
            </button>

            {/* 6. Resources */}
            <button
              onClick={() => handleNavigate('requests')}
              id="sidebar-nav-resources"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                currentTab === 'requests'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-teal-400" />
              <span>{t('Resources')}</span>
            </button>

            {/* 7. AI Assistant */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-sahaay-chatbot'));
                onClose();
              }}
              id="sidebar-nav-ai"
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>{t('AI Assistant')}</span>
              </div>
              <span className="text-[9px] bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 px-1.5 py-0.5 rounded-full font-black">AI</span>
            </button>

            {/* 8. Impact & Comparative Analysis */}
            <button
              onClick={() => handleNavigate('impact')}
              id="sidebar-nav-impact"
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-between transition-all cursor-pointer border ${
                currentTab === 'impact' || currentTab === 'conclusion'
                  ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white border-teal-500 shadow-md ring-2 ring-teal-500/30'
                  : 'bg-slate-900/90 text-teal-200 hover:bg-slate-800 border-teal-500/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-teal-300" />
                <span>{t('Impact')}</span>
              </div>
              <span className="text-[9px] bg-teal-500 text-slate-950 px-2 py-0.5 rounded-full font-mono font-black shadow-xs">
                ANALYSIS
              </span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* SPECIALIZED OPERATIONAL UTILITIES                         */}
          {/* ========================================================= */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
              {t('Operations & Emergency Support')}
            </div>

            <button
              onClick={() => handleNavigate('emergency_contacts')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentTab === 'emergency_contacts' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>{t('24/7 Helplines')}</span>
              </div>
              <span className="text-[9px] bg-rose-900/60 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">112</span>
            </button>

            <button
              onClick={() => handleNavigate('preparedness')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                currentTab === 'preparedness' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{t('Preparedness Guides')}</span>
            </button>

            <button
              onClick={() => handleNavigate('recovery')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                currentTab === 'recovery' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LifeBuoy className="w-4 h-4 text-teal-400" />
              <span>{t('Post-Disaster Recovery')}</span>
            </button>

            <button
              onClick={() => handleNavigate('home')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                currentTab === 'home' ? 'bg-teal-700 text-white' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>{t('System Landing Overview')}</span>
            </button>
          </div>

          {/* VERIFIED ROLE BADGE (No unauthorized role switching) */}
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block font-mono">
              {t('Session Access Level')}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white capitalize flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeRole === 'admin' ? 'bg-teal-400' : activeRole === 'volunteer' ? 'bg-emerald-400' : 'bg-teal-500'}`}></span>
                {activeRole === 'admin' ? t('Operations Admin') : activeRole === 'volunteer' ? t('Field Volunteer') : t('Registered Citizen')}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                {t('Active')}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight pt-1">
              {t('Access is restricted to your signed-in role. Log out to sign into a different role.')}
            </p>
          </div>

          {/* LANGUAGE SELECTOR */}
          <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1.5 tracking-wider">
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('Language / भाषा')}</span>
            </span>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-1 rounded text-xs font-bold transition-all cursor-pointer text-center ${
                  language === 'en'
                    ? 'bg-teal-700 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-1 rounded text-xs font-bold transition-all cursor-pointer text-center ${
                  language === 'hi'
                    ? 'bg-teal-700 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`py-1 rounded text-xs font-bold transition-all cursor-pointer text-center ${
                  language === 'mr'
                    ? 'bg-teal-700 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          {/* CONNECTIVITY MODE TOGGLE */}
          <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              {isEffectiveOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isEffectiveOffline ? t('Offline') : t('Online')}</span>
            </span>
            <button
              onClick={toggleOfflineMode}
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              {t('Toggle')}
            </button>
          </div>
        </div>

        {/* Bottom User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 sticky bottom-0 z-10 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center uppercase shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-white truncate">
                  {currentUser?.name || 'Authorized Member'}
                </div>
                <div className="text-[10px] text-teal-300 font-semibold uppercase">
                  {t('Role')}: {activeRole}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenLogout();
              }}
              title="Logout"
              className="p-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 rounded-xl border border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('Logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
