import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserProfile,
  UserRole,
  EmergencyReport,
  HelpRequest,
  Shelter,
  ShelterBooking,
  ReliefCenter,
  DisasterAlert,
  ResourceItem,
  RoadBlock,
  RecoveryReport,
  SystemNotification,
  ReportStatus,
  VolunteerStatus,
  VolunteerSkill,
  RealTimeFeedEvent,
  CapAlert,
  WeatherConditionData,
  EmergencyContactRecord,
  AlertAnalyticsData,
  SosIncident,
  SosStatus,
  VolunteerGroup,
  VolunteerGroupMember,
  VolunteerGroupMission,
  VolunteerGroupStatus,
  VolunteerFieldReport,
  DisasterMediaVerification,
  VerificationStatus,
  IncidentCluster,
  AiDisasterAnalysisResult,
} from '../types';
import {
  DEMO_PROFILES,
  DEMO_EMERGENCY_REPORTS,
  DEMO_HELP_REQUESTS,
  DEMO_SHELTERS,
  DEMO_SHELTER_BOOKINGS,
  DEMO_RELIEF_CENTERS,
  DEMO_ALERTS,
  DEMO_RESOURCES,
  DEMO_ROAD_BLOCKS,
  DEMO_RECOVERY_REPORTS,
  DEMO_NOTIFICATIONS,
  DEMO_DANGER_ZONES,
  DEMO_REALTIME_EVENTS,
  DEMO_CAP_ALERTS,
  DEMO_EMERGENCY_CONTACTS,
  DEMO_ALERT_ANALYTICS,
  DEMO_SOS_INCIDENTS,
  DEMO_VOLUNTEER_GROUPS,
  DEMO_VOLUNTEER_REPORTS,
  DEMO_VERIFICATIONS,
  DEMO_INCIDENT_CLUSTERS,
  DEMO_AI_ANALYSIS,
  BASE_LAT,
  BASE_LNG,
} from '../data/initialData';
import { DangerZone } from '../types';
import { sahaayDB } from '../utils/indexedDB';
import { reverseGeocodeAddress } from '../utils/geoUtils';

export interface PendingSyncItem {
  id: string;
  type: 'EMERGENCY_REPORT' | 'HELP_REQUEST' | 'RECOVERY_REPORT' | 'ROAD_BLOCK';
  summary: string;
  createdAt: string;
}

