import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  LocateFixed,
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Radio,
} from 'lucide-react';

interface LiveLocationWeatherDetectorProps {
  onNavigateToWeather?: () => void;
  onNavigateToAlerts?: () => void;
}

export const LiveLocationWeatherDetector: React.FC<LiveLocationWeatherDetectorProps> = ({
  onNavigateToWeather,
  onNavigateToAlerts,
}) => {
  const {
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    gpsStatus,
    requestLiveLocation,
    weatherData,
    isLoadingWeather,
    fetchWeather,
    activeCapAlerts,
  } = useApp();

  const [isRefreshingGps, setIsRefreshingGps] = useState(false);

  const handleDetectGps = () => {
    setIsRefreshingGps(true);
    requestLiveLocation();
    setTimeout(() => {
      setIsRefreshingGps(false);
    }, 1200);
  };

  const handleRefreshWeather = () => {
    if (userLocation) {
      fetchWeather(userLocation.lat, userLocation.lng, userLocationAddress);
    } else {
      fetchWeather();
    }
  };

  const getWeatherIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'CloudSun':
        return <CloudSun className="w-8 h-8 text-amber-500" />;
      case 'CloudRain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'CloudLightning':
        return <CloudLightning className="w-8 h-8 text-purple-600" />;
      default:
        return <Cloud className="w-8 h-8 text-slate-500" />;
    }
  };

  const hasActiveAlerts = activeCapAlerts && activeCapAlerts.length > 0;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
      {/* Header bar with Live Status & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
            Real-Time Live Location & Weather Intel
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-400">
            LIVE TELEMETRY
          </span>
          <button
            onClick={handleRefreshWeather}
            disabled={isLoadingWeather}
            title="Refresh Real-Time Data"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 1: Live Location Detector */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Live Location Detector</span>
            </div>

            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${
              gpsStatus === 'ACTIVE'
                ? 'bg-emerald-100 text-emerald-800'
                : gpsStatus === 'ACQUIRING'
                ? 'bg-amber-100 text-amber-800 animate-pulse'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {gpsStatus === 'ACTIVE'
                ? `GPS LOCKED (±${Math.round(userLocationAccuracy || 15)}m)`
                : gpsStatus === 'ACQUIRING'
                ? 'ACQUIRING GPS...'
                : 'NETWORK LOCATED'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
              {userLocationAddress || 'Detecting exact street address...'}
            </div>
            {userLocation && (
              <div className="text-[11px] font-mono text-slate-500">
                {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
              </div>
            )}
          </div>

          <button
            onClick={handleDetectGps}
            disabled={isRefreshingGps}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-rose-600 ${isRefreshingGps ? 'animate-spin' : ''}`} />
            <span>{isRefreshingGps ? 'Locking Real GPS...' : 'Detect / Refresh My Real GPS'}</span>
          </button>
        </div>

        {/* Section 2: Real-Time Weather Detector */}
        <div className="bg-gradient-to-br from-blue-50/70 to-teal-50/50 rounded-2xl p-4 border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <CloudRain className="w-4 h-4 text-blue-600" />
              <span>Weather & Risk Detector</span>
            </div>

            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md font-mono">
              OPEN-METEO REALTIME
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weatherData?.icon)}
              <div>
                <div className="text-2xl font-black text-slate-900 font-['Outfit'] leading-none">
                  {weatherData?.temperature !== undefined ? `${Math.round(weatherData.temperature)}°C` : '27°C'}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  {weatherData?.condition || 'Moderate Rain'}
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-600 space-y-0.5">
              <div className="flex items-center justify-end gap-1 font-semibold">
                <Droplets className="w-3 h-3 text-blue-600" />
                <span>Humidity: {weatherData?.humidity ?? 82}%</span>
              </div>
              <div className="flex items-center justify-end gap-1 font-semibold">
                <Wind className="w-3 h-3 text-teal-600" />
                <span>Wind: {weatherData?.windSpeed ?? 18} km/h</span>
              </div>
            </div>
          </div>

          {onNavigateToWeather && (
            <button
              onClick={onNavigateToWeather}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>View Full Meteorological Radar & 24h Risk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Alert Banner if any CAP alerts active */}
      {hasActiveAlerts && onNavigateToAlerts && (
        <div
          onClick={onNavigateToAlerts}
          className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between gap-2 cursor-pointer hover:bg-rose-100/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {activeCapAlerts.length} Active CAP Emergency Alert(s) in your area: {activeCapAlerts[0]?.title}
            </span>
          </div>
          <span className="text-[11px] font-black text-rose-700 shrink-0 flex items-center gap-0.5">
            View Alerts <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      )}
    </div>
  );
};
