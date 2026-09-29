import React, { useState } from 'react';
import { CapAlert } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileCode,
  Download,
  Home,
  Radio,
  Navigation,
} from 'lucide-react';

interface CapAlertCardProps {
  alert: CapAlert;
  showAdminControls?: boolean;
  onSelectShelter?: (shelterId: string) => void;
}

export const CapAlertCard: React.FC<CapAlertCardProps> = ({
  alert,
  showAdminControls = false,
  onSelectShelter,
}) => {
  const { updateCapAlertStatus, shelters } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const nearestShelter = alert.nearestShelterId
    ? shelters.find((s) => s.id === alert.nearestShelterId)
    : null;

  const handleAudioAnnounce = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(
        `Emergency Alert: ${alert.event}. ${alert.headline}. Instruction: ${alert.instruction}`
      );
      speech.rate = 0.95;
      speech.pitch = 1.0;
      speech.onend = () => setIsPlayingAudio(false);
      speech.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(speech);
    }
  };

  const handleExportXml = async () => {
    try {
      setIsExporting(true);
      const res = await fetch(`/api/cap-alerts/${alert.id}/export-xml`);
      if (res.ok) {
        const xml = await res.text();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${alert.identifier}.cap.xml`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.warn('Failed to export CAP XML:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = async () => {
    try {
      setIsExporting(true);
      const res = await fetch(`/api/cap-alerts/${alert.id}/export-json`);
      if (res.ok) {
        const json = await res.text();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${alert.identifier}.cap.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.warn('Failed to export CAP JSON:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const formatIssuedTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Sophisticated severity accent colors
  const severityAccent =
    alert.severity === 'CRITICAL'
      ? 'border-l-red-500 ring-red-500/10'
      : alert.severity === 'SEVERE'
      ? 'border-l-orange-500 ring-orange-500/10'
      : alert.severity === 'MODERATE'
      ? 'border-l-amber-500 ring-amber-500/10'
      : 'border-l-blue-500 ring-blue-500/10';

  return (
    <article
      className={`neu-flat p-5 sm:p-6 rounded-2xl border-l-4 ${severityAccent} bg-white space-y-4 transition-all hover:shadow-md`}
    >
      {/* Simulation banner - subtle and clear */}
      {alert.isSimulation && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Civil Protection Training Exercise — Simulation Drill
          </span>
          <span className="font-mono text-[10px] text-amber-700 font-bold">DRILL #SIM-99</span>
        </div>
      )}

      {/* Top Header: Category, Status, Time */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wide flex items-center gap-1.5 ${
              alert.severity === 'CRITICAL'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : alert.severity === 'SEVERE'
                ? 'bg-orange-50 text-orange-800 border border-orange-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {alert.event} • {alert.responseType}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              alert.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {alert.status === 'ACTIVE' ? '● Active' : alert.status}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {formatIssuedTime(alert.sent)}
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline text-slate-600 font-semibold">{alert.senderName}</span>
        </div>
      </div>

      {/* Headline & Concise Description */}
      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {alert.headline}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {alert.description}
        </p>
      </div>

      {/* Primary Action Directive */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          Recommended Safety Action
        </span>
        <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
          {alert.instruction}
        </p>
      </div>

      {/* Context: Zone & Nearest Shelter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Affected Zone
            </span>
            <span className="text-xs font-semibold text-slate-800 truncate block">
              {alert.area.areaDesc}
            </span>
          </div>
        </div>

        {nearestShelter ? (
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Home className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                  Designated Shelter
                </span>
                <span className="text-xs font-bold text-emerald-950 truncate block">
                  {nearestShelter.name}
                </span>
              </div>
            </div>
            {onSelectShelter && (
              <button
                onClick={() => onSelectShelter(nearestShelter.id)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-colors"
              >
                <Navigation className="w-3 h-3" />
                <span>Navigate</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Contacts</span>
            <span className="font-semibold text-slate-800">{alert.recipientsCount ?? 420} notified</span>
          </div>
        )}
      </div>

      {/* Action Toolbar: Clean, Uncluttered */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Audio siren/voice toggle */}
          <button
            onClick={handleAudioAnnounce}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPlayingAudio
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Listen to official audio announcement"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isPlayingAudio ? 'Stop Audio' : 'Audio Announcement'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {showAdminControls && alert.status === 'ACTIVE' && (
            <button
              onClick={() => updateCapAlertStatus(alert.id, 'CANCELLED')}
              className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              Cancel Alert
            </button>
          )}

          {/* Clean drawer toggle for protocol details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <span>{isExpanded ? 'Less info' : 'Protocol details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Protocol Details: Keeps technical details accessible without cluttering */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">URGENCY</span>
              <span className="font-bold text-slate-800">{alert.urgency}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">CERTAINTY</span>
              <span className="font-bold text-slate-800">{alert.certainty}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">CATEGORY</span>
              <span className="font-bold text-slate-800">{alert.category}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">IDENTIFIER</span>
              <span className="font-mono font-bold text-slate-800 truncate block text-[11px]">
                {alert.identifier}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">
              Common Alerting Protocol (CAP) Standard Feed
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportXml}
                disabled={isExporting}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1"
              >
                <FileCode className="w-3 h-3 text-blue-600" />
                XML
              </button>
              <button
                onClick={handleExportJson}
                disabled={isExporting}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1"
              >
                <Download className="w-3 h-3 text-slate-600" />
                JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