interface AppContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateVolunteerProfile: (skills: VolunteerSkill[], availability: VolunteerStatus) => void;

  // Many Field Volunteers Roster
  volunteers: UserProfile[];
  addVolunteer: (vol: Omit<UserProfile, 'id' | 'role'>) => void;
  updateVolunteerStatus: (id: string, status: VolunteerStatus) => void;
  assignVolunteerToEmergency: (volunteerId: string, emergencyId: string, emergencyTitle: string) => void;
  unassignVolunteerFromEmergency: (emergencyId: string) => void;
  activeRespondersCount: number;

  // Real-Time Events Feed & Live Telemetry
  realTimeEvents: RealTimeFeedEvent[];
  addRealTimeEvent: (event: Omit<RealTimeFeedEvent, 'id' | 'timestamp'>) => void;
  isRealTimeLive: boolean;
  toggleRealTimeLive: () => void;
  broadcastLiveAlert: (title: string, message: string, severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') => void;

  // Emergency Reports
  emergencyReports: EmergencyReport[];
  addEmergencyReport: (
    report: Omit<
      EmergencyReport,
      'id' | 'createdAt' | 'status' | 'reporterId' | 'reporterName' | 'communityConfirmations'
    >
  ) => EmergencyReport;
  verifyReport: (id: string) => void;
  rejectReport: (id: string) => void;
  resolveReport: (id: string) => void;
  reopenReport: (id: string) => void;
  addCommunityConfirmation: (id: string, isConfirmed: boolean) => void;

  // Help Requests
  helpRequests: HelpRequest[];
  addHelpRequest: (
    request: Omit<
      HelpRequest,
      | 'id'
      | 'createdAt'
      | 'status'
      | 'citizenId' | 'citizenName'
      | 'timeline'
    >
  ) => HelpRequest;
  updateRequestStatus: (id: string, status: ReportStatus, note?: string) => void;

  // Volunteer Tasks Workflow
  acceptVolunteerTask: (id: string, isReport?: boolean) => void;
  startTask: (id: string, isReport?: boolean) => void;
  completeTask: (id: string, isReport?: boolean) => void;

  // Shelters & Bookings
  shelters: Shelter[];
  shelterBookings: ShelterBooking[];
  updateShelterOccupancy: (id: string, newOccupancy: number) => void;
  addShelter: (shelter: Omit<Shelter, 'id'>) => Shelter;
  bookShelter: (
    booking: Omit<ShelterBooking, 'id' | 'createdAt' | 'status' | 'qrPassCode'>
  ) => ShelterBooking;
  cancelShelterBooking: (bookingId: string) => void;
  checkInShelterBooking: (bookingId: string) => void;

  // Relief Centers
  reliefCenters: ReliefCenter[];

  // Disaster Alerts
  alerts: DisasterAlert[];
  createAlert: (
    alert: Omit<DisasterAlert, 'id' | 'publishedAt' | 'active' | 'isDemo'>
  ) => void;

  // Resources
  resources: ResourceItem[];
  updateResourceStock: (id: string, newQuantity: number) => void;

  // Road Blocks
  roadBlocks: RoadBlock[];
  addRoadBlock: (block: Omit<RoadBlock, 'id' | 'reportedAt' | 'verified'>) => void;

  // Recovery Reports
  recoveryReports: RecoveryReport[];
  addRecoveryReport: (
    recovery: Omit<RecoveryReport, 'id' | 'createdAt' | 'status'>
  ) => void;

  // Danger Zones
  dangerZones: DangerZone[];
  addDangerZone: (zone: Omit<DangerZone, 'id' | 'createdAt' | 'active'>) => void;
  removeDangerZone: (id: string) => void;

  // Real User Geolocation
  userLocation: { lat: number; lng: number; accuracy?: number } | null;
  userLocationAddress: string;
  userLocationAccuracy: number | null;
  setUserLocation: (loc: { lat: number; lng: number; accuracy?: number } | null) => void;
  setManualLocation: (address: string, lat: number, lng: number) => void;

  // Offline Mode & Outbox Sync
  offlineMode: boolean;
  toggleOfflineMode: () => void;
  isNetworkOnline: boolean;
  isEffectiveOffline: boolean;
  pendingSyncQueue: PendingSyncItem[];
  syncPendingQueue: () => void;
  clearSyncQueue: () => void;

  // Notifications
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Authentication & Session
  isAuthenticated: boolean;
  login: (
    role: UserRole,
    userInfo?: { name?: string; email?: string; phone?: string; skills?: VolunteerSkill[] }
  ) => void;
  selectVolunteerProfile: (volunteerId: string) => void;
  logout: () => void;

  // Live GPS Location
  requestLiveLocation: () => void;
  gpsStatus: 'IDLE' | 'ACQUIRING' | 'ACTIVE' | 'ERROR';

  // Admin Security Passcode Verification
  isAdminVerified: boolean;
  verifyAdminPasscode: (passcode: string) => boolean;
  logoutAdmin: () => void;

  // Reset
  resetToDemoData: () => void;

  // Real IndexedDB Database Status
  isDbConnected: boolean;

  // CAP-Compatible Emergency Alert Ecosystem
  capAlerts: CapAlert[];
  activeCapAlerts: CapAlert[];
  activeSimulationAlert: CapAlert | null;
  fetchCapAlerts: () => Promise<void>;
  createCapAlert: (alertData: any) => Promise<CapAlert | null>;
  updateCapAlertStatus: (id: string, status: string) => Promise<boolean>;
  triggerSimulation: (disasterType?: string, radiusKm?: number) => Promise<any>;
  dismissSimulationAlerts: () => void;

  // Early Warning & Weather Intelligence
  weatherData: WeatherConditionData | null;
  isLoadingWeather: boolean;
  fetchWeather: (lat?: number, lng?: number, address?: string) => Promise<void>;

  // Citizen Emergency Contact Registry
  emergencyContacts: EmergencyContactRecord[];
  fetchEmergencyContacts: (centerLat?: number, centerLng?: number, radiusKm?: number) => Promise<void>;
  updateContactPrivacy: (id: string, updates: Partial<EmergencyContactRecord>) => Promise<boolean>;

  // Alert & Crisis Analytics
  alertAnalytics: AlertAnalyticsData | null;
  fetchAlertAnalytics: () => Promise<void>;

  // GPS-Powered SOS & Emergency State
  sosIncidents: SosIncident[];
  sosRequests: SosIncident[];
  activeSos: SosIncident | null;
  submitSos: (sosData: {
    disasterType: import('../types').EmergencyType;
    lat: number;
    lng: number;
    accuracyMeters: number;
    locationAddress: string;
    peopleCount: number;
    situationAnswers: Record<string, string | boolean | number>;
    severity?: import('../types').SeverityLevel;
    description?: string;
    photoUrl?: string;
    voiceNoteUrl?: string;
    voiceTranscript?: string;
    reporterPhone?: string;
    reporterName?: string;
  }) => Promise<SosIncident>;
  cancelSos: (sosId: string) => void;
  updateSosStatus: (sosId: string, status: SosStatus, assignedGroupId?: string, assignedGroupName?: string) => void;

  // Volunteer Group-Based Activity
  volunteerGroups: VolunteerGroup[];
  userVolunteerGroup: VolunteerGroup | null;
  createVolunteerGroup: (group: Partial<VolunteerGroup>) => void;
  assignGroupMission: (groupId: string, mission: VolunteerGroupMission) => void;
  updateGroupStatus: (groupId: string, status: VolunteerGroupStatus) => void;
  volunteerReports: VolunteerFieldReport[];
  submitVolunteerReport: (report: Omit<VolunteerFieldReport, 'id' | 'timestamp'>) => void;

  // Deepfake & Disaster Media Verification Queue
  mediaVerifications: DisasterMediaVerification[];
  verifyMedia: (id: string, newStatus: VerificationStatus, notes?: string) => void;
  analyzeUploadedMedia: (data: {
    title: string;
    disaster: import('../types').EmergencyType;
    location: string;
    mediaUrl: string;
    source: 'Citizen SOS' | 'Social Media Feed' | 'Volunteer Upload' | 'Civil Defense Camera';
  }) => Promise<DisasterMediaVerification>;

  // AI Data Analysis & Multi-Incident Correlation
  incidentClusters: IncidentCluster[];
  confirmIncidentCluster: (clusterId: string, confirmed: boolean) => void;
  aiAnalysis: AiDisasterAnalysisResult;
  refreshAiAnalysis: () => Promise<void>;

  // Global Modals: Emergency SOS Modal & Voice Mode Assistant
  isEmergencySosModalOpen: boolean;
  openEmergencySosModal: () => void;
  closeEmergencySosModal: () => void;
  isVoiceModeOpen: boolean;
  openVoiceMode: () => void;
  closeVoiceMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'SAHAAY_APP_STATE_V1';

const UNAUTHENTICATED_GUEST: UserProfile = {
  id: 'usr_guest',
  name: 'Guest Citizen',
  email: '',
  phone: '',
  role: 'citizen',
  location: 'Detecting Live GPS...',
  lat: BASE_LAT,
  lng: BASE_LNG,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or fallback to DEMO
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }
    return null;
  };

  const initialData = loadInitialState();

  const [activeRole, setActiveRole] = useState<UserRole>(initialData?.activeRole || 'citizen');
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    initialData?.currentUser || UNAUTHENTICATED_GUEST
  );
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>(
    Array.isArray(initialData?.emergencyReports) ? initialData.emergencyReports : DEMO_EMERGENCY_REPORTS
  );
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(
    Array.isArray(initialData?.helpRequests) ? initialData.helpRequests : DEMO_HELP_REQUESTS
  );
  const [shelters, setShelters] = useState<Shelter[]>(
    Array.isArray(initialData?.shelters) ? initialData.shelters : DEMO_SHELTERS
  );
  const [shelterBookings, setShelterBookings] = useState<ShelterBooking[]>(
    Array.isArray(initialData?.shelterBookings) ? initialData.shelterBookings : DEMO_SHELTER_BOOKINGS
  );
  const [reliefCenters] = useState<ReliefCenter[]>(
    Array.isArray(initialData?.reliefCenters) ? initialData.reliefCenters : DEMO_RELIEF_CENTERS
  );
  const [alerts, setAlerts] = useState<DisasterAlert[]>(
    Array.isArray(initialData?.alerts) ? initialData.alerts : DEMO_ALERTS
  );
  const [resources, setResources] = useState<ResourceItem[]>(
    Array.isArray(initialData?.resources) ? initialData.resources : DEMO_RESOURCES
  );
  const [roadBlocks, setRoadBlocks] = useState<RoadBlock[]>(
    Array.isArray(initialData?.roadBlocks) ? initialData.roadBlocks : DEMO_ROAD_BLOCKS
  );
  const [recoveryReports, setRecoveryReports] = useState<RecoveryReport[]>(
    Array.isArray(initialData?.recoveryReports) ? initialData.recoveryReports : DEMO_RECOVERY_REPORTS
  );
  const [dangerZones, setDangerZones] = useState<DangerZone[]>(
    Array.isArray(initialData?.dangerZones) ? initialData.dangerZones : DEMO_DANGER_ZONES
  );
  const [volunteers, setVolunteers] = useState<UserProfile[]>(() => {
    if (Array.isArray(initialData?.volunteers) && initialData.volunteers.length > 0) {
      return initialData.volunteers;
    }
    return (DEMO_PROFILES || []).filter((p) => p.role === 'volunteer');
  });
  const [realTimeEvents, setRealTimeEvents] = useState<RealTimeFeedEvent[]>(
    Array.isArray(initialData?.realTimeEvents) ? initialData.realTimeEvents : DEMO_REALTIME_EVENTS
  );
  const [isRealTimeLive, setIsRealTimeLive] = useState<boolean>(true);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(
    initialData?.userLocation || null
  );
  const [userLocationAddress, setUserLocationAddress] = useState<string>('Detecting live address...');
  const [userLocationAccuracy, setUserLocationAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'IDLE' | 'ACQUIRING' | 'ACTIVE' | 'ERROR'>('IDLE');
  const [notifications, setNotifications] = useState<SystemNotification[]>(
    Array.isArray(initialData?.notifications) ? initialData.notifications : DEMO_NOTIFICATIONS
  );
  const [offlineMode, setOfflineMode] = useState<boolean>(initialData?.offlineMode || false);
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingSyncQueue, setPendingSyncQueue] = useState<PendingSyncItem[]>(
    Array.isArray(initialData?.pendingSyncQueue) ? initialData.pendingSyncQueue : []
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialData?.isAuthenticated ?? false
  );

  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(
    initialData?.isAdminVerified || false
  );

  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // CAP-Compatible Emergency Alerts & Weather State
  const [capAlerts, setCapAlerts] = useState<CapAlert[]>(
    Array.isArray(initialData?.capAlerts) ? initialData.capAlerts : DEMO_CAP_ALERTS
  );
  const [activeSimulationAlert, setActiveSimulationAlert] = useState<CapAlert | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherConditionData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactRecord[]>(
    Array.isArray(initialData?.emergencyContacts) ? initialData.emergencyContacts : DEMO_EMERGENCY_CONTACTS
  );
  const [alertAnalytics, setAlertAnalytics] = useState<AlertAnalyticsData | null>(DEMO_ALERT_ANALYTICS);

  // New Upgrade: GPS-Powered SOS State
  const [sosIncidents, setSosIncidents] = useState<SosIncident[]>(
    Array.isArray(initialData?.sosIncidents) ? initialData.sosIncidents : DEMO_SOS_INCIDENTS
  );
  const [activeSos, setActiveSos] = useState<SosIncident | null>(null);

  // Volunteer Group-Based Coordination
  const [volunteerGroups, setVolunteerGroups] = useState<VolunteerGroup[]>(
    Array.isArray(initialData?.volunteerGroups) ? initialData.volunteerGroups : DEMO_VOLUNTEER_GROUPS
  );
  const [volunteerReports, setVolunteerReports] = useState<VolunteerFieldReport[]>(
    Array.isArray(initialData?.volunteerReports) ? initialData.volunteerReports : DEMO_VOLUNTEER_REPORTS
  );

  // Deepfake & Disaster Media Verification Queue
  const [mediaVerifications, setMediaVerifications] = useState<DisasterMediaVerification[]>(
    Array.isArray(initialData?.mediaVerifications) ? initialData.mediaVerifications : DEMO_VERIFICATIONS
  );

  // AI Correlation & Clusters
  const [incidentClusters, setIncidentClusters] = useState<IncidentCluster[]>(
    Array.isArray(initialData?.incidentClusters) ? initialData.incidentClusters : DEMO_INCIDENT_CLUSTERS
  );
  const [aiAnalysis, setAiAnalysis] = useState<AiDisasterAnalysisResult>(
    initialData?.aiAnalysis || DEMO_AI_ANALYSIS
  );

  // Modals for SOS and Voice Mode
  const [isEmergencySosModalOpen, setIsEmergencySosModalOpen] = useState<boolean>(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState<boolean>(false);

  const openEmergencySosModal = useCallback(() => setIsEmergencySosModalOpen(true), []);
  const closeEmergencySosModal = useCallback(() => setIsEmergencySosModalOpen(false), []);
  const openVoiceMode = useCallback(() => setIsVoiceModeOpen(true), []);
  const closeVoiceMode = useCallback(() => setIsVoiceModeOpen(false), []);

  // Initialize IndexedDB Real Local Database & Hydrate State
  useEffect(() => {
    sahaayDB.initDB().then(async (connected) => {
      setIsDbConnected(connected);
      if (connected) {
        try {
          const savedReports = await sahaayDB.getAllItems<EmergencyReport>('emergencyReports');
          if (savedReports && savedReports.length > 0) {
            setEmergencyReports(savedReports);
          } else {
            sahaayDB.saveItems('emergencyReports', DEMO_EMERGENCY_REPORTS);
          }

          const savedRequests = await sahaayDB.getAllItems<HelpRequest>('helpRequests');
          if (savedRequests && savedRequests.length > 0) {
            setHelpRequests(savedRequests);
          } else {
            sahaayDB.saveItems('helpRequests', DEMO_HELP_REQUESTS);
          }

          const savedShelters = await sahaayDB.getAllItems<Shelter>('shelters');
          if (savedShelters && savedShelters.length > 0) {
            setShelters(savedShelters);
          } else {
            sahaayDB.saveItems('shelters', DEMO_SHELTERS);
          }

          const savedAlerts = await sahaayDB.getAllItems<DisasterAlert>('alerts');
          if (savedAlerts && savedAlerts.length > 0) {
            setAlerts(savedAlerts);
          } else {
            sahaayDB.saveItems('alerts', DEMO_ALERTS);
          }

          const savedQueue = await sahaayDB.getAllItems<PendingSyncItem>('pendingSyncQueue');
          if (savedQueue && savedQueue.length > 0) {
            setPendingSyncQueue(savedQueue);
          }
        } catch (e) {
          console.warn('Error hydrating from IndexedDB:', e);
        }
      }
    });
  }, []);

  const userLocationRef = useRef<{ lat: number; lng: number; accuracy?: number }>(userLocation);
  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);
  const lastGeocodedCoordRef = useRef<{ lat: number; lng: number } | null>(null);

  // --- CAP Alerts & Weather Handlers ---
  const fetchWeather = useCallback(async (lat?: number, lng?: number, address?: string) => {
    setIsLoadingWeather(true);
    try {
      const targetLat = lat ?? (userLocationRef.current?.lat || BASE_LAT);
      const targetLng = lng ?? (userLocationRef.current?.lng || BASE_LNG);
      const addrQuery = address ? `&address=${encodeURIComponent(address)}` : '';
      const res = await fetch(`/api/weather?lat=${targetLat}&lng=${targetLng}${addrQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.weather) {
          setWeatherData(data.weather);
        }
      }
    } catch (e) {
      console.warn('Weather fetch error:', e);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Real Browser Geolocation Trigger & Reverse Geocoding with Multi-Tier Fallback
  const requestLiveLocation = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setGpsStatus('ACQUIRING');

      const onLocationSuccess = async (pos: GeolocationPosition) => {
        const newLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
        };
        setUserLocation(newLoc);
        setUserLocationAccuracy(pos.coords.accuracy || 10);
        setGpsStatus('ACTIVE');
        try {
          lastGeocodedCoordRef.current = { lat: newLoc.lat, lng: newLoc.lng };
          const addr = await reverseGeocodeAddress(newLoc.lat, newLoc.lng);
          setUserLocationAddress(addr);
          setCurrentUser((prev) => ({
            ...prev,
            lat: newLoc.lat,
            lng: newLoc.lng,
            location: addr,
          }));
          fetchWeather(newLoc.lat, newLoc.lng, addr);
        } catch (err) {
          console.warn('Reverse geocode error after GPS:', err);
        }
      };

      // 1. Try High-Accuracy GPS first
      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        () => {
          // 2. Immediate fallback to coarse Wi-Fi/Cellular geolocation
          navigator.geolocation.getCurrentPosition(
            onLocationSuccess,
            async (err) => {
              console.warn('Live Geolocation fallback to IP telemetry:', err);
              try {
                const ipRes = await fetch('/api/geo/detect-ip');
                if (ipRes.ok) {
                  const ipData = await ipRes.json();
                  if (ipData.success && ipData.lat && ipData.lng) {
                    const ipLoc = { lat: ipData.lat, lng: ipData.lng, accuracy: ipData.accuracy || 500 };
                    setUserLocation(ipLoc);
                    setUserLocationAccuracy(ipLoc.accuracy);
                    setGpsStatus('ACTIVE');
                    lastGeocodedCoordRef.current = { lat: ipLoc.lat, lng: ipLoc.lng };
                    const addr = ipData.address || (await reverseGeocodeAddress(ipLoc.lat, ipLoc.lng));
                    setUserLocationAddress(addr);
                    setCurrentUser((prev) => ({ ...prev, lat: ipLoc.lat, lng: ipLoc.lng, location: addr }));
                    fetchWeather(ipLoc.lat, ipLoc.lng, addr);
                    return;
                  }
                }
              } catch (e) {
                console.warn('IP detect fallback failed:', e);
              }
              setGpsStatus('ACTIVE');
              lastGeocodedCoordRef.current = { lat: 18.5204, lng: 73.8567 };
              reverseGeocodeAddress(18.5204, 73.8567).then((addr) => {
                setUserLocationAddress((prev) => (prev === 'Detecting live address...' ? addr : prev));
                fetchWeather(18.5204, 73.8567, addr);
              });
            },
            { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 30000 }
      );
    } else {
      setGpsStatus('ERROR');
    }
  }, [fetchWeather]);

  const setManualLocation = useCallback(
    (address: string, lat: number, lng: number) => {
      const newLoc = { lat, lng, accuracy: 10 };
      lastGeocodedCoordRef.current = { lat, lng };
      setUserLocation(newLoc);
      setUserLocationAccuracy(10);
      setUserLocationAddress(address);
      setGpsStatus('ACTIVE');
      setCurrentUser((prev) => ({
        ...prev,
        lat,
        lng,
        location: address,
      }));
      fetchWeather(lat, lng, address);
    },
    [fetchWeather]
  );

  useEffect(() => {
    requestLiveLocation();
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setUserLocation((prev) => {
            if (prev && Math.abs(prev.lat - newLoc.lat) < 0.00008 && Math.abs(prev.lng - newLoc.lng) < 0.00008) {
              return prev;
            }
            return newLoc;
          });
          setUserLocationAccuracy(pos.coords.accuracy);
          setGpsStatus('ACTIVE');

          const lastGeocoded = lastGeocodedCoordRef.current;
          if (!lastGeocoded || Math.abs(lastGeocoded.lat - newLoc.lat) > 0.001 || Math.abs(lastGeocoded.lng - newLoc.lng) > 0.001) {
            lastGeocodedCoordRef.current = { lat: newLoc.lat, lng: newLoc.lng };
            try {
              const addr = await reverseGeocodeAddress(newLoc.lat, newLoc.lng);
              setUserLocationAddress(addr);
              setCurrentUser((prev) => ({
                ...prev,
                lat: newLoc.lat,
                lng: newLoc.lng,
                location: addr,
              }));
            } catch (err) {
              console.warn('GPS watcher geocode err:', err);
            }
          }
        },
        (err) => console.warn('GPS Watcher:', err),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Periodic Real-time Weather & Atmospheric Synchronization (every 60s)
  useEffect(() => {
    const timer = setInterval(() => {
      if (userLocationRef.current) {
        fetchWeather(userLocationRef.current.lat, userLocationRef.current.lng, userLocationAddress);
      } else {
        fetchWeather();
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [fetchWeather, userLocationAddress]);

  const fetchCapAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/cap-alerts');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.alerts)) {
          setCapAlerts(data.alerts);
        }
      }
    } catch (e) {
      console.warn('CAP alerts fetch error:', e);
    }
  }, []);

  const createCapAlert = useCallback(async (alertData: any): Promise<CapAlert | null> => {
    try {
      const res = await fetch('/api/cap-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.alert) {
          setCapAlerts((prev) => [data.alert, ...prev]);
          setNotifications((prev) => [
            {
              id: `notif_${Date.now()}`,
              title: `[CAP ALERT] ${data.alert.event} Issued`,
              message: data.alert.headline,
              timestamp: 'Just now',
              read: false,
              type: 'critical',
            },
            ...prev,
          ]);
          return data.alert;
        }
      }
    } catch (e) {
      console.warn('Create CAP alert failed:', e);
    }
    return null;
  }, []);

  const updateCapAlertStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/cap-alerts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminName: currentUser.name }),
      });
      if (res.ok) {
        setCapAlerts((prev) =>
          prev.map((a) => (a.id === id || a.identifier === id ? { ...a, status: status as any } : a))
        );
        return true;
      }
    } catch (e) {
      console.warn('Update alert status error:', e);
    }
    return false;
  }, [currentUser]);

  const triggerSimulation = useCallback(async (disasterType: string = 'Flood', radiusKm: number = 5): Promise<any> => {
    try {
      const lat = userLocationRef.current?.lat || BASE_LAT;
      const lng = userLocationRef.current?.lng || BASE_LNG;
      const res = await fetch('/api/cap-alerts/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disasterType, radiusKm, centerLat: lat, centerLng: lng }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.simulation?.alert) {
          const sim = data.simulation.alert;
          setActiveSimulationAlert(sim);
          setCapAlerts((prev) => [sim, ...prev]);
          setNotifications((prev) => [
            {
              id: `sim_notif_${Date.now()}`,
              title: `[SIMULATION] ${sim.event} Protocol Active`,
              message: sim.headline,
              timestamp: 'Just now',
              read: false,
              type: 'critical',
            },
            ...prev,
          ]);
          return data.simulation;
        }
      }
    } catch (e) {
      console.warn('Simulation trigger error:', e);
    }
    return null;
  }, []);

  const dismissSimulationAlerts = useCallback(() => {
    setActiveSimulationAlert(null);
    setCapAlerts((prev) => (prev || []).filter((a) => !a.isSimulation));
  }, []);

  const fetchEmergencyContacts = useCallback(async (centerLat?: number, centerLng?: number, radiusKm?: number) => {
    try {
      const lat = centerLat ?? (userLocationRef.current?.lat || BASE_LAT);
      const lng = centerLng ?? (userLocationRef.current?.lng || BASE_LNG);
      const rad = radiusKm ?? 5;
      const res = await fetch(`/api/emergency-registry?centerLat=${lat}&centerLng=${lng}&radiusKm=${rad}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.contacts)) {
          setEmergencyContacts(data.contacts);
        }
      }
    } catch (e) {
      console.warn('Emergency contacts fetch error:', e);
    }
  }, []);

  const updateContactPrivacy = useCallback(async (id: string, updates: Partial<EmergencyContactRecord>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/emergency-registry/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.contact) {
          setEmergencyContacts((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...data.contact } : c))
          );
          return true;
        }
      }
    } catch (e) {
      console.warn('Contact privacy update error:', e);
    }
    return false;
  }, []);

  const fetchAlertAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/alerts');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.analytics) {
          setAlertAnalytics(data.analytics);
        }
      }
    } catch (e) {
      console.warn('Alert analytics fetch error:', e);
    }
  }, []);

  // Fetch initial weather and alerts on mount
  useEffect(() => {
    fetchCapAlerts();
    fetchWeather();
    fetchEmergencyContacts();
    fetchAlertAnalytics();
  }, [fetchCapAlerts, fetchWeather, fetchEmergencyContacts, fetchAlertAnalytics]);

  const login = (
    role: UserRole,
    userInfo?: { name?: string; email?: string; phone?: string; skills?: VolunteerSkill[] }
  ) => {
    setIsAuthenticated(true);
    if (role === 'admin') {
      setIsAdminVerified(true);
    }
    setActiveRole(role);
    setCurrentUser((prev) => ({
      ...prev,
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: userInfo?.name?.trim() || (role === 'admin' ? 'Admin Response Officer' : role === 'volunteer' ? 'Field Volunteer' : 'Citizen Demo'),
      email: userInfo?.email?.trim() || (role === 'citizen' ? 'citizen@sahaay.org' : ''),
      phone: userInfo?.phone?.trim() || '',
      role: role,
      skills: userInfo?.skills || prev.skills,
    }));
  };

  const selectVolunteerProfile = (volunteerId: string) => {
    const target = volunteers.find((v) => v.id === volunteerId);
    if (target) {
      setIsAuthenticated(true);
      setActiveRole('volunteer');
      setCurrentUser(target);
      addRealTimeEvent({
        type: 'VOLUNTEER_ACTIVE',
        title: `Volunteer Active: ${target.name}`,
        description: `${target.badge || 'Field Responder'} now active in ${target.location || 'Pune Sector'}`,
        locationName: target.location,
        lat: target.lat,
        lng: target.lng,
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdminVerified(false);
    setActiveRole('citizen');
    setCurrentUser(UNAUTHENTICATED_GUEST);
  };

  const verifyAdminPasscode = (passcode: string): boolean => {
    const cleanKey = passcode.trim().toUpperCase();
    if (
      cleanKey === 'SAHAAY2026' ||
      cleanKey === 'SAHAAY2025' ||
      cleanKey === 'ADMIN123' ||
      cleanKey === 'ADMIN' ||
      cleanKey === 'SAHAAY'
    ) {
      setIsAdminVerified(true);
      setIsAuthenticated(true);
      setActiveRole('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminVerified(false);
    setIsAuthenticated(false);
    setActiveRole('citizen');
  };

  const isEffectiveOffline = offlineMode || !isNetworkOnline;

  // Listen for real network status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsNetworkOnline(true);
      setNotifications((prev) => [
        {
          id: `notif_online_${Date.now()}`,
          title: '📶 Internet Restored',
          message: 'You are back online. Click "Sync Outbox" to upload pending offline reports.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'INFO',
          read: false,
        },
        ...prev,
      ]);
    };

    const handleOffline = () => {
      setIsNetworkOnline(false);
      setNotifications((prev) => [
        {
          id: `notif_offline_${Date.now()}`,
          title: '📡 Network Connection Lost',
          message: 'SAHAAY is now operating in Offline Mode. All reports will be saved on-device.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'ALERT',
          read: false,
        },
        ...prev,
      ]);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const enqueuePendingSync = (
    type: 'EMERGENCY_REPORT' | 'HELP_REQUEST' | 'RECOVERY_REPORT' | 'ROAD_BLOCK',
    summary: string
  ) => {
    const newItem: PendingSyncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      summary,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setPendingSyncQueue((prev) => [newItem, ...prev]);
  };

  const syncPendingQueue = () => {
    if (pendingSyncQueue.length === 0) return;
    const count = pendingSyncQueue.length;
    setPendingSyncQueue([]);

    // Update emergency reports status from PENDING SYNC to SYNCED
    setEmergencyReports((prev) =>
      prev.map((r) =>
        r.status === 'PENDING SYNC' ? { ...r, status: 'SYNCED' } : r
      )
    );

    setNotifications((prev) => [
      {
        id: `notif_synced_${Date.now()}`,
        title: '⚡ Offline Outbox Synchronized',
        message: `Successfully synchronized ${count} queued emergency report(s) to SAHAAY cloud.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'UPDATE',
        read: false,
      },
      ...prev,
    ]);
  };

  const clearSyncQueue = () => setPendingSyncQueue([]);

  // Auto save to localStorage & IndexedDB
  useEffect(() => {
    try {
      const stateToSave = {
        activeRole,
        currentUser,
        emergencyReports,
        helpRequests,
        shelters,
        reliefCenters,
        alerts,
        resources,
        roadBlocks,
        recoveryReports,
        notifications,
        offlineMode,
        pendingSyncQueue,
        isAdminVerified,
        isAuthenticated,
        volunteers,
        capAlerts,
        emergencyContacts,
        sosIncidents,
        volunteerGroups,
        volunteerReports,
        mediaVerifications,
        incidentClusters,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));

      // Asynchronous IndexedDB Persistence
      if (isDbConnected) {
        sahaayDB.saveItems('emergencyReports', emergencyReports);
        sahaayDB.saveItems('helpRequests', helpRequests);
        sahaayDB.saveItems('shelters', shelters);
        sahaayDB.saveItems('alerts', alerts);
        sahaayDB.saveItems('pendingSyncQueue', pendingSyncQueue);
        sahaayDB.saveItems('notifications', notifications);
        sahaayDB.saveStateKey('activeRole', activeRole);
        sahaayDB.saveStateKey('isAuthenticated', isAuthenticated);
      }
    } catch (e) {
      console.error('Failed to save app state:', e);
    }
  }, [
    activeRole,
    currentUser,
    emergencyReports,
    helpRequests,
    shelters,
    reliefCenters,
    alerts,
    resources,
    roadBlocks,
    recoveryReports,
    notifications,
    offlineMode,
    pendingSyncQueue,
    isAdminVerified,
    isAuthenticated,
  ]);

  // Role Switching Logic
  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    const matchingProfile = DEMO_PROFILES.find((p) => p.role === role) || {
      id: `usr_guest_${Date.now()}`,
      name: 'Guest User',
      email: 'guest@sahaay.org',
      phone: '+91 90000 00000',
      role,
      location: 'Pune Central',
      lat: BASE_LAT,
      lng: BASE_LNG,
    };
    setCurrentUser(matchingProfile);
  };

  const updateVolunteerProfile = (skills: VolunteerSkill[], availability: VolunteerStatus) => {
    setCurrentUser((prev) => ({
      ...prev,
      skills,
      availability,
    }));
  };

  // Emergency Reports Handlers
  const addEmergencyReport = (
    reportData: Omit<
      EmergencyReport,
      'id' | 'createdAt' | 'status' | 'reporterId' | 'reporterName' | 'communityConfirmations'
    >
  ) => {
    const isOffline = isEffectiveOffline;
    const newReport: EmergencyReport = {
      ...reportData,
      id: `rep_${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: isOffline ? 'PENDING SYNC' : 'PENDING',
      reporterId: currentUser.id,
      reporterName: currentUser.name || 'Anonymous Citizen',
      communityConfirmations: { confirmed: 1, unconfirmed: 0 },
    };

    setEmergencyReports((prev) => [newReport, ...prev]);

    if (isOffline) {
      enqueuePendingSync('EMERGENCY_REPORT', `SOS: ${newReport.type} at ${newReport.locationAddress}`);
    }

    // Broadcast live event for immediate volunteer and admin awareness
    addRealTimeEvent({
      type: 'SOS_REPORT',
      title: `Citizen Emergency SOS: ${newReport.type} (${newReport.severity})`,
      description: `${newReport.title} at ${newReport.locationAddress}. Citizen requires immediate responder assistance.`,
      locationName: newReport.locationAddress,
      lat: newReport.lat,
      lng: newReport.lng,
      severity: newReport.severity,
      icon: '🆘',
    });

    // Push notification (visible to both admin and volunteers)
    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: isOffline ? '📡 Saved Offline (Pending Sync)' : `🆘 New ${newReport.severity} SOS Report`,
      message: isOffline
        ? 'Emergency report saved offline and will sync when connection is restored.'
        : `${newReport.type} reported at ${newReport.locationAddress}. Open for volunteer response!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isOffline ? 'INFO' : 'ALERT',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newReport;
  };

  const verifyReport = (id: string) => {
    setEmergencyReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'VERIFIED' } : r))
    );
    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '✅ Report Verified',
      message: `Emergency report ID #${id} officially verified by command center.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const rejectReport = (id: string) => {
    setEmergencyReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
  };

  const resolveReport = (id: string) => {
    const rep = emergencyReports.find((r) => r.id === id);
    const assignedVolId = rep?.assignedVolunteerId;

    setEmergencyReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'RESOLVED' } : r))
    );

    // Free up the assigned volunteer if applicable and increment mission count
    if (assignedVolId) {
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === assignedVolId
            ? {
                ...v,
                availability: 'AVAILABLE',
                assignedIncidentId: undefined,
                assignedIncidentTitle: undefined,
                completedMissions: (v.completedMissions || 0) + 1,
                lastActive: 'Just now',
              }
            : v
        )
      );
    }

    addRealTimeEvent({
      type: 'CITIZEN_CONFIRMED',
      title: `Problem Solved: Emergency Resolved`,
      description: `Emergency #${id} (${rep?.title || 'Incident'}) has been marked SOLVED on site.`,
      locationName: rep?.locationAddress || 'Incident Area',
      lat: rep?.lat,
      lng: rep?.lng,
      severity: 'LOW',
      icon: '✅',
    });

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '✅ Problem Solved: Emergency Resolved',
      message: `Emergency #${id} (${rep?.title || 'Report'}) marked COMPLETED & SOLVED.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const reopenReport = (id: string) => {
    setEmergencyReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'PENDING' } : r))
    );
    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '🔄 Emergency Reopened',
      message: `Emergency report #${id} has been reopened for response.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const addCommunityConfirmation = (id: string, isConfirmed: boolean) => {
    setEmergencyReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            communityConfirmations: {
              confirmed: isConfirmed
                ? r.communityConfirmations.confirmed + 1
                : r.communityConfirmations.confirmed,
              unconfirmed: !isConfirmed
                ? r.communityConfirmations.unconfirmed + 1
                : r.communityConfirmations.unconfirmed,
            },
          };
        }
        return r;
      })
    );
  };

  // Help Requests Handlers
  const addHelpRequest = (
    reqData: Omit<
      HelpRequest,
      'id' | 'createdAt' | 'status' | 'citizenId' | 'citizenName' | 'timeline'
    >
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReq: HelpRequest = {
      ...reqData,
      id: `req_${Date.now().toString().slice(-4)}`,
      citizenId: currentUser.id,
      citizenName: currentUser.name || 'Citizen User',
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      timeline: [
        { stage: 'Request Created', timestamp: timeStr, note: 'Request submitted to SAHAAY network' },
      ],
    };

    setHelpRequests((prev) => [newReq, ...prev]);

    if (isEffectiveOffline) {
      enqueuePendingSync('HELP_REQUEST', `Help Need: ${newReq.needType} (${newReq.quantity}) at ${newReq.locationAddress}`);
    }

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '📦 New Relief Request',
      message: `${newReq.needType} request from ${newReq.citizenName}`,
      timestamp: timeStr,
      type: 'INFO',
      read: false,
      targetRole: 'admin',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newReq;
  };

  const updateRequestStatus = (id: string, status: ReportStatus, note?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHelpRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const updatedTimeline = [
            ...req.timeline,
            {
              stage:
                status === 'VERIFIED'
                  ? 'Verified'
                  : status === 'ASSIGNED'
                  ? 'Volunteer Assigned'
                  : status === 'IN_PROGRESS'
                  ? 'In Progress'
                  : status === 'RESOLVED'
                  ? 'Resolved'
                  : status,
              timestamp: timeStr,
              note: note || `Status updated to ${status}`,
            },
          ];
          return {
            ...req,
            status,
            timeline: updatedTimeline,
          };
        }
        return req;
      })
    );
  };

  // Volunteer Workflow ("I CAN HELP" -> Start -> Complete)
  const acceptVolunteerTask = (id: string, isReport = false) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const volName = currentUser.name || 'Volunteer Priya';

    if (isReport) {
      const targetReport = emergencyReports.find((r) => r.id === id);
      const repTitle = targetReport?.title || 'Emergency Incident';

      setEmergencyReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: 'ASSIGNED',
                assignedVolunteerId: currentUser.id,
                assignedVolunteerName: volName,
              }
            : r
        )
      );

      // Update volunteer profile availability and mission
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === currentUser.id
            ? {
                ...v,
                availability: 'ON_MISSION',
                assignedIncidentId: id,
                assignedIncidentTitle: repTitle,
                lastActive: 'Just now',
              }
            : v
        )
      );

      // Real time event
      addRealTimeEvent({
        type: 'VOLUNTEER_DISPATCH',
        title: `Volunteer Responding: ${volName}`,
        description: `Accepted citizen emergency: "${repTitle}". En route to provide urgent relief.`,
        locationName: targetReport?.locationAddress || 'Emergency Location',
        lat: targetReport?.lat,
        lng: targetReport?.lng,
        severity: targetReport?.severity || 'HIGH',
        icon: '🚑',
      });
    } else {
      setHelpRequests((prev) =>
        prev.map((req) => {
          if (req.id === id) {
            return {
              ...req,
              status: 'ASSIGNED',
              assignedVolunteerId: currentUser.id,
              assignedVolunteerName: volName,
              timeline: [
                ...req.timeline,
                {
                  stage: 'Volunteer Assigned',
                  timestamp: timeStr,
                  note: `Volunteer ${volName} accepted task and is preparing response`,
                },
              ],
            };
          }
          return req;
        })
      );
    }

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '🤝 Task Assigned',
      message: `${volName} accepted task #${id}`,
      timestamp: timeStr,
      type: 'TASK',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const startTask = (id: string, isReport = false) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const volName = currentUser.name || 'Volunteer Responder';

    if (isReport) {
      setEmergencyReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'IN_PROGRESS' } : r))
      );
      addRealTimeEvent({
        type: 'VOLUNTEER_ACTIVE',
        title: `Responder On Scene: ${volName}`,
        description: `Active rescue and relief operations underway for emergency #${id}.`,
        icon: '🚨',
      });
    } else {
      setHelpRequests((prev) =>
        prev.map((req) => {
          if (req.id === id) {
            return {
              ...req,
              status: 'IN_PROGRESS',
              timeline: [
                ...req.timeline,
                {
                  stage: 'In Progress',
                  timestamp: timeStr,
                  note: 'Volunteer is actively executing task on ground',
                },
              ],
            };
          }
          return req;
        })
      );
    }
  };

  const completeTask = (id: string, isReport = false) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const volName = currentUser.name || 'Volunteer Responder';

    if (isReport) {
      const rep = emergencyReports.find((r) => r.id === id);
      const repTitle = rep?.title || 'Emergency Incident';

      setEmergencyReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'RESOLVED' } : r))
      );

      // Free up volunteer back to AVAILABLE and increment missions
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === currentUser.id || v.id === rep?.assignedVolunteerId
            ? {
                ...v,
                availability: 'AVAILABLE',
                assignedIncidentId: undefined,
                assignedIncidentTitle: undefined,
                completedMissions: (v.completedMissions || 0) + 1,
                lastActive: 'Just now',
              }
            : v
        )
      );

      addRealTimeEvent({
        type: 'CITIZEN_CONFIRMED',
        title: `Problem Solved: ${repTitle}`,
        description: `Emergency successfully handled and resolved on ground by ${volName}.`,
        locationName: rep?.locationAddress,
        lat: rep?.lat,
        lng: rep?.lng,
        severity: 'LOW',
        icon: '✅',
      });
    } else {
      setHelpRequests((prev) =>
        prev.map((req) => {
          if (req.id === id) {
            return {
              ...req,
              status: 'RESOLVED',
              timeline: [
                ...req.timeline,
                {
                  stage: 'Resolved',
                  timestamp: timeStr,
                  note: 'Task completed successfully on site. Assistance provided.',
                },
              ],
            };
          }
          return req;
        })
      );
    }

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '✅ Problem Solved / Task Completed',
      message: `Incident #${id} has been marked COMPLETED and solved on ground.`,
      timestamp: timeStr,
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Shelter Handlers
  const updateShelterOccupancy = (id: string, newOccupancy: number) => {
    setShelters((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const cap = s.capacity;
          const capped = Math.min(Math.max(0, newOccupancy), cap);
          return {
            ...s,
            occupancy: capped,
            isOpen: capped < cap,
          };
        }
        return s;
      })
    );
  };

  const addShelter = (shelterData: Omit<Shelter, 'id'>): Shelter => {
    const newShelter: Shelter = {
      ...shelterData,
      id: `shl_${Date.now().toString().slice(-4)}`,
    };
    setShelters((prev) => [newShelter, ...prev]);

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '🏠 New Shelter Registered',
      message: `${newShelter.name} added with capacity of ${newShelter.capacity} spaces.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addRealTimeEvent({
      type: 'SHELTER_UPDATE',
      title: `New Shelter Registered: ${newShelter.name}`,
      description: `Capacity: ${newShelter.capacity} • Location: ${newShelter.locationAddress}`,
      locationName: newShelter.locationAddress,
      lat: newShelter.lat,
      lng: newShelter.lng,
    });

    return newShelter;
  };

  const bookShelter = (
    bookingData: Omit<ShelterBooking, 'id' | 'createdAt' | 'status' | 'qrPassCode'>
  ): ShelterBooking => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newBooking: ShelterBooking = {
      ...bookingData,
      id: `sb_${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      qrPassCode: `SAHAAY-SHL-${randomCode}-${Date.now().toString().slice(-4)}`,
    };

    setShelterBookings((prev) => [newBooking, ...prev]);

    // Automatically adjust shelter occupancy
    setShelters((prev) =>
      prev.map((s) => {
        if (s.id === bookingData.shelterId) {
          const newOcc = Math.min(s.capacity, s.occupancy + bookingData.headCount);
          return {
            ...s,
            occupancy: newOcc,
            isOpen: newOcc < s.capacity,
          };
        }
        return s;
      })
    );

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: '🏠 Shelter Reservation Confirmed',
      message: `${bookingData.headCount} space(s) reserved at ${bookingData.shelterName}. Pass: ${newBooking.qrPassCode}`,
      timestamp: timeStr,
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addRealTimeEvent({
      type: 'SHELTER_UPDATE',
      title: `Shelter Reserved: ${bookingData.shelterName}`,
      description: `${bookingData.citizenName} reserved space for ${bookingData.headCount} person(s)`,
      locationName: bookingData.shelterName,
    });

    return newBooking;
  };

  const cancelShelterBooking = (bookingId: string) => {
    const target = shelterBookings.find((b) => b.id === bookingId);
    if (!target) return;

    setShelterBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );

    setShelters((prev) =>
      prev.map((s) => {
        if (s.id === target.shelterId) {
          const newOcc = Math.max(0, s.occupancy - target.headCount);
          return {
            ...s,
            occupancy: newOcc,
            isOpen: true,
          };
        }
        return s;
      })
    );

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: 'Shelter Reservation Cancelled',
      message: `Reservation #${target.qrPassCode} has been cancelled.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'UPDATE',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const checkInShelterBooking = (bookingId: string) => {
    setShelterBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CHECKED_IN' } : b))
    );

    const target = shelterBookings.find((b) => b.id === bookingId);
    if (target) {
      addRealTimeEvent({
        type: 'CITIZEN_CONFIRMED',
        title: `Citizen Checked In: ${target.citizenName}`,
        description: `Verified check-in at ${target.shelterName} (${target.headCount} family members)`,
        locationName: target.shelterName,
      });
    }
  };

  // Disaster Alerts
  const createAlert = (
    alertData: Omit<DisasterAlert, 'id' | 'publishedAt' | 'active' | 'isDemo'>
  ) => {
    const newAlert: DisasterAlert = {
      ...alertData,
      id: `alt_${Date.now().toString().slice(-4)}`,
      publishedAt: new Date().toISOString(),
      active: true,
      isDemo: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: `🚨 ALERT: ${newAlert.title}`,
      message: newAlert.description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'ALERT',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Resources
  const updateResourceStock = (id: string, newQuantity: number) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          let status: 'AVAILABLE' | 'LOW_STOCK' | 'CRITICAL' = 'AVAILABLE';
          if (newQuantity <= 50) status = 'CRITICAL';
          else if (newQuantity <= 350) status = 'LOW_STOCK';
          return {
            ...r,
            quantity: newQuantity,
            status,
            lastUpdated: 'Just now',
          };
        }
        return r;
      })
    );
  };

  // Road Blocks
  const addRoadBlock = (blockData: Omit<RoadBlock, 'id' | 'reportedAt' | 'verified'>) => {
    const newBlock: RoadBlock = {
      ...blockData,
      id: `rb_${Date.now().toString().slice(-4)}`,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verified: true,
    };
    setRoadBlocks((prev) => [newBlock, ...prev]);
    if (isEffectiveOffline) {
      enqueuePendingSync('ROAD_BLOCK', `Road Block: ${newBlock.description} at ${newBlock.locationName}`);
    }
  };

  // Recovery Reports
  const addRecoveryReport = (
    recoveryData: Omit<RecoveryReport, 'id' | 'createdAt' | 'status'>
  ) => {
    const newRec: RecoveryReport = {
      ...recoveryData,
      id: `rec_${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    setRecoveryReports((prev) => [newRec, ...prev]);
    if (isEffectiveOffline) {
      enqueuePendingSync('RECOVERY_REPORT', `Recovery Assessment: ${newRec.category} at ${newRec.address}`);
    }
  };

  // Danger Zones
  const addDangerZone = (
    zoneData: Omit<DangerZone, 'id' | 'createdAt' | 'active'>
  ) => {
    const newZone: DangerZone = {
      ...zoneData,
      id: `dz_${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      active: true,
    };
    setDangerZones((prev) => [newZone, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_dz_${Date.now()}`,
        title: '⚠️ New Danger Zone Established',
        message: `${newZone.hazardType}: ${newZone.name} (Radius: ${newZone.radiusMeters}m)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'ALERT',
        read: false,
      },
      ...prev,
    ]);
  };

  const removeDangerZone = (id: string) => {
    setDangerZones((prev) => (prev || []).filter((z) => z.id !== id));
  };

  // Offline Mode Toggle
  const toggleOfflineMode = () => setOfflineMode((prev) => !prev);

  // Notification Management
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Volunteer Fleet Management Methods
  const addVolunteer = (volData: Omit<UserProfile, 'id' | 'role'>) => {
    const newVol: UserProfile = {
      ...volData,
      id: `usr_vol_${Date.now().toString().slice(-4)}`,
      role: 'volunteer',
      isOnline: true,
      lastActive: 'Just now',
      completedMissions: volData.completedMissions || 0,
      experienceYears: volData.experienceYears || 1,
      badge: volData.badge || 'Field Response Volunteer',
      lat: volData.lat || (BASE_LAT + (Math.random() - 0.5) * 0.04),
      lng: volData.lng || (BASE_LNG + (Math.random() - 0.5) * 0.04),
    };
    setVolunteers((prev) => [newVol, ...prev]);

    addRealTimeEvent({
      type: 'VOLUNTEER_DISPATCH',
      title: 'New Volunteer Deployed to Field',
      description: `${newVol.name} joined the active disaster response fleet (${newVol.skills?.slice(0, 2).join(', ') || 'General Relief'}).`,
      locationName: newVol.location || 'Central Command',
      lat: newVol.lat,
      lng: newVol.lng,
      severity: 'LOW',
      icon: '🛡️',
    });
  };

  const updateVolunteerStatus = (id: string, status: VolunteerStatus) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, availability: status, lastActive: 'Just now' } : v))
    );
  };

  const assignVolunteerToEmergency = (volunteerId: string, emergencyId: string, emergencyTitle: string) => {
    const vol = volunteers.find((v) => v.id === volunteerId);
    const volName = vol ? vol.name : 'Field Responder';

    // Update volunteer
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId
          ? {
              ...v,
              availability: 'ON_MISSION',
              assignedIncidentId: emergencyId,
              assignedIncidentTitle: emergencyTitle,
              lastActive: 'Just now',
            }
          : v
      )
    );

    // Update emergency report status
    setEmergencyReports((prev) =>
      prev.map((r) =>
        r.id === emergencyId
          ? {
              ...r,
              status: 'IN_PROGRESS',
              assignedVolunteerId: volunteerId,
              assignedVolunteerName: volName,
            }
          : r
      )
    );

    // Add real-time event
    addRealTimeEvent({
      type: 'VOLUNTEER_DISPATCH',
      title: `Field Unit Dispatched: ${volName}`,
      description: `Assigned to emergency: "${emergencyTitle}". Navigating to site with relief equipment.`,
      locationName: vol?.location || 'Disaster Sector',
      lat: vol?.lat,
      lng: vol?.lng,
      severity: 'HIGH',
      icon: '🚑',
    });

    // Add system notification
    setNotifications((prev) => [
      {
        id: `notif_disp_${Date.now()}`,
        title: '🚑 Volunteer Dispatched',
        message: `${volName} dispatched to "${emergencyTitle}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'ALERT',
        read: false,
      },
      ...prev,
    ]);
  };

  const unassignVolunteerFromEmergency = (emergencyId: string) => {
    const rep = emergencyReports.find((r) => r.id === emergencyId);
    const assignedVolId = rep?.assignedVolunteerId;

    if (assignedVolId) {
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === assignedVolId
            ? {
                ...v,
                availability: 'AVAILABLE',
                assignedIncidentId: undefined,
                assignedIncidentTitle: undefined,
                lastActive: 'Just now',
              }
            : v
        )
      );
    }

    setEmergencyReports((prev) =>
      prev.map((r) =>
        r.id === emergencyId
          ? {
              ...r,
              status: 'PENDING',
              assignedVolunteerId: undefined,
              assignedVolunteerName: undefined,
            }
          : r
      )
    );
  };

  // Real-Time Events Engine
  const addRealTimeEvent = (eventData: Omit<RealTimeFeedEvent, 'id' | 'timestamp'>) => {
    const newEvt: RealTimeFeedEvent = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    setRealTimeEvents((prev) => [newEvt, ...prev.slice(0, 30)]);
  };

  const toggleRealTimeLive = () => setIsRealTimeLive((prev) => !prev);

  const broadcastLiveAlert = (
    title: string,
    message: string,
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH'
  ) => {
    createAlert({
      title,
      disasterType: 'Flood',
      description: message,
      affectedArea: 'Entire District & Riverside Sectors',
      severity,
      safetyInstructions: [message, 'Coordinate with live volunteer units via SAHAAY interactive map.'],
    });

    addRealTimeEvent({
      type: 'HAZARD_ALERT',
      title: `BROADCAST: ${title}`,
      description: message,
      locationName: 'District Emergency Command',
      lat: BASE_LAT,
      lng: BASE_LNG,
      severity,
      icon: '🚨',
    });
  };

  const activeRespondersCount = (volunteers || []).filter(
    (v) => v.availability === 'AVAILABLE' || v.availability === 'ON_MISSION'
  ).length;

  // Real-Time Background Heartbeat (Simulates live GPS telemetry pings)
  useEffect(() => {
    if (!isRealTimeLive || isEffectiveOffline) return;

    const interval = setInterval(() => {
      // 1. Gently update coordinates of an active volunteer to simulate live movement
      setVolunteers((prev) => {
        if (!prev || prev.length === 0) return prev || [];
        const availableVols = (prev || []).filter((v) => v.availability === 'AVAILABLE' || v.availability === 'ON_MISSION');
        if (availableVols.length === 0) return prev;

        const target = availableVols[Math.floor(Math.random() * availableVols.length)];
        const deltaLat = (Math.random() - 0.5) * 0.0008;
        const deltaLng = (Math.random() - 0.5) * 0.0008;

        return prev.map((v) =>
          v.id === target.id
            ? {
                ...v,
                lat: (v.lat || BASE_LAT) + deltaLat,
                lng: (v.lng || BASE_LNG) + deltaLng,
                lastActive: 'Just now',
              }
            : v
        );
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [isRealTimeLive, isEffectiveOffline]);

  // Reset to original Demo Data
  const resetToDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setActiveRole('citizen');
    setCurrentUser(DEMO_PROFILES[0]);
    setEmergencyReports(DEMO_EMERGENCY_REPORTS);
    setHelpRequests(DEMO_HELP_REQUESTS);
    setShelters(DEMO_SHELTERS);
    setAlerts(DEMO_ALERTS);
    setResources(DEMO_RESOURCES);
    setRoadBlocks(DEMO_ROAD_BLOCKS);
    setRecoveryReports(DEMO_RECOVERY_REPORTS);
    setDangerZones(DEMO_DANGER_ZONES);
    setVolunteers(DEMO_PROFILES.filter((p) => p.role === 'volunteer'));
    setRealTimeEvents(DEMO_REALTIME_EVENTS);
    setUserLocation(null);
    setNotifications(DEMO_NOTIFICATIONS);
    setOfflineMode(false);
    setPendingSyncQueue([]);
    setSosIncidents(DEMO_SOS_INCIDENTS);
    setActiveSos(DEMO_SOS_INCIDENTS[0] || null);
    setVolunteerGroups(DEMO_VOLUNTEER_GROUPS);
    setVolunteerReports(DEMO_VOLUNTEER_REPORTS);
    setMediaVerifications(DEMO_VERIFICATIONS);
    setIncidentClusters(DEMO_INCIDENT_CLUSTERS);
    setAiAnalysis(DEMO_AI_ANALYSIS);
  };

  // ==========================================================================
  // GPS-POWERED SOS ENGINE
  // ==========================================================================
  const submitSos = useCallback(
    async (sosData: {
      disasterType: import('../types').EmergencyType;
      lat: number;
      lng: number;
      accuracyMeters: number;
      locationAddress: string;
      peopleCount: number;
      situationAnswers: Record<string, string | boolean | number>;
      severity?: import('../types').SeverityLevel;
      description?: string;
      photoUrl?: string;
      voiceNoteUrl?: string;
      voiceTranscript?: string;
      reporterPhone?: string;
      reporterName?: string;
    }) => {
      let calculatedSeverity: import('../types').SeverityLevel = sosData.severity || 'HIGH';
      let riskScore = 78;
      const factors: string[] = [];

      if (sosData.peopleCount >= 5) {
        calculatedSeverity = 'CRITICAL';
        riskScore += 12;
        factors.push(`Mass vulnerability (${sosData.peopleCount} individuals trapped)`);
      }
      const ansStr = JSON.stringify(sosData.situationAnswers || '').toLowerCase();
      if (ansStr.includes('waist') || ansStr.includes('neck') || ansStr.includes('submerged') || ansStr.includes('rising')) {
        calculatedSeverity = 'CRITICAL';
        riskScore += 10;
        factors.push('Submerged flood zone with rapid rise');
      }
      if (ansStr.includes('unconscious') || ansStr.includes('trauma') || ansStr.includes('cardiac') || ansStr.includes('collapse')) {
        calculatedSeverity = 'CRITICAL';
        riskScore += 12;
        factors.push('Life-threatening trauma or structural failure');
      }
      riskScore = Math.min(99, Math.max(55, riskScore));

      // Specialized squad matching based on disaster type
      const matchingGroup = volunteerGroups.find((g) => {
        if (sosData.disasterType === 'Flood') {
          return g.specialization?.includes('Flood') || g.specialization?.includes('Water');
        }
        if (sosData.disasterType === 'Medical Emergency') {
          return g.specialization?.includes('Medical') || g.specialization?.includes('Triage');
        }
        if (sosData.disasterType === 'Fire') {
          return g.specialization?.includes('Fire') || g.specialization?.includes('First Aid');
        }
        if (sosData.disasterType === 'Building Damage' || sosData.disasterType === 'Earthquake') {
          return g.specialization?.includes('Debris') || g.specialization?.includes('Structural');
        }
        return g.status === 'AVAILABLE';
      }) || volunteerGroups.find((g) => g.status === 'AVAILABLE') || volunteerGroups[0];

      const nearestShelter = shelters[0] || { name: 'District Emergency Center', lat: sosData.lat, lng: sosData.lng };

      const newSos: SosIncident = {
        id: `SOS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        disasterType: sosData.disasterType,
        lat: sosData.lat,
        lng: sosData.lng,
        accuracyMeters: sosData.accuracyMeters,
        locationAddress: sosData.locationAddress,
        timestamp: 'Just now',
        peopleCount: sosData.peopleCount,
        situationAnswers: sosData.situationAnswers,
        severity: calculatedSeverity,
        status: 'HELP_DISPATCHED',
        priority: calculatedSeverity,
        aiAssessment: {
          riskScore,
          priorityLevel: calculatedSeverity,
          factors: factors.length > 0 ? factors : ['Distress beacon triggered with high-accuracy live GPS telemetry'],
          recommendedAction: `Immediate priority dispatch of ${matchingGroup?.name || 'field response team'}.`,
          nearestShelterDistanceKm: 1.1,
          nearestShelterName: nearestShelter.name,
          assignedGroupId: matchingGroup?.id,
          assignedGroupName: matchingGroup?.name,
        },
        description: sosData.description,
        photoUrl: sosData.photoUrl,
        voiceNoteUrl: sosData.voiceNoteUrl,
        voiceTranscript: sosData.voiceTranscript,
        reporterPhone: sosData.reporterPhone || currentUser.phone || '+91 98220 11200',
        reporterName: sosData.reporterName || currentUser.name || 'Citizen SOS Beacon',
        verificationStage: 'VERIFIED',
      };

      // Try sending to server /api/sos in background
      try {
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          fetch('/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSos),
          }).catch((e) => console.warn('Could not post to /api/sos, fallback local:', e));
        }
      } catch (e) {}

      // Add to public Emergency Reports so maps and dashboards see it in real-time
      const syncReport: EmergencyReport = {
        id: `rep_${newSos.id}`,
        title: `[SOS DISTRESS] ${newSos.disasterType} at ${newSos.locationAddress}`,
        type: newSos.disasterType,
        description: newSos.description || `Immediate GPS beacon: ${newSos.peopleCount} citizens requiring priority extraction.`,
        locationAddress: newSos.locationAddress,
        lat: newSos.lat,
        lng: newSos.lng,
        accuracyMeters: newSos.accuracyMeters,
        severity: newSos.severity,
        affected: {
          total: newSos.peopleCount,
          children: 0,
          elderly: 0,
          specialAssistance: 0,
        },
        injuredCount: 0,
        photoUrl: newSos.photoUrl,
        reporterId: currentUser.id || 'usr_guest',
        reporterName: newSos.reporterName || 'Citizen SOS Beacon',
        reporterPhone: newSos.reporterPhone,
        createdAt: 'Just now',
        status: 'ASSIGNED',
        verificationStatus: 'VERIFIED',
        assignedGroupId: matchingGroup?.id,
        assignedGroupName: matchingGroup?.name,
        communityConfirmations: { confirmed: 1, unconfirmed: 0 },
      };

      // Mark the matching group as ASSIGNED to this incident
      if (matchingGroup) {
        setVolunteerGroups((prev) =>
          prev.map((grp) =>
            grp.id === matchingGroup.id
              ? {
                  ...grp,
                  status: 'ASSIGNED',
                  currentIncidentId: newSos.id,
                  currentIncidentTitle: `${newSos.disasterType} Emergency at ${newSos.locationAddress}`,
                }
              : grp
          )
        );
      }

      setSosIncidents((prev) => [newSos, ...prev]);
      setActiveSos(newSos);
      setEmergencyReports((prev) => [syncReport, ...prev]);

      setRealTimeEvents((prev) => [
        {
          id: `evt_sos_${Date.now()}`,
          timestamp: 'Just now',
          type: 'INCIDENT',
          title: `🚨 EMERGENCY SOS: ${newSos.disasterType}`,
          location: newSos.locationAddress,
          severity: newSos.severity,
          badgeText: 'LIVE SOS',
        },
        ...prev.slice(0, 30),
      ]);

      setNotifications((prev) => [
        {
          id: `notif_sos_${Date.now()}`,
          title: `🚨 SOS Beacon Broadcasted (${newSos.id})`,
          message: `Location: ${newSos.locationAddress}. Team ${matchingGroup?.name || 'Rapid Response'} alerted.`,
          timestamp: 'Just now',
          read: false,
          type: 'critical',
          priority: 'CRITICAL',
        },
        ...prev,
      ]);

      return newSos;
    },
    [currentUser, shelters, volunteerGroups]
  );

  const cancelSos = useCallback((sosId: string) => {
    setSosIncidents((prev) =>
      prev.map((s) =>
        s.id === sosId ? { ...s, status: 'CANCELLED' as SosStatus, isCancelled: true, cancelledAt: 'Just now' } : s
      )
    );
    setActiveSos((prev) => (prev?.id === sosId ? null : prev));
    setNotifications((prev) => [
      {
        id: `notif_cancel_${Date.now()}`,
        title: 'SOS Beacon Cancelled',
        message: 'Your distress beacon status has been cancelled by the user.',
        timestamp: 'Just now',
        read: false,
        type: 'info',
      },
      ...prev,
    ]);
  }, []);

  const updateSosStatus = useCallback(
    (sosId: string, status: SosStatus, assignedGroupId?: string, assignedGroupName?: string) => {
      setSosIncidents((prev) =>
        prev.map((s) => {
          if (s.id === sosId) {
            return {
              ...s,
              status,
              aiAssessment: {
                ...s.aiAssessment,
                assignedGroupId: assignedGroupId || s.aiAssessment.assignedGroupId,
                assignedGroupName: assignedGroupName || s.aiAssessment.assignedGroupName,
              },
            };
          }
          return s;
        })
      );
      setActiveSos((prev) => (prev?.id === sosId ? { ...prev, status } : prev));
    },
    []
  );

  // ==========================================================================
  // VOLUNTEER GROUP-BASED COORDINATION
  // ==========================================================================
  const userVolunteerGroup =
    volunteerGroups.find((g) => g.leaderId === currentUser.id || g.memberIds.includes(currentUser.id)) ||
    volunteerGroups[0] ||
    null;

  const createVolunteerGroup = useCallback(
    (group: Partial<VolunteerGroup>) => {
      const newGroup: VolunteerGroup = {
        id: `GRP-${String(volunteerGroups.length + 1).padStart(2, '0')}`,
        name: group.name || 'Rapid Response Taskforce',
        callsign: group.callsign || `TASKFORCE-${volunteerGroups.length + 1}`,
        specialization: group.specialization || 'Water & Flood Rescue',
        leaderId: group.leaderId || currentUser.id,
        leaderName: group.leaderName || currentUser.name,
        memberIds: group.memberIds || [currentUser.id],
        members: group.members || [
          {
            id: currentUser.id,
            name: currentUser.name,
            role: 'Leader / Captain',
            phone: currentUser.phone || '+91 98000 00000',
            skill: 'General Assistance',
          },
        ],
        currentLocation: group.currentLocation || {
          lat: BASE_LAT,
          lng: BASE_LNG,
          address: 'District Central Disaster Staging Post',
        },
        resources: group.resources || ['First-Aid Packs', 'High-Clearance Life Jackets', 'Search Flashlights'],
        vehicles: group.vehicles || ['Emergency 4x4 Utility'],
        status: 'AVAILABLE',
        rescueCapabilityRating: 92,
        lastStatusUpdate: 'Just now',
      };
      setVolunteerGroups((prev) => [newGroup, ...prev]);
    },
    [currentUser, volunteerGroups.length]
  );

  const assignGroupMission = useCallback(
    (groupId: string, mission: VolunteerGroupMission) => {
      setVolunteerGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              assignedMission: mission,
              assignedIncidentId: mission.assignedIncidentId,
              assignedIncidentTitle: mission.title,
              status: 'ASSIGNED' as VolunteerGroupStatus,
              lastStatusUpdate: 'Just now',
            };
          }
          return g;
        })
      );
      if (mission.assignedIncidentId) {
        updateSosStatus(mission.assignedIncidentId, 'RESPONSE_ASSIGNED', groupId);
      }
    },
    [updateSosStatus]
  );

  const updateGroupStatus = useCallback((groupId: string, status: VolunteerGroupStatus) => {
    setVolunteerGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, status, lastStatusUpdate: 'Just now' } : g))
    );
  }, []);

  const submitVolunteerReport = useCallback((report: Omit<VolunteerFieldReport, 'id' | 'timestamp'>) => {
    const newReport: VolunteerFieldReport = {
      ...report,
      id: `vfr_${Date.now()}`,
      timestamp: 'Just now',
    };
    setVolunteerReports((prev) => [newReport, ...prev]);
  }, []);

  // ==========================================================================
  // DEEPFAKE & MEDIA VERIFICATION
  // ==========================================================================
  const verifyMedia = useCallback((id: string, newStatus: VerificationStatus, notes?: string) => {
    setMediaVerifications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              verificationStatus: newStatus,
              adminOverridden: true,
              adminNotes: notes || `Status updated to ${newStatus} by Disaster Operations Command.`,
            }
          : m
      )
    );
  }, []);

  const analyzeUploadedMedia = useCallback(
    async (data: {
      title: string;
      disaster: import('../types').EmergencyType;
      location: string;
      mediaUrl: string;
      source: 'Citizen SOS' | 'Social Media Feed' | 'Volunteer Upload' | 'Civil Defense Camera';
    }): Promise<DisasterMediaVerification> => {
      const lower = data.title.toLowerCase();
      const isDubious = lower.includes('dam collapse') || lower.includes('viral') || lower.includes('fake');
      const newVer: DisasterMediaVerification = {
        id: `VER-${Date.now().toString().slice(-4)}`,
        incidentTitle: data.title,
        mediaUrl: data.mediaUrl,
        mediaType: 'image',
        reportedDisaster: data.disaster,
        reportedLocation: data.location,
        reportedLat: BASE_LAT + (Math.random() - 0.5) * 0.02,
        reportedLng: BASE_LNG + (Math.random() - 0.5) * 0.02,
        timestamp: 'Just now',
        source: data.source,
        verificationStatus: isDubious ? 'POTENTIALLY_MANIPULATED' : 'LIKELY_AUTHENTIC',
        confidenceScore: isDubious ? 92 : 89,
        aiAnalysisSummary: isDubious
          ? 'Cross-check against archive repositories flagged previous disaster footage recycled with synthetic overlay.'
          : 'Metadata integrity verified. Physics-based wave flow and local weather telemetry match sensor arrays.',
        detectedAnomalies: isDubious
          ? ['Visual fingerprint matches older archived disaster event', 'EXIF location stripped during re-upload']
          : ['Natural shadow orientation aligns with sun position', 'Sensor optical noise adheres to CMOS sensor standards'],
        evidenceUsed: [
          'IMD Rainfall radar telemetry correlation',
          'Reverse image perceptual hash comparison',
          'Ground volunteer confirmation check within 1km',
        ],
        exifMetadata: {
          cameraModel: 'Smartphone Camera Sensor',
          dateTimeOriginal: new Date().toISOString().replace('T', ' ').slice(0, 19),
          softwareTamperingDetected: isDubious,
          gpsMatch: true,
        },
        crossCheckResults: {
          weatherConsistency: !isDubious,
          nearbyReportConsistency: true,
          reverseImageArchiveMatch: isDubious,
        },
        adminOverridden: false,
      };
      setMediaVerifications((prev) => [newVer, ...prev]);
      return newVer;
    },
    []
  );

  // ==========================================================================
  // INCIDENT CLUSTERS & AI ANALYSIS
  // ==========================================================================
  const confirmIncidentCluster = useCallback((clusterId: string, confirmed: boolean) => {
    setIncidentClusters((prev) =>
      prev.map((c) => (c.id === clusterId ? { ...c, isConfirmedByAdmin: confirmed } : c))
    );
  }, []);

  const refreshAiAnalysis = useCallback(async () => {
    const totalAff =
      emergencyReports.reduce((acc, r) => acc + (r.affected?.total || 1), 0) +
      sosIncidents.reduce((acc, s) => acc + s.peopleCount, 0);

    setAiAnalysis((prev) => ({
      ...prev,
      lastEvaluatedAt: 'Just now',
      affectedCensus: {
        ...prev.affectedCensus,
        totalAffected: totalAff,
      },
    }));
  }, [emergencyReports, sosIncidents]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        updateVolunteerProfile,
        volunteers,
        addVolunteer,
        updateVolunteerStatus,
        assignVolunteerToEmergency,
        activeRespondersCount,
        realTimeEvents,
        addRealTimeEvent,
        isRealTimeLive,
        toggleRealTimeLive,
        broadcastLiveAlert,
        emergencyReports,
        addEmergencyReport,
        verifyReport,
        rejectReport,
        resolveReport,
        reopenReport,
        unassignVolunteerFromEmergency,
        addCommunityConfirmation,
        helpRequests,
        addHelpRequest,
        updateRequestStatus,
        acceptVolunteerTask,
        startTask,
        completeTask,
        shelters,
        shelterBookings,
        updateShelterOccupancy,
        addShelter,
        bookShelter,
        cancelShelterBooking,
        checkInShelterBooking,
        reliefCenters: DEMO_RELIEF_CENTERS,
        alerts,
        createAlert,
        resources,
        updateResourceStock,
        roadBlocks,
        addRoadBlock,
        recoveryReports,
        addRecoveryReport,
        dangerZones,
        addDangerZone,
        removeDangerZone,
        userLocation,
        userLocationAddress,
        userLocationAccuracy,
        setUserLocation,
        setManualLocation,
        offlineMode,
        toggleOfflineMode,
        isNetworkOnline,
        isEffectiveOffline,
        pendingSyncQueue,
        syncPendingQueue,
        clearSyncQueue,
        notifications,
        markNotificationRead,
        clearNotifications,
        isAuthenticated,
        login,
        selectVolunteerProfile,
        logout,
        requestLiveLocation,
        gpsStatus,
        isAdminVerified,
        verifyAdminPasscode,
        logoutAdmin,
        resetToDemoData,
        isDbConnected,
        capAlerts,
        activeCapAlerts: (capAlerts || []).filter((a) => a.status === 'ACTIVE'),
        activeSimulationAlert,
        fetchCapAlerts,
        createCapAlert,
        updateCapAlertStatus,
        triggerSimulation,
        dismissSimulationAlerts,
        weatherData,
        isLoadingWeather,
        fetchWeather,
        emergencyContacts,
        fetchEmergencyContacts,
        updateContactPrivacy,
        alertAnalytics,
        fetchAlertAnalytics,

        // New Upgraded Feature Exports
        sosIncidents,
        sosRequests: sosIncidents,
        activeSos,
        submitSos,
        cancelSos,
        updateSosStatus,
        volunteerGroups,
        userVolunteerGroup,
        createVolunteerGroup,
        assignGroupMission,
        updateGroupStatus,
        volunteerReports,
        submitVolunteerReport,
        mediaVerifications,
        verifyMedia,
        analyzeUploadedMedia,
        incidentClusters,
        confirmIncidentCluster,
        aiAnalysis,
        refreshAiAnalysis,
        isEmergencySosModalOpen,
        openEmergencySosModal,
        closeEmergencySosModal,
        isVoiceModeOpen,
        openVoiceMode,
        closeVoiceMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
