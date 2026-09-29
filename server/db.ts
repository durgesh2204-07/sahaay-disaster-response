// In-memory Database Store for SAHAAY Disaster Response Server
// Provides thread-safe, fast state persistence for all REST API endpoints

export interface ServerEmergencyReport {
  id: string;
  title: string;
  type: string;
  description: string;
  locationAddress: string;
  lat: number;
  lng: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affected: {
    total: number;
    children: number;
    elderly: number;
    specialAssistance: number;
  };
  photoUrl?: string;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  status: 'PENDING' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  communityConfirmations: {
    confirmed: number;
    unconfirmed: number;
  };
}

export interface ServerShelter {
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
  shelterType: string;
  rulesAndAmenities: string[];
}

export interface ServerShelterBooking {
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
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
  qrPassCode: string;
}

export interface ServerResource {
  id: string;
  name: string;
  category: 'Food' | 'Water' | 'Medicines' | 'Blankets' | 'Clothes' | 'First Aid';
  quantity: number;
  unit: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'CRITICAL';
  lastUpdated: string;
}

export interface ServerVolunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'volunteer';
  location: string;
  lat: number;
  lng: number;
  skills: string[];
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'ON_MISSION';
  badge: string;
  experienceYears: number;
  completedMissions: number;
  assignedIncidentId?: string;
  assignedIncidentTitle?: string;
  lastActive: string;
  isOnline: boolean;
}

export interface ServerAlert {
  id: string;
  title: string;
  disasterType: string;
  description: string;
  affectedArea: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  safetyInstructions: string[];
  publishedAt: string;
  active: boolean;
}

export interface ServerHelpRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  needType: string;
  quantity: string;
  locationAddress: string;
  lat: number;
  lng: number;
  description: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
}

export interface ServerAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface ServerCapAlert {
  id: string;
  identifier: string; // "CAP-IN-SAHAAY-2026-0041"
  sender: string;
  senderName: string;
  sent: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'UPDATED' | 'EXPIRED' | 'CANCELLED';
  msgType: 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error';
  source: string;
  scope: 'Public' | 'Restricted' | 'Private';
  restriction?: string;
  addresses?: string;
  code?: string[];
  note?: string;
  references?: string;

  language: string;
  category: string;
  event: string;
  responseType: string;
  urgency: string;
  severity: string;
  certainty: string;
  effective: string;
  onset?: string;
  expires: string;
  headline: string;
  description: string;
  instruction: string;
  web?: string;
  contact?: string;

  area: {
    areaDesc: string;
    polygon?: [number, number][];
    circle?: {
      centerLat: number;
      centerLng: number;
      radiusKm: number;
    };
    geocode?: string;
  };

  isSimulation: boolean;
  version: number;
  supersededBy?: string;
  recipientsCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  nearestShelterId?: string;
}

export interface ServerEmergencyContact {
  id: string;
  name: string;
  phone: string; // "+919822012345"
  registrationStatus: 'VERIFIED' | 'PENDING' | 'GUEST';
  emergencyAlertOptIn: boolean;
  weatherAlertOptIn: boolean;
  criticalAlertOptIn: boolean;
  locationSharingPermission: boolean;
  notificationPermission: boolean;
  lastActive: string;
  alertEligibility: 'ELIGIBLE' | 'LOCATION_DISABLED' | 'OPTED_OUT' | 'UNVERIFIED';
  lat?: number;
  lng?: number;
}

// Initial Database Seed Data
const initialReports: ServerEmergencyReport[] = [
  {
    id: 'ER-2026-001',
    title: 'Severe Flood Inundation & Trapped Families',
    type: 'Flood',
    description: 'Ground floor submerged under 4.5 feet of fast-moving floodwater. 8 family members including 2 infants waiting on the second-floor terrace.',
    locationAddress: 'Shivaji Road, Kasba Peth, Pune, Maharashtra 411001',
    lat: 18.5195,
    lng: 73.8553,
    severity: 'CRITICAL',
    affected: { total: 8, children: 2, elderly: 2, specialAssistance: 1 },
    reporterId: 'usr_cit_1',
    reporterName: 'Anil Deshpande',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    assignedVolunteerId: 'usr_vol_2',
    assignedVolunteerName: 'Vikram Jadhav',
    communityConfirmations: { confirmed: 24, unconfirmed: 1 },
  },
  {
    id: 'ER-2026-002',
    title: 'Hillside Mudslide Blocking Main Arterial Road',
    type: 'Landslide',
    description: 'Mud and boulders have slid across Sinhagad Ghat Road. Multiple vehicles stranded on uphill road.',
    locationAddress: 'Sinhagad Ghat Road, Haveli Taluka, Pune, Maharashtra 411025',
    lat: 18.3663,
    lng: 73.7558,
    severity: 'HIGH',
    affected: { total: 22, children: 4, elderly: 5, specialAssistance: 0 },
    reporterId: 'usr_cit_2',
    reporterName: 'Suresh Patil',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    status: 'VERIFIED',
    communityConfirmations: { confirmed: 19, unconfirmed: 0 },
  },
  {
    id: 'ER-2026-003',
    title: 'Electrical Transformer Fire Near Dense Residential Complex',
    type: 'Fire',
    description: 'Electrical transformer caught fire during storm. Thick smoke engulfing adjacent apartment wings.',
    locationAddress: 'Paud Road, Kothrud, Pune, Maharashtra 411038',
    lat: 18.5074,
    lng: 73.8077,
    severity: 'HIGH',
    affected: { total: 45, children: 12, elderly: 8, specialAssistance: 2 },
    reporterId: 'usr_cit_3',
    reporterName: 'Meera Kulkarni',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    status: 'VERIFIED',
    communityConfirmations: { confirmed: 31, unconfirmed: 2 },
  },
  {
    id: 'ER-2026-004',
    title: 'Emergency Dialysis Patient Evacuation Needed',
    type: 'Medical Emergency',
    description: 'Elderly patient with scheduled dialysis trapped by localized waterlogging. Ambulances unable to navigate flooded lane.',
    locationAddress: 'FC Road, Shivajinagar, Pune, Maharashtra 411005',
    lat: 18.5314,
    lng: 73.8446,
    severity: 'CRITICAL',
    affected: { total: 1, children: 0, elderly: 1, specialAssistance: 1 },
    reporterId: 'usr_cit_4',
    reporterName: 'Dr. Rahul Joshi',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    assignedVolunteerId: 'usr_vol_1',
    assignedVolunteerName: 'Priya Deshmukh',
    communityConfirmations: { confirmed: 15, unconfirmed: 0 },
  },
];

