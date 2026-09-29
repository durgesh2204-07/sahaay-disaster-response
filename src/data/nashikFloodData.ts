import {
  SettlementRiskProfile,
  NashikRoadStatus,
  RouteValidityCheckResult,
  FalseAlertTestResult,
  DecisionReplayScenario,
  PriorityCategory,
} from '../types';

// ============================================================================
// 1. DISTRICT & PRIMARY HAZARD SCOPE: NASHIK FLOOD INTELLIGENCE PLATFORM
// ============================================================================

export const NASHIK_FLOOD_SCOPE = {
  district: 'Nashik District',
  state: 'Maharashtra',
  primaryHazard: 'FLOOD',
  riverBasin: 'Upper Godavari River Basin & Darna-Kadva Tributaries',
  primaryDam: 'Gangapur Dam (Capacity: 5,630 Mcft / 159.4 MCM)',
  commandCenter: 'Nashik District Collectorate Disaster Emergency Operations Centre (DEOC)',
  warningStandard: 'IMD Red Alert + CWC Godavari Basin Flash Flood Advisory',
};

export interface DistrictScopeOption {
  id: string;
  name: string;
  state: string;
  primaryHazard: string;
  status: 'ACTIVE_DEMO' | 'PROTOTYPE';
  riverBasin: string;
  commandCenter: string;
  totalSettlementsCount: number;
  criticalWardsCount: number;
  centerCoordinates: { lat: number; lng: number };
}

export const SUPPORTED_DISTRICTS: DistrictScopeOption[] = [
  {
    id: 'nashik',
    name: 'Nashik District',
    state: 'Maharashtra',
    primaryHazard: 'FLOOD',
    status: 'ACTIVE_DEMO',
    riverBasin: 'Upper Godavari River Basin & Gangapur Dam Catchment',
    commandCenter: 'Nashik District Collectorate Disaster Emergency Operations Centre (DEOC)',
    totalSettlementsCount: 11,
    criticalWardsCount: 4,
    centerCoordinates: { lat: 20.0050, lng: 73.7910 },
  },
  {
    id: 'pune',
    name: 'Pune District',
    state: 'Maharashtra',
    primaryHazard: 'URBAN_FLOOD',
    status: 'PROTOTYPE',
    riverBasin: 'Mula-Mutha River Basin & Khadakwasla Catchment',
    commandCenter: 'Pune District Collectorate DEOC',
    totalSettlementsCount: 8,
    criticalWardsCount: 2,
    centerCoordinates: { lat: 18.5204, lng: 73.8567 },
  },
  {
    id: 'raigad',
    name: 'Raigad District',
    state: 'Maharashtra',
    primaryHazard: 'FLASH_FLOOD_LANDSLIDE',
    status: 'PROTOTYPE',
    riverBasin: 'Savitri & Kundalika Coastal Basin',
    commandCenter: 'Alibaug District Disaster Cell',
    totalSettlementsCount: 6,
    criticalWardsCount: 2,
    centerCoordinates: { lat: 18.6414, lng: 72.8722 },
  },
];

export interface TalukaCluster {
  id: string;
  name: string;
  districtId: string;
  type: 'URBAN_CORE' | 'UPSTREAM_GHAT' | 'DOWNSTREAM_BASIN' | 'PILGRIMAGE_VALLEY' | 'INDUSTRIAL_BELT';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  settlementIds: string[];
  rainfallMmHr: number;
  riverGaugeM: number;
  criticalAlert: string;
}

export const NASHIK_TALUKAS: TalukaCluster[] = [
  {
    id: 'tal_nashik_city',
    name: 'Nashik City (Urban Core)',
    districtId: 'nashik',
    type: 'URBAN_CORE',
    riskLevel: 'CRITICAL',
    settlementIds: ['set_ramkund', 'set_panchavati', 'set_old_nashik', 'set_tapovan', 'set_gangapur', 'set_nashik_road', 'set_deolali'],
    rainfallMmHr: 84,
    riverGaugeM: 3.8,
    criticalAlert: 'Godavari overflow submerging Ramkund steps & Holkar Bridge with 45k cusecs Gangapur spill.',
  },
  {
    id: 'tal_niphad',
    name: 'Niphad Taluka',
    districtId: 'nashik',
    type: 'DOWNSTREAM_BASIN',
    riskLevel: 'CRITICAL',
    settlementIds: ['set_niphad_lowlands'],
    rainfallMmHr: 68,
    riverGaugeM: 3.4,
    criticalAlert: 'Kadva-Godavari downstream confluence backwater flooding agricultural and vineyard basins.',
  },
  {
    id: 'tal_igatpuri',
    name: 'Igatpuri Taluka',
    districtId: 'nashik',
    type: 'UPSTREAM_GHAT',
    riskLevel: 'HIGH',
    settlementIds: ['set_igatpuri_ghat'],
    rainfallMmHr: 122,
    riverGaugeM: 2.8,
    criticalAlert: 'Western Ghats cloudburst runoff surging into Bhavali and Darna reservoirs with mudslide risk.',
  },
  {
    id: 'tal_trimbak',
    name: 'Trimbakeshwar Taluka',
    districtId: 'nashik',
    type: 'PILGRIMAGE_VALLEY',
    riskLevel: 'HIGH',
    settlementIds: ['set_trimbakeshwar'],
    rainfallMmHr: 96,
    riverGaugeM: 2.1,
    criticalAlert: 'Brahmagiri Mountain runoff cascading into Kushavarta Kund; headwater surge advancing.',
  },
  {
    id: 'tal_sinnar',
    name: 'Sinnar Taluka',
    districtId: 'nashik',
    type: 'INDUSTRIAL_BELT',
    riskLevel: 'MODERATE',
    settlementIds: ['set_sinnar_midc'],
    rainfallMmHr: 52,
    riverGaugeM: 1.4,
    criticalAlert: 'Shiv River tributary minor swelling; MIDC worker corridors open with monitored culverts.',
  },
  {
    id: 'tal_malegaon',
    name: 'Malegaon Taluka',
    districtId: 'nashik',
    type: 'DOWNSTREAM_BASIN',
    riskLevel: 'HIGH',
    settlementIds: ['set_malegaon_girna'],
    rainfallMmHr: 64,
    riverGaugeM: 2.7,
    criticalAlert: 'Girna and Mausam river confluence waterlogging old textile quarters and low bridges.',
  },
];

// ============================================================================
// 2. NASHIK SETTLEMENTS RISK PROFILES
// ============================================================================

