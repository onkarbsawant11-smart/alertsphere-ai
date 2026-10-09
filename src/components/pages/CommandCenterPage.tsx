import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { HazardMap } from '../map/HazardMap';
import {
  Radio,
  ShieldAlert,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building,
  Truck,
  Flame,
  Activity,
  Layers,
  MapPin,
  Clock,
  PhoneCall,
  Bell,
  Check,
  Edit3
} from 'lucide-react';

export const CommandCenterPage: React.FC = () => {
  const {
    alerts,
    shelters,
    incidentReports,
    updateIncidentStatus,
    updateShelterOccupancy,
    addAlert,
    roadClosures,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'command' | 'shelters' | 'personnel' | 'equipment' | 'broadcast'
  >('command');

  const [currentTime, setCurrentTime] = useState<string>('13:58:03');
  const [editingShelterId, setEditingShelterId] = useState<string | null>(null);
  const [editOccupancyVal, setEditOccupancyVal] = useState<number>(0);

  // Broadcast Alert Form
  const [bTitle, setBTitle] = useState('Severe Flood Water Crest Warning');
  const [bType, setBType] = useState<any>('flood');
  const [bLocation, setBLocation] = useState('Kurla & Mithi Basin, Mumbai');
  const [bSeverity, setBSeverity] = useState<any>('HIGH');
  const [bHeadline, setBHeadline] = useState('Water level has crossed 2.9m mark. Mandatory evacuation for ground floor tenements.');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);
  const availableSpace = Math.max(0, totalCapacity - totalOccupancy);

  const handleSaveShelter = (id: string) => {
    updateShelterOccupancy(id, editOccupancyVal);
    setEditingShelterId(null);
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      id: `alert-cmd-${Date.now()}`,
      hazardType: bType,
      title: bTitle,
      severity: bSeverity,
      phase: 'ON_TIME',
      locationName: bLocation,
      coordinates: { lat: 19.065, lng: 72.855 },
      radiusKm: 15,
      source: `NDRF & State Incident Command (${user.name})`,
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      headline: bHeadline,
      description: 'Official emergency directive issued from AlertSphere Tactical Command Operations Center.',
      officialAdvisoryUrl: 'https://ndma.gov.in/direct-orders/ops-2026',
      recommendedActions: [
        'Move immediately to designated municipal relief shelters.',
        'Follow tactical civil defense instructions.',
      ],
      metrics: {
        waterLevelM: 3.1,
        rainfallMm: 165,
      },
      affectedZones: ['Kurla West', 'Bandra East', 'Sion Circle'],
      status: 'ACTIVE',
    });

    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Top Tactical Status Bar (Directly from Screenshot 3) */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="text-slate-300 font-bold text-sm tracking-wider">{currentTime}</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ONLINE
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            DATA SYNC ACTIVE
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-red-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            DEFENSE FEED AUTHORIZED
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-400 text-[11px]">
            ACCESS CODE: <span className="text-cyan-400 font-bold">9AQBPN-NDRF</span>
          </div>
          <span className="bg-blue-600/20 text-cyan-300 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold">
            COMMANDER: {user.name}
          </span>
        </div>
      </div>

      {/* Primary Emergency Banner (Screenshot 3 banner) */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border-b border-red-500/30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-red-500/20 text-red-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">
                ⚠️ Flooding & Severe High Tide (OPERATIONS ACTIVE)
              </span>
              <span className="bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded uppercase">
                RED ALERT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              📍 Mithi River Basin & 150 Perry Dr Corridor • Level: 2.8m Crest
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Responders Deployed:</span>
          <span className="text-emerald-400 font-bold">42 Personnel (3 Boat Units)</span>
        </div>
      </div>

      {/* Navigation Tabs (Screenshot 3: Command Center, Personnel, Equipment Dashboard, Shelter Management) */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-2 scrollbar-none">
          {[
            { id: 'command', label: 'Command Center & Triage', icon: Activity },
            { id: 'shelters', label: 'Shelter Management', icon: Building },
            { id: 'personnel', label: 'Personnel & Field Teams', icon: Users },
            { id: 'equipment', label: 'Equipment & Boats', icon: Truck },
            { id: 'broadcast', label: 'Broadcast Official Alert', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tab 1: Command Center & Incident Triage */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            {/* Top Tactical Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Pending Incidents
                </span>
                <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
                  {incidentReports.filter((r) => r.status === 'UNVERIFIED').length}
                </span>
                <span className="text-[10px] text-slate-500">Awaiting Commander Review</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Dispatched Units
                </span>
                <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">
                  {incidentReports.filter((r) => r.status === 'DISPATCHED').length}
                </span>
                <span className="text-[10px] text-slate-500">Active Rescue Sorties</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Disaster Alerts Issued
                </span>
                <span className="text-2xl font-extrabold text-red-400 mt-1 block">
                  {alerts.length}
                </span>
                <span className="text-[10px] text-slate-500">Geofenced Channels</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Available Shelter Space
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                  {availableSpace}
                </span>
                <span className="text-[10px] text-slate-500">Across {shelters.length} Facilities</span>
              </div>
            </div>

            {/* Incidents Triage Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Incident Triage & Verification Queue
                  </h2>
                  <p className="text-xs text-slate-400">
                    Review unverified submissions and authorize emergency dispatch.
                  </p>
                </div>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-semibold">
                  Queue: {incidentReports.length} Reports
                </span>
              </div>

              <div className="space-y-3">
                {incidentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                            report.urgency === 'CRITICAL'
                              ? 'bg-red-500 text-white'
                              : report.urgency === 'HIGH'
                              ? 'bg-orange-500 text-white'
                              : 'bg-amber-500 text-black'
                          }`}
                        >
                          {report.urgency}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            report.status === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : report.status === 'DISPATCHED'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : report.status === 'RESOLVED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {report.status}
                        </span>

                        <span className="text-xs font-bold text-white">{report.title}</span>
                      </div>

                      <p className="text-xs text-slate-300 max-w-2xl">{report.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>📍 {report.locationName}</span>
                        <span>•</span>
                        <span>Reporter: {report.reporterName}</span>
                        <span>•</span>
                        <span>People Stranded: {report.peopleAffected || 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {report.status === 'UNVERIFIED' && (
                        <button
                          onClick={() =>
                            updateIncidentStatus(
                              report.id,
                              'DISPATCHED',
                              'NDRF Quick Response Boat 02 deployed to location.'
                            )
                          }
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify & Dispatch Unit</span>
                        </button>
                      )}

                      {report.status === 'DISPATCHED' && (
                        <button
                          onClick={() =>
                            updateIncidentStatus(
                              report.id,
                              'RESOLVED',
                              'All stranded residents evacuated to safe shelter.'
                            )
                          }
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                        >
                          <span>Mark Resolved</span>
                        </button>
                      )}

                      {report.status === 'RESOLVED' && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Operation Complete</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shelter Management (Exact Replica of Screenshot 3) */}
        {activeTab === 'shelters' && (
          <div className="space-y-6">
            {/* Metric Cards (Screenshot 3: TOTAL SHELTERS 2, TOTAL CAPACITY 250, CURRENT OCCUPANCY 15, AVAILABLE SPACE 235) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Total Shelters
                </span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  {shelters.length}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Total Capacity
                </span>
                <span className="text-3xl font-extrabold text-cyan-400 mt-1 block">
                  {totalCapacity}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Current Occupancy
                </span>
                <span className="text-3xl font-extrabold text-amber-400 mt-1 block">
                  {totalOccupancy}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Available Space
                </span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
                  {availableSpace}
                </span>
              </div>
            </div>

            {/* Split layout: Shelters List vs Tactical Map View (Screenshot 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Shelters Cards (Screenshot 3: Pinecrest Gym, Southern Middle Gym) */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shelters List
                </h3>

                <div className="space-y-3">
                  {shelters.map((s) => (
                    <div
                      key={s.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-base">{s.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{s.address}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingShelterId(s.id);
                              setEditOccupancyVal(s.occupancy);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                        </div>
                      </div>

                      {/* Details row (Screenshot 3 table style: TYPE, CAPACITY, OCCUPANCY) */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-800/40 p-3 rounded-xl text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                            Type
                          </span>
                          <span className="font-bold text-slate-200 truncate block">
                            {s.type.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                            Capacity
                          </span>
                          <span className="font-bold text-slate-200">{s.capacity}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                            Occupancy
                          </span>
                          <span className="font-bold text-amber-400">{s.occupancy}</span>
                        </div>
                      </div>

                      {/* Edit modal or inline form */}
                      {editingShelterId === s.id && (
                        <div className="p-3 bg-slate-800 border border-cyan-500/40 rounded-xl space-y-2">
                          <label className="text-xs font-semibold text-cyan-300 block">
                            Set New Occupancy Count (Max {s.capacity}):
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={s.capacity}
                              value={editOccupancyVal}
                              onChange={(e) => setEditOccupancyVal(Number(e.target.value))}
                              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                            <button
                              onClick={() => handleSaveShelter(s.id)}
                              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingShelterId(null)}
                              className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Map View (Screenshot 3 circular buffer map) */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tactical Map View (Circular Radius & Shelters)
                </h3>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl">
                  <HazardMap
                    center={shelters[0]?.coordinates}
                    zoom={12}
                    alerts={alerts}
                    shelters={shelters}
                    roadClosures={roadClosures}
                    height="450px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Personnel & Field Teams */}
        {activeTab === 'personnel' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">
              Emergency Response Personnel Roster
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Unit Alpha (NDRF 5th Battalion)', lead: 'Inspector D. Patel', status: 'Deployed', area: 'Kurla West Boat Sector', count: 14 },
                { name: 'Unit Bravo (Municipal Water Rescue)', lead: 'Officer K. Salve', status: 'On Standby', area: 'BKC Central High Ground', count: 12 },
                { name: 'Medical Strike Team 1', lead: 'Dr. S. Nair', status: 'Active Clinic', area: 'Pinecrest Emergency Gym', count: 8 },
                { name: 'Heavy Equipment Crew 4', lead: 'Foreman R. Yadav', status: 'Clearing Debris', area: 'Milan Subway Underpass', count: 8 },
              ].map((p, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Lead: {p.lead}</p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 flex justify-between">
                    <span>📍 {p.area}</span>
                    <span className="font-bold text-cyan-400">{p.count} Personnel</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Equipment Dashboard */}
        {activeTab === 'equipment' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">
              Field Equipment & Specialized Assets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Motorized Inflatable Boats</span>
                <span className="text-2xl font-extrabold text-cyan-400 block mt-1">6 Units</span>
                <span className="text-xs text-slate-400">4 In Water / 2 In Reserve</span>
              </div>
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">High-Capacity De-watering Pumps</span>
                <span className="text-2xl font-extrabold text-blue-400 block mt-1">18 Units</span>
                <span className="text-xs text-slate-400">Operational in lowlands</span>
              </div>
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Diesel Generators (125 kVA)</span>
                <span className="text-2xl font-extrabold text-amber-400 block mt-1">8 Units</span>
                <span className="text-xs text-slate-400">Powering Shelters</span>
              </div>
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Satellite Emergency Radios</span>
                <span className="text-2xl font-extrabold text-emerald-400 block mt-1">24 Handsets</span>
                <span className="text-xs text-slate-400">100% Battery Charged</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Broadcast Official Alert */}
        {activeTab === 'broadcast' && (
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Broadcast Official Disaster Advisory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Publishes a verified emergency alert across all citizen devices and geofenced zones.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Alert broadcast successfully pushed to citizen dashboards!</span>
              </div>
            )}

            <form onSubmit={handleBroadcastAlert} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hazard Type</label>
                  <select
                    value={bType}
                    onChange={(e) => setBType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="flood">Flash Flood</option>
                    <option value="cyclone">Cyclone / Storm</option>
                    <option value="heatwave">Heatwave</option>
                    <option value="earthquake">Earthquake</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Severity Level</label>
                  <select
                    value={bSeverity}
                    onChange={(e) => setBSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="EXTREME">EXTREME (Mandatory Evacuation)</option>
                    <option value="HIGH">HIGH (Urgent Warning)</option>
                    <option value="MODERATE">MODERATE (Watch)</option>
                    <option value="LOW">LOW (Advisory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Alert Headline Title</label>
                <input
                  type="text"
                  required
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Location Zone</label>
                <input
                  type="text"
                  required
                  value={bLocation}
                  onChange={(e) => setBLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Civil Directives</label>
                <textarea
                  rows={3}
                  required
                  value={bHeadline}
                  onChange={(e) => setBHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Bell className="w-4 h-4" />
                <span>Issue & Broadcast Warning</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
