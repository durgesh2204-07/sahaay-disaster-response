export interface ImpactMeasurementParameter {
  id: string;
  name: string;
  icon: string;
  whatYouMeasure: string;
  traditionalMethod: string;
  sahaayAdvantage: string;
}

export interface CoreResponseDimension {
  id: string;
  number: string;
  title: string;
  icon: string;
  description: string;
  keyFeature: string;
}

export interface PlatformCapability {
  capability: string;
  sachetNdma: 'yes' | 'partial' | 'no' | 'varies';
  erss112: 'yes' | 'partial' | 'no' | 'varies';
  ushahidi: 'yes' | 'partial' | 'no' | 'varies';
  standaloneNgo: 'yes' | 'partial' | 'no' | 'varies';
  sahaay: 'yes' | 'partial' | 'no' | 'varies';
  note: string;
}

export interface OutcomeCard {
  id: string;
  number: string;
  title: string;
  icon: string;
  outcomeText: string;
  technicalSubtext: string;
}

export const EIGHT_MEASUREMENT_PARAMETERS: ImpactMeasurementParameter[] = [
  {
    id: 'response_time',
    name: 'Response Time',
    icon: '⚡',
    whatYouMeasure: 'Time from incident report → acknowledgement/action',
    traditionalMethod: 'Phone relay & manual dispatch queues (45–90 min)',
    sahaayAdvantage: 'Instant geo-tagged dispatch & real-time responder assignment (< 18 min)',
  },
  {
    id: 'location_accuracy',
    name: 'Location Accuracy',
    icon: '📍',
    whatYouMeasure: 'Accuracy of reported incident location',
    traditionalMethod: 'Verbal street landmarks & unverified descriptions',
    sahaayAdvantage: 'Precise browser GPS latitude/longitude + reverse geocoded street address',
  },
  {
    id: 'alert_speed',
    name: 'Alert Speed',
    icon: '🚨',
    whatYouMeasure: 'Time from verified event → user notification',
    traditionalMethod: 'Broadcast media delays & static press circulars',
    sahaayAdvantage: 'Real-time in-app alerts and OASIS CAP protocol civil warning feeds',
  },
  {
    id: 'incident_reporting',
    name: 'Incident Reporting',
    icon: '📝',
    whatYouMeasure: 'Ease/time required to submit an incident',
    traditionalMethod: 'Congested telephone hotlines or paper incident registers',
    sahaayAdvantage: '1-tap emergency reporting with photo capture, offline queue & live GPS',
  },
  {
    id: 'coordination',
    name: 'Coordination',
    icon: '🤝',
    whatYouMeasure: 'Ability to connect citizens, volunteers & authorities',
    traditionalMethod: 'Fragmented WhatsApp groups and uncoordinated volunteer crowds',
    sahaayAdvantage: 'Unified collaborative workspace connecting citizens, volunteers & command',
  },
  {
    id: 'situation_awareness',
    name: 'Situation Awareness',
    icon: '🗺️',
    whatYouMeasure: 'Availability of incidents, locations and status on one view',
    traditionalMethod: 'Disparate multi-agency spreadsheets & static map prints',
    sahaayAdvantage: 'Interactive Leaflet GIS map with hazard zones, blocked roads & live pins',
  },
  {
    id: 'forecast_alerts',
    name: 'Forecast & Alerts',
    icon: '🌦️',
    whatYouMeasure: 'Weather/forecast + disaster-alert availability',
    traditionalMethod: 'External meteorological portals not linked to citizen emergency tools',
    sahaayAdvantage: 'Built-in radar telemetry, precipitation tracking & automated risk scoring',
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    icon: '♿',
    whatYouMeasure: 'Mobile usability, language support and ease of access',
    traditionalMethod: 'Desktop-oriented government portals; single-language forms',
    sahaayAdvantage: 'Mobile-responsive PWA layout, multi-lingual support & high-contrast UI',
  },
];

