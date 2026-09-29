import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherRiskCard } from './WeatherRiskCard';
import {
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Moon,
  Wind,
  Droplets,
  Compass,
  Gauge,
  Eye,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Info,
  Calendar,
  Clock,
  LocateFixed,
  Search,
  Check,
  Navigation,
  Loader2,
  X,
} from 'lucide-react';

interface GeoSearchResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const WeatherDashboard: React.FC = () => {
  const {
    weatherData,
    isLoadingWeather,
    fetchWeather,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    gpsStatus,
    requestLiveLocation,
    setManualLocation,
    activeCapAlerts,
  } = useApp();

  const [selectedCity, setSelectedCity] = useState<'CURRENT' | 'PUNE' | 'MUMBAI' | 'DELHI' | 'BENGALURU' | 'CUSTOM'>('CURRENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.results)) {
            setSearchResults(data.results);
            setShowSearchDropdown(true);
          }
        }
      } catch (err) {
        console.warn('Geo search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (result: GeoSearchResult) => {
    setSelectedCity('CUSTOM');
    setManualLocation(result.address, result.lat, result.lng);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const handleCitySwitch = (city: 'CURRENT' | 'PUNE' | 'MUMBAI' | 'DELHI' | 'BENGALURU') => {
    setSelectedCity(city);
    if (city === 'CURRENT') {
      requestLiveLocation();
      if (userLocation) {
        fetchWeather(userLocation.lat, userLocation.lng, userLocationAddress);
      }
    } else if (city === 'PUNE') {
      setManualLocation('Pune, Maharashtra, India', 18.5204, 73.8567);
    } else if (city === 'MUMBAI') {
      setManualLocation('Mumbai, Maharashtra, India', 19.076, 72.8777);
    } else if (city === 'DELHI') {
      setManualLocation('New Delhi, Delhi, India', 28.6139, 77.209);
    } else if (city === 'BENGALURU') {
      setManualLocation('Bengaluru, Karnataka, India', 12.9716, 77.5946);
    }
  };

  const handleRefresh = () => {
    if (selectedCity === 'CURRENT' && userLocation) {
      fetchWeather(userLocation.lat, userLocation.lng, userLocationAddress);
    } else if (weatherData) {
      fetchWeather(undefined, undefined, weatherData.locationName);
    } else {
      fetchWeather();
    }
  };

  const getWeatherIcon = (iconName: string, className: string = 'w-8 h-8') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'Moon':
        return <Moon className={`${className} text-indigo-400`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-sky-400`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-indigo-600`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-slate-400`} />;
      default:
        return <Cloud className={`${className} text-sky-500`} />;
    }
  };

  const getConditionIconName = (condition: string, isDay: boolean = true) => {
    const c = (condition || '').toLowerCase();
    if (c.includes('thunder') || c.includes('lightning') || c.includes('storm')) return 'CloudLightning';
    if (c.includes('heavy rain') || c.includes('showers') || c.includes('rain')) return 'CloudRain';
    if (c.includes('drizzle')) return 'CloudDrizzle';
    if (c.includes('fog') || c.includes('mist')) return 'CloudFog';
    if (!isDay && (c.includes('clear') || c.includes('fair') || c.includes('night'))) return 'Moon';
    if (c.includes('clear') || c.includes('sunny')) return 'Sun';
    return 'CloudSun';
  };

  const getRiskOverallBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="neu-badge-critical text-sm px-3 py-1 animate-pulse flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            CRITICAL WEATHER THREAT
          </span>
        );
      case 'HIGH':
        return (
          <span className="neu-badge-warning bg-rose-50 text-rose-700 border-rose-300 text-sm px-3 py-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            HIGH ADVISORY RISK
          </span>
        );
      case 'MODERATE':
        return (
          <span className="neu-badge-warning text-sm px-3 py-1 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            MODERATE RISK
          </span>
        );
      default:
        return (
          <span className="neu-badge-success text-sm px-3 py-1 flex items-center gap-1.5">
            NORMAL CONDITIONS
          </span>
        );
    }
  };

  // Format temperature with high precision (1 decimal place)
  const formatTemp = (temp: number | undefined | null): string => {
    if (temp == null || isNaN(temp)) return '--';
    return Number(temp).toFixed(1);
  };

  const displayLocation = weatherData?.locationName || userLocationAddress || 'Detecting local atmospheric station...';

  return (
    <div className="space-y-6">
      {/* Header & Location Selection */}
      <div className="flex flex-col gap-4 neu-flat p-4 sm:p-6 rounded-2xl bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-100 text-blue-800 border border-blue-200">
                Live Early Warning Module
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                {gpsStatus === 'ACTIVE'
                  ? userLocationAccuracy
                    ? `GPS Locked (±${Math.round(userLocationAccuracy)}m)`
                    : 'Location Active'
                  : gpsStatus === 'ACQUIRING'
                  ? 'Acquiring GPS...'
                  : 'Network Telemetry'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Weather Intelligence & Atmospheric Hazard Matrix
            </h1>
            <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{displayLocation}</span>
            </div>
          </div>

          {/* Quick Actions: Locate Me & Refresh */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleCitySwitch('CURRENT')}
              disabled={gpsStatus === 'ACQUIRING'}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors"
              title="Detect precise GPS location"
            >
              <LocateFixed className={`w-4 h-4 text-blue-600 ${gpsStatus === 'ACQUIRING' ? 'animate-spin' : ''}`} />
              <span>{gpsStatus === 'ACQUIRING' ? 'Detecting...' : 'Detect GPS'}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoadingWeather}
              className="neu-btn-primary p-2.5 rounded-xl flex items-center justify-center shrink-0"
              title="Refresh Live Weather"
            >
              <RefreshCw className={`w-4 h-4 text-white ${isLoadingWeather ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Address Search Bar & Preset City Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Address Autocomplete Search Input */}
          <div className="relative flex-1 max-w-md" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                placeholder="Search any address, city, or locality..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 text-blue-500 absolute right-3 animate-spin" />
              )}
              {searchQuery && !isSearching && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 transition-colors flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{item.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Preset City Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
              Cities:
            </span>
            <div className="p-1 rounded-xl flex items-center gap-1 bg-slate-100/90 border border-slate-200/60">
              <button
                onClick={() => handleCitySwitch('CURRENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === 'CURRENT'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Location
              </button>
              <button
                onClick={() => handleCitySwitch('PUNE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === 'PUNE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pune
              </button>
              <button
                onClick={() => handleCitySwitch('MUMBAI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === 'MUMBAI'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mumbai
              </button>
              <button
                onClick={() => handleCitySwitch('DELHI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === 'DELHI'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Delhi
              </button>
              <button
                onClick={() => handleCitySwitch('BENGALURU')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === 'BENGALURU'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bengaluru
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Warning Linkage Banner (if active official alert present) */}
      {activeCapAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 neu-flat flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="neu-badge-critical text-xs">OFFICIAL STATE EMERGENCY BULLETIN</span>
                <span className="text-xs text-red-700 font-mono font-bold">
                  {activeCapAlerts[0].identifier}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-red-950 mt-1">
                {activeCapAlerts[0].headline}
              </h3>
              <p className="text-xs text-red-800 mt-0.5 line-clamp-2">
                {activeCapAlerts[0].instruction}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-md border border-red-200">
              Target: {activeCapAlerts[0].area.areaDesc}
            </span>
          </div>
        </div>
      )}

      {/* Main Meteorological Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card */}
        <div className="neu-flat p-6 rounded-2xl flex flex-col justify-between space-y-6 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Atmospheric Observations
              </span>
              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {weatherData ? `${formatTemp(weatherData.temperature)}°C` : '--'}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500">
                    Feels like {weatherData ? `${formatTemp(weatherData.feelsLike)}°C` : '--'}
                  </span>
                  {weatherData?.tempMax != null && weatherData?.tempMin != null && (
                    <span className="text-xs font-bold text-slate-700">
                      H: {formatTemp(weatherData.tempMax)}° • L: {formatTemp(weatherData.tempMin)}°
                    </span>
                  )}
                </div>
              </div>
              <p className="text-base font-bold text-slate-800 mt-1">
                {weatherData?.condition || 'Loading meteorological stream...'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 neu-raised shrink-0">
              {getWeatherIcon(weatherData?.conditionIcon || 'CloudRain', 'w-10 h-10')}
            </div>
          </div>

          {/* Meteorological Metrics 4-grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="neu-pressed p-3 rounded-xl bg-slate-50/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Relative Humidity</span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {weatherData ? `${weatherData.humidity}%` : '--'}
              </span>
            </div>

            <div className="neu-pressed p-3 rounded-xl bg-slate-50/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                <span>Wind & Direction</span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {weatherData ? `${weatherData.windSpeed} km/h` : '--'}{' '}
                <span className="text-xs font-medium text-slate-500">{weatherData?.windDirection}</span>
              </span>
              {weatherData?.windGusts ? (
                <span className="text-[11px] text-slate-500 block">
                  Gusts up to {weatherData.windGusts} km/h
                </span>
              ) : null}
            </div>

            <div className="neu-pressed p-3 rounded-xl bg-slate-50/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
                <span>Rain Probability</span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {weatherData ? `${weatherData.rainProbability}%` : '--'}
              </span>
            </div>

            <div className="neu-pressed p-3 rounded-xl bg-slate-50/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Gauge className="w-3.5 h-3.5 text-purple-500" />
                <span>Atmospheric Pressure</span>
              </div>
              <span className="text-base font-bold text-slate-900">
                {weatherData ? `${weatherData.pressure} hPa` : '--'}
              </span>
            </div>
          </div>

          {/* Sub metrics & UV */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 flex-wrap gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Visibility: {weatherData ? `${weatherData.visibility} km` : '--'}
            </span>
            <span>UV Index: {weatherData?.uvIndex ?? 4} (Moderate)</span>
            <span>Sunrise: {weatherData?.sunrise || '06:12 AM'}</span>
          </div>
        </div>

        {/* Hazard Risk Engine Overview */}
        <div className="lg:col-span-2 neu-flat p-6 rounded-2xl flex flex-col justify-between space-y-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Atmospheric Risk Assessment Engine
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Live Matrix
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-parameter evaluation: Precipitation, Runoff Saturation, Thunderstorm Instability & Gale Gusts
              </p>
            </div>
            <div>{getRiskOverallBadge(weatherData?.overallRiskLevel || 'NORMAL')}</div>
          </div>

          {/* Risk Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weatherData?.risks && weatherData.risks.length > 0 ? (
              weatherData.risks.map((risk, index) => (
                <WeatherRiskCard key={index} risk={risk} compact />
              ))
            ) : (
              <div className="col-span-2 p-6 text-center text-slate-500 text-sm neu-pressed rounded-xl bg-slate-50/50">
                No immediate hazardous weather anomalies detected for current coordinates.
              </div>
            )}
          </div>

          {/* Transparent Regulatory Disclaimers (Required as per mandate) */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">Notice on Forecast & Risk Interpretation: </span>
                <span>
                  Forecast accuracy depends on high-resolution meteorological models and local topography. Risk calculations reflect environmental sensor analysis. Official civil evacuation orders are published under Common Alerting Protocol (CAP) civil bulletins.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Forecast Timeline */}
      <div className="neu-flat p-6 rounded-2xl space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">24-Hour Hourly Precipitation & Temperature Trajectory</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Hourly Intervals</span>
        </div>

        <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
          <div className="flex items-center gap-3 min-w-[720px]">
            {weatherData?.hourlyForecast && weatherData.hourlyForecast.length > 0 ? (
              weatherData.hourlyForecast.slice(0, 12).map((item, idx) => (
                <div
                  key={idx}
                  className="neu-pressed p-3 rounded-xl bg-slate-50/60 flex-1 flex flex-col items-center justify-between text-center min-w-[85px] space-y-2 border border-slate-100 hover:border-blue-200 transition-all"
                >
                  <span className="text-xs font-bold text-slate-600">{item.time}</span>
                  <div className="p-1.5 rounded-lg bg-white neu-flat">
                    {getWeatherIcon(getConditionIconName(item.condition), 'w-5 h-5')}
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{formatTemp(item.temp)}°</span>
                  <div className="w-full bg-blue-100/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${Math.min(item.pop, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700">{item.pop}% PoP</span>
                  <span className="text-[10px] text-slate-500">{item.rainMm} mm</span>
                </div>
              ))
            ) : (
              <div className="w-full py-4 text-center text-xs text-slate-500">
                Loading hourly forecast curve...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Weather Outlook */}
      <div className="neu-flat p-6 rounded-2xl space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">7-Day Synoptic Meteorological Outlook</h3>
          </div>
          <span className="text-xs text-slate-500">High-Resolution Open-Meteo Guidance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weatherData?.dailyForecast && weatherData.dailyForecast.length > 0 ? (
            weatherData.dailyForecast.map((day, dIdx) => (
              <div
                key={dIdx}
                className={`neu-pressed p-3.5 rounded-xl bg-white/80 flex flex-col justify-between items-center text-center space-y-2 border ${
                  dIdx === 0 ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-100'
                }`}
              >
                <div>
                  <span className="text-xs font-black text-slate-900 block">{day.day}</span>
                  <span className="text-[10px] text-slate-500 block">{day.date}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 neu-flat my-1">
                  {getWeatherIcon(getConditionIconName(day.condition), 'w-6 h-6')}
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-slate-900">{formatTemp(day.maxTemp)}°</span>{' '}
                  <span className="text-slate-400 font-medium">/ {formatTemp(day.minTemp)}°</span>
                </div>
                <div className="w-full">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block w-full">
                    {day.rainProb}% Rain
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-7 py-4 text-center text-xs text-slate-500">
              Loading weekly meteorological projection...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
