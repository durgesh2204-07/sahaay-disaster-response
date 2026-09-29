import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, X, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { EmergencyType, SeverityLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import { ImageUploader } from '../ImageUploader';
import { reverseGeocodeAddress } from '../../utils/geoUtils';

interface ReportEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoords: { lat: number; lng: number } | null;
  onSuccess?: () => void;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({
  isOpen,
  onClose,
  selectedCoords,
  onSuccess,
}) => {
  const { addEmergencyReport, currentUser, isEffectiveOffline } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EmergencyType>('Flood');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [affectedTotal, setAffectedTotal] = useState('5');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const lat = selectedCoords?.lat || 18.5204;
  const lng = selectedCoords?.lng || 73.8567;

  useEffect(() => {
    if (isOpen) {
      reverseGeocodeAddress(lat, lng).then((addr) => {
        setLocationAddress(addr);
      });
    }
  }, [isOpen, lat, lng]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const report = addEmergencyReport({
      title: title.trim(),
      type,
      description: description.trim(),
      locationAddress: locationAddress.trim() || 'Central Metropolitan Relief Zone',
      lat,
      lng,
      severity,
      affected: {
        total: parseInt(affectedTotal, 10) || 1,
        children: 0,
        elderly: 0,
        specialAssistance: 0,
      },
      photoUrl: photoUrl || undefined,
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setTitle('');
      setDescription('');
      setLocationAddress('');
      setPhotoUrl('');
      onClose();
      if (onSuccess) onSuccess();
    }, 1500);
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
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-['Outfit']">
              Report Emergency Incident
            </h3>
            <p className="text-xs text-slate-500">
              Pin & broadcast urgent disaster situation directly on the map
            </p>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">Emergency Broadcasted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {isEffectiveOffline
                ? '📡 Saved on device & queued for sync. Marker added to local map!'
                : 'Incident marker added to SAHAAY Live Map and broadcasted to emergency command.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Live Location Address banner */}
            <div className="p-3 bg-teal-50/90 rounded-2xl border border-teal-200/90 flex items-start gap-2.5 text-xs text-teal-900">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-teal-800 uppercase tracking-wider text-[10px] block">
                  Incident Live Location Address:
                </span>
                <span className="font-extrabold text-slate-900 leading-snug block">
                  {locationAddress || 'Resolving exact street address...'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Incident Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. River bank breach in Sector 3"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Emergency Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EmergencyType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Flood">🌊 Flood / Water Breach</option>
                  <option value="Fire">🔥 Fire Incident</option>
                  <option value="Earthquake">🏚️ Earthquake Damage</option>
                  <option value="Landslide">⛰️ Landslide / Debris</option>
                  <option value="Road Block">🚧 Road Blockage</option>
                  <option value="Medical Emergency">🚑 Medical Emergency</option>
                  <option value="Building Damage">🏗️ Structure Collapse</option>
                  <option value="Missing Person">👤 Missing Person</option>
                  <option value="Other">⚠️ Other Incident</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="CRITICAL">🔴 CRITICAL (Life Safety)</option>
                  <option value="HIGH">🟠 HIGH (Urgent Danger)</option>
                  <option value="MEDIUM">🟡 MEDIUM (Moderate Threat)</option>
                  <option value="LOW">🟢 LOW (Minor Hazard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Location Address / Landmark
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="e.g. Near Old Bridge, Shivajinagar"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Estimated Affected
                </label>
                <input
                  type="number"
                  min="1"
                  value={affectedTotal}
                  onChange={(e) => setAffectedTotal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Reporter
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Detailed Situation Description
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current situation, injuries, trapped citizens, water depth, or special requirements..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <ImageUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label="Attach Photo Evidence / Upload Image"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer btn-danger-3d"
            >
              <Send className="w-4 h-4" /> Broadcast Emergency & Pin Marker
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
