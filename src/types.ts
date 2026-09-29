export type UserRole = 'citizen' | 'volunteer' | 'admin' | 'guest';

export type EmergencyType =
  | 'Flood'
  | 'Fire'
  | 'Earthquake'
  | 'Landslide'
  | 'Cyclone'
  | 'Industrial Accident'
  | 'Electrical Hazard'
  | 'Road Block'
  | 'Medical Emergency'
  | 'Building Damage'
  | 'Missing Person'
  | 'Other';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ReportStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'PENDING SYNC'
  | 'SYNCED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type RequestNeedType =
  | 'Food'
  | 'Water'
  | 'Medicine'
  | 'Shelter'
  | 'Clothing'
  | 'Transportation'
  | 'Medical Assistance'
  | 'Baby Care'
  | 'Elderly Care'
  | 'Power & Lighting'
  | 'Search & Rescue'
  | 'Animal Rescue'
  | 'Other';

export type VolunteerStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'ON_MISSION';

export type VolunteerSkill =
  | 'First Aid'
  | 'Food Distribution'
  | 'Water Distribution'
  | 'Transportation'
  | 'Search Support'
  | 'Communication'
  | 'General Assistance'
  | 'Medical Emergency'
  | 'Boat Rescue'
  | 'Debris Clearing'
  | 'Drone Recon';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location?: string;
  lat?: number;
  lng?: number;
  skills?: VolunteerSkill[];
  availability?: VolunteerStatus;
  avatarUrl?: string;
  badge?: string;
  experienceYears?: number;
  completedMissions?: number;
  assignedIncidentId?: string;
  assignedIncidentTitle?: string;
  lastActive?: string;
  isOnline?: boolean;
}

export interface RealTimeFeedEvent {
  id: string;
  type:
    | 'SOS_REPORT'
    | 'VOLUNTEER_DISPATCH'
    | 'VOLUNTEER_ACTIVE'
    | 'SHELTER_UPDATE'
    | 'HAZARD_ALERT'
    | 'CITIZEN_CONFIRMED'
    | 'SUPPLY_RESTOCK';
  title: string;
  description: string;
  timestamp: string;
  locationName?: string;
  lat?: number;
  lng?: number;
  severity?: SeverityLevel;
  icon?: string;
}

export interface AffectedPeople {
  total: number;
  children: number;
  elderly: number;
  specialAssistance: number;
}

export interface EmergencyReport {
  id: string;
  title: string;
  type: EmergencyType;
  description: string;
  locationAddress: string;
  lat: number;
  lng: number;
  accuracyMeters?: number;
  severity: SeverityLevel;
  affected: AffectedPeople;
  injuredCount?: number;
  missingCount?: number;
  infrastructureDamage?: {
    roadsBlocked: boolean;
    waterAvailable: 'Yes' | 'No' | 'Contaminated';
    electricityAvailable: 'Operational' | 'Outage' | 'Live Wire Hazard';
    medicalNeed: boolean;
    foodNeed: boolean;
    shelterNeed: boolean;
  };
  photoUrl?: string;
  videoUrl?: string;
  voiceNoteText?: string;
  reporterId: string;
  reporterName: string;
  reporterPhone?: string;
  createdAt: string;
  status: ReportStatus;
  verificationStatus?: 'VERIFIED' | 'LIKELY_AUTHENTIC' | 'NEEDS_VERIFICATION' | 'POTENTIALLY_MANIPULATED' | 'INSUFFICIENT_DATA';
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedGroupId?: string;
  assignedGroupName?: string;
  relatedIncidentIds?: string[];
  communityConfirmations: {
    confirmed: number;
    unconfirmed: number;
  };
}