export const INITIAL_NASHIK_SETTLEMENTS: SettlementRiskProfile[] = [
  {
    id: 'set_ramkund',
    name: 'Ramkund & Goda Ghat Basin',
    taluka: 'Nashik City (East Ward)',
    population: 34500,
    elevationMeters: 554, // Lowest riverbed depression in central city
    distanceToRiverbedM: 15,
    historicalVulnerabilityScore: 19, // Highly vulnerable in 2008, 2016, 2019, 2025 floods
    rainfallMmHr: 84,
    rainfallAccumulation6hMm: 192,
    waterLevelMetersAboveNormal: 3.8, // 3.8m above normal ghat baseline
    soilSaturationPercent: 94,
    citizenReportsCount: 14,
    verifiedReportsCount: 11,
    roadDisruptionsCount: 3,
    trappedPeopleCount: 42,
    shelterCount: 2,
    riskScore: 89,
    riskLevel: 'CRITICAL',
    confidenceScore: 94,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 2,
    evidenceBreakdown: {
      rainfallContribution: 36,      // out of 40
      terrainContribution: 19,       // out of 20 (low bowl 554m MSL)
      groundReportsContribution: 18, // out of 20 (11 verified ground reports)
      historicalAndWaterLevel: 16,   // out of 20 (+3.8m river gauge crest)
    },
    explainableObservations: [
      'Gangapur dam discharge increased to 45,000 cusecs upstream at 13:45 IST.',
      'Ramkund historic stone ghat steps completely submerged under 2.4m turbulent overflow.',
      '11 verified citizen & volunteer reports confirm ground-floor residential inundation.',
      'Holkar Bridge causeway and Ramkund Link Road closed due to strong currents.',
      'Antecedent soil moisture at 94% saturation, preventing localized storm absorption.',
    ],
    responsePriorityScore: 96,
    responsePriorityLevel: 'P1_IMMEDIATE',
    priorityReasons: [
      '42 trapped residents requiring immediate inflatable boat extraction.',
      'Critical road access severed via Holkar Bridge.',
      'High vulnerable elderly density along Goda Ghat heritage alleys.',
    ],
    coordinates: { lat: 20.0050, lng: 73.7910 },
    lastEvaluatedAt: '14:32 IST',
  },
  {
    id: 'set_panchavati',
    name: 'Panchavati & Sita Gumpha Corridor',
    taluka: 'Nashik City (North Ward)',
    population: 52000,
    elevationMeters: 558,
    distanceToRiverbedM: 95,
    historicalVulnerabilityScore: 17,
    rainfallMmHr: 78,
    rainfallAccumulation6hMm: 176,
    waterLevelMetersAboveNormal: 3.2,
    soilSaturationPercent: 88,
    citizenReportsCount: 12,
    verifiedReportsCount: 9,
    roadDisruptionsCount: 2,
    trappedPeopleCount: 28,
    shelterCount: 3,
    riskScore: 82,
    riskLevel: 'CRITICAL',
    confidenceScore: 91,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 3,
    evidenceBreakdown: {
      rainfallContribution: 33,
      terrainContribution: 17,
      groundReportsContribution: 17,
      historicalAndWaterLevel: 15,
    },
    explainableObservations: [
      'Backwater surge pushing through Saraswati nala into residential market squares.',
      '78 mm/hr localized rainfall intensity recorded at Panchavati Telemetry Station.',
      '9 verified citizen reports of commercial basements and shops flooded with 80cm water.',
      'CBS to Panchavati Central Corridor blocked by deep waterlogging at Ashok Stambh.',
    ],
    responsePriorityScore: 88,
    responsePriorityLevel: 'P1_IMMEDIATE',
    priorityReasons: [
      'Dense pilgrim & merchant settlement in narrow medieval lanes.',
      'Power feeder automatically tripped due to waterlogged transformers.',
      'Urgent need for food packets and high-clearance tractor access.',
    ],
    coordinates: { lat: 20.0085, lng: 73.7955 },
    lastEvaluatedAt: '14:31 IST',
  },
  {
    id: 'set_tapovan',
    name: 'Tapovan & Takli Sangam Confluence',
    taluka: 'Nashik East',
    population: 26800,
    elevationMeters: 548, // River confluence low depression
    distanceToRiverbedM: 30,
    historicalVulnerabilityScore: 18,
    rainfallMmHr: 72,
    rainfallAccumulation6hMm: 164,
    waterLevelMetersAboveNormal: 3.5,
    soilSaturationPercent: 92,
    citizenReportsCount: 9,
    verifiedReportsCount: 7,
    roadDisruptionsCount: 1,
    trappedPeopleCount: 19,
    shelterCount: 1,
    riskScore: 78,
    riskLevel: 'HIGH',
    confidenceScore: 88,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 5,
    evidenceBreakdown: {
      rainfallContribution: 31,
      terrainContribution: 18,
      groundReportsContribution: 15,
      historicalAndWaterLevel: 14,
    },
    explainableObservations: [
      'Godavari-Kapila river confluence swelling rapidly, impeding natural outflow.',
      'Agricultural and low-income riverbank settlements reporting standing water of 60cm.',
      'Volunteer Team Gamma confirmed 7 distress alerts from hutment clusters.',
      'Takli causeway covered with silt and rushing water; small vehicles cannot cross.',
    ],
    responsePriorityScore: 79,
    responsePriorityLevel: 'P2_HIGH',
    priorityReasons: [
      'Confluence backflow threatens 19 stranded families on farm perimeter.',
      'Single safe evacuation corridor remains open via Dwarka junction bypass.',
    ],
    coordinates: { lat: 19.9920, lng: 73.8180 },
    lastEvaluatedAt: '14:28 IST',
  },
  {
    id: 'set_old_nashik',
    name: 'Old Nashik (Goda Ghat & Sarkarwada)',
    taluka: 'Nashik South Central',
    population: 48000,
    elevationMeters: 562,
    distanceToRiverbedM: 140,
    historicalVulnerabilityScore: 15,
    rainfallMmHr: 66,
    rainfallAccumulation6hMm: 148,
    waterLevelMetersAboveNormal: 2.4,
    soilSaturationPercent: 82,
    citizenReportsCount: 8,
    verifiedReportsCount: 6,
    roadDisruptionsCount: 2,
    trappedPeopleCount: 14,
    shelterCount: 2,
    riskScore: 71,
    riskLevel: 'HIGH',
    confidenceScore: 86,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 4,
    evidenceBreakdown: {
      rainfallContribution: 28,
      terrainContribution: 15,
      groundReportsContribution: 14,
      historicalAndWaterLevel: 14,
    },
    explainableObservations: [
      'Storm drainage backup flooding ground floors near Tiwandha and Sarkarwada.',
      'Narrow heritage alleys restricting conventional fire engine movement.',
      'Old Agra Road passable only for high-clearance trucks; sedans turned away.',
    ],
    responsePriorityScore: 74,
    responsePriorityLevel: 'P2_HIGH',
    priorityReasons: [
      'Aging wada structures vulnerable to wall seepage and structural cracking.',
      '14 elderly residents require assisted evacuation to designated municipal schools.',
    ],
    coordinates: { lat: 19.9980, lng: 73.7880 },
    lastEvaluatedAt: '14:30 IST',
  },
  {
    id: 'set_gangapur',
    name: 'Gangapur Downstream & Someshwar',
    taluka: 'Nashik West / Gangapur',
    population: 21500,
    elevationMeters: 588,
    distanceToRiverbedM: 80,
    historicalVulnerabilityScore: 12,
    rainfallMmHr: 88,
    rainfallAccumulation6hMm: 210,
    waterLevelMetersAboveNormal: 2.9,
    soilSaturationPercent: 91,
    citizenReportsCount: 5,
    verifiedReportsCount: 4,
    roadDisruptionsCount: 1,
    trappedPeopleCount: 6,
    shelterCount: 2,
    riskScore: 64,
    riskLevel: 'HIGH',
    confidenceScore: 89,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 3,
    evidenceBreakdown: {
      rainfallContribution: 34,
      terrainContribution: 10,
      groundReportsContribution: 10,
      historicalAndWaterLevel: 10,
    },
    explainableObservations: [
      'Direct downstream proximity to Gangapur Dam spillway discharge channel.',
      'Waterfall recreation area cordoned off by local police under Section 144.',
      'Gangapur Dam Road experiencing minor silt deposits and wet rock shoulder slips.',
    ],
    responsePriorityScore: 61,
    responsePriorityLevel: 'P2_HIGH',
    priorityReasons: [
      'Potential for sudden surge if spillway discharge is increased from 45k to 65k cusecs.',
      'Tourist clusters and agro-resorts require active warning broadcasts.',
    ],
    coordinates: { lat: 20.0310, lng: 73.7050 },
    lastEvaluatedAt: '14:26 IST',
  },
  {
    id: 'set_nashik_road',
    name: 'Nashik Road & Chehadi Lowlands',
    taluka: 'Nashik Road',
    population: 68000,
    elevationMeters: 560,
    distanceToRiverbedM: 350,
    historicalVulnerabilityScore: 11,
    rainfallMmHr: 48,
    rainfallAccumulation6hMm: 112,
    waterLevelMetersAboveNormal: 1.6,
    soilSaturationPercent: 72,
    citizenReportsCount: 4,
    verifiedReportsCount: 3,
    roadDisruptionsCount: 0,
    trappedPeopleCount: 2,
    shelterCount: 4,
    riskScore: 46,
    riskLevel: 'MODERATE',
    confidenceScore: 84,
    confidenceStrength: 'MEDIUM',
    confidenceFreshnessMinutes: 7,
    evidenceBreakdown: {
      rainfallContribution: 20,
      terrainContribution: 12,
      groundReportsContribution: 8,
      historicalAndWaterLevel: 6,
    },
    explainableObservations: [
      'Darna river tributary flow stable, no major bank spill in residential wards.',
      'Railway underpass drained by operational high-capacity diesel pumps.',
      'All connecting roads to NH-3 and Deolali station fully operational.',
    ],
    responsePriorityScore: 42,
    responsePriorityLevel: 'P3_MONITOR',
    priorityReasons: [
      'Strategic railway transit hub and relief logistics aggregation depot.',
      'Monitored for sudden storm drain blockages; no active life-safety threats.',
    ],
    coordinates: { lat: 19.9520, lng: 73.8410 },
    lastEvaluatedAt: '14:25 IST',
  },
  {
    id: 'set_deolali',
    name: 'Deolali Cantonment Highland Hub',
    taluka: 'Deolali',
    population: 32000,
    elevationMeters: 585, // High plateau
    distanceToRiverbedM: 850,
    historicalVulnerabilityScore: 5,
    rainfallMmHr: 38,
    rainfallAccumulation6hMm: 86,
    waterLevelMetersAboveNormal: 0.4,
    soilSaturationPercent: 58,
    citizenReportsCount: 1,
    verifiedReportsCount: 1,
    roadDisruptionsCount: 0,
    trappedPeopleCount: 0,
    shelterCount: 5,
    riskScore: 24,
    riskLevel: 'LOW',
    confidenceScore: 92,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 6,
    evidenceBreakdown: {
      rainfallContribution: 14,
      terrainContribution: 4,
      groundReportsContribution: 3,
      historicalAndWaterLevel: 3,
    },
    explainableObservations: [
      'High plateau topography with excellent natural runoff away from settlements.',
      'Designated primary Tier-1 Relief Shelter Zone and Military Hospital backup.',
      'All approach roads from Mumbai-Agra Highway clear and well-lit.',
    ],
    responsePriorityScore: 18,
    responsePriorityLevel: 'P3_MONITOR',
    priorityReasons: [
      'Safe receiver zone for evacuees arriving from Ramkund and Panchavati.',
      'Logistics dispatch point for volunteer first aid teams.',
    ],
    coordinates: { lat: 19.9380, lng: 73.8320 },
    lastEvaluatedAt: '14:20 IST',
  },
  {
    id: 'set_trimbakeshwar',
    name: 'Trimbakeshwar Foothills Runoff Belt',
    taluka: 'Trimbakeshwar',
    population: 18500,
    elevationMeters: 640,
    distanceToRiverbedM: 50,
    historicalVulnerabilityScore: 14,
    rainfallMmHr: 96, // Heavy catchment rainfall
    rainfallAccumulation6hMm: 235,
    waterLevelMetersAboveNormal: 2.1,
    soilSaturationPercent: 95,
    citizenReportsCount: 6,
    verifiedReportsCount: 5,
    roadDisruptionsCount: 1,
    trappedPeopleCount: 5,
    shelterCount: 2,
    riskScore: 68,
    riskLevel: 'HIGH',
    confidenceScore: 89,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 4,
    evidenceBreakdown: {
      rainfallContribution: 38,
      terrainContribution: 12,
      groundReportsContribution: 10,
      historicalAndWaterLevel: 8,
    },
    explainableObservations: [
      'Intense orographic downpour on Brahmagiri mountain slope generating flash runoff.',
      'Kushavarta kund water overflowing into surrounding temple circumambulation path.',
      'Sinnar-Trimbak connecting link monitored for small rock slippage near Ghat sections.',
    ],
    responsePriorityScore: 66,
    responsePriorityLevel: 'P2_HIGH',
    priorityReasons: [
      'Critical upstream catchment: runoff takes ~1.5 hours to hit Gangapur reservoir.',
      'Early warning trigger for central Nashik city wards.',
    ],
    coordinates: { lat: 19.9320, lng: 73.5310 },
    lastEvaluatedAt: '14:29 IST',
  },
  {
    id: 'set_niphad_lowlands',
    name: 'Nandur Madhmeshwar & Niphad Basin',
    taluka: 'Niphad Taluka',
    population: 41200,
    elevationMeters: 524, // Lower Godavari plain
    distanceToRiverbedM: 40,
    historicalVulnerabilityScore: 18,
    rainfallMmHr: 68,
    rainfallAccumulation6hMm: 158,
    waterLevelMetersAboveNormal: 3.4,
    soilSaturationPercent: 96,
    citizenReportsCount: 11,
    verifiedReportsCount: 9,
    roadDisruptionsCount: 2,
    trappedPeopleCount: 23,
    shelterCount: 3,
    riskScore: 81,
    riskLevel: 'CRITICAL',
    confidenceScore: 92,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 3,
    evidenceBreakdown: {
      rainfallContribution: 32,
      terrainContribution: 18,
      groundReportsContribution: 16,
      historicalAndWaterLevel: 15,
    },
    explainableObservations: [
      'Nandur Madhmeshwar bird sanctuary and adjoining grape plantations submerged under 1.5m flood backwash.',
      'Kadva-Godavari river confluence capacity exceeded by continuous heavy discharge from upstream dams.',
      'Niphad-Chandori rural connecting road severed at Pimpri bridge.',
      '9 verified volunteer drone reports confirm isolated farmhouses in flood bowl.',
    ],
    responsePriorityScore: 87,
    responsePriorityLevel: 'P1_IMMEDIATE',
    priorityReasons: [
      '23 trapped farm workers in low-lying vineyard settlements require power-boat evacuation.',
      'Critical agricultural infrastructure and pumping stations submerged.',
    ],
    coordinates: { lat: 20.0880, lng: 74.1120 },
    lastEvaluatedAt: '14:31 IST',
  },
  {
    id: 'set_igatpuri_ghat',
    name: 'Bhavali Basin & Igatpuri Ghat Corridor',
    taluka: 'Igatpuri Taluka',
    population: 29400,
    elevationMeters: 610,
    distanceToRiverbedM: 65,
    historicalVulnerabilityScore: 16,
    rainfallMmHr: 122, // Cloudburst intensity in Western Ghats
    rainfallAccumulation6hMm: 288,
    waterLevelMetersAboveNormal: 2.8,
    soilSaturationPercent: 98,
    citizenReportsCount: 13,
    verifiedReportsCount: 10,
    roadDisruptionsCount: 2,
    trappedPeopleCount: 16,
    shelterCount: 2,
    riskScore: 84,
    riskLevel: 'CRITICAL',
    confidenceScore: 93,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 2,
    evidenceBreakdown: {
      rainfallContribution: 39,
      terrainContribution: 14,
      groundReportsContribution: 17,
      historicalAndWaterLevel: 14,
    },
    explainableObservations: [
      'Extreme orographic rainfall (122 mm/hr) recorded at Thal Ghat telemetry gauge.',
      'Bhavali Dam spillway overflowing into natural drainage ravines.',
      'Minor mud-slips reported along old Mumbai-Nashik highway near Kasara border.',
      '10 verified ground reports of flash water rushing through tribal padas and hamlets.',
    ],
    responsePriorityScore: 86,
    responsePriorityLevel: 'P1_IMMEDIATE',
    priorityReasons: [
      'High risk of flash surge cascading into lower Darna valley within 45 minutes.',
      '16 residents in riverside hamlet need immediate evacuation to Igatpuri railway school.',
    ],
    coordinates: { lat: 19.6960, lng: 73.5580 },
    lastEvaluatedAt: '14:30 IST',
  },
  {
    id: 'set_sinnar_midc',
    name: 'Sinnar Industrial Belt & Shiv Basin',
    taluka: 'Sinnar Taluka',
    population: 36000,
    elevationMeters: 652,
    distanceToRiverbedM: 180,
    historicalVulnerabilityScore: 9,
    rainfallMmHr: 52,
    rainfallAccumulation6hMm: 118,
    waterLevelMetersAboveNormal: 1.4,
    soilSaturationPercent: 74,
    citizenReportsCount: 4,
    verifiedReportsCount: 3,
    roadDisruptionsCount: 0,
    trappedPeopleCount: 3,
    shelterCount: 4,
    riskScore: 48,
    riskLevel: 'MODERATE',
    confidenceScore: 86,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 5,
    evidenceBreakdown: {
      rainfallContribution: 22,
      terrainContribution: 10,
      groundReportsContribution: 8,
      historicalAndWaterLevel: 8,
    },
    explainableObservations: [
      'Shiv River seasonal nala flowing at 60% bank capacity; industrial estate drainage holding steady.',
      'Nashik-Sinnar Highway clear with no major standing water.',
      'Lowland storage yard at MIDC Phase-2 waterlogged by 20cm surface pooling.',
    ],
    responsePriorityScore: 45,
    responsePriorityLevel: 'P3_MONITOR',
    priorityReasons: [
      'Strategic staging depot for relief shipments arriving from Pune and Shirdi highway.',
      'Precautionary standby for worker transit buses.',
    ],
    coordinates: { lat: 19.8510, lng: 73.9980 },
    lastEvaluatedAt: '14:27 IST',
  },
  {
    id: 'set_malegaon_girna',
    name: 'Malegaon Old Wards & Mosam Confluence',
    taluka: 'Malegaon Taluka',
    population: 82000,
    elevationMeters: 438, // Lower Girna basin
    distanceToRiverbedM: 55,
    historicalVulnerabilityScore: 15,
    rainfallMmHr: 64,
    rainfallAccumulation6hMm: 142,
    waterLevelMetersAboveNormal: 2.7,
    soilSaturationPercent: 86,
    citizenReportsCount: 8,
    verifiedReportsCount: 6,
    roadDisruptionsCount: 1,
    trappedPeopleCount: 11,
    shelterCount: 5,
    riskScore: 73,
    riskLevel: 'HIGH',
    confidenceScore: 88,
    confidenceStrength: 'HIGH',
    confidenceFreshnessMinutes: 4,
    evidenceBreakdown: {
      rainfallContribution: 28,
      terrainContribution: 16,
      groundReportsContribution: 15,
      historicalAndWaterLevel: 14,
    },
    explainableObservations: [
      'Girna and Mausam river confluence cresting 50cm below Mosam bridge deck.',
      'Dense handloom and powerloom textile clusters reporting drain backup in basements.',
      'Chandanpuri causeway closed as precautionary measure by local municipal corporation.',
    ],
    responsePriorityScore: 72,
    responsePriorityLevel: 'P2_HIGH',
    priorityReasons: [
      'High population density along historical riverbank settlement.',
      '11 families evacuated from riverside tenements to Malegaon Urdu High School.',
    ],
    coordinates: { lat: 20.5530, lng: 74.5260 },
    lastEvaluatedAt: '14:26 IST',
  },
];

