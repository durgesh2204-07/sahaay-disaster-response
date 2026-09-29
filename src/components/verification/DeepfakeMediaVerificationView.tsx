import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DisasterMediaVerification, VerificationStatus } from '../../types';

export const DeepfakeMediaVerificationView: React.FC = () => {
  const { mediaVerifications, verifyMedia, analyzeUploadedMedia, currentUser } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<DisasterMediaVerification | null>(
    mediaVerifications[0] || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [overrideNotes, setOverrideNotes] = useState<string>('');

  const filteredItems = (mediaVerifications || []).filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.verificationStatus === filterStatus;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return {
          label: 'VERIFIED AUTHENTIC',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
      case 'LIKELY_AUTHENTIC':
        return {
          label: 'LIKELY AUTHENTIC',
          bg: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800',
        };
      case 'NEEDS_VERIFICATION':
        return {
          label: 'NEEDS FIELD CHECK',
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'POTENTIALLY_MANIPULATED':
        return {
          label: 'POTENTIAL DEEPFAKE / RECYCLED',
          bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold',
        };
      case 'INSUFFICIENT_DATA':
        return {
          label: 'INSUFFICIENT TELEMETRY',
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        };
    }
  };

  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAnalyzing(true);
    try {
      const created = await analyzeUploadedMedia({
        title: newTitle,
        disaster: 'Flood',
        location: newLocation || 'Pune District Sector',
        mediaUrl: newUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
        source: 'Citizen SOS',
      });
      setSelectedItem(created);
      setNewTitle('');
      setNewUrl('');
      setNewLocation('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAdminOverride = (status: VerificationStatus) => {
    if (!selectedItem) return;
    verifyMedia(selectedItem.id, status, overrideNotes || undefined);
    setSelectedItem((prev) =>
      prev
        ? {
            ...prev,
            verificationStatus: status,
            adminOverridden: true,
            adminNotes: overrideNotes || `Manually marked as ${status} by Administrator.`,
          }
        : null
    );
    setOverrideNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-purple-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Deepfake Disaster Locator & Media Forensics
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            AI Media Verification Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Flags synthetic deepfakes, recycled historical disaster videos, and verifies genuine geotagged citizen distress evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-xs font-mono text-purple-200">
            {mediaVerifications.length} Media Items Screened
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media Queue & Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Incident Evidence Feed
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Items</option>
              <option value="POTENTIALLY_MANIPULATED">⚠️ Potentially Manipulated</option>
              <option value="VERIFIED">✓ Verified Authentic</option>
              <option value="NEEDS_VERIFICATION">⏳ Needs Verification</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => {
              const badge = getStatusBadge(item.verificationStatus);
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={item.mediaUrl}
                      alt={item.incidentTitle}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {item.incidentTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {item.reportedLocation} • {item.source}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${badge.bg}`}
                        >
                          {item.verificationStatus.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          AI Conf: {item.confidenceScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Analysis Form */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600" /> Screen New Disaster Media
            </div>
            <form onSubmit={handleQuickAnalyze} className="space-y-2 text-xs">
              <input
                type="text"
                required
                placeholder="Disaster Headline / Social Claim"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Location (e.g. Pune Dam Spillway)"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow flex items-center justify-center gap-1.5 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running Forensic Cross-Checks...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Analyze Image Authenticity
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle & Right Columns: Forensic Deep Dive & Admin Override */}
        <div className="lg:col-span-2 space-y-6">
          {selectedItem && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Top Details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {selectedItem.incidentTitle}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ID: <span className="font-mono">{selectedItem.id}</span> • Location: {selectedItem.reportedLocation} • Source: {selectedItem.source}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                      getStatusBadge(selectedItem.verificationStatus).bg
                    }`}
                  >
                    {getStatusBadge(selectedItem.verificationStatus).label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 mt-1">
                    AI Confidence Rating: {selectedItem.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Media Preview & Forensic Inspector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.incidentTitle}
                    className="w-full h-56 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow"
                  />
                  <div className="mt-2 text-[11px] text-slate-400 text-center">
                    Media Timestamp: {selectedItem.timestamp}
                  </div>
                </div>

                {/* AI Forensic Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> AI Forensics Summary
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedItem.aiAnalysisSummary}
                    </p>
                  </div>

                  {/* Detected Anomalies */}
                  <div className="p-3.5 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-1.5">
                    <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Anomaly Indicators Checked:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      {selectedItem.detectedAnomalies.map((anom, idx) => (
                        <li key={idx} className="text-[11px]">{anom}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Triangulation Evidence List */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" /> Multi-Source Evidence Triangulation:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(selectedItem.evidenceUsed || []).map((ev, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Override Controls */}
              {currentUser.role === 'admin' && (
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" /> Commander Override Action
                    </div>
                    {selectedItem.adminOverridden && (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        Admin Note: {selectedItem.adminNotes}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleAdminOverride('VERIFIED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve as Authentic
                    </button>
                    <button
                      onClick={() => handleAdminOverride('POTENTIALLY_MANIPULATED')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Flag as Manipulated / Deepfake
                    </button>
                    <button
                      onClick={() => handleAdminOverride('NEEDS_VERIFICATION')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow"
                    >
                      Request Volunteer Ground Check
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