const initialShelters: ServerShelter[] = [
  {
    id: 'shl_101',
    name: 'Balewadi Sports Complex Relief Camp',
    locationAddress: 'Balewadi Stadium Road, Mahalunge, Pune, Maharashtra 411045',
    lat: 18.5739,
    lng: 73.7663,
    capacity: 650,
    occupancy: 290,
    foodAvailable: true,
    waterAvailable: true,
    medicalSupportAvailable: true,
    isOpen: true,
    contactNumber: '+91 20 2737 4000',
    shelterType: 'Government Relief Camp',
    rulesAndAmenities: [
      '24/7 Dedicated Paramedic Desk',
      'Hot Meals & Purified RO Water',
      'Infant Care & Baby Food Station',
      'Separate Safe Dormitories for Women & Families',
      'Emergency Mobile Charging Kiosks',
    ],
  },
  {
    id: 'shl_102',
    name: 'Shivajinagar Community Relief Center',
    locationAddress: 'Near Sancheti Hospital, Shivajinagar, Pune, Maharashtra 411005',
    lat: 18.5308,
    lng: 73.8474,
    capacity: 350,
    occupancy: 185,
    foodAvailable: true,
    waterAvailable: true,
    medicalSupportAvailable: true,
    isOpen: true,
    contactNumber: '+91 20 2553 1234',
    shelterType: 'Community Hall',
    rulesAndAmenities: [
      'Doctor on Premise',
      'Clean Bedding & Fresh Blankets',
      'Emergency Sanitation Kits',
      'Child Safe Play Corner',
    ],
  },
  {
    id: 'shl_103',
    name: 'Kothrud City School Emergency Safe Zone',
    locationAddress: 'Karve Road, Kothrud, Pune, Maharashtra 411038',
    lat: 18.5029,
    lng: 73.8142,
    capacity: 400,
    occupancy: 110,
    foodAvailable: true,
    waterAvailable: true,
    medicalSupportAvailable: false,
    isOpen: true,
    contactNumber: '+91 20 2544 5678',
    shelterType: 'School Facility',
    rulesAndAmenities: [
      'Secure High-Ground Elevation',
      'Drinking Water Supply',
      'First-Aid Supplies Available',
    ],
  },
  {
    id: 'shl_104',
    name: 'Viman Nagar Airfield Relief Center',
    locationAddress: 'Symbiosis Road, Viman Nagar, Pune, Maharashtra 411014',
    lat: 18.5679,
    lng: 73.9143,
    capacity: 500,
    occupancy: 75,
    foodAvailable: true,
    waterAvailable: true,
    medicalSupportAvailable: true,
    isOpen: true,
    contactNumber: '+91 20 2663 8900',
    shelterType: 'Government Relief Camp',
    rulesAndAmenities: [
      'Helicopter Landing Pad for Evacuations',
      'Full Medical Triage Unit',
      'Heavy Ration Storage',
    ],
  },
];

const initialResources: ServerResource[] = [
  {
    id: 'res_001',
    name: 'Standard Family Ration Kits (15-Day Food Supply)',
    category: 'Food',
    quantity: 1450,
    unit: 'kits',
    status: 'AVAILABLE',
    lastUpdated: '10m ago',
  },
  {
    id: 'res_002',
    name: 'Purified Drinking Water (20-Liter Cans)',
    category: 'Water',
    quantity: 2800,
    unit: 'cans',
    status: 'AVAILABLE',
    lastUpdated: '15m ago',
  },
  {
    id: 'res_003',
    name: 'Emergency Trauma & First Aid Triage Kits',
    category: 'First Aid',
    quantity: 420,
    unit: 'kits',
    status: 'AVAILABLE',
    lastUpdated: '25m ago',
  },
  {
    id: 'res_004',
    name: 'Thermal Blankets & Ground Tarpaulins',
    category: 'Blankets',
    quantity: 850,
    unit: 'pieces',
    status: 'LOW_STOCK',
    lastUpdated: '1h ago',
  },
  {
    id: 'res_005',
    name: 'Essential Pediatric & Adult Prescription Medicines',
    category: 'Medicines',
    quantity: 310,
    unit: 'packs',
    status: 'CRITICAL',
    lastUpdated: '30m ago',
  },
];

const initialVolunteers: ServerVolunteer[] = [
  {
    id: 'usr_vol_1',
    name: 'Priya Deshmukh',
    email: 'priya.vol@sahaay.org',
    phone: '+91 94220 88990',
    role: 'volunteer',
    location: 'Deccan Gymkhana, Pune',
    lat: 18.5173,
    lng: 73.8415,
    skills: ['First Aid', 'Food Distribution', 'Transportation'],
    availability: 'ON_MISSION',
    badge: 'Medical Lead Responder',
    experienceYears: 4,
    completedMissions: 39,
    assignedIncidentId: 'ER-2026-004',
    assignedIncidentTitle: 'Dialysis Patient Evacuation',
    lastActive: 'Just now',
    isOnline: true,
  },
  {
    id: 'usr_vol_2',
    name: 'Vikram Jadhav',
    email: 'vikram.vol@sahaay.org',
    phone: '+91 98901 44332',
    role: 'volunteer',
    location: 'Kothrud Central, Pune',
    lat: 18.5054,
    lng: 73.8123,
    skills: ['Search Support', 'Water Distribution', 'Boat Rescue'],
    availability: 'ON_MISSION',
    badge: 'Senior Rescue Coordinator',
    experienceYears: 6,
    completedMissions: 53,
    assignedIncidentId: 'ER-2026-001',
    assignedIncidentTitle: 'Kasba Peth Flood Evacuation',
    lastActive: '2m ago',
    isOnline: true,
  },
  {
    id: 'usr_vol_3',
    name: 'Neha Kulkarni',
    email: 'neha.vol@sahaay.org',
    phone: '+91 97654 22119',
    role: 'volunteer',
    location: 'Shivajinagar, Pune',
    lat: 18.5308,
    lng: 73.8474,
    skills: ['First Aid', 'Communication', 'Food Distribution'],
    availability: 'AVAILABLE',
    badge: 'Logistics Field Officer',
    experienceYears: 3,
    completedMissions: 27,
    lastActive: '5m ago',
    isOnline: true,
  },
  {
    id: 'usr_vol_4',
    name: 'Rohan Shinde',
    email: 'rohan.vol@sahaay.org',
    phone: '+91 91234 56789',
    role: 'volunteer',
    location: 'Hadapsar Relief Hub, Pune',
    lat: 18.5089,
    lng: 73.9259,
    skills: ['Debris Clearing', 'Transportation', 'Drone Recon'],
    availability: 'AVAILABLE',
    badge: 'Disaster Recon Specialist',
    experienceYears: 5,
    completedMissions: 41,
    lastActive: '1m ago',
    isOnline: true,
  },
];