export const FIVE_CORE_RESPONSE_DIMENSIONS: CoreResponseDimension[] = [
  {
    id: 'incident_reporting',
    number: '01',
    title: 'Incident Reporting',
    icon: '📝',
    description: 'Quickly report disasters with essential details, location and media.',
    keyFeature: '1-tap SOS, photo upload, offline queueing, live GPS tags',
  },
  {
    id: 'situation_awareness',
    number: '02',
    title: 'Situation Awareness',
    icon: '🗺️',
    description: 'Centralized view of incidents, affected areas, alerts and locations.',
    keyFeature: 'Interactive GIS hazard map, live status pins, evacuation corridors',
  },
  {
    id: 'response_coordination',
    number: '03',
    title: 'Response Coordination',
    icon: '🤝',
    description: 'Connect people in need with volunteers, NGOs and response authorities.',
    keyFeature: 'Unified responder roles, task claiming, volunteer roster',
  },
  {
    id: 'resource_management',
    number: '04',
    title: 'Resource Management',
    icon: '📦',
    description: 'Help manage shelters, food, water, medicines and rescue resources.',
    keyFeature: 'Real-time shelter occupancy, QR bed booking, ration tracking',
  },
  {
    id: 'emergency_communication',
    number: '05',
    title: 'Emergency Communication',
    icon: '🚨',
    description: 'Provide alerts, emergency requests and important disaster information.',
    keyFeature: 'Push notifications, CAP civil bulletins, multi-lingual guidance',
  },
];

export const CAPABILITY_COMPARISON_MATRIX: PlatformCapability[] = [
  {
    capability: 'Incident Reporting with Media & GPS',
    sachetNdma: 'no',
    erss112: 'partial',
    ushahidi: 'yes',
    standaloneNgo: 'varies',
    sahaay: 'yes',
    note: 'SAHAAY captures live coordinates, photos, and severity classification in 1 tap',
  },
  {
    capability: 'Live Disaster Information & Situational Awareness',
    sachetNdma: 'yes',
    erss112: 'partial',
    ushahidi: 'yes',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'Centralized view uniting live incidents, alerts, shelters, and affected areas',
  },
  {
    capability: 'Interactive Location & GIS Danger Mapping',
    sachetNdma: 'partial',
    erss112: 'partial',
    ushahidi: 'yes',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'Visual hazard perimeters, flood overlays, road closures, and shelter markers',
  },
  {
    capability: 'Emergency Alerts & Push Warnings',
    sachetNdma: 'yes',
    erss112: 'partial',
    ushahidi: 'partial',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'CAP OASIS civil bulletins and targeted emergency safety broadcasts',
  },
  {
    capability: 'Volunteer & Field Responder Coordination',
    sachetNdma: 'no',
    erss112: 'no',
    ushahidi: 'partial',
    standaloneNgo: 'partial',
    sahaay: 'yes',
    note: 'Direct assignment, task verification, and real-time field progress tracking',
  },
  {
    capability: 'Resource Management (Food, Water, Medicine)',
    sachetNdma: 'no',
    erss112: 'no',
    ushahidi: 'no',
    standaloneNgo: 'partial',
    sahaay: 'yes',
    note: 'Matching citizen relief requests directly with logistics depots & inventory',
  },
  {
    capability: 'Shelter Bed Availability & QR Check-in',
    sachetNdma: 'no',
    erss112: 'no',
    ushahidi: 'no',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'Live bed counts, ration status, and digital QR reservation passes for families',
  },
  {
    capability: 'Centralized Multi-Role Dashboard',
    sachetNdma: 'no',
    erss112: 'partial',
    ushahidi: 'partial',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'Single unified platform with tailored views for Citizens, Responders & Admins',
  },
  {
    capability: 'Offline Queuing & Low-Bandwidth Resilience',
    sachetNdma: 'no',
    erss112: 'no',
    ushahidi: 'partial',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'Local offline state caching with automated synchronization upon reconnection',
  },
  {
    capability: 'Multi-Lingual Emergency Guides & Contacts',
    sachetNdma: 'partial',
    erss112: 'partial',
    ushahidi: 'no',
    standaloneNgo: 'no',
    sahaay: 'yes',
    note: 'Immediate offline action manuals for earthquakes, cyclones, fires & floods',
  },
];

