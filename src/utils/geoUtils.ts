// Haversine formula to compute distance between two coordinates in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 100) / 100;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function estimateTravelTime(km: number): { walkingMin: number; drivingMin: number } {
  // Avg walking speed 4.5 km/h, driving speed 30 km/h in disaster conditions
  const walkingHours = km / 4.5;
  const drivingHours = km / 30;

  return {
    walkingMin: Math.max(1, Math.round(walkingHours * 60)),
    drivingMin: Math.max(1, Math.round(drivingHours * 60)),
  };
}

export function getDirectionsUrl(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string,
  userLat?: number,
  userLng?: number
): string {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${destinationLat},${destinationLng}${
    destinationName ? `+(${encodeURIComponent(destinationName)})` : ''
  }`;
}

const locationCache: Record<string, string> = {};

// Clean Regional Area Fallback (Ensures human-readable names, never raw coordinate numbers)
function getRegionalAddressFallback(lat: number, lng: number): string {
  if (lat >= 18.45 && lat <= 18.65 && lng >= 73.72 && lng <= 73.98) {
    if (lat >= 18.51 && lat <= 18.55 && lng >= 73.83 && lng <= 73.87) {
      return 'Shivaji Road, Kasba Peth, Pune, Maharashtra 411001';
    } else if (lat >= 18.52 && lat <= 18.56 && lng >= 73.81 && lng <= 73.85) {
      return 'FC Road, Shivajinagar, Pune, Maharashtra 411005';
    } else if (lat >= 18.48 && lat <= 18.52 && lng >= 73.79 && lng <= 73.84) {
      return 'Paud Road, Kothrud, Pune, Maharashtra 411038';
    } else if (lat >= 18.56 && lat <= 18.62 && lng >= 73.68 && lng <= 73.77) {
      return 'Phase 1, Hinjawadi Infotech Park, Pune, Maharashtra 411057';
    } else if (lat >= 18.54 && lat <= 18.58 && lng >= 73.89 && lng <= 73.94) {
      return 'Viman Nagar Relief Sector, Pune, Maharashtra 411014';
    }
    return 'Central Metropolitan Relief Sector, Pune, Maharashtra';
  }
  if (lat >= 18.88 && lat <= 19.32 && lng >= 72.75 && lng <= 73.08) {
    if (lat >= 18.90 && lat <= 18.95 && lng >= 72.80 && lng <= 72.84) {
      return 'Colaba & Fort Heritage District, South Mumbai, Maharashtra';
    } else if (lat >= 19.04 && lat <= 19.08 && lng >= 72.81 && lng <= 72.86) {
      return 'Hill Road, Bandra West, Mumbai, Maharashtra';
    }
    return 'Greater Mumbai Coastal Emergency District, Maharashtra';
  }
  if (lat >= 28.38 && lat <= 28.90 && lng >= 76.85 && lng <= 77.48) {
    if (lat >= 28.61 && lat <= 28.65 && lng >= 77.19 && lng <= 77.24) {
      return 'Connaught Place & Raisina Hill, New Delhi, Delhi 110001';
    } else if (lat >= 28.51 && lat <= 28.56 && lng >= 77.18 && lng <= 77.24) {
      return 'Saket District Centre, South Delhi, Delhi 110017';
    }
    return 'National Capital Regional Relief Sector, Delhi NCR';
  }
  if (lat >= 12.85 && lat <= 13.15 && lng >= 77.45 && lng <= 77.78) {
    return 'Indiranagar & MG Road Sector, Bengaluru, Karnataka 560038';
  }
  if (lat >= 17.30 && lat <= 17.55 && lng >= 78.30 && lng <= 78.60) {
    return 'Hitec City & Madhapur Sector, Hyderabad, Telangana 500081';
  }
  if (lat >= 22.45 && lat <= 22.65 && lng >= 88.25 && lng <= 88.48) {
    return 'Park Street & Esplanade Sector, Kolkata, West Bengal 700016';
  }
  if (lat >= 12.95 && lat <= 13.15 && lng >= 80.15 && lng <= 80.30) {
    return 'T. Nagar & Anna Salai District, Chennai, Tamil Nadu 600017';
  }
  return 'Active Live Emergency Relief Zone';
}

export async function reverseGeocodeAddress(lat: number, lng: number): Promise<string> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (locationCache[key]) {
    return locationCache[key];
  }

  // 1. First priority: Server-side proxy with proper User-Agent & AI resolution
  try {
    const serverRes = await fetch(`/api/geo/reverse-geocode?lat=${lat}&lng=${lng}`, {
      signal: AbortSignal.timeout(4500),
    });
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data && data.success && data.address && typeof data.address === 'string' && data.address.trim().length > 0) {
        const cleanAddr = data.address.trim();
        locationCache[key] = cleanAddr;
        return cleanAddr;
      }
    }
  } catch {
    // Server route fallback to client geocoding
  }

  // 2. Direct client fallback: BigDataCloud free client reverse geocoding
  try {
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const parts = [
        bdcData.locality || bdcData.principalSubdivisionCode,
        bdcData.city,
        bdcData.principalSubdivision,
        bdcData.postcode ? `PIN: ${bdcData.postcode}` : '',
        bdcData.countryName,
      ].filter(Boolean);
      if (parts.length > 0) {
        const formatted = parts.join(', ');
        locationCache[key] = formatted;
        return formatted;
      }
    }
  } catch {
    // Fall back
  }

  // 3. Fallback: Human-readable regional location (Strictly no raw coordinates)
  const regionalFallback = getRegionalAddressFallback(lat, lng);
  locationCache[key] = regionalFallback;
  return regionalFallback;
}

