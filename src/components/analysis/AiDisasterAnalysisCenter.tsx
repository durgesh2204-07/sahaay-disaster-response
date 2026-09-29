import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  Shield,
  Home,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  Compass,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiDisasterAnalysisCenter: React.FC = () => {
  const {
    aiAnalysis,
    refreshAiAnalysis,
    incidentClusters,
    confirmIncidentCluster,
    emergencyReports,
    sosIncidents,
    volunteerGroups,
    shelters,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAiAnalysis();
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalAffected =
    emergencyReports.reduce((acc, r) => acc + (r.affected?.total || 1), 0) +
    sosIncidents.reduce((acc, s) => acc + s.peopleCount, 0);

  const totalShelterOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);
  const totalShelterCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);

  return (
    <div className="space-y-6">
      {/* Top Briefing Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Real-Time Telemetry & Predictive Modeling
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            AI Disaster Situation Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Neural correlation engine processing citizen reports, live GPS distress beacons, radar precipitation, and river hydrographs.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg transition-all shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh AI Assessment
        </button>
      </div>

      {/* KPI Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
          <div className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
            Disaster Severity Index
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mt-1">
            {aiAnalysis.disasterSeverityIndex} / 100
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Level 3 Disaster Emergency
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Total Impacted Census
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalAffected}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Citizens in danger zones
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Shelter Safe Haven Census
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalShelterOccupancy} <span className="text-sm font-normal text-slate-400">/ {totalShelterCapacity}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {Math.round((totalShelterOccupancy / Math.max(1, totalShelterCapacity)) * 100)}% Capacity Utilized
          </div>
        </div>

        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20">
          <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            Active Taskforce Squads
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {(volunteerGroups || []).length} Units
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {(volunteerGroups || []).filter((g) => g.status === 'AVAILABLE' || g.status === 'ASSIGNED').length} in active field deployment
          </div>
        </div>
      </div>

      {/* AI Situation Briefing */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <Activity className="w-4 h-4" /> Automated Executive Intelligence Summary
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          "{aiAnalysis.analysisSummary}"
        </p>
      </div>

      {/* Two Columns: Hotspot Predictions & Incident Correlation Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High-Risk Hotspots */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500" /> Geospatial Vulnerability Hotspots
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-600 rounded">
              High Impact Zones
            </span>
          </div>

          <div className="space-y-3">
            {aiAnalysis.highRiskHotspots.map((hs, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {hs.areaName}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      hs.riskLevel === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {hs.riskLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Hazard:</span> {hs.primaryHazard} •{' '}
                  <span className="font-semibold">{hs.incidentCount} incidents</span> correlated in sector.
                </div>

                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  Recommendation: Deploy boat team to riverbank perimeter and enforce mandatory terrace evacuations.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Incident Correlation Clustering */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> AI Incident Correlation Clusters
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-grouped by Spatio-Temporal Proximity
            </span>
          </div>

          <div className="space-y-3">
            {incidentClusters.map((cl) => (
              <div
                key={cl.id}
                className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {cl.clusterTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cluster ID: <span className="font-mono">{cl.id}</span> • {cl.relatedIncidentIds.length} Linked Reports
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {cl.aiCorrelationConfidence}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {cl.correlationHypothesis}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-indigo-100 dark:border-indigo-900/40 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Est. Casualties: <span className="font-bold text-red-600">{cl.estimatedTotalCasualties}</span>
                  </span>

                  <button
                    onClick={() => confirmIncidentCluster(cl.id, !cl.isConfirmedByAdmin)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      cl.isConfirmedByAdmin
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    {cl.isConfirmedByAdmin ? '✓ Cluster Confirmed' : 'Confirm Cluster'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
