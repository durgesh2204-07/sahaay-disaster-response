import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyContactRecord } from '../../types';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Phone,
  MapPin,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Lock,
} from 'lucide-react';

export const EmergencyContactRegistry: React.FC = () => {
  const { emergencyContacts, updateContactPrivacy, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEligibility, setFilterEligibility] = useState<string>('ALL');

  const filteredContacts = (emergencyContacts || []).filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);

    if (filterEligibility === 'ALL') return matchesSearch;
    return matchesSearch && contact.alertEligibility === filterEligibility;
  });

  const getEligibilityBadge = (eligibility: string) => {
    switch (eligibility) {
      case 'ELIGIBLE':
        return <span className="neu-badge-success">ELIGIBLE FOR DISPATCH</span>;
      case 'LOCATION_DISABLED':
        return <span className="neu-badge-warning">LOCATION OFF</span>;
      case 'OPTED_OUT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">OPTED OUT</span>;
      default:
        return <span className="neu-badge-warning bg-amber-50 text-amber-800 border-amber-200">UNVERIFIED</span>;
    }
  };

  const handleTogglePreference = async (
    contactId: string,
    field: 'emergencyAlertOptIn' | 'weatherAlertOptIn' | 'locationSharingPermission' | 'notificationPermission',
    currentVal: boolean
  ) => {
    await updateContactPrivacy(contactId, { [field]: !currentVal });
  };

  return (
    <div className="space-y-5">
      {/* Header with quick stats */}
      <div className="neu-flat p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              Civil Protection Registry
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Total {emergencyContacts.length} Registered Citizens
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Citizen Emergency Notification Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Opt-in telecommunication channels for geotargeted CAP emergency alerts and early warning bulletins.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="neu-pressed px-3 py-2 rounded-xl bg-slate-50 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Eligible</span>
            <span className="text-sm font-extrabold text-emerald-600">
              {(emergencyContacts || []).filter((c) => c.alertEligibility === 'ELIGIBLE').length}
            </span>
          </div>
          <div className="neu-pressed px-3 py-2 rounded-xl bg-slate-50 text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Location Shared</span>
            <span className="text-sm font-extrabold text-blue-600">
              {(emergencyContacts || []).filter((c) => c.locationSharingPermission).length}
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Citizen Privacy Protection: </span>
          <span>
            Mobile numbers (+91-XXXXX) and location coordinates are protected under disaster civil defence protocols. Citizens maintain full sovereignty over notification preferences and can revoke location sharing or alert subscriptions at any time.
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="neu-flat p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by citizen name or +91 phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-input pl-9 w-full text-xs font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ELIGIBLE', 'LOCATION_DISABLED', 'OPTED_OUT', 'UNVERIFIED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterEligibility(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterEligibility === status
                  ? 'bg-blue-600 text-white neu-raised'
                  : 'neu-btn-secondary text-slate-600 hover:text-slate-900'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table / Cards */}
      <div className="neu-flat rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Citizen Profile</th>
                <th className="py-3.5 px-4">Mobile & Status</th>
                <th className="py-3.5 px-4">Emergency Alerts</th>
                <th className="py-3.5 px-4">Weather Alerts</th>
                <th className="py-3.5 px-4">Live Location</th>
                <th className="py-3.5 px-4">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{contact.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Active: {contact.lastActive}</div>
                  </td>

                  {/* Phone & verification */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{contact.phone}</span>
                    </div>
                    <span
                      className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                        contact.registrationStatus === 'VERIFIED'
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-amber-700 bg-amber-50'
                      }`}
                    >
                      {contact.registrationStatus}
                    </span>
                  </td>

                  {/* Emergency Opt-in Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        handleTogglePreference(contact.id, 'emergencyAlertOptIn', contact.emergencyAlertOptIn)
                      }
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        contact.emergencyAlertOptIn
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {contact.emergencyAlertOptIn ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </td>

                  {/* Weather Opt-in Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        handleTogglePreference(contact.id, 'weatherAlertOptIn', contact.weatherAlertOptIn)
                      }
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        contact.weatherAlertOptIn
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {contact.weatherAlertOptIn ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </td>

                  {/* Location Sharing Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        handleTogglePreference(
                          contact.id,
                          'locationSharingPermission',
                          contact.locationSharingPermission
                        )
                      }
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                        contact.locationSharingPermission
                          ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      {contact.locationSharingPermission ? 'ALLOWED' : 'OFF'}
                    </button>
                    {contact.approxDistanceKm !== undefined && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        {contact.approxDistanceKm} km away
                      </span>
                    )}
                  </td>

                  {/* Eligibility */}
                  <td className="py-3.5 px-4">{getEligibilityBadge(contact.alertEligibility)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
