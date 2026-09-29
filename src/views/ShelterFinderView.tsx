import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BASE_LAT, BASE_LNG } from '../data/initialData';
import { Shelter, ShelterBooking } from '../types';
import {
  Home,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Utensils,
  Droplets,
  Stethoscope,
  PlusCircle,
  Users,
  ShieldCheck,
  QrCode,
  Calendar,
  Building2,
  Search,
  Filter,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
  Bed,
  Check,
  Download,
  Share2,
} from 'lucide-react';

interface ShelterFinderViewProps {
  setCurrentTab: (tab: string) => void;
}

type TabMode = 'browse' | 'book' | 'register_facility' | 'my_passes';

export const ShelterFinderView: React.FC<ShelterFinderViewProps> = ({ setCurrentTab }) => {
  const {
    shelters,
    shelterBookings,
    bookShelter,
    addShelter,
    cancelShelterBooking,
    checkInShelterBooking,
    currentUser,
    userLocation,
    userLocationAddress,
    isEffectiveOffline,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabMode>('browse');
  const [selectedShelterId, setSelectedShelterId] = useState<string>(
    shelters.find((s) => s.isOpen && s.capacity > s.occupancy)?.id || shelters[0]?.id || ''
  );

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL'); // ALL, OPEN, FOOD, MEDICAL

  // Booking Form State
  const [citizenName, setCitizenName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [elderlyCount, setElderlyCount] = useState<number>(0);
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');
  const [lastCreatedBooking, setLastCreatedBooking] = useState<ShelterBooking | null>(null);

  // Facility Registration Form State (Host a Shelter)
  const [facName, setFacName] = useState('');
  const [facAddress, setFacAddress] = useState(userLocationAddress || '');
  const [facCapacity, setFacCapacity] = useState<number>(100);
  const [facFood, setFacFood] = useState<boolean>(true);
  const [facWater, setFacWater] = useState<boolean>(true);
  const [facMedical, setFacMedical] = useState<boolean>(false);
  const [facPhone, setFacPhone] = useState(currentUser.phone || '');
  const [facType, setFacType] = useState<
    'Government Relief Camp' | 'Community Hall' | 'School Facility' | 'Religious Center' | 'Private/NGO Center'
  >('Community Hall');
  const [facSubmitted, setFacSubmitted] = useState(false);

  const myBookings = (shelterBookings || []).filter(
    (b) => b.citizenId === currentUser?.id || b.phone === currentUser?.phone
  );

  const selectedShelter = (shelters || []).find((s) => s.id === selectedShelterId) || (shelters || [])[0];

  // Handle Quick Register for a specific shelter
  const handleQuickBookShelter = (shelterId: string) => {
    setSelectedShelterId(shelterId);
    setActiveTab('book');
  };

  // Handle Bed Reservation Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShelter) return;

    const totalHeadCount = Math.max(1, adultsCount + childrenCount + elderlyCount);

    const booking = bookShelter({
      shelterId: selectedShelter.id,
      shelterName: selectedShelter.name,
      citizenId: currentUser.id,
      citizenName: citizenName.trim() || 'Citizen Member',
      phone: phone.trim() || '+91 98000 00000',
      headCount: totalHeadCount,
      adultsCount,
      childrenCount,
      elderlyCount,
      specialNeeds: specialNeeds.trim(),
      emergencyContact: emergencyContact.trim(),
      notes: notes.trim(),
    });

    setLastCreatedBooking(booking);
    setActiveTab('my_passes');
  };

  // Handle Facility Registration Submission
  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facAddress.trim() || !facPhone.trim()) return;

    addShelter({
      name: facName.trim(),
      locationAddress: facAddress.trim(),
      lat: userLocation ? userLocation.lat : BASE_LAT + (Math.random() * 0.03 - 0.015),
      lng: userLocation ? userLocation.lng : BASE_LNG + (Math.random() * 0.03 - 0.015),
      capacity: Number(facCapacity) || 100,
      occupancy: 0,
      foodAvailable: facFood,
      waterAvailable: facWater,
      medicalSupportAvailable: facMedical,
      isOpen: true,
      contactNumber: facPhone.trim(),
      shelterType: facType,
      rulesAndAmenities: [
        facFood ? 'Food Rations Provided' : 'Basic Shelter Only',
        facWater ? 'Drinking Water Point' : 'BYO Water',
        facMedical ? 'First Aid & Medical Support' : 'Standard First Aid Kit',
        'Verified Community Safe Zone',
      ],
    });

    setFacSubmitted(true);
    setFacName('');
    setFacAddress('');
    setTimeout(() => {
      setFacSubmitted(false);
      setActiveTab('browse');
    }, 2500);
  };

  // Filtered Shelters list
  const filteredShelters = (shelters || []).filter((shl) => {
    const matchesSearch =
      shl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shl.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shl.shelterType && shl.shelterType.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'OPEN') return shl.isOpen && shl.capacity > shl.occupancy;
    if (filterType === 'FOOD') return shl.foodAvailable;
    if (filterType === 'MEDICAL') return shl.medicalSupportAvailable;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="neu-raised rounded-3xl p-5 sm:p-6 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              SHELTER & BED REGISTRATION
            </span>
            <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {shelters.length} Verified Centers
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
            Emergency Shelters & Family Bed Booking
          </h1>
          <p className="text-xs text-slate-500">
            Find open safe havens, register your family for guaranteed beds, or register a community facility to host displaced citizens.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('book')}
            className="neu-btn-teal px-4 py-2.5 text-white text-xs font-black rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer touch-target"
          >
            <Bed className="w-4 h-4" /> <span>BOOK BED PASS</span>
          </button>
          <button
            onClick={() => setCurrentTab('community_map')}
            className="neu-btn px-3 py-2.5 text-slate-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 cursor-pointer touch-target"
          >
            <MapPin className="w-4 h-4 text-teal-600" /> <span>MAP</span>
          </button>
        </div>
      </div>

      {/* Interactive Navigation Tabs */}
      <div className="neu-flat rounded-2xl p-1.5 border border-white flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === 'browse'
              ? 'neu-chip-active text-teal-800 font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Browse All ({shelters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('book')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === 'book'
              ? 'neu-chip-active text-teal-800 font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bed className="w-3.5 h-3.5" />
          <span>Book Bed for Family</span>
        </button>

        <button
          onClick={() => setActiveTab('register_facility')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === 'register_facility'
              ? 'neu-chip-active text-teal-800 font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Host a Shelter</span>
        </button>

        <button
          onClick={() => setActiveTab('my_passes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === 'my_passes'
              ? 'neu-chip-active text-teal-800 font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>My Passes ({myBookings.length})</span>
        </button>
      </div>

      {/* TAB 1: BROWSE SHELTERS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shelter by name, area, or facility type..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters:
              </span>
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filterType === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Shelters
              </button>
              <button
                onClick={() => setFilterType('OPEN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filterType === 'OPEN'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🟢 Available Beds Only
              </button>
              <button
                onClick={() => setFilterType('FOOD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filterType === 'FOOD'
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🍲 Free Meals Provided
              </button>
              <button
                onClick={() => setFilterType('MEDICAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filterType === 'MEDICAL'
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🩺 Medical Support
              </button>
            </div>
          </div>

          {/* Shelter Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredShelters.map((shl) => {
              const availableCapacity = Math.max(0, shl.capacity - shl.occupancy);
              const occupancyPercent = Math.round((shl.occupancy / shl.capacity) * 100);

              return (
                <div
                  key={shl.id}
                  className="card-3d bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                            <Home className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {shl.shelterType || 'Relief Shelter'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {shl.distanceKm ? `~${shl.distanceKm} km away` : 'Nearby'}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-2">{shl.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">📍 {shl.locationAddress}</p>
                      </div>

                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border shrink-0 ${
                          shl.isOpen && availableCapacity > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {shl.isOpen && availableCapacity > 0 ? '🟢 OPEN' : '🔴 FULL'}
                      </span>
                    </div>

                    {/* Occupancy Progress Bar */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs font-extrabold text-slate-700">
                        <span>Live Bed Occupancy</span>
                        <span>
                          {shl.occupancy} / {shl.capacity} ({occupancyPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            occupancyPercent > 90
                              ? 'bg-rose-600'
                              : occupancyPercent > 70
                              ? 'bg-amber-500'
                              : 'bg-teal-600'
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-semibold pt-0.5">
                        <span>Total Capacity: {shl.capacity} beds</span>
                        <span className="text-teal-700 font-bold">
                          {availableCapacity > 0 ? `✨ ${availableCapacity} Beds Vacant` : '⚠️ No Vacancy'}
                        </span>
                      </div>
                    </div>

                    {/* Facilities Status Badges */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-center ${
                          shl.foodAvailable
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <Utensils className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold">Hot Meals</span>
                      </div>

                      <div
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-center ${
                          shl.waterAvailable
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-bold">RO Water</span>
                      </div>

                      <div
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-center ${
                          shl.medicalSupportAvailable
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="font-bold">Medical</span>
                      </div>
                    </div>

                    {/* Amenities list */}
                    {shl.rulesAndAmenities && shl.rulesAndAmenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {shl.rulesAndAmenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-100 gap-2 mt-2">
                    <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-600" /> {shl.contactNumber}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentTab('community_map')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                      >
                        Map
                      </button>
                      <button
                        onClick={() => handleQuickBookShelter(shl.id)}
                        disabled={!shl.isOpen || availableCapacity <= 0}
                        className={`px-4 py-2 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 ${
                          shl.isOpen && availableCapacity > 0
                            ? 'bg-teal-700 hover:bg-teal-600 text-white btn-3d cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Bed className="w-3.5 h-3.5" /> Register / Book Bed
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredShelters.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">No Shelters Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No shelters matched your search criteria. Try removing filters or register a new facility to help.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('ALL');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTER / BOOK SHELTER BED */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="card-3d bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-teal-700 text-white rounded-2xl shadow-sm">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                      Family Shelter Bed Registration
                    </h2>
                    <p className="text-xs text-slate-500">
                      Reserve guaranteed safe lodging, food access, and medical priority for your family.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {/* Select Shelter */}
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                    Select Target Relief Shelter *
                  </label>
                  <select
                    value={selectedShelterId}
                    onChange={(e) => setSelectedShelterId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 bg-slate-50"
                  >
                    {shelters.map((shl) => {
                      const avail = Math.max(0, shl.capacity - shl.occupancy);
                      return (
                        <option key={shl.id} value={shl.id} disabled={!shl.isOpen || avail <= 0}>
                          {shl.name} - {avail} beds left ({shl.locationAddress})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Primary Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 block mb-1">
                      Primary Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-800 block mb-1">
                      Primary Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* Head Count Breakdown */}
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                    Family & Group Member Count (Total Beds Needed)
                  </label>
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">Adults</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={adultsCount}
                        onChange={(e) => setAdultsCount(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">Children (&lt;12)</span>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">Elderly (&gt;60)</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={elderlyCount}
                        onChange={(e) => setElderlyCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 text-center"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      Total Allocated Space: {adultsCount + childrenCount + elderlyCount} Persons
                    </span>
                  </div>
                </div>

                {/* Special Medical / Assistance Needs */}
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Special Medical / Assistance Requirements (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNeeds}
                    onChange={(e) => setSpecialNeeds(e.target.value)}
                    placeholder="e.g. Wheelchair access, infant formula, insulin storage, oxygen support"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Emergency Contact & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 block mb-1">
                      Alternative Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. +91 98222 11111 (Relative)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-800 block mb-1">
                      Arrival Time / Special Note
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Arriving in 30 mins via NDRF rescue boat"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-700/20 btn-3d flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-5 h-5 text-teal-300" />
                    CONFIRM & GENERATE DIGITAL SHELTER PASS
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    ⚡ Instant Digital Pass issued. Guaranteed bed allocation and free meal entitlement.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Selected Shelter Overview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                SELECTED SHELTER DETAILS
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">{selectedShelter?.name}</h3>
              <p className="text-xs text-slate-500">📍 {selectedShelter?.locationAddress}</p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-700">
                  <span>Available Beds:</span>
                  <span className="text-teal-700 font-bold">
                    {Math.max(0, (selectedShelter?.capacity || 0) - (selectedShelter?.occupancy || 0))} / {selectedShelter?.capacity}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Manager Contact:</span>
                  <span className="font-mono text-slate-800">{selectedShelter?.contactNumber}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-800 block">Shelter Facilities Included:</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free warm meals & filtered drinking water</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>24/7 Security and paramedic presence</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Designated family cubicles and charging points</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Please show your digital pass QR code to the reception desk volunteer when you reach the shelter gate.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFER / REGISTER NEW SHELTER FACILITY */}
      {activeTab === 'register_facility' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="card-3d bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-purple-700 text-white rounded-2xl shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                    Offer or Register a New Shelter Facility
                  </h2>
                  <p className="text-xs text-slate-500">
                    Register community halls, schools, religious centers, or private buildings as temporary relief safe spaces.
                  </p>
                </div>
              </div>
            </div>

            {facSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold">🎉 Facility Registered Successfully!</p>
                  <p className="text-[11px] text-emerald-700 font-normal">
                    Your shelter is now active on the SAHAAY network map and cached for on-ground disaster teams.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleFacilitySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Shelter / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="e.g. Saraswati High School Auditorium & Ground"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Facility Type *
                  </label>
                  <select
                    value={facType}
                    onChange={(e: any) => setFacType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 bg-slate-50"
                  >
                    <option value="Community Hall">Community Hall</option>
                    <option value="School Facility">School / College Campus</option>
                    <option value="Religious Center">Religious Center (Temple / Gurudwara / Church)</option>
                    <option value="Government Relief Camp">Government Disaster Center</option>
                    <option value="Private/NGO Center">Private / NGO Safe Haven</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Estimated Bed / People Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="5000"
                    value={facCapacity}
                    onChange={(e) => setFacCapacity(parseInt(e.target.value) || 100)}
                    placeholder="e.g. 250"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Full Location Address & Landmarks *
                </label>
                <input
                  type="text"
                  required
                  value={facAddress}
                  onChange={(e) => setFacAddress(e.target.value)}
                  placeholder="e.g. Plot 12, Main Road, Opp Municipal Garden"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Manager / Coordinator Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={facPhone}
                  onChange={(e) => setFacPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Checkboxes for resources */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-2">
                  Facilities Available on Site:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facFood}
                      onChange={(e) => setFacFood(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">🍲 Food / Community Kitchen</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facWater}
                      onChange={(e) => setFacWater(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">💧 Safe Drinking Water</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facMedical}
                      onChange={(e) => setFacMedical(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">🩺 Medical Support</span>
                  </label>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-700/20 btn-3d flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-purple-200" />
                  REGISTER & PUBLISH NEW SHELTER FACILITY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: MY SHELTER PASSES */}
      {activeTab === 'my_passes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-['Outfit']">
                My Active Shelter Passes & Bed Allocations
              </h2>
              <p className="text-xs text-slate-500">
                Present this digital QR pass to reception volunteers for immediate bed access and food tokens.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('book')}
              className="px-4 py-2 bg-teal-700 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Bed className="w-4 h-4" /> Book Another Bed
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">No Active Shelter Passes</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have not booked any shelter beds yet. Click below to register for guaranteed safe accommodation.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md inline-flex items-center gap-1.5"
              >
                <Bed className="w-4 h-4" /> Register For Shelter Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-white rounded-3xl border-2 border-teal-600/30 p-6 shadow-xl space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-teal-700 text-white text-[10px] font-mono font-extrabold px-3 py-1 rounded-bl-xl">
                    PASS #{bk.qrPassCode}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-teal-50 text-teal-800 rounded-2xl border border-teal-200 shrink-0">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                          bk.status === 'CHECKED_IN'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : bk.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {bk.status === 'CHECKED_IN' ? '✅ CHECKED IN' : bk.status}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">{bk.shelterName}</h3>
                      <p className="text-xs text-slate-500">Reserved for: <strong>{bk.citizenName}</strong> ({bk.phone})</p>
                    </div>
                  </div>

                  {/* Pass Details */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Total Beds</span>
                      <span className="text-base font-extrabold text-teal-800">{bk.headCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Breakdown</span>
                      <span className="text-xs font-extrabold text-slate-700">
                        {bk.adultsCount}A / {bk.childrenCount}C / {bk.elderlyCount}E
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Issued</span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {new Date(bk.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {bk.specialNeeds && (
                    <div className="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                      <strong>Medical/Special Needs:</strong> {bk.specialNeeds}
                    </div>
                  )}

                  {/* Simulated QR Code Container */}
                  <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-slate-900" />
                      </div>
                      <div>
                        <span className="text-[10px] text-teal-400 font-mono font-bold block">VERIFIED PASS TOKEN</span>
                        <span className="text-xs font-mono font-extrabold text-white">{bk.qrPassCode}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      {bk.status !== 'CHECKED_IN' && bk.status !== 'CANCELLED' && (
                        <button
                          onClick={() => checkInShelterBooking(bk.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold rounded-lg shadow cursor-pointer transition-all"
                        >
                          Check In Now
                        </button>
                      )}
                      {bk.status !== 'CANCELLED' && (
                        <button
                          onClick={() => cancelShelterBooking(bk.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-rose-900 text-rose-300 text-[10px] font-bold rounded-lg cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
