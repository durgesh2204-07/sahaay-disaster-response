import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LiveLocationWeatherDetector } from '../components/weather/LiveLocationWeatherDetector';
import {
  AlertTriangle,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  FileText,
  QrCode,
  Bed,
  PhoneCall,
  BookOpen,
  CloudRain,
  ShieldAlert,
} from 'lucide-react';
import { HelpRequest } from '../types';

interface CitizenDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ setCurrentTab }) => {
  const {
    currentUser,
    emergencyReports,
    helpRequests,
    shelters,
    shelterBookings,
    openEmergencySosModal,
  } = useApp();

  const [, setSelectedRequestForTimeline] = useState<HelpRequest | null>(null);

  const myReports = (emergencyReports || []).filter((r) => r.reporterId === currentUser?.id);
  const myRequests = (helpRequests || []).filter((r) => r.citizenId === currentUser?.id);
  const myBookings = (shelterBookings || []).filter(
    (b) => b.citizenId === currentUser?.id || b.phone === currentUser?.phone
  );
  const openShelters = (shelters || []).filter((s) => s.isOpen);

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 pb-24 space-y-5 animate-fade-in">
      {/* 1. REAL-TIME LIVE LOCATION & WEATHER DETECTOR CARD */}
      <LiveLocationWeatherDetector
        onNavigateToWeather={() => setCurrentTab('weather')}
        onNavigateToAlerts={() => setCurrentTab('cap_alerts')}
      />

      {/* 2. MAIN HERO CARD: "Need Emergency Help?" (Prominent SOS) */}
      <div className="neu-raised rounded-3xl p-5 sm:p-6 border border-white text-center space-y-3 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            24/7 IMMEDIATE RESPONSE
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
            Need Emergency Help?
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Report flood, structural fire, earthquake injury, or stranded citizens. Responders deploy immediately.
          </p>
        </div>

        {/* Large Prominent Neumorphic Emergency Button */}
        <div className="pt-2 space-y-2">
          <button
            onClick={openEmergencySosModal}
            className="w-full py-4 px-6 rounded-2xl neu-btn-danger text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl cursor-pointer active:scale-98 transition-all touch-target"
          >
            <AlertTriangle className="w-5 h-5 animate-pulse text-white" />
            <span>🚨 EMERGENCY SOS — 1-TAP DISPATCH</span>
          </button>
          <button
            onClick={() => setCurrentTab('report_emergency')}
            className="text-xs text-rose-700 hover:text-rose-800 font-bold hover:underline cursor-pointer block mx-auto"
          >
            Or submit a detailed incident report with photos & needs →
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Response</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Under 5 Min Dispatch</span>
          </span>
        </div>
      </div>

      {/* 3. COMPACT FEATURE CARDS */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider px-1 block">
          Disaster Services & Resources
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Card 1: Disaster Guides */}
          <button
            onClick={() => setCurrentTab('preparedness')}
            className="neu-card-interactive p-4 rounded-3xl text-left space-y-2 cursor-pointer touch-target"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Disaster Guides</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Flood, Fire, Quake Protocols</p>
            </div>
          </button>

          {/* Card 2: CAP Warning Alerts */}
          <button
            onClick={() => setCurrentTab('cap_alerts')}
            className="neu-card-interactive p-4 rounded-3xl text-left space-y-2 cursor-pointer touch-target"
          >
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">CAP Alerts</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Official Emergency Broadcasts</p>
            </div>
          </button>

          {/* Card 3: Weather & Risk Radar */}
          <button
            onClick={() => setCurrentTab('weather')}
            className="neu-card-interactive p-4 rounded-3xl text-left space-y-2 cursor-pointer touch-target"
          >
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Weather & Risk</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">24h Radar & Inundation Index</p>
            </div>
          </button>

          {/* Card 4: Relief Map */}
          <button
            onClick={() => setCurrentTab('community_map')}
            className="neu-card-interactive p-4 rounded-3xl text-left space-y-2 cursor-pointer touch-target"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Relief & Danger Map</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">GPS zones & supply centers</p>
            </div>
          </button>

          {/* Card 5: Shelter Bed Booking */}
          <button
            onClick={() => setCurrentTab('shelters')}
            className="neu-card-interactive p-4 rounded-3xl text-left space-y-2 cursor-pointer touch-target"
          >
            <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900">Shelter Booking</h3>
                <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-1.5 rounded">
                  {openShelters.length} Open
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Reserve beds & get QR pass</p>
            </div>
          </button>

          {/* Card 6: Request Relief Supplies */}
          <button
            onClick={() => setCurrentTab('requests')}
            className="neu-card-interactive p-4 rounded-3xl text-left space-y-2 cursor-pointer touch-target"
          >
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Request Relief</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Rations, Water, First Aid</p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. MY SHELTER RESERVATION PASSES (If any exist) */}
      {myBookings.length > 0 && (
        <div className="neu-raised rounded-3xl p-5 border border-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-teal-700" />
              <span>My Shelter Bed Passes ({myBookings.length})</span>
            </h3>
            <button
              onClick={() => setCurrentTab('shelters')}
              className="text-[11px] font-extrabold text-teal-700 hover:underline"
            >
              All Passes →
            </button>
          </div>

          <div className="space-y-2.5">
            {myBookings.map((bk) => (
              <div
                key={bk.id}
                className="neu-inset-subtle p-3.5 rounded-2xl space-y-2 border border-slate-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-black bg-teal-800 text-white px-2 py-0.5 rounded">
                      PASS: {bk.qrPassCode}
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 mt-1">{bk.shelterName}</h4>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {bk.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Reserved Space:</span>
                  <span className="font-bold text-slate-900">{bk.headCount} Persons</span>
                </div>
                <button
                  onClick={() => setCurrentTab('shelters')}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Show QR Pass at Gate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. MY ACTIVE RELIEF REQUESTS & REPORTS */}
      {(myReports.length > 0 || myRequests.length > 0) && (
        <div className="neu-raised rounded-3xl p-5 border border-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Recent Activity ({myReports.length + myRequests.length})</span>
            </h3>
            <button
              onClick={() => setCurrentTab('emergency_status')}
              className="text-[11px] font-extrabold text-teal-700 hover:underline"
            >
              Track All →
            </button>
          </div>

          <div className="space-y-2.5">
            {myReports.slice(0, 2).map((rep) => (
              <div key={rep.id} className="neu-flat p-3.5 rounded-2xl space-y-1.5 border border-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    EMERGENCY #{rep.id.slice(-6)}
                  </span>
                  <span className="text-[10px] font-black uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    {rep.status}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">{rep.title}</h4>
                <p className="text-[11px] text-slate-600 truncate">{rep.description}</p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => setCurrentTab('emergency_status')}
                    className="text-[11px] font-extrabold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View 5-Step Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {myRequests.slice(0, 2).map((req) => (
              <div key={req.id} className="neu-flat p-3.5 rounded-2xl space-y-1.5 border border-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    RELIEF REQUEST #{req.id.slice(-6)}
                  </span>
                  <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {req.status}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  {req.needType}: {req.quantity}
                </h4>
                <p className="text-[11px] text-slate-600 truncate">{req.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
