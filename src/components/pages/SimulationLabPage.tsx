import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { SimulationParams, SimulationResult, HazardType, AlertSeverity } from '../../types';
import confetti from 'canvas-confetti';
import {
  Flame,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  Activity,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Droplets,
  Wind
} from 'lucide-react';

export const SimulationLabPage: React.FC = () => {
  const {
    runSimulation,
    resetSimulationData,
    simulationHistory,
    setCurrentView,
    setSelectedAlertId,
    user,
  } = useApp();

  const [hazardType, setHazardType] = useState<HazardType>('flood');
  const [severity, setSeverity] = useState<AlertSeverity>('EXTREME');
  const [locationName, setLocationName] = useState('Mithi River & Kurla Basin, Mumbai');
  const [radiusKm, setRadiusKm] = useState(12);
  const [rainfallMm, setRainfallMm] = useState(175);
  const [windSpeedKmh, setWindSpeedKmh] = useState(65);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<SimulationResult | null>(
    simulationHistory[0] || null
  );

  const presets = [
    {
      id: 'mumbai-flood',
      title: 'Monsoon Flash Flood (180mm/h)',
      type: 'flood' as HazardType,
      severity: 'EXTREME' as AlertSeverity,
      location: 'Mithi River Catchment, Mumbai',
      lat: 19.068,
      lng: 72.862,
      radius: 14,
      rain: 180,
      wind: 55,
    },
    {
      id: 'cyclone-coastal',
      title: 'Category 3 Coastal Cyclone (130 km/h)',
      type: 'cyclone' as HazardType,
      severity: 'EXTREME' as AlertSeverity,
      location: 'Alibaug & Raigad Coastal Belt',
      lat: 18.65,
      lng: 72.88,
      radius: 35,
      rain: 120,
      wind: 130,
    },
    {
      id: 'heatwave-urban',
      title: 'Severe Heatwave 47.5°C Urban Core',
      type: 'heatwave' as HazardType,
      severity: 'HIGH' as AlertSeverity,
      location: 'Nagpur & Vidarbha Urban Core',
      lat: 21.145,
      lng: 79.088,
      radius: 25,
      rain: 0,
      wind: 32,
    },
    {
      id: 'nc-flash-flood',
      title: 'River Basin Flooding (Southern Pines NC)',
      type: 'flood' as HazardType,
      severity: 'MODERATE' as AlertSeverity,
      location: '150 Perry Dr, Southern Pines, NC',
      lat: 35.174,
      lng: -79.392,
      radius: 12,
      rain: 85,
      wind: 35,
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setHazardType(p.type);
    setSeverity(p.severity);
    setLocationName(p.location);
    setRadiusKm(p.radius);
    setRainfallMm(p.rain);
    setWindSpeedKmh(p.wind);
  };

  const handleTriggerSimulation = () => {
    setIsRunning(true);

    const preset = presets.find((p) => p.location === locationName) || presets[0];

    const params: SimulationParams = {
      hazardType,
      locationName,
      coordinates: { lat: preset.lat, lng: preset.lng },
      severity,
      radiusKm,
      rainfallMm: hazardType === 'flood' ? rainfallMm : undefined,
      windSpeedKmh: hazardType === 'cyclone' ? windSpeedKmh : undefined,
    };

    setTimeout(() => {
      const result = runSimulation(params);
      setLastResult(result);
      setIsRunning(false);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }, 600);
  };

  const handleReset = () => {
    resetSimulationData();
    setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Disaster Simulation Lab 🧪
              </h1>
              <span className="bg-purple-500/10 text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                Hackathon Judge Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate localized disasters, evaluate sub-second geofencing user matching, and test alert generation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Preset Scenarios Row */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Select a Realistic Disaster Scenario Preset:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  locationName === p.location
                    ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500 text-white'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-800 text-cyan-400">
                    {p.type}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400">{p.severity}</span>
                </div>
                <h4 className="font-bold text-xs text-white">{p.title}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">📍 {p.location}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Sandbox Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Hazard Parameters</h3>
              <span className="text-xs text-purple-400 font-semibold">Configurable Inputs</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Hazard Type
                </label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="flood">Flash Flood (Precipitation Inundation)</option>
                  <option value="cyclone">Tropical Cyclone (Gale Winds & Surge)</option>
                  <option value="heatwave">Extreme Heatwave (Ambient Temperature)</option>
                  <option value="earthquake">Earthquake Shockwave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Severity Threshold
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="EXTREME">EXTREME (Immediate Evacuation Order)</option>
                  <option value="HIGH">HIGH (Urgent Warning)</option>
                  <option value="MODERATE">MODERATE (Watch & Preparation)</option>
                  <option value="LOW">LOW (Advisory)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                  <span>Impact Radius:</span>
                  <span className="text-cyan-400">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={45}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {hazardType === 'flood' && (
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                    <span>Cloudburst Rainfall Rate:</span>
                    <span className="text-blue-400">{rainfallMm} mm/h</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={250}
                    value={rainfallMm}
                    onChange={(e) => setRainfallMm(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              )}

              {hazardType === 'cyclone' && (
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                    <span>Peak Wind Velocity:</span>
                    <span className="text-amber-400">{windSpeedKmh} km/h</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={180}
                    value={windSpeedKmh}
                    onChange={(e) => setWindSpeedKmh(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}

              <button
                onClick={handleTriggerSimulation}
                disabled={isRunning}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Activity className="w-5 h-5 animate-spin" />
                    <span>Executing Pipeline Across User Registry...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Trigger Simulation Pipeline Now 🚀</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Execution Telemetry & Results */}
          <div className="lg:col-span-6 space-y-5">
            {lastResult ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">
                      Pipeline Execution Results
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    Latency: {lastResult.pipelineLatencyMs} ms
                  </span>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Citizens In Danger Zone
                    </span>
                    <span className="text-xl font-extrabold text-red-400 block mt-0.5">
                      {lastResult.affectedUsersCount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      User Locations Matched
                    </span>
                    <span className="text-xl font-extrabold text-amber-400 block mt-0.5">
                      {lastResult.matchedSavedLocations.length}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Shelters Assigned
                    </span>
                    <span className="text-xl font-extrabold text-emerald-400 block mt-0.5">
                      {lastResult.sheltersAssigned}
                    </span>
                  </div>
                </div>

                {/* Matched User Locations Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Geofenced User Matches (Inside Polygon or Buffer):
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {lastResult.matchedSavedLocations.map((match, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-white">{match.userName}</span>
                          <span className="text-slate-400 ml-1.5">
                            ({match.locationLabel}: {match.locationName})
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          {match.isInHazardPolygon ? 'IN POLYGON' : `${match.distanceFromEpicenterKm}km dist`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inspect Buttons */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedAlertId(lastResult.simulatedAlert.id);
                      setCurrentView('alert-details');
                    }}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Inspect Generated Warning Card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
                  >
                    View on Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Ready for Simulation Run</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Select a scenario preset on the left or customize parameters, then click "Trigger Simulation Pipeline Now".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
