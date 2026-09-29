import React from 'react';
import { useApp } from '../context/AppContext';
import { WeatherDashboard } from '../components/weather/WeatherDashboard';
import { CloudRain, ArrowLeft, Shield } from 'lucide-react';

interface WeatherDashboardViewProps {
  setCurrentTab: (tab: string) => void;
}

export const WeatherDashboardView: React.FC<WeatherDashboardViewProps> = ({ setCurrentTab }) => {
  const { activeRole } = useApp();

  const handleBack = () => {
    if (activeRole === 'admin') setCurrentTab('admin_dashboard');
    else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
    else setCurrentTab('citizen_dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="neu-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            Meteorological Intelligence Unit
          </span>
        </div>
      </div>

      {/* Main Weather Intelligence Component */}
      <WeatherDashboard />
    </div>
  );
};
