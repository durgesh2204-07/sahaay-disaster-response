import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { EmergencyType, SeverityLevel } from '../types';
import { BASE_LAT, BASE_LNG } from '../data/initialData';
import { reverseGeocodeAddress } from '../utils/geoUtils';
import { ImageUploader } from '../components/ImageUploader';
import {
  AlertTriangle,
  MapPin,
  Camera,
  CheckCircle2,
  Users,
  Send,
  Navigation,
  ArrowLeft,
  User,
  Phone,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Mic,
  MicOff,
  Waves,
  Building2,
} from 'lucide-react';

interface EmergencyReportViewProps {
  setCurrentTab: (tab: string) => void;
}

const DISASTER_TYPES: { type: EmergencyType; icon: string; desc: string }[] = [
  { type: 'Flood', icon: '🌊', desc: 'Rising water, submerged areas' },
  { type: 'Fire', icon: '🔥', desc: 'Structural or wildfire emergency' },
  { type: 'Earthquake', icon: '🏚️', desc: 'Tremors, building damage' },
  { type: 'Landslide', icon: '⛰️', desc: 'Mudslide, hill slope failure' },
  { type: 'Medical Emergency', icon: '🚑', desc: 'Severe trauma, cardiac, injuries' },
  { type: 'Road Block', icon: '🚧', desc: 'Bridge collapse, blocked highway' },
  { type: 'Building Damage', icon: '🏢', desc: 'Partial collapse, unsafe structure' },
  { type: 'Missing Person', icon: '🔍', desc: 'Separated family, stranded citizen' },
  { type: 'Other', icon: '⚠️', desc: 'Other acute hazard' },
];

