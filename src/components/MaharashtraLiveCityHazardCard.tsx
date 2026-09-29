import React, { useState, useMemo } from 'react';
import {
  MAHARASHTRA_CITIES,
  MaharashtraCityData,
  DisasterHazardType,
  HAZARD_TYPE_LABELS,
} from '../data/maharashtraDisasterData';
import {
  MapPin,
  ShieldAlert,
  BrainCircuit,
  Route,
  Activity,
  Droplets,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Building2,
  Radio,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';

interface MaharashtraLiveCityHazardCardProps {
  onExploreFullHub: (cityId: string, hazardType: DisasterHazardType) => void;
}

export const MaharashtraLiveCityHazardCard: React.FC<MaharashtraLiveCityHazardCardProps> = ({
  onExploreFullHub,
}) => {
  // Selected City (Default: Pune)
  const [selectedCityId, setSelectedCityId] = useState<string>('pune');

  // Active City Data
  const activeCity = useMemo<MaharashtraCityData>(() => {
    return MAHARASHTRA_CITIES.find((c) => c.id === selectedCityId) || MAHARASHTRA_CITIES[0];
  }, [selectedCityId]);

  // Selected Hazard for this city (defaults to the city's active hazard)
  const [selectedHazard, setSelectedHazard] = useState<DisasterHazardType>(activeCity.activeHazard);

  // Sync selected hazard when city changes
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const target = MAHARASHTRA_CITIES.find((c) => c.id === cityId);
    if (target) {
      setSelectedHazard(target.activeHazard);
    }
  };

  // Dynamic risk calculation
  const dynamicRiskScore = useMemo(() => {
    let score = activeCity.currentRiskScore;
    if (selectedHazard === 'URBAN_WATERLOGGING') score = Math.min(100, score + 4);
    if (selectedHazard === 'LANDSLIDE') score = Math.max(25, Math.min(100, score + (activeCity.division === 'Konkan' || activeCity.id === 'satara' ? 12 : -8)));
    if (selectedHazard === 'CYCLONE') score = activeCity.division === 'Konkan' ? Math.min(100, score + 10) : 32;
    if (selectedHazard === 'DROUGHT_HEATWAVE') score = activeCity.rainfallMmHr < 30 ? 74 : 38;
    return score;
  }, [activeCity, selectedHazard]);

  const dynamicRiskLevel = useMemo<'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>(() => {
    if (dynamicRiskScore >= 80) return 'CRITICAL';
    if (dynamicRiskScore >= 65) return 'HIGH';
    if (dynamicRiskScore >= 45) return 'MODERATE';
    return 'LOW';
  }, [dynamicRiskScore]);

  const blockedRoadsCount = useMemo(() => {
    return activeCity.roads.filter((r) => r.status === 'BLOCKED').length;
  }, [activeCity]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white p-5 sm:p-6 border-2 border-teal-500/40 shadow-xl space-y-5 animate-fade-in relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar: Status & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white flex items-center gap-1 shadow-xs">
              <ShieldAlert className="w-3 h-3" />
              MAHARASHTRA HAZARDOUS DETECTION GRID
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY
            </span>
            <span className="text-[10px] text-slate-400 font-mono">14:32 IST</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>City Hazardous Detection & Disaster Matrix</span>
          </h3>
          <p className="text-xs text-slate-300">
            Real-time multi-hazard telemetry & road network access across all Maharashtra cities.
          </p>
        </div>

        {/* Explore Hub Button */}
        <button
          onClick={() => onExploreFullHub(activeCity.id, selectedHazard)}
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer group active:scale-95 border border-teal-400/40"
        >
          <span>Open Full Disaster Hub</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* STEP 1: SELECT ANY MAHARASHTRA CITY */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Select Maharashtra City / District:</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">
            All 36 Districts Monitored
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Main Dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedCityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs py-3 px-3.5 rounded-2xl border border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer appearance-none shadow-sm"
            >
              {MAHARASHTRA_CITIES.map((city) => (
                <option key={city.id} value={city.id} className="bg-slate-900 text-white py-1">
                  📍 {city.name} ({city.district}) — {city.division} Div • [Hazard: {city.signatureHazard?.signatureTitle || city.activeHazard}]
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-teal-400 font-bold text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Quick Quick-Select City Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1">
          {[
            'pune',
            'mumbai_city',
            'nashik',
            'nagpur',
            'chhatrapati_sambhajinagar',
            'kolhapur',
            'raigad',
            'ratnagiri',
            'satara',
            'solapur',
            'thane',
            'amravati',
            'nanded',
            'chandrapur',
            'gadchiroli',
            'sindhudurg',
          ].map((cId) => {
            const city = MAHARASHTRA_CITIES.find((c) => c.id === cId);
            if (!city) return null;
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                onClick={() => handleCityChange(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-black shadow-md ring-2 ring-teal-300'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{city.name}</span>
                <span
                  className={`text-[9px] px-1 rounded ${
                    city.riskLevel === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : city.riskLevel === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : 'bg-amber-400 text-slate-900'
                  }`}
                >
                  {city.riskLevel[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* One City One Hazard & Sahyadri Impact Summary Bar */}
        <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white shrink-0">
              One City, One Hazard
            </span>
            <span className="font-extrabold text-white text-xs truncate">
              {activeCity.signatureHazard?.signatureTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shrink-0">
              Sahyadri Impact
            </span>
            <span className="truncate">
              {activeCity.sahyadriImpact?.zoneLabel} ({activeCity.sahyadriImpact?.orographicRainfallMmAnnual})
            </span>
          </div>
        </div>
      </div>

      {/* STEP 2: DISASTER & HAZARD SELECTION FOR SELECTED CITY */}
      <div className="space-y-2 relative z-10 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Select Disaster Type to Inspect for {activeCity.name}:</span>
          </label>
          <span className="text-[11px] text-rose-300 font-bold">
            Active: {HAZARD_TYPE_LABELS[selectedHazard].label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {(Object.keys(HAZARD_TYPE_LABELS) as DisasterHazardType[]).map((hazardKey) => {
            const isSelected = selectedHazard === hazardKey;
            const meta = HAZARD_TYPE_LABELS[hazardKey];
            const isPrimary = activeCity.primaryHazards.includes(hazardKey);

            return (
              <button
                key={hazardKey}
                onClick={() => setSelectedHazard(hazardKey)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-md ring-2 ring-rose-400'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{meta.icon}</span>
                  {isPrimary && (
                    <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-1 rounded">
                      PRIMARY
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-extrabold truncate">{meta.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: LIVE HAZARDOUS DETECTION DATA & METRICS FOR SELECTED CITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 relative z-10">
        {/* Metric 1: Basin & Flood Risk */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-400" /> Hazard Geography
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                dynamicRiskLevel === 'CRITICAL'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : dynamicRiskLevel === 'HIGH'
                  ? 'bg-orange-500 text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              {dynamicRiskLevel} RISK ({dynamicRiskScore}/100)
            </span>
          </div>

          <h4 className="text-sm font-black text-white leading-tight">
            {activeCity.riverBasinOrTerrain}
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-2">
            {activeCity.alertStatus}
          </p>

          <div className="pt-1 flex items-center justify-between text-xs text-slate-300 border-t border-slate-700/80">
            <span>Water Gauge:</span>
            <span className="font-extrabold text-rose-400">
              {activeCity.waterGaugeM}m / Danger {activeCity.dangerMarkM}m
            </span>
          </div>
        </div>

        {/* Metric 2: Wards & Trapped People */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Monitored Wards
            </span>
            <span className="text-[10px] font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
              {activeCity.settlements.length} Settlements
            </span>
          </div>

          <h4 className="text-sm font-black text-white leading-tight">
            {activeCity.settlements[0]?.name || activeCity.name}
          </h4>
          <p className="text-[11px] text-slate-300">
            Population: {activeCity.settlements[0]?.population.toLocaleString('en-IN') || '45,000'} • Saturation: {activeCity.settlements[0]?.soilSaturationPercent || 90}%
          </p>

          <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-700/80">
            <span className="text-slate-400">Trapped Citizens:</span>
            <span className="font-black text-rose-400">
              {activeCity.settlements[0]?.trappedPeopleCount || 15} Persons Awaiting Rescue
            </span>
          </div>
        </div>

        {/* Metric 3: Road Corridors & Accessibility */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Route className="w-3.5 h-3.5 text-amber-400" /> Road Accessibility
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                blockedRoadsCount > 0 ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {blockedRoadsCount > 0 ? `${blockedRoadsCount} BLOCKED` : 'ALL PASSABLE'}
            </span>
          </div>

          <h4 className="text-sm font-black text-white leading-tight truncate">
            {activeCity.roads[0]?.name || 'City Primary Corridor'}
          </h4>
          <p className="text-[11px] text-slate-300 truncate">
            Status: <strong className={activeCity.roads[0]?.status === 'BLOCKED' ? 'text-rose-400' : 'text-emerald-400'}>{activeCity.roads[0]?.status}</strong> • {activeCity.roads[0]?.reason}
          </p>

          <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-700/80">
            <span className="text-slate-400">Rainfall Intensity:</span>
            <span className="font-black text-teal-300">
              {activeCity.rainfallMmHr} mm/hr (Heavy)
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer: 1-Tap Click to Full Hub */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>DEOC Command: {activeCity.commandCenter}</span>
        </div>

        <button
          onClick={() => onExploreFullHub(activeCity.id, selectedHazard)}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <BrainCircuit className="w-4 h-4 text-slate-950" />
          <span>Explore All Details & Evacuation Routes for {activeCity.name} →</span>
        </button>
      </div>
    </div>
  );
};
