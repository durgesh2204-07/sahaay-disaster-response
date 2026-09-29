import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Users,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { EmergencyReport, ReportStatus } from '../types';

interface EmergencyStatusViewProps {
  setCurrentTab: (tab: string) => void;
}

const STAGES = [
  { id: 'SUBMITTED', label: 'Report Submitted', sub: 'Received by SAHAAY system' },
  { id: 'VERIFIED', label: 'Information Verified', sub: 'Validated by triage team' },
  { id: 'NOTIFIED', label: 'Responder Notified', sub: 'Assigned to nearest squad' },
  { id: 'IN_PROGRESS', label: 'Assistance In Progress', sub: 'Responders en route / on-site' },
  { id: 'COMPLETED', label: 'Completed', sub: 'Assistance successfully rendered' },
];

function getStageIndex(status: ReportStatus): number {
  switch (status) {
    case 'PENDING':
    case 'PENDING SYNC':
      return 0;
    case 'SYNCED':
    case 'VERIFIED':
      return 1;
    case 'ASSIGNED':
      return 2;
    case 'IN_PROGRESS':
      return 3;
    case 'RESOLVED':
      return 4;
    default:
      return 1;
  }
}

export const EmergencyStatusView: React.FC<EmergencyStatusViewProps> = ({ setCurrentTab }) => {
  const { emergencyReports, currentUser, activeRole } = useApp();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleBack = () => {
    if (activeRole === 'admin') setCurrentTab('admin_dashboard');
    else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
    else setCurrentTab('citizen_dashboard');
  };

  // Reports associated with current user or overall active reports
  const userReports = (emergencyReports || []).filter((r) => r.reporterId === currentUser?.id);
  const displayReports = userReports.length > 0 ? userReports : (emergencyReports || []).slice(0, 5);

  const activeReport = selectedReportId
    ? displayReports.find((r) => r.id === selectedReportId) || displayReports[0]
    : displayReports[0];

  const currentStageIndex = activeReport ? getStageIndex(activeReport.status) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="neu-raised rounded-3xl p-5 border border-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="neu-btn p-2 rounded-2xl text-slate-700 cursor-pointer"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                LIVE INCIDENT TRACKING
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
                Emergency Status Tracker
              </h1>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('report_emergency')}
            className="neu-btn-danger px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>New SOS</span>
          </button>
        </div>
      </div>

      {displayReports.length === 0 ? (
        <div className="neu-flat rounded-3xl p-8 text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-900">No Active Emergency Reports</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't filed any reports yet, or all previous incidents have been resolved.
          </p>
          <button
            onClick={() => setCurrentTab('report_emergency')}
            className="neu-btn-danger px-5 py-2.5 rounded-2xl text-white text-xs font-extrabold shadow-md cursor-pointer mt-2"
          >
            Report an Emergency Now
          </button>
        </div>
      ) : (
        <>
          {/* Active Incidents Selector (if multiple) */}
          {displayReports.length > 1 && (
            <div className="neu-flat rounded-2xl p-2.5 border border-white space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 px-2 block">
                Select Report to Track ({displayReports.length})
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {displayReports.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`px-3 py-2 rounded-xl text-left shrink-0 transition-all cursor-pointer ${
                      activeReport?.id === rep.id ? 'neu-chip-active' : 'neu-btn'
                    }`}
                  >
                    <div className="text-[11px] font-black text-slate-900 truncate max-w-[140px]">
                      {rep.type} #{rep.id.slice(-6)}
                    </div>
                    <div className="text-[9px] font-bold text-teal-700 uppercase">
                      {rep.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeReport && (
            <div className="space-y-5">
              {/* Report Summary Card */}
              <div className="neu-raised rounded-3xl p-5 border border-white space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        ID: #{activeReport.id}
                      </span>
                      <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded uppercase border border-rose-200">
                        {activeReport.severity}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
                      {activeReport.title}
                    </h2>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-teal-100 text-teal-800 border border-teal-200 shrink-0">
                    {activeReport.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-white/70 p-3 rounded-2xl border border-slate-200/60 leading-relaxed">
                  {activeReport.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="neu-inset-subtle p-3 rounded-2xl space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 block">📍 Location</span>
                    <span className="font-extrabold text-slate-800 truncate block">
                      {activeReport.locationAddress}
                    </span>
                  </div>
                  <div className="neu-inset-subtle p-3 rounded-2xl space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 block">👥 Affected People</span>
                    <span className="font-extrabold text-slate-800 block">
                      {activeReport.affected?.total || 1} People ({activeReport.affected?.children || 0} kids, {activeReport.affected?.elderly || 0} elderly)
                    </span>
                  </div>
                </div>

                {activeReport.photoUrl && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Submitted Evidence Photo:</span>
                    <img
                      src={activeReport.photoUrl}
                      alt="Incident evidence"
                      className="w-full max-h-48 object-cover rounded-2xl border border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* 5-Step Timeline Tracker */}
              <div className="neu-raised rounded-3xl p-5 border border-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                    Incident Progress Workflow
                  </h3>
                  <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Step {currentStageIndex + 1} of 5
                  </span>
                </div>

                {/* Vertical Stepper with Neumorphic nodes */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.75 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-300">
                  {STAGES.map((st, idx) => {
                    const isPassed = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={st.id} className="relative flex items-start gap-3">
                        {/* Status Node */}
                        <div
                          className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isPassed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isCurrent
                              ? 'bg-teal-700 text-white ring-4 ring-teal-200 animate-pulse'
                              : 'bg-slate-200 text-slate-400 border border-slate-300'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-black">{idx + 1}</span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <h4
                            className={`text-xs font-black ${
                              isCurrent
                                ? 'text-teal-900'
                                : isPassed
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.label}
                          </h4>
                          <p className="text-[11px] text-slate-500">{st.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Responder Details & Rapid Call Card */}
              <div className="neu-flat rounded-3xl p-4 border border-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                    {activeReport.assignedVolunteerName ? activeReport.assignedVolunteerName.charAt(0) : 'R'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      Assigned Field Responder
                    </span>
                    <span className="text-xs font-black text-slate-900 block">
                      {activeReport.assignedVolunteerName || 'Local Rapid Response Unit #4'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      ● Active on Emergency Grid
                    </span>
                  </div>
                </div>

                <a
                  href="tel:112"
                  className="neu-btn-danger px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Responder</span>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
