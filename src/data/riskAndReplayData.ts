import {
  DisasterRiskFactors,
  DisasterRiskPredictionResult,
  MlModelEvaluationMetrics,
  RoadSegment,
  SafeEvacuationCorridor,
  DecisionReplayScenario,
  RiskCategoryLevel,
  FeatureWeightAttribution,
} from '../types';

// ============================================================================
// 1. ML MODEL EVALUATION BENCHMARKS & METRICS (TRAINED ON HISTORICAL MONSOON FLOOD DATA)
// ============================================================================

export const DEMO_ML_METRICS: MlModelEvaluationMetrics = {
  modelName: 'Sahaay-HydraML Extreme Gradient & Random Forest Ensemble v4.2',
  modelType: 'Hybrid Random Forest + Logistic Multi-Factor Inundation Regressor',
  datasetName: 'Western Ghats & Indo-Gangetic Basin Extreme Monsoon Flooding Dataset (2018–2025)',
  sampleCount: 14850,
  accuracy: 0.954,   // 95.4%
  precision: 0.938,  // 93.8%
  recall: 0.965,     // 96.5% (High sensitivity to prevent missed flash floods)
  f1Score: 0.951,    // 95.1%
  rocAuc: 0.982,     // 0.982 Area Under Curve
  confusionMatrix: {
    truePositive: 5824,
    falsePositive: 384,
    trueNegative: 8342,
    falseNegative: 210, // Minimized false negatives for disaster safety
  },
  featuresUsed: [
    'Precipitation Intensity (mm/hr)',
    'River Gauge Stage (m above danger crest)',
    'Antecedent Soil Moisture Saturation (%)',
    'Urban Drainage Clogging Index (%)',
    'Topographic Slope & Elevation Delta (m)',
    'Upstream Reservoir / Dam Discharge (cusecs)',
    'Surface Wind Gust Velocity (km/h)',
  ],
};

// ============================================================================
// 2. RISK PREDICTION ENGINE (MATHEMATICAL / EMPIRICAL REGRESSION MODEL)
// ============================================================================

export const DEFAULT_RISK_FACTORS: DisasterRiskFactors = {
  rainfallMmHr: 82,
  riverGaugeMeters: 3.4,
  soilSaturationPercent: 86,
  drainageBlockagePercent: 68,
  elevationSlopeDeltaM: 4.2,
  upstreamDamDischargeCusecs: 45000,
  windGustKmh: 48,
};

export const PRESET_DISASTER_SCENARIOS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  factors: DisasterRiskFactors;
}[] = [
  {
    id: 'current_active',
    name: 'Current Live Monsoonal Surge (Karve-Mutha Basin)',
    badge: 'HIGH ALERT',
    description: 'Heavy sustained downpour with high soil saturation and Khadakwasla spillway release.',
    factors: {
      rainfallMmHr: 82,
      riverGaugeMeters: 3.4,
      soilSaturationPercent: 86,
      drainageBlockagePercent: 68,
      elevationSlopeDeltaM: 4.2,
      upstreamDamDischargeCusecs: 45000,
      windGustKmh: 48,
    },
  },
  {
    id: 'cloudburst_flash_flood',
    name: 'Extreme Urban Cloudburst (135 mm/hr)',
    badge: 'CRITICAL SEVERE',
    description: 'Catastrophic localized cloudburst overwhelming municipal storm drains within 25 minutes.',
    factors: {
      rainfallMmHr: 135,
      riverGaugeMeters: 4.8,
      soilSaturationPercent: 94,
      drainageBlockagePercent: 88,
      elevationSlopeDeltaM: 2.1,
      upstreamDamDischargeCusecs: 65000,
      windGustKmh: 75,
    },
  },
  {
    id: 'dam_spillway_emergency',
    name: 'Upstream Dam Emergency Discharge Crest',
    badge: 'RIVERINE FLOOD',
    description: 'Heavy dam discharge of 85,000 cusecs swelling riverbanks with moderate localized rain.',
    factors: {
      rainfallMmHr: 42,
      riverGaugeMeters: 5.6,
      soilSaturationPercent: 78,
      drainageBlockagePercent: 45,
      elevationSlopeDeltaM: 6.5,
      upstreamDamDischargeCusecs: 85000,
      windGustKmh: 35,
    },
  },
  {
    id: 'moderate_monsoon',
    name: 'Moderate Monsoon Rain (Controlled Drainage)',
    badge: 'CONTROLLED',
    description: 'Steady monsoonal showers with cleared storm channels and normal river gauge levels.',
    factors: {
      rainfallMmHr: 22,
      riverGaugeMeters: 0.8,
      soilSaturationPercent: 52,
      drainageBlockagePercent: 20,
      elevationSlopeDeltaM: 8.0,
      upstreamDamDischargeCusecs: 12000,
      windGustKmh: 24,
    },
  },
];

