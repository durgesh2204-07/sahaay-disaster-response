import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, AlertCircle } from 'lucide-react';
import { EmergencyReport, Shelter, ReliefCenter, RoadBlock, DangerZone } from '../../types';

interface SearchResultItem {
  id: string;
  name: string;
  category: 'Shelter' | 'Emergency' | 'Relief Center' | 'Road Block' | 'Danger Zone' | 'OpenStreetMap Location';
  lat: number;
  lng: number;
  subtitle?: string;
}

interface LocationSearchProps {
  shelters?: Shelter[];
  reports?: EmergencyReport[];
  reliefCenters?: ReliefCenter[];
  roadBlocks?: RoadBlock[];
  dangerZones?: DangerZone[];
  onSelectResult: (lat: number, lng: number, item?: any) => void;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  shelters = [],
  reports = [],
  reliefCenters = [],
  roadBlocks = [],
  dangerZones = [],
  onSelectResult,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchingOsm, setIsSearchingOsm] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter local items and query Nominatim API
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const localMatches: SearchResultItem[] = [];

    // Search Shelters
    (shelters || []).forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.locationAddress.toLowerCase().includes(q)) {
        localMatches.push({
          id: s.id,
          name: s.name,
          category: 'Shelter',
          lat: s.lat,
          lng: s.lng,
          subtitle: `${s.locationAddress} • Occupancy ${s.occupancy}/${s.capacity}`,
        });
      }
    });

    // Search Emergency Reports
    (reports || []).forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.locationAddress.toLowerCase().includes(q)
      ) {
        localMatches.push({
          id: r.id,
          name: r.title,
          category: 'Emergency',
          lat: r.lat,
          lng: r.lng,
          subtitle: `${r.type} (${r.severity}) • ${r.locationAddress}`,
        });
      }
    });

    // Search Relief Centers
    (reliefCenters || []).forEach((rc) => {
      if (rc.name.toLowerCase().includes(q) || rc.locationAddress.toLowerCase().includes(q)) {
        localMatches.push({
          id: rc.id,
          name: rc.name,
          category: 'Relief Center',
          lat: rc.lat,
          lng: rc.lng,
          subtitle: rc.locationAddress,
        });
      }
    });

    // Search Road Blocks
    (roadBlocks || []).forEach((rb) => {
      if (rb.locationName.toLowerCase().includes(q) || rb.description.toLowerCase().includes(q)) {
        localMatches.push({
          id: rb.id,
          name: rb.locationName,
          category: 'Road Block',
          lat: rb.lat,
          lng: rb.lng,
          subtitle: `${rb.blockType}: ${rb.description}`,
        });
      }
    });

    // Search Danger Zones
    (dangerZones || []).forEach((dz) => {
      if (dz.name.toLowerCase().includes(q) || dz.hazardType.toLowerCase().includes(q)) {
        localMatches.push({
          id: dz.id,
          name: dz.name,
          category: 'Danger Zone',
          lat: dz.centerLat,
          lng: dz.centerLng,
          subtitle: `${dz.hazardType} (${dz.severity}) • Radius ${dz.radiusMeters}m`,
        });
      }
    });

    setResults(localMatches);
    setIsOpen(true);

    // Debounce geographic location search via backend proxy
    const timer = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsSearchingOsm(true);
        try {
          const res = await fetch(`/api/geo/search?q=${encodeURIComponent(query.trim())}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.results)) {
              const osmResults: SearchResultItem[] = data.results.map((place: any, index: number) => ({
                id: `geo_${place.lat}_${place.lng}_${index}`,
                name: place.address || (place.displayName ? place.displayName.split(',')[0] : 'Location'),
                category: 'Geographic Location',
                lat: place.lat,
                lng: place.lng,
                subtitle: place.displayName || place.address,
              }));

              setResults((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newOsm = osmResults.filter((o) => !existingIds.has(o.id));
                return [...prev, ...newOsm];
              });
            }
          }
        } catch {
          // Gracefully continue with local matches
        } finally {
          setIsSearchingOsm(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, shelters, reports, reliefCenters, roadBlocks, dangerZones]);

  const handleSelect = (item: SearchResultItem) => {
    onSelectResult(item.lat, item.lng, item);
    setQuery(item.name);
    setIsOpen(false);
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getCategoryBadgeClass = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Shelter':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Relief Center':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Road Block':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Danger Zone':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search location, shelter, emergency, or road block..."
          className="w-full pl-10 pr-9 py-2.5 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-md transition-all"
        />
        {query ? (
          <button
            onClick={clearQuery}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : isSearchingOsm ? (
          <Loader2 className="absolute right-3 w-4 h-4 text-teal-600 animate-spin" />
        ) : null}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-[2000] max-h-80 overflow-y-auto divide-y divide-slate-100">
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs truncate">
                      {item.name}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  {item.subtitle && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>No matching locations or shelters found. Try another query.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