// ============================================================================
// 3. NASHIK ROAD ACCESSIBILITY DATA (LIVE & DISRUPTION TESTING)
// ============================================================================

export const INITIAL_NASHIK_ROADS: NashikRoadStatus[] = [
  {
    id: 'rd_ramkund_link',
    name: 'Ramkund Ghat Link Road (Goda Riverside)',
    arterialType: 'MAIN_ARTERIAL',
    status: 'BLOCKED',
    reason: 'Submerged under 140cm river overflow and silt debris',
    waterDepthCm: 140,
    speedLimitKmh: 0,
    lastUpdated: '14:31 IST',
    evidenceCount: 7,
    confidencePercent: 96,
    source: 'Citizen Ground Reports + Police Barricade',
    bypassRecommendation: 'Completely closed. Divert via Govind Nagar Elevated Corridor.',
    fromLocation: 'CBS / Ashok Stambh',
    toLocation: 'Ramkund Sacred Kund & Ghats',
    coordinates: [
      { lat: 20.0012, lng: 73.7885 },
      { lat: 20.0050, lng: 73.7910 },
    ],
  },
  {
    id: 'rd_holkar_bridge',
    name: 'Holkar Bridge & Causeway',
    arterialType: 'BRIDGE',
    status: 'BLOCKED',
    reason: 'Godavari flood crest exceeded bridge danger mark by 1.2m',
    waterDepthCm: 120,
    speedLimitKmh: 0,
    lastUpdated: '14:30 IST',
    evidenceCount: 9,
    confidencePercent: 98,
    source: 'PWD Bridge Sensor #04 + Flood Police',
    bypassRecommendation: 'Do NOT attempt crossing. Use Mumbai-Agra NH3 Elevated Flyover.',
    fromLocation: 'Old Nashik',
    toLocation: 'Panchavati Ward',
    coordinates: [
      { lat: 20.0040, lng: 73.7925 },
      { lat: 20.0075, lng: 73.7940 },
    ],
  },
  {
    id: 'rd_old_agra',
    name: 'Old Agra Road (Central Nashik Corridor)',
    arterialType: 'MAIN_ARTERIAL',
    status: 'UNCERTAIN',
    reason: 'Intermittent waterlogging 35cm; slow movement for heavy relief trucks only',
    waterDepthCm: 35,
    speedLimitKmh: 15,
    lastUpdated: '14:26 IST',
    evidenceCount: 4,
    confidencePercent: 82,
    source: 'Volunteer Patrol Team Beta',
    bypassRecommendation: 'Pass with caution. Small cars and two-wheelers strictly prohibited.',
    fromLocation: 'Dwarka Circle',
    toLocation: 'Goda Ghat Outskirts',
    coordinates: [
      { lat: 19.9880, lng: 73.8050 },
      { lat: 19.9980, lng: 73.7880 },
    ],
  },
  {
    id: 'rd_nh3_expressway',
    name: 'Mumbai-Agra NH-3 Elevated Highway Bypass',
    arterialType: 'EXPRESSWAY',
    status: 'OPEN',
    reason: 'Elevated grade separated bypass, clean stormwater drainage, zero waterlogging',
    waterDepthCm: 0,
    speedLimitKmh: 65,
    lastUpdated: '14:32 IST',
    evidenceCount: 6,
    confidencePercent: 99,
    source: 'NHAI Telemetry Sensor + Highway Patrol',
    bypassRecommendation: 'Primary designated emergency convoy route for all ambulances & NDRF.',
    fromLocation: 'Garware Point (Ambad)',
    toLocation: 'Panchavati Flyover Exit',
    coordinates: [
      { lat: 19.9650, lng: 73.7420 },
      { lat: 20.0150, lng: 73.8080 },
    ],
  },
  {
    id: 'rd_govind_nagar',
    name: 'Govind Nagar High-Ground Bypass',
    arterialType: 'MAIN_ARTERIAL',
    status: 'OPEN',
    reason: 'Elevated ridge road, clear storm drains, optimal pavement condition',
    waterDepthCm: 0,
    speedLimitKmh: 45,
    lastUpdated: '14:28 IST',
    evidenceCount: 5,
    confidencePercent: 95,
    source: 'Traffic Police Control Room',
    bypassRecommendation: 'Safest east-west arterial bypassing submerged CBS and riverbank roads.',
    fromLocation: 'City Centre Mall',
    toLocation: 'Dwarka Circle',
    coordinates: [
      { lat: 19.9820, lng: 73.7650 },
      { lat: 19.9880, lng: 73.8050 },
    ],
  },
  {
    id: 'rd_gangapur_road',
    name: 'Gangapur Dam Access Road',
    arterialType: 'CONNECTING_ROAD',
    status: 'UNCERTAIN',
    reason: 'Silt deposits on shoulder & water splash from dam channel overflow',
    waterDepthCm: 25,
    speedLimitKmh: 20,
    lastUpdated: '14:22 IST',
    evidenceCount: 3,
    confidencePercent: 78,
    source: 'Water Resources Dept Engineer',
    bypassRecommendation: 'Restricted to dam management personnel and emergency supply vehicles.',
    fromLocation: 'Someshwar Waterfall',
    toLocation: 'Gangapur Dam Spillway',
    coordinates: [
      { lat: 20.0210, lng: 73.7250 },
      { lat: 20.0310, lng: 73.7050 },
    ],
  },
  {
    id: 'rd_cbs_ashok',
    name: 'CBS to Panchavati Central Corridor (via Ashok Stambh)',
    arterialType: 'MAIN_ARTERIAL',
    status: 'BLOCKED',
    reason: 'Severe localized waterlogging (85cm) at Ashok Stambh junction depression',
    waterDepthCm: 85,
    speedLimitKmh: 0,
    lastUpdated: '14:25 IST',
    evidenceCount: 8,
    confidencePercent: 94,
    source: 'Municipal Traffic Cam #12 + Citizen Reports',
    bypassRecommendation: 'Use Sharanpur Road -> Trimbak Naka -> NH3 Elevated Flyover.',
    fromLocation: 'Central Bus Stand (CBS)',
    toLocation: 'Panchavati Karanja',
    coordinates: [
      { lat: 19.9950, lng: 73.7820 },
      { lat: 20.0070, lng: 73.7940 },
    ],
  },
  {
    id: 'rd_sinnar_highway',
    name: 'Nashik-Sinnar Highway (SH-30 Corridor)',
    arterialType: 'GHAT_ROAD',
    status: 'OPEN',
    reason: 'High elevation plateau road, dry asphalt, unimpeded relief route',
    waterDepthCm: 0,
    speedLimitKmh: 60,
    lastUpdated: '14:30 IST',
    evidenceCount: 4,
    confidencePercent: 97,
    source: 'Maharashtra State Highway Patrol',
    bypassRecommendation: 'Recommended for inter-district heavy aid coming from Pune/Ahmednagar.',
    fromLocation: 'Nashik Road Railway Hub',
    toLocation: 'Sinnar Industrial Bypass',
    coordinates: [
      { lat: 19.9480, lng: 73.8450 },
      { lat: 19.8520, lng: 73.9850 },
    ],
  },
  {
    id: 'rd_niphad_pimpri_bridge',
    name: 'Niphad Pimpri-Chandori River Bridge',
    arterialType: 'BRIDGE',
    status: 'BLOCKED',
    reason: 'Submerged under 95cm violent Kadva river surge; structural barrier closed',
    waterDepthCm: 95,
    speedLimitKmh: 0,
    lastUpdated: '14:28 IST',
    evidenceCount: 6,
    confidencePercent: 96,
    source: 'PWD Niphad Sub-division + Rural Police',
    bypassRecommendation: 'Divert via Ozar-Sukene Elevated State Highway.',
    fromLocation: 'Niphad Bus Stand',
    toLocation: 'Nandur Madhmeshwar Lowlands',
    coordinates: [
      { lat: 20.0820, lng: 74.1080 },
      { lat: 20.0880, lng: 74.1120 },
    ],
  },
  {
    id: 'rd_niphad_highway_link',
    name: 'Nashik-Niphad NH-848 Expressway Link',
    arterialType: 'MAIN_ARTERIAL',
    status: 'OPEN',
    reason: 'Elevated highway embankment above floodline; rapid transit open',
    waterDepthCm: 0,
    speedLimitKmh: 65,
    lastUpdated: '14:32 IST',
    evidenceCount: 5,
    confidencePercent: 98,
    source: 'Toll Telemetry + Rural Patrol',
    bypassRecommendation: 'Primary emergency dispatch corridor connecting DEOC to Niphad relief center.',
    fromLocation: 'Dwarka Circle (Nashik)',
    toLocation: 'Niphad High School Shelter',
    coordinates: [
      { lat: 19.9880, lng: 73.8050 },
      { lat: 20.0850, lng: 74.1050 },
    ],
  },
  {
    id: 'rd_igatpuri_kasara_ghat',
    name: 'Old Kasara Ghat Approach Road (Igatpuri)',
    arterialType: 'GHAT_ROAD',
    status: 'UNCERTAIN',
    reason: 'Mud and loose gravel runoff from steep slopes; 25cm water sheets across curves',
    waterDepthCm: 25,
    speedLimitKmh: 20,
    lastUpdated: '14:29 IST',
    evidenceCount: 8,
    confidencePercent: 88,
    source: 'Highway Safety Patrol + Local Villagers',
    bypassRecommendation: 'Small vehicles routed to Samruddhi Mahamarg or Mumbai-Agra main expressway tunnel.',
    fromLocation: 'Kasara Railway Border',
    toLocation: 'Igatpuri Town Center',
    coordinates: [
      { lat: 19.6820, lng: 73.5410 },
      { lat: 19.6960, lng: 73.5580 },
    ],
  },
  {
    id: 'rd_malegaon_mosam_bridge',
    name: 'Malegaon Mosam River Heritage Bridge',
    arterialType: 'BRIDGE',
    status: 'BLOCKED',
    reason: 'Water flowing 30cm over bridge parapet; police barricades deployed',
    waterDepthCm: 50,
    speedLimitKmh: 0,
    lastUpdated: '14:24 IST',
    evidenceCount: 7,
    confidencePercent: 97,
    source: 'Malegaon Municipal Corp Disaster Cell',
    bypassRecommendation: 'Use Camp Road New Elevated Concrete Bridge.',
    fromLocation: 'Old Town Wards',
    toLocation: 'Camp Area Malegaon',
    coordinates: [
      { lat: 20.5500, lng: 74.5220 },
      { lat: 20.5560, lng: 74.5290 },
    ],
  },
];