const initialAlerts: ServerAlert[] = [
  {
    id: 'alt_001',
    title: 'RED ALERT: Mutha River Spilling Inundation Warning',
    disasterType: 'Flood',
    description: 'Khadakwasla Dam discharge escalated to 35,000 cusecs due to torrential catchment rainfall. Low-lying riverside localities must evacuate to designated relief camps immediately.',
    affectedArea: 'Sinhagad Road, Kasba Peth, Deccan, Pulachi Wadi, Bund Garden',
    severity: 'CRITICAL',
    safetyInstructions: [
      'Turn off main electricity breakers before floodwaters touch sockets',
      'Move all elders and young children to elevated relief camps immediately',
      'Do not attempt to drive through submerged roads or causeways',
      'Keep drinking water in sealed bottles and boil before consumption',
    ],
    publishedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    active: true,
  },
  {
    id: 'alt_002',
    title: 'Ghat Landslide & Flash Flooding Precaution',
    disasterType: 'Landslide',
    description: 'Heavy continuous rainfall has saturated soil across Western Ghats. Sinhagad and Bhor ghat routes temporarily closed for public transit.',
    affectedArea: 'Western Ghats, Sinhagad Foot, Bhor Section',
    severity: 'HIGH',
    safetyInstructions: [
      'Avoid non-emergency travel along cliff roads',
      'Stay tuned to SAHAAY real-time road closure updates',
      'Report any signs of hillside mud creep to 1077',
    ],
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    active: true,
  },
];

const initialHelpRequests: ServerHelpRequest[] = [
  {
    id: 'req_001',
    citizenId: 'usr_cit_1',
    citizenName: 'Sunita Gaikwad',
    needType: 'Food & Clean Water',
    quantity: 'Family of 5 (3 adults, 2 kids)',
    locationAddress: 'Lane 4, Mangalwar Peth, Pune',
    lat: 18.5222,
    lng: 73.8645,
    description: 'Tap water contaminated with silt. Require 2 days drinking water and dry ration kit.',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    assignedVolunteerId: 'usr_vol_3',
    assignedVolunteerName: 'Neha Kulkarni',
  },
  {
    id: 'req_002',
    citizenId: 'usr_cit_2',
    citizenName: 'Mahesh Thorat',
    needType: 'Medicines',
    quantity: 'Insulin and hypertension tablets',
    locationAddress: 'Bawdhan Phata, Kothrud, Pune',
    lat: 18.5142,
    lng: 73.7845,
    description: 'Grandmother needs urgent insulin doses, local pharmacy flooded.',
    urgency: 'CRITICAL',
    status: 'ASSIGNED',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    assignedVolunteerId: 'usr_vol_1',
    assignedVolunteerName: 'Priya Deshmukh',
  },
];

const initialBookings: ServerShelterBooking[] = [
  {
    id: 'BKG-2026-001',
    shelterId: 'shl_101',
    shelterName: 'Balewadi Sports Complex Relief Camp',
    citizenId: 'usr_cit_1',
    citizenName: 'Anil Deshpande',
    phone: '+91 98220 12345',
    headCount: 4,
    adultsCount: 2,
    childrenCount: 2,
    elderlyCount: 0,
    specialNeeds: 'Infant formula required',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    qrPassCode: 'SAHAAY-PASS-BW892',
  },
];

const initialCapAlerts: ServerCapAlert[] = [
  {
    id: 'cap_alt_001',
    identifier: 'CAP-IN-SAHAAY-2026-0041',
    sender: 'sahaay-eoc@disaster.gov.in',
    senderName: 'State Disaster Management Authority (SDMA) & Pune Control Room',
    sent: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    msgType: 'Alert',
    source: 'SAHAAY State Disaster Control Room & IMD Radar Inundation Warning',
    scope: 'Public',
    language: 'en-IN',
    category: 'Met',
    event: 'Flood',
    responseType: 'Evacuate',
    urgency: 'IMMEDIATE',
    severity: 'CRITICAL',
    certainty: 'OBSERVED',
    effective: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    expires: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    headline: 'Critical Flash Flood & Severe River Overflow Inundation Alert',
    description: 'Rapid catchment water discharge from Khadakwasla Dam exceeding 45,000 cusecs has submerged ground floors along Mula-Mutha riverbed basin. Low-lying residential pockets at Shivaji Bridge, Kasba Peth, and Pulachi Wadi are experiencing rapid water level surge.',
    instruction: 'Immediately evacuate ground floors to higher stories or relocate to Balewadi Relief Camp or Shivajinagar Relief Hall. Do not walk or drive through flowing water. Disconnect electrical mains.',
    area: {
      areaDesc: 'Pune Metropolitan Mula-Mutha River Basin (Kasba Peth, Shivajinagar, Deccan)',
      circle: {
        centerLat: 18.5204,
        centerLng: 73.8567,
        radiusKm: 6.0,
      },
    },
    isSimulation: false,
    version: 1,
    recipientsCount: 428,
    deliveredCount: 412,
    openedCount: 389,
    nearestShelterId: 'shl_101',
  },
  {
    id: 'cap_alt_002',
    identifier: 'CAP-IN-SAHAAY-2026-0040',
    sender: 'sahaay-eoc@disaster.gov.in',
    senderName: 'District Disaster Management Authority (DDMA)',
    sent: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    msgType: 'Alert',
    source: 'Geological Survey of India & SAHAAY Ground Sensor Net',
    scope: 'Public',
    language: 'en-IN',
    category: 'Geo',
    event: 'Landslide',
    responseType: 'Avoid',
    urgency: 'EXPECTED',
    severity: 'SEVERE',
    certainty: 'LIKELY',
    effective: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    expires: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    headline: 'Severe Landslide & Mudfall Threat along Sinhagad Ghat Corridor',
    description: 'Heavy precipitation has oversaturated upper soil stratum resulting in unstable hillside slopes along Sinhagad Ghat Road. Multiple rock falls reported.',
    instruction: 'All vehicular transit along Sinhagad Ghat corridor is strictly prohibited. Avoid hillside parking and vulnerable mountain trails.',
    area: {
      areaDesc: 'Sinhagad Foothills & Ghat Access Pass Road Corridor',
      circle: {
        centerLat: 18.3663,
        centerLng: 73.7558,
        radiusKm: 4.5,
      },
    },
    isSimulation: false,
    version: 1,
    recipientsCount: 165,
    deliveredCount: 158,
    openedCount: 142,
    nearestShelterId: 'shl_103',
  },
  {
    id: 'cap_alt_003',
    identifier: 'CAP-IN-SAHAAY-2026-0039',
    sender: 'sahaay-eoc@disaster.gov.in',
    senderName: 'Meteorological Warning Bureau (IMD Advisory Relay)',
    sent: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    msgType: 'Alert',
    source: 'Doppler Radar Network Pune',
    scope: 'Public',
    language: 'en-IN',
    category: 'Met',
    event: 'Heavy Rain',
    responseType: 'Shelter',
    urgency: 'EXPECTED',
    severity: 'MODERATE',
    certainty: 'LIKELY',
    effective: new Date(Date.now() - 185 * 60 * 1000).toISOString(),
    expires: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    headline: 'Severe Convective Thunderstorm & High Lightning Risk Warning',
    description: 'Active squall line and cumulonimbus cell moving northeast across Pune and Pimpri-Chinchwad with gusts up to 55 km/h and frequent cloud-to-ground lightning.',
    instruction: 'Stay indoors away from metallic fixtures, tall trees, and open terraces. Unplug delicate electronics until squall passes.',
    area: {
      areaDesc: 'District-wide Meteorological Warning Corridor',
      circle: {
        centerLat: 18.5204,
        centerLng: 73.8567,
        radiusKm: 15.0,
      },
    },
    isSimulation: false,
    version: 1,
    recipientsCount: 890,
    deliveredCount: 875,
    openedCount: 792,
  },
];