export const FIVE_OUTCOME_CARDS: OutcomeCard[] = [
  {
    id: 'faster_response',
    number: '01',
    title: 'Faster Response',
    icon: '⚡',
    outcomeText: 'Quick incident reporting and help requests help reduce communication delays.',
    technicalSubtext: 'Direct GPS reporting and automated triage eliminate telephone relay bottlenecks.',
  },
  {
    id: 'better_awareness',
    number: '02',
    title: 'Better Awareness',
    icon: '🗺️',
    outcomeText: 'Centralized incident, location and emergency information improves situational awareness.',
    technicalSubtext: 'A unified GIS display brings together hazards, safe zones, shelters, and team pins.',
  },
  {
    id: 'stronger_coordination',
    number: '03',
    title: 'Stronger Coordination',
    icon: '🤝',
    outcomeText: 'Connects citizens, volunteers, NGOs and authorities through one platform.',
    technicalSubtext: 'Role-based interfaces eliminate agency silos and duplicate rescue efforts.',
  },
  {
    id: 'better_resource_mgmt',
    number: '04',
    title: 'Better Resource Management',
    icon: '📦',
    outcomeText: 'Helps organize shelters, essential resources and assistance information.',
    technicalSubtext: 'Prevents supply shortages and ensures relief reaches verified high-priority zones.',
  },
  {
    id: 'safer_communities',
    number: '05',
    title: 'Safer Communities',
    icon: '🛡️',
    outcomeText: 'Supports preparedness, coordinated response and community resilience.',
    technicalSubtext: 'Empowers citizens with verified alerts, offline survival guides, and nearby shelter passes.',
  },
];

export const PIPELINE_STEPS = [
  { step: 'REPORT', icon: '📝', description: 'Citizen SOS with live GPS & photos' },
  { step: 'LOCATE', icon: '📍', description: 'GIS geocoding & hazard zone mapping' },
  { step: 'INFORM', icon: '🚨', description: 'Real-time broadcast & CAP alert feeds' },
  { step: 'COORDINATE', icon: '🤝', description: 'Role-based dispatch & shelter sync' },
  { step: 'RESPOND', icon: '⚡', description: 'Rapid relief delivery & verified resolution' },
];

export interface CapabilityComparisonDataPoint {
  dimension: string;
  shortName: string;
  icon: string;
  existingSolution: number; // Percentage 0 - 100%
  existingLabel: string;
  ourSolution: number; // Percentage 0 - 100%
  ourLabel: string;
}

export const GRAPH_5_CORE_DIMENSIONS: CapabilityComparisonDataPoint[] = [
  {
    dimension: 'Incident Reporting',
    shortName: 'Reporting 📝',
    icon: '📝',
    existingSolution: 88,
    existingLabel: 'Phone hotlines & paper logs (Congested queues)',
    ourSolution: 94,
    ourLabel: '1-tap SOS, live GPS coordinates & photo evidence',
  },
  {
    dimension: 'Situation Awareness',
    shortName: 'Awareness 🗺️',
    icon: '🗺️',
    existingSolution: 89,
    existingLabel: 'Static bulletins & isolated department maps',
    ourSolution: 95,
    ourLabel: 'Interactive Leaflet GIS with real-time hazard overlays',
  },
  {
    dimension: 'Response Coordination',
    shortName: 'Coordination 🤝',
    icon: '🤝',
    existingSolution: 86,
    existingLabel: 'Ad-hoc chat groups & unmanaged volunteers',
    ourSolution: 92,
    ourLabel: 'Unified role-based dispatch & verified task claiming',
  },
  {
    dimension: 'Resource Management',
    shortName: 'Resources 📦',
    icon: '📦',
    existingSolution: 85,
    existingLabel: 'Isolated storehouses & physical check-in queues',
    ourSolution: 91,
    ourLabel: 'Live shelter bed occupancy & digital QR pass check-in',
  },
  {
    dimension: 'Emergency Communication',
    shortName: 'Communication 🚨',
    icon: '🚨',
    existingSolution: 90,
    existingLabel: 'One-way media broadcasts & delayed advisories',
    ourSolution: 96,
    ourLabel: 'OASIS CAP feeds, push alerts & multilingual guides',
  },
];

