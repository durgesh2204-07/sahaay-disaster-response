import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, X, Plus, CircleDot } from 'lucide-react';
import { SeverityLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import { reverseGeocodeAddress } from '../../utils/geoUtils';

interface AddDangerZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoords: { lat: number; lng: number } | null;
}

export const AddDangerZoneModal: React.FC<AddDangerZoneModalProps> = ({
  isOpen,
  onClose,
  selectedCoords,
}) => {
  const { addDangerZone } = useApp();

  const [name, setName] = useState('');
  const [hazardType, setHazardType] = useState<
    'Flood Zone' | 'Heavy Rainfall' | 'Landslide Risk' | 'Fire Zone' | 'Evacuation Zone'
  >('Flood Zone');
  const [severity, setSeverity] = useState<SeverityLevel>('CRITICAL');
  const [radiusMeters, setRadiusMeters] = useState('500');
  const [description, setDescription] = useState('');
  const [centerAddress, setCenterAddress] = useState('');

  const lat = selectedCoords?.lat || 18.5204;
  const lng = selectedCoords?.lng || 73.8567;

  useEffect(() => {
    if (isOpen) {
      reverseGeocodeAddress(lat, lng).then((addr) => setCenterAddress(addr));
    }
  }, [isOpen, lat, lng]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    addDangerZone({
      name: name.trim(),
      hazardType,
      severity,
      centerLat: lat,
      centerLng: lng,
      radiusMeters: parseInt(radiusMeters, 10) || 500,
      description: description.trim(),
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative card-3d">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="p-2.5 bg-red-100 text-red-800 rounded-2xl shadow-inner">
            <CircleDot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-['Outfit']">
              Create Danger Zone Perimeter
            </h3>
            <p className="text-xs text-slate-500">
              Draw an active danger/evacuation circle on the live map
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200 flex items-start gap-2.5 text-xs text-red-950">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-red-800 uppercase tracking-wider text-[10px] block">
                Zone Center Live Address:
              </span>
              <span className="font-extrabold text-slate-900 leading-snug block">
                {centerAddress || 'Identifying location address...'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
              Zone Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mula-Mutha River Flash Flood Inundation"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Hazard Type
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Flood Zone">🌊 Flood Inundation Zone</option>
                <option value="Heavy Rainfall">🌧️ Heavy Downpour Hazard</option>
                <option value="Landslide Risk">⛰️ Landslide Risk Slopes</option>
                <option value="Fire Zone">🔥 Fire Perimeter</option>
                <option value="Evacuation Zone">🚨 Mandatory Evacuation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Radius (Meters)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="CRITICAL">🔴 CRITICAL - Immediate Evacuation</option>
              <option value="HIGH">🟠 HIGH - High Danger Cordon</option>
              <option value="MEDIUM">🟡 MEDIUM - Watch & Advisory</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
              Safety Advice / Instructions
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear public warnings, road closures, or evacuation routes for citizens in this perimeter..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Establish Danger Zone Overlay
          </button>
        </form>
      </div>
    </div>
  );
};
