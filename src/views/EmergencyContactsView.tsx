import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  PhoneCall,
  Shield,
  Flame,
  HeartPulse,
  Radio,
  Users,
  Search,
  ArrowLeft,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Waves,
  Mountain,
  Compass,
  Building,
  Heart,
  Car,
  Train,
  Check,
} from 'lucide-react';

interface EmergencyContactsViewProps {
  setCurrentTab: (tab: string) => void;
}

export type HelplineCategory =
  | 'ALL'
  | 'Disaster & NDRF'
  | 'Medical & Ambulance'
  | 'Police & Rescue'
  | 'Women & Children'
  | 'Transport & Highway';

interface ContactItem {
  id: string;
  name: string;
  number: string;
  displayNumber?: string;
  category: HelplineCategory;
  authority: string;
  description: string;
  badgeColor: string;
  icon: React.ReactNode;
  isNationalPriority?: boolean;
}

export const EmergencyContactsView: React.FC<EmergencyContactsViewProps> = ({ setCurrentTab }) => {
  const { isAuthenticated, activeRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelplineCategory>('ALL');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const CONTACTS: ContactItem[] = [
    // --- NATIONAL PRIORITY DISASTER & RESCUE ---
    {
      id: 'ndrf-1',
      name: 'NDRF HQ 24x7 Control Room',
      number: '01124363260',
      displayNumber: '011-24363260',
      category: 'Disaster & NDRF',
      authority: 'National Disaster Response Force (MHA)',
      description:
        'National headquarters 24/7 disaster control room for severe cyclones, flash floods, earthquakes, and structural rescue operations.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <Users className="w-5 h-5 text-rose-700" />,
      isNationalPriority: true,
    },
    {
      id: 'ndrf-alt',
      name: 'NDRF Disaster Operations Desk',
      number: '9711077372',
      displayNumber: '+91 97110 77372',
      category: 'Disaster & NDRF',
      authority: 'NDRF Operational Command',
      description:
        'Immediate mobile operations liaison desk for emergency unit deployment and crisis coordination.',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <Radio className="w-5 h-5 text-orange-700" />,
    },
    {
      id: 'ndma-1078',
      name: 'National Disaster Management Helpline (NDMA)',
      number: '1078',
      category: 'Disaster & NDRF',
      authority: 'National Disaster Management Authority',
      description:
        'Toll-free disaster management helpline for natural disasters, early warnings, and coordinated relief distribution.',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-700" />,
      isNationalPriority: true,
    },
    {
      id: 'erss-112',
      name: 'National Emergency Response System (ERSS)',
      number: '112',
      category: 'Police & Rescue',
      authority: 'Ministry of Home Affairs, Govt. of India',
      description:
        'Single unified all-in-one emergency number across India for Police, Fire, Ambulance, and Disaster First Responders.',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      icon: <Shield className="w-5 h-5 text-red-700" />,
      isNationalPriority: true,
    },
    {
      id: 'sdma-1070',
      name: 'State Disaster Management Control Room (SDMA)',
      number: '1070',
      category: 'Disaster & NDRF',
      authority: 'State Government Disaster Management',
      description:
        'Direct connection to your State Emergency Operations Centre (SEOC) for statewide alerts, evacuation shelters, and relief camps.',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: <Building className="w-5 h-5 text-teal-700" />,
    },
    {
      id: 'ddma-1077',
      name: 'District Disaster Management Authority (DDMA)',
      number: '1077',
      category: 'Disaster & NDRF',
      authority: 'District Collectorate / Magistrate Office',
      description:
        'District level disaster response control for local flood monitoring, landslide blockades, village evacuations, and local relief depots.',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: <Radio className="w-5 h-5 text-cyan-700" />,
    },
    {
      id: 'flood-cyclone',
      name: 'Central Flood & Cyclone Control Room',
      number: '01126701728',
      displayNumber: '011-26701728',
      category: 'Disaster & NDRF',
      authority: 'Central Water Commission & IMD',
      description:
        'Specialized hydrological monitoring center for river water levels, dam discharge emergencies, and coastal cyclone tracking.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Waves className="w-5 h-5 text-blue-700" />,
    },
    {
      id: 'coast-guard',
      name: 'Indian Coast Guard Search & Rescue (SAR)',
      number: '1554',
      category: 'Disaster & NDRF',
      authority: 'Ministry of Defence',
      description:
        'Toll-free maritime distress and coastal search & rescue for fishermen, flood-submerged coastal areas, and sea boat rescues.',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: <Compass className="w-5 h-5 text-indigo-700" />,
    },
    {
      id: 'landslide-ctrl',
      name: 'National Landslide Emergency & Warning',
      number: '18001805558',
      displayNumber: '1800-180-5558',
      category: 'Disaster & NDRF',
      authority: 'Geological Survey of India (GSI)',
      description:
        'Hilly terrain landslide reporting, slope stabilization emergency advisory, and road collapse response dispatch.',
      badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
      icon: <Mountain className="w-5 h-5 text-stone-700" />,
    },
    {
      id: 'tsunami-ctrl',
      name: 'Earthquake & Tsunami Warning Center (INCOIS)',
      number: '04023895011',
      displayNumber: '040-23895011',
      category: 'Disaster & NDRF',
      authority: 'Ministry of Earth Sciences',
      description:
        'Official seismic event monitoring and coastal tsunami early advisory command center.',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
      icon: <Radio className="w-5 h-5 text-violet-700" />,
    },

    // --- FIRST RESPONDERS & MEDICAL ---
    {
      id: 'amb-108',
      name: 'Medical Ambulance Emergency Dispatch',
      number: '108',
      category: 'Medical & Ambulance',
      authority: 'National Health Mission',
      description:
        '24/7 free paramedic transport, critical trauma response, oxygen support, and nearest ICU hospital routing.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <HeartPulse className="w-5 h-5 text-emerald-700" />,
      isNationalPriority: true,
    },
    {
      id: 'amb-102',
      name: 'Government Hospital Ambulance',
      number: '102',
      category: 'Medical & Ambulance',
      authority: 'Govt. Maternity & Emergency Healthcare',
      description:
        'Free transport for pregnant mothers, infants, and basic medical care transfer during disaster displacement.',
      badgeColor: 'bg-green-100 text-green-800 border-green-300',
      icon: <Heart className="w-5 h-5 text-green-700" />,
    },
    {
      id: 'fire-101',
      name: 'Fire & HAZMAT Rescue Service',
      number: '101',
      category: 'Police & Rescue',
      authority: 'State Fire & Disaster Rescue Services',
      description:
        'Emergency structural fire suppression, chemical spill containment, building collapse rescue, and high-water evacuation boats.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <Flame className="w-5 h-5 text-rose-700" />,
      isNationalPriority: true,
    },
    {
      id: 'police-100',
      name: 'Police Emergency Response',
      number: '100',
      category: 'Police & Rescue',
      authority: 'State Police Department',
      description:
        'Immediate law enforcement protection, roadblock reporting, crowd management during relief distribution, and missing citizen alerts.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Shield className="w-5 h-5 text-blue-700" />,
    },
    {
      id: 'blood-104',
      name: 'Blood Bank Immediate Availability Helpline',
      number: '104',
      category: 'Medical & Ambulance',
      authority: 'Central Health Information Bureau',
      description:
        'Real-time blood component availability across public blood banks for trauma surgery and disaster casualties.',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      icon: <HeartPulse className="w-5 h-5 text-red-700" />,
    },
    {
      id: 'poison-centre',
      name: 'Poison Information & Chemical Hazard Control',
      number: '1800116117',
      displayNumber: '1800-116-117',
      category: 'Medical & Ambulance',
      authority: 'AIIMS National Poison Information Centre',
      description:
        '24/7 expert medical toxicology guidance for contaminated floodwater ingestion, chemical leaks, and snakebites.',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: <AlertTriangle className="w-5 h-5 text-teal-700" />,
    },
    {
      id: 'kiran-mental',
      name: 'Mental Health & Trauma Counseling (KIRAN)',
      number: '18005990019',
      displayNumber: '1800-599-0019',
      category: 'Medical & Ambulance',
      authority: 'Ministry of Social Justice & Empowerment',
      description:
        'Free professional counseling in 13 languages for post-traumatic disaster stress, grief, anxiety, and shock relief.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: <Heart className="w-5 h-5 text-purple-700" />,
    },
    {
      id: 'air-amb',
      name: 'Critical Air Ambulance Evacuation Desk',
      number: '9540161344',
      displayNumber: '+91 95401 61344',
      category: 'Medical & Ambulance',
      authority: 'Emergency Medical Aviation Service',
      description:
        'Helicopter and fixed-wing air medical airlift for remote cut-off zones and critical multi-trauma patients.',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      icon: <Compass className="w-5 h-5 text-sky-700" />,
    },

    // --- WOMEN, CHILDREN & VULNERABLE CITIZENS ---
    {
      id: 'women-1091',
      name: 'Women in Distress & Safety Helpline',
      number: '1091',
      category: 'Women & Children',
      authority: 'National Commission for Women',
      description:
        'Immediate specialized rescue and protection assistance for women stranded or displaced during emergency events.',
      badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
      icon: <Users className="w-5 h-5 text-pink-700" />,
    },
    {
      id: 'child-1098',
      name: 'Childline 24/7 Protection & Rescue',
      number: '1098',
      category: 'Women & Children',
      authority: 'Ministry of Women & Child Development',
      description:
        'Nationwide emergency phone response and shelter care for lost, missing, unaccompanied, or distressed children.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <Users className="w-5 h-5 text-amber-700" />,
    },
    {
      id: 'senior-14567',
      name: 'Senior Citizens Helpline (Elder Line)',
      number: '14567',
      category: 'Women & Children',
      authority: 'Ministry of Social Justice',
      description:
        'Priority aid, medical supplies delivery, and safe evacuation assistance for elderly citizens stranded alone.',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: <Heart className="w-5 h-5 text-indigo-700" />,
    },
    {
      id: 'forest-1926',
      name: 'Forest Fire & Wildlife Disaster Helpline',
      number: '1926',
      category: 'Disaster & NDRF',
      authority: 'State Forest Department',
      description:
        'Emergency response for forest fires spreading to settlements and wild animal intrusion in flooded zones.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <Flame className="w-5 h-5 text-emerald-700" />,
    },

    // --- TRANSPORT, HIGHWAY & RAILWAYS ---
    {
      id: 'railway-1072',
      name: 'Railway Accident & Emergency Helpline',
      number: '1072',
      category: 'Transport & Highway',
      authority: 'Ministry of Railways (Indian Railways)',
      description:
        'Central railway emergency response for train accidents, track breaches due to floods, and rescue train dispatch.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <Train className="w-5 h-5 text-blue-700" />,
    },
    {
      id: 'nhai-1033',
      name: 'National Highway Emergency & Breakdown',
      number: '1033',
      category: 'Transport & Highway',
      authority: 'National Highways Authority of India (NHAI)',
      description:
        'Immediate route clearing, highway ambulance, crane recovery, and detour guidance for flooded or blocked expressways.',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <Car className="w-5 h-5 text-orange-700" />,
    },
  ];

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const filtered = CONTACTS.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.number.includes(q) ||
      (c.displayNumber && c.displayNumber.toLowerCase().includes(q)) ||
      c.authority.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleBack = () => {
    if (isAuthenticated) {
      if (activeRole === 'admin') setCurrentTab('admin_dashboard');
      else if (activeRole === 'volunteer') setCurrentTab('volunteer_dashboard');
      else setCurrentTab('citizen_dashboard');
    } else {
      setCurrentTab('auth');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-5 animate-fade-in">
      {/* Top Header Card - Direct, Public, No Login Barrier */}
      <div className="neu-raised rounded-3xl p-5 border border-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="neu-btn p-2.5 rounded-2xl text-slate-700 hover:text-slate-900 cursor-pointer shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
                  🔴 24/7 OFFICIAL DISASTER HELPLINES
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  PUBLIC ACCESS • NO SIGN-IN REQUIRED
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
                Disaster Management & Emergency Helplines
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Immediate direct phone lines to NDRF, SDMA, DDMA, Medical Ambulance, Fire Rescue, and Police.
              </p>
            </div>
          </div>
        </div>

        {/* Priority Quick-Dial Bar for Life-Threatening Emergencies */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-200 block">
                NATIONAL EMERGENCY (ALL-IN-ONE)
              </span>
              <div className="text-2xl font-black font-mono">112</div>
              <p className="text-[11px] text-red-100">Police • Fire • Ambulance • SAR</p>
            </div>
            <a
              href="tel:112"
              className="px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer touch-target transition-transform active:scale-95 shrink-0"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>CALL 112</span>
            </a>
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 block">
                NATIONAL DISASTER HELPLINE (NDMA/NDRF)
              </span>
              <div className="text-2xl font-black font-mono">1078</div>
              <p className="text-[11px] text-amber-100">Cyclone • Flood • Earthquake • Rescue</p>
            </div>
            <a
              href="tel:1078"
              className="px-4 py-2.5 bg-white text-amber-800 hover:bg-amber-50 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer touch-target transition-transform active:scale-95 shrink-0"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>CALL 1078</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="neu-flat rounded-2xl p-3.5 border border-white space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, number, or disaster type (e.g. NDRF, Cyclone, Ambulance, 108, Flood)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-inset text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(
            [
              'ALL',
              'Disaster & NDRF',
              'Medical & Ambulance',
              'Police & Rescue',
              'Women & Children',
              'Transport & Highway',
            ] as HelplineCategory[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'neu-chip-active text-teal-900 font-black'
                  : 'neu-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Count and Tip */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filtered.length}</strong> emergency helplines
        </span>
        <span className="text-[11px] text-slate-500">
          💡 Tap any call button to open your device's emergency phone dialer.
        </span>
      </div>

      {/* Helplines Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`neu-raised rounded-3xl p-4 border transition-all flex flex-col justify-between gap-3 ${
              item.isNationalPriority ? 'border-rose-300 ring-1 ring-rose-200' : 'border-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-white shadow-inner shrink-0 border border-slate-100 mt-0.5">
                {item.icon}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>
                <div className="text-[10px] font-extrabold text-teal-700 tracking-wide">
                  {item.authority}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-base font-black font-mono text-slate-900 pt-1 tracking-tight">
                  {item.displayNumber || item.number}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCopy(item.displayNumber || item.number)}
                title="Copy phone number"
                className="neu-btn px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0"
              >
                {copiedNumber === (item.displayNumber || item.number) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-extrabold text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>

              <a
                href={`tel:${item.number}`}
                className="neu-btn-danger px-4 py-2.5 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md flex-1 cursor-pointer touch-target transition-transform active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>DIAL {item.displayNumber || item.number}</span>
              </a>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full neu-flat rounded-3xl p-10 text-center text-slate-500 space-y-2">
            <Phone className="w-9 h-9 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">No Helplines Found</h3>
            <p className="text-xs text-slate-500">
              No contacts matched your search "{searchQuery}". Try searching "NDRF", "Ambulance", or "112".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