export const GRAPH_8_PARAMETERS: CapabilityComparisonDataPoint[] = [
  {
    dimension: 'Response Time',
    shortName: 'Response ⚡',
    icon: '⚡',
    existingSolution: 87,
    existingLabel: '45–90 min manual telephone relays & queues',
    ourSolution: 93,
    ourLabel: '< 18 min direct geo-tagged dispatch & response',
  },
  {
    dimension: 'Location Accuracy',
    shortName: 'Location 📍',
    icon: '📍',
    existingSolution: 89,
    existingLabel: 'Verbal landmarks & unverified descriptions',
    ourSolution: 95,
    ourLabel: 'Precise browser GPS coordinates + reverse geocoding',
  },
  {
    dimension: 'Alert Speed',
    shortName: 'Alerts 🚨',
    icon: '🚨',
    existingSolution: 88,
    existingLabel: 'TV/radio broadcast delay & manual circulars',
    ourSolution: 94,
    ourLabel: 'Instant digital in-app alerts & CAP civil feeds',
  },
  {
    dimension: 'Incident Reporting',
    shortName: 'Reporting 📝',
    icon: '📝',
    existingSolution: 87,
    existingLabel: 'Congested telephone lines with busy signals',
    ourSolution: 93,
    ourLabel: '1-tap SOS submission with media & offline caching',
  },
  {
    dimension: 'Coordination',
    shortName: 'Coordination 🤝',
    icon: '🤝',
    existingSolution: 86,
    existingLabel: 'Fragmented WhatsApp chains & duplicate efforts',
    ourSolution: 92,
    ourLabel: 'Integrated platform across Citizens, Volunteers & Admins',
  },
  {
    dimension: 'Situation Awareness',
    shortName: 'Awareness 🗺️',
    icon: '🗺️',
    existingSolution: 89,
    existingLabel: 'Multiple disconnected agency spreadsheets',
    ourSolution: 95,
    ourLabel: 'Centralized live GIS dashboard with real-time status',
  },
  {
    dimension: 'Forecast & Alerts',
    shortName: 'Forecast 🌦️',
    icon: '🌦️',
    existingSolution: 88,
    existingLabel: 'Isolated weather portals unlinked to local response',
    ourSolution: 94,
    ourLabel: 'Integrated radar data, precipitation & automated risk',
  },
  {
    dimension: 'Accessibility',
    shortName: 'Access ♿',
    icon: '♿',
    existingSolution: 86,
    existingLabel: 'Desktop-heavy forms & single-language portals',
    ourSolution: 92,
    ourLabel: 'Mobile-first PWA, multi-language & offline resilience',
  },
];

export const CONCLUSION_DATA = {
  sectionName: 'Impact',
  tagline: 'A centralized platform connecting incident reporting, real-time information, emergency communication and coordinated assistance.',
  pipelineSubtitle: 'One platform connecting people, information and resources during disasters.',
  graphHeading: 'SAHAAY Impact: 5 Core Response Dimensions',
  graphSubtitle: 'Key areas addressed by the SAHAAY platform',
  futureReadyText: 'Future-ready: CAP Alerts • Weather Forecast • IoT • Mobile App • Data Analytics',
  vivaQuestion: 'How is SAHAAY better than existing systems?',
  vivaAnswer:
    '“Existing platforms address different parts of disaster management. SAHAAY is designed as a unified platform that brings incident reporting, location information, emergency communication, volunteer coordination and resource management together in one workflow.”',
};