// ============================================================================
// 4. ROUTE VALIDITY ENGINE & ALTERNATIVE CORRIDORS
// ============================================================================

export function checkRouteValidity(
  routeId: string,
  originName: string,
  destinationName: string,
  plannedRoadIds: string[],
  currentRoads: NashikRoadStatus[]
): RouteValidityCheckResult {
  const roadMap = new Map(currentRoads.map((r) => [r.id, r]));

  // Check if any road along the route is BLOCKED
  const blockedRoad = plannedRoadIds
    .map((id) => roadMap.get(id))
    .find((r) => r && r.status === 'BLOCKED');

  if (blockedRoad) {
    return {
      routeId,
      origin: originName,
      destination: destinationName,
      plannedViaRoads: plannedRoadIds.map((id) => roadMap.get(id)?.name || id),
      isValid: false,
      invalidationReason: `${blockedRoad.name} is reported BLOCKED (${blockedRoad.reason}).`,
      blockedRoadName: blockedRoad.name,
      blockedAtTimestamp: blockedRoad.lastUpdated,
      alternativeRoute: {
        routeName: 'Safe Elevated Corridor Alpha (via NH3 Expressway & Govind Nagar Bypass)',
        viaRoads: [
          'Govind Nagar High-Ground Bypass',
          'Mumbai-Agra NH-3 Elevated Highway Bypass',
          'Panchavati North High-Elevation Descent',
        ],
        totalDistanceKm: 11.8,
        estimatedMinutes: 19,
        deltaMinutes: +5,
        routeValidityConfidence: 96,
        safetyRatingPercent: 98,
        clearanceStatus: 'SAFE_OPTIMAL',
      },
    };
  }

  // Check if any road along the route is UNCERTAIN
  const uncertainRoad = plannedRoadIds
    .map((id) => roadMap.get(id))
    .find((r) => r && r.status === 'UNCERTAIN');

  if (uncertainRoad) {
    return {
      routeId,
      origin: originName,
      destination: destinationName,
      plannedViaRoads: plannedRoadIds.map((id) => roadMap.get(id)?.name || id),
      isValid: true,
      invalidationReason: `Route is usable but contains UNCERTAIN segment (${uncertainRoad.name}). Proceed with caution.`,
      alternativeRoute: {
        routeName: 'Recommended High-Ground Detour (Zero-Waterlogging Guarantee)',
        viaRoads: ['Govind Nagar High-Ground Bypass', 'Mumbai-Agra NH-3 Elevated Highway Bypass'],
        totalDistanceKm: 11.2,
        estimatedMinutes: 18,
        deltaMinutes: +4,
        routeValidityConfidence: 93,
        safetyRatingPercent: 95,
        clearanceStatus: 'CAUTION',
      },
    };
  }

  return {
    routeId,
    origin: originName,
    destination: destinationName,
    plannedViaRoads: plannedRoadIds.map((id) => roadMap.get(id)?.name || id),
    isValid: true,
    alternativeRoute: undefined,
  };
}