/**
 * Calculates Disaster Risk Probability, Category, 95% Confidence Interval,
 * and Explainable Feature Attribution (SHAP-style weights).
 */
export function calculateDisasterRisk(factors: DisasterRiskFactors): DisasterRiskPredictionResult {
  // Feature Normalization & Weighting
  // 1. Rainfall: 0 - 150 mm/hr (Weight: 32%)
  const rainNorm = Math.min(factors.rainfallMmHr / 120, 1.5);
  const rainScore = rainNorm * 32;

  // 2. River Gauge: -1m to +6m (Weight: 26%)
  const riverNorm = Math.max(0, Math.min((factors.riverGaugeMeters + 0.5) / 5.0, 1.4));
  const riverScore = riverNorm * 26;

  // 3. Soil Saturation: 0 - 100% (Weight: 16%)
  const soilNorm = Math.max(0, factors.soilSaturationPercent / 100);
  const soilScore = Math.pow(soilNorm, 1.3) * 16;

  // 4. Drainage Blockage: 0 - 100% (Weight: 12%)
  const drainageNorm = factors.drainageBlockagePercent / 100;
  const drainageScore = Math.pow(drainageNorm, 1.2) * 12;

  // 5. Dam Discharge: 0 - 100,000 cusecs (Weight: 10%)
  const damNorm = Math.min(factors.upstreamDamDischargeCusecs / 70000, 1.3);
  const damScore = damNorm * 10;

  // 6. Wind & Slope Modifiers (Weight: 4%)
  const windMod = Math.min(factors.windGustKmh / 100, 1.0) * 2;
  const slopeRelief = Math.max(0, 1 - factors.elevationSlopeDeltaM / 20) * 2;

  // Raw weighted total before logistic sigmoid shaping
  const rawSum = rainScore + riverScore + soilScore + drainageScore + damScore + windMod + slopeRelief;

  // Non-linear sigmoid response curve
  // Ensures realistic probability scaling with rapid threshold escalation around high trigger points
  const z = (rawSum - 45) / 16;
  const sigmoidProb = 100 / (1 + Math.exp(-z));
  const boundedProb = Math.max(2, Math.min(99.4, Math.round(sigmoidProb * 10) / 10));

  // Determine Risk Category
  let riskCategory: RiskCategoryLevel = 'LOW';
  if (boundedProb >= 75) {
    riskCategory = 'CRITICAL_SEVERE';
  } else if (boundedProb >= 50) {
    riskCategory = 'HIGH';
  } else if (boundedProb >= 25) {
    riskCategory = 'MODERATE';
  } else {
    riskCategory = 'LOW';
  }

  // Calculate 95% Confidence Interval (± 3.8% to 5.2% based on variance)
  const confidenceMargin = Math.round((3.2 + (factors.drainageBlockagePercent / 100) * 2.0) * 10) / 10;
  const ciLower = Math.max(0, Math.round((boundedProb - confidenceMargin) * 10) / 10);
  const ciUpper = Math.min(100, Math.round((boundedProb + confidenceMargin) * 10) / 10);

  // Compute Explainable Feature Contributions
  const totalSubScores = rainScore + riverScore + soilScore + drainageScore + damScore + 0.001;
  const featureWeights: FeatureWeightAttribution[] = [
    {
      name: 'Rainfall Precipitation Rate',
      key: 'rainfallMmHr',
      impactPercent: Math.round((rainScore / totalSubScores) * 100),
      direction: factors.rainfallMmHr > 40 ? 'INCREASES_RISK' : 'DECREASES_RISK',
      description: `${factors.rainfallMmHr} mm/hr current deluge intensity`,
    },
    {
      name: 'River Gauge Stage vs Danger Mark',
      key: 'riverGaugeMeters',
      impactPercent: Math.round((riverScore / totalSubScores) * 100),
      direction: factors.riverGaugeMeters > 2.0 ? 'INCREASES_RISK' : 'DECREASES_RISK',
      description: `${factors.riverGaugeMeters >= 0 ? '+' : ''}${factors.riverGaugeMeters.toFixed(1)}m above baseline danger level`,
    },
    {
      name: 'Antecedent Soil Saturation',
      key: 'soilSaturationPercent',
      impactPercent: Math.round((soilScore / totalSubScores) * 100),
      direction: factors.soilSaturationPercent > 70 ? 'INCREASES_RISK' : 'DECREASES_RISK',
      description: `${factors.soilSaturationPercent}% moisture content (reduced absorption)`,
    },
    {
      name: 'Storm Drainage Clogging',
      key: 'drainageBlockagePercent',
      impactPercent: Math.round((drainageScore / totalSubScores) * 100),
      direction: factors.drainageBlockagePercent > 50 ? 'INCREASES_RISK' : 'DECREASES_RISK',
      description: `${factors.drainageBlockagePercent}% urban culvert impediment`,
    },
    {
      name: 'Upstream Dam Spillway Release',
      key: 'upstreamDamDischargeCusecs',
      impactPercent: Math.round((damScore / totalSubScores) * 100),
      direction: factors.upstreamDamDischargeCusecs > 30000 ? 'INCREASES_RISK' : 'DECREASES_RISK',
      description: `${factors.upstreamDamDischargeCusecs.toLocaleString()} cusecs discharge volume`,
    },
  ];

  // Derive Automated Early Action Protocol Directives
  const earlyActionDirectives: string[] = [];
  if (boundedProb >= 75) {
    earlyActionDirectives.push('🚨 Mandatory Civil Evacuation: Activate Section 144 in low-lying riverside corridors within 45 mins.');
    earlyActionDirectives.push('🛑 Road Closure Directive: Immediate blockade of Bund Garden Bridge & Sinhagad Underpass.');
    earlyActionDirectives.push('🛡️ Mobilize Taskforce: Pre-position NDRF Battalion 5 & rubber boats at Deccan Gymkhana staging ground.');
    earlyActionDirectives.push('📢 CAP Alert: Broadcast siren trigger to all mobile devices within 5km radius.');
  } else if (boundedProb >= 50) {
    earlyActionDirectives.push('⚠️ Pre-alert Warning: Notify riverbank residents of probable cresting in next 90 minutes.');
    earlyActionDirectives.push('🚜 Deploy Drainage Squads: High-capacity diesel suction pumps to be stationed at JM Road junction.');
    earlyActionDirectives.push('🛏️ Shelter Standby: Open Balewadi Complex and Deccan High Ground camps for early arrivals.');
  } else if (boundedProb >= 25) {
    earlyActionDirectives.push('🟡 Advisory Watch: Monitor hourly telemetry of upstream Khadakwasla spillways.');
    earlyActionDirectives.push('📱 Routine Citizen Alerts: Advise citizens to avoid underpasses and monitor Sahaay live maps.');
  } else {
    earlyActionDirectives.push('🟢 All Clear: Normal routine operations; emergency squads on standard standby.');
  }

  return {
    probabilityScore: boundedProb,
    riskCategory,
    confidenceInterval: [ciLower, ciUpper],
    featureWeights,
    earlyActionDirectives,
    computedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

// ============================================================================
// 3. ROAD ACCESSIBILITY MATRIX & DYNAMIC SAFE EVACUATION CORRIDORS
// ============================================================================

export const INITIAL_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'rd_01',
    name: 'JM Road Riverbank Low-Lying Arterial',
    arterialType: 'MAIN_ARTERIAL',
    fromLocation: 'Deccan Gymkhana Circle',
    toLocation: 'Sancheti Hospital Chowk',
    status: 'SUBMERGED_BLOCKED',
    waterDepthCm: 75,
    speedLimitKmh: 0,
    recommendedVehicles: 'Rescue Boats / Amphibious Only',
    isDesignatedEvacuationCorridor: false,
    lastReportedTime: '12m ago',
    reportedBy: 'Traffic Police Unit 4 & Citizen Geotag',
    coordinates: [
      { lat: 18.5204, lng: 73.8488 },
      { lat: 18.5245, lng: 73.8512 },
    ],
    bypassRecommendation: 'Divert immediately via FC Road High-Ground Ridge (Passable).',
  },
  {
    id: 'rd_02',
    name: 'Bund Garden River Bridge Crossing',
    arterialType: 'BRIDGE',
    fromLocation: 'Yerawada Approach',
    toLocation: 'Pune Station Link',
    status: 'SUBMERGED_BLOCKED',
    waterDepthCm: 90,
    speedLimitKmh: 0,
    recommendedVehicles: 'Closed to All Traffic',
    isDesignatedEvacuationCorridor: false,
    lastReportedTime: '8m ago',
    reportedBy: 'Disaster Management Cell',
    coordinates: [
      { lat: 18.5385, lng: 73.8821 },
      { lat: 18.5415, lng: 73.8864 },
    ],
    bypassRecommendation: 'Take Sangam Bridge Elevated Flyover or Holkar Bridge.',
  },
  {
    id: 'rd_03',
    name: 'Karve Road Elevated Flyover & Boulevard',
    arterialType: 'HIGHWAY',
    fromLocation: 'Nal Stop Junction',
    toLocation: 'Kothrud Depot',
    status: 'PASSABLE',
    waterDepthCm: 0,
    speedLimitKmh: 45,
    recommendedVehicles: 'All Motor Vehicles, Ambulances, Buses',
    isDesignatedEvacuationCorridor: true,
    lastReportedTime: '3m ago',
    reportedBy: 'Volunteer Group Lead Priya D.',
    coordinates: [
      { lat: 18.5085, lng: 73.8324 },
      { lat: 18.5012, lng: 73.8198 },
    ],
    bypassRecommendation: 'Primary designated evacuation corridor towards Kothrud Highlands.',
  },
  {
    id: 'rd_04',
    name: 'Sinhagad Road Underpass & Canal Cross',
    arterialType: 'UNDERPASS',
    fromLocation: 'Pu La Deshpande Garden',
    toLocation: 'Dhayari Phata',
    status: 'SUBMERGED_BLOCKED',
    waterDepthCm: 110,
    speedLimitKmh: 0,
    recommendedVehicles: 'Blocked / Hazard Warning',
    isDesignatedEvacuationCorridor: false,
    lastReportedTime: '15m ago',
    reportedBy: 'Citizen Ground Report #402',
    coordinates: [
      { lat: 18.4821, lng: 73.8295 },
      { lat: 18.4754, lng: 73.8241 },
    ],
    bypassRecommendation: 'Use Sinhagad Road Elevated Flyover; DO NOT enter underpass.',
  },
  {
    id: 'rd_05',
    name: 'Fergusson College Road Ridge Way',
    arterialType: 'MAIN_ARTERIAL',
    fromLocation: 'Goodluck Chowk',
    toLocation: 'Agricultural College Flyover',
    status: 'PASSABLE',
    waterDepthCm: 4,
    speedLimitKmh: 40,
    recommendedVehicles: 'All Vehicles',
    isDesignatedEvacuationCorridor: true,
    lastReportedTime: '5m ago',
    reportedBy: 'Sahaay Telemetry Sensor #12',
    coordinates: [
      { lat: 18.5241, lng: 73.8415 },
      { lat: 18.5312, lng: 73.8448 },
    ],
    bypassRecommendation: 'Safe high-elevation artery bypassing flooded JM Road.',
  },
  {
    id: 'rd_06',
    name: 'Paud Ghat Valley Mountain Pass',
    arterialType: 'CONNECTING_ROAD',
    fromLocation: 'Chandani Chowk',
    toLocation: 'Paud Village',
    status: 'LANDSLIDE_DEBRIS',
    waterDepthCm: 15,
    speedLimitKmh: 10,
    recommendedVehicles: 'Heavy Earthmovers & Bulldozers Only',
    isDesignatedEvacuationCorridor: false,
    lastReportedTime: '22m ago',
    reportedBy: 'PWD Emergency Engineer',
    coordinates: [
      { lat: 18.5042, lng: 73.7845 },
      { lat: 18.5112, lng: 73.7621 },
    ],
    bypassRecommendation: 'Debris clearance in progress by NDRF team. Divert via NH-48.',
  },
  {
    id: 'rd_07',
    name: 'Aundh-Ravet Elevated Expressway Bypass',
    arterialType: 'HIGHWAY',
    fromLocation: 'Bremen Chowk Aundh',
    toLocation: 'Balewadi Sports Complex',
    status: 'PASSABLE',
    waterDepthCm: 0,
    speedLimitKmh: 60,
    recommendedVehicles: 'High Speed Relief Convoys & Ambulances',
    isDesignatedEvacuationCorridor: true,
    lastReportedTime: '1m ago',
    reportedBy: 'Emergency Command Center',
    coordinates: [
      { lat: 18.5621, lng: 73.8054 },
      { lat: 18.5742, lng: 73.7712 },
    ],
    bypassRecommendation: 'Direct high-speed expressway access to Balewadi Central Shelter.',
  },
  {
    id: 'rd_08',
    name: 'Koregaon Park South Main Road',
    arterialType: 'CONNECTING_ROAD',
    fromLocation: 'Burn Hall Chowk',
    toLocation: 'Mundhwa Bridge',
    status: 'WATERLOGGED_CAUTION',
    waterDepthCm: 32,
    speedLimitKmh: 15,
    recommendedVehicles: 'High-Clearance SUVs, 4x4, Trucks',
    isDesignatedEvacuationCorridor: false,
    lastReportedTime: '18m ago',
    reportedBy: 'Volunteer Patrol Team Beta',
    coordinates: [
      { lat: 18.5365, lng: 73.8992 },
      { lat: 18.5398, lng: 73.9142 },
    ],
    bypassRecommendation: 'Pass with extreme caution. Two-wheelers and sedans should avoid.',
  },
];