export interface HelpRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  needType: RequestNeedType;
  quantity: string;
  locationAddress: string;
  lat: number;
  lng: number;
  description: string;
  urgency: SeverityLevel;
  status: ReportStatus;
  createdAt: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  timeline: {
    stage: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface Shelter {
  id: string;
  name: string;
  locationAddress: string;
  lat: number;
  lng: number;
  capacity: number;
  occupancy: number;
  foodAvailable: boolean;
  waterAvailable: boolean;
  medicalSupportAvailable: boolean;
  isOpen: boolean;
  contactNumber: string;
  distanceKm?: number;
  shelterType?: 'Government Relief Camp' | 'Community Hall' | 'School Facility' | 'Religious Center' | 'Private/NGO Center';
  rulesAndAmenities?: string[];
}

export interface ShelterBooking {
  id: string;
  shelterId: string;
  shelterName: string;
  citizenId: string;
  citizenName: string;
  phone: string;
  headCount: number;
  adultsCount: number;
  childrenCount: number;
  elderlyCount: number;
  specialNeeds?: string;
  emergencyContact?: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
  qrPassCode: string;
  notes?: string;
}

export interface ReliefCenter {
  id: string;
  name: string;
  locationAddress: string;
  lat: number;
  lng: number;
  inventoryTypes: string[];
  contactPerson: string;
  phone: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  disasterType: EmergencyType;
  description: string;
  affectedArea: string;
  severity: SeverityLevel;
  safetyInstructions: string[];
  publishedAt: string;
  active: boolean;
  isDemo: boolean;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Food' | 'Water' | 'Medicines' | 'Blankets' | 'Clothes' | 'First Aid';
  quantity: number;
  unit: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'CRITICAL';
  lastUpdated: string;
}

export interface RoadBlock {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
  blockType: 'Flooded road' | 'Damaged bridge' | 'Fallen tree' | 'Debris' | 'Other blockage';
  description: string;
  reportedAt: string;
  verified: boolean;
}

export interface RecoveryReport {
  id: string;
  citizenName: string;
  category: 'House Damage' | 'Road Damage' | 'Electricity Issue' | 'Water Issue' | 'Infrastructure';
  address: string;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'ALERT' | 'UPDATE' | 'TASK' | 'INFO';
  read: boolean;
  targetRole?: UserRole;
}

export interface DangerZone {
  id: string;
  name: string;
  hazardType: 'Flood Zone' | 'Heavy Rainfall' | 'Landslide Risk' | 'Fire Zone' | 'Evacuation Zone';
  severity: SeverityLevel;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  description: string;
  active: boolean;
  createdAt: string;
}

// ============================================================================
// SAHAAY CAP-COMPATIBLE EMERGENCY ALERT ECOSYSTEM & WEATHER INTELLIGENCE TYPES
// ============================================================================

export type CapStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'UPDATED' | 'EXPIRED' | 'CANCELLED';
export type CapMsgType = 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error';
export type CapScope = 'Public' | 'Restricted' | 'Private';
export type CapUrgency = 'IMMEDIATE' | 'EXPECTED' | 'FUTURE' | 'PAST' | 'UNKNOWN';
export type CapSeverity = 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'MINOR' | 'UNKNOWN';
export type CapCertainty = 'OBSERVED' | 'LIKELY' | 'POSSIBLE' | 'UNLIKELY' | 'UNKNOWN';
export type CapCategory =
  | 'Met'
  | 'Geo'
  | 'Safety'
  | 'Rescue'
  | 'Fire'
  | 'Health'
  | 'Env'
  | 'Transport'
  | 'Infra'
  | 'CBRNE'
  | 'Other';

export type CapResponseType =
  | 'Shelter'
  | 'Evacuate'
  | 'Prepare'
  | 'Execute'
  | 'Avoid'
  | 'Monitor'
  | 'Assess'
  | 'None';

export interface CapAlertArea {
  areaDesc: string;
  polygon?: [number, number][]; // Array of [lat, lng] coordinates
  circle?: {
    centerLat: number;
    centerLng: number;
    radiusKm: number;
  };
  geocode?: string;
}

export interface CapAlert {
  id: string;
  identifier: string; // e.g., "CAP-IN-SAHAAY-2026-0042"
  sender: string; // Authority email / identifier
  senderName: string; // Human-readable authority
  sent: string; // ISO 8601 timestamp
  status: CapStatus;
  msgType: CapMsgType;
  source: string; // e.g. "SAHAAY State Disaster Control Room", "IMD"
  scope: CapScope;
  restriction?: string;
  addresses?: string;
  code?: string[];
  note?: string;
  references?: string;

  // CAP Info segment
  language: string; // "en-IN" | "hi-IN" | "mr-IN"
  category: CapCategory;
  event: EmergencyType | string;
  responseType: CapResponseType;
  urgency: CapUrgency;
  severity: CapSeverity;
  certainty: CapCertainty;
  effective: string;
  onset?: string;
  expires: string;
  headline: string;
  description: string;
  instruction: string;
  web?: string;
  contact?: string;

  // CAP Area segment
  area: CapAlertArea;

  // SAHAAY Operational Metadata
  isSimulation: boolean;
  version: number;
  supersededBy?: string;
  recipientsCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  nearestShelterId?: string;
  distanceFromUserKm?: number;
}

// Weather Risk Engine Types
export type WeatherRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface WeatherRiskItem {
  hazard: string;
  riskLevel: WeatherRiskLevel;
  reason: string;
  timestamp: string;
  forecastPeriod: string;
  recommendedAction: string;
  icon?: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  pop: number; // Probability of precipitation %
  rainMm: number;
  windSpeed: number;
  condition: string;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  condition: string;
  uvIndex: number;
}

export interface WeatherConditionData {
  locationName: string;
  lat: number;
  lng: number;
  dataSource: string;
  lastUpdated: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  cloudCover: number;
  rainProbability: number;
  rainfallAmount: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  condition: string;
  conditionIcon: string;
  tempMax?: number;
  tempMin?: number;
  isDay?: boolean;
  windGusts?: number;
  hourlyForecast: HourlyForecastItem[];
  dailyForecast: DailyForecastItem[];
  overallRiskLevel: WeatherRiskLevel;
  risks: WeatherRiskItem[];
  isOfficialWarningPresent: boolean;
  officialWarnings: {
    title: string;
    source: string;
    severity: string;
    issuedAt: string;
    headline?: string;
  }[];
}

export interface EmergencyContactRecord {
  id: string;
  name: string;
  phone: string; // Indian mobile number format: +91XXXXXXXXXX
  registrationStatus: 'VERIFIED' | 'PENDING' | 'GUEST';
  emergencyAlertOptIn: boolean;
  weatherAlertOptIn: boolean;
  criticalAlertOptIn: boolean;
  locationSharingPermission: boolean;
  notificationPermission: boolean;
  lastActive: string;
  alertEligibility: 'ELIGIBLE' | 'LOCATION_DISABLED' | 'OPTED_OUT' | 'UNVERIFIED';
  approxDistanceKm?: number;
  insideCurrentZone?: boolean;
}

export interface AlertAnalyticsData {
  activeAlerts: number;
  totalAlerts: number;
  criticalAlerts: number;
  usersInAffectedZones: number;
  notificationsSent: number;
  notificationsDelivered: number;
  notificationsOpened: number;
  smsSent: number;
  sheltersActivated: number;
  respondersNotified: number;
}

export interface CapAuditLog {
  id: string;
  adminName: string;
  action: 'CREATE' | 'UPDATE' | 'PUBLISH' | 'EXPIRE' | 'CANCEL' | 'SIMULATE' | 'DUPLICATE';
  alertId: string;
  timestamp: string;
  oldStatus?: string;
  newStatus?: string;
  details: string;
}

// ============================================================================
// GPS SOS & EMERGENCY INCIDENT TYPES
// ============================================================================

export type SosStatus = 'SOS_SENT' | 'RESPONSE_ASSIGNED' | 'HELP_DISPATCHED' | 'RESOLVED' | 'CANCELLED';

export interface SosIncident {
  id: string; // e.g. "SOS-1042"
  disasterType: EmergencyType;
  lat: number;
  lng: number;
  accuracyMeters: number;
  locationAddress: string;
  timestamp: string;
  peopleCount: number;
  situationAnswers: Record<string, string | boolean | number>;
  severity: SeverityLevel;
  status: SosStatus;
  priority: SeverityLevel;
  aiAssessment: {
    riskScore: number; // 0 - 100
    priorityLevel: SeverityLevel;
    factors: string[];
    correlatedIncidents?: string[];
    recommendedAction: string;
    nearestShelterDistanceKm?: number;
    nearestShelterName?: string;
    assignedGroupId?: string;
    assignedGroupName?: string;
  };
  voiceNoteUrl?: string;
  voiceTranscript?: string;
  photoUrl?: string;
  description?: string;
  reporterPhone?: string;
  reporterName?: string;
  isAnonymous?: boolean;
  verificationStage: 'UNVERIFIED' | 'UNDER_VERIFICATION' | 'VERIFIED' | 'NOT_CONFIRMED';
  isCancelled?: boolean;
  cancelledAt?: string;
}

export type SosRequest = SosIncident;

// ============================================================================
// VOLUNTEER GROUP-BASED COORDINATION TYPES
// ============================================================================

export type VolunteerGroupStatus = 'AVAILABLE' | 'ASSIGNED' | 'ON_THE_WAY' | 'ACTIVE' | 'COMPLETED';

export interface VolunteerGroupMember {
  id: string;
  name: string;
  role: 'Leader / Captain' | 'Triage Paramedic' | 'Rescue Driver' | 'Boat Operator' | 'Drone Specialist' | 'Field Responder';
  phone: string;
  skill: VolunteerSkill;
  avatarUrl?: string;
}

export interface VolunteerGroupMission {
  id: string;
  title: string;
  objective: string;
  targetAddress: string;
  targetLat: number;
  targetLng: number;
  priority: SeverityLevel;
  instructions: string[];
  etaMinutes: number;
  assignedIncidentId?: string;
  assignedAt: string;
}

export interface VolunteerGroup {
  id: string; // e.g. "GRP-01"
  name: string; // e.g. "Flood Rescue Team Alpha"
  callsign: string;
  specialization: 'Water & Flood Rescue' | 'Medical Rapid Response' | 'Debris & Structural Search' | 'Logistics & Evacuation' | 'Drone & Aerial Recon';
  leaderId: string;
  leaderName: string;
  memberIds: string[];
  members: VolunteerGroupMember[];
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedIncidentId?: string;
  assignedIncidentTitle?: string;
  assignedMission?: VolunteerGroupMission;
  resources: string[];
  vehicles: string[];
  status: VolunteerGroupStatus;
  rescueCapabilityRating: number; // e.g. 95%
  lastStatusUpdate: string;
}

export interface VolunteerFieldReport {
  id: string;
  groupId: string;
  groupName: string;
  reporterId: string;
  reporterName: string;
  lat: number;
  lng: number;
  locationAddress: string;
  availableVolunteersCount: number;
  availableVehicles: string[];
  availableEquipment: string[];
  medicalSuppliesStatus: 'Adequate' | 'Low' | 'Depleted';
  foodWaterRationsCount: number;
  rescueCapabilityStatus: 'Operational' | 'Limited' | 'Compromised';
  currentTaskDescription: string;
  taskStatus: VolunteerGroupStatus;
  timestamp: string;
}

// ============================================================================
// DEEPFAKE & DISASTER VERIFICATION TYPES ("Deepfake Disaster Locator")
// ============================================================================

export type VerificationStatus =
  | 'VERIFIED'
  | 'LIKELY_AUTHENTIC'
  | 'NEEDS_VERIFICATION'
  | 'POTENTIALLY_MANIPULATED'
  | 'INSUFFICIENT_DATA';

export interface DisasterMediaVerification {
  id: string;
  incidentId?: string;
  incidentTitle: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  reportedDisaster: EmergencyType;
  reportedLocation: string;
  reportedLat: number;
  reportedLng: number;
  timestamp: string;
  source: 'Citizen SOS' | 'Social Media Feed' | 'Volunteer Upload' | 'Civil Defense Camera';
  verificationStatus: VerificationStatus;
  confidenceScore: number; // 0 - 100%
  aiAnalysisSummary: string;
  detectedAnomalies: string[];
  evidenceUsed: string[];
  exifMetadata?: {
    cameraModel?: string;
    dateTimeOriginal?: string;
    softwareTamperingDetected?: boolean;
    gpsMatch?: boolean;
  };
  crossCheckResults: {
    weatherConsistency: boolean;
    nearbyReportConsistency: boolean;
    reverseImageArchiveMatch: boolean;
  };
  adminOverridden: boolean;
  adminNotes?: string;
}

// ============================================================================
// AI DATA ANALYSIS & INCIDENT CLUSTERING
// ============================================================================

export interface IncidentCluster {
  id: string;
  title: string;
  disasterType: EmergencyType;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  incidentIds: string[];
  totalAffected: number;
  severity: SeverityLevel;
  suggestedAction: string;
  isConfirmedByAdmin: boolean;
  createdAt: string;
}

export interface AiDisasterAnalysisResult {
  disasterSeverityIndex: number; // 0 - 100
  analysisSummary: string;
  affectedCensus: {
    totalAffected: number;
    criticalCasualties: number;
    missingReported: number;
    displacedInShelters: number;
  };
  highRiskHotspots: {
    areaName: string;
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    incidentCount: number;
    primaryHazard: string;
    centerLat: number;
    centerLng: number;
  }[];
  shelterPressure: {
    totalCapacity: number;
    currentOccupancy: number;
    utilizationPercent: number;
    overloadedShelters: string[];
  };
  resourceDeficits: {
    item: string;
    currentStock: number;
    requiredEstimate: number;
    urgency: SeverityLevel;
  }[];
  priorityQueue: {
    incidentId: string;
    title: string;
    reason: string;
    priority: SeverityLevel;
    suggestedGroup: string;
  }[];
  incidentClusters: IncidentCluster[];
  lastEvaluatedAt: string;
}

// ============================================================================
// HACKMATRIX 5.0: AI/ML DISASTER WARNINGS, ROAD ACCESSIBILITY & DECISION REPLAY
// ============================================================================

export interface DisasterRiskFactors {
  rainfallMmHr: number;               // 0 - 200 mm/hr
  riverGaugeMeters: number;           // -1 to 8 meters above danger mark
  soilSaturationPercent: number;      // 0 - 100%
  drainageBlockagePercent: number;    // 0 - 100%
  elevationSlopeDeltaM: number;       // 0 - 50 meters
  upstreamDamDischargeCusecs: number; // 0 - 100,000 cusecs
  windGustKmh: number;                // 0 - 160 km/h
}

export type RiskCategoryLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_SEVERE';

export interface FeatureWeightAttribution {
  name: string;
  key: keyof DisasterRiskFactors;
  impactPercent: number;
  direction: 'INCREASES_RISK' | 'DECREASES_RISK';
  description: string;
}

export interface DisasterRiskPredictionResult {
  probabilityScore: number; // 0 - 100%
  riskCategory: RiskCategoryLevel;
  confidenceInterval: [number, number]; // [lower, upper]
  featureWeights: FeatureWeightAttribution[];
  earlyActionDirectives: string[];
  computedAt: string;
}

export interface MlModelEvaluationMetrics {
  modelName: string;
  modelType: string;
  datasetName: string;
  sampleCount: number;
  accuracy: number;     // e.g. 0.954 (95.4%)
  precision: number;    // e.g. 0.938
  recall: number;       // e.g. 0.965
  f1Score: number;      // e.g. 0.951
  rocAuc: number;       // e.g. 0.982
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  featuresUsed: string[];
}

export type RoadAccessibilityStatus =
  | 'PASSABLE'
  | 'WATERLOGGED_CAUTION'
  | 'SUBMERGED_BLOCKED'
  | 'LANDSLIDE_DEBRIS';

export interface RoadSegment {
  id: string;
  name: string;
  arterialType: 'HIGHWAY' | 'BRIDGE' | 'MAIN_ARTERIAL' | 'CONNECTING_ROAD' | 'UNDERPASS';
  fromLocation: string;
  toLocation: string;
  status: RoadAccessibilityStatus;
  waterDepthCm: number;
  speedLimitKmh: number;
  recommendedVehicles: string;
  isDesignatedEvacuationCorridor: boolean;
  lastReportedTime: string;
  reportedBy: string;
  coordinates: { lat: number; lng: number }[];
  bypassRecommendation: string;
}

export interface SafeEvacuationCorridor {
  id: string;
  name: string;
  origin: string;
  destinationShelterId: string;
  destinationShelterName: string;
  totalDistanceKm: number;
  estimatedTravelMinutes: number;
  safetyRatingPercent: number; // 0 - 100%
  avoidedRoadCount: number;
  clearanceLevel: 'CLEAR_OPTIMAL' | 'MODERATE_CAUTION' | 'CONGESTED';
  elevationAdvantageMeters: number;
  waypoints: {
    step: number;
    instruction: string;
    status: 'CLEAR' | 'CAUTION';
    lat: number;
    lng: number;
  }[];
}

export interface DecisionReplayTimelineStep {
  stepNumber: number;
  timeLabel: string; // e.g. "T - 02:00", "T + 01:30"
  minuteOffset: number; // minutes from zero
  phase: 'PRE_DISASTER' | 'ONSET_CRITICAL' | 'PEAK_SURGE' | 'EVACUATION_COORDINATION' | 'POST_STABILIZATION';
  rainfallMmHr: number;
  riverGaugeMeters: number;
  soilSaturationPercent: number;
  predictedRiskPercent: number;
  riskCategory: RiskCategoryLevel;
  capAlertState: {
    headline: string;
    severity: string;
    broadcasted: boolean;
  } | null;
  activeCitizenSosCount: number;
  verifiedIncidentsCount: number;
  assignedVolunteerSquads: string[];
  roadClosureCount: number;
  closedRoadNames: string[];
  activeEvacuationRoute: string;
  evacuatedCitizenCount: number;
  narrativeAction: string;
  tacticalDecisionNote: string;
}

export interface DecisionReplayScenario {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  overview: string;
  primaryHazard: string;
  steps: DecisionReplayTimelineStep[];
  postMortem: {
    detectionLeadTimeMinutes: number;
    evacuatedBeforePeakPercent: number;
    preventedTrappingsCount: number;
    tacticalSummary: string;
    keyTakeaway: string;
  };
}

// ============================================================================
// NASHIK FLOOD OPERATIONAL DECISION-SUPPORT TYPES
// ============================================================================

export type OperationalDataMode = 'LIVE' | 'REPLAY' | 'SIMULATION';

export type PriorityCategory = 'P1_IMMEDIATE' | 'P2_HIGH' | 'P3_MONITOR';

export interface SettlementRiskProfile {
  id: string;
  name: string;
  taluka: string;
  population: number;
  elevationMeters: number;
  distanceToRiverbedM: number;
  historicalVulnerabilityScore: number; // 0 - 20
  rainfallMmHr: number;
  rainfallAccumulation6hMm: number;
  waterLevelMetersAboveNormal: number;
  soilSaturationPercent: number;
  citizenReportsCount: number;
  verifiedReportsCount: number;
  roadDisruptionsCount: number;
  trappedPeopleCount: number;
  shelterCount: number;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidenceScore: number; // 0 - 100
  confidenceStrength: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceFreshnessMinutes: number;
  evidenceBreakdown: {
    rainfallContribution: number;        // 0 - 40
    terrainContribution: number;         // 0 - 20
    groundReportsContribution: number;   // 0 - 20
    historicalAndWaterLevel: number;     // 0 - 20
  };
  explainableObservations: string[];
  responsePriorityScore: number; // 0 - 100
  responsePriorityLevel: PriorityCategory;
  priorityReasons: string[];
  coordinates: { lat: number; lng: number };
  lastEvaluatedAt: string;
}

export interface NashikRoadStatus {
  id: string;
  name: string;
  arterialType: 'EXPRESSWAY' | 'BRIDGE' | 'MAIN_ARTERIAL' | 'CONNECTING_ROAD' | 'GHAT_ROAD';
  status: 'OPEN' | 'UNCERTAIN' | 'BLOCKED';
  reason: string;
  waterDepthCm: number;
  speedLimitKmh: number;
  lastUpdated: string;
  evidenceCount: number;
  confidencePercent: number;
  source: string;
  bypassRecommendation: string;
  fromLocation: string;
  toLocation: string;
  coordinates: { lat: number; lng: number }[];
}

export interface RouteValidityCheckResult {
  routeId: string;
  origin: string;
  destination: string;
  plannedViaRoads: string[];
  isValid: boolean;
  invalidationReason?: string;
  blockedRoadName?: string;
  blockedAtTimestamp?: string;
  alternativeRoute?: {
    routeName: string;
    viaRoads: string[];
    totalDistanceKm: number;
    estimatedMinutes: number;
    deltaMinutes: number;
    routeValidityConfidence: number;
    safetyRatingPercent: number;
    clearanceStatus: 'SAFE_OPTIMAL' | 'CAUTION';
  };
}

export interface FalseAlertTestResult {
  inundationThresholdMmHr: number;
  noiseLevel: 'LOW' | 'MEDIUM' | 'HEAVY_RUMOR_SURGE';
  totalEvaluatedAlerts: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  precisionPercent: number;
  recallPercent: number;
  falseAlertRatePercent: number;
  noiseRejectionPercent: number;
  leadTimeAdvanceMinutes: number;
}




