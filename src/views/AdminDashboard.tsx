import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyType, SeverityLevel, ReportStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  Package,
  Home,
  Megaphone,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Radio,
  FileText,
  Layers,
  Sparkles,
  Lock,
  KeyRound,
  Shield,
  AlertOctagon,
  ArrowRight,
  LogOut,
  Eye,
  EyeOff,
  CloudRain,
  Activity,
  Phone,
  Search,
  Check,
  BrainCircuit,
  MapPin,
} from 'lucide-react';
import { WeatherDashboard } from '../components/weather/WeatherDashboard';
import { CapAlertList } from '../components/alerts/CapAlertList';
import { EmergencyContactRegistry } from '../components/alerts/EmergencyContactRegistry';
import { AiDisasterAnalysisCenter } from '../components/analysis/AiDisasterAnalysisCenter';
import { DeepfakeMediaVerificationView } from '../components/verification/DeepfakeMediaVerificationView';
import { VolunteerGroupManager } from '../components/groups/VolunteerGroupManager';

interface AdminDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentTab }) => {
  const {
    currentUser,
    emergencyReports,
    helpRequests,
    shelters,
    alerts,
    resources,
    roadBlocks,
    volunteers,
    assignVolunteerToEmergency,
    unassignVolunteerFromEmergency,
    reopenReport,
    realTimeEvents,
    isRealTimeLive,
    toggleRealTimeLive,
    activeRespondersCount,
    verifyReport,
    rejectReport,
    resolveReport,
    createAlert,
    updateResourceStock,
    updateShelterOccupancy,
    isAdminVerified,
    logoutAdmin,
    logout,
    userLocation,
    userLocationAddress,
    gpsStatus,
    requestLiveLocation,
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    | 'overview'
    | 'ai_analysis'
    | 'deepfake_locator'
    | 'volunteer_squads'
    | 'reports'
    | 'alerts'
    | 'volunteers'
    | 'resources'
    | 'shelters'
    | 'cap_ecosystem'
    | 'weather_intel'
    | 'registry'
  >('overview');

  // Filter state for reports
  const safeReports = emergencyReports || [];
  const safeAlerts = alerts || [];
  const safeVolunteers = volunteers || [];
  const safeResources = resources || [];
  const safeShelters = shelters || [];
  const safeRoadBlocks = roadBlocks || [];
  const safeHelpRequests = helpRequests || [];

  const [reportFilterSeverity, setReportFilterSeverity] = useState<string>('ALL');
  const [reportFilterStatus, setReportFilterStatus] = useState<string>('ALL');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  // Filter state for volunteers
  const [volunteerFilterStatus, setVolunteerFilterStatus] = useState<string>('ALL');
  const [volunteerSkillFilter, setVolunteerSkillFilter] = useState<string>('ALL');

  // New Alert Form state
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertDesc, setNewAlertDesc] = useState('');
  const [newAlertArea, setNewAlertArea] = useState('');
  const [newAlertDisaster, setNewAlertDisaster] = useState<EmergencyType>('Flood');
  const [newAlertSeverity, setNewAlertSeverity] = useState<SeverityLevel>('CRITICAL');