const initialEmergencyContacts: ServerEmergencyContact[] = [
  {
    id: 'ct_01',
    name: 'Anil Deshpande',
    phone: '+919822012345',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: true,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: true,
    lastActive: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    alertEligibility: 'ELIGIBLE',
    lat: 18.5195,
    lng: 73.8553,
  },
  {
    id: 'ct_02',
    name: 'Meera Kulkarni',
    phone: '+919423456789',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: true,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: true,
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    alertEligibility: 'ELIGIBLE',
    lat: 18.5074,
    lng: 73.8077,
  },
  {
    id: 'ct_03',
    name: 'Suresh Patil',
    phone: '+919850112233',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: false,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: true,
    lastActive: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    alertEligibility: 'ELIGIBLE',
    lat: 18.3663,
    lng: 73.7558,
  },
  {
    id: 'ct_04',
    name: 'Dr. Rahul Joshi',
    phone: '+919765432100',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: true,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: true,
    lastActive: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    alertEligibility: 'ELIGIBLE',
    lat: 18.5314,
    lng: 73.8446,
  },
  {
    id: 'ct_05',
    name: 'Rohan Shinde',
    phone: '+919823998877',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: true,
    criticalAlertOptIn: true,
    locationSharingPermission: false, // Location disabled by user
    notificationPermission: true,
    lastActive: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    alertEligibility: 'LOCATION_DISABLED',
  },
  {
    id: 'ct_06',
    name: 'Sunita Gaikwad',
    phone: '+919145667788',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: true,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: true,
    lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    alertEligibility: 'ELIGIBLE',
    lat: 18.528,
    lng: 73.85,
  },
  {
    id: 'ct_07',
    name: 'Amitabh Sen',
    phone: '+919830112244',
    registrationStatus: 'VERIFIED',
    emergencyAlertOptIn: false, // Opted out of general alerts
    weatherAlertOptIn: false,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: true,
    lastActive: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    alertEligibility: 'OPTED_OUT',
    lat: 18.54,
    lng: 73.83,
  },
  {
    id: 'ct_08',
    name: 'Kavita Nair',
    phone: '+919847113355',
    registrationStatus: 'PENDING',
    emergencyAlertOptIn: true,
    weatherAlertOptIn: true,
    criticalAlertOptIn: true,
    locationSharingPermission: true,
    notificationPermission: false,
    lastActive: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    alertEligibility: 'UNVERIFIED',
    lat: 18.515,
    lng: 73.86,
  },
];

const initialAuditLogs: ServerAuditLog[] = [
  {
    id: 'log_1',
    action: 'SERVER_BOOT',
    entity: 'SYSTEM',
    entityId: 'srv_0',
    details: 'SAHAAY Express API server initialized with high-availability disaster response modules.',
    timestamp: new Date().toISOString(),
  },
];

