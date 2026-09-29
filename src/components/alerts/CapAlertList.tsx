import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CapAlertCard } from './CapAlertCard';
import { CapAlertCreator } from './CapAlertCreator';
import { CapSimulationEngine } from './CapSimulationEngine';
import {
  ShieldAlert,
  Plus,
  Radio,
  CheckCircle2,
  Bell,
  Home,
  Users,
} from 'lucide-react';

interface CapAlertListProps {
  onSelectShelter?: (shelterId: string) => void;
}

export const CapAlertList: React.FC<CapAlertListProps> = ({ onSelectShelter }) => {
  const { capAlerts, activeRole, alertAnalytics } = useApp();
  const [filter, setFilter] = useState<'ACTIVE' | 'CRITICAL' | 'ALL' | 'SIMULATION'>('ACTIVE');
  const [isCreatingAlert, setIsCreatingAlert] = useState<boolean>(false);
  const [showSimulationModal, setShowSimulationModal] = useState<boolean>(false);

  const filteredAlerts = (capAlerts || []).filter((alert) => {
    if (filter === 'ACTIVE') return alert.status === 'ACTIVE';
    if (filter === 'CRITICAL') return alert.severity === 'CRITICAL' || alert.severity === 'SEVERE';
    if (filter === 'SIMULATION') return alert.isSimulation;
    return true;
  });

  const activeCount = (capAlerts || []).filter((a) => a.status === 'ACTIVE').length;

  return (
    <div className="space-y-5">
      {/* Sophisticated Header */}
      <div className="neu-flat p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-red-600" />
              Common Alerting Protocol (CAP)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Civil Protection Broadcasts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Emergency Bulletins & Civil Warnings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time public safety notifications with targeted geofencing and evacuation directives.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSimulationModal(!showSimulationModal)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Simulate Drill</span>
          </button>

          {(activeRole === 'admin' || true) && (
            <button
              onClick={() => setIsCreatingAlert(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Simplified, Sophisticated Status Ribbon */}
      <div className="neu-flat px-4 py-3 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="flex items-center gap-2 font-medium">
            <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
            <strong className="text-slate-900">{activeCount}</strong> Active {activeCount === 1 ? 'Bulletin' : 'Bulletins'}
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <strong className="text-slate-900">{(alertAnalytics?.usersInAffectedZones ?? 1483).toLocaleString()}</strong> In Geotarget Zone
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <strong className="text-slate-900">{alertAnalytics?.sheltersActivated ?? 4}</strong> Shelters Ready
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium self-end sm:self-auto">
          Common Alerting Protocol (CAP)
        </span>
      </div>

      {/* Simulation Engine Tray if opened */}
      {showSimulationModal && (
        <CapSimulationEngine onSimulationCompleted={() => setShowSimulationModal(false)} />
      )}

      {/* Alert Creator Modal / Form if active */}
      {isCreatingAlert && (
        <CapAlertCreator
          onSuccess={() => setIsCreatingAlert(false)}
          onCancel={() => setIsCreatingAlert(false)}
        />
      )}

      {/* Filter Tabs */}
      <div className="p-1 rounded-xl flex items-center gap-1 bg-slate-100 border border-slate-200/60 overflow-x-auto">
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'ACTIVE'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Bulletins ({(capAlerts || []).filter((a) => a.status === 'ACTIVE').length})
        </button>
        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'CRITICAL'
              ? 'bg-white text-red-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Critical & Severe
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Bulletins ({(capAlerts || []).length})
        </button>
        <button
          onClick={() => setFilter('SIMULATION')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            filter === 'SIMULATION'
              ? 'bg-white text-amber-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Drills ({(capAlerts || []).filter((a) => a.isSimulation).length})
        </button>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <CapAlertCard
              key={alert.id}
              alert={alert}
              showAdminControls={activeRole === 'admin'}
              onSelectShelter={onSelectShelter}
            />
          ))
        ) : (
          <div className="neu-flat p-12 text-center rounded-2xl space-y-2 bg-white">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active bulletins in this filter</h3>
            <p className="text-xs text-slate-500">
              All regional sensors report normal operational parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
