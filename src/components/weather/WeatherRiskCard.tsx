import React from 'react';
import { WeatherRiskItem, WeatherRiskLevel } from '../../types';
import {
  CloudRain,
  CloudDrizzle,
  Waves,
  Zap,
  Wind,
  EyeOff,
  Sun,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface WeatherRiskCardProps {
  risk: WeatherRiskItem;
  compact?: boolean;
}

export const WeatherRiskCard: React.FC<WeatherRiskCardProps> = ({ risk, compact = false }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-5 h-5 text-sky-400" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-indigo-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-500" />;
      case 'EyeOff':
        return <EyeOff className="w-5 h-5 text-slate-500" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getRiskBadge = (level: WeatherRiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="neu-badge-critical">CRITICAL HAZARD</span>;
      case 'HIGH':
        return <span className="neu-badge-warning bg-rose-50 text-rose-700 border-rose-300">HIGH RISK</span>;
      case 'MODERATE':
        return <span className="neu-badge-warning">MODERATE RISK</span>;
      case 'LOW':
      default:
        return <span className="neu-badge-success">LOW RISK</span>;
    }
  };

  const getBorderAccent = (level: WeatherRiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'border-l-4 border-l-red-600';
      case 'HIGH':
        return 'border-l-4 border-l-rose-500';
      case 'MODERATE':
        return 'border-l-4 border-l-amber-500';
      case 'LOW':
      default:
        return 'border-l-4 border-l-emerald-500';
    }
  };

  if (compact) {
    return (
      <div className={`neu-flat p-3 rounded-xl flex items-start gap-3 ${getBorderAccent(risk.riskLevel)}`}>
        <div className="p-2 rounded-lg bg-blue-50/80 neu-pressed shrink-0">
          {getIcon(risk.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{risk.hazard}</h4>
            {getRiskBadge(risk.riskLevel)}
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{risk.reason}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`neu-flat p-4 rounded-xl space-y-3 ${getBorderAccent(risk.riskLevel)} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50/90 neu-pressed shrink-0">
            {getIcon(risk.icon)}
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">{risk.hazard}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Valid Period: {risk.forecastPeriod}</span>
            </div>
          </div>
        </div>
        <div>{getRiskBadge(risk.riskLevel)}</div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-100 neu-pressed">
        {risk.reason}
      </p>

      {risk.recommendedAction && (
        <div className="flex items-start gap-2.5 text-xs text-blue-900 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-800">Action Protocol: </span>
            <span>{risk.recommendedAction}</span>
          </div>
        </div>
      )}
    </div>
  );
};