// In-Memory Database Store Class
class DatabaseStore {
  private reports: ServerEmergencyReport[] = [...initialReports];
  private shelters: ServerShelter[] = [...initialShelters];
  private resources: ServerResource[] = [...initialResources];
  private volunteers: ServerVolunteer[] = [...initialVolunteers];
  private alerts: ServerAlert[] = [...initialAlerts];
  private capAlerts: ServerCapAlert[] = [...initialCapAlerts];
  private emergencyContacts: ServerEmergencyContact[] = [...initialEmergencyContacts];
  private helpRequests: ServerHelpRequest[] = [...initialHelpRequests];
  private bookings: ServerShelterBooking[] = [...initialBookings];
  private auditLogs: ServerAuditLog[] = [...initialAuditLogs];
  private sosIncidents: any[] = [
    {
      id: 'SOS-2026-1042',
      disasterType: 'Flood',
      lat: 18.5284,
      lng: 73.8507,
      accuracyMeters: 8,
      locationAddress: 'Mutha Riverbank Lane 3, Shivajinagar, Pune',
      timestamp: '10 mins ago',
      peopleCount: 8,
      situationAnswers: {
        waterLevel: 'Rising above waist (1.4m)',
        peopleTrapped: 'YES - 2 elderly, 1 infant',
        evacuationUrgent: true,
      },
      severity: 'CRITICAL',
      status: 'RESPONSE_ASSIGNED',
      priority: 'CRITICAL',
      aiAssessment: {
        riskScore: 94,
        priorityLevel: 'CRITICAL',
        factors: ['High casualty vulnerability', 'Water level rising at 15cm/hour'],
        recommendedAction: 'Dispatch Inflatable Boat Team Alpha immediately.',
        nearestShelterName: 'Shivajinagar Relief Community Camp',
        assignedGroupId: 'GRP-01',
        assignedGroupName: 'Flood Rescue Team Alpha',
      },
      description: 'Ground floor submerged completely. 8 family members on terrace with battery fading.',
      reporterPhone: '+91 98220 91823',
      reporterName: 'Sanjay Deshmukh',
      verificationStage: 'VERIFIED',
    },
    {
      id: 'SOS-2026-1045',
      disasterType: 'Building Damage',
      lat: 18.5084,
      lng: 73.8717,
      accuracyMeters: 14,
      locationAddress: 'Old Bazaar Sector 4, Kasba Peth, Pune',
      timestamp: '22 mins ago',
      peopleCount: 5,
      situationAnswers: { structureCollapse: 'Partial outer wall collapse', anyoneTrapped: 'YES - 2 persons' },
      severity: 'HIGH',
      status: 'HELP_DISPATCHED',
      priority: 'HIGH',
      aiAssessment: {
        riskScore: 82,
        priorityLevel: 'HIGH',
        factors: ['Structural instability confirmed near historic masonry zone'],
        recommendedAction: 'Deploy Hydraulic Spreader team and structural shoring equipment.',
        assignedGroupId: 'GRP-03',
        assignedGroupName: 'Structural Collapse & Heavy Rescue Team',
      },
      reporterPhone: '+91 91580 44219',
      reporterName: 'Pooja Joshi',
      verificationStage: 'VERIFIED',
    }
  ];
  private volunteerGroups: any[] = [
    {
      id: 'GRP-01',
      name: 'Flood Rescue Team Alpha',
      callsign: 'ALPHA-RESCUE-1',
      specialization: 'Water & Flood Rescue',
      leaderName: 'Rahul More',
      memberIds: ['usr_vol_4', 'usr_vol_1', 'usr_vol_2'],
      members: [
        { id: 'usr_vol_4', name: 'Rahul More', role: 'Leader / Captain', phone: '+91 98221 55678', skill: 'Boat Rescue' },
        { id: 'usr_vol_1', name: 'Amit Deshmukh', role: 'Field Responder', phone: '+91 98220 12345', skill: 'Search Support' }
      ],
      currentLocation: { lat: 18.5274, lng: 73.8517, address: 'Mutha Riverbank Staging Point, Pune' },
      assignedIncidentId: 'SOS-2026-1042',
      assignedIncidentTitle: 'Mutha Riverbank Flooding - 8 Citizens Trapped',
      resources: ['2 Inflatable Zodiac Rescue Boats', '8 Heavy PFD Life Vests'],
      vehicles: ['Heavy 4x4 Rescue Vehicle'],
      status: 'ACTIVE',
      rescueCapabilityRating: 98,
      lastStatusUpdate: '2 mins ago',
    },
    {
      id: 'GRP-02',
      name: 'Medical Rapid Response Unit 1',
      callsign: 'MEDIC-ONE',
      specialization: 'Medical Rapid Response',
      leaderName: 'Neha Kulkarni',
      memberIds: ['usr_vol_3', 'usr_vol_6'],
      members: [
        { id: 'usr_vol_3', name: 'Neha Kulkarni', role: 'Leader / Captain', phone: '+91 91580 77665', skill: 'Medical Emergency' }
      ],
      currentLocation: { lat: 18.5364, lng: 73.8767, address: 'Koregaon Park Road Sector 2' },
      resources: ['Automated Defibrillator (AED)', 'High-Flow Oxygen Cylinders'],
      vehicles: ['ALS Paramedic Ambulance'],
      status: 'AVAILABLE',
      rescueCapabilityRating: 95,
      lastStatusUpdate: 'Just now',
    }
  ];
  private verifications: any[] = [
    {
      id: 'VER-2026-001',
      incidentTitle: 'Mutha River Overtopping Lane 3',
      mediaUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      reportedDisaster: 'Flood',
      reportedLocation: 'Mutha Riverbank, Pune',
      timestamp: '15 mins ago',
      source: 'Citizen SOS',
      verificationStatus: 'VERIFIED',
      confidenceScore: 96,
      aiAnalysisSummary: 'Consistent lighting angle, authentic camera EXIF metadata, rain aligns with radar.',
      detectedAnomalies: ['None detected: Natural water physics match real flooding.'],
      evidenceUsed: ['EXIF timestamp confirmed', 'IMD Weather radar cross-check passed'],
      adminOverridden: false,
    },
    {
      id: 'VER-2026-002',
      incidentTitle: 'Viral Video Claiming Dam Collapse at Khadakwasla',
      mediaUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      reportedDisaster: 'Flood',
      reportedLocation: 'Khadakwasla Spillway, Pune',
      timestamp: '45 mins ago',
      source: 'Social Media Feed',
      verificationStatus: 'POTENTIALLY_MANIPULATED',
      confidenceScore: 92,
      aiAnalysisSummary: 'Severe geographic and temporal mismatch. Image is a recycled 2018 flood photo from another state.',
      detectedAnomalies: ['Visual archive match: Exact image found in August 2018 repository'],
      evidenceUsed: ['Perceptual hash match against 2018 historical news archive'],
      adminOverridden: true,
      adminNotes: 'Confirmed misinformation by District Information Officer.',
    }
  ];

  // --- SOS Incidents ---
  getSosIncidents() {
    return [...this.sosIncidents];
  }

  addSosIncident(sos: any) {
    this.sosIncidents.unshift(sos);
    this.log('CREATE_SOS', 'SosIncident', sos.id, `Distress beacon created for ${sos.locationAddress}`);
    return sos;
  }

  updateSosStatus(id: string, status: string, assignedGroupId?: string) {
    const item = this.sosIncidents.find((s) => s.id === id);
    if (item) {
      item.status = status;
      if (assignedGroupId) {
        item.aiAssessment = item.aiAssessment || {};
        item.aiAssessment.assignedGroupId = assignedGroupId;
      }
      this.log('UPDATE_SOS', 'SosIncident', id, `Status updated to ${status}`);
    }
    return item;
  }

  // --- Volunteer Groups ---
  getVolunteerGroups() {
    return [...this.volunteerGroups];
  }

  addVolunteerGroup(group: any) {
    this.volunteerGroups.unshift(group);
    this.log('CREATE_GROUP', 'VolunteerGroup', group.id, `Volunteer group ${group.name} registered`);
    return group;
  }

  // --- Verifications ---
  getVerifications() {
    return [...this.verifications];
  }

  addVerification(item: any) {
    this.verifications.unshift(item);
    return item;
  }

  updateVerification(id: string, status: string, notes?: string) {
    const item = this.verifications.find((v) => v.id === id);
    if (item) {
      item.verificationStatus = status;
      item.adminOverridden = true;
      if (notes) item.adminNotes = notes;
      this.log('UPDATE_VERIFICATION', 'Verification', id, `Status updated to ${status}`);
    }
    return item;
  }

  private log(action: string, entity: string, entityId: string, details: string) {
    this.auditLogs.unshift({
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    });
    // Keep max 100 logs
    if (this.auditLogs.length > 100) this.auditLogs.pop();
  }

  // --- Reports ---
  getReports(filters?: { status?: string; type?: string; severity?: string; limit?: number }) {
    let result = [...this.reports];
    if (filters?.status) {
      result = result.filter((r) => r.status.toLowerCase() === filters.status!.toLowerCase());
    }
    if (filters?.type) {
      result = result.filter((r) => r.type.toLowerCase() === filters.type!.toLowerCase());
    }
    if (filters?.severity) {
      result = result.filter((r) => r.severity.toLowerCase() === filters.severity!.toLowerCase());
    }
    if (filters?.limit && filters.limit > 0) {
      result = result.slice(0, filters.limit);
    }
    return result;
  }

  getReportById(id: string) {
    return this.reports.find((r) => r.id === id);
  }

  addReport(report: ServerEmergencyReport) {
    this.reports.unshift(report);
    this.log('CREATE_REPORT', 'EmergencyReport', report.id, `Created ${report.type} report: ${report.title}`);
    return report;
  }

