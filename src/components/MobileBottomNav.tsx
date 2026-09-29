import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  AlertTriangle,
  Clock,
  Bed,
  MoreHorizontal,
  PhoneCall,
  BookOpen,
  MapPin,
  Package,
  Shield,
  X,
  HeartHandshake,
  LayoutDashboard,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activeRole, emergencyReports, currentUser } = useApp();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  // Check if citizen has any active reports to badge the status tab
  const myActiveReports = (emergencyReports || []).filter(
    (r) => r.reporterId === currentUser?.id && r.status !== 'RESOLVED' && r.status !== 'REJECTED'
  );

  const handleTabClick = (tab: string) => {
    setShowMoreDrawer(false);
    setCurrentTab(tab);
  };

  return (
    <>
      {/* Mobile Drawer for "More" menu */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div
            className="flex-1"
            onClick={() => setShowMoreDrawer(false)}
          />
          <div className="neu-raised bg-[#edf2f7] rounded-t-3xl p-5 border-t border-white shadow-2xl max-h-[75vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <span className="font-extrabold text-slate-900 text-sm font-['Outfit']">
                  SAHAAY Relief Hub & More
                </span>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleTabClick('emergency_contacts')}
                className="neu-card-interactive p-3.5 rounded-2xl text-left space-y-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span className="block text-xs font-extrabold text-slate-900">Emergency Contacts</span>
                <span className="block text-[10px] text-slate-500">112, 108, 101 Direct Call</span>
              </button>

              <button
                onClick={() => handleTabClick('preparedness')}
                className="neu-card-interactive p-3.5 rounded-2xl text-left space-y-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="block text-xs font-extrabold text-slate-900">Disaster Info</span>
                <span className="block text-[10px] text-slate-500">Flood, Fire, Earthquakes</span>
              </button>

              <button
                onClick={() => handleTabClick('community_map')}
                className="neu-card-interactive p-3.5 rounded-2xl text-left space-y-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="block text-xs font-extrabold text-slate-900">Live Danger Map</span>
                <span className="block text-[10px] text-slate-500">Zones & Relief centers</span>
              </button>

              <button
                onClick={() => handleTabClick('requests')}
                className="neu-card-interactive p-3.5 rounded-2xl text-left space-y-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <span className="block text-xs font-extrabold text-slate-900">Request Relief</span>
                <span className="block text-[10px] text-slate-500">Food, Water, Supplies</span>
              </button>
            </div>

            {/* Quick Role Switcher on Mobile Drawer */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block mb-2">
                Switch Operational View
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTabClick('citizen_dashboard')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                    activeRole === 'citizen'
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Citizen
                </button>
                <button
                  onClick={() => handleTabClick('volunteer_dashboard')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                    activeRole === 'volunteer'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" /> Volunteer
                </button>
                <button
                  onClick={() => handleTabClick('admin_dashboard')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                    activeRole === 'admin'
                      ? 'bg-slate-900 text-teal-300 border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#edf2f7]/95 backdrop-blur-md border-t border-white/80 shadow-[0_-8px_20px_rgba(166,180,200,0.4)] px-3 py-1.5 pb-safe"
      >
        <div className="max-w-md mx-auto flex items-center justify-between relative">
          {/* 1. Home / Dashboard */}
          <button
            onClick={() => handleTabClick(activeRole === 'admin' ? 'admin_dashboard' : activeRole === 'volunteer' ? 'volunteer_dashboard' : 'citizen_dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer touch-target ${
              currentTab === 'citizen_dashboard' || currentTab === 'home' || currentTab === 'volunteer_dashboard' || currentTab === 'admin_dashboard'
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>

          {/* 2. Live Tracker / Status */}
          <button
            onClick={() => handleTabClick('emergency_status')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative touch-target ${
              currentTab === 'emergency_status'
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Status</span>
            {myActiveReports.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            )}
          </button>

          {/* 3. CENTER EMERGENCY SOS BUTTON (Elevated Neumorphic Danger Action) */}
          <div className="-mt-6 flex flex-col items-center">
            <button
              onClick={() => handleTabClick('report_emergency')}
              aria-label="Emergency SOS Report"
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-transform active:scale-95 neu-btn-danger ${
                currentTab === 'report_emergency' ? 'ring-4 ring-rose-300 ring-offset-2' : ''
              }`}
            >
              <AlertTriangle className="w-7 h-7 animate-pulse text-white" />
            </button>
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-tighter mt-1">
              SOS REPORT
            </span>
          </div>

          {/* 4. Shelters & Bed Booking */}
          <button
            onClick={() => handleTabClick('shelters')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer touch-target ${
              currentTab === 'shelters'
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bed className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Shelters</span>
          </button>

          {/* 5. More Menu */}
          <button
            onClick={() => setShowMoreDrawer(!showMoreDrawer)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer touch-target ${
              showMoreDrawer || currentTab === 'emergency_contacts' || currentTab === 'preparedness'
                ? 'text-teal-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
