import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Check, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm tracking-wide">Live Response Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action controls */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-600">
            {(notifications || []).filter((n) => !n.read).length} Unread
          </span>
          <button
            onClick={clearNotifications}
            className="text-teal-700 font-bold hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Mark All Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No recent notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-50 border-slate-200/80 opacity-70'
                    : 'bg-white border-teal-200 shadow-sm ring-1 ring-teal-500/20'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg mt-0.5 ${
                      n.type === 'ALERT'
                        ? 'bg-rose-100 text-rose-600'
                        : n.type === 'TASK'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {n.type === 'ALERT' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500 space-y-2">
          <div>SAHAAY Emergency Broadcast Network</div>
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <X className="w-3.5 h-3.5 text-teal-400" />
            <span>Close Alerts Window</span>
          </button>
        </div>
      </div>
    </div>
  );
};