  updateReportStatus(id: string, status: ServerEmergencyReport['status'], volunteerId?: string, volunteerName?: string) {
    const report = this.reports.find((r) => r.id === id);
    if (!report) return null;
    report.status = status;
    if (volunteerId) report.assignedVolunteerId = volunteerId;
    if (volunteerName) report.assignedVolunteerName = volunteerName;
    this.log('UPDATE_STATUS', 'EmergencyReport', id, `Status changed to ${status}`);
    return report;
  }

  confirmReport(id: string, isConfirmed: boolean) {
    const report = this.reports.find((r) => r.id === id);
    if (!report) return null;
    if (isConfirmed) {
      report.communityConfirmations.confirmed += 1;
    } else {
      report.communityConfirmations.unconfirmed += 1;
    }
    this.log('CONFIRM_REPORT', 'EmergencyReport', id, `Community ${isConfirmed ? 'confirmed' : 'unconfirmed'}`);
    return report.communityConfirmations;
  }

  deleteReport(id: string) {
    const idx = this.reports.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.reports.splice(idx, 1);
    this.log('DELETE_REPORT', 'EmergencyReport', id, `Deleted emergency report`);
    return true;
  }

  // --- Shelters ---
  getShelters(openOnly: boolean = false) {
    if (openOnly) {
      return this.shelters.filter((s) => s.isOpen);
    }
    return [...this.shelters];
  }

  getShelterById(id: string) {
    return this.shelters.find((s) => s.id === id);
  }

  bookShelter(bookingData: Omit<ServerShelterBooking, 'id' | 'createdAt' | 'status' | 'qrPassCode'>) {
    const shelter = this.shelters.find((s) => s.id === bookingData.shelterId);
    if (!shelter) return { success: false, error: 'Shelter not found' };

    const availableSpots = shelter.capacity - shelter.occupancy;
    if (availableSpots < bookingData.headCount) {
      return { success: false, error: `Not enough space. Only ${availableSpots} bed(s) available.` };
    }

    shelter.occupancy += bookingData.headCount;

    const booking: ServerShelterBooking = {
      ...bookingData,
      id: `BKG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      qrPassCode: `SAHAAY-PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };

    this.bookings.unshift(booking);
    this.log('SHELTER_BOOKING', 'ShelterBooking', booking.id, `Booked ${booking.headCount} bed(s) at ${shelter.name}`);
    return { success: true, booking, updatedShelter: shelter };
  }

  getBookings(citizenId?: string, shelterId?: string) {
    let list = [...this.bookings];
    if (citizenId) list = list.filter((b) => b.citizenId === citizenId);
    if (shelterId) list = list.filter((b) => b.shelterId === shelterId);
    return list;
  }

  // --- Resources ---
  getResources() {
    return [...this.resources];
  }

  updateResourceStock(id: string, quantity: number, status?: ServerResource['status']) {
    const res = this.resources.find((r) => r.id === id);
    if (!res) return null;
    res.quantity = quantity;
    if (status) {
      res.status = status;
    } else {
      if (res.quantity <= 0) res.status = 'CRITICAL';
      else if (res.quantity < 500) res.status = 'LOW_STOCK';
      else res.status = 'AVAILABLE';
    }
    res.lastUpdated = 'Just now';
    this.log('UPDATE_RESOURCE', 'Resource', id, `Quantity updated to ${quantity} ${res.unit}`);
    return res;
  }

  addResource(item: Omit<ServerResource, 'id' | 'lastUpdated'>) {
    const newRes: ServerResource = {
      ...item,
      id: `res_${Date.now()}`,
      lastUpdated: 'Just now',
    };
    this.resources.push(newRes);
    this.log('ADD_RESOURCE', 'Resource', newRes.id, `Added supply: ${newRes.name}`);
    return newRes;
  }

  // --- Volunteers ---
  getVolunteers(availability?: string) {
    if (availability) {
      return this.volunteers.filter((v) => v.availability.toLowerCase() === availability.toLowerCase());
    }
    return [...this.volunteers];
  }

  updateVolunteerStatus(id: string, availability: ServerVolunteer['availability'], isOnline?: boolean) {
    const vol = this.volunteers.find((v) => v.id === id);
    if (!vol) return null;
    vol.availability = availability;
    if (typeof isOnline === 'boolean') vol.isOnline = isOnline;
    vol.lastActive = 'Just now';
    this.log('VOLUNTEER_STATUS', 'Volunteer', id, `Availability set to ${availability}`);
    return vol;
  }

  dispatchVolunteer(volunteerId: string, incidentId: string, incidentTitle: string) {
    const vol = this.volunteers.find((v) => v.id === volunteerId);
    if (!vol) return null;
    vol.availability = 'ON_MISSION';
    vol.assignedIncidentId = incidentId;
    vol.assignedIncidentTitle = incidentTitle;
    vol.lastActive = 'Just now';
    this.log('VOLUNTEER_DISPATCH', 'Volunteer', volunteerId, `Dispatched to incident ${incidentId}`);
    return vol;
  }

  // --- Alerts ---
  getAlerts(activeOnly: boolean = true) {
    if (activeOnly) {
      return this.alerts.filter((a) => a.active);
    }
    return [...this.alerts];
  }

