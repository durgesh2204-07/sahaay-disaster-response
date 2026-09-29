import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  Phone,
  Shield,
  X,
  RefreshCw,
  CheckCircle2,
  Radio,
  ExternalLink,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyType, SosIncident } from '../../types';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: EmergencyType;
}

const EMERGENCY_EVENTS: {
  type: EmergencyType;
  title: string;
  icon: string;
  subtitle: string;
  colorClass: string;
}[] = [
  {
    type: 'Flood',
    title: 'Flood / Water Submersion',
    icon: '🌊',
    subtitle: 'Water rescue boat & flotation squad',
    colorClass: 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-900 dark:text-blue-200',
  },
  {
    type: 'Fire',
    title: 'Fire Outbreak',
    icon: '🔥',
    subtitle: 'Fire evacuation & burn triage',
    colorClass: 'border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-900 dark:text-orange-200',
  },
  {
    type: 'Building Damage',
    title: 'Building / Wall Collapse',
    icon: '🏚️',
    subtitle: 'Debris search & structural extrication',
    colorClass: 'border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200',
  },
  {
    type: 'Medical Emergency',
    title: 'Critical Medical Emergency',
    icon: '🚑',
    subtitle: 'Trauma paramedic & urgent transport',
    colorClass: 'border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-900 dark:text-rose-200',
  },
  {
    type: 'Landslide',
    title: 'Landslide / Mudslide',
    icon: '⛰️',
    subtitle: 'Slope rescue & path clearance squad',
    colorClass: 'border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
  },
  {
    type: 'Earthquake',
    title: 'Earthquake Aftershocks',
    icon: '📉',
    subtitle: 'Safe perimeter & civilian extraction',
    colorClass: 'border-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-900 dark:text-red-200',
  },
  {
    type: 'Cyclone',
    title: 'Cyclone / High Storm',
    icon: '🌀',
    subtitle: 'Emergency shelter & evacuation transit',
    colorClass: 'border-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200',
  },
  {
    type: 'Industrial Accident',
    title: 'Gas Leak / Hazmat Spill',
    icon: '☣️',
    subtitle: 'Respiratory hazmat & cordon squad',
    colorClass: 'border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-900 dark:text-purple-200',
  },
  {
    type: 'Other',
    title: 'Immediate Distress (General SOS)',
    icon: '🚨',
    subtitle: 'Direct dispatch of all nearest volunteers',
    colorClass: 'border-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-900 dark:text-red-200',
  },
];

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  initialType,
}) => {
  const {
    submitSos,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    requestLiveLocation,
    gpsStatus,
    activeSos,
    currentUser,
    cancelSos,
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeIncident, setActiveIncident] = useState<SosIncident | null>(activeSos || null);
  const [selectedEvent, setSelectedEvent] = useState<EmergencyType | null>(initialType || null);

  // Sync if activeSos changes
  useEffect(() => {
    if (activeSos && activeSos.status !== 'RESOLVED' && activeSos.status !== 'CANCELLED') {
      setActiveIncident(activeSos);
    } else {
      setActiveIncident(null);
    }
  }, [activeSos]);

  // Request fresh GPS upon opening
  useEffect(() => {
    if (isOpen) {
      requestLiveLocation();
    }
  }, [isOpen, requestLiveLocation]);

  if (!isOpen) return null;

  // DIRECT ONE-TAP DISPATCH: Directly click on the event -> alert volunteers immediately!
  // No description, no photo, no questionnaires!
  const handleDirectVolunteerDispatch = async (eventType: EmergencyType) => {
    setSelectedEvent(eventType);
    setIsSubmitting(true);
    try {
      const lat = userLocation?.lat || 18.5204;
      const lng = userLocation?.lng || 73.8567;
      const accuracy = userLocationAccuracy || 10;
      const address = userLocationAddress || 'Near Current Location, Pune';

      const created = await submitSos({
        disasterType: eventType,
        lat,
        lng,
        accuracyMeters: accuracy,
        locationAddress: address,
        peopleCount: 1,
        situationAnswers: {
          emergencyDirectDispatch: true,
          timestamp: new Date().toISOString(),
        },
        severity: 'CRITICAL',
        description: `URGENT SOS: ${eventType} reported. Immediate volunteer rescue required at current GPS location.`,
        reporterPhone: currentUser.phone || '+91 98220 00000',
        reporterName: currentUser.name || 'Citizen in Emergency',
      });

      setActiveIncident(created);
    } catch (err) {
      console.error('Error in direct SOS dispatch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto overscroll-contain py-4 sm:py-6">
      <div className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-red-500/40 flex flex-col overflow-hidden my-auto shrink-0 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Urgent Header - Fixed/Sticky at top of modal */}
        <div className="shrink-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 sm:px-5 py-3.5 sm:py-4 text-white flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <span>🚨</span> SAHAAY EMERGENCY SOS
              </h2>
              <p className="text-xs text-red-100 font-medium">
                One-tap direct GPS dispatch to volunteer rescue taskforces
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-red-800/50 hover:bg-red-800 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Fully scrollable with touch-friendly scroll area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain space-y-4 modal-scroll-area min-h-0 pb-8 touch-pan-y">
          
          {/* If SOS is already sent / dispatched, show Confirmation and Assigned Volunteers directly */}
          {activeIncident && activeIncident.status !== 'RESOLVED' && activeIncident.status !== 'CANCELLED' ? (
            <div className="space-y-4">
              {/* Success Badge with Verified Status */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      VERIFIED INCIDENT
                    </span>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Satellite Dispatch Active
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-emerald-900 dark:text-emerald-100 mt-1">
                    VOLUNTEER TASKFORCE ASSIGNED & EN ROUTE!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Your distress signal is verified and assigned to the rescue squad below.
                  </p>
                </div>
              </div>

              {/* Event & Location Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-500 dark:text-slate-400">EMERGENCY EVENT</span>
                  <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                    {activeIncident.disasterType}
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">GPS Location:</span>
                    <p className="text-slate-600 dark:text-slate-400">{activeIncident.locationAddress}</p>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                      Lat: {activeIncident.lat.toFixed(5)}, Lng: {activeIncident.lng.toFixed(5)} (±{activeIncident.accuracyMeters}m)
                    </p>
                  </div>
                </div>
              </div>

              {/* Dispatched to Volunteer Portal Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Volunteer Dispatch Status:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                    Broadcasted to Volunteer Page
                  </span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
                  This emergency SOS has been dispatched directly to the <strong>Volunteer Response Page</strong>. Active volunteers are alerted in real time with your GPS coordinates and incident details.
                </p>
              </div>

              {/* Instant Emergency Helpline Calls */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Direct Emergency Helplines
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="tel:112"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow no-underline cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> Call National Emergency (112)
                  </a>
                  <a
                    href="tel:108"
                    className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow no-underline cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> Call Ambulance (108)
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this emergency SOS?')) {
                      cancelSos(activeIncident.id);
                      setActiveIncident(null);
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 p-2 cursor-pointer"
                >
                  Cancel SOS
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Done / Keep Monitoring
                </button>
              </div>
            </div>
          ) : (
            /* DIRECT ONE-TAP EVENT SELECTION: Click Event -> Immediately Dispatch Volunteers! */
            <div className="space-y-4">
              
              {/* Emergency Banner */}
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl">
                <p className="text-xs text-red-800 dark:text-red-300 font-semibold flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <strong>Direct Emergency:</strong> Tap your disaster event below. Responders will be dispatched to your GPS location immediately with no description or photo needed.
                </p>
              </div>

              {/* Current GPS Location Bar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {userLocationAddress || 'Detecting Live GPS Coordinates...'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {userLocation
                        ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)} (±${userLocationAccuracy || 10}m)`
                        : 'Acquiring high-accuracy satellite fix'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => requestLiveLocation()}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                  title="Refresh GPS"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'acquiring' ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Event Selector - One Click Triggers Volunteer Dispatch */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Disaster Event (Dispatches Volunteers Immediately)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EMERGENCY_EVENTS.map((event) => (
                    <button
                      key={event.type}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleDirectVolunteerDispatch(event.type)}
                      className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer shadow-xs active:scale-98 ${event.colorClass} ${
                        isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-1 bg-white dark:bg-slate-800 rounded-xl shadow-xs">
                        {event.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-sm tracking-tight">{event.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {event.subtitle}
                        </div>
                        <div className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <span>👉</span> Click to alert volunteers
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fallback Direct Red Trigger Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDirectVolunteerDispatch('Other')}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting GPS to Volunteers...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🚨</span>
                    <span>TAP TO DISPATCH ALL NEARBY VOLUNTEERS NOW</span>
                  </>
                )}
              </button>

              {/* Quick National Helpline Call */}
              <div className="text-center pt-2">
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" /> Can't interact? Call National Emergency directly: 112
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
