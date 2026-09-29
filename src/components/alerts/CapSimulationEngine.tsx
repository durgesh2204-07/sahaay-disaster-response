import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Send,
  Users,
  Home,
  RefreshCw,
} from 'lucide-react';

interface CapSimulationEngineProps {
  onSimulationCompleted?: () => void;
}

export const CapSimulationEngine: React.FC<CapSimulationEngineProps> = ({
  onSimulationCompleted,
}) => {
  const { triggerSimulation, dismissSimulationAlerts, activeSimulationAlert, emergencyContacts } = useApp();
  const [selectedDisaster, setSelectedDisaster] = useState<string>('Flood');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const eligibleContactsCount = (emergencyContacts || []).filter((c) => c.alertEligibility === 'ELIGIBLE').length;

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const result = await triggerSimulation(selectedDisaster, radiusKm);
      setSimulationResult(result);
      if (onSimulationCompleted) {
        onSimulationCompleted();
      }
    } catch (e) {
      console.warn('Simulation execution failed:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDismiss = () => {
    dismissSimulationAlerts();
    setSimulationResult(null);
  };

  return (
    <div className="neu-flat p-6 rounded-2xl space-y-5 border-2 border-amber-300/80 bg-amber-50/20">
      {/* Simulation Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold neu-raised shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300">
                Drill Engine
              </span>
              <span className="text-xs font-bold text-amber-800">Standardized Testing Suite</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              CAP Emergency Broadcast Simulation
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-500 block">Registry Population</span>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {eligibleContactsCount} Eligible Citizens in Test Net
          </span>
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 space-y-1">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wide">
              SIMULATION / DEMO DRILL ENVIRONMENT:
            </span>{' '}
            All alert events generated through this engine are marked with protocol identifier flags as{' '}
            <strong className="underline decoration-amber-600">isSimulation: true</strong>. No live SMS carrier charges or civil sirens are triggered.
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Disaster Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Scenario Event Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Flood', 'Cyclone', 'Landslide'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedDisaster(type)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedDisaster === type
                    ? 'bg-blue-600 text-white neu-raised'
                    : 'neu-btn-secondary text-slate-700 hover:text-slate-950'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Radius in KM */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Target Broadcast Radius ({radiusKm} km)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2}
              max={25}
              step={1}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-bold font-mono px-2 py-1 bg-white rounded-lg border border-slate-200 shrink-0">
              {radiusKm} km
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="neu-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 text-white"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Simulating CAP Broadcast...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-white" />
              <span>Trigger Test Alert Protocol</span>
            </>
          )}
        </button>

        {activeSimulationAlert && (
          <button
            onClick={handleDismiss}
            className="neu-btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            Dismiss Active Drill Simulation
          </button>
        )}
      </div>

      {/* Real-time Simulation Results Card if active */}
      {(simulationResult || activeSimulationAlert) && (
        <div className="p-4 rounded-xl bg-white neu-pressed border border-amber-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="neu-badge-critical text-xs font-black">
              ● DRILL PROTOCOL ACTIVATED
            </span>
            <span className="text-xs font-mono text-slate-500">
              ID: {activeSimulationAlert?.identifier || simulationResult?.alert?.identifier}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-900">
            {activeSimulationAlert?.headline || simulationResult?.alert?.headline}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Radius</span>
              <span className="font-bold text-slate-900">{radiusKm} km zone</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Devices Pinged</span>
              <span className="font-bold text-blue-700">
                {simulationResult?.recipientsNotified ?? 180} citizens
              </span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Delivery Rate</span>
              <span className="font-bold text-emerald-600">97.8% verified</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Relief Camp</span>
              <span className="font-bold text-slate-900 truncate">
                {simulationResult?.nearestShelterAssigned?.name || 'Balewadi Camp'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
