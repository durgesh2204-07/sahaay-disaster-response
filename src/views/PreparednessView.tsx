import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Flame,
  Droplets,
  Wind,
  Mountain,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';

interface PreparednessViewProps {
  setCurrentTab: (tab: string) => void;
}

interface DisasterGuide {
  id: string;
  name: string;
  icon: string;
  accentColor: string;
  warningSigns: string[];
  before: string[];
  during: string[];
  after: string[];
}

const GUIDES: DisasterGuide[] = [
  {
    id: 'flood',
    name: 'Flood & Flash Inundation',
    icon: '🌊',
    accentColor: 'border-teal-200 bg-teal-50/50',
    warningSigns: [
      'Rapidly rising water levels in nearby nullahs or drainage channels.',
      'Continuous heavy downpour alert from meteorological department.',
      'Sewer backups or bubbling water emerging from ground drains.',
    ],
    before: [
      'Turn off main electrical breaker and gas cylinder valves before leaving.',
      'Move essential documents, medicines, and electronics to the top floor or high shelves.',
      'Fill clean bottles with drinking water (at least 3 liters per person per day).',
    ],
    during: [
      'NEVER attempt to walk or drive through moving floodwaters (15cm sweeps a person, 30cm moves a car).',
      'If trapped inside, climb to highest floor or rooftop; signal rescuers with bright cloth or flashlight.',
      'Avoid touching submerged electrical poles, wires, or appliances.',
    ],
    after: [
      'Do NOT consume tap water until municipal authority certifies it safe; boil all drinking water.',
      'Watch for venomous snakes or animals that may seek refuge in flooded rooms.',
      'Photograph all property damage before beginning cleanup for relief claims.',
    ],
  },
  {
    id: 'fire',
    name: 'Structural Fire & Heatwave',
    icon: '🔥',
    accentColor: 'border-rose-200 bg-rose-50/50',
    warningSigns: [
      'Pungent smoke smell or crackling sound inside walls or ceilings.',
      'Hot door handles or warm wall panels indicating fire on the other side.',
      'Sudden tripping of electrical circuit breakers or flickering wiring.',
    ],
    before: [
      'Install smoke alarms on every level and check battery status monthly.',
      'Identify two clear emergency exit routes from every room in your residence.',
      'Keep an ABC-type fire extinguisher in or near the kitchen and know the P.A.S.S. technique.',
    ],
    during: [
      'Drop to hands and knees and CRAWL under smoke where breathable air is purest.',
      'Touch doors with the back of your hand; if hot, do NOT open; use secondary exit or window.',
      'If your clothes catch fire: STOP, DROP to the ground, and ROLL repeatedly.',
    ],
    after: [
      'Do NOT re-enter the building until the Fire Department issues official clearance.',
      'Cool minor burns with clean running cold water for 10-15 minutes; seek emergency medical care.',
      'Notify utility providers of any damaged gas or electrical service lines.',
    ],
  },
  {
    id: 'cyclone',
    name: 'Cyclone & Severe Gale Storms',
    icon: '🌀',
    accentColor: 'border-blue-200 bg-blue-50/50',
    warningSigns: [
      'Significant barometric pressure drop and sudden abnormal sea swell or tide rise.',
      'IMD cyclone orange or red warnings issued for coastal and inland districts.',
      'Eerily high wind gusts causing trees to sway violently.',
    ],
    before: [
      'Inspect roof tiles, tin sheets, and secure loose outdoor objects or satellite dishes.',
      'Tape window panes crisscross to prevent shattering shards from high-speed winds.',
      'Charge all mobile phones, power banks, and battery-powered emergency radios.',
    ],
    during: [
      'Stay strictly indoors in the strongest, windowless central room or under concrete beams.',
      'Beware the "eye of the storm" — winds may suddenly stop, followed quickly by violent opposite winds.',
      'Keep listening to official SAHAAY broadcasts or radio for shelter relocation orders.',
    ],
    after: [
      'Stay clear of fallen electric wires and waterlogged areas near snapped lines.',
      'Clear tree debris safely while wearing thick work gloves and closed shoes.',
      'Check neighbors, especially the elderly and families with young infants.',
    ],
  },
  {
    id: 'earthquake',
    name: 'Earthquake & Ground Tremors',
    icon: '🏚️',
    accentColor: 'border-amber-200 bg-amber-50/50',
    warningSigns: [
      'Rumbling underground sound resembling an approaching freight train.',
      'Sudden swaying of chandeliers, hanging fans, or rattling glassware.',
      'Agitated animal behavior (dogs barking hysterically, birds fleeing trees).',
    ],
    before: [
      'Bolt heavy bookcases, water heaters, and tall wardrobes firmly to wall studs.',
      'Identify safe spots in each room: under sturdy desks, against interior walls.',
      'Keep heavy objects on lower shelves rather than overhead cabinets.',
    ],
    during: [
      'DROP to hands and knees, COVER your head and neck under a sturdy table, and HOLD ON.',
      'If in bed, stay there and protect your head with a thick pillow.',
      'If outdoors, move immediately to an open clearing away from buildings, wires, and glass facades.',
    ],
    after: [
      'Expect aftershocks which may be as strong as the initial shockwave.',
      'Inspect for gas leaks; if smelled, turn off the main valve and evacuate immediately.',
      'Never use elevators; always take stairwells during evacuation.',
    ],
  },
  {
    id: 'landslide',
    name: 'Landslide & Hill Slope Mudflow',
    icon: '⛰️',
    accentColor: 'border-orange-200 bg-orange-50/50',
    warningSigns: [
      'New cracks appearing in plaster, tile, brick foundations, or road surfaces.',
      'Doors or windows jamming or sticking for the first time as ground shifts.',
      'Tilted trees, utility poles, or retaining walls along slopes.',
    ],
    before: [
      'Familiarize yourself with the slope history of your hill station or ghat road.',
      'Install flexible pipe fittings that resist breakage during subtle ground shifts.',
      'Identify higher elevation community shelters away from natural drainage ravines.',
    ],
    during: [
      'Evacuate immediately if unusual slope noises (rumbling trees cracking) are heard.',
      'If trapped and unable to evacuate, curl into a tight ball and protect your head.',
      'Move perpendicular away from the path of the flow, rather than running downhill in front of it.',
    ],
    after: [
      'Stay away from the slide area; secondary collapses frequently follow.',
      'Check for injured or trapped persons without entering direct slide path.',
      'Report broken utility lines to emergency dispatchers via SAHAAY immediately.',
    ],
  },
];