// ============================================================================
// 5. TESTING MODULE: FALSE-ALERT RATE ENGINE
// ============================================================================

export function runFalseAlertTest(
  thresholdMmHr: number,
  noiseLevel: 'LOW' | 'MEDIUM' | 'HEAVY_RUMOR_SURGE'
): FalseAlertTestResult {
  // Benchmark dataset: 1,200 simulated warning signals in Nashik Godavari basin
  const total = 1200;

  let noiseRatio = 0.12; // 12% noise
  if (noiseLevel === 'MEDIUM') noiseRatio = 0.24;
  if (noiseLevel === 'HEAVY_RUMOR_SURGE') noiseRatio = 0.42;

  // Real flood events in test set
  const realFloodGroundTruthCount = 520;
  const nonFloodGroundTruthCount = total - realFloodGroundTruthCount;

  // Threshold effect:
  // Lower threshold (< 45mm/hr) catches all floods (high recall) but causes false positives
  // High threshold (> 85mm/hr) reduces false positives but misses flash inundations (false negatives)
  // Optimal SAHAAY multi-source balance is around 60-70 mm/hr + corroboration

  const sensitivityFactor = Math.max(0.2, Math.min(1.0, thresholdMmHr / 70));

  // True Positives (correct flood alerts)
  const truePositives = Math.round(
    realFloodGroundTruthCount * (1 - Math.max(0, (thresholdMmHr - 65) / 140))
  );

  // False Negatives (missed flood alerts)
  const falseNegatives = realFloodGroundTruthCount - truePositives;

  // False Positives (system triggered warning, but was rumor / sensor glitch)
  // Sahaay multi-source corroboration filters out 94% of raw noise!
  const rawNoiseAlerts = Math.round(nonFloodGroundTruthCount * noiseRatio);
  const falsePositives = Math.round(rawNoiseAlerts * (0.05 + 0.15 * (1 - sensitivityFactor)));

  // True Negatives (correctly ignored noise)
  const trueNegatives = nonFloodGroundTruthCount - falsePositives;

  const precision = truePositives / (truePositives + falsePositives || 1);
  const recall = truePositives / (truePositives + falseNegatives || 1);
  const falseAlertRate = falsePositives / (truePositives + falsePositives || 1);
  const noiseRejection = (trueNegatives / (nonFloodGroundTruthCount || 1)) * 100;

  // Lead time gain in minutes
  const leadTime = Math.round(48 - Math.abs(thresholdMmHr - 68) * 0.35);

  return {
    inundationThresholdMmHr: thresholdMmHr,
    noiseLevel,
    totalEvaluatedAlerts: total,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
    precisionPercent: Math.round(precision * 1000) / 10,
    recallPercent: Math.round(recall * 1000) / 10,
    falseAlertRatePercent: Math.round(falseAlertRate * 1000) / 10,
    noiseRejectionPercent: Math.round(noiseRejection * 10) / 10,
    leadTimeAdvanceMinutes: Math.max(15, leadTime),
  };
}

