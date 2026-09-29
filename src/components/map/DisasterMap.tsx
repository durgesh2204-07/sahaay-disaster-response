import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  EmergencyReport,
  Shelter,
  ReliefCenter,
  RoadBlock,
  UserProfile,
  DangerZone,
  SosRequest,
} from '../../types';
import { BASE_LAT, BASE_LNG } from '../../data/initialData';
import { calculateDistanceKm, formatDistance, estimateTravelTime, getDirectionsUrl, reverseGeocodeAddress } from '../../utils/geoUtils';
import { LocateFixed, Layers, ZoomIn, ZoomOut, Maximize2, Minimize2, Plus, AlertTriangle, Shield, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DisasterMapProps {
  reports?: EmergencyReport[];
  sosRequests?: SosRequest[];
  shelters?: Shelter[];
  reliefCenters?: ReliefCenter[];
  roadBlocks?: RoadBlock[];
  volunteers?: UserProfile[];
  dangerZones?: DangerZone[];
  height?: string;
  onSelectMarker?: (item: any, type: string) => void;
  onRequestReportAtCoords?: (coords: { lat: number; lng: number }) => void;
  onRequestAddDangerZoneAtCoords?: (coords: { lat: number; lng: number }) => void;
  center?: [number, number];
  zoom?: number;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  reports = [],
  sosRequests = [],
  shelters = [],
  reliefCenters = [],
  roadBlocks = [],
  volunteers = [],
  dangerZones = [],
  height = '600px',
  onSelectMarker,
  onRequestReportAtCoords,
  onRequestAddDangerZoneAtCoords,
  center = [BASE_LAT, BASE_LNG],
  zoom = 13,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const {
    userLocation: globalUserLocation,
    userLocationAddress: globalAddress,
    userLocationAccuracy: globalAccuracy,
    setUserLocation: setGlobalUserLocation,
    requestLiveLocation: contextRequestLiveLocation,
  } = useApp();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(
    globalUserLocation || null
  );
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [clickedAddress, setClickedAddress] = useState<string>('');
  const hasAutoCenteredRef = useRef(false);
  const [activeRouteInfo, setActiveRouteInfo] = useState<{
    destName: string;
    distanceKm: number;
    destLat: number;
    destLng: number;
  } | null>(null);

  // Sync with global user location & auto-center on live location
  useEffect(() => {
    if (globalUserLocation) {
      setUserLocation((prev) => {
        const targetAcc = globalAccuracy || globalUserLocation.accuracy;
        if (
          prev &&
          Math.abs(prev.lat - globalUserLocation.lat) < 0.00008 &&
          Math.abs(prev.lng - globalUserLocation.lng) < 0.00008 &&
          prev.accuracy === targetAcc
        ) {
          return prev;
        }
        return {
          lat: globalUserLocation.lat,
          lng: globalUserLocation.lng,
          accuracy: targetAcc,
        };
      });
      // Automatically center and zoom into user's live position on first fix
      if (mapInstanceRef.current && !hasAutoCenteredRef.current) {
        hasAutoCenteredRef.current = true;
        mapInstanceRef.current.flyTo([globalUserLocation.lat, globalUserLocation.lng], 16, { duration: 1.2 });
      }
    }
  }, [globalUserLocation, globalAccuracy]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center as L.LatLngExpression,
        zoom,
        zoomControl: false,
        attributionControl: true,
      });

      // Standard OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;

      // Force size recalculation to fix blank/gray tiles on initial render
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 350);

      // Handle Map Click to Pin Location for Emergency / Danger Zone
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setClickedCoords({ lat, lng });
        setClickedAddress('Identifying address...');
        reverseGeocodeAddress(lat, lng).then((addr) => {
          setClickedAddress(addr);
        });
      });
    }

    // Set up ResizeObserver for responsive map resizing
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update Center & invalidate size if external prop changes or full screen toggled
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (center) {
        mapInstanceRef.current.setView(center as L.LatLngExpression, zoom);
      }
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
    }
  }, [center, zoom, isFullScreen]);

  // Handle Geolocation with High Precision and Exact Pin Center
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    // Also trigger global reverse geocode and sync
    contextRequestLiveLocation();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        const locObj = { lat, lng, accuracy };
        setUserLocation(locObj);
        setGlobalUserLocation(locObj);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
          setTimeout(() => {
            if (userMarkerRef.current) {
              userMarkerRef.current.openPopup();
            }
          }, 600);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('GPS Location permission denied. Please allow location access in your browser.');
        } else {
          setGeoError('Unable to detect high-precision GPS coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  // Draw Route Line when activeRouteInfo changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    if (activeRouteInfo) {
      const originLat = userLocation?.lat || BASE_LAT;
      const originLng = userLocation?.lng || BASE_LNG;

      const polyline = L.polyline(
        [
          [originLat, originLng],
          [activeRouteInfo.destLat, activeRouteInfo.destLng],
        ],
        {
          color: '#0284c7',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
        }
      ).addTo(mapInstanceRef.current);

      routeLineRef.current = polyline;

      // Fit bounds to show route
      const bounds = L.latLngBounds(
        [originLat, originLng],
        [activeRouteInfo.destLat, activeRouteInfo.destLng]
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activeRouteInfo, userLocation]);

  // Render Markers & Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const group = layersGroupRef.current;
    group.clearLayers();

    // Helper for Custom Pin Icon
    const createCustomIcon = (bgColor: string, emoji: string, isPulse: boolean = false) => {
      return L.divIcon({
        className: 'custom-disaster-pin',
        html: `
          <div class="relative flex items-center justify-center">
            ${
              isPulse
                ? `<span class="absolute inline-flex h-11 w-11 animate-ping rounded-full opacity-75" style="background-color: ${bgColor}"></span>`
                : ''
            }
            <div class="relative flex h-9 w-9 items-center justify-center rounded-full text-white shadow-xl border-2 border-white font-extrabold text-sm" style="background-color: ${bgColor}">
              ${emoji}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });
    };

    // 1. Exact User Position Needle Pin & Precision Accuracy Radius
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-exact-live-pin-container',
        html: `
          <div class="relative flex flex-col items-center select-none cursor-pointer" style="transform: translateY(-100%);">
            <!-- Pulsing Radar Wave -->
            <div class="relative flex items-center justify-center">
              <span class="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-rose-500 opacity-60"></span>
              <!-- Circular Pin Head with Target Icon -->
              <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 border-2 border-white text-white shadow-2xl font-black text-sm">
                📍
              </div>
            </div>
            <!-- Sharp Needle Tip Pointing Exactly to Coordinate -->
            <div class="w-2.5 h-3.5 bg-rose-700 -mt-1 rounded-b-full shadow-md border-x border-b border-white"></div>
            <!-- Ground Contact Shadow -->
            <div class="w-3.5 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5"></div>
            <!-- Live Location Floating Badge -->
            <div class="absolute -top-7 whitespace-nowrap bg-slate-950/95 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg border border-emerald-500/60 tracking-wider flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              YOU ARE HERE
            </div>
          </div>
        `,
        iconSize: [40, 52],
        iconAnchor: [20, 52],
        popupAnchor: [0, -56],
      });

      // GPS Accuracy Radius Circle (shows exact precision range)
      const accuracyRadius = userLocation.accuracy || globalAccuracy || 25;
      L.circle([userLocation.lat, userLocation.lng], {
        radius: Math.max(accuracyRadius, 15),
        color: '#0d9488',
        fillColor: '#2dd4bf',
        fillOpacity: 0.16,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(group);

      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      });

      userMarker.bindPopup(`
        <div class="p-3 font-sans text-xs min-w-[240px] max-w-[300px]">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span class="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1 text-[11px]">
              <span>📍</span> YOUR LIVE LOCATION
            </span>
            <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              GPS ACTIVE
            </span>
          </div>
          <div class="mt-2.5 space-y-1">
            <span class="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Live Address:</span>
            <p class="text-slate-950 font-extrabold text-xs leading-snug bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              ${globalAddress || 'Active Live Location'}
            </p>
          </div>
          <div class="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Signal Precision:</span>
            <strong class="text-emerald-700 font-bold">Within ±${Math.round(accuracyRadius)}m</strong>
          </div>
        </div>
      `);
      userMarker.addTo(group);
      userMarkerRef.current = userMarker;
    }

    // 2. Danger Zone Circles
    dangerZones.forEach((dz) => {
      if (dz.centerLat && dz.centerLng) {
        const zoneColor =
          dz.severity === 'CRITICAL' ? '#e11d48' : dz.severity === 'HIGH' ? '#f97316' : '#eab308';

        const circle = L.circle([dz.centerLat, dz.centerLng], {
          radius: dz.radiusMeters,
          color: zoneColor,
          fillColor: zoneColor,
          fillOpacity: 0.22,
          weight: 2,
          dashArray: '6, 6',
        });

        const popupContent = `
          <div class="p-1.5 max-w-xs font-sans space-y-1.5">
            <div class="flex items-center gap-1.5 text-xs font-extrabold px-2 py-0.5 rounded text-white bg-red-700">
              <span>⚠️ ${dz.hazardType.toUpperCase()}</span>
            </div>
            <h4 class="font-extrabold text-slate-900 text-sm">${dz.name}</h4>
            <p class="text-xs text-slate-600 leading-relaxed">${dz.description}</p>
            <div class="text-[11px] text-slate-500 border-t border-slate-100 pt-1 flex justify-between">
              <span>Perimeter: <strong>${dz.radiusMeters}m radius</strong></span>
              <span class="text-rose-700 font-bold">${dz.severity} RISK</span>
            </div>
          </div>
        `;

        circle.bindPopup(popupContent);
        circle.addTo(group);
      }
    });

    // 2.5 Active Satellite SOS Beacons (Pulsing Red Beacon Pins)
    (sosRequests || []).forEach((sos) => {
      if (sos.lat && sos.lng && sos.status !== 'RESOLVED' && !sos.isCancelled) {
        const sosIcon = L.divIcon({
          className: 'sos-beacon-live-pin',
          html: `
            <div class="relative flex flex-col items-center select-none cursor-pointer" style="transform: translateY(-100%);">
              <div class="relative flex items-center justify-center">
                <span class="absolute inline-flex h-11 w-11 animate-ping rounded-full bg-red-600 opacity-75"></span>
                <span class="absolute inline-flex h-8 w-8 animate-pulse rounded-full bg-rose-500 opacity-60"></span>
                <div class="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-red-700 to-rose-600 border-2 border-white text-white shadow-2xl font-black text-xs">
                  🚨
                </div>
              </div>
              <div class="w-2 h-3 bg-red-700 -mt-1 rounded-b-full shadow-md border-x border-b border-white"></div>
              <div class="w-3 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5"></div>
              <div class="absolute -top-6 whitespace-nowrap bg-red-950 text-red-200 text-[9px] font-black px-1.5 py-0.5 rounded shadow border border-red-500/60 tracking-wider flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                SOS #${sos.id.slice(-6)}
              </div>
            </div>
          `,
          iconSize: [36, 48],
          iconAnchor: [18, 48],
          popupAnchor: [0, -50],
        });

        const sosMarker = L.marker([sos.lat, sos.lng], {
          icon: sosIcon,
          zIndexOffset: 950,
        });

        const sosPopup = `
          <div class="p-1 max-w-xs font-sans space-y-1.5">
            <div class="flex items-center justify-between text-[10px] font-black">
              <span class="px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                🚨 SATELLITE SOS BEACON
              </span>
              <span class="font-mono text-slate-500">${sos.status}</span>
            </div>
            <h4 class="font-black text-slate-900 text-sm">${sos.emergencyType} Emergency</h4>
            <p class="text-xs text-slate-600">📍 ${sos.address}</p>
            <div class="bg-red-50 p-2 rounded-xl border border-red-200 text-[11px] space-y-0.5">
              <div>Risk Level: <strong class="text-red-700">${sos.severity}</strong> (${sos.aiAssessment?.riskScore || 85}/100)</div>
              <div>Dispatch Status: <strong class="text-slate-800">${sos.status}</strong></div>
              ${sos.aiAssessment?.assignedGroupName ? `<div>Assigned Squad: <strong class="text-indigo-700">${sos.aiAssessment.assignedGroupName}</strong></div>` : ''}
            </div>
            ${sos.description ? `<p class="text-xs text-slate-600 italic">"${sos.description}"</p>` : ''}
          </div>
        `;

        sosMarker.bindPopup(sosPopup);
        sosMarker.on('click', () => onSelectMarker && onSelectMarker(sos, 'sos'));
        sosMarker.addTo(group);
      }
    });

    // 3. Emergency Reports (Red / Orange)
    reports.forEach((rep) => {
      if (rep.lat && rep.lng) {
        const pinColor =
          rep.severity === 'CRITICAL'
            ? '#e11d48'
            : rep.severity === 'HIGH'
            ? '#ea580c'
            : '#eab308';
        const emoji = rep.type === 'Flood' ? '🌊' : rep.type === 'Fire' ? '🔥' : '🚨';

        const marker = L.marker([rep.lat, rep.lng], {
          icon: createCustomIcon(pinColor, emoji, rep.severity === 'CRITICAL'),
        });

        const verificationBadge =
          rep.verificationStatus === 'VERIFIED'
            ? '<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">✅ Forensic Verified</span>'
            : rep.verificationStatus === 'POTENTIALLY_MANIPULATED'
            ? '<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300">⚠️ Synthetic Alert</span>'
            : '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">⏳ Verification Pending</span>';

        const popupContent = `
          <div class="p-1 max-w-xs font-sans space-y-1">
            <div class="flex items-center justify-between text-[11px] font-bold">
              <span class="px-2 py-0.5 rounded text-white ${
                rep.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-600'
              }">🚨 ${rep.severity} ${rep.type}</span>
              <span class="text-slate-400 font-mono">${rep.status}</span>
            </div>
            <div class="text-[10px] mt-0.5">${verificationBadge}</div>
            <h4 class="font-bold text-slate-900 text-sm mt-1">${rep.title}</h4>
            <p class="text-xs text-slate-600 line-clamp-2">${rep.description}</p>
            <div class="text-[11px] text-slate-500 border-t border-slate-100 pt-1 space-y-0.5">
              <div>📍 ${rep.locationAddress}</div>
              <div>👥 Affected: <strong>${rep.affected?.total || 1} people</strong></div>
              <div>👍 Confirmations: <strong>${rep.communityConfirmations?.confirmed || 0}</strong></div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => onSelectMarker && onSelectMarker(rep, 'emergency'));
        marker.addTo(group);
      }
    });

    // 4. Shelters (Blue / Green)
    shelters.forEach((shl) => {
      if (shl.lat && shl.lng) {
        const isFull = shl.occupancy >= shl.capacity;
        const availableBeds = Math.max(0, shl.capacity - shl.occupancy);
        const marker = L.marker([shl.lat, shl.lng], {
          icon: createCustomIcon(isFull ? '#64748b' : '#0284c7', '🏠'),
        });

        // Compute distance from user location
        const userLat = userLocation?.lat || BASE_LAT;
        const userLng = userLocation?.lng || BASE_LNG;
        const distKm = calculateDistanceKm(userLat, userLng, shl.lat, shl.lng);
        const { walkingMin, drivingMin } = estimateTravelTime(distKm);

        const popupContent = `
          <div class="p-1 max-w-xs font-sans space-y-2">
            <div class="flex items-center justify-between text-xs font-extrabold">
              <span class="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">🏠 EMERGENCY SHELTER</span>
              <span class="${isFull ? 'text-rose-600 bg-rose-50' : 'text-emerald-700 bg-emerald-50'} px-2 py-0.5 rounded font-bold">
                ${isFull ? '🔴 FULL' : '🟢 OPEN'}
              </span>
            </div>

            <h4 class="font-extrabold text-slate-900 text-sm">${shl.name}</h4>
            <p class="text-xs text-slate-600">📍 ${shl.locationAddress}</p>

            <div class="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs space-y-1">
              <div class="flex justify-between font-bold text-slate-800">
                <span>Occupancy: ${shl.occupancy} / ${shl.capacity}</span>
                <span className="text-teal-700">${availableBeds} beds free</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="${isFull ? 'bg-rose-500' : 'bg-teal-600'} h-full" style="width: ${Math.min(
          100,
          Math.round((shl.occupancy / shl.capacity) * 100)
        )}%"></div>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 bg-slate-100/80 p-1.5 rounded-lg">
              <span>📏 Distance: <strong>${formatDistance(distKm)}</strong></span>
              <span>🚗 ~${drivingMin}m drive</span>
            </div>

            <div class="flex flex-wrap gap-1 text-[10px] text-slate-700">
              ${shl.foodAvailable ? '<span class="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold">🍚 Food</span>' : ''}
              ${shl.waterAvailable ? '<span class="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-bold">💧 Water</span>' : ''}
              ${shl.medicalSupportAvailable ? '<span class="bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-bold">🏥 Medical</span>' : ''}
            </div>

            <button
              id="dir_btn_${shl.id}"
              class="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-all mt-1"
            >
              🧭 Get Directions (${formatDistance(distKm)})
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`dir_btn_${shl.id}`);
          if (btn) {
            btn.onclick = () => {
              setActiveRouteInfo({
                destName: shl.name,
                distanceKm: distKm,
                destLat: shl.lat,
                destLng: shl.lng,
              });
            };
          }
        });
        marker.on('click', () => onSelectMarker && onSelectMarker(shl, 'shelter'));
        marker.addTo(group);
      }
    });

    // 5. Relief Centers (Purple)
    reliefCenters.forEach((rel) => {
      if (rel.lat && rel.lng) {
        const marker = L.marker([rel.lat, rel.lng], {
          icon: createCustomIcon('#9333ea', '📦'),
        });

        const userLat = userLocation?.lat || BASE_LAT;
        const userLng = userLocation?.lng || BASE_LNG;
        const distKm = calculateDistanceKm(userLat, userLng, rel.lat, rel.lng);

        const popupContent = `
          <div class="p-1 max-w-xs font-sans space-y-1.5">
            <span class="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">📦 RELIEF DEPOT</span>
            <h4 class="font-bold text-slate-900 text-sm">${rel.name}</h4>
            <p class="text-xs text-slate-600">📍 ${rel.locationAddress}</p>
            <p class="text-xs text-slate-500">📞 Contact: ${rel.phone}</p>
            <div class="text-[11px] text-slate-500">📏 Distance: <strong>${formatDistance(distKm)}</strong></div>
            <button
              id="dir_btn_rel_${rel.id}"
              class="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all mt-1"
            >
              🧭 Route to Relief Depot
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`dir_btn_rel_${rel.id}`);
          if (btn) {
            btn.onclick = () => {
              setActiveRouteInfo({
                destName: rel.name,
                distanceKm: distKm,
                destLat: rel.lat,
                destLng: rel.lng,
              });
            };
          }
        });
        marker.addTo(group);
      }
    });

    // 6. Road Blocks (Orange)
    roadBlocks.forEach((rb) => {
      if (rb.lat && rb.lng) {
        const marker = L.marker([rb.lat, rb.lng], {
          icon: createCustomIcon('#ea580c', '🚧'),
        });
        const popupContent = `
          <div class="p-1 max-w-xs font-sans space-y-1">
            <span class="text-xs font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">🚧 ROAD BLOCKAGE</span>
            <h4 class="font-bold text-slate-900 text-sm mt-1">${rb.locationName}</h4>
            <p class="text-xs text-slate-600">${rb.blockType}: ${rb.description}</p>
            <div class="text-[10px] text-slate-400">Reported: ${rb.reportedAt}</div>
          </div>
        `;
        marker.bindPopup(popupContent);
        marker.addTo(group);
      }
    });

    // 7. Active Field Volunteers (Green / Amber / Blue)
    volunteers.forEach((vol) => {
      if (vol.lat && vol.lng) {
        const isAvail = vol.availability === 'AVAILABLE';
        const isOnMission = vol.availability === 'ON_MISSION';
        const volColor = isAvail ? '#059669' : isOnMission ? '#d97706' : '#4f46e5';
        const volIconEmoji = vol.skills?.includes('Boat Rescue')
          ? '🚤'
          : vol.skills?.includes('First Aid') || vol.skills?.includes('Medical Emergency')
          ? '🩺'
          : vol.skills?.includes('Drone Recon')
          ? '🛸'
          : '🛡️';

        const marker = L.marker([vol.lat, vol.lng], {
          icon: createCustomIcon(volColor, volIconEmoji, isAvail || isOnMission),
        });

        const userLat = userLocation?.lat || BASE_LAT;
        const userLng = userLocation?.lng || BASE_LNG;
        const distKm = calculateDistanceKm(userLat, userLng, vol.lat, vol.lng);

        const popupContent = `
          <div class="p-1 max-w-xs font-sans space-y-2">
            <div class="flex items-center justify-between text-xs font-extrabold">
              <span class="px-2 py-0.5 rounded text-white ${
                isAvail ? 'bg-emerald-600' : isOnMission ? 'bg-amber-600' : 'bg-indigo-600'
              }">
                ${isAvail ? '🟢 AVAILABLE' : isOnMission ? '🟠 ON MISSION' : '🟣 ON CALL'}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">${vol.lastActive || 'Active'}</span>
            </div>

            <div>
              <h4 class="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                ${vol.name}
              </h4>
              <p class="text-[11px] text-teal-700 font-semibold">${vol.badge || 'Field Volunteer'}</p>
              <p class="text-xs text-slate-500">📍 ${vol.location || 'Patrol Area'}</p>
            </div>

            ${
              vol.assignedIncidentTitle
                ? `<div class="bg-amber-50 border border-amber-200 text-amber-900 p-1.5 rounded-lg text-[11px] font-medium">
                     🎯 <strong>Assigned:</strong> ${vol.assignedIncidentTitle}
                   </div>`
                : ''
            }

            <div class="flex flex-wrap gap-1 text-[10px]">
              ${(vol.skills || ['General Assistance'])
                .map(
                  (sk) =>
                    `<span class="bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded border border-slate-200">${sk}</span>`
                )
                .join('')}
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>📏 Distance: <strong>${formatDistance(distKm)}</strong></span>
              <span>⭐ ${vol.completedMissions || 12} missions</span>
            </div>

            <div class="grid grid-cols-2 gap-1.5 pt-1">
              <a
                href="tel:${vol.phone}"
                class="py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1 no-underline"
              >
                📞 Call
              </a>
              <button
                id="vol_sel_${vol.id}"
                class="py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                📋 Details
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`vol_sel_${vol.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectMarker) onSelectMarker(vol, 'volunteer');
            };
          }
        });
        marker.on('click', () => onSelectMarker && onSelectMarker(vol, 'volunteer'));
        marker.addTo(group);
      }
    });

    // 8. Clicked Coordinates Pin Marker
    if (clickedCoords) {
      const clickIcon = L.divIcon({
        className: 'custom-disaster-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-rose-500 opacity-75"></span>
            <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-2xl border-2 border-white font-bold text-xs">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const clickMarker = L.marker([clickedCoords.lat, clickedCoords.lng], { icon: clickIcon });
      const popupContent = `
        <div class="p-2 font-sans text-xs space-y-1.5 max-w-[240px]">
          <span class="font-extrabold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 block text-center">
            📍 SELECTED MAP LOCATION
          </span>
          <p class="text-slate-950 font-bold text-xs text-center leading-snug">
            ${clickedAddress || 'Selected Location Point'}
          </p>
        </div>
      `;
      clickMarker.bindPopup(popupContent).openPopup();
      clickMarker.addTo(group);
    }
  }, [reports, shelters, reliefCenters, roadBlocks, volunteers, dangerZones, userLocation, clickedCoords, clickedAddress, onSelectMarker]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 transition-all ${
        isFullScreen ? 'fixed inset-0 z-[2500] rounded-none h-screen' : ''
      }`}
      style={{ height: isFullScreen ? '100vh' : height }}
    >
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Bar: Controls & Geolocation */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none gap-2">
        <div className="pointer-events-auto flex items-center gap-2">
          {/* My Location GPS Button */}
          <button
            onClick={handleGetMyLocation}
            disabled={isLocating}
            className="px-4 py-2.5 bg-white/95 backdrop-blur-md hover:bg-slate-50 text-slate-950 font-black text-xs rounded-2xl shadow-xl border border-slate-300 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Scan exact live GPS location and drop pin on map"
          >
            <LocateFixed className={`w-4 h-4 text-rose-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring Exact GPS...' : '🎯 Scan Live Location & Pin on Map'}</span>
          </button>

          {/* User GPS Active Pin Badge */}
          {userLocation && (
            <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/90 text-white backdrop-blur-md rounded-2xl text-xs font-sans font-bold border border-teal-500/60 shadow-lg max-w-sm truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-teal-400 shrink-0 font-extrabold">Live Location:</span>
              <span className="truncate text-slate-100 font-medium">{globalAddress || 'Active GPS Location'}</span>
              {userLocation.accuracy && (
                <span className="text-emerald-400 text-[10px] font-mono shrink-0">
                  (±{Math.round(userLocation.accuracy)}m)
                </span>
              )}
            </span>
          )}
        </div>

        {/* Right Action Controls: Zoom & Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onClick={toggleFullScreen}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Toggle Full Screen"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Geolocation Banner Notice if Error */}
      {geoError && (
        <div className="absolute top-16 left-4 right-4 z-[1000] p-3 bg-amber-950/90 text-amber-200 backdrop-blur-md rounded-2xl border border-amber-700 shadow-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{geoError}</span>
          </span>
          <button
            onClick={() => setGeoError(null)}
            className="text-amber-400 hover:text-white font-bold text-xs ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Map Click Pin Bar */}
      {clickedCoords && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/95 text-white p-3 rounded-2xl border border-teal-500/50 shadow-2xl flex flex-wrap items-center gap-3 text-xs animate-fade-in backdrop-blur-md max-w-lg w-11/12 justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-teal-400 font-extrabold shrink-0">📍 Selected:</span>
            <span className="font-bold text-slate-100 truncate max-w-[220px]">
              {clickedAddress || 'Identifying address...'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onRequestReportAtCoords) onRequestReportAtCoords(clickedCoords);
                setClickedCoords(null);
              }}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Report Emergency
            </button>

            <button
              onClick={() => {
                if (onRequestAddDangerZoneAtCoords) onRequestAddDangerZoneAtCoords(clickedCoords);
                setClickedCoords(null);
              }}
              className="px-2.5 py-1.5 bg-red-800 hover:bg-red-900 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1 cursor-pointer transition-all"
            >
              <Shield className="w-3.5 h-3.5" /> Add Danger Zone
            </button>

            <button
              onClick={() => setClickedCoords(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Route Direction Overlay Panel */}
      {activeRouteInfo && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-[1000] max-w-sm bg-slate-900/95 text-white p-4 rounded-3xl border border-sky-500/50 shadow-2xl backdrop-blur-md space-y-2 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-extrabold uppercase text-sky-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-400" /> Active Route Navigation
            </span>
            <button
              onClick={() => setActiveRouteInfo(null)}
              className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              ✕ Clear Route
            </button>
          </div>

          <h4 className="font-extrabold text-sm text-white">{activeRouteInfo.destName}</h4>

          <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">DISTANCE</span>
              <span className="font-extrabold text-sky-300 text-sm">
                {formatDistance(activeRouteInfo.distanceKm)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">WALK TIME</span>
              <span className="font-extrabold text-emerald-300 text-sm">
                ~{estimateTravelTime(activeRouteInfo.distanceKm).walkingMin} mins
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">DRIVE TIME</span>
              <span className="font-extrabold text-amber-300 text-sm">
                ~{estimateTravelTime(activeRouteInfo.distanceKm).drivingMin} mins
              </span>
            </div>
          </div>

          <a
            href={getDirectionsUrl(
              activeRouteInfo.destLat,
              activeRouteInfo.destLng,
              activeRouteInfo.destName,
              userLocation?.lat,
              userLocation?.lng
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all text-center block"
          >
            <span>Launch Live Navigation ↗</span>
          </a>
        </div>
      )}
    </div>
  );
};
