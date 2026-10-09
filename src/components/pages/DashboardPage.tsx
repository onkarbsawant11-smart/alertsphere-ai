import React, { useState } from 'react';
import { useApp, calculateDistanceKm } from '../../services/store';
import { RiskGauge } from '../common/RiskGauge';
import { HazardMap } from '../map/HazardMap';
import {
  ShieldAlert,
  MapPin,
  Compass,
  Bot,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Bell,
  Heart,
  Droplets,
  Wind,
  CheckSquare,
  Square,
  Share2,
  PhoneCall,
  ExternalLink,
  Flame,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    alerts,
    shelters,
    roadClosures,
    setSelectedAlertId,
    setCurrentView,
    submitCheckIn,
    checkUserLocationRisk,
    t,
  } = useApp();

  // Active selected location for dashboard view
  const [activeLocationId, setActiveLocationId] = useState<string>(
    user.savedLocations[0]?.id || 'loc-1'
  );
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);

  // Preparedness checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: '3-day potable water (3L/person/day)', checked: true },
    { id: 'c2', label: 'Charged power bank & battery torch', checked: true },
    { id: 'c3', label: 'Essential prescription medicines & First Aid kit', checked: false },
    { id: 'c4', label: 'Original ID & insurance papers in sealed ziploc', checked: true },
    { id: 'c5', label: 'Emergency whistles & sturdy boots for evacuation', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const currentLocation =
    user.savedLocations.find((l) => l.id === activeLocationId) || user.savedLocations[0];

  const riskStatus = checkUserLocationRisk(currentLocation.coordinates);

  // Metrics from closest active alert
  const primaryAlert = riskStatus.matchingAlerts[0] || alerts[0];
  const rainfall = primaryAlert?.metrics?.rainfallMm ?? 0;
  const waterLevel = primaryAlert?.metrics?.waterLevelM ?? 1.2;
  const windSpeed = primaryAlert?.metrics?.windSpeedKmh ?? 18;

  const handleQuickSafe = () => {
    submitCheckIn('SAFE', 'Checked in safe from dashboard. All clear.', currentLocation.name);
    setCheckInNotice("Your 'I'm Safe' status has been broadcasted to family contacts!");
    setTimeout(() => setCheckInNotice(null), 4000);
  };

  const handleQuickHelp = () => {
    submitCheckIn('NEED_HELP', 'Urgent help requested from dashboard. In waterlogged zone.', currentLocation.name);
    setCheckInNotice("Urgent SOS broadcasted! Local emergency responders notified.");
    setTimeout(() => setCheckInNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Welcome & Location Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Namaste, {user.name}!
              </h1>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-cyan-500/20">
                Citizen Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time monitoring active for your saved residences and campuses.
            </p>
          </div>

          {/* Location Selector (Screenshot 2: Halo, Setiabudi / Tangerang dropdown) */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Active Focus:</span>
            <div className="relative">
              <select
                value={activeLocationId}
                onChange={(e) => setActiveLocationId(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-cyan-500 pr-8 cursor-pointer"
              >
                {user.savedLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.label}: {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Check-in feedback banner */}
        {checkInNotice && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{checkInNotice}</span>
            </div>
            <button
              onClick={() => setCurrentView('family-safety')}
              className="underline text-emerald-200 hover:text-white"
            >
              View Family Board
            </button>
          </div>
        )}

        {/* Hazard Risk Alert Banner if any user location is inside warning */}
        {riskStatus.isAtRisk ? (
          <div className="bg-gradient-to-r from-red-950/80 via-orange-950/60 to-slate-900 border-l-4 border-red-500 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                    {riskStatus.highestSeverity} HAZARD
                  </span>
                  <span className="text-xs font-semibold text-red-300">
                    Geofenced Location Alert
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {currentLocation.label} ({currentLocation.name}) is inside an Active Hazard Envelope!
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                  {riskStatus.matchingAlerts[0]?.headline ||
                    'Dangerous conditions confirmed by civil authorities. Review recommended actions.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  setSelectedAlertId(riskStatus.matchingAlerts[0]?.id || alerts[0].id);
                  setCurrentView('alert-details');
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-1.5"
              >
                <span>Inspect Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentView('shelters')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Find Evac Shelter</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-emerald-300">{currentLocation.label} ({currentLocation.name})</span> is currently outside active danger polygons. Background monitoring continues.
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Low Exposure
            </span>
          </div>
        )}

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={handleQuickSafe}
            className="bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 p-3.5 rounded-2xl text-left transition flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">I'm Safe</div>
              <div className="text-[10px] text-slate-400">Broadcast Check-in</div>
            </div>
          </button>

          <button
            onClick={handleQuickHelp}
            className="bg-slate-900/90 hover:bg-slate-800 border border-red-500/30 p-3.5 rounded-2xl text-left transition flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">I Need Help (SOS)</div>
              <div className="text-[10px] text-slate-400">Notify Responders</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('copilot')}
            className="bg-slate-900/90 hover:bg-slate-800 border border-teal-500/30 p-3.5 rounded-2xl text-left transition flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Emergency Copilot</div>
              <div className="text-[10px] text-slate-400">Ask AI in 3 Languages</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('incident-report')}
            className="bg-slate-900/90 hover:bg-slate-800 border border-blue-500/30 p-3.5 rounded-2xl text-left transition flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Report Incident</div>
              <div className="text-[10px] text-slate-400">Submit Field Intel</div>
            </div>
          </button>
        </div>

        {/* Dashboard Center Grid: Risk Gauge + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Risk Gauge & Preparedness */}
          <div className="lg:col-span-4 space-y-6">
            {/* Speedometer Risk Gauge (Screenshot 2 design) */}
            <RiskGauge
              severity={riskStatus.highestSeverity}
              label={`Risk Status • ${currentLocation.label}`}
              rainfallMm={rainfall}
              waterLevelM={waterLevel}
              flowSpeedMs={0.6}
              temperatureC={primaryAlert?.hazardType === 'heatwave' ? primaryAlert?.metrics?.temperatureC : undefined}
            />

            {/* 72-Hour Preparedness Checklist */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    72-Hour Go-Bag Checklist
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-emerald-400">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-start gap-2.5 text-left p-1.5 rounded-lg hover:bg-slate-800/60 transition group cursor-pointer"
                  >
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs ${
                        item.checked ? 'text-slate-400 line-through' : 'text-slate-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hazard Map & Warnings List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Map */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live Tactical Hazard & Shelter Map
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentView('shelters')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Full Screen Map & Evac Routes</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <HazardMap
                center={currentLocation.coordinates}
                zoom={12}
                alerts={alerts}
                shelters={shelters}
                roadClosures={roadClosures}
                userLocations={user.savedLocations}
                height="380px"
                onSelectAlert={(a) => {
                  setSelectedAlertId(a.id);
                  setCurrentView('alert-details');
                }}
                onSelectShelter={() => setCurrentView('shelters')}
              />
            </div>

            {/* Active Warnings & Official Advisories List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Official Active Advisories ({alerts.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Deterministic Verified Feeds
                </span>
              </div>

              <div className="space-y-3">
                {alerts.map((alert) => {
                  const dist = calculateDistanceKm(currentLocation.coordinates, alert.coordinates);
                  const isMatching = riskStatus.matchingAlerts.some((a) => a.id === alert.id);

                  return (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setSelectedAlertId(alert.id);
                        setCurrentView('alert-details');
                      }}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isMatching
                          ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/70'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                              alert.severity === 'EXTREME'
                                ? 'bg-red-500 text-white'
                                : alert.severity === 'HIGH'
                                ? 'bg-orange-500 text-white'
                                : 'bg-amber-500 text-black'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-xs font-bold text-white">{alert.title}</span>
                          {alert.isSimulated && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                              SIMULATED
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 max-w-xl">{alert.headline}</p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span>📍 {alert.locationName}</span>
                          <span>•</span>
                          <span>Source: {alert.source}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-semibold">{dist} km from you</span>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 shrink-0 flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
