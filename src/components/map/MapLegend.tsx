import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xl text-xs space-y-2 max-w-xs transition-all">
      <div className="flex items-center justify-between font-extrabold text-slate-800 border-b border-slate-100 pb-1.5">
        <span className="flex items-center gap-1.5 text-teal-800">
          <Info className="w-3.5 h-3.5 text-teal-600" /> Map Key & Legend
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className={`grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 ${isExpanded ? 'block' : 'hidden sm:grid'}`}>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-rose-600 ring-2 ring-rose-200 animate-pulse shrink-0" />
          <span>🔴 Critical Incident</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-200 shrink-0" />
          <span>🔵 Open Shelter</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-purple-600 ring-2 ring-purple-200 shrink-0" />
          <span>🟣 Relief Center</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200 shrink-0" />
          <span>🟠 Road Block</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" />
          <span>🟢 Volunteer</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500/30 border-2 border-rose-600 border-dashed shrink-0" />
          <span>⚠️ Danger Zone</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-700 col-span-2 border-t border-slate-100 pt-1 mt-0.5">
          <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 ring-4 ring-cyan-200 animate-ping shrink-0" />
          <span className="text-[11px] font-bold text-cyan-800">🎯 My Current GPS Location</span>
        </div>
      </div>
    </div>
  );
};
