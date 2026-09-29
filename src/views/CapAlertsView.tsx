import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CapAlertList } from '../components/alerts/CapAlertList';
import { EmergencyContactRegistry } from '../components/alerts/EmergencyContactRegistry';
import { ShieldAlert, Users, ArrowLeft } from 'lucide-react';

interface CapAlertsViewProps {
  setCurrentTab: (tab: string) => void;
}

export const CapAlertsView: React.FC<CapAlertsViewProps> = ({ setCurrentTab }) => {
  const { activeRole } = useApp();
  const [subTab, setSubTab] = useState<'ALERTS' | 'REGISTRY'>('ALERTS');

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

        {/* View Switcher Pills */}
        <div className="neu-pressed p-1 rounded-xl flex items-center gap-1 bg-slate-100">
          <button
            onClick={() => setSubTab('ALERTS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'ALERTS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CAP Alert Broadcasts</span>
          </button>
          <button
            onClick={() => setSubTab('REGISTRY')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'REGISTRY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Civil Contact Registry</span>
          </button>
        </div>
      </div>

      {/* Render selected module */}
      {subTab === 'ALERTS' ? (
        <CapAlertList onSelectShelter={(shelterId) => setCurrentTab('shelters')} />
      ) : (
        <EmergencyContactRegistry />
      )}
    </div>
  );
};