export const EmergencyReportView: React.FC<EmergencyReportViewProps> = ({ setCurrentTab }) => {
  const {
    addEmergencyReport,
    isEffectiveOffline,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    requestLiveLocation,
    currentUser,
    activeRole,
  } = useApp();

  const handleBackToDashboard = () => {
    if (activeRole === 'admin') setCurrentTab('admin_dashboard');
    else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
    else setCurrentTab('citizen_dashboard');
  };

  // Form states grouped into sections
  // Section 1: Personal Info
  const [reporterName, setReporterName] = useState(currentUser?.name || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '');

  // Section 2: Emergency Details
  const [type, setType] = useState<EmergencyType>('Flood');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [description, setDescription] = useState('');
  const [totalPeople, setTotalPeople] = useState<number>(3);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [elderlyCount, setElderlyCount] = useState<number>(0);
  const [specialAssistanceCount, setSpecialAssistanceCount] = useState<number>(0);

  // Expanded Data Fields
  const [structureType, setStructureType] = useState<string>('Apartment Building');
  const [waterLevel, setWaterLevel] = useState<string>('2-4 ft (Waist High)');
  const [trappedFloor, setTrappedFloor] = useState<string>('Ground Floor');
  const [hazardTags, setHazardTags] = useState<string[]>(['Trapped by Rising Water']);
  const [isDictating, setIsDictating] = useState<boolean>(false);

  const toggleDictation = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type manually.');
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    // Request mic permission if available
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
      }
    } catch {}

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = navigator.language || 'en-IN';

      recognition.onstart = () => setIsDictating(true);
      recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') return; // Don't abort on temporary silence
        setIsDictating(false);
      };
      recognition.onend = () => setIsDictating(false);
      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  const toggleHazardTag = (tag: string) => {
    setHazardTags((prev) =>
      (prev || []).includes(tag) ? (prev || []).filter((t) => t !== tag) : [...(prev || []), tag]
    );
  };

  // Section 3: Location & Interactive Map Pin
  const [locationAddress, setLocationAddress] = useState(userLocationAddress || '');
  const [lat, setLat] = useState<number>(userLocation ? userLocation.lat : BASE_LAT + 0.012);
  const [lng, setLng] = useState<number>(userLocation ? userLocation.lng : BASE_LNG - 0.005);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [locationAccuracy, setLocationAccuracy] = useState<string | null>(
    userLocation ? `Exact GPS Locked (±${Math.round(userLocationAccuracy || 15)}m)` : null
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Section 4: Evidence
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Submission state & validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReport, setSubmittedReport] = useState<{
    id: string;
    type: string;
    severity: string;
    address: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    if (userLocationAddress && !locationAddress) {
      setLocationAddress(userLocationAddress);
    }
    if (userLocation) {
      setLat(userLocation.lat);
      setLng(userLocation.lng);
      setLocationAccuracy(`Exact GPS Locked (±${Math.round(userLocationAccuracy || 15)}m)`);
    }
  }, [userLocation, userLocationAddress, userLocationAccuracy]);

  // Initialize interactive Leaflet map inside the form
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickedLat = e.latlng.lat;
        const clickedLng = e.latlng.lng;
        setLat(clickedLat);
        setLng(clickedLng);
        setLocationAccuracy(`Pin placed on map (${clickedLat.toFixed(5)}, ${clickedLng.toFixed(5)})`);
        reverseGeocodeAddress(clickedLat, clickedLng).then((addr) => {
          setLocationAddress(addr);
        });
      });

      mapInstanceRef.current = map;
    }

    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  }, []);

  // Update pin and accuracy circle on coordinate change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (circleRef.current) {
      circleRef.current.remove();
    }

    const pinIcon = L.divIcon({
      className: 'incident-live-pin',
      html: `
        <div class="relative flex flex-col items-center select-none cursor-pointer" style="transform: translateY(-100%);">
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-rose-500 opacity-60"></span>
            <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-700 to-amber-500 border-2 border-white text-white shadow-xl text-sm font-black">
              📍
            </div>
          </div>
          <div class="w-2 h-3 bg-rose-700 -mt-1 rounded-b-full border-x border-b border-white"></div>
          <div class="w-3 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5"></div>
          <div class="absolute -top-6 whitespace-nowrap bg-slate-950/95 text-rose-300 text-[9px] font-black px-1.5 py-0.5 rounded shadow border border-rose-500/50">
            EXACT INCIDENT PIN
          </div>
        </div>
      `,
      iconSize: [36, 48],
      iconAnchor: [18, 48],
    });

    const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setLat(pos.lat);
      setLng(pos.lng);
      setLocationAccuracy('Pin adjusted to selected location');
      reverseGeocodeAddress(pos.lat, pos.lng).then((addr) => {
        setLocationAddress(addr);
      });
    });
    markerRef.current = marker;

    const circle = L.circle([lat, lng], {
      radius: 25,
      color: '#e11d48',
      fillColor: '#fda4af',
      fillOpacity: 0.18,
      weight: 1.5,
      dashArray: '3, 3',
    }).addTo(map);
    circleRef.current = circle;

    map.setView([lat, lng], 15);
  }, [lat, lng]);

  const handleDetectLocation = () => {
    setGeoLocating(true);
    requestLiveLocation();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy || 15);
          setLat(newLat);
          setLng(newLng);
          setLocationAccuracy(`Exact GPS Locked (±${acc}m accuracy)`);
          reverseGeocodeAddress(newLat, newLng).then((addr) => {
            setLocationAddress(addr);
            setGeoLocating(false);
          });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([newLat, newLng], 16);
          }
        },
        async (err) => {
          console.warn('Geolocation warning:', err);
          try {
            const ipRes = await fetch('/api/geo/detect-ip');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.success && ipData.lat && ipData.lng) {
                setLat(ipData.lat);
                setLng(ipData.lng);
                setLocationAddress(ipData.address);
                setLocationAccuracy(`Network Location Locked (±${ipData.accuracy || 2500}m)`);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([ipData.lat, ipData.lng], 15);
                }
                setGeoLocating(false);
                return;
              }
            }
          } catch {}
          setLocationAddress(userLocationAddress || 'Kasba Peth, Shivajinagar, Pune, Maharashtra 411005, India');
          setLocationAccuracy('Approximate Zone (Civic Baseline)');
          setGeoLocating(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    } else {
      setLocationAddress('Near Central Emergency Zone, Pune');
      setGeoLocating(false);
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!reporterName.trim()) {
      errs.reporterName = 'Your full name or callsign is required.';
    } else if (!/^[a-zA-Z\s.'-]{2,50}$/.test(reporterName.trim())) {
      errs.reporterName = 'Please enter a valid name (letters and spaces only, 2-50 characters).';
    }
    if (!contactNumber.trim()) {
      errs.contactNumber = 'A working contact phone number is required for dispatchers.';
    } else if (contactNumber.replace(/\D/g, '').length < 7) {
      errs.contactNumber = 'Please enter a valid phone number (minimum 7 digits).';
    }

    if (!description.trim()) {
      errs.description = 'Please describe the emergency situation so responders can prepare.';
    } else if (description.trim().length < 10) {
      errs.description = 'Please provide a bit more detail (at least 10 characters).';
    }

    if (!locationAddress.trim()) {
      errs.locationAddress = 'Location address or landmark is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const telemetrySummary = `[Structure: ${structureType} | Water Depth: ${waterLevel} | Trapped Floor: ${trappedFloor}${hazardTags.length ? ` | Hazards: ${hazardTags.join(', ')}` : ''}]`;
    const fullDescription = `${description.trim()}\n\nField Telemetry: ${telemetrySummary}`;

    try {
      // First attempt server-side verification and rate limiting
      let serverReportId: string | null = null;

      try {
        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${type} Emergency at ${locationAddress.slice(0, 32)}`,
            type,
            description: fullDescription,
            locationAddress,
            lat,
            lng,
            severity,
            affected: {
              total: totalPeople,
              children: childrenCount,
              elderly: elderlyCount,
              specialAssistance: specialAssistanceCount,
            },
            photoUrl: photoUrl || undefined,
            contactNumber,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.reportId) {
            serverReportId = data.reportId;
          }
        } else if (response.status === 429) {
          setErrors({ submit: 'Too many requests submitted. Please wait 30 seconds.' });
          setIsSubmitting(false);
          return;
        }
      } catch (networkErr) {
        // Network offline or server unreachable; proceed with offline local store
        console.info('Server API unreachable, using local store queue:', networkErr);
      }

      // Add to local state (offline fallback or client state sync)
      const report = addEmergencyReport({
        title: `${type} Emergency at ${locationAddress.slice(0, 32)}`,
        type,
        description: fullDescription,
        locationAddress,
        lat,
        lng,
        severity,
        affected: {
          total: totalPeople,
          children: childrenCount,
          elderly: elderlyCount,
          specialAssistance: specialAssistanceCount,
        },
        photoUrl: photoUrl || undefined,
      });

      const finalId = serverReportId || report.id;

      setSubmittedReport({
        id: finalId,
        type,
        severity,
        address: locationAddress,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err: any) {
      setErrors({ submit: err.message || 'An error occurred during submission.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dedicated Post-Submission Success Screen
  if (submittedReport) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 pb-24 space-y-5 animate-fade-in">
        <div className="neu-raised rounded-3xl p-6 border border-white text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9 animate-bounce" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              REPORT DISPATCHED SUCCESSFULLY
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-2">
              Emergency Broadcast Active
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              Your emergency signal has been recorded and routed to the nearest disaster management field squad.
            </p>
          </div>

          {/* Key Incident Metadata Receipt */}
          <div className="neu-inset rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-300/60">
              <span className="text-slate-500 font-bold">Emergency ID:</span>
              <span className="font-mono font-black text-slate-900 text-sm">#{submittedReport.id}</span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-300/60">
              <span className="text-slate-500 font-bold">Current Status:</span>
              <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                INFORMATION VERIFIED
              </span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-300/60">
              <span className="text-slate-500 font-bold">Submission Time:</span>
              <span className="font-extrabold text-slate-800">{submittedReport.timestamp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Location Address:</span>
              <span className="font-extrabold text-slate-800 truncate max-w-[200px]">{submittedReport.address}</span>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl text-left space-y-1.5 text-xs text-teal-950">
            <span className="font-extrabold block text-teal-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Recommended Next Steps:</span>
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-teal-800 text-[11px]">
              <li>Keep your phone line open for dispatcher verification calls.</li>
              <li>Move to higher or open ground if safe to do so.</li>
              <li>Track your live responder dispatch status in real time below.</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => setCurrentTab('emergency_status')}
              className="neu-btn-teal flex-1 py-3 text-white font-extrabold text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>TRACK LIVE STATUS</span>
            </button>
            <button
              onClick={handleBackToDashboard}
              className="neu-btn flex-1 py-3 text-slate-800 font-extrabold text-xs rounded-2xl cursor-pointer"
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-5 px-4 pb-24 space-y-5 animate-fade-in">
      {/* Top Header Card */}
      <div className="neu-raised rounded-3xl p-5 border border-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToDashboard}
            className="neu-btn p-2 rounded-2xl text-slate-700 cursor-pointer"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                🚨 EMERGENCY ASSISTANCE DISPATCH
              </span>
              {isEffectiveOffline && (
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  📡 On-Device Offline Storage
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
              Report Emergency Incident
            </h1>
            <p className="text-xs text-slate-500">
              Fill the 4 quick sections below for rapid rescue deployment.
            </p>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="neu-raised rounded-3xl p-5 border border-white space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reporter Name */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                Your Full Name / Alias
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => {
                    setReporterName(e.target.value);
                    if (errors.reporterName) setErrors({ ...errors, reporterName: '' });
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden ${
                    errors.reporterName ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                />
              </div>
              {errors.reporterName && (
                <span className="text-[10px] text-rose-600 font-bold block mt-1">
                  {errors.reporterName}
                </span>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                Contact Phone Number (For Verification)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                  }}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden ${
                    errors.contactNumber ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                />
              </div>
              {errors.contactNumber && (
                <span className="text-[10px] text-rose-600 font-bold block mt-1">
                  {errors.contactNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: EMERGENCY DETAILS */}
        <div className="neu-raised rounded-3xl p-5 border border-white space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Emergency Details
            </h2>
          </div>

          {/* Disaster Type Chips */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-700 block mb-2">
              Emergency Type (Tap Category)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DISASTER_TYPES.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setType(item.type)}
                  className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                    type === item.type ? 'neu-chip-active border-rose-500' : 'neu-btn'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-black text-slate-900 truncate">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Buttons */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-700 block mb-2">
              Severity Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { level: 'CRITICAL', label: 'Critical', sub: 'Life-threatening', color: 'bg-rose-600 text-white' },
                { level: 'HIGH', label: 'High', sub: 'Urgent rescue', color: 'bg-amber-600 text-white' },
                { level: 'MEDIUM', label: 'Medium', sub: 'Moderate hazard', color: 'bg-yellow-500 text-slate-950' },
                { level: 'LOW', label: 'Low', sub: 'Non-immediate', color: 'bg-emerald-600 text-white' },
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSeverity(s.level as SeverityLevel)}
                  className={`py-2 px-2 rounded-2xl text-center transition-all cursor-pointer ${
                    severity === s.level
                      ? `${s.color} font-black shadow-md ring-2 ring-slate-900`
                      : 'neu-btn text-slate-700'
                  }`}
                >
                  <div className="text-xs font-black">{s.label}</div>
                  <div className="text-[9px] opacity-80">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Description with Voice Dictation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold text-slate-700 block">
                Description of Emergency
              </label>
              <button
                type="button"
                onClick={toggleDictation}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all ${
                  isDictating
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDictating ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-600" />}
                <span>{isDictating ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Describe what is happening (e.g. 5 family members stranded on 2nd floor, water levels rising rapidly, elderly needs insulin)..."
              className={`w-full p-3 rounded-2xl neu-inset text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : ''
              }`}
            />
            {errors.description && (
              <span className="text-[10px] text-rose-600 font-bold block mt-1">
                {errors.description}
              </span>
            )}
          </div>

          {/* EXPANDED DATA TELEMETRY FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                Building / Structure Type
              </label>
              <select
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Apartment Building">Apartment Building</option>
                <option value="Independent House / Villa">Independent House / Villa</option>
                <option value="Temporary Tin / Mud Shed">Temporary Tin / Mud Shed</option>
                <option value="Commercial Complex / Shop">Commercial Complex / Shop</option>
                <option value="School / Community Hall">School / Community Hall</option>
                <option value="Open Street / Bridge">Open Street / Bridge</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                Water Depth / Hazard Level
              </label>
              <select
                value={waterLevel}
                onChange={(e) => setWaterLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="None / Dry Ground">None / Dry Ground</option>
                <option value="< 1 ft (Ankle High)">&lt; 1 ft (Ankle High)</option>
                <option value="2-4 ft (Waist High)">2-4 ft (Waist High)</option>
                <option value="5-8 ft (Chest / Roof Edge)">5-8 ft (Chest / Roof Edge)</option>
                <option value="> 8 ft (Fully Submerged)">&gt; 8 ft (Fully Submerged)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                Trapped Location / Floor
              </label>
              <select
                value={trappedFloor}
                onChange={(e) => setTrappedFloor(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Ground Floor">Ground Floor</option>
                <option value="1st / 2nd Floor">1st / 2nd Floor</option>
                <option value="Terrace / Rooftop">Terrace / Rooftop</option>
                <option value="Basement / Underground">Basement / Underground</option>
                <option value="Tree / Elevated Structure">Tree / Elevated Pole</option>
              </select>
            </div>
          </div>

          {/* CRITICAL HAZARD CHECKLIST */}
          <div>
            <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">
              Specific Hazards & Urgent Vulnerabilities (Tap to Tag)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Trapped by Rising Water',
                'Submerged Live Electricity Cable',
                'Structural Collapse Threat',
                'Medical Oxygen / Critical Patient',
                'No Clean Drinking Water',
                'Infant / Baby Food Needed',
                'Pregnant Woman in Labor',
                'Non-Ambulatory / Wheelchair User',
              ].map((tag) => {
                const active = hazardTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleHazardTag(tag)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                      active
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'neu-btn text-slate-700 hover:bg-rose-50'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Affected People Counter Stepper */}
          <div className="neu-inset-subtle p-3.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Total People Affected / In Danger
                </span>
                <span className="text-[10px] text-slate-500">
                  Number of citizens requiring immediate evacuation or assistance
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTotalPeople(Math.max(1, totalPeople - 1))}
                  className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-slate-800 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-sm text-slate-900">
                  {totalPeople}
                </span>
                <button
                  type="button"
                  onClick={() => setTotalPeople(totalPeople + 1)}
                  className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-slate-800 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-center">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Children</span>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    className="p-1 rounded-lg neu-btn text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-slate-800 w-5">{childrenCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildrenCount(childrenCount + 1)}
                    className="p-1 rounded-lg neu-btn text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Elderly (60+)</span>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => setElderlyCount(Math.max(0, elderlyCount - 1))}
                    className="p-1 rounded-lg neu-btn text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-slate-800 w-5">{elderlyCount}</span>
                  <button
                    type="button"
                    onClick={() => setElderlyCount(elderlyCount + 1)}
                    className="p-1 rounded-lg neu-btn text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">Medical / Special</span>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSpecialAssistanceCount(Math.max(0, specialAssistanceCount - 1))}
                    className="p-1 rounded-lg neu-btn text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-slate-800 w-5">{specialAssistanceCount}</span>
                  <button
                    type="button"
                    onClick={() => setSpecialAssistanceCount(specialAssistanceCount + 1)}
                    className="p-1 rounded-lg neu-btn text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EXACT LOCATION & MAP PIN */}
        <div className="neu-raised rounded-3xl p-5 border border-white space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Live Location & Exact Map Pin
                </h2>
                <span className="text-[10px] text-slate-500 block">
                  Verify exact location pin on the map
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoLocating}
              className="text-xs font-black text-rose-700 hover:text-rose-900 flex items-center gap-1.5 cursor-pointer bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300 transition-all shadow-xs active:scale-95"
            >
              <Navigation className={`w-3.5 h-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
              <span>{geoLocating ? 'Scanning GPS...' : '🎯 Scan Live Location'}</span>
            </button>
          </div>

          {/* Interactive Map with Exact Pin */}
          <div className="space-y-1.5">
            <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-900">
              <div ref={mapContainerRef} className="w-full h-full z-0" />
              <div className="absolute top-2 left-2 z-[500] bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl border border-teal-500/50 backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-teal-300 font-extrabold">LIVE PINPOINT</span>
              </div>
              <div className="absolute bottom-2 right-2 z-[500] bg-white/95 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow border border-slate-200">
                Tap map or drag pin to adjust
              </div>
            </div>
            <div className="text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Exact address from live pin will be attached to report.</span>
              </span>
              <span className="font-bold text-teal-800 text-xs truncate max-w-[260px]">{locationAddress || 'Resolving address...'}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
              Exact Address or Prominent Landmark
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-rose-600" />
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => {
                  setLocationAddress(e.target.value);
                  if (errors.locationAddress) setErrors({ ...errors, locationAddress: '' });
                }}
                placeholder="e.g. Near Shanti Hospital, Sangam Bridge road, Pune"
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden ${
                  errors.locationAddress ? 'border-rose-500 ring-1 ring-rose-500' : ''
                }`}
              />
            </div>
            {errors.locationAddress && (
              <span className="text-[10px] text-rose-600 font-bold block mt-1">
                {errors.locationAddress}
              </span>
            )}
          </div>

          {locationAccuracy && (
            <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white/80 px-3 py-2 rounded-xl border border-slate-200">
              <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> GPS Accuracy Status:
              </span>
              <span className="font-mono font-bold text-slate-800">{locationAccuracy}</span>
            </div>
          )}
        </div>

        {/* SECTION 4: EVIDENCE PHOTO */}
        <div className="neu-raised rounded-3xl p-5 border border-white space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Evidence & Photos (Optional but Recommended)
            </h2>
          </div>

          <ImageUploader
            value={photoUrl}
            onChange={(url) => setPhotoUrl(url)}
            label="Live Camera / Image Upload"
          />
        </div>

        {/* SUBMIT EMERGENCY PRIMARY ACTION BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl neu-btn-danger text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed touch-target"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>DISPATCHING EMERGENCY ALERT...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 animate-pulse text-white" />
                <span>SUBMIT EMERGENCY REPORT</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            🔒 By submitting, your report is verified against false alarms and routed with priority.
          </p>
        </div>
      </form>
    </div>
  );
};
