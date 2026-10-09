import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { HazardMap } from '../map/HazardMap';
import { HazardAlert } from '../../types';
import {
  MapPin,
  Layers,
  Search,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Navigation,
  Info,
  ExternalLink
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const {
    alerts,
    shelters,
    roadClosures,
    user,
    navigate,
    selectedAlertId,
    setSelectedAlertId,
  } = useApp();

  const [activeAlert, setActiveAlert] = useState<HazardAlert>(
    alerts.find((a) => a.id === selectedAlertId) || alerts[0]
  );
  const [mapSearch, setMapSearch] = useState('');

  const primaryLoc = user.savedLocations[0];

  const handleAlertMarkerClick = (alert: HazardAlert) => {
    setActiveAlert(alert);
    setSelectedAlertId(alert.id);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Map HUD Controls */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-sm font-bold text-white">Interactive Hazard & Evacuation Map</h1>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full hidden sm:inline">
            Synchronized with {alerts.filter((a) => a.status === 'ACTIVE').length} Active Warning Polygons
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Focus Location Selector */}
          <span className="text-xs text-slate-400 hidden md:inline">Focus Location:</span>
          <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-400">
            📍 {primaryLoc?.label}: {primaryLoc?.name}
          </span>
        </div>
      </div>

      {/* Main Map Body: Left Floating Drawer + Full Map */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Full Interactive Leaflet Map */}
        <div className="flex-1 h-full w-full">
          <HazardMap
            center={activeAlert ? activeAlert.coordinates : primaryLoc?.coordinates}
            zoom={11}
            alerts={alerts.filter((a) => a.status === 'ACTIVE')}
            shelters={shelters}
            roadClosures={roadClosures}
            userLocations={user.savedLocations}
            selectedAlertId={activeAlert?.id}
            onSelectAlert={handleAlertMarkerClick}
            height="100%"
          />
        </div>

        {/* Floating Side Drawer for Active Alert Summary */}
        {activeAlert && (
          <div className="absolute top-4 right-4 z-[1000] w-80 sm:w-96 max-h-[calc(100%-2rem)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    activeAlert.severity === 'EXTREME'
                      ? 'bg-red-500 text-white'
                      : activeAlert.severity === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : 'bg-amber-500 text-black'
                  }`}
                >
                  {activeAlert.severity} {activeAlert.hazardType.toUpperCase()}
                </span>
                <h3 className="font-bold text-white text-base mt-1.5">{activeAlert.title}</h3>
                <p className="text-xs text-slate-400">📍 {activeAlert.locationName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              {activeAlert.headline}
            </p>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Primary Recommended Actions:
              </span>
              {activeAlert.recommendedActions.slice(0, 2).map((act, i) => (
                <div key={i} className="flex items-start gap-1.5 text-slate-300">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Source: {activeAlert.source}</span>
              <button
                onClick={() => navigate(`/alerts/${activeAlert.id}`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition"
              >
                <span>Full Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
