import React, { useState } from 'react';
import { useApp, calculateDistanceKm } from '../../services/store';
import { HazardType, AlertSeverity, HazardAlert } from '../../types';
import {
  Bell,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  MapPin,
  Clock,
  ShieldAlert,
  Flame,
  Droplets,
  Wind,
  Activity,
  Check,
  Radio
} from 'lucide-react';

export const AlertsListPage: React.FC = () => {
  const {
    alerts,
    user,
    navigate,
    acknowledgeAlert,
    triggerIngestion,
    lastIngestionTime,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ALL' | 'PAST' | 'ACKNOWLEDGED'>('ACTIVE');
  const [selectedHazard, setSelectedHazard] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const primaryLoc = user.savedLocations[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerIngestion();
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const filteredAlerts = alerts.filter((alert) => {
    // Tab filter
    if (activeTab === 'ACTIVE' && alert.status !== 'ACTIVE') return false;
    if (activeTab === 'PAST' && alert.status !== 'PAST') return false;
    if (activeTab === 'ACKNOWLEDGED' && alert.status !== 'ACKNOWLEDGED') return false;

    // Hazard filter
    if (selectedHazard !== 'ALL' && alert.hazardType !== selectedHazard) return false;

    // Severity filter
    if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = alert.title.toLowerCase().includes(q);
      const matchLoc = alert.locationName.toLowerCase().includes(q);
      const matchDesc = alert.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Disaster Alert Registry & History
              </h1>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Verified Civic Feeds
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official bulletins from IMD, NDMA SACHET, Central Water Commission & emergency agencies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Data Updated: <strong className="text-slate-300">{lastIngestionTime}</strong>
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ACTIVE', label: `Active Warnings (${alerts.filter((a) => a.status === 'ACTIVE').length})` },
            { id: 'ALL', label: `All Alerts (${alerts.length})` },
            { id: 'ACKNOWLEDGED', label: `Acknowledged (${alerts.filter((a) => a.status === 'ACKNOWLEDGED').length})` },
            { id: 'PAST', label: `Past / Lapsed (${alerts.filter((a) => a.status === 'PAST').length})` },
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'border-cyan-400 text-cyan-400 bg-slate-900/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by city, district, hazard type, or advisory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Hazard Category Select */}
          <div className="flex gap-2">
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Hazard Categories</option>
              <option value="flood">Flooding & Rain</option>
              <option value="cyclone">Cyclones & Storms</option>
              <option value="heatwave">Heatwaves</option>
              <option value="earthquake">Earthquakes</option>
              <option value="air_quality">Air Quality (AQI)</option>
              <option value="wildfire">Fires & Wildfires</option>
              <option value="landslide">Landslides</option>
            </select>

            {/* Severity Select */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Severities</option>
              <option value="EXTREME">EXTREME (Critical)</option>
              <option value="HIGH">HIGH (Warning)</option>
              <option value="MODERATE">MODERATE (Watch)</option>
              <option value="LOW">LOW (Advisory)</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white text-base">No Matching Alerts Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No active or historical records match your filter criteria. Note: Absence of an alert does not guarantee complete absence of local hazard risks.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const dist = primaryLoc
                ? calculateDistanceKm(primaryLoc.coordinates, alert.coordinates)
                : null;

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition shadow-xl ${
                    alert.severity === 'EXTREME'
                      ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/70'
                      : alert.severity === 'HIGH'
                      ? 'bg-orange-950/20 border-orange-500/40 hover:border-orange-500/70'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                            alert.severity === 'EXTREME'
                              ? 'bg-red-500 text-white'
                              : alert.severity === 'HIGH'
                              ? 'bg-orange-500 text-white'
                              : alert.severity === 'MODERATE'
                              ? 'bg-amber-500 text-black'
                              : 'bg-teal-500 text-white'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {alert.hazardType.replace('_', ' ')}
                        </span>

                        {alert.status === 'ACKNOWLEDGED' && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            ✓ ACKNOWLEDGED
                          </span>
                        )}

                        {alert.isSimulated && (
                          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                            SIMULATION
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => navigate(`/alerts/${alert.id}`)}
                        className="text-base sm:text-lg font-bold text-white hover:text-cyan-400 cursor-pointer transition"
                      >
                        {alert.title}
                      </h3>

                      <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                        {alert.headline}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{alert.locationName}</span>
                        </span>
                        <span>•</span>
                        <span>Source: <strong className="text-slate-300">{alert.source}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Valid until {new Date(alert.validUntil).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </span>
                        {dist !== null && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400 font-semibold">{dist} km from {primaryLoc.label}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                          title="Mark this alert as acknowledged"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Acknowledge</span>
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/alerts/${alert.id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-600/20 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
