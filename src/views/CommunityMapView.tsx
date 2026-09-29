import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DisasterMap } from '../components/map/DisasterMap';
import { LocationSearch } from '../components/map/LocationSearch';
import { MapLegend } from '../components/map/MapLegend';
import { ReportEmergencyModal } from '../components/map/ReportEmergencyModal';
import { AddDangerZoneModal } from '../components/map/AddDangerZoneModal';
import {
  MapPin,
  Filter,
  AlertTriangle,
  Home,
  Package,
  HeartHandshake,
  ShieldCheck,
  Plus,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const CommunityMapView: React.FC = () => {
  const {
    emergencyReports,
    sosRequests,
    shelters,
    reliefCenters,
    roadBlocks,
    dangerZones,
    volunteers,
    currentUser,
    addCommunityConfirmation,
    isRealTimeLive,
    toggleRealTimeLive,
    activeRespondersCount,
    realTimeEvents,
    userLocation,
    userLocationAddress,
    userLocationAccuracy,
    gpsStatus,
    requestLiveLocation,
  } = useApp();

  // Layer Visibility Filters
  const [showSosBeacons, setShowSosBeacons] = useState(true);
  const [showEmergencies, setShowEmergencies] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showReliefCenters, setShowReliefCenters] = useState(true);
  const [showRoadBlocks, setShowRoadBlocks] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);

  const [selectedItem, setSelectedItem] = useState<{ item: any; type: string } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [mapZoom, setMapZoom] = useState<number>(13);

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [dangerZoneModalOpen, setDangerZoneModalOpen] = useState(false);
  const [modalCoords, setModalCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleSelectMarker = (item: any, type: string) => {
    setSelectedItem({ item, type });
  };

  const handleSelectSearchResult = (lat: number, lng: number, item?: any) => {
    setMapCenter([lat, lng]);
    setMapZoom(15);
    if (item && item.category !== 'OpenStreetMap Location') {
      setSelectedItem({ item, type: item.category.toLowerCase() });
    }
  };

  const handleRequestReportAtCoords = (coords: { lat: number; lng: number }) => {
    setModalCoords(coords);
    setReportModalOpen(true);
  };

  const handleRequestDangerZoneAtCoords = (coords: { lat: number; lng: number }) => {
    setModalCoords(coords);
    setDangerZoneModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header & Main Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-md card-3d">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider bg-teal-100/90 px-3 py-1 rounded-full border border-teal-300">
              SAHAAY 3D COMMUNITY RELIEF NETWORK
            </span>
            <span className="text-xs font-extrabold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              🔴 Live OpenStreetMap GPS Grid Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            SAHAAY 3D Community Relief & Incident Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-world vector map with live incident tracking, GPS location, shelters, and danger zone perimeters.
          </p>
        </div>

        {/* Action Buttons: Pin Emergency & Add Danger Zone */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              setModalCoords(null);
              setReportModalOpen(true);
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer btn-danger-3d shrink-0"
          >
            <Plus className="w-4 h-4" /> Report & Pin Emergency
          </button>

          {(currentUser.role === 'admin' || currentUser.role === 'volunteer') && (
            <button
              onClick={() => {
                setModalCoords(null);
                setDangerZoneModalOpen(true);
              }}
              className="px-4 py-2.5 bg-red-900 hover:bg-red-950 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Shield className="w-4 h-4 text-red-300" /> Create Danger Zone
            </button>
          )}
        </div>
      </div>

      {/* Real World Location Search Bar */}
      <div className="w-full">
        <LocationSearch
          shelters={shelters}
          reports={emergencyReports}
          reliefCenters={reliefCenters}
          roadBlocks={roadBlocks}
          dangerZones={dangerZones}
          onSelectResult={handleSelectSearchResult}
        />
      </div>

      {/* Real-time Live Location HUD Bar */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 p-4 rounded-3xl text-white border border-teal-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0 shadow-inner">
            <MapPin className="w-5 h-5 text-teal-400" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">
                Live Location Address
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {gpsStatus === 'ACTIVE' ? 'GPS Active' : gpsStatus === 'ACQUIRING' ? 'Acquiring...' : 'Online'}
              </span>
              {userLocationAccuracy && (
                <span className="text-[10px] font-mono text-slate-400">
                  (±{Math.round(userLocationAccuracy)}m precision)
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base font-extrabold text-white truncate max-w-xl">
              {userLocationAddress || 'Detecting your live address...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => {
              if (userLocation) {
                setMapCenter([userLocation.lat, userLocation.lng]);
                setMapZoom(16);
              } else {
                requestLiveLocation();
              }
            }}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Locate and center map on your real-world coordinates"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Show My Location on Map</span>
          </button>
        </div>
      </div>

      {/* Map Layer Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 p-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/70 font-extrabold text-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Crisis Map</span>
          </span>
          <span className="text-slate-400 text-[11px] hidden sm:inline-block">
            Real-time live multi-hazard layer GIS
          </span>
        </div>

        {/* Layer Visibility Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 px-1 flex items-center gap-1 text-[11px]">
            <Filter className="w-3 h-3" /> Filters:
          </span>
          <button
            onClick={() => setShowSosBeacons(!showSosBeacons)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              showSosBeacons ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-200 animate-ping"></span>
            🚨 Active SOS ({((sosRequests || [])).filter((s) => s.status !== 'RESOLVED').length})
          </button>
          <button
            onClick={() => setShowEmergencies(!showEmergencies)}
            className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
              showEmergencies ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            🔴 Reports ({emergencyReports.length})
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
              showShelters ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            🔵 Shelters ({shelters.length})
          </button>
          <button
            onClick={() => setShowDangerZones(!showDangerZones)}
            className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
              showDangerZones ? 'bg-red-800 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            ⚠️ Danger Zones ({dangerZones.length})
          </button>
          <button
            onClick={() => setShowReliefCenters(!showReliefCenters)}
            className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
              showReliefCenters ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            🟣 Relief ({reliefCenters.length})
          </button>
          <button
            onClick={() => setShowRoadBlocks(!showRoadBlocks)}
            className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
              showRoadBlocks ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            🟠 Roads ({roadBlocks.length})
          </button>
          <button
            onClick={() => setShowVolunteers(!showVolunteers)}
            className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
              showVolunteers ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
            }`}
          >
            🟢 Volunteers ({volunteers.length})
          </button>
        </div>
      </div>

      {/* Main Map Container & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Container */}
        <div className="lg:col-span-8 space-y-3">
          <DisasterMap
            height="620px"
            reports={showEmergencies ? emergencyReports : []}
            sosRequests={showSosBeacons ? sosRequests : []}
            shelters={showShelters ? shelters : []}
            reliefCenters={showReliefCenters ? reliefCenters : []}
            roadBlocks={showRoadBlocks ? roadBlocks : []}
            volunteers={showVolunteers ? volunteers : []}
            dangerZones={showDangerZones ? dangerZones : []}
            center={mapCenter}
            zoom={mapZoom}
            onSelectMarker={handleSelectMarker}
            onRequestReportAtCoords={handleRequestReportAtCoords}
            onRequestAddDangerZoneAtCoords={handleRequestDangerZoneAtCoords}
          />

          {/* Map Legend Key */}
          <MapLegend />
        </div>

        {/* Selected Marker Detail Card / Feed Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {selectedItem ? (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xl card-3d space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {selectedItem.type.toUpperCase()} DETAILS
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕ Close
                </button>
              </div>

              {selectedItem.type === 'sos' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-600 text-white animate-pulse">
                      🚨 SATELLITE SOS BEACON
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {selectedItem.item.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedItem.item.emergencyType} Emergency
                  </h3>
                  {selectedItem.item.description && (
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{selectedItem.item.description}"
                    </p>
                  )}

                  <div className="bg-red-50 p-3 rounded-2xl border border-red-200 space-y-1 text-xs text-slate-700">
                    <div>📍 <strong>Address:</strong> {selectedItem.item.address}</div>
                    <div>⚡ <strong>Severity:</strong> <span className="font-black text-red-700">{selectedItem.item.severity}</span> (Risk: {selectedItem.item.aiAssessment?.riskScore || 85}/100)</div>
                    {selectedItem.item.aiAssessment?.assignedGroupName && (
                      <div>👥 <strong>Assigned Squad:</strong> <span className="font-bold text-indigo-700">{selectedItem.item.aiAssessment.assignedGroupName}</span></div>
                    )}
                    {selectedItem.item.reporterPhone && (
                      <div>📞 <strong>Contact:</strong> {selectedItem.item.reporterPhone}</div>
                    )}
                  </div>
                </div>
              )}

              {selectedItem.type === 'volunteer' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                        selectedItem.item.availability === 'AVAILABLE'
                          ? 'bg-emerald-600'
                          : selectedItem.item.availability === 'ON_MISSION'
                          ? 'bg-amber-600'
                          : 'bg-indigo-600'
                      }`}
                    >
                      {selectedItem.item.availability === 'AVAILABLE'
                        ? '🟢 AVAILABLE'
                        : selectedItem.item.availability === 'ON_MISSION'
                        ? '🟠 ON MISSION'
                        : '🟣 ON CALL'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedItem.item.lastActive || 'Active'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {selectedItem.item.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700">
                      {selectedItem.item.badge || 'Field Volunteer'}
                    </p>
                    <p className="text-xs text-slate-500">📍 {selectedItem.item.location}</p>
                  </div>

                  {selectedItem.item.assignedIncidentTitle && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
                      🎯 <strong>Assigned Mission:</strong>{' '}
                      {selectedItem.item.assignedIncidentTitle}
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="font-bold text-slate-800">Specialized Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {(selectedItem.item.skills || ['General Relief']).map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg font-medium text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="pt-1 text-[11px] text-slate-500 flex justify-between">
                      <span>
                        Experience: <strong>{selectedItem.item.experienceYears || 2} yrs</strong>
                      </span>
                      <span>
                        Missions: <strong>{selectedItem.item.completedMissions || 15}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <a
                      href={`tel:${selectedItem.item.phone}`}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 no-underline cursor-pointer"
                    >
                      📞 Call Volunteer ({selectedItem.item.phone})
                    </a>
                  </div>
                </div>
              )}

              {selectedItem.type === 'emergency' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      🚨 {selectedItem.item.severity} {selectedItem.item.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {selectedItem.item.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">
                    {selectedItem.item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedItem.item.description}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-700">
                    <div>📍 <strong>Address:</strong> {selectedItem.item.locationAddress}</div>
                    <div>👥 <strong>Affected:</strong> {selectedItem.item.affected?.total || 1} citizens</div>
                    <div>👤 <strong>Reported By:</strong> {selectedItem.item.reporterName}</div>
                  </div>

                  {/* Community Confirmations Bar */}
                  <div className="bg-amber-50/90 p-3 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-amber-900">
                      <span>Community Verification</span>
                      <span>
                        {selectedItem.item.communityConfirmations?.confirmed || 0} Confirmed
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => addCommunityConfirmation(selectedItem.item.id, true)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Incident
                      </button>
                      <button
                        onClick={() => addCommunityConfirmation(selectedItem.item.id, false)}
                        className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Unconfirmed
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.type === 'shelter' && (
                <div className="space-y-3">
                  <span className="text-xs font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    🏠 EMERGENCY SHELTER
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedItem.item.name}</h3>
                  <p className="text-xs text-slate-600">📍 {selectedItem.item.locationAddress}</p>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Occupancy:</span>
                      <span>
                        {selectedItem.item.occupancy} / {selectedItem.item.capacity}
                      </span>
                    </div>
                    <div>Contact Emergency Helpline: <strong>{selectedItem.item.contactNumber}</strong></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <MapPin className="w-8 h-8 text-teal-600 mx-auto animate-bounce" />
              <h3 className="font-extrabold text-slate-800 text-sm">Interactive Map Selection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click any marker on the map to inspect live reports, shelter bed occupancy, or get turn-by-turn navigation routes.
              </p>
            </div>
          )}

          {/* Live Incident Activity Stream */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                Active Incidents Stream
              </h4>
              <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {emergencyReports.length} Active
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {emergencyReports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    handleSelectMarker(r, 'emergency');
                    setMapCenter([r.lat, r.lng]);
                    setMapZoom(15);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 cursor-pointer text-xs transition-all space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-rose-700">🚨 {r.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{r.status}</span>
                  </div>
                  <p className="text-slate-800 font-extrabold truncate">{r.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">📍 {r.locationAddress}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Report Modal */}
      <ReportEmergencyModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        selectedCoords={modalCoords}
      />

      {/* Add Danger Zone Modal */}
      <AddDangerZoneModal
        isOpen={dangerZoneModalOpen}
        onClose={() => setDangerZoneModalOpen(false)}
        selectedCoords={modalCoords}
      />
    </div>
  );
};
