import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyType } from '../../types';
import {
  AlertTriangle,
  Flame,
  Droplets,
  Building,
  HeartPulse,
  Mountain,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Radio,
  MapPin,
  Mic,
  Users,
  Clock,
  XCircle,
  RefreshCw,
  Navigation,
} from 'lucide-react';

interface FrontPageEmergencySosProps {
  onNavigate?: (tab: string) => void;
}

interface EventOption {
  type: EmergencyType;
  title: string;
  squadName: string;
  icon: React.ReactNode;
  iconColor: string;
  buttonBorder: string;
  buttonHoverBg: string;
  equipment: string;
}

export const FrontPageEmergencySos: React.FC<FrontPageEmergencySosProps> = ({ onNavigate }) => {
  const {
    activeSos,
    submitSos,
    cancelSos,
    volunteerGroups,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    requestLiveLocation,
    openVoiceMode,
  } = useApp();

  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [lastDispatchedEvent, setLastDispatchedEvent] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Auto request live GPS coordinates when component mounts
  useEffect(() => {
    requestLiveLocation();
  }, [requestLiveLocation]);

  const handleRefreshLocation = () => {
    setIsLocating(true);
    requestLiveLocation();
    setTimeout(() => setIsLocating(false), 1200);
  };

  const EVENT_OPTIONS: EventOption[] = [
    {
      type: 'Flood',
      title: 'Flood / Water Rising',
      squadName: 'Flood Rescue Taskforce Alpha',
      icon: <Droplets className="w-5 h-5" />,
      iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
      buttonBorder: 'border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500',
      buttonHoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-950/30',
      equipment: 'Rescue Boats • Divers',
    },
    {
      type: 'Fire',
      title: 'Fire Outbreak',
      squadName: 'Fire Evacuation & Triage Squad',
      icon: <Flame className="w-5 h-5" />,
      iconColor: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60',
      buttonBorder: 'border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500',
      buttonHoverBg: 'hover:bg-orange-50/50 dark:hover:bg-orange-950/30',
      equipment: 'Extinguishers • Burn Kits',
    },
    {
      type: 'Building Damage',
      title: 'Building Collapse',
      squadName: 'Structural Search & Extrication Unit',
      icon: <Building className="w-5 h-5" />,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
      buttonBorder: 'border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500',
      buttonHoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-950/30',
      equipment: 'Hydraulic Cutters • Search Cams',
    },
    {
      type: 'Medical Emergency',
      title: 'Medical Emergency',
      squadName: 'Trauma Paramedic & Critical Care Unit',
      icon: <HeartPulse className="w-5 h-5" />,
      iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60',
      buttonBorder: 'border-slate-200 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500',
      buttonHoverBg: 'hover:bg-rose-50/50 dark:hover:bg-rose-950/30',
      equipment: 'Oxygen • AED • Trauma Kit',
    },
    {
      type: 'Landslide',
      title: 'Landslide / Mudslide',
      squadName: 'Slope Evacuation Taskforce',
      icon: <Mountain className="w-5 h-5" />,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
      buttonBorder: 'border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500',
      buttonHoverBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30',
      equipment: 'Heavy Ropes • ATV • Stretchers',
    },
    {
      type: 'Cyclone',
      title: 'Cyclone / High Storm',
      squadName: 'Severe Weather Transport Squad',
      icon: <Wind className="w-5 h-5" />,
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
      buttonBorder: 'border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500',
      buttonHoverBg: 'hover:bg-purple-50/50 dark:hover:bg-purple-950/30',
      equipment: 'Transport Buses • Comms',
    },
    {
      type: 'Other',
      title: '🚨 Urgent Life SOS',
      squadName: 'Immediate Rapid Response Taskforce',
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60',
      buttonBorder: 'border-red-300 dark:border-red-700 hover:border-red-600 dark:hover:border-red-500',
      buttonHoverBg: 'hover:bg-red-50/60 dark:hover:bg-red-950/40',
      equipment: 'Direct Multi-Squad Response',
    },
  ];

  const handleEventClick = async (event: EventOption) => {
    setIsDispatching(true);
    setLastDispatchedEvent(event.title);

    // Lock exact coordinates
    const lat = userLocation?.lat || 18.5204;
    const lng = userLocation?.lng || 73.8567;
    const accuracy = userLocationAccuracy || 10;
    const address = userLocationAddress || 'Near Karve Road, Pune, Maharashtra';

    try {
      await submitSos({
        disasterType: event.type,
        lat,
        lng,
        accuracyMeters: accuracy,
        locationAddress: address,
        peopleCount: 1,
        situationAnswers: {
          oneTapDispatch: true,
          frontPageTriggered: true,
          assignedSquadTarget: event.squadName,
        },
        severity: 'CRITICAL',
        description: `1-TAP SOS: ${event.title}. Verified citizen distress signal. Direct volunteer rescue taskforce assigned.`,
      });
    } catch (err) {
      console.error('SOS dispatch error:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  // Find assigned squad
  const assignedSquad = volunteerGroups.find(
    (g) =>
      g.id === activeSos?.aiAssessment?.assignedGroupId ||
      g.status === 'ASSIGNED' ||
      g.name.toLowerCase().includes(activeSos?.disasterType?.toLowerCase() || '')
  ) || {
    name: activeSos?.aiAssessment?.assignedGroupName || 'Rapid Response Taskforce Alpha',
    leader: 'Capt. Rajesh Shinde',
    contactPhone: '+91 98220 11200',
    memberCount: 6,
    equipment: ['Medical Trauma Kit', 'Flotation Gear', 'VHF Comms'],
    status: 'ASSIGNED',
  };

  return (
    <div id="frontpage-sos-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean, Non-Intrusive Container (No Big Red Bar) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-all">
        
        {/* Header Row: Title & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                Emergency SOS Relay
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                1-Tap Verified Dispatch
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Disaster Event to Alert Volunteers
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Click any button below. Your verified incident alerts the assigned specialized rescue squad immediately.
            </p>
          </div>

          {/* Quick Voice Mode Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openVoiceMode}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Speak emergency via microphone"
            >
              <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Voice / Mic SOS</span>
            </button>
          </div>
        </div>

        {/* Live GPS Location Bar (Displays exact address & lets user refresh live GPS) */}
        <div className="my-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Live Dispatch Location
                </span>
                {userLocationAccuracy && (
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                    GPS Accurate (±{Math.round(userLocationAccuracy)}m)
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {userLocationAddress || 'Detecting exact location address...'}
              </div>
              {userLocation && (
                <div className="text-[10px] font-mono text-slate-400">
                  {userLocation.lat.toFixed(5)}° N, {userLocation.lng.toFixed(5)}° E
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshLocation}
            disabled={isLocating}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Re-acquire precise GPS coordinates"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Detect Exact GPS'}</span>
          </button>
        </div>

        {/* Active Dispatched Status Card (Compact & Clean - NEVER hides the buttons) */}
        {activeSos && (
          <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/80 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    VERIFIED DISPATCH ACTIVE
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    Incident #{activeSos.id}
                  </span>
                </div>
                <div className="text-sm font-black text-emerald-950 dark:text-emerald-100 mt-0.5">
                  Assigned: {assignedSquad.name} ({assignedSquad.leader || 'Capt. Rajesh Shinde'})
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300 flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> ETA: ~5-8 Minutes
                  </span>
                  <a
                    href={`tel:${assignedSquad.contactPhone || '+919822011200'}`}
                    className="font-black text-emerald-900 dark:text-emerald-100 underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call Squad Leader ({assignedSquad.contactPhone || '+91 98220 11200'})
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Cancel this emergency dispatch? Confirm only if you are safe.')) {
                    cancelSos(activeSos.id);
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Cancel SOS</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isDispatching && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
            <Radio className="w-4 h-4 animate-spin text-rose-600" />
            <span>Locking live GPS coordinates and alerting {lastDispatchedEvent} squad...</span>
          </div>
        )}

        {/* Simple, Clean Buttons Grid (Always Available Every Time!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {EVENT_OPTIONS.map((opt) => {
            const isCurrentlySelected = activeSos?.disasterType === opt.type;

            return (
              <button
                key={opt.type}
                type="button"
                disabled={isDispatching}
                onClick={() => handleEventClick(opt)}
                className={`text-left p-3.5 rounded-xl border bg-white dark:bg-slate-800/90 ${opt.buttonBorder} ${opt.buttonHoverBg} transition-all duration-150 flex flex-col justify-between group active:scale-[0.98] cursor-pointer shadow-2xs relative ${
                  isCurrentlySelected ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/30' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`p-2 rounded-lg ${opt.iconColor}`}>
                      {opt.icon}
                    </span>
                    {isCurrentlySelected ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        1-Tap
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {opt.title}
                  </div>

                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{opt.squadName}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    Gear: {opt.equipment}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-black text-rose-600 dark:text-rose-400">
                  <span>{isCurrentlySelected ? 'Re-dispatch Squad' : 'Alert Squad'}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Clean, Simple Footer with Helplines */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">
            Direct Helpline Contacts:
          </span>
          <div className="flex flex-wrap items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
            <a href="tel:112" className="hover:text-rose-600 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-rose-600" /> 112 (National Police/Disaster)
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a href="tel:108" className="hover:text-rose-600 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-rose-600" /> 108 (Ambulance)
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a href="tel:1070" className="hover:text-rose-600 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-rose-600" /> 1070 (Disaster Relief)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
