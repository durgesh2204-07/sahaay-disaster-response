import React from 'react';
import { Hero3DCanvas } from '../components/Hero3DCanvas';
import { FrontPageEmergencySos } from '../components/emergency/FrontPageEmergencySos';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Home,
  Package,
  Radio,
  ArrowRight,
  Sparkles,
  Activity,
  Mic,
  Phone,
} from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  const { alerts, emergencyReports, shelters, switchRole, openEmergencySosModal } = useApp();

  const activeAlerts = (alerts || []).filter((a) => a.active);
  const totalVerified = (emergencyReports || []).filter((r) => r.status === 'VERIFIED').length;
  const openSheltersCount = (shelters || []).filter((s) => s.isOpen).length;

  return (
    <div className="space-y-12 pb-12">
      {/* High-Visibility Proper Front Page Emergency SOS Section */}
      <div className="pt-3 sm:pt-5">
        <FrontPageEmergencySos onNavigate={setCurrentTab} />
      </div>

      {/* Active Disaster Ticker */}
      {activeAlerts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white p-3.5 rounded-2xl shadow-lg border border-rose-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-rose-600 rounded-lg animate-pulse text-white font-bold">
                <Radio className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-300 block">
                  LIVE DISASTER ALERT BROADCAST
                </span>
                <p className="text-xs font-bold">{activeAlerts[0].title}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('community_map')}
              className="self-start sm:self-auto px-3 py-1.5 bg-white text-rose-900 text-xs font-extrabold rounded-xl hover:bg-rose-50 transition-all flex items-center gap-1 shadow-sm"
            >
              View Danger Zone <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-black uppercase tracking-widest font-mono shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>DISASTER RESPONSE SYSTEM</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-['Outfit']">
                When Disaster Strikes, <br />
                <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Communities Respond Together.
                </span>
              </h1>
              <p className="text-sm sm:text-base font-extrabold text-teal-700 font-['Outfit']">
                “SAHAAY — Connecting Help When Every Second Matters.”
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              SAHAAY connects citizens, volunteers, and response teams to report emergencies,
              coordinate assistance, locate shelters, and support recovery.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={openEmergencySosModal}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>🚨</span> EMERGENCY SOS
              </button>

              <button
                onClick={() => {
                  switchRole('citizen');
                  setCurrentTab('report_emergency');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-extrabold shadow-xl shadow-rose-600/30 btn-danger-3d flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-5 h-5 animate-pulse" /> 🆘 Report Incident
              </button>

              <button
                onClick={() => {
                  switchRole('volunteer');
                  setCurrentTab('volunteer_dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-sm font-extrabold shadow-xl shadow-teal-700/20 btn-3d flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5" /> 🤝 Become a Volunteer
              </button>

              <button
                onClick={() => setCurrentTab('community_map')}
                className="w-full sm:w-auto px-5 py-3.5 bg-white text-slate-800 hover:bg-slate-100 rounded-2xl text-sm font-bold border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-teal-600" /> Explore Map
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xl shadow-slate-100 text-center lg:text-left">
                <span className="text-xl font-extrabold text-rose-600 block">{activeAlerts.length}</span>
                <span className="text-[11px] font-semibold text-slate-500">Active Alerts</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xl shadow-slate-100 text-center lg:text-left">
                <span className="text-xl font-extrabold text-teal-700 block">{totalVerified}</span>
                <span className="text-[11px] font-semibold text-slate-500">Verified Reports</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xl shadow-slate-100 text-center lg:text-left">
                <span className="text-xl font-extrabold text-blue-600 block">{openSheltersCount}</span>
                <span className="text-[11px] font-semibold text-slate-500">Open Shelters</span>
              </div>
            </div>
          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-5 flex justify-center">
            <Hero3DCanvas />
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Four Step Response Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-['Outfit']">
            How SAHAAY Works
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Structured coordination ensuring rapid response from report to resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="card-3d bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 font-extrabold text-3xl px-4 py-2 rounded-bl-2xl font-mono">
              01
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">01 — REPORT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens report emergencies, road blockages, and urgent community needs with exact map locations and severity.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-3d bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 font-extrabold text-3xl px-4 py-2 rounded-bl-2xl font-mono">
              02
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">02 — VERIFY</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reports undergo community confirmations and official command center verification to prevent misinformation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-3d bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 font-extrabold text-3xl px-4 py-2 rounded-bl-2xl font-mono">
              03
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">03 — RESPOND</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearby volunteers accept task assignments matched by skills and deliver food, medical assistance, and rescue support.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card-3d bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 font-extrabold text-3xl px-4 py-2 rounded-bl-2xl font-mono">
              04
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">04 — RECOVER</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Communities track shelter occupancy, relief resource inventory, and post-disaster infrastructure recovery.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: WHY SAHAAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Why Choose SAHAAY Platform?
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Designed specifically for real-world emergency operations and community resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-sm">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl w-fit mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">🚨 Fast Reporting</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Single-click location tagging and severity metrics ensure critical reports reach responders immediately.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-sm">
              <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl w-fit mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">🗺️ Community Map</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Live interactive Leaflet map featuring shelters, road hazards, relief centers, and volunteer positions.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-sm">
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl w-fit mb-3">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">🤝 Volunteer Hub</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Smart skill-matching system connects volunteers with nearby citizens requiring food, first aid, or transit.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-sm">
              <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl w-fit mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">📦 Resource Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monitor stock levels of water, food kits, blankets, and emergency medical supplies in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: GET STARTED AS ROLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
            Explore SAHAAY Roles in Action
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Test the complete end-to-end disaster workflow across Citizen, Volunteer, and Command Center Admin roles.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                switchRole('citizen');
                setCurrentTab('citizen_dashboard');
              }}
              className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-teal-800 transition-all cursor-pointer"
            >
              Enter as Citizen Dashboard
            </button>
            <button
              onClick={() => {
                switchRole('volunteer');
                setCurrentTab('volunteer_dashboard');
              }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Enter as Volunteer Hub
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                setCurrentTab('admin_dashboard');
              }}
              className="px-5 py-2.5 bg-slate-900 text-teal-300 rounded-xl text-xs font-extrabold shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              Enter as Admin Response Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
