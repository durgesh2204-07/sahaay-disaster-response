import React from 'react';
import { Shield, PhoneCall, Info, Heart, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { resetToDemoData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-extrabold flex items-center justify-center text-lg">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">SAHAAY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A community disaster management & emergency response platform connecting Citizens,
              Volunteers, and Administrators during critical events.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-teal-300 font-medium">
              <Shield className="w-3 h-3 text-teal-400" />
              <span>Operational Platform & Local Storage Sync</span>
            </div>
          </div>

          {/* Emergency Helpline Numbers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" /> Emergency Helplines
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-300 font-mono">
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">National Emergency:</span>
                <span className="font-bold text-white">112</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Disaster Management:</span>
                <span className="font-bold text-teal-300">1078</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Ambulance Services:</span>
                <span className="font-bold text-emerald-400">102 / 108</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Fire & Rescue:</span>
                <span className="font-bold text-rose-400">101</span>
              </li>
            </ul>
          </div>

          {/* Quick Pillars */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Core Response Workflow
            </h4>
            <div className="text-xs space-y-1 text-slate-400 font-medium">
              <p>1. Report Emergency Needs</p>
              <p>2. Verify via Command & Community</p>
              <p>3. Coordinate Local Volunteers</p>
              <p>4. Track Shelter & Recovery Progress</p>
            </div>
          </div>

          {/* System Control */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              System Controls
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reset all local reports, requests, and volunteer tasks back to baseline system state.
            </p>
            <button
              onClick={resetToDemoData}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Application State
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© 2026 SAHAAY Community Disaster Response Platform. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built for resilient communities <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </span>
        </div>
      </div>
    </footer>
  );
};
