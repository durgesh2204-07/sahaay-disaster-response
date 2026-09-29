import React from 'react';
import { AlertTriangle, ShieldCheck, Home, Users, MapPin, PackageCheck, Radio } from 'lucide-react';

export const Hero3DCanvas: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto h-[400px] flex items-center justify-center perspective-1000 my-4 sm:my-0">
      {/* Background Soft Glow Radial */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-amber-500/10 to-rose-500/10 rounded-3xl blur-3xl -z-10" />

      {/* 3D Base Platform Grid */}
      <div className="relative w-full h-[340px] preserve-3d transform rotate-x-12 rotate-y-[-8deg] hover:rotate-x-6 hover:rotate-y-[-2deg] transition-transform duration-700 ease-out flex items-center justify-center">
        
        {/* Ground Map Plate */}
        <div className="absolute w-[92%] h-[260px] bg-slate-900/95 rounded-2xl border-2 border-teal-500/30 shadow-2xl overflow-hidden backdrop-blur-md p-4">
          {/* Topographic Lines Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Simulated Map Roads & River */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none stroke-teal-400/40" strokeWidth="2" fill="none">
            <path d="M 0,80 Q 150,180 300,100 T 550,220" strokeWidth="4" className="stroke-cyan-500/60" />
            <path d="M 120,0 L 120,300" strokeDasharray="4 4" />
            <path d="M 380,0 L 380,300" strokeDasharray="4 4" />
            <circle cx="200" cy="140" r="45" className="fill-teal-500/10 stroke-teal-400/40" />
          </svg>

          {/* Map Status Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-teal-300 font-mono">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> GRID STATUS: ACTIVE (ZONE 4)
            </span>
            <span className="bg-teal-950/80 px-2 py-0.5 rounded text-teal-400 border border-teal-800/80">
              LIVE MONITORING
            </span>
          </div>
        </div>

        {/* 3D Floating Node 1: Emergency Incident Card (Top Left Elevated) */}
        <div className="absolute top-2 left-2 z-20 glass-panel bg-white/95 text-slate-900 p-3 rounded-xl shadow-xl border border-rose-200 w-52 transform -translate-z-10 hover:translate-z-10 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-rose-500 text-white rounded-lg shadow-sm animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-600 tracking-wider uppercase block">Critical Alert</span>
              <span className="text-xs font-bold text-slate-800">River Water Influx</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-1">Low lying colony evacuated</p>
          <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">3 mins ago</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">VERIFIED</span>
          </div>
        </div>

        {/* 3D Floating Node 2: Shelter Safe Zone (Top Right Elevated) */}
        <div className="absolute top-6 right-2 z-20 glass-panel bg-white/95 text-slate-900 p-3 rounded-xl shadow-xl border border-blue-200 w-52 transform translate-z-12 hover:translate-z-20 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase block">Relief Shelter</span>
              <span className="text-xs font-bold text-slate-800">High School Shelter</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-1.5">
            <div className="bg-blue-600 h-full w-[67%]" />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-slate-600">
            <span>Occupancy: 168 / 250</span>
            <span className="text-emerald-600 font-bold">🟢 OPEN</span>
          </div>
        </div>

        {/* 3D Floating Node 3: Volunteer Response Node (Bottom Left) */}
        <div className="absolute bottom-6 left-6 z-20 glass-panel bg-white/95 text-slate-900 p-3 rounded-xl shadow-xl border border-emerald-200 w-48 transform translate-z-8 hover:translate-z-16 transition-transform duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">Active Volunteers</span>
              <span className="text-xs font-bold text-slate-800">24 On Ground</span>
            </div>
          </div>
        </div>

        {/* 3D Floating Node 4: Resource Delivery Beacon (Bottom Right) */}
        <div className="absolute bottom-2 right-6 z-20 glass-panel bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-teal-500/40 w-48 transform -translate-z-4 hover:translate-z-8 transition-transform duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-500 text-slate-900 rounded-lg shadow-sm font-bold">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-300 uppercase block">Rations Dispatched</span>
              <span className="text-xs font-bold text-slate-100">50 Meal Kits Sent</span>
            </div>
          </div>
        </div>

        {/* Central Pulse Beacon Pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="relative">
            <div className="absolute -inset-3 bg-teal-500/30 rounded-full animate-ping" />
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-lg">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
          </div>
          <span className="bg-slate-900/90 text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-teal-500/40 mt-1 backdrop-blur-sm">
            SAHAAY CORE NODE
          </span>
        </div>

      </div>
    </div>
  );
};