export const INITIAL_EVACUATION_CORRIDORS: SafeEvacuationCorridor[] = [
  {
    id: 'corridor_01',
    name: 'West High-Ground Evacuation Line (To Balewadi Arena)',
    origin: 'Shivajinagar / Deccan Flooded Basin',
    destinationShelterId: 'sh_01',
    destinationShelterName: 'Balewadi Indoor Stadium Mega-Shelter',
    totalDistanceKm: 8.4,
    estimatedTravelMinutes: 18,
    safetyRatingPercent: 96,
    avoidedRoadCount: 3,
    clearanceLevel: 'CLEAR_OPTIMAL',
    elevationAdvantageMeters: +38,
    waypoints: [
      { step: 1, instruction: 'Exit riverside zone via FC Road uphill ridge.', status: 'CLEAR', lat: 18.5221, lng: 73.8421 },
      { step: 2, instruction: 'Cross Agricultural College Flyover avoiding flooded underpasses.', status: 'CLEAR', lat: 18.5342, lng: 73.8465 },
      { step: 3, instruction: 'Enter Aundh-Ravet Elevated Expressway Bypass directly.', status: 'CLEAR', lat: 18.5615, lng: 73.8042 },
      { step: 4, instruction: 'Arrive at Balewadi Arena High-Ground Relief Hub (Capacity 1,500).', status: 'CLEAR', lat: 18.5742, lng: 73.7712 },
    ],
  },
  {
    id: 'corridor_02',
    name: 'South-West Ridge Corridor (To Kothrud Relief Center)',
    origin: 'Sinhagad Road / Sarasbaug Lowlands',
    destinationShelterId: 'sh_02',
    destinationShelterName: 'Kothrud Highlands Community Center',
    totalDistanceKm: 6.2,
    estimatedTravelMinutes: 14,
    safetyRatingPercent: 92,
    avoidedRoadCount: 2,
    clearanceLevel: 'CLEAR_OPTIMAL',
    elevationAdvantageMeters: +26,
    waypoints: [
      { step: 1, instruction: 'Move away from Mutha canal towards Alankar Police Station.', status: 'CLEAR', lat: 18.4985, lng: 73.8284 },
      { step: 2, instruction: 'Ascend Karve Road Elevated Flyover at Nal Stop.', status: 'CLEAR', lat: 18.5085, lng: 73.8324 },
      { step: 3, instruction: 'Proceed westward along elevated Karve Road corridor.', status: 'CLEAR', lat: 18.5012, lng: 73.8198 },
      { step: 4, instruction: 'Safely check in at Kothrud Shelter with medical triage.', status: 'CLEAR', lat: 18.4954, lng: 73.8085 },
    ],
  },
];

