import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VolunteerStatus, VolunteerSkill, ReportStatus, UserProfile } from '../types';
import { TimelineView } from '../components/TimelineView';
import { VolunteerGroupManager } from '../components/groups/VolunteerGroupManager';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Play,
  Check,
  UserCheck,
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  ListCheck,
  User,
  Users,
  Search,
  ArrowRight,
  Shield,
  Activity,
  Radio,
  AlertTriangle,
  AlertOctagon,
  Siren,
  RefreshCw,
  BrainCircuit,
} from 'lucide-react';

interface VolunteerDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ setCurrentTab }) => {
  const {
    currentUser,
    volunteers,
    selectVolunteerProfile,
    updateVolunteerProfile,
    emergencyReports,
    helpRequests,
    acceptVolunteerTask,
    startTask,
    completeTask,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    gpsStatus,
    requestLiveLocation,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'groups' | 'volunteers' | 'tasks' | 'profile'>('dashboard');

  const [availability, setAvailability] = useState<VolunteerStatus>(
    currentUser.availability || 'AVAILABLE'
  );
  const [skills, setSkills] = useState<VolunteerSkill[]>(
    currentUser.skills || ['First Aid', 'Food Distribution', 'Transportation']
  );

  // Volunteer Directory Filter State
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [skillFilter, setSkillFilter] = useState<string>('ALL');

  const handleToggleStatus = (status: VolunteerStatus) => {
    setAvailability(status);
    updateVolunteerProfile(skills, status);
  };

  const handleToggleSkill = (skill: VolunteerSkill) => {
    const list = skills || [];
    const updated = list.includes(skill)
      ? list.filter((s) => s !== skill)
      : [...list, skill];
    setSkills(updated);
    updateVolunteerProfile(updated, availability);
  };

  // Rule-based volunteer suggestion matching system:
  const [incidentTypeFilter, setIncidentTypeFilter] = useState<'ALL' | 'EMERGENCIES' | 'RELIEF'>('ALL');

  // Active Citizen Emergencies reported from Citizen Hub
  const activeEmergencyReports = (emergencyReports || []).filter(
    (rep) => rep.status !== 'RESOLVED' && rep.status !== 'REJECTED'
  );

  const nearbyHelpRequests = (helpRequests || []).filter(
    (req) => req.status === 'PENDING' || req.status === 'VERIFIED'
  );

  const myAssignedTasks = (helpRequests || []).filter(
    (req) => req.assignedVolunteerId === currentUser?.id
  );

  const myAssignedReports = (emergencyReports || []).filter(
    (rep) => rep.assignedVolunteerId === currentUser?.id
  );

  const filteredVolunteers = (volunteers || []).filter((vol) => {
    if (statusFilter !== 'ALL' && vol.availability !== statusFilter) return false;
    if (skillFilter !== 'ALL' && !vol.skills?.includes(skillFilter as VolunteerSkill)) return false;
    if (volunteerSearch.trim()) {
      const q = volunteerSearch.toLowerCase();
      const matchName = vol.name.toLowerCase().includes(q);
      const matchLoc = (vol.location || '').toLowerCase().includes(q);
      const matchBadge = (vol.badge || '').toLowerCase().includes(q);
      const matchSkills = (vol.skills || []).some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchBadge && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Streamlined Volunteer Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              VOLUNTEER COMMAND HUB
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
              currentUser.availability === 'AVAILABLE'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : currentUser.availability === 'ON_MISSION'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-indigo-500 text-white font-black'
            }`}>
              {currentUser.availability === 'AVAILABLE' ? '🟢 AVAILABLE' : currentUser.availability === 'ON_MISSION' ? '🟠 ON MISSION' : '🟣 BUSY'}
            </span>
            <button
              onClick={requestLiveLocation}
              className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-emerald-300 px-2.5 py-1 rounded-full border border-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${gpsStatus === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{gpsStatus === 'ACQUIRING' ? 'Detecting GPS...' : 'Sync Live GPS'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Welcome, {currentUser.name || 'Rohan Deshmukh'} 🤝
          </h1>

          <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">📍 Live Location:</span>
            <strong className="text-emerald-300 font-bold">{userLocationAddress || currentUser.location || 'Pune Central Sector'}</strong>
            {userLocationAccuracy && (
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">
                ±{Math.round(userLocationAccuracy)}m
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Skills: {(currentUser.skills || skills).join(', ') || 'General Relief Assistance'}
          </p>
        </div>

        {/* Status Switcher & Responder Selection */}
        <div className="flex flex-col gap-2.5 self-start md:self-auto shrink-0">
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => handleToggleStatus('AVAILABLE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                availability === 'AVAILABLE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟢 Available
            </button>
            <button
              onClick={() => handleToggleStatus('BUSY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                availability === 'BUSY'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟡 Busy
            </button>
            <button
              onClick={() => handleToggleStatus('UNAVAILABLE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                availability === 'UNAVAILABLE'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚪ Off Duty
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400">Responder:</span>
            <select
              value={currentUser.id || ''}
              onChange={(e) => {
                if (e.target.value) {
                  selectVolunteerProfile(e.target.value);
                }
              }}
              className="bg-transparent text-xs font-extrabold text-emerald-300 focus:outline-none cursor-pointer"
            >
              {volunteers.map((vol) => (
                <option key={vol.id} value={vol.id} className="bg-slate-900 text-white">
                  {vol.name} ({vol.badge || 'Volunteer'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'dashboard'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>Live Citizen Emergencies & Requests</span>
          {activeEmergencyReports.length > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
              {activeEmergencyReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('groups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'groups'
              ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Taskforce Squads (Group Ops)</span>
          <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            NEW
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('volunteers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'volunteers'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" /> All Field Volunteers ({volunteers.length})
        </button>

        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'tasks'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListCheck className="w-4 h-4 text-emerald-600" /> My Tasks & History ({myAssignedTasks.length + myAssignedReports.length})
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-emerald-600" /> Profile & Skills
        </button>

        <button
          onClick={() => setCurrentTab('ai_risk_roads')}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-teal-800 hover:bg-teal-900 text-white shadow-sm ml-auto"
        >
          <BrainCircuit className="w-4 h-4 text-teal-300" />
          <span>AI Risk & Road Matrix</span>
          <span className="bg-teal-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
            ROADS
          </span>
        </button>
      </div>

      {/* SUB TAB 1: VOLUNTEER DASHBOARD & CITIZEN EMERGENCIES + NEARBY HELP REQUESTS */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Rule-based Suggestion & Citizen Emergency Alert Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-sm">
                  Live Dispatch & Volunteer Suggestion Engine Active
                </h3>
                <p className="text-xs text-emerald-800">
                  Matching emergency reports and relief needs by: <strong>Skills ({skills.join(', ')})</strong> | <strong>Status ({availability})</strong> | <strong>Urgency Level</strong>
                </p>
              </div>
            </div>

            {activeEmergencyReports.length > 0 && (
              <div className="flex items-center gap-2 bg-rose-100 border border-rose-300 px-3 py-1.5 rounded-2xl text-xs font-extrabold text-rose-900 self-start sm:self-auto">
                <Siren className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>{activeEmergencyReports.length} Citizen SOS Waiting for Responders</span>
              </div>
            )}
          </div>

          {/* Incident Type Selector Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setIncidentTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  incidentTypeFilter === 'ALL'
                    ? 'bg-white text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Incidents ({activeEmergencyReports.length + nearbyHelpRequests.length})
              </button>
              <button
                onClick={() => setIncidentTypeFilter('EMERGENCIES')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  incidentTypeFilter === 'EMERGENCIES'
                    ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-rose-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>🚨 Citizen Emergencies ({activeEmergencyReports.length})</span>
              </button>
              <button
                onClick={() => setIncidentTypeFilter('RELIEF')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  incidentTypeFilter === 'RELIEF'
                    ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-emerald-700'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>📦 Relief Needs ({nearbyHelpRequests.length})</span>
              </button>
            </div>

            <button
              onClick={() => setActiveSubTab('volunteers')}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All {volunteers.length} Fellow Volunteers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SECTION 1: CITIZEN EMERGENCY SOS REPORTS (FROM CITIZEN HUB) */}
          {(incidentTypeFilter === 'ALL' || incidentTypeFilter === 'EMERGENCIES') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-rose-600 text-white rounded-xl shadow-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
                    Citizen Emergency SOS Reports (Direct from Citizen Hub)
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {activeEmergencyReports.length} reports live
                </span>
              </div>

              {activeEmergencyReports.length === 0 ? (
                <div className="bg-emerald-50/70 border border-emerald-200 p-8 rounded-3xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-emerald-950 text-sm">All Citizen Emergencies Resolved</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    There are no unhandled citizen emergency reports right now. New emergency reports submitted by citizens will instantly show here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeEmergencyReports.map((rep) => {
                    const isHandledByMe = rep.assignedVolunteerId === currentUser.id;
                    const isHandledByOther = rep.assignedVolunteerName && !isHandledByMe;
                    const isUnassigned = !rep.assignedVolunteerId;

                    return (
                      <div
                        key={rep.id}
                        className={`card-3d bg-white rounded-3xl border ${
                          isHandledByMe
                            ? 'border-emerald-300 ring-2 ring-emerald-200'
                            : rep.severity === 'CRITICAL'
                            ? 'border-rose-300 ring-1 ring-rose-200'
                            : 'border-slate-200'
                        } p-6 shadow-md space-y-4 flex flex-col justify-between transition-all`}
                      >
                        <div className="space-y-3">
                          {/* Severity & Incident Type Header */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 ${
                                rep.severity === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : rep.severity === 'HIGH'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {rep.severity} • {rep.type}
                            </span>

                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              #{rep.id}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                              {rep.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{rep.locationAddress}</span>
                            </p>
                          </div>

                          {/* Affected People Breakdown */}
                          {rep.affected && (
                            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-[11px] grid grid-cols-3 gap-1 text-center font-bold">
                              <div className="bg-white p-1 rounded-xl border border-slate-200">
                                <span className="text-slate-400 block text-[9px] uppercase">AFFECTED</span>
                                <span className="text-slate-900 font-extrabold">{rep.affected.total}</span>
                              </div>
                              <div className="bg-white p-1 rounded-xl border border-slate-200">
                                <span className="text-slate-400 block text-[9px] uppercase">CHILDREN</span>
                                <span className="text-amber-700 font-extrabold">{rep.affected.children}</span>
                              </div>
                              <div className="bg-white p-1 rounded-xl border border-slate-200">
                                <span className="text-slate-400 block text-[9px] uppercase">ELDERLY</span>
                                <span className="text-rose-700 font-extrabold">{rep.affected.elderly}</span>
                              </div>
                            </div>
                          )}

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {rep.description}
                          </p>

                          {rep.photoUrl && (
                            <div className="rounded-xl overflow-hidden border border-slate-200 h-28">
                              <img src={rep.photoUrl} alt={rep.title} className="w-full h-full object-cover" />
                            </div>
                          )}

                          {/* Handling Status Badge */}
                          <div className="pt-1">
                            {isHandledByMe ? (
                              <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  You Accepted this Emergency
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                  {rep.status}
                                </span>
                              </div>
                            ) : isHandledByOther ? (
                              <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-bold text-blue-900 flex items-center gap-1.5 truncate">
                                  <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  Handled: <strong>{rep.assignedVolunteerName}</strong>
                                </span>
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded shrink-0">
                                  {rep.status}
                                </span>
                              </div>
                            ) : (
                              <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-extrabold text-rose-800 flex items-center gap-1.5 animate-pulse">
                                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                                  Needs Volunteer Immediately
                                </span>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                  UNASSIGNED
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                            <span>Citizen: <strong>{rep.reporterName}</strong></span>
                            <span>{new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2">
                          {isHandledByMe ? (
                            <button
                              onClick={() => setActiveSubTab('tasks')}
                              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <ListCheck className="w-4 h-4" /> MANAGE MISSION IN MY TASKS
                            </button>
                          ) : isHandledByOther ? (
                            <div className="space-y-1.5">
                              <button
                                onClick={() => acceptVolunteerTask(rep.id, true)}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                🤝 Join as Backup Responder
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => acceptVolunteerTask(rep.id, true)}
                              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-md btn-danger-3d flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <AlertTriangle className="w-4 h-4" /> 🚑 I CAN HELP / RESPOND
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: COMMUNITY RELIEF HELP REQUESTS */}
          {(incidentTypeFilter === 'ALL' || incidentTypeFilter === 'RELIEF') && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                    <HeartHandshake className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
                    Community Relief & Supply Requests
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {nearbyHelpRequests.length} requests
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyHelpRequests.map((req) => (
                  <div
                    key={req.id}
                    className="card-3d bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          DISTANCE: 1.4 km
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                            req.urgency === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.urgency} SEVERITY
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base">
                        {req.needType}: {req.quantity}
                      </h4>
                      <p className="text-xs text-slate-500">📍 {req.locationAddress}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-semibold">
                        Required Skill Match: <strong className="text-emerald-700">{req.needType} Support</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => acceptVolunteerTask(req.id, false)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md btn-3d flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4" /> I CAN HELP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB: FIELD VOLUNTEERS DIRECTORY (15 REAL VOLUNTEERS) */}
      {activeSubTab === 'volunteers' && (
        <div className="space-y-6">
          {/* Search & Filter Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wide">
                  REGISTERED FORCE ROSTER
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                  Active Field Volunteers & Peer Responders ({volunteers.length} Active)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct contacts, specialized certifications, live telemetry status, and quick persona switching.
                </p>
              </div>

              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={volunteerSearch}
                  onChange={(e) => setVolunteerSearch(e.target.value)}
                  placeholder="Search by name, skill, area..."
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs font-bold">
              <span className="text-slate-400">Status:</span>
              {(['ALL', 'AVAILABLE', 'ON_MISSION', 'BUSY'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === st
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
                    : `🟣 Busy (${(volunteers || []).filter((v) => v.availability === 'BUSY').length})`}
                </button>
              ))}

              <span className="text-slate-400 ml-2">Skill:</span>
              {['ALL', 'First Aid', 'Boat Rescue', 'Drone Recon', 'Search Support', 'Food Distribution'].map((sk) => (
                <button
                  key={sk}
                  onClick={() => setSkillFilter(sk)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    skillFilter === sk
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Volunteer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVolunteers.map((vol) => {
              const isCurrent = vol.id === currentUser.id;
              const isAvail = vol.availability === 'AVAILABLE';
              const isOnMission = vol.availability === 'ON_MISSION';

              return (
                <div
                  key={vol.id}
                  className={`card-3d bg-white rounded-3xl p-5 border shadow-md space-y-4 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
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
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {vol.lastActive || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                        {vol.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                          {vol.name}
                        </h4>
                        <p className="text-xs font-bold text-teal-700">{vol.badge || 'Field Volunteer'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          📍 {vol.location || 'Pune Sector'}
                        </p>
                      </div>
                    </div>

                    {vol.assignedIncidentTitle && (
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-semibold">
                        🎯 <strong>Active Mission:</strong> {vol.assignedIncidentTitle}
                      </div>
                    )}

                    {/* Specialized Skills */}
                    <div className="flex flex-wrap gap-1">
                      {(vol.skills || ['General Assistance']).map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
                      <span>Missions: <strong className="text-slate-800">{vol.completedMissions || 15}</strong></span>
                      <span>Experience: <strong className="text-slate-800">{vol.experienceYears || 2} yrs</strong></span>
                      {vol.lat && vol.lng && (
                        <span className="font-mono text-[10px]">
                          ({vol.lat.toFixed(3)}, {vol.lng.toFixed(3)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${vol.phone}`}
                        className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 no-underline transition-all shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() => {
                          selectVolunteerProfile(vol.id);
                        }}
                        className={`py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs ${
                          isCurrent
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-black'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isCurrent ? '✓ Active Profile' : 'Act as Volunteer'}
                      </button>
                    </div>

                    <button
                      onClick={() => setCurrentTab('community_map')}
                      className="w-full py-1.5 text-center text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                    >
                      🗺️ Locate on Interactive Map →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 3: TASK MANAGEMENT & TIMELINE UPDATES */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
              My Active Assigned Response Operations ({myAssignedReports.length + myAssignedTasks.length})
            </h3>
            <button
              onClick={() => setActiveSubTab('dashboard')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>+ Take on New Incidents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myAssignedTasks.length === 0 && myAssignedReports.length === 0 ? (
            <div className="bg-slate-50 p-10 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Active Tasks Assigned Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Go to 'Live Citizen Emergencies & Requests' and click 'I CAN HELP' to claim an incident response mission.
              </p>
              <button
                onClick={() => setActiveSubTab('dashboard')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Browse Live Emergencies
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* SECTION: CITIZEN EMERGENCY MISSIONS ASSIGNED TO YOU */}
              {myAssignedReports.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-rose-600 text-white rounded-lg text-xs">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base font-['Outfit']">
                      Citizen Emergency Missions Assigned to You ({myAssignedReports.length})
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {myAssignedReports.map((rep) => (
                      <div
                        key={rep.id}
                        className={`bg-white p-6 rounded-3xl border ${
                          rep.status === 'RESOLVED'
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : 'border-slate-200'
                        } shadow-md space-y-4`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                                  rep.severity === 'CRITICAL'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rep.severity} • {rep.type}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">
                                SOS #{rep.id}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-lg mt-1">
                              {rep.title}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{rep.locationAddress}</span>
                            </p>
                          </div>

                          {/* Emergency Mission Action Controls */}
                          <div className="flex items-center gap-2">
                            {rep.status === 'ASSIGNED' && (
                              <button
                                onClick={() => startTask(rep.id, true)}
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Play className="w-4 h-4 fill-slate-950" /> START RESPONSE (ON SCENE)
                              </button>
                            )}

                            {rep.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => completeTask(rep.id, true)}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
                              >
                                <Check className="w-4 h-4 stroke-[3]" /> MARK PROBLEM SOLVED / COMPLETED
                              </button>
                            )}

                            {rep.status === 'RESOLVED' && (
                              <span className="px-3.5 py-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                PROBLEM SOLVED & COMPLETED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>

                        {rep.affected && (
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-wrap items-center gap-4 text-xs">
                            <span className="font-bold text-slate-500">Citizen Details:</span>
                            <span>Total Affected: <strong>{rep.affected.total}</strong></span>
                            <span>Children: <strong>{rep.affected.children}</strong></span>
                            <span>Elderly: <strong>{rep.affected.elderly}</strong></span>
                            <span>Special Needs: <strong>{rep.affected.specialAssistance}</strong></span>
                            <span>Reported by: <strong>{rep.reporterName}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: COMMUNITY RELIEF SUPPLY TASKS */}
              {myAssignedTasks.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-emerald-600 text-white rounded-lg text-xs">
                      <HeartHandshake className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base font-['Outfit']">
                      Relief Supplies & Humanitarian Aid Tasks ({myAssignedTasks.length})
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {myAssignedTasks.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              TASK #{req.id}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-lg mt-1">
                              {req.needType}: {req.quantity}
                            </h4>
                            <p className="text-xs text-slate-500">📍 {req.locationAddress}</p>
                          </div>

                          {/* Task Actions: START TASK -> IN_PROGRESS -> MARK COMPLETED */}
                          <div className="flex items-center gap-2">
                            {req.status === 'ASSIGNED' && (
                              <button
                                onClick={() => startTask(req.id, false)}
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Play className="w-4 h-4 fill-slate-950" /> START TASK
                              </button>
                            )}

                            {req.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => completeTask(req.id, false)}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Check className="w-4 h-4 stroke-[3]" /> MARK COMPLETED
                              </button>
                            )}

                            {req.status === 'RESOLVED' && (
                              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-300">
                                ✅ TASK COMPLETED
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600">{req.description}</p>

                        {/* Task Progress Timeline */}
                        <TimelineView timeline={req.timeline} currentStatus={req.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 4: VOLUNTEER PROFILE & SKILLS */}
      {activeSubTab === 'profile' && (
        <div className="max-w-2xl mx-auto card-3d bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Volunteer Responder Profile</h3>
              <p className="text-xs text-slate-500">Update skills, phone, and ground availability status.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                readOnly
                value={currentUser.name || 'Priya Deshmukh'}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone Number</label>
              <input
                type="text"
                readOnly
                value={currentUser.phone || '+91 94220 88990'}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-bold font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Manage Response Skills:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'First Aid',
                  'Food Distribution',
                  'Water Distribution',
                  'Transportation',
                  'Search Support',
                  'Communication',
                  'General Assistance',
                ].map((sk) => {
                  const isSelected = skills.includes(sk as VolunteerSkill);
                  return (
                    <button
                      type="button"
                      key={sk}
                      onClick={() => handleToggleSkill(sk as VolunteerSkill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB: TASKFORCE SQUADS & VOLUNTEER GROUPS */}
      {activeSubTab === 'groups' && (
        <div className="space-y-6">
          <VolunteerGroupManager />
        </div>
      )}
    </div>
  );
};