  createAlert(alertData: Omit<ServerAlert, 'id' | 'publishedAt' | 'active'>) {
    const alert: ServerAlert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      publishedAt: new Date().toISOString(),
      active: true,
    };
    this.alerts.unshift(alert);
    this.log('BROADCAST_ALERT', 'Alert', alert.id, `Broadcast alert: ${alert.title}`);
    return alert;
  }

  // --- Help Requests ---
  getHelpRequests(status?: string) {
    if (status) {
      return this.helpRequests.filter((h) => h.status.toLowerCase() === status.toLowerCase());
    }
    return [...this.helpRequests];
  }

  addHelpRequest(req: Omit<ServerHelpRequest, 'id' | 'createdAt' | 'status'>) {
    const newReq: ServerHelpRequest = {
      ...req,
      id: `req_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.helpRequests.unshift(newReq);
    this.log('CREATE_HELP_REQUEST', 'HelpRequest', newReq.id, `Created request: ${newReq.needType}`);
    return newReq;
  }

  updateHelpRequestStatus(id: string, status: ServerHelpRequest['status']) {
    const item = this.helpRequests.find((h) => h.id === id);
    if (!item) return null;
    item.status = status;
    this.log('UPDATE_HELP_REQUEST', 'HelpRequest', id, `Status changed to ${status}`);
    return item;
  }

  // --- CAP-Compatible Emergency Alert Ecosystem ---
  getCapAlerts(filters?: { status?: string; includeSimulation?: boolean }) {
    let result = [...this.capAlerts];
    if (filters?.status) {
      result = result.filter((a) => a.status.toUpperCase() === filters.status!.toUpperCase());
    }
    if (filters?.includeSimulation === false) {
      result = result.filter((a) => !a.isSimulation);
    }
    return result;
  }

  getCapAlertById(id: string) {
    return this.capAlerts.find((a) => a.id === id || a.identifier === id);
  }

  createCapAlert(data: Omit<ServerCapAlert, 'id' | 'identifier' | 'sent' | 'version'>) {
    const alertId = `cap_${Date.now()}`;
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const identifier = `CAP-IN-SAHAAY-${year}-${randNum}`;

    // Calculate targeted recipients inside circle or polygon
    let targetedRecipients = 0;
    const center = data.area.circle;
    if (center) {
      targetedRecipients = this.emergencyContacts.filter((c) => {
        if (!c.locationSharingPermission || c.lat == null || c.lng == null) return false;
        const dist = this.haversineKm(center.centerLat, center.centerLng, c.lat, c.lng);
        return dist <= center.radiusKm;
      }).length;
      // Add realistic multiplier representing population density
      targetedRecipients = Math.max(targetedRecipients * 45 + 30, 48);
    } else {
      targetedRecipients = 120;
    }

    const newAlert: ServerCapAlert = {
      ...data,
      id: alertId,
      identifier,
      sent: new Date().toISOString(),
      version: 1,
      recipientsCount: targetedRecipients,
      deliveredCount: Math.round(targetedRecipients * 0.96),
      openedCount: Math.round(targetedRecipients * 0.88),
    };

    this.capAlerts.unshift(newAlert);

    this.log(
      'CREATE_CAP_ALERT',
      'CapAlert',
      newAlert.id,
      `[${newAlert.identifier}] Published ${newAlert.severity} ${newAlert.event} alert for ${newAlert.area.areaDesc}`
    );

    return newAlert;
  }

  updateCapAlertStatus(id: string, newStatus: ServerCapAlert['status'], adminName: string = 'Admin Ops') {
    const alert = this.capAlerts.find((a) => a.id === id || a.identifier === id);
    if (!alert) return null;

    const oldStatus = alert.status;
    alert.status = newStatus;
    if (newStatus === 'CANCELLED' || newStatus === 'EXPIRED') {
      alert.msgType = 'Cancel';
    }

    this.log(
      'UPDATE_CAP_STATUS',
      'CapAlert',
      alert.id,
      `[${alert.identifier}] Status updated from ${oldStatus} to ${newStatus} by ${adminName}`
    );

    return alert;
  }

  runCapSimulation(disasterType: string, radiusKm: number, centerLat: number, centerLng: number, severity: string = 'CRITICAL') {
    const year = new Date().getFullYear();
    const simNum = Math.floor(100 + Math.random() * 900);
    const identifier = `CAP-IN-SIM-${year}-${simNum}`;

    const instructionsMap: Record<string, { headline: string; instruction: string; desc: string; response: string }> = {
      Flood: {
        headline: 'SIMULATION: Imminent Flash Flood & Dam Outflow Surge Warning',
        instruction: 'Move quickly to upper floors or nearest relief shelter. Do not enter floodwaters or drive across bridges. Disconnect gas & power.',
        desc: 'SIMULATION EXERCISE: Heavy inflow has triggered flash flooding across river corridor. Water levels rising rapidly by 1.2m/hr.',
        response: 'Evacuate',
      },
      'Heavy Rain': {
        headline: 'SIMULATION: Cloudburst Inundation & Microburst Alert',
        instruction: 'Stay indoors away from fragile roofs and electrical lines. Keep emergency survival kit and battery torch accessible.',
        desc: 'SIMULATION EXERCISE: Automated rain gauge records 95mm precipitation in 60 minutes. Severe urban waterlogging expected.',
        response: 'Shelter',
      },
      Cyclone: {
        headline: 'SIMULATION: Cyclonic Storm Gale Wind & Storm Surge Alert',
        instruction: 'Remain in reinforced concrete structures. Board up large glass panes. Prepare emergency drinking water supply.',
        desc: 'SIMULATION EXERCISE: Gale force winds exceeding 85 km/h accompanied by driving torrential rain approaching the area.',
        response: 'Shelter',
      },
      Fire: {
        headline: 'SIMULATION: Wildfire / Chemical Plant Smoke Dispersion Alert',
        instruction: 'Evacuate upwind of smoke plume. Cover mouth and nose with moist cloth or N95 mask. Await civil defense escort.',
        desc: 'SIMULATION EXERCISE: Uncontrolled blaze emitting toxic smoke plume expanding rapidly downwind.',
        response: 'Evacuate',
      },
      Landslide: {
        headline: 'SIMULATION: Catastrophic Hillside Mudslide Threat',
        instruction: 'Immediately evacuate hillside settlements to valley relief centers. Avoid all mountain roads and culverts.',
        desc: 'SIMULATION EXERCISE: Geotechnical sensors indicate acute soil shear failure along slope corridor.',
        response: 'Evacuate',
      },
    };

    const simConfig = instructionsMap[disasterType] || instructionsMap['Flood'];

    // Find nearest shelter to center
    let nearestShelter = this.shelters[0];
    let minDist = 999;
    for (const sh of this.shelters) {
      const d = this.haversineKm(centerLat, centerLng, sh.lat, sh.lng);
      if (d < minDist) {
        minDist = d;
        nearestShelter = sh;
      }
    }

    const simAlert: ServerCapAlert = {
      id: `sim_${Date.now()}`,
      identifier,
      sender: 'sahaay-simulation-engine@disaster.gov.in',
      senderName: 'SAHAAY National Disaster Simulation & Exercise Engine',
      sent: new Date().toISOString(),
      status: 'ACTIVE',
      msgType: 'Alert',
      source: 'SAHAAY Automated Crisis Simulation Protocol (DEMO EXERCISE)',
      scope: 'Public',
      language: 'en-IN',
      category: disasterType === 'Landslide' ? 'Geo' : 'Met',
      event: disasterType,
      responseType: simConfig.response,
      urgency: 'IMMEDIATE',
      severity: severity.toUpperCase() as any,
      certainty: 'OBSERVED',
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      headline: `[DEMO / SIMULATION] ${simConfig.headline}`,
      description: `[THIS IS A CONTROLLED TEST / SIMULATION - NOT A REAL EMERGENCY]\n${simConfig.desc}`,
      instruction: simConfig.instruction,
      area: {
        areaDesc: `Simulation Zone (${radiusKm} KM Radius around Coords [${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}])`,
        circle: {
          centerLat,
          centerLng,
          radiusKm,
        },
      },
      isSimulation: true,
      version: 1,
      recipientsCount: 245,
      deliveredCount: 238,
      openedCount: 219,
      nearestShelterId: nearestShelter ? nearestShelter.id : undefined,
    };

    this.capAlerts.unshift(simAlert);

    this.log(
      'RUN_SIMULATION',
      'CapAlert',
      simAlert.id,
      `[${simAlert.identifier}] Triggered full end-to-end ${disasterType} simulation with ${radiusKm}km radius.`
    );

    return {
      alert: simAlert,
      nearestShelter,
      simulatedUsersInZone: 245,
      simulatedNotificationsDelivered: 238,
    };
  }

  // --- Emergency Contact Registry ---
  getEmergencyContacts(options?: { filter?: string; centerLat?: number; centerLng?: number; radiusKm?: number }) {
    let list = [...this.emergencyContacts];

    if (options?.centerLat != null && options?.centerLng != null) {
      list = list.map((c) => {
        let dist: number | undefined;
        let inside = false;
        if (c.locationSharingPermission && c.lat != null && c.lng != null) {
          dist = Math.round(this.haversineKm(options.centerLat!, options.centerLng!, c.lat, c.lng) * 10) / 10;
          inside = options.radiusKm != null ? dist <= options.radiusKm : false;
        }
        return {
          ...c,
          approxDistanceKm: dist,
          insideCurrentZone: inside,
        };
      });
    }

    if (options?.filter && options.filter !== 'ALL') {
      list = list.filter((c) => c.alertEligibility === options.filter);
    }

    return list;
  }

  updateEmergencyContactSettings(id: string, settings: Partial<ServerEmergencyContact>) {
    const contact = this.emergencyContacts.find((c) => c.id === id || c.phone === id);
    if (!contact) return null;

    Object.assign(contact, settings);
    // Recalculate eligibility
    if (!contact.emergencyAlertOptIn) {
      contact.alertEligibility = 'OPTED_OUT';
    } else if (!contact.locationSharingPermission) {
      contact.alertEligibility = 'LOCATION_DISABLED';
    } else if (contact.registrationStatus !== 'VERIFIED') {
      contact.alertEligibility = 'UNVERIFIED';
    } else {
      contact.alertEligibility = 'ELIGIBLE';
    }

    this.log('UPDATE_CONTACT_SETTINGS', 'EmergencyContact', contact.id, `Updated contact alert preferences for ${contact.name}`);
    return contact;
  }

  getCapAlertAnalytics() {
    const active = this.capAlerts.filter((a) => a.status === 'ACTIVE');
    const critical = this.capAlerts.filter((a) => a.severity === 'CRITICAL');
    const totalRecipients = this.capAlerts.reduce((sum, a) => sum + (a.recipientsCount || 0), 0);
    const totalDelivered = this.capAlerts.reduce((sum, a) => sum + (a.deliveredCount || 0), 0);
    const totalOpened = this.capAlerts.reduce((sum, a) => sum + (a.openedCount || 0), 0);

    return {
      activeAlerts: active.length,
      totalAlerts: this.capAlerts.length,
      criticalAlerts: critical.length,
      usersInAffectedZones: totalRecipients,
      notificationsSent: totalRecipients,
      notificationsDelivered: totalDelivered,
      notificationsOpened: totalOpened,
      smsSent: Math.round(totalDelivered * 0.72),
      sheltersActivated: this.shelters.filter((s) => s.isOpen).length,
      respondersNotified: this.volunteers.filter((v) => v.availability === 'AVAILABLE' || v.availability === 'ON_MISSION').length,
    };
  }

  // W3C/OASIS CAP v1.2 XML Generator
  exportCapXml(id: string): string | null {
    const a = this.getCapAlertById(id);
    if (!a) return null;

    const circleXml = a.area.circle
      ? `<circle>${a.area.circle.centerLat},${a.area.circle.centerLng},${a.area.circle.radiusKm}</circle>`
      : '';
    const polyXml = a.area.polygon
      ? `<polygon>${a.area.polygon.map(([lat, lng]) => `${lat},${lng}`).join(' ')}</polygon>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${a.identifier}</identifier>
  <sender>${a.sender}</sender>
  <sent>${a.sent}</sent>
  <status>${a.isSimulation ? 'Exercise' : 'Actual'}</status>
  <msgType>${a.msgType}</msgType>
  <source>${a.source}</source>
  <scope>${a.scope}</scope>
  <code status="Operational">SAHAAY-CAP-IN</code>
  ${a.note ? `<note>${a.note}</note>` : ''}
  <info>
    <language>${a.language || 'en-IN'}</language>
    <category>${a.category || 'Met'}</category>
    <event>${a.event}</event>
    <responseType>${a.responseType || 'Prepare'}</responseType>
    <urgency>${a.urgency}</urgency>
    <severity>${a.severity}</severity>
    <certainty>${a.certainty}</certainty>
    <effective>${a.effective}</effective>
    <expires>${a.expires}</expires>
    <senderName>${a.senderName}</senderName>
    <headline>${this.escapeXml(a.headline)}</headline>
    <description>${this.escapeXml(a.description)}</description>
    <instruction>${this.escapeXml(a.instruction)}</instruction>
    <area>
      <areaDesc>${this.escapeXml(a.area.areaDesc)}</areaDesc>
      ${circleXml}
      ${polyXml}
    </area>
  </info>
</alert>`;
  }

  private escapeXml(unsafe: string): string {
    return (unsafe || '')
      .replace(/[<]/g, '&lt;')
      .replace(/[>]/g, '&gt;')
      .replace(/[&]/g, '&amp;')
      .replace(/[']/g, '&apos;')
      .replace(/["]/g, '&quot;');
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // --- Metrics & Audit ---
  getStats() {
    return {
      reportsTotal: this.reports.length,
      reportsCritical: this.reports.filter((r) => r.severity === 'CRITICAL').length,
      reportsInProgress: this.reports.filter((r) => r.status === 'IN_PROGRESS').length,
      sheltersTotal: this.shelters.length,
      sheltersCapacity: this.shelters.reduce((acc, s) => acc + s.capacity, 0),
      sheltersOccupancy: this.shelters.reduce((acc, s) => acc + s.occupancy, 0),
      volunteersTotal: this.volunteers.length,
      volunteersActive: this.volunteers.filter((v) => v.availability === 'AVAILABLE' || v.availability === 'ON_MISSION').length,
      resourcesTotal: this.resources.length,
      alertsActive: this.alerts.filter((a) => a.active).length,
      capAlertsActive: this.capAlerts.filter((a) => a.status === 'ACTIVE').length,
      bookingsCount: this.bookings.length,
      helpRequestsCount: this.helpRequests.length,
      emergencyContactsCount: this.emergencyContacts.length,
    };
  }

  getAuditLogs(limit: number = 20) {
    return this.auditLogs.slice(0, limit);
  }
}

export const db = new DatabaseStore();