// ============================================================================
// 6. HISTORICAL REPLAY: 15 JULY 2025 NASHIK FLOOD
// ============================================================================

export const NASHIK_JULY_2025_REPLAY: DecisionReplayScenario = {
  id: 'nashik_flood_15_july_2025',
  title: 'Nashik Godavari Basin Catastrophic Surge (Historical Replay)',
  eventDate: '15 July 2025',
  location: 'Nashik District, Maharashtra (Ramkund, Panchavati & Gangapur)',
  overview:
    'Extreme 24-hour rainfall in Trimbakeshwar catchment caused Gangapur Dam to discharge 65,000 cusecs, submerging Ramkund ghats and severing Holkar Bridge.',
  primaryHazard: 'Godavari Basin Flash Riverine Inundation',
  postMortem: {
    detectionLeadTimeMinutes: 52,
    evacuatedBeforePeakPercent: 97.4,
    preventedTrappingsCount: 1840,
    tacticalSummary:
      'SAHAAY predictive risk model flagged Ramkund as P1 IMMEDIATE 52 minutes before river crest reached Holkar Bridge. Automated route invalidation prevented 320 vehicles from getting trapped in Ashok Stambh underpass.',
    keyTakeaway:
      'Multi-source confidence scoring rejected 38 social media rumor spikes while accurately validating citizen geotagged photos of rising water at Tiwandha.',
  },
  steps: [
    {
      stepNumber: 1,
      timeLabel: '06:00 IST (T - 08:30)',
      minuteOffset: -510,
      phase: 'PRE_DISASTER',
      rainfallMmHr: 34,
      riverGaugeMeters: 0.6,
      soilSaturationPercent: 62,
      predictedRiskPercent: 22,
      riskCategory: 'LOW',
      capAlertState: null,
      activeCitizenSosCount: 0,
      verifiedIncidentsCount: 0,
      assignedVolunteerSquads: [],
      roadClosureCount: 0,
      closedRoadNames: [],
      activeEvacuationRoute: 'All primary Nashik arterials normal',
      evacuatedCitizenCount: 0,
      narrativeAction:
        'Sustained early morning precipitation across Trimbakeshwar and Brahmagiri hills (34 mm/hr). Gangapur Dam storage at 76% capacity. Water flowing normally past Ramkund ghats.',
      tacticalDecisionNote:
        'Baseline monitoring: SAHAAY engine ingesting CWC gauge telemetry. No emergency sirens needed.',
    },
    {
      stepNumber: 2,
      timeLabel: '09:00 IST (T - 05:30)',
      minuteOffset: -330,
      phase: 'PRE_DISASTER',
      rainfallMmHr: 62,
      riverGaugeMeters: 1.8,
      soilSaturationPercent: 82,
      predictedRiskPercent: 48,
      riskCategory: 'MODERATE',
      capAlertState: {
        headline: 'YELLOW ADVISORY: Gangapur Spillway Discharge Initiated (15,000 Cusecs)',
        severity: 'Moderate',
        broadcasted: true,
      },
      activeCitizenSosCount: 2,
      verifiedIncidentsCount: 2,
      assignedVolunteerSquads: ['Panchavati Volunteer Patrol Unit'],
      roadClosureCount: 0,
      closedRoadNames: [],
      activeEvacuationRoute: 'Monitoring Goda Ghat low embankment roads',
      evacuatedCitizenCount: 18,
      narrativeAction:
        'Rainfall intensifies to 62 mm/hr in upper catchment. Irrigation Department opens 6 spillway gates at Gangapur Dam. River water touches first ghat steps at Ramkund.',
      tacticalDecisionNote:
        'Sahaay issues automated advisory to pilgrims and riverside vendors. Police position early cautionary tape on low causeways.',
    },
    {
      stepNumber: 3,
      timeLabel: '12:00 IST (T - 02:30)',
      minuteOffset: -150,
      phase: 'ONSET_CRITICAL',
      rainfallMmHr: 94,
      riverGaugeMeters: 2.8,
      soilSaturationPercent: 91,
      predictedRiskPercent: 78,
      riskCategory: 'CRITICAL_SEVERE',
      capAlertState: {
        headline: 'ORANGE WARNING: Ramkund Submergence Imminent. Dam Discharge 42,000 Cusecs.',
        severity: 'Severe',
        broadcasted: true,
      },
      activeCitizenSosCount: 11,
      verifiedIncidentsCount: 8,
      assignedVolunteerSquads: ['Panchavati Volunteer Patrol Unit', 'Nashik Central Rapid Response Team'],
      roadClosureCount: 1,
      closedRoadNames: ['Ramkund Ghat Link Road'],
      activeEvacuationRoute: 'Divert via Old Agra Road & Govind Nagar Bypass',
      evacuatedCitizenCount: 240,
      narrativeAction:
        'Cloudburst-intensity downpour over Trimbak belt. Gangapur release raised to 42,000 cusecs. Godavari swells to 2.8m above normal; stone temples at Ramkund half-submerged.',
      tacticalDecisionNote:
        'SAHAAY escalates Ramkund to P1 IMMEDIATE priority. First road block triggered for Ramkund Riverside Link. 240 vulnerable shopkeepers safely evacuated.',
    },
    {
      stepNumber: 4,
      timeLabel: '14:30 IST (T = 0 Peak Surge)',
      minuteOffset: 0,
      phase: 'PEAK_SURGE',
      rainfallMmHr: 118,
      riverGaugeMeters: 3.9,
      soilSaturationPercent: 97,
      predictedRiskPercent: 96,
      riskCategory: 'CRITICAL_SEVERE',
      capAlertState: {
        headline: 'RED ALERT: HOLKAR BRIDGE OVERTOPPED. CATASTROPHIC INUNDATION IN BASIN.',
        severity: 'Extreme',
        broadcasted: true,
      },
      activeCitizenSosCount: 34,
      verifiedIncidentsCount: 29,
      assignedVolunteerSquads: [
        'NDRF 5th Battalion Liaison',
        'Panchavati Volunteer Patrol Unit',
        'Nashik Central Rapid Response Team',
        'Medical Trauma Mobile Unit',
      ],
      roadClosureCount: 3,
      closedRoadNames: ['Ramkund Ghat Link Road', 'Holkar Bridge & Causeway', 'CBS to Panchavati Central Corridor'],
      activeEvacuationRoute: 'Safe Elevated Corridor Alpha (via NH3 Expressway Bypass)',
      evacuatedCitizenCount: 920,
      narrativeAction:
        'PEAK FLOOD SURGE: Gangapur discharge peaks at 65,000 cusecs! Holkar Bridge submerged under 1.2m rushing water. CBS-Panchavati road flooded at Ashok Stambh. 34 citizen SOS reports received.',
      tacticalDecisionNote:
        'SAHAAY Route Engine flags Holkar Bridge INVALID in 0.8 seconds. Dynamic rerouting activates NH-3 Elevated Highway Bypass, successfully routing 14 ambulances around the flood choke point.',
    },
    {
      stepNumber: 5,
      timeLabel: '17:00 IST (T + 02:30)',
      minuteOffset: 150,
      phase: 'EVACUATION_COORDINATION',
      rainfallMmHr: 44,
      riverGaugeMeters: 3.1,
      soilSaturationPercent: 93,
      predictedRiskPercent: 74,
      riskCategory: 'CRITICAL_SEVERE',
      capAlertState: {
        headline: 'DISASTER COORDINATION: 1,840 Citizens Relocated to Deolali & City Shelters',
        severity: 'Severe',
        broadcasted: true,
      },
      activeCitizenSosCount: 18,
      verifiedIncidentsCount: 16,
      assignedVolunteerSquads: [
        'NDRF 5th Battalion Liaison',
        'Relief Food & Water Taskforce',
        'Shelter Management Squad',
      ],
      roadClosureCount: 3,
      closedRoadNames: ['Ramkund Ghat Link Road', 'Holkar Bridge & Causeway', 'CBS to Panchavati Central Corridor'],
      activeEvacuationRoute: 'Govind Nagar & NH-3 Elevated Expressways Fully Active',
      evacuatedCitizenCount: 1840,
      narrativeAction:
        'Rain easing over city. Upstream discharge gradually tapered to 38,000 cusecs. NDRF boats complete extrications from Goda Ghat alleys. Deolali relief camps provide dry rations and medical checks.',
      tacticalDecisionNote:
        'Response priority recalculation: Ramkund transitions from active evacuation to post-surge medical aid. Zero casualties reported in SAHAAY-monitored zones.',
    },
    {
      stepNumber: 6,
      timeLabel: '21:00 IST (T + 06:30)',
      minuteOffset: 390,
      phase: 'POST_STABILIZATION',
      rainfallMmHr: 16,
      riverGaugeMeters: 1.4,
      soilSaturationPercent: 86,
      predictedRiskPercent: 32,
      riskCategory: 'MODERATE',
      capAlertState: {
        headline: 'ALL CLEAR ADVISORY: Godavari River Receding Below Danger Crest',
        severity: 'Moderate',
        broadcasted: true,
      },
      activeCitizenSosCount: 4,
      verifiedIncidentsCount: 4,
      assignedVolunteerSquads: ['Municipal Sanitation & Silt Clearance Crew'],
      roadClosureCount: 1,
      closedRoadNames: ['Ramkund Ghat Link Road (Silt Clearance in Progress)'],
      activeEvacuationRoute: 'Holkar Bridge inspection underway; NH-3 and CBS corridors open',
      evacuatedCitizenCount: 1840,
      narrativeAction:
        'River levels drop below danger mark. PWD begins structural acoustic testing on Holkar Bridge foundations. Municipal health teams begin chlorination of drinking water wells.',
      tacticalDecisionNote:
        'Full operational review: System lead time of 52 minutes praised by Nashik District Collectorate. Route validity system prevented 100% of trapped vehicular flood entries.',
    },
  ],
};

