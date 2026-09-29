import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { LogoutModal } from './LogoutModal';
import { SideNavbar } from './SideNavbar';
import {
  ShieldAlert,
  Bell,
  Wifi,
  WifiOff,
  User,
  Compass,
  MapPin,
  AlertTriangle,
  Home,
  HeartHandshake,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  Package,
  LogOut,
  ChevronDown,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  Radio,
  PhoneCall,
  Clock,
  Languages,
  TrendingUp,
  CloudRain,
  Mic,
  BrainCircuit,
  Route,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import { UserRole } from '../types';
import { OneTimeSmsAndVoiceModal } from './OneTimeSmsAndVoiceModal';
import { SahaayLogoMark } from '../views/AuthView';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openNotifications,
}) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    offlineMode,
    toggleOfflineMode,
    isEffectiveOffline,
    pendingSyncQueue,
    syncPendingQueue,
    notifications,
    isAuthenticated,
    logout,
    openEmergencySosModal,
    openVoiceMode,
  } = useApp();

  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSmsVoiceModalOpen, setIsSmsVoiceModalOpen] = useState(false);
  const [smsVoiceModalMode, setSmsVoiceModalMode] = useState<'sms' | 'voice'>('sms');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setProfileDropdownOpen(false);
    setCurrentTab('auth');
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'citizen') setCurrentTab('citizen_dashboard');
    else if (role === 'volunteer') setCurrentTab('volunteer_dashboard');
    else if (role === 'admin') setCurrentTab('admin_dashboard');
  };

  // User Role Badge Colors & Text
  const getRoleBadge = () => {
    if (activeRole === 'admin') {
      return {
        label: t('Administrator'),
        bg: 'bg-slate-900 text-teal-300 border-slate-700',
        icon: <Shield className="w-3.5 h-3.5 text-teal-400" />,
      };
    }
    if (activeRole === 'volunteer') {
      return {
        label: t('Volunteer'),
        bg: 'bg-emerald-700 text-white border-emerald-600',
        icon: <HeartHandshake className="w-3.5 h-3.5 text-emerald-200" />,
      };
    }
    return {
      label: t('Citizen'),
      bg: 'bg-teal-700 text-white border-teal-600',
      icon: <User className="w-3.5 h-3.5 text-teal-200" />,
    };
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel bg-white/95 border-b border-slate-200/80 shadow-xs">
      {/* Offline Mode Alert Header Banner */}
      {offlineMode && (
        <div className="bg-amber-600 text-white text-xs py-1 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-inner">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>{t('Low-Connectivity / Offline Mode Active. All reports are saved locally on device.')}</span>
          <button
            onClick={toggleOfflineMode}
            className="underline ml-2 hover:text-amber-100 text-[11px] font-extrabold cursor-pointer"
          >
            {t('Go Online')}
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Side Navbar Trigger + SAHAAY Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              title="Open Full Navigation Menu"
              className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group"
            onClick={() => {
              setCurrentTab('home');
            }}
            title="Go to Home"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-teal-800/10 group-hover:scale-105 transition-transform">
              <SahaayLogoMark className="w-9 h-9" />
            </div>
            <span className="font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-teal-950 via-teal-800 to-slate-900 bg-clip-text text-transparent font-['Outfit'] leading-none">
              SAHAAY
            </span>
          </div>
        </div>

        {/* Primary Navigation Bar (Scrollable horizontally, minimum 2-3 tabs clearly visible across mobile & desktop) */}
        {isAuthenticated && (
          <nav className="flex items-center gap-2 bg-slate-100/95 p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 overflow-x-auto nav-scroll-container scroll-smooth whitespace-nowrap min-w-[240px] sm:min-w-[340px] md:min-w-[420px] flex-1 max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-1 sm:mx-2 shadow-2xs">
            {/* CITIZEN SPECIFIC NAV ITEMS */}
            {activeRole === 'citizen' && (
              <>
                {/* 1. Preparedness (Prominent & Larger) */}
                <button
                  onClick={() => setCurrentTab('preparedness')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'preparedness'
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-teal-900 bg-white hover:bg-teal-50 border-2 border-teal-200 hover:border-teal-400'
                  }`}
                  title="Disaster Preparedness & Safety Guidelines"
                >
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600 shrink-0" />
                  <span>{t('Preparedness')}</span>
                </button>

                {/* 2. CAP Alert (Prominent & Larger) */}
                <button
                  onClick={() => setCurrentTab('cap_alerts')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'cap_alerts'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-red-900 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400'
                  }`}
                  title="Common Alerting Protocol Warning Broadcasts"
                >
                  <ShieldAlert className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-600 shrink-0" />
                  <span>{t('CAP Alerts')}</span>
                </button>

                {/* 3. Weather (Prominent & Larger) */}
                <button
                  onClick={() => setCurrentTab('weather')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'weather'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-900 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400'
                  }`}
                  title="Real-Time Meteorological Weather & Risk Intel"
                >
                  <CloudRain className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 shrink-0" />
                  <span>{t('Weather')}</span>
                </button>

                {/* 4. Citizen Hub */}
                <button
                  onClick={() => setCurrentTab('citizen_dashboard')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'citizen_dashboard'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  <span>{t('Citizen Hub')}</span>
                </button>

                {/* 5. Emergency SOS */}
                <button
                  onClick={() => setCurrentTab('report_emergency')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'report_emergency'
                      ? 'bg-rose-600 text-white shadow-md btn-danger-3d'
                      : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>{t('Emergency SOS')}</span>
                </button>

                {/* 6. Relief Map */}
                <button
                  onClick={() => setCurrentTab('community_map')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'community_map'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>{t('Relief Map')}</span>
                </button>

                {/* 7. Shelters */}
                <button
                  onClick={() => setCurrentTab('shelters')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'shelters'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Home className="w-4 h-4 text-teal-600" />
                  <span>🛏️ {t('Register Shelter')}</span>
                </button>

                {/* 8. Request Help */}
                <button
                  onClick={() => setCurrentTab('requests')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'requests'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Package className="w-4 h-4 text-teal-600" />
                  <span>📦 {t('Request Help')}</span>
                </button>

                {/* 9. Helplines */}
                <button
                  onClick={() => setCurrentTab('emergency_contacts')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'emergency_contacts'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-teal-600" />
                  <span>{t('Helplines')}</span>
                </button>

                {/* 10. Status */}
                <button
                  onClick={() => setCurrentTab('emergency_status')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'emergency_status'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>{t('Status')}</span>
                </button>
              </>
            )}

            {/* VOLUNTEER SPECIFIC NAV ITEMS */}
            {activeRole === 'volunteer' && (
              <>
                <button
                  onClick={() => setCurrentTab('preparedness')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'preparedness'
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-teal-900 bg-white hover:bg-teal-50 border-2 border-teal-200 hover:border-teal-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                  <span>{t('Preparedness')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('cap_alerts')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'cap_alerts'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-red-900 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-600" />
                  <span>{t('CAP Alerts')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('weather')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'weather'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-900 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400'
                  }`}
                >
                  <CloudRain className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                  <span>{t('Weather')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('volunteer_dashboard')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'volunteer_dashboard'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>{t('Volunteer Hub')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('community_map')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'community_map'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{t('Emergency Map')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('shelters')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'shelters'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>{t('Shelters')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('requests')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'requests'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{t('Relief Supplies')}</span>
                </button>
              </>
            )}

            {/* ADMIN SPECIFIC NAV ITEMS */}
            {activeRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentTab('preparedness')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'preparedness'
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-teal-900 bg-white hover:bg-teal-50 border-2 border-teal-200 hover:border-teal-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                  <span>{t('Preparedness')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('cap_alerts')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'cap_alerts'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-red-900 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-600" />
                  <span>{t('CAP Alerts')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('weather')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs min-h-[42px] ${
                    currentTab === 'weather'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-900 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400'
                  }`}
                >
                  <CloudRain className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                  <span>{t('Weather')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('admin_dashboard')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'admin_dashboard'
                      ? 'bg-slate-900 text-teal-300 shadow-md font-extrabold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-teal-400" />
                  <span>{t('Command Ops')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('community_map')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'community_map'
                      ? 'bg-slate-900 text-teal-300 shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>{t('Danger Zones Map')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('shelters')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'shelters'
                      ? 'bg-slate-900 text-teal-300 shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Home className="w-4 h-4 text-teal-600" />
                  <span>{t('Shelter Ops')}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('requests')}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentTab === 'requests'
                      ? 'bg-slate-900 text-teal-300 shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Package className="w-4 h-4 text-teal-600" />
                  <span>{t('Inventory')}</span>
                </button>
              </>
            )}

            {/* UNIVERSAL IMPACT & COMPARATIVE ANALYSIS TAB */}
            <button
              onClick={() => setCurrentTab('impact')}
              id="nav-tab-impact"
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'impact' || currentTab === 'conclusion'
                  ? 'bg-teal-900 text-teal-200 shadow-md ring-2 ring-teal-500/40'
                  : 'text-teal-800 bg-teal-50/90 hover:bg-teal-100 hover:text-teal-950 border border-teal-200/80 shadow-2xs'
              }`}
              title="View Impact & Comparative Analysis"
            >
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('Impact')}</span>
              <span className="text-[9px] bg-teal-600 text-white px-1.5 py-0.5 rounded-full font-mono font-bold leading-none">ANALYSIS</span>
            </button>
          </nav>
        )}

        {/* Right Section: Network Status, Notifications, and Profile Widget */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Universal Emergency SOS Beacon Trigger (Accessible in top navbar after login) */}
          {isAuthenticated && (
            <>
              <button
                type="button"
                onClick={openEmergencySosModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all cursor-pointer animate-pulse"
                title="Emergency SOS Satellite Beacon"
              >
                <span className="text-sm">🚨</span>
                <span className="hidden xs:inline">SOS</span>
              </button>
            </>
          )}

          {/* Offline / Online Status Indicator */}
          <button
            onClick={toggleOfflineMode}
            title={offlineMode ? t('Disable Manual Offline Mode') : t('Toggle Connectivity Simulation')}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
              isEffectiveOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isEffectiveOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {isEffectiveOffline ? t('Offline') : t('Online')}
            </span>
          </button>

          {/* Notifications Bell */}
          {isAuthenticated && (
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Account Section after login */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef} id="user-profile-section">
              <button
                id="user-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white pl-2.5 pr-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer border border-slate-800"
                title="Account & Language Settings"
              >
                {/* Avatar Badge */}
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center uppercase shadow-inner">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-extrabold leading-tight text-slate-100 truncate max-w-[135px]">
                    {currentUser?.name || 'Citizen User'}
                  </div>
                  <div className="text-[10px] text-teal-300 font-semibold tracking-wide flex items-center gap-1.5">
                    <span>{roleInfo.label}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[9px] font-extrabold text-teal-200 bg-teal-900/90 px-1.5 py-0.2 rounded font-mono">
                      {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'मरा'}
                    </span>
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu with Language Change Option */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-2.5 z-50 animate-fade-in space-y-1.5">
                  {/* Dropdown Profile Header */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-300 font-black text-sm flex items-center justify-center shadow-xs">
                        {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {currentUser?.name || 'Citizen User'}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {currentUser?.email || 'citizen@sahaay.org'}
                        </div>
                      </div>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase border flex items-center gap-1 ${roleInfo.bg}`}>
                        {roleInfo.icon} {roleInfo.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">
                        ID: {currentUser?.id || 'usr_cit_1'}
                      </span>
                    </div>
                  </div>

                  {/* PROMINENT LANGUAGE CHANGE OPTION IN PROFILE SECTION */}
                  <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-teal-950 flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-teal-700 shrink-0" />
                        <span>{t('Language / भाषा बदला')}</span>
                      </span>
                      <span className="text-[10px] font-black text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded-md border border-teal-200">
                        {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'मराठी'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {/* English Option */}
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                          language === 'en'
                            ? 'bg-teal-700 text-white shadow-md font-black ring-2 ring-teal-500/40'
                            : 'bg-white text-slate-700 hover:bg-teal-100/50 hover:text-slate-950 border border-slate-200'
                        }`}
                        title="Switch to English"
                      >
                        <span className="text-xs">English</span>
                        <span className={`text-[9px] font-bold ${language === 'en' ? 'text-teal-200' : 'text-slate-400'}`}>
                          {language === 'en' ? '✓ Active' : 'EN'}
                        </span>
                      </button>

                      {/* Hindi Option */}
                      <button
                        type="button"
                        onClick={() => setLanguage('hi')}
                        className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                          language === 'hi'
                            ? 'bg-teal-700 text-white shadow-md font-black ring-2 ring-teal-500/40'
                            : 'bg-white text-slate-700 hover:bg-teal-100/50 hover:text-slate-950 border border-slate-200'
                        }`}
                        title="हिंदी भाषा निवडा / चुनें"
                      >
                        <span className="text-xs">हिंदी</span>
                        <span className={`text-[9px] font-bold ${language === 'hi' ? 'text-teal-200' : 'text-slate-400'}`}>
                          {language === 'hi' ? '✓ सक्रिय' : 'HI'}
                        </span>
                      </button>

                      {/* Marathi Option */}
                      <button
                        type="button"
                        onClick={() => setLanguage('mr')}
                        className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                          language === 'mr'
                            ? 'bg-teal-700 text-white shadow-md font-black ring-2 ring-teal-500/40'
                            : 'bg-white text-slate-700 hover:bg-teal-100/50 hover:text-slate-950 border border-slate-200'
                        }`}
                        title="मराठी भाषा निवडा"
                      >
                        <span className="text-xs">मराठी</span>
                        <span className={`text-[9px] font-bold ${language === 'mr' ? 'text-teal-200' : 'text-slate-400'}`}>
                          {language === 'mr' ? '✓ सक्रिय' : 'MR'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1 space-y-0.5 text-xs font-bold text-slate-700">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (activeRole === 'citizen') setCurrentTab('citizen_dashboard');
                        else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
                        else setCurrentTab('admin_dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      <span>{t('Role Dashboard')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setCurrentTab('auth');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      <span>{t('Account Profile & Role')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setCurrentTab('preparedness');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-teal-600" />
                      <span>{t('Help & Safety Guides')}</span>
                    </button>
                  </div>

                  {/* Authenticated Role Status & Role Switcher */}
                  <div className="pt-2 pb-1.5 px-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        {t('Active Role')}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                        ✓ {t('Verified')}
                      </span>
                    </div>

                    {/* Role Switcher Chips */}
                    <div className="grid grid-cols-3 gap-1 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleRoleChange('citizen')}
                        className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                          activeRole === 'citizen'
                            ? 'bg-[#004d40] text-white shadow-xs ring-1 ring-emerald-400'
                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900'
                        }`}
                        title="Switch to Citizen Hub"
                      >
                        👤 Citizen
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleChange('volunteer')}
                        className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                          activeRole === 'volunteer'
                            ? 'bg-teal-700 text-white shadow-xs ring-1 ring-teal-400'
                            : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900'
                        }`}
                        title="Switch to Volunteer Portal"
                      >
                        🤝 Volunteer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleChange('admin')}
                        className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                          activeRole === 'admin'
                            ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-400'
                            : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900'
                        }`}
                        title="Switch to Admin Command"
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>{t('Logout from Session')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('auth')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('Sign In')}</span>
            </button>
          )}

          {/* Mobile Navigation Toggle - ONLY WHEN AUTHENTICATED */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* PROPER LONG SIDE NAVBAR (Full Screen Height Drawer) - ONLY AFTER LOGIN */}
      {isAuthenticated && (
        <SideNavbar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenLogout={() => setShowLogoutModal(true)}
        />
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        role={activeRole}
      />

      {/* In-App One-Time SMS & Voice Alert Modal */}
      <OneTimeSmsAndVoiceModal
        isOpen={isSmsVoiceModalOpen}
        onClose={() => setIsSmsVoiceModalOpen(false)}
        defaultMode={smsVoiceModalMode}
      />
    </header>
  );
};
