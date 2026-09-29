import React, { useState } from 'react';
import {
  Users,
  Shield,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Radio,
  Clock,
  Phone,
  Compass,
  FileText,
  Activity,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VolunteerGroup, VolunteerGroupStatus, VolunteerGroupMission } from '../../types';

export const VolunteerGroupManager: React.FC = () => {
  const {
    volunteerGroups,
    userVolunteerGroup,
    createVolunteerGroup,
    updateGroupStatus,
    assignGroupMission,
    submitVolunteerReport,
    currentUser,
    sosIncidents,
  } = useApp();

  const [selectedGroup, setSelectedGroup] = useState<VolunteerGroup>(
    userVolunteerGroup || volunteerGroups[0]
  );
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newSpecialization, setNewSpecialization] = useState<string>('Water & Flood Rescue');
  const [newCallsign, setNewCallsign] = useState<string>('');

  // Field Report Form State
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [fieldHeadcount, setFieldHeadcount] = useState<number>(4);
  const [fieldNotes, setFieldNotes] = useState<string>('');
  const [fieldHazards, setFieldHazards] = useState<string>('Live power cable submerged; high current.');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    createVolunteerGroup({
      name: newGroupName,
      callsign: newCallsign || newGroupName.toUpperCase().replace(/\s+/g, '-'),
      specialization: newSpecialization,
      leaderId: currentUser.id,
      leaderName: currentUser.name,
      memberIds: [currentUser.id],
      members: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: 'Unit Commander / Leader',
          phone: currentUser.phone || '+91 98000 00000',
          skill: 'Disaster Coordination',
        },
      ],
      resources: ['First Aid Kits', 'Search & Rescue Ropes', 'High-Output Megaphones'],
      vehicles: ['All-Terrain Utility Vehicle'],
    });

    setNewGroupName('');
    setNewCallsign('');
    setIsCreatingGroup(false);
  };

  const handleStatusChange = (status: VolunteerGroupStatus) => {
    if (selectedGroup) {
      updateGroupStatus(selectedGroup.id, status);
      setSelectedGroup((prev) => ({ ...prev, status, lastStatusUpdate: 'Just now' }));
    }
  };

  const handleSubmitFieldReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    submitVolunteerReport({
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      incidentId: selectedGroup.assignedIncidentId,
      lat: selectedGroup.currentLocation.lat,
      lng: selectedGroup.currentLocation.lng,
      locationAddress: selectedGroup.currentLocation.address,
      rescuedCount: Number(fieldHeadcount),
      resourcesUtilized: ['Inflatable Boat fuel', '4x PFD Lifejackets', 'Trauma bandages'],
      hazardObservations: fieldHazards,
      summary: fieldNotes || 'Successfully evacuated stranded residents to designated safe terrace.',
      reporterName: currentUser.name,
    });

    setShowReportModal(false);
    setFieldNotes('');
    alert('Field report submitted and synced to District Command.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Group-Based Volunteer Taskforce System
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Coordinated Rescue Units & Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Volunteers deploy in structured squads with dedicated equipment, specialized roles, and real-time mission telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingGroup(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg transition-all shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Form New Taskforce
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Groups */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>ACTIVE TASKFORCES ({volunteerGroups.length})</span>
            <span className="text-indigo-600 dark:text-indigo-400">Sector Staging</span>
          </div>

          <div className="space-y-2.5">
            {volunteerGroups.map((group) => {
              const isSelected = selectedGroup?.id === group.id;
              const isMyGroup = group.leaderId === currentUser.id || group.memberIds.includes(currentUser.id);

              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {group.name}
                        </span>
                        {isMyGroup && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                            YOUR SQUAD
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {group.specialization} • Callsign: <span className="font-mono">{group.callsign}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        group.status === 'AVAILABLE'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : group.status === 'ACTIVE' || group.status === 'ON_SCENE'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 animate-pulse'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {group.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {group.members?.length || group.memberIds.length} Members
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> {group.vehicles?.[0] || 'Utility Van'}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {group.rescueCapabilityRating}% Ready
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle & Right Columns: Selected Group Details & Mission Command */}
        <div className="lg:col-span-2 space-y-6">
          {selectedGroup && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Squad Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedGroup.name}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedGroup.callsign}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Lead: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedGroup.leaderName}</span> • Specialized in {selectedGroup.specialization}
                  </p>
                </div>

                {/* Status Switcher for Squad */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['AVAILABLE', 'ASSIGNED', 'ON_SCENE', 'RESTING'] as VolunteerGroupStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                          selectedGroup.status === st
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Active Assigned Mission */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-indigo-600" /> Active Mission Assignment
                  </div>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> File Mission Field Report
                  </button>
                </div>

                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedGroup.assignedIncidentTitle || 'Sector Patrol & Pre-emptive Evacuation Support'}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Staging Location: {selectedGroup.currentLocation.address}</span>
                </div>
              </div>

              {/* Squad Roster & Gear */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Squad Members */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" /> Squad Personnel ({selectedGroup.members?.length || 2})
                  </div>
                  <div className="space-y-2">
                    {(selectedGroup.members || []).map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{m.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.role} • {m.skill}</div>
                        </div>
                        <a
                          href={`tel:${m.phone}`}
                          className="p-1.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
                          title="Call member"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Squad Equipment & Vehicles */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" /> Squad Gear & Vehicles
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Allocated Vehicles:</div>
                    <div className="flex flex-wrap gap-1">
                      {(selectedGroup.vehicles || ['Emergency 4x4 Support']).map((v, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                          🚐 {v}
                        </span>
                      ))}
                    </div>

                    <div className="font-semibold text-slate-800 dark:text-slate-200 pt-2">Kit & Hardware:</div>
                    <div className="flex flex-wrap gap-1">
                      {(selectedGroup.resources || []).map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px]">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Volunteer Group */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Form New Volunteer Taskforce</h3>
            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Squad / Group Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasba Peth First Responders"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Squad Callsign:</label>
                <input
                  type="text"
                  placeholder="e.g. KASBA-UNIT-1"
                  value={newCallsign}
                  onChange={(e) => setNewCallsign(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Specialization:</label>
                <select
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Water & Flood Rescue">Water & Flood Rescue</option>
                  <option value="Medical Rapid Response">Medical Rapid Response</option>
                  <option value="Structural Collapse & Heavy Rescue">Structural Collapse & Heavy Rescue</option>
                  <option value="Supply Chain & Relief Logistics">Supply Chain & Relief Logistics</option>
                  <option value="Drone Reconnaissance & Search">Drone Reconnaissance & Search</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow"
                >
                  Register Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: File Volunteer Field Report */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              File Squad Field Situation Report
            </h3>
            <form onSubmit={handleSubmitFieldReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Citizens Extracted / Rescued:
                </label>
                <input
                  type="number"
                  min="0"
                  value={fieldHeadcount}
                  onChange={(e) => setFieldHeadcount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hazard Observations & Blockages:
                </label>
                <input
                  type="text"
                  value={fieldHazards}
                  onChange={(e) => setFieldHazards(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Field Mission Summary:
                </label>
                <textarea
                  rows={3}
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  placeholder="Details on extraction, remaining stranded individuals, relief goods provided..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow"
                >
                  Submit to Command
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
