import React, { useState } from 'react';
import { useApp, calculateDistanceKm } from '../../services/store';
import { HazardMap } from '../map/HazardMap';
import { Shelter } from '../../types';
import {
  Compass,
  MapPin,
  ShieldCheck,
  Navigation,
  PhoneCall,
  CheckCircle2,
  Users,
  AlertTriangle,
  Heart,
  Dog,
  Accessibility,
  Building,
  ArrowRight
} from 'lucide-react';

export const SheltersPage: React.FC = () => {
  const { shelters, user, alerts, roadClosures } = useApp();

  const [selectedShelter, setSelectedShelter] = useState<Shelter>(shelters[0]);
  const [filterMedical, setFilterMedical] = useState(false);
  const [filterPets, setFilterPets] = useState(false);
  const [filterWheelchair, setFilterWheelchair] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const userLocation = user.savedLocations[0];

  const filteredShelters = shelters.filter((s) => {
    if (filterMedical && !s.medicalSupport) return false;
    if (filterPets && !s.petFriendly) return false;
    if (filterWheelchair && !s.wheelchairAccessible) return false;
    return true;
  });

  // Calculate totals matching Screenshot 3 cards
  const totalShelters = shelters.length;
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);
  const availableSpace = Math.max(0, totalCapacity - totalOccupancy);

  const currentDist = calculateDistanceKm(userLocation.coordinates, selectedShelter.coordinates);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Safe Route & Shelter Finder
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Verified Civic Relief Network
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evacuation shelters with real-time occupancy and hazard-free navigation corridors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Origin:</span>
            <span className="text-xs font-bold text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              📍 {userLocation.label} ({userLocation.name})
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Metric Cards (Styled after Screenshot 3: TOTAL SHELTERS, TOTAL CAPACITY, CURRENT OCCUPANCY, AVAILABLE SPACE) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Shelters
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {totalShelters}
              </span>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Capacity
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 block">
                {totalCapacity}
              </span>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Occupancy
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">
                {totalOccupancy}
              </span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Available Space
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 block">
                {availableSpace}
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2">Filter Amenities:</span>
          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              filterMedical
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <span>Paramedic Post / Clinic</span>
          </button>

          <button
            onClick={() => setFilterPets(!filterPets)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              filterPets
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Dog className="w-3.5 h-3.5 text-amber-400" />
            <span>Pet Friendly</span>
          </button>

          <button
            onClick={() => setFilterWheelchair(!filterWheelchair)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              filterWheelchair
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wheelchair Ramps</span>
          </button>
        </div>

        {/* Main Grid: Left Shelters List, Right Map & Evac Route */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Shelters Cards (Screenshot 3 style) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Relief Shelters ({filteredShelters.length})
            </h2>

            <div className="space-y-3">
              {filteredShelters.map((shelter) => {
                const isSelected = selectedShelter.id === shelter.id;
                const occPercent = Math.round((shelter.occupancy / shelter.capacity) * 100);
                const dist = calculateDistanceKm(userLocation.coordinates, shelter.coordinates);

                return (
                  <div
                    key={shelter.id}
                    onClick={() => {
                      setSelectedShelter(shelter);
                      setIsNavigating(true);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">
                          {shelter.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{shelter.address}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                          shelter.status === 'OPEN'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : shelter.status === 'NEAR_FULL'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {shelter.status}
                      </span>
                    </div>

                    {/* Capacity details row (Screenshot 3 style) */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Capacity</span>
                        <span className="font-bold text-slate-200">{shelter.capacity} persons</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Occupancy</span>
                        <span className="font-bold text-cyan-400">
                          {shelter.occupancy} ({occPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full ${
                          occPercent > 85 ? 'bg-amber-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>

                    {/* Distance & Contact */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{dist} km from your focus location</span>
                      </div>
                      <a
                        href={`tel:${shelter.contactPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-slate-300 hover:text-white"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Desk</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Map & Safe Navigation Turn-by-Turn Waypoints */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Safe Evacuation Navigation & Hazard Overlay
              </h2>
              {isNavigating && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Safe Corridor Calculated
                </span>
              )}
            </div>

            {/* Interactive Map */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <HazardMap
                center={selectedShelter.coordinates}
                zoom={12}
                alerts={alerts}
                shelters={shelters}
                roadClosures={roadClosures}
                userLocations={user.savedLocations}
                showEvacuationRoute={isNavigating}
                targetShelter={selectedShelter}
                height="400px"
              />
            </div>

            {/* Turn-by-turn safe guidance */}
            {selectedShelter && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Safe Evacuation Corridor to {selectedShelter.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Est. Transit: {Math.max(8, Math.round(currentDist * 3.5))} mins
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3 p-2.5 bg-slate-800/40 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <span className="font-bold text-white">Depart Origin:</span>
                      <p className="text-slate-300">
                        Leave from {userLocation.name}. Proceed along higher ground heading away from the Mithi catchment basin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-800/40 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <span className="font-bold text-amber-300">Avoid Waterlogged Choke Point:</span>
                      <p className="text-slate-300">
                        Do NOT take Milan Subway or Sion railway underpass (3.2ft submerged). Divert via elevated Western Express flyover.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-800/40 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <div>
                      <span className="font-bold text-emerald-300">Check-In at Reception Desk:</span>
                      <p className="text-slate-300">
                        Arrive at {selectedShelter.address}. Report to NDRF Volunteer Desk for registration, dry blankets, and battery charging.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-[11px]">
                  {selectedShelter.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-medium"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
