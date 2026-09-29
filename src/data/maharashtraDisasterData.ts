export * from './districts/types';
import { MaharashtraCityData } from './districts/types';
import { KONKAN_DISTRICTS } from './districts/konkan';
import { PUNE_DISTRICTS } from './districts/pune';
import { NASHIK_DISTRICTS } from './districts/nashik';
import { MARATHWADA_DISTRICTS } from './districts/marathwada';
import { AMRAVATI_DISTRICTS } from './districts/amravati';
import { NAGPUR_DISTRICTS } from './districts/nagpur';

export {
  KONKAN_DISTRICTS,
  PUNE_DISTRICTS,
  NASHIK_DISTRICTS,
  MARATHWADA_DISTRICTS,
  AMRAVATI_DISTRICTS,
  NAGPUR_DISTRICTS,
};

// ============================================================================
// ALL 36 DISTRICTS OF MAHARASHTRA STATE
// Organized by 6 Administrative Divisions:
// 1. Konkan (7 Districts)
// 2. Pune / Western Maharashtra (5 Districts)
// 3. Nashik / Khandesh (5 Districts)
// 4. Chhatrapati Sambhajinagar / Marathwada (8 Districts)
// 5. Amravati / Western Vidarbha (5 Districts)
// 6. Nagpur / Eastern Vidarbha (6 Districts)
// Total = 36 Districts
// ============================================================================

export const MAHARASHTRA_CITIES: MaharashtraCityData[] = [
  ...KONKAN_DISTRICTS,
  ...PUNE_DISTRICTS,
  ...NASHIK_DISTRICTS,
  ...MARATHWADA_DISTRICTS,
  ...AMRAVATI_DISTRICTS,
  ...NAGPUR_DISTRICTS,
];

export const MAHARASHTRA_DIVISIONS = [
  'ALL',
  'Konkan',
  'Pune',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Amravati',
  'Nagpur',
] as const;

export type MaharashtraDivision = (typeof MAHARASHTRA_DIVISIONS)[number];

export const getCityById = (id: string): MaharashtraCityData | undefined => {
  return MAHARASHTRA_CITIES.find((c) => c.id === id);
};

export const getDistrictsByDivision = (division: string): MaharashtraCityData[] => {
  if (division === 'ALL') return MAHARASHTRA_CITIES;
  return MAHARASHTRA_CITIES.filter((c) => c.division === division);
};
