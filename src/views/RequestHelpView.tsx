import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RequestNeedType, SeverityLevel } from '../types';
import { BASE_LAT, BASE_LNG } from '../data/initialData';
import { TimelineView } from '../components/TimelineView';
import {
  Package,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Utensils,
  Droplets,
  Pill,
  Home,
  Shirt,
  Truck,
  HeartPulse,
  Baby,
  UserCheck,
  Zap,
  LifeBuoy,
  HelpCircle,
  MapPin,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface RequestHelpViewProps {
  setCurrentTab: (tab: string) => void;
}

interface NeedCategoryConfig {
  type: RequestNeedType;
  label: string;
  icon: React.ReactNode;
  color: string;
  defaultQuantity: string;
  placeholder: string;
}

const NEED_CATEGORIES: NeedCategoryConfig[] = [
  {
    type: 'Food',
    label: 'Food & Rations',
    icon: <Utensils className="w-4 h-4" />,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    defaultQuantity: '20 Cooked Meal Packets & 5 Dry Ration Kits',
    placeholder: 'e.g. 50 Cooked Meal Kits for stranded family',
  },
  {
    type: 'Water',
    label: 'Drinking Water',
    icon: <Droplets className="w-4 h-4" />,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    defaultQuantity: '10 Cans (20L each) Filtered Drinking Water',
    placeholder: 'e.g. 20 Liters Drinking Water Cans',
  },
  {
    type: 'Medicine',
    label: 'Medicines & First Aid',
    icon: <Pill className="w-4 h-4" />,
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    defaultQuantity: 'First Aid Kit, Paracetamol, ORS & Insulin',
    placeholder: 'e.g. Diabetic insulin storage, bandages, BP pills',
  },
  {
    type: 'Shelter',
    label: 'Emergency Shelter',
    icon: <Home className="w-4 h-4" />,
    color: 'text-teal-700 bg-teal-50 border-teal-200',
    defaultQuantity: 'Shelter space for 4 family members',
    placeholder: 'e.g. Temporary shelter relocation for flooded house',
  },
  {
    type: 'Search & Rescue',
    label: 'Boat / Evacuation Rescue',
    icon: <LifeBuoy className="w-4 h-4" />,
    color: 'text-red-700 bg-red-50 border-red-200',
    defaultQuantity: '1 Inflatable Rescue Boat for 6 Persons',
    placeholder: 'e.g. Waterlevel rising to 1st floor, urgent evacuation needed',
  },
  {
    type: 'Baby Care',
    label: 'Baby Formula & Diapers',
    icon: <Baby className="w-4 h-4" />,
    color: 'text-pink-700 bg-pink-50 border-pink-200',
    defaultQuantity: '2 Tins Infant Formula & 2 Diaper Packs (Medium)',
    placeholder: 'e.g. Baby milk powder, baby wipes, diapers',
  },
  {
    type: 'Elderly Care',
    label: 'Elderly & Mobility Support',
    icon: <UserCheck className="w-4 h-4" />,
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    defaultQuantity: 'Wheelchair Assistance & Adult Care Supplies',
    placeholder: 'e.g. Bedridden senior citizen assistance',
  },
  {
    type: 'Power & Lighting',
    label: 'Power Bank & Torch',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    defaultQuantity: '2 High-Capacity Power Banks & 3 LED Flashlights',
    placeholder: 'e.g. Power grid disconnected, need rechargeable lights',
  },
  {
    type: 'Clothing',
    label: 'Blankets & Tarpaulins',
    icon: <Shirt className="w-4 h-4" />,
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    defaultQuantity: '6 Warm Blankets & 2 Tarpaulin Waterproof Sheets',
    placeholder: 'e.g. Rainproof tarps, warm dry blankets',
  },
  {
    type: 'Transportation',
    label: 'Transport / Vehicle',
    icon: <Truck className="w-4 h-4" />,
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    defaultQuantity: '1 Van / Ambulance for 4 Displaced Citizens',
    placeholder: 'e.g. Need transport to Aundh Community Camp',
  },
  {
    type: 'Other',
    label: 'Other Disaster Help',
    icon: <HelpCircle className="w-4 h-4" />,
    color: 'text-slate-700 bg-slate-50 border-slate-200',
    defaultQuantity: 'Urgent Volunteer Support & Debris Clearance',
    placeholder: 'Describe your custom assistance requirement in detail',
  },
];

export const RequestHelpView: React.FC<RequestHelpViewProps> = ({ setCurrentTab }) => {
  const {
    addHelpRequest,
    helpRequests,
    currentUser,
    isEffectiveOffline,
    userLocation,
    userLocationAddress,
    requestLiveLocation,
    gpsStatus,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<NeedCategoryConfig>(NEED_CATEGORIES[0]);
  const [quantity, setQuantity] = useState('');
  const [locationAddress, setLocationAddress] = useState(userLocationAddress || '');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<SeverityLevel>('HIGH');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  React.useEffect(() => {
    if (userLocationAddress && (!locationAddress || locationAddress === 'Locating user...')) {
      setLocationAddress(userLocationAddress);
    }
  }, [userLocationAddress]);

  const myRequests = (helpRequests || []).filter((r) => r.citizenId === currentUser?.id);

  const handleCategorySelect = (cat: NeedCategoryConfig) => {
    setSelectedCategory(cat);
    if (!quantity) {
      setQuantity(cat.defaultQuantity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity.trim() || !locationAddress.trim() || !description.trim()) return;

    addHelpRequest({
      needType: selectedCategory.type,
      quantity: quantity.trim(),
      locationAddress: locationAddress.trim(),
      lat: userLocation ? userLocation.lat : BASE_LAT + (Math.random() * 0.02 - 0.01),
      lng: userLocation ? userLocation.lng : BASE_LNG + (Math.random() * 0.02 - 0.01),
      description: `${description.trim()}${contactPhone ? ` (Phone: ${contactPhone})` : ''}`,
      urgency,
    });

    setSubmittedMessage(true);
    setQuantity('');
    setDescription('');
    setTimeout(() => setSubmittedMessage(false), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="neu-raised rounded-3xl p-5 sm:p-6 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              DISASTER RELIEF & SUPPLIES
            </span>
            <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Direct Community Dispatch
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
            Request Any Help or Emergency Supplies
          </h1>
          <p className="text-xs text-slate-500">
            Request food rations, clean water, prescription medicines, baby supplies, boat rescue, or power generators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('shelters')}
            className="neu-btn-teal px-4 py-2.5 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer touch-target"
          >
            <Home className="w-4 h-4" /> <span>NEED SHELTER BED?</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-6">
          <div className="card-3d bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-teal-700 text-white rounded-xl shadow-sm">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Relief Request Form</h3>
                  <p className="text-[11px] text-slate-500">Volunteers & district disaster squads will be dispatched</p>
                </div>
              </div>
            </div>

            {submittedMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2.5 animate-fade-in shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold">✅ Request Submitted Successfully!</p>
                  <p className="text-[11px] text-emerald-700 font-normal">
                    {isEffectiveOffline
                      ? '📡 Saved on device! Queued for auto-sync once connectivity restores.'
                      : 'Assistance request broadcasted to nearest volunteers & relief centers.'}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Grid */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  Select Type of Help Needed *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NEED_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.type === cat.type;
                    return (
                      <button
                        type="button"
                        key={cat.type}
                        onClick={() => handleCategorySelect(cat)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500 font-extrabold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${cat.color} shrink-0`}>
                          {cat.icon}
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity / Requirements */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-800">
                    Specific Quantity / Items Needed *
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuantity(selectedCategory.defaultQuantity)}
                    className="text-[10px] text-teal-700 font-bold hover:underline"
                  >
                    Use Suggested Preset
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={selectedCategory.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Delivery Address / Location */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-800">
                    Delivery Address / Exact Location *
                  </label>
                  <button
                    type="button"
                    onClick={requestLiveLocation}
                    className="text-[10px] text-teal-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> Sync Current GPS
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g. Flat 302, Green Valley Apartments, Near Ganpati Temple"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Description / Special instructions */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Details & Special Circumstances *
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 4 family members stranded on upper floor, 1 infant requiring formula, waterlevel rising."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Urgency Level */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  Urgency Level
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as SeverityLevel[]).map((u) => {
                    const isSelected = urgency === u;
                    let uColor = 'bg-slate-900 text-teal-300 border-slate-900';
                    if (u === 'CRITICAL') uColor = 'bg-rose-600 text-white border-rose-600 shadow-md';
                    else if (u === 'HIGH') uColor = 'bg-amber-600 text-white border-amber-600 shadow-md';
                    else if (u === 'MEDIUM') uColor = 'bg-blue-600 text-white border-blue-600 shadow-md';

                    return (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`p-2 rounded-xl font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? `${uColor} font-extrabold`
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {u}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-teal-700/20 btn-3d flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" /> BROADCAST HELP REQUEST TO VOLUNTEERS
              </button>
            </form>
          </div>
        </div>

        {/* Right List Column: Visual Timelines */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
              Your Active Help Requests ({myRequests.length})
            </h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Live Response Tracker
            </span>
          </div>

          {myRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-extrabold text-slate-700 text-sm">No Active Requests</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Whenever you need food, medical kits, water, or evacuation assistance, submit a form on the left to receive live volunteer tracking.
              </p>
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3 card-3d"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        REQUEST #{req.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          req.urgency === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : req.urgency === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {req.urgency} URGENCY
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1.5">
                      {req.needType}: {req.quantity}
                    </h4>
                    <p className="text-xs text-slate-500">📍 {req.locationAddress}</p>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full shrink-0 ${
                      req.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'ASSIGNED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {req.description}
                </p>

                {req.assignedVolunteerName && (
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-800 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                    <span>🤝 Assigned Responder:</span>
                    <span>{req.assignedVolunteerName}</span>
                  </div>
                )}

                {/* Visual Timeline */}
                <TimelineView timeline={req.timeline} currentStatus={req.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
