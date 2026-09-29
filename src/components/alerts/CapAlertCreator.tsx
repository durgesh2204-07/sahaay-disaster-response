import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Users,
  Eye,
  FileCode,
  Check,
  X,
} from 'lucide-react';

interface CapAlertCreatorProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CapAlertCreator: React.FC<CapAlertCreatorProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createCapAlert, userLocation, emergencyContacts, currentUser } = useApp();

  const [event, setEvent] = useState<string>('Flood');
  const [severity, setSeverity] = useState<'CRITICAL' | 'SEVERE' | 'MODERATE' | 'MINOR'>('CRITICAL');
  const [urgency, setUrgency] = useState<'IMMEDIATE' | 'EXPECTED' | 'FUTURE' | 'PAST'>('IMMEDIATE');
  const [certainty, setCertainty] = useState<'OBSERVED' | 'LIKELY' | 'POSSIBLE' | 'UNLIKELY'>('OBSERVED');
  const [responseType, setResponseType] = useState<'Evacuate' | 'Shelter' | 'Avoid' | 'Prepare' | 'Monitor'>('Evacuate');
  const [headline, setHeadline] = useState<string>('Critical Flash Flood Inundation & Dam Water Discharge Alert');
  const [description, setDescription] = useState<string>(
    'Rapid catchment discharge from upstream reservoir exceeding safety thresholds. Riverbed banks submerged with water entering low-lying localities.'
  );
  const [instruction, setInstruction] = useState<string>(
    'Evacuate ground floors immediately to designated relief shelters. Disconnect power mains. Do not attempt crossing flooded causeways.'
  );
  const [areaDesc, setAreaDesc] = useState<string>('Pune Metropolitan River Corridor & Low-Lying Sectors');
  const [radiusKm, setRadiusKm] = useState<number>(5.0);
  const [showXmlPreview, setShowXmlPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const estimatedRecipients = (emergencyContacts || []).filter((c) => c.alertEligibility === 'ELIGIBLE').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !instruction.trim()) return;

    setIsSubmitting(true);
    try {
      const centerLat = userLocation?.lat || 18.5204;
      const centerLng = userLocation?.lng || 73.8567;

      await createCapAlert({
        senderName: `${currentUser.name} (EOC Command)`,
        event,
        category: 'Met',
        severity,
        urgency,
        certainty,
        responseType,
        headline,
        description,
        instruction,
        area: {
          areaDesc,
          circle: {
            centerLat,
            centerLng,
            radiusKm,
          },
        },
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.warn('Alert publish failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>CAP-IN-SAHAAY-${new Date().getFullYear()}-DRAFT</identifier>
  <sender>${currentUser.email || 'eoc@sahaay.org'}</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>${event}</event>
    <urgency>${urgency}</urgency>
    <severity>${severity}</severity>
    <certainty>${certainty}</certainty>
    <responseType>${responseType}</responseType>
    <headline>${headline}</headline>
    <description>${description}</description>
    <instruction>${instruction}</instruction>
    <area>
      <areaDesc>${areaDesc}</areaDesc>
      <circle>${userLocation?.lat || 18.5204},${userLocation?.lng || 73.8567} ${radiusKm}</circle>
    </area>
  </info>
</alert>`;

  return (
    <div className="neu-flat p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600 text-white font-bold neu-raised shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Publish Common Alerting Protocol (CAP) Emergency Bulletin
            </h3>
            <p className="text-xs text-slate-500">
              Common Alerting Protocol (CAP) • Authenticated EOC Broadcast Terminal
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Disaster Event & Response Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Disaster Hazard Category
            </label>
            <select
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="neu-input w-full text-xs sm:text-sm font-semibold"
            >
              <option value="Flood">Flood & Riverbed Inundation</option>
              <option value="Landslide">Landslide & Hill Slope Rockfall</option>
              <option value="Heavy Rain">Excessive Rain & Severe Squall</option>
              <option value="Cyclone">Tropical Cyclone & Gale Storm</option>
              <option value="Fire">Industrial / Wildfire Incident</option>
              <option value="Dam Overflow">Dam Reservoir Sluice Gate Water Discharge</option>
              <option value="Earthquake">Earthquake Seismic Tremor</option>
              <option value="Chemical Hazard">Hazardous Material Chemical Plume</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Mandated Public Response Type
            </label>
            <select
              value={responseType}
              onChange={(e) => setResponseType(e.target.value as any)}
              className="neu-input w-full text-xs sm:text-sm font-semibold"
            >
              <option value="Evacuate">Evacuate (Immediate relocation to safe zones)</option>
              <option value="Shelter">Shelter (Remain indoors / seek designated refuge)</option>
              <option value="Avoid">Avoid (Keep clear of hazardous zone perimeter)</option>
              <option value="Prepare">Prepare (Pack emergency bag & standby)</option>
              <option value="Monitor">Monitor (Maintain radio/phone vigil for updates)</option>
            </select>
          </div>
        </div>

        {/* Severity, Urgency, Certainty Triad */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="neu-input w-full text-xs font-semibold"
            >
              <option value="CRITICAL">CRITICAL (Threat to life or property)</option>
              <option value="SEVERE">SEVERE (Significant threat)</option>
              <option value="MODERATE">MODERATE (Possible threat)</option>
              <option value="MINOR">MINOR (Minimal threat)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="neu-input w-full text-xs font-semibold"
            >
              <option value="IMMEDIATE">IMMEDIATE (Responsive action now)</option>
              <option value="EXPECTED">EXPECTED (Next 1 to 6 hours)</option>
              <option value="FUTURE">FUTURE (Beyond 6 hours)</option>
              <option value="PAST">PAST (Action no longer required)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Certainty</label>
            <select
              value={certainty}
              onChange={(e) => setCertainty(e.target.value as any)}
              className="neu-input w-full text-xs font-semibold"
            >
              <option value="OBSERVED">OBSERVED (Confirmed on ground/radar)</option>
              <option value="LIKELY">LIKELY (Probability &gt; 50%)</option>
              <option value="POSSIBLE">POSSIBLE (Probability &lt; 50%)</option>
              <option value="UNLIKELY">UNLIKELY</option>
            </select>
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Official Bulletin Headline (Max 140 chars)
          </label>
          <input
            type="text"
            maxLength={140}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="neu-input w-full text-xs sm:text-sm font-bold text-slate-900"
            placeholder="e.g. Critical Flash Flood Inundation Alert..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
            Detailed Disaster Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neu-input w-full text-xs sm:text-sm"
            placeholder="Explain meteorological or geological circumstances..."
            required
          />
        </div>

        {/* Mandatory Safety Instructions */}
        <div>
          <label className="block text-xs font-bold uppercase text-blue-900 mb-1">
            Mandatory Actionable Safety Instruction
          </label>
          <textarea
            rows={2}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="neu-input w-full text-xs sm:text-sm border-blue-200 bg-blue-50/40"
            placeholder="e.g. Evacuate ground floor immediately. Relocate to Shivajinagar Relief Camp..."
            required
          />
        </div>

        {/* Geotargeting Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 neu-pressed">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Affected Geotarget Zone Name
            </label>
            <input
              type="text"
              value={areaDesc}
              onChange={(e) => setAreaDesc(e.target.value)}
              className="neu-input w-full text-xs font-semibold"
              placeholder="e.g. Pune River Basin Sector 4"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Geofence Broadcast Radius: {radiusKm} km
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-blue-600 mt-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Recipient estimation bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Target Population Broadcast Estimation:</span>
          </div>
          <span className="font-extrabold text-blue-800">
            ~{estimatedRecipients * 50} Citizens in {radiusKm} km geofence
          </span>
        </div>

        {/* Preview XML Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowXmlPreview(!showXmlPreview)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            {showXmlPreview ? 'Hide OASIS CAP XML Preview' : 'Show OASIS CAP XML Preview'}
          </button>

          {showXmlPreview && (
            <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 scrollbar-thin">
              {sampleXmlPreview}
            </pre>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="neu-btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="neu-btn-primary px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Transmitting CAP Alert...' : 'Authorize & Broadcast Alert'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