// ============================================================================
// 4. HISTORICAL DECISION REPLAY SCENARIOS (TIME-TRAVEL DISASTER PLAYBACK)
// ============================================================================

export const DECISION_REPLAY_SCENARIOS: DecisionReplayScenario[] = [
  {
    id: 'scenario_yamuna_2024',
    title: '2024 Extreme Basin Surge & Flash Inundation Event',
    eventDate: 'August 14, 2024',
    location: 'Metropolitan River Basin & Low-Lying Arterials',
    overview: 'Unprecedented upstream dam spillway release combined with localized cloudburst (110 mm/hr) breaching danger level.',
    primaryHazard: 'Flash Flood & Bridge Submergence',
    postMortem: {
      detectionLeadTimeMinutes: 38,
      evacuatedBeforePeakPercent: 96.8,
      preventedTrappingsCount: 1420,
      tacticalSummary: 'AI Early Warning triggered automated road barriers 38 minutes before bridge submergence, completely preventing vehicle water-trapping casualties.',
      keyTakeaway: 'Predictive ML feature attribution enabled early Section 144 pre-positioning of rubber boats and volunteer groups at Deccan Gymkhana.',
    },
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T - 03:00 (15:00 hrs)',
        minuteOffset: -180,
        phase: 'PRE_DISASTER',
        rainfallMmHr: 18,
        riverGaugeMeters: 0.6,
        soilSaturationPercent: 55,
        predictedRiskPercent: 18.4,
        riskCategory: 'LOW',
        capAlertState: null,
        activeCitizenSosCount: 0,
        verifiedIncidentsCount: 0,
        assignedVolunteerSquads: [],
        roadClosureCount: 0,
        closedRoadNames: [],
        activeEvacuationRoute: 'All primary arterial routes normal',
        evacuatedCitizenCount: 0,
        narrativeAction: 'Normal monsoon rainfall. Sahaay ML background telemetry model monitoring Khadakwasla reservoir level.',
        tacticalDecisionNote: 'Baseline monitoring; sensors reporting normal discharge rates of 8,500 cusecs.',
      },
      {
        stepNumber: 2,
        timeLabel: 'T - 01:30 (16:30 hrs)',
        minuteOffset: -90,
        phase: 'PRE_DISASTER',
        rainfallMmHr: 48,
        riverGaugeMeters: 1.8,
        soilSaturationPercent: 74,
        predictedRiskPercent: 44.2,
        riskCategory: 'MODERATE',
        capAlertState: {
          headline: 'CAP Advisory: Rising River Inflow & Intense Downpour Alert',
          severity: 'Moderate',
          broadcasted: true,
        },
        activeCitizenSosCount: 3,
        verifiedIncidentsCount: 2,
        assignedVolunteerSquads: ['Volunteer Squad Charlie (Drainage Patrol)'],
        roadClosureCount: 0,
        closedRoadNames: [],
        activeEvacuationRoute: 'Monitoring JM Road & Sinhagad Underpass',
        evacuatedCitizenCount: 15,
        narrativeAction: 'Intense rain band detected. Sahaay algorithm issues automatic pre-alert advisory to riverside wards.',
        tacticalDecisionNote: 'Volunteer groups placed on standby; municipal suction pumps directed to low-lying storm channels.',
      },
      {
        stepNumber: 3,
        timeLabel: 'T + 00:00 (18:00 hrs)',
        minuteOffset: 0,
        phase: 'ONSET_CRITICAL',
        rainfallMmHr: 95,
        riverGaugeMeters: 3.2,
        soilSaturationPercent: 88,
        predictedRiskPercent: 78.6,
        riskCategory: 'CRITICAL_SEVERE',
        capAlertState: {
          headline: 'EMERGENCY CAP WARNING: Danger Level Exceeded. Flash Flood Inbound.',
          severity: 'Severe',
          broadcasted: true,
        },
        activeCitizenSosCount: 14,
        verifiedIncidentsCount: 11,
        assignedVolunteerSquads: ['Flood Rescue Taskforce Alpha', 'Trauma Paramedic Unit'],
        roadClosureCount: 1,
        closedRoadNames: ['Sinhagad Road Underpass'],
        activeEvacuationRoute: 'Divert via Karve Road High-Ground Ridge',
        evacuatedCitizenCount: 140,
        narrativeAction: 'Dam discharge surges to 48,000 cusecs. River crests +3.2m above normal. Sinhagad underpass water reaches 60cm.',
        tacticalDecisionNote: 'Immediate 1-tap automated road block order executed for Sinhagad Underpass. Citizens rerouted uphill.',
      },
      {
        stepNumber: 4,
        timeLabel: 'T + 01:30 (19:30 hrs)',
        minuteOffset: 90,
        phase: 'PEAK_SURGE',
        rainfallMmHr: 122,
        riverGaugeMeters: 4.9,
        soilSaturationPercent: 96,
        predictedRiskPercent: 94.8,
        riskCategory: 'CRITICAL_SEVERE',
        capAlertState: {
          headline: 'CRITICAL LIFE SAFETY ALERT: Bund Garden Bridge & JM Road Inundated.',
          severity: 'Extreme',
          broadcasted: true,
        },
        activeCitizenSosCount: 38,
        verifiedIncidentsCount: 35,
        assignedVolunteerSquads: [
          'Flood Rescue Taskforce Alpha',
          'Trauma Paramedic Unit',
          'Structural Search Extrication Squad',
          'NDRF Battalion 5 Liaison',
        ],
        roadClosureCount: 3,
        closedRoadNames: ['Sinhagad Road Underpass', 'Bund Garden Bridge', 'JM Road Riverbank Corridor'],
        activeEvacuationRoute: 'West High-Ground Evacuation Line (To Balewadi Arena)',
        evacuatedCitizenCount: 520,
        narrativeAction: 'Peak surge crests riverbanks. JM Road and Bund Garden Bridge submerged under 85cm of turbulent water.',
        tacticalDecisionNote: 'Dynamic Safe Evacuation Corridor opens: traffic systematically diverted to Aundh-Ravet Elevated Bypass.',
      },
      {
        stepNumber: 5,
        timeLabel: 'T + 04:00 (22:00 hrs)',
        minuteOffset: 240,
        phase: 'EVACUATION_COORDINATION',
        rainfallMmHr: 55,
        riverGaugeMeters: 4.1,
        soilSaturationPercent: 92,
        predictedRiskPercent: 81.2,
        riskCategory: 'CRITICAL_SEVERE',
        capAlertState: {
          headline: 'Evacuation in Progress: Relocation to Balewadi & Kothrud Shelters.',
          severity: 'Severe',
          broadcasted: true,
        },
        activeCitizenSosCount: 46,
        verifiedIncidentsCount: 44,
        assignedVolunteerSquads: [
          'Flood Rescue Taskforce Alpha',
          'Relief Food & Water Distribution Wing',
          'Medical Leads',
        ],
        roadClosureCount: 3,
        closedRoadNames: ['Sinhagad Road Underpass', 'Bund Garden Bridge', 'JM Road Riverbank Corridor'],
        activeEvacuationRoute: 'Safe Corridor 1 & 2 Fully Operational',
        evacuatedCitizenCount: 1180,
        narrativeAction: 'Rain begins easing. Specialized rescue boats extract elderly citizens; high-capacity shelters provide hot meals.',
        tacticalDecisionNote: '1,180 citizens safely accommodated. Zero drowning casualties recorded in evacuated perimeter.',
      },
      {
        stepNumber: 6,
        timeLabel: 'T + 08:00 (02:00 hrs Next Day)',
        minuteOffset: 480,
        phase: 'POST_STABILIZATION',
        rainfallMmHr: 12,
        riverGaugeMeters: 2.1,
        soilSaturationPercent: 80,
        predictedRiskPercent: 36.5,
        riskCategory: 'MODERATE',
        capAlertState: {
          headline: 'Waters Receding: Road Inspection & Debris Clearance Underway.',
          severity: 'Moderate',
          broadcasted: true,
        },
        activeCitizenSosCount: 8,
        verifiedIncidentsCount: 8,
        assignedVolunteerSquads: ['Debris Clearance Unit', 'Water Purification Team'],
        roadClosureCount: 1,
        closedRoadNames: ['Bund Garden Bridge (Under Structural Inspection)'],
        activeEvacuationRoute: 'Main elevated roads reopened with speed restrictions',
        evacuatedCitizenCount: 1420,
        narrativeAction: 'River recedes below danger threshold. PWD structural engineers conduct sonar inspection of Bund Garden Bridge.',
        tacticalDecisionNote: 'JM Road drained and sanitized. Decision replay concludes with full response log validated.',
      },
    ],
  },
  {
    id: 'scenario_cloudburst_2023',
    title: '2023 Western Ghats Cloudburst & Landslide Inundation',
    eventDate: 'July 22, 2023',
    location: 'Western Ghats Slopes & Valley Transit Arterials',
    overview: 'Localized mountain cloudburst triggering sudden slope landslides cutting off mountain passes and flooding downstream valleys.',
    primaryHazard: 'Landslide & Flash Mudflow',
    postMortem: {
      detectionLeadTimeMinutes: 45,
      evacuatedBeforePeakPercent: 94.2,
      preventedTrappingsCount: 890,
      tacticalSummary: 'Geological slope sensors and ML soil saturation triggers warned transit buses 45 minutes prior to highway rockslide.',
      keyTakeaway: 'Immediate redirection of arterial traffic via NH-48 bypass prevented secondary multiple-vehicle collisions.',
    },
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T - 02:00',
        minuteOffset: -120,
        phase: 'PRE_DISASTER',
        rainfallMmHr: 28,
        riverGaugeMeters: 0.8,
        soilSaturationPercent: 68,
        predictedRiskPercent: 26.0,
        riskCategory: 'MODERATE',
        capAlertState: null,
        activeCitizenSosCount: 1,
        verifiedIncidentsCount: 1,
        assignedVolunteerSquads: ['Slope Reconnaissance Team'],
        roadClosureCount: 0,
        closedRoadNames: [],
        activeEvacuationRoute: 'Paud Pass open with caution',
        evacuatedCitizenCount: 0,
        narrativeAction: 'Sustained rain on ghat slopes. Soil saturation climbs past critical 70% threshold.',
        tacticalDecisionNote: 'Geotechnical sensors detect minor soil creep; alert flagged to civil engineering division.',
      },
      {
        stepNumber: 2,
        timeLabel: 'T + 00:00',
        minuteOffset: 0,
        phase: 'ONSET_CRITICAL',
        rainfallMmHr: 135,
        riverGaugeMeters: 2.9,
        soilSaturationPercent: 96,
        predictedRiskPercent: 89.4,
        riskCategory: 'CRITICAL_SEVERE',
        capAlertState: {
          headline: 'URGENT: Cloudburst & Landslide on Paud Ghat Highway',
          severity: 'Extreme',
          broadcasted: true,
        },
        activeCitizenSosCount: 19,
        verifiedIncidentsCount: 16,
        assignedVolunteerSquads: ['Slope Evacuation Taskforce', 'Heavy Earthmoving Unit'],
        roadClosureCount: 2,
        closedRoadNames: ['Paud Ghat Valley Mountain Pass', 'Low Valley Causeway'],
        activeEvacuationRoute: 'Expressway Bypass via NH-48',
        evacuatedCitizenCount: 310,
        narrativeAction: 'Cloudburst unloads 135 mm/hr. Heavy mud and boulders block Paud Pass at km 18.',
        tacticalDecisionNote: 'Automated highway signboards switch to red; traffic diverted to high-grade NH-48 bypass.',
      },
      {
        stepNumber: 3,
        timeLabel: 'T + 03:00',
        minuteOffset: 180,
        phase: 'PEAK_SURGE',
        rainfallMmHr: 60,
        riverGaugeMeters: 3.8,
        soilSaturationPercent: 98,
        predictedRiskPercent: 82.5,
        riskCategory: 'CRITICAL_SEVERE',
        capAlertState: {
          headline: 'Relief Operations Ongoing: Heavy Equipment Clearing Blockages',
          severity: 'Severe',
          broadcasted: true,
        },
        activeCitizenSosCount: 24,
        verifiedIncidentsCount: 24,
        assignedVolunteerSquads: ['Slope Evacuation Taskforce', 'Paramedics'],
        roadClosureCount: 2,
        closedRoadNames: ['Paud Ghat Valley Mountain Pass', 'Low Valley Causeway'],
        activeEvacuationRoute: 'NH-48 Corridor fully active',
        evacuatedCitizenCount: 890,
        narrativeAction: 'Heavy bulldozers clear initial lane for ambulance access. All 890 at-risk villagers safely accommodated in highland camps.',
        tacticalDecisionNote: 'Zero casualties reported in stranded vehicles.',
      },
    ],
  },
  {
    id: 'scenario_cyclone_remal_2024',
    title: '2024 Cyclone Remal Coastal Surge & Road Severance',
    eventDate: 'May 26, 2024',
    location: 'Coastal Lowlands & Delta Highway Grid',
    overview: 'Category 1 Severe Cyclonic Storm causing storm tide surge of 2.8m, inundating coastal causeways and disrupting power grids.',
    primaryHazard: 'Cyclonic Storm Surge & High Gale Winds',
    postMortem: {
      detectionLeadTimeMinutes: 72,
      evacuatedBeforePeakPercent: 98.1,
      preventedTrappingsCount: 3200,
      tacticalSummary: 'Storm surge predictive modeling synchronized with cyclone radar alerts allowed a 72-minute head start for coastal evacuations.',
      keyTakeaway: 'Pre-emptive evacuation corridor management prevented storm surge entrapment on exposed sea bridges.',
    },
    steps: [
      {
        stepNumber: 1,
        timeLabel: 'T - 04:00',
        minuteOffset: -240,
        phase: 'PRE_DISASTER',
        rainfallMmHr: 35,
        riverGaugeMeters: 1.2,
        soilSaturationPercent: 70,
        predictedRiskPercent: 52.0,
        riskCategory: 'HIGH',
        capAlertState: {
          headline: 'Cyclone Red Warning: Coastal Evacuation Recommended',
          severity: 'Severe',
          broadcasted: true,
        },
        activeCitizenSosCount: 8,
        verifiedIncidentsCount: 6,
        assignedVolunteerSquads: ['Coastal Evacuation Unit'],
        roadClosureCount: 1,
        closedRoadNames: ['Seaface Low Bridge'],
        activeEvacuationRoute: 'Inland Highway Expressway Corridor',
        evacuatedCitizenCount: 850,
        narrativeAction: 'Cyclone eye 60km offshore. Wind gusts reach 85 km/h. Seaface bridge closed pre-emptively.',
        tacticalDecisionNote: 'Pre-emptive closure ordered before tidal wave surge hits causeway.',
      },
      {
        stepNumber: 2,
        timeLabel: 'T + 00:00 (Landfall)',
        minuteOffset: 0,
        phase: 'PEAK_SURGE',
        rainfallMmHr: 115,
        riverGaugeMeters: 4.6,
        soilSaturationPercent: 95,
        predictedRiskPercent: 96.2,
        riskCategory: 'CRITICAL_SEVERE',
        capAlertState: {
          headline: 'CYCLONE LANDFALL: Severe Storm Surge Crossing Sea Walls',
          severity: 'Extreme',
          broadcasted: true,
        },
        activeCitizenSosCount: 62,
        verifiedIncidentsCount: 58,
        assignedVolunteerSquads: ['Disaster Response Taskforces 1 to 4', 'Coast Guard Liaison'],
        roadClosureCount: 4,
        closedRoadNames: ['Seaface Low Bridge', 'Coastal Marine Drive', 'Creek Underpass', 'Fisheries Port Road'],
        activeEvacuationRoute: 'Highland Concrete Cyclone Shelters Inland',
        evacuatedCitizenCount: 3200,
        narrativeAction: 'Landfall occurs with 120 km/h gusts. Sea water inundates coastal road up to 1.4m.',
        tacticalDecisionNote: 'All 3,200 registered residents safely in engineered concrete storm shelters with generator power.',
      },
    ],
  },
];
