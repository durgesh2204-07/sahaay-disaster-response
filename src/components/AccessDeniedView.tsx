import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Lock, User, HeartHandshake } from 'lucide-react';

interface AccessDeniedViewProps {
  setCurrentTab: (tab: string) => void;
  requiredRole?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  setCurrentTab,
  requiredRole = 'Admin',
}) => {
  const { currentUser, activeRole, isAuthenticated } = useApp();

  const handleReturnHome = () => {
    if (!isAuthenticated) {
      setCurrentTab('auth');
      return;
    }
    if (activeRole === 'admin') {
      setCurrentTab('admin_dashboard');
    } else if (activeRole === 'volunteer') {
      setCurrentTab('volunteer_dashboard');
    } else {
      setCurrentTab('citizen_dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <div className="card-3d bg-white rounded-3xl border border-rose-200/80 p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Security Barrier
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Access Denied
          </h1>
          <p className="text-sm font-semibold text-slate-600 max-w-md mx-auto">
            You do not have administrative privileges to access the <span className="text-slate-900 font-bold">{requiredRole} Command Operations</span> area.
          </p>
        </div>

        {/* User Role Badge */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeRole === 'volunteer' ? (
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
            ) : (
              <User className="w-4 h-4 text-teal-600" />
            )}
            <div className="text-left">
              <span className="font-bold text-slate-800 block">{currentUser?.name || 'Guest User'}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Role: {activeRole}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold rounded-lg text-[10px] uppercase border border-amber-200">
            Unauthorized
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReturnHome}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 btn-3d"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" />
            <span>RETURN TO MY {activeRole.toUpperCase()} DASHBOARD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