export const PreparednessView: React.FC<PreparednessViewProps> = ({ setCurrentTab }) => {
  const { activeRole } = useApp();
  const [expandedGuideId, setExpandedGuideId] = useState<string>('flood');
  const [activeStage, setActiveStage] = useState<'ALL' | 'WARNING' | 'BEFORE' | 'DURING' | 'AFTER'>('ALL');
  const [checklistItems, setChecklistItems] = useState<{ [key: string]: boolean }>({
    water: true,
    firstAid: true,
    torch: false,
    documents: false,
    powerBank: true,
    dryFood: false,
    prescriptions: false,
    whistle: false,
  });

  const handleBack = () => {
    if (activeRole === 'admin') setCurrentTab('admin_dashboard');
    else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
    else setCurrentTab('citizen_dashboard');
  };

  const toggleCheck = (key: string) => {
    setChecklistItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const packedCount = Object.values(checklistItems).filter(Boolean).length;
  const totalChecklist = Object.keys(checklistItems).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="neu-raised rounded-3xl p-5 border border-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="neu-btn p-2 rounded-2xl text-slate-700 cursor-pointer"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              SAFETY PROTOCOLS & GUIDELINES
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
              Disaster Preparedness
            </h1>
            <p className="text-xs text-slate-500">
              Essential life-safety instructions for 5 major disaster scenarios.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Emergency Go-Kit Checklist */}
      <div className="neu-raised rounded-3xl p-5 border border-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center text-sm shadow-xs">
              🎒
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Emergency Go-Bag Checklist
              </h3>
              <p className="text-[10px] text-slate-500">Tap items as you pack them</p>
            </div>
          </div>
          <span className="text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-1 rounded-xl border border-teal-200">
            {packedCount} of {totalChecklist} Packed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-teal-700 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${(packedCount / totalChecklist) * 100}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          {[
            { id: 'water', label: '3-Day Water (3L/day)' },
            { id: 'dryFood', label: 'Canned/Dry Rations' },
            { id: 'firstAid', label: 'First Aid Kit & Bandages' },
            { id: 'prescriptions', label: 'Prescription Medicines' },
            { id: 'torch', label: 'Waterproof Flashlight' },
            { id: 'powerBank', label: 'Charged Power Bank' },
            { id: 'documents', label: 'Waterproof ID Copies' },
            { id: 'whistle', label: 'Signaling Whistle' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCheck(item.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                checklistItems[item.id]
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                  checklistItems[item.id]
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-400 bg-white'
                }`}
              >
                {checklistItems[item.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <span className="truncate text-[11px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div className="neu-flat rounded-2xl p-2.5 border border-white space-y-2">
        <span className="text-[10px] font-black uppercase text-slate-500 px-2 block">
          Filter Phase Focus:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Protocols' },
            { id: 'WARNING', label: '⚠️ Warning Signs' },
            { id: 'BEFORE', label: '🛡️ Before (Prep)' },
            { id: 'DURING', label: '🚨 During (Survive)' },
            { id: 'AFTER', label: '🩹 After (Recovery)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStage(st.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeStage === st.id ? 'neu-chip-active font-black text-slate-900' : 'neu-btn text-slate-600'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Cards for Disasters */}
      <div className="space-y-3">
        {GUIDES.map((guide) => {
          const isExpanded = expandedGuideId === guide.id;

          return (
            <div
              key={guide.id}
              className={`neu-raised rounded-3xl border border-white overflow-hidden transition-all`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setExpandedGuideId(isExpanded ? '' : guide.id)}
                className="w-full p-4.5 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{guide.icon}</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-['Outfit']">
                      {guide.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Warning signs, preventative drills, and immediate response
                    </p>
                  </div>
                </div>

                <div className="neu-btn p-1.5 rounded-xl text-slate-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-4.5 pt-0 space-y-4 border-t border-slate-200/80 animate-fade-in">
                  {/* Warning Signs */}
                  {(activeStage === 'ALL' || activeStage === 'WARNING') && (
                    <div className="space-y-1.5 pt-3">
                      <span className="text-[11px] font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                        ⚠️ Early Warning Signs
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 pl-1">
                        {guide.warningSigns.map((w, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-600 font-bold">•</span>
                            <span className="leading-relaxed">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Before */}
                  {(activeStage === 'ALL' || activeStage === 'BEFORE') && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                        🛡️ Before: Preparedness Drills
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 pl-1">
                        {guide.before.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* During */}
                  {(activeStage === 'ALL' || activeStage === 'DURING') && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        🚨 During: Life Survival Actions
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 pl-1">
                        {guide.during.map((d, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-700 font-bold">•</span>
                            <span className="leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* After */}
                  {(activeStage === 'ALL' || activeStage === 'AFTER') && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        🩹 After: Safety & Hazard Inspection
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 pl-1">
                        {guide.after.map((a, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span className="leading-relaxed">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
