import {
  SettlementRiskProfile,
  NashikRoadStatus,
} from '../../types';

export type DisasterHazardType =
  | 'FLOOD'
  | 'URBAN_WATERLOGGING'
  | 'LANDSLIDE'
  | 'CYCLONE'
  | 'INDUSTRIAL_HAZMAT'
  | 'EARTHQUAKE'
  | 'DROUGHT_HEATWAVE';

export interface SahyadriImpactProfile {
  zone: 'WINDWARD_COASTAL' | 'CRESTLINE_RIDGE' | 'LEEWARD_FOOTHILL' | 'DEEP_RAIN_SHADOW' | 'EASTERN_DECCAN_TRANSITION';
  zoneLabel: string;
  orographicRainfallMmAnnual: string;
  mountainInfluence: string;
  riverCatchmentLink: string;
  elevationProfile: string;
  hazardCausality: string; // Linking Sahyadri orography/geomorphology to the signature hazard
}

export interface DistrictInfoProfile {
  headquarters: string;
  population: string;
  areaKm2: string;
  majorEconomy: string;
  deocHelpline: string;
  criticalFeatures: string[];
}

export interface SignatureHazardTheory {
  hazard: DisasterHazardType;
  signatureTitle: string;
  principle: string; // e.g. "One City, One Signature Hazard"
  mechanism: string;
}

export interface MaharashtraCityData {
  id: string;
  name: string;
  district: string;
  division: 'Konkan' | 'Pune' | 'Nashik' | 'Chhatrapati Sambhajinagar' | 'Nagpur' | 'Amravati';
  primaryHazards: DisasterHazardType[];
  activeHazard: DisasterHazardType;
  signatureHazard: SignatureHazardTheory;
  sahyadriImpact: SahyadriImpactProfile;
  cityInfo: DistrictInfoProfile;
  currentRiskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  riverBasinOrTerrain: string;
  commandCenter: string;
  rainfallMmHr: number;
  waterGaugeM: number;
  dangerMarkM: number;
  alertStatus: string;
  coordinates: { lat: number; lng: number };
  settlements: SettlementRiskProfile[];
  roads: NashikRoadStatus[];
  talukas?: string[];
  weather?: { tempC: number; condition: string; humidityPercent: number; windSpeedKmph: number };
  openSheltersList?: { name: string; capacity: number; occupied: number; address: string; phone: string; status: 'OPEN' | 'FULL' }[];
  hospitalsList?: { name: string; bedsAvailable: number; icuAvailable: number; phone: string; distanceKm: number }[];
  emergencyServices?: { fireStation: string; policeStation: string; ambulancePhone: string };
  availableVolunteers?: number;
}

export const HAZARD_TYPE_LABELS: Record<DisasterHazardType, { label: string; icon: string; badgeColor: string }> = {
  FLOOD: { label: 'Riverine Flood', icon: '🌊', badgeColor: 'bg-blue-600 text-white' },
  URBAN_WATERLOGGING: { label: 'Urban Waterlogging', icon: '🌧️', badgeColor: 'bg-teal-600 text-white' },
  LANDSLIDE: { label: 'Landslide / Mudflow', icon: '⛰️', badgeColor: 'bg-emerald-700 text-white' },
  CYCLONE: { label: 'Cyclone & High Storm', icon: '🌀', badgeColor: 'bg-cyan-600 text-white' },
  INDUSTRIAL_HAZMAT: { label: 'Industrial / Hazmat', icon: '☣️', badgeColor: 'bg-purple-600 text-white' },
  EARTHQUAKE: { label: 'Seismic / Faultline', icon: '📉', badgeColor: 'bg-rose-700 text-white' },
  DROUGHT_HEATWAVE: { label: 'Heatwave & Scarcity', icon: '☀️', badgeColor: 'bg-amber-600 text-white' },
};