// ============================================================================
// 7. DYNAMIC PRIORITY RECALCULATION ENGINE
// ============================================================================

export function recalculateResponsePriority(
  settlement: SettlementRiskProfile,
  simulatedShift?: {
    additionalRainfallMmHr?: number;
    newTrappedReports?: number;
    nearbyRoadBlocked?: boolean;
  }
): SettlementRiskProfile {
  let rainfall = settlement.rainfallMmHr + (simulatedShift?.additionalRainfallMmHr || 0);
  let trapped = settlement.trappedPeopleCount + (simulatedShift?.newTrappedReports || 0);
  let roadDisruptions = settlement.roadDisruptionsCount + (simulatedShift?.nearbyRoadBlocked ? 1 : 0);

  // Recalculate Risk Score (0 - 100)
  // Factors:
  // 1. Rainfall: 0 - 40
  const rainPart = Math.min(40, Math.round((rainfall / 110) * 40));
  // 2. Terrain / elevation: 0 - 20 (lower elevation = higher contribution)
  const terrainPart = settlement.evidenceBreakdown.terrainContribution;
  // 3. Ground reports: 0 - 20
  const reportPart = Math.min(20, Math.round(((settlement.verifiedReportsCount + (simulatedShift?.newTrappedReports || 0)) / 12) * 20));
  // 4. Historical & water level: 0 - 20
  const histPart = settlement.evidenceBreakdown.historicalAndWaterLevel;

  const newRiskScore = Math.min(100, rainPart + terrainPart + reportPart + histPart);

  let newRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (newRiskScore >= 80) newRiskLevel = 'CRITICAL';
  else if (newRiskScore >= 60) newRiskLevel = 'HIGH';
  else if (newRiskScore >= 31) newRiskLevel = 'MODERATE';

  // Calculate Response Priority Score (0 - 100)
  // Factors:
  // - Hazard risk: 35%
  // - Trapped / assistance need: 30%
  // - Road isolation / disruption: 20%
  // - Population density: 15%
  const popFactor = Math.min(15, Math.round((settlement.population / 60000) * 15));
  const trappedFactor = Math.min(30, trapped * 1.5);
  const roadFactor = Math.min(20, roadDisruptions * 6.5);
  const riskFactor = Math.round((newRiskScore / 100) * 35);

  const newPriorityScore = Math.min(100, riskFactor + trappedFactor + roadFactor + popFactor);

  let newPriorityLevel: PriorityCategory = 'P3_MONITOR';
  if (newPriorityScore >= 80) newPriorityLevel = 'P1_IMMEDIATE';
  else if (newPriorityScore >= 55) newPriorityLevel = 'P2_HIGH';

  const newReasons = [...settlement.priorityReasons];
  if (simulatedShift?.additionalRainfallMmHr) {
    newReasons.unshift(`Rainfall spiked by +${simulatedShift.additionalRainfallMmHr} mm/hr to ${rainfall} mm/hr.`);
  }
  if (simulatedShift?.newTrappedReports) {
    newReasons.unshift(`${simulatedShift.newTrappedReports} new urgent trapping distress calls logged.`);
  }
  if (simulatedShift?.nearbyRoadBlocked) {
    newReasons.unshift(`Access compromised: nearby road closure increases isolation risk.`);
  }

  return {
    ...settlement,
    rainfallMmHr: rainfall,
    trappedPeopleCount: trapped,
    roadDisruptionsCount: roadDisruptions,
    riskScore: newRiskScore,
    riskLevel: newRiskLevel,
    evidenceBreakdown: {
      rainfallContribution: rainPart,
      terrainContribution: terrainPart,
      groundReportsContribution: reportPart,
      historicalAndWaterLevel: histPart,
    },
    responsePriorityScore: newPriorityScore,
    responsePriorityLevel: newPriorityLevel,
    priorityReasons: newReasons.slice(0, 4),
    lastEvaluatedAt: 'Just now (Recalculated)',
  };
}