  const handlePublishAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertDesc) return;

    createAlert({
      title: newAlertTitle,
      disasterType: newAlertDisaster,
      description: newAlertDesc,
      affectedArea: newAlertArea || 'District Flood Zone',
      severity: newAlertSeverity,
      safetyInstructions: [
        'Follow official command center safety guidelines.',
        'Evacuate low lying areas immediately.',
      ],
    });

    setNewAlertTitle('');
    setNewAlertDesc('');
    setNewAlertArea('');
  };

  // Metrics Counters
  const activeAlertsCount = (alerts || []).filter((a) => a.active).length;
  const criticalReportsCount = (emergencyReports || []).filter((r) => r.severity === 'CRITICAL').length;
  const activeVolunteersCount = (volunteers || []).length;
  const openRequestsCount = (helpRequests || []).filter((r) => r.status !== 'RESOLVED').length;
  const openSheltersCount = (shelters || []).filter((s) => s.isOpen).length;
  const resourceWarningsCount = (resources || []).filter(
    (r) => r.status === 'LOW_STOCK' || r.status === 'CRITICAL'
  ).length;

  // Emergency Resolution & Volunteer Handling Counters
  const totalReportsCount = (emergencyReports || []).length;
  const solvedReportsCount = (emergencyReports || []).filter((r) => r.status === 'RESOLVED').length;
  const inProgressReportsCount = (emergencyReports || []).filter(
    (r) => (r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED') && r.status !== 'RESOLVED'
  ).length;
  const awaitingReportsCount = (emergencyReports || []).filter(
    (r) => !r.assignedVolunteerId && r.status !== 'RESOLVED'
  ).length;

  // Analytics Chart Data
  const reportsByTypeData = [
    { name: 'Flood', count: (emergencyReports || []).filter((r) => r.type === 'Flood').length + 3 },
    { name: 'Fire', count: (emergencyReports || []).filter((r) => r.type === 'Fire').length + 1 },
    { name: 'Landslide', count: (emergencyReports || []).filter((r) => r.type === 'Landslide').length + 2 },
    { name: 'Medical', count: (emergencyReports || []).filter((r) => r.type === 'Medical Emergency').length + 1 },
    { name: 'Road Block', count: (roadBlocks || []).length + 2 },
  ];

  const requestsBySeverityData = [
    { name: 'Critical', value: (helpRequests || []).filter((r) => r.urgency === 'CRITICAL').length + 2, color: '#e11d48' },
    { name: 'High', value: (helpRequests || []).filter((r) => r.urgency === 'HIGH').length + 3, color: '#ea580c' },
    { name: 'Medium', value: (helpRequests || []).filter((r) => r.urgency === 'MEDIUM').length + 2, color: '#eab308' },
    { name: 'Low', value: (helpRequests || []).filter((r) => r.urgency === 'LOW').length + 1, color: '#10b981' },
  ];

  const filteredReports = (emergencyReports || []).filter((rep) => {
    if (reportFilterSeverity !== 'ALL' && rep.severity !== reportFilterSeverity) return false;
    if (reportFilterStatus === 'SOLVED' && rep.status !== 'RESOLVED') return false;
    if (reportFilterStatus === 'UNSOLVED' && rep.status === 'RESOLVED') return false;
    if (reportFilterStatus === 'HANDLED' && (!rep.assignedVolunteerId || rep.status === 'RESOLVED')) return false;
    if (reportFilterStatus === 'AWAITING' && (rep.assignedVolunteerId || rep.status === 'RESOLVED')) return false;
    if (reportSearchQuery.trim()) {
      const q = reportSearchQuery.toLowerCase();
      const match =
        rep.title.toLowerCase().includes(q) ||
        rep.locationAddress.toLowerCase().includes(q) ||
        rep.description.toLowerCase().includes(q) ||
        (rep.reporterName && rep.reporterName.toLowerCase().includes(q)) ||
        (rep.assignedVolunteerName && rep.assignedVolunteerName.toLowerCase().includes(q)) ||
        rep.type.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* COMMAND CENTER HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-teal-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-600 rounded-lg animate-pulse">
                <Radio className="w-4 h-4 text-white" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400">
                DISTRICT OPERATIONS COMMAND
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1 font-['Outfit']">
              SAHAAY RESPONSE CENTER
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
              <span>Admin Officer: <strong className="text-teal-300 font-extrabold">{currentUser.name || 'Commanding Officer'}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-teal-400">📍</span>
                <strong className="text-slate-200">{userLocationAddress || 'District Command Center'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={requestLiveLocation}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <div className={`w-2 h-2 rounded-full ${gpsStatus === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{gpsStatus === 'ACQUIRING' ? 'Syncing GPS...' : 'Sync GPS'}</span>
            </button>
            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/40">
              🟢 OPERATIONAL
            </span>
            <button
              onClick={() => {
                logoutAdmin();
                setCurrentTab('auth');
              }}
              className="px-3.5 py-1.5 bg-rose-950/90 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-bold border border-rose-800/80 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>

        {/* TOP COUNTERS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ACTIVE ALERTS</span>
            <span className="text-2xl font-black text-rose-500">{activeAlertsCount.toString().padStart(2, '0')}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">CRITICAL REPORTS</span>
            <span className="text-2xl font-black text-amber-500">{criticalReportsCount.toString().padStart(2, '0')}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ACTIVE VOLUNTEERS</span>
            <span className="text-2xl font-black text-emerald-400">{activeVolunteersCount.toString().padStart(2, '0')}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">OPEN REQUESTS</span>
            <span className="text-2xl font-black text-sky-400">{openRequestsCount.toString().padStart(2, '0')}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">OPEN SHELTERS</span>
            <span className="text-2xl font-black text-blue-400">{openSheltersCount.toString().padStart(2, '0')}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">RESOURCE WARNINGS</span>
            <span className="text-2xl font-black text-rose-400">{resourceWarningsCount.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* EMERGENCY RESOLUTION & VOLUNTEER DISPATCH OVERSIGHT BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-800/60 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">ALL CITIZEN EMERGENCIES</span>
            <span className="text-xl font-black text-white">{totalReportsCount} reports</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-emerald-900/40">
            <span className="text-[10px] uppercase font-extrabold text-emerald-400 block">✅ PROBLEM SOLVED</span>
            <span className="text-xl font-black text-emerald-400">{solvedReportsCount} solved</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-amber-900/40">
            <span className="text-[10px] uppercase font-extrabold text-amber-400 block">🟠 HANDLED BY VOLUNTEER</span>
            <span className="text-xl font-black text-amber-400">{inProgressReportsCount} in action</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-rose-900/40">
            <span className="text-[10px] uppercase font-extrabold text-rose-400 block">🔴 AWAITING VOLUNTEER</span>
            <span className="text-xl font-black text-rose-400">{awaitingReportsCount} unhandled</span>
          </div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setCurrentTab('ai_risk_roads')}
          className="px-4 py-2 rounded-xl text-xs font-black transition-all bg-teal-700 text-white shadow-md hover:bg-teal-800 flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <BrainCircuit className="w-4 h-4 text-white" />
          <span>🗺️ Maharashtra Intelligence</span>
          <span className="bg-teal-900 text-[10px] px-1.5 py-0.2 rounded font-mono">36 DISTRICTS</span>
        </button>

        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'overview' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📊 Live Situation Panel
        </button>

        <button
          onClick={() => setCurrentTab('district_explorer')}
          className="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-gradient-to-r from-teal-900 to-slate-900 text-teal-300 border border-teal-500/50 shadow-sm hover:from-teal-800 hover:to-slate-800 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>District & City Explorer</span>
          <span className="text-[9px] bg-teal-400 text-slate-950 font-mono px-1.5 py-0.2 rounded font-black">
            NEW
          </span>
        </button>

        <button
          onClick={() => setAdminTab('ai_analysis')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            adminTab === 'ai_analysis'
              ? 'bg-gradient-to-r from-teal-700 to-indigo-700 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-950 font-bold bg-white/70'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Data Analysis</span>
          <span className="text-[9px] bg-teal-500/20 text-teal-900 font-mono px-1 py-0.2 rounded font-black">
            AI ENGINE
          </span>
        </button>

        <button
          onClick={() => setAdminTab('deepfake_locator')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            adminTab === 'deepfake_locator'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-950 font-bold bg-white/70'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
          <span>Deepfake Disaster Locator</span>
          <span className="text-[9px] bg-rose-500/20 text-rose-900 font-mono px-1 py-0.2 rounded font-black">
            FORENSICS
          </span>
        </button>

        <button
          onClick={() => setAdminTab('volunteer_squads')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            adminTab === 'volunteer_squads'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-950 font-bold bg-white/70'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-300" />
          <span>Volunteer Squads</span>
          <span className="text-[9px] bg-indigo-500/20 text-indigo-900 font-mono px-1 py-0.2 rounded font-black">
            GROUPS
          </span>
        </button>

        <button
          onClick={() => setAdminTab('cap_ecosystem')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            adminTab === 'cap_ecosystem' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Common Alerting Protocol (CAP)</span>
        </button>

        <button
          onClick={() => setAdminTab('weather_intel')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            adminTab === 'weather_intel' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Weather Radar & Hazard Matrix</span>
        </button>

        <button
          onClick={() => setAdminTab('registry')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            adminTab === 'registry' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Emergency Contact Registry</span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'reports' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🚨 Reports Management ({safeReports.length})
        </button>

        <button
          onClick={() => setAdminTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'alerts' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📢 Disaster Alert Publisher ({safeAlerts.length})
        </button>

        <button
          onClick={() => setAdminTab('volunteers')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'volunteers' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🛡️ Field Volunteers & Dispatch ({safeVolunteers.length})
        </button>

        <button
          onClick={() => setAdminTab('resources')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'resources' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📦 Resource Inventory ({safeResources.length})
        </button>

        <button
          onClick={() => setAdminTab('shelters')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            adminTab === 'shelters' ? 'bg-slate-900 text-teal-300 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🏠 Shelter Management ({safeShelters.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* LIVE CITIZEN EMERGENCIES RESOLUTION & VOLUNTEER ASSIGNMENT TRACKER */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-rose-600 text-white rounded-xl shadow-xs">
                    <Radio className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
                    Citizen Emergency Resolution & Volunteer Dispatch Oversight
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Live command tracking of citizen emergencies: monitor whether problems are solved and which volunteer is handling each incident.
                </p>
              </div>

              <button
                onClick={() => setAdminTab('reports')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-teal-300 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>Manage Reports ({emergencyReports.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Emergencies</span>
                <span className="text-2xl font-black text-slate-900">{totalReportsCount}</span>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Problem Solved</span>
                <span className="text-2xl font-black text-emerald-700">{solvedReportsCount}</span>
              </div>
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-800/30">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Being Handled</span>
                <span className="text-2xl font-black text-amber-700">{inProgressReportsCount}</span>
              </div>
              <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Awaiting Volunteer</span>
                <span className="text-2xl font-black text-rose-700">{awaitingReportsCount}</span>
              </div>
            </div>

            {/* Live Incidents Roster */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {safeReports.map((rep) => {
                const isSolved = rep.status === 'RESOLVED';
                const isHandled = !!rep.assignedVolunteerName;
                const matchedVol = safeVolunteers.find((v) => v.id === rep.assignedVolunteerId);

                return (
                  <div
                    key={rep.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            rep.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rep.severity} • {rep.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          #{rep.id}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{rep.title}</h4>
                      <p className="text-xs text-slate-500">📍 {rep.locationAddress}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Problem Status: Solved or Not */}
                      <div className="text-left md:text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          PROBLEM STATUS
                        </span>
                        {isSolved ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            SOLVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            NOT SOLVED ({rep.status})
                          </span>
                        )}
                      </div>

                      {/* Volunteer Handled By */}
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 min-w-[200px]">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          HANDLED BY VOLUNTEER
                        </span>
                        {isHandled ? (
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <div className="flex items-center gap-1.5 truncate">
                              <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span className="text-xs font-extrabold text-slate-900 truncate">
                                {rep.assignedVolunteerName}
                              </span>
                            </div>
                            {matchedVol && (
                              <a
                                href={`tel:${matchedVol.phone}`}
                                className="text-[11px] text-teal-700 font-bold hover:underline shrink-0"
                              >
                                📞 Call
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-extrabold text-rose-600 mt-0.5">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>⚠️ Not Handled (Unassigned)</span>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div>
                        {isSolved ? (
                          <button
                            onClick={() => reopenReport(rep.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Reopen
                          </button>
                        ) : (
                          <button
                            onClick={() => resolveReport(rep.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
                          >
                            Mark Solved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="font-extrabold text-slate-900 text-lg mb-4 font-['Outfit']">
              CURRENT SITUATION & DISASTER ANALYTICS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reports By Type Bar Chart */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase mb-3">
                  Incidents Breakdown By Category
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportsByTypeData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Requests By Severity Pie Chart */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase mb-3">
                  Relief Requests Urgency Distribution
                </h4>
                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requestsBySeverityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {requestsBySeverityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS MANAGEMENT */}
      {adminTab === 'reports' && (
        <div className="space-y-5">
          {/* Enhanced Filter & Search Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-['Outfit']">
                  Incident Reports Management & Dispatch Board
                </h3>
                <p className="text-xs text-slate-500">
                  Track whether citizen emergency reports are solved or unsolved, and manage volunteer responders.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Showing <strong>{filteredReports.length}</strong> of {safeReports.length} reports</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search title, location, citizen or volunteer..."
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:bg-white focus:outline-teal-600"
                />
              </div>

              {/* Status Filter (Problem Solved / Unsolved) */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-500 shrink-0">Problem Status:</span>
                <select
                  value={reportFilterStatus}
                  onChange={(e) => setReportFilterStatus(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  <option value="ALL">All Statuses ({safeReports.length})</option>
                  <option value="SOLVED">✅ Solved Only ({solvedReportsCount})</option>
                  <option value="UNSOLVED">🔴 Not Solved ({safeReports.length - solvedReportsCount})</option>
                  <option value="HANDLED">🟠 Handled by Volunteer ({inProgressReportsCount})</option>
                  <option value="AWAITING">⚠️ Awaiting Volunteer ({awaitingReportsCount})</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-500 shrink-0">Severity:</span>
                <select
                  value={reportFilterSeverity}
                  onChange={(e) => setReportFilterSeverity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">🔴 Critical</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="LOW">🟢 Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                No incident reports match your active filter criteria.
              </div>
            ) : (
              filteredReports.map((rep) => {
                const isSolved = rep.status === 'RESOLVED';
                const isHandled = !!rep.assignedVolunteerName;
                const matchedVol = safeVolunteers.find((v) => v.id === rep.assignedVolunteerId);

                return (
                  <div
                    key={rep.id}
                    className={`bg-white p-6 rounded-3xl border ${
                      isSolved
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : rep.severity === 'CRITICAL'
                        ? 'border-rose-300 ring-1 ring-rose-100'
                        : 'border-slate-200'
                    } shadow-md space-y-4 transition-all`}
                  >
                    {/* TOP RESOLUTION STATUS BANNER */}
                    {isSolved ? (
                      <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-extrabold text-emerald-900 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>PROBLEM STATUS: SOLVED & CITIZEN ASSISTANCE COMPLETED</span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg self-start sm:self-auto">
                          VERIFIED RESOLVED
                        </span>
                      </div>
                    ) : isHandled ? (
                      <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-extrabold text-amber-900 text-xs flex items-center gap-2">
                          <Activity className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                          <span>PROBLEM STATUS: NOT SOLVED — Volunteer Field Responder Handling On Scene</span>
                        </span>
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg self-start sm:self-auto">
                          ACTIVE IN PROGRESS ({rep.status})
                        </span>
                      </div>
                    ) : (
                      <div className="bg-rose-50 border border-rose-300 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-extrabold text-rose-900 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>PROBLEM STATUS: NOT SOLVED — Awaiting Volunteer Response</span>
                        </span>
                        <span className="text-[10px] font-black text-rose-900 bg-rose-100 px-2 py-0.5 rounded-lg self-start sm:self-auto">
                          UNASSIGNED PENDING
                        </span>
                      </div>
                    )}

                    {/* Report Information Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                              rep.severity === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : rep.severity === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {rep.severity} • {rep.type}
                          </span>
                          <span className="text-xs font-mono text-slate-400">ID: #{rep.id}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mt-1.5">{rep.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">📍 {rep.locationAddress}</p>
                      </div>

                      {/* Admin Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {rep.status === 'PENDING' && (
                          <button
                            onClick={() => verifyReport(rep.id)}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-teal-300 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                          >
                            OFFICIALLY VERIFY
                          </button>
                        )}
                        {!isSolved ? (
                          <button
                            onClick={() => resolveReport(rep.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" /> MARK AS SOLVED
                          </button>
                        ) : (
                          <button
                            onClick={() => reopenReport(rep.id)}
                            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> REOPEN EMERGENCY
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>

                    {/* Affected statistics if available */}
                    {rep.affected && (
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-wrap items-center gap-4 text-xs font-semibold">
                        <span className="text-slate-400 uppercase text-[10px] font-bold">Affected Persons:</span>
                        <span>Total: <strong className="text-slate-900">{rep.affected.total}</strong></span>
                        <span>Children: <strong className="text-amber-700">{rep.affected.children}</strong></span>
                        <span>Elderly: <strong className="text-rose-700">{rep.affected.elderly}</strong></span>
                        <span>Special Needs: <strong className="text-purple-700">{rep.affected.specialAssistance}</strong></span>
                      </div>
                    )}

                    {rep.photoUrl && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-48">
                        <img src={rep.photoUrl} alt={rep.title} className="w-full h-40 object-cover" />
                      </div>
                    )}

                    {/* DEDICATED VOLUNTEER HANDLING & DISPATCH SECTION */}
                    <div className="pt-1">
                      {isHandled ? (
                        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-sm border border-teal-200">
                              {rep.assignedVolunteerName?.charAt(0) || 'V'}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                                Volunteer Handling This Emergency:
                              </span>
                              <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                {rep.assignedVolunteerName}
                                {matchedVol && (
                                  <span className="text-xs text-teal-700 font-semibold">
                                    ({matchedVol.badge || 'Volunteer Responder'})
                                  </span>
                                )}
                              </h5>
                              {matchedVol && (
                                <p className="text-xs text-slate-500">
                                  📞 {matchedVol.phone} • 📍 {matchedVol.location}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {matchedVol && (
                              <a
                                href={`tel:${matchedVol.phone}`}
                                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-teal-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                              >
                                <Phone className="w-3.5 h-3.5" /> Call Volunteer
                              </a>
                            )}
                            <button
                              onClick={() => unassignVolunteerFromEmergency(rep.id)}
                              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              title="Unassign this volunteer"
                            >
                              Unassign / Reassign
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wide block">
                              Volunteer Handling Status:
                            </span>
                            <p className="text-xs font-bold text-rose-900 mt-0.5">
                              ⚠️ No volunteer has claimed or been assigned to this emergency yet.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              className="p-2.5 rounded-xl border border-rose-300 bg-white text-xs font-bold text-slate-800 cursor-pointer shadow-xs"
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignVolunteerToEmergency(e.target.value, rep.id, rep.title);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                ⚡ Dispatch Volunteer to this Incident...
                              </option>
                              {safeVolunteers.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name} ({v.availability === 'AVAILABLE' ? '🟢 Available' : '🟠 Busy'}) - {v.skills?.join(', ') || 'Field Volunteer'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-semibold">
                      <span>Community Confirmations: 82%</span>
                      <span>Reporter: {rep.reporterName || 'Citizen'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ALERTS PUBLISHER */}
      {adminTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="card-3d bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-rose-600" /> Publish Disaster Alert Broadcast
              </h3>

              <form onSubmit={handlePublishAlert} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="text-slate-700 block mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    placeholder="e.g. RED ALERT: River Inundation Hazard"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Affected Area</label>
                  <input
                    type="text"
                    required
                    value={newAlertArea}
                    onChange={(e) => setNewAlertArea(e.target.value)}
                    placeholder="e.g. Riverside Settlements Zone 4"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Disaster Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newAlertDesc}
                    onChange={(e) => setNewAlertDesc(e.target.value)}
                    placeholder="Enter instructions for citizens..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-md btn-danger-3d cursor-pointer"
                >
                  PUBLISH OFFICIAL DISASTER ALERT
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
              Published Active Alerts
            </h3>
            {safeAlerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-white p-5 rounded-3xl border border-rose-200 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    OFFICIAL BROADCAST
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{alt.publishedAt}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{alt.title}</h4>
                <p className="text-xs text-slate-600">{alt.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: FIELD VOLUNTEERS & DISPATCH */}
      {adminTab === 'volunteers' && (
        <div className="space-y-6">
          {/* Volunteer Status Header & Filters */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">
                    🛡️ ACTIVE FORCE
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
                    Field Volunteer Roster & Rapid Dispatch Console
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage {safeVolunteers.length} registered on-ground volunteers, view live telemetry GPS coordinates, and dispatch response personnel to high-severity incidents.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRealTimeLive}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isRealTimeLive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  {isRealTimeLive ? 'Simulating Real-Time Movements' : 'Live Movement Paused'}
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
              <span className="text-slate-400">Status:</span>
              {(['ALL', 'AVAILABLE', 'ON_MISSION', 'BUSY'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setVolunteerFilterStatus(st)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    volunteerFilterStatus === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL'
                    ? `All (${(volunteers || []).length})`
                    : st === 'AVAILABLE'
                    ? `🟢 Available (${(volunteers || []).filter((v) => v.availability === 'AVAILABLE').length})`
                    : st === 'ON_MISSION'
                    ? `🟠 On Mission (${(volunteers || []).filter((v) => v.availability === 'ON_MISSION').length})`
                    : `🟣 Busy / Training (${(volunteers || []).filter((v) => v.availability === 'BUSY').length})`}
                </button>
              ))}

              <span className="text-slate-400 ml-2">Skill:</span>
              {['ALL', 'Boat Rescue', 'First Aid', 'Drone Recon', 'Search & Rescue'].map((sk) => (
                <button
                  key={sk}
                  onClick={() => setVolunteerSkillFilter(sk)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    volunteerSkillFilter === sk
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Volunteers Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(volunteers || [])
              .filter((v) => {
                if (volunteerFilterStatus !== 'ALL' && v.availability !== volunteerFilterStatus) return false;
                if (volunteerSkillFilter !== 'ALL' && !v.skills?.includes(volunteerSkillFilter)) return false;
                return true;
              })
              .map((vol) => {
                const isAvail = vol.availability === 'AVAILABLE';
                const isOnMission = vol.availability === 'ON_MISSION';

                return (
                  <div
                    key={vol.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            isAvail
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isOnMission
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}
                        >
                          {isAvail ? '🟢 AVAILABLE' : isOnMission ? '🟠 ON MISSION' : '🟣 BUSY'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {vol.lastActive || 'Active'}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                          {vol.name}
                        </h4>
                        <p className="text-xs font-semibold text-teal-700">{vol.badge || 'Field Volunteer'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          📍 {vol.location} ({vol.lat?.toFixed(4)}, {vol.lng?.toFixed(4)})
                        </p>
                      </div>

                      {vol.assignedIncidentTitle && (
                        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-semibold">
                          🎯 <strong>Mission:</strong> {vol.assignedIncidentTitle}
                        </div>
                      )}

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(vol.skills || ['General']).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Missions: <strong>{vol.completedMissions || 10}</strong></span>
                        <span>Experience: <strong>{vol.experienceYears || 2} yrs</strong></span>
                      </div>

                      {/* Quick Mission Dispatch Dropdown */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                          Instant Incident Dispatch:
                        </label>
                        <select
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 cursor-pointer"
                          value={vol.assignedIncidentId || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const rep = safeReports.find((r) => r.id === val);
                              assignVolunteerToEmergency(vol.id, val, rep?.title || 'Emergency Incident');
                            }
                          }}
                        >
                          <option value="">{vol.assignedIncidentId ? 'Assigned (Change)' : '⚡ Select Emergency to Dispatch'}</option>
                          {safeReports.map((r) => (
                            <option key={r.id} value={r.id}>
                              🚨 {r.severity} - {r.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`tel:${vol.phone}`}
                          className="py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 no-underline transition-all"
                        >
                          📞 Call ({vol.phone})
                        </a>
                        <button
                          onClick={() => {
                            setCurrentTab('map');
                          }}
                          className="py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          🗺️ View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE INVENTORY */}
      {adminTab === 'resources' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
            Emergency Resource Inventory Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeResources.map((res) => (
              <div key={res.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700">{res.category}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      res.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : res.status === 'LOW_STOCK'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm">{res.name}</h4>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800">
                    {res.quantity} {res.unit}
                  </span>
                  <button
                    onClick={() => updateResourceStock(res.id, res.quantity + 100)}
                    className="px-2.5 py-1 bg-teal-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    + Restock 100
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SHELTER MANAGEMENT */}
      {adminTab === 'shelters' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
            Shelter Capacity & Occupancy Controls
          </h3>

          <div className="space-y-4">
            {safeShelters.map((shl) => (
              <div
                key={shl.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{shl.name}</h4>
                  <p className="text-xs text-slate-500">📍 {shl.locationAddress}</p>
                  <p className="text-xs text-slate-700 font-bold mt-1">
                    Current Occupancy: {shl.occupancy} / {shl.capacity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateShelterOccupancy(shl.id, shl.occupancy - 10)}
                    className="px-3 py-1.5 bg-slate-200 font-bold text-xs rounded-xl"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => updateShelterOccupancy(shl.id, shl.occupancy + 10)}
                    className="px-3 py-1.5 bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    +10 Occupants
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CAP-COMPATIBLE EMERGENCY ALERT ECOSYSTEM */}
      {adminTab === 'cap_ecosystem' && (
        <div className="space-y-6">
          <CapAlertList onSelectShelter={(shelterId) => setAdminTab('shelters')} />
        </div>
      )}

      {/* TAB 7: WEATHER INTELLIGENCE & HAZARD MATRIX */}
      {adminTab === 'weather_intel' && (
        <div className="space-y-6">
          <WeatherDashboard />
        </div>
      )}

      {/* TAB 8: EMERGENCY CONTACT REGISTRY */}
      {adminTab === 'registry' && (
        <div className="space-y-6">
          <EmergencyContactRegistry />
        </div>
      )}

      {/* TAB 9: AI DATA ANALYSIS CENTER */}
      {adminTab === 'ai_analysis' && (
        <div className="space-y-6">
          <AiDisasterAnalysisCenter />
        </div>
      )}

      {/* TAB 10: DEEPFAKE DISASTER LOCATOR */}
      {adminTab === 'deepfake_locator' && (
        <div className="space-y-6">
          <DeepfakeMediaVerificationView />
        </div>
      )}

      {/* TAB 11: TASKFORCE SQUADS & VOLUNTEER GROUPS */}
      {adminTab === 'volunteer_squads' && (
        <div className="space-y-6">
          <VolunteerGroupManager />
        </div>
      )}
    </div>
  );
};
