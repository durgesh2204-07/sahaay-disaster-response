import React from 'react';
import { LogOut, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: string;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  role,
}) => {
  if (!isOpen) return null;

  const roleName =
    role === 'admin'
      ? 'Admin Command Center'
      : role === 'volunteer'
      ? 'Volunteer Hub'
      : 'Citizen Portal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-5 transform transition-all">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto shadow-sm">
          <LogOut className="w-7 h-7" />
        </div>

        {/* Text */}
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Outfit']">
            Are you sure you want to logout?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You are currently logged into the <strong className="text-slate-800 dark:text-slate-200">{roleName}</strong>. Logging out will secure your session.
          </p>
        </div>

        {/* Offline Safety Note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Data Safe:</strong> Your local offline reports, pending sync queue, and shelter updates will <em>not</em> be deleted upon logging out.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md btn-3d transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Yes, Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
