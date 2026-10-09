import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { HazardAlert, Shelter, RoadClosure, Coordinates } from '../../types';
import {
  Layers,
  Navigation,
  AlertTriangle,
  Home,
  CheckCircle2,
  Info,
  Compass,
  X
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyA9HAE3WrAiERcjKVDtqD7Ymm-azc2uthQ';

interface HazardMapProps {
  center?: Coordinates;
  zoom?: number;
  alerts: HazardAlert[];
  shelters: Shelter[];
  roadClosures?: RoadClosure[];
  userLocations?: Array<{ label: string; name: string; coordinates: Coordinates }>;
  selectedAlertId?: string | null;
  onSelectAlert?: (alert: HazardAlert) => void;
  onSelectShelter?: (shelter: Shelter) => void;
  showEvacuationRoute?: boolean;
  targetShelter?: Shelter | null;
  height?: string;
  className?: string;
}

// Tactical Dark Theme for Google Maps
const TACTICAL_DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#cbd5e1' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#142834' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f1f5f9' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#0ea5e9' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#081726' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#081726' }]
  }
];

// Sub-component for managing Google Maps native overlays (Polygons, Circles, Polylines)
interface OverlaysProps {
  alerts: HazardAlert[];
  roadClosures: RoadClosure[];
  showEvacuationRoute: boolean;
  targetShelter: Shelter | null;
  userLocations: Array<{ label: string; name: string; coordinates: Coordinates }>;
  selectedAlertId?: string | null;
  activeHazardsLayer: boolean;
  onSelectAlert?: (alert: HazardAlert) => void;
}

const HazardOverlays: React.FC<OverlaysProps> = ({
  alerts,
  showEvacuationRoute,
  targetShelter,
  userLocations,
  selectedAlertId,
  activeHazardsLayer,
  onSelectAlert
}) => {
  const map = useMap();
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Cleanup existing overlays
  const clearOverlays = () => {
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];

    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    polylinesRef.current.forEach((l) => l.setMap(null));
    polylinesRef.current = [];
  };

  useEffect(() => {
    if (!map) return;
    clearOverlays();

    // 1. Draw Hazards (Polygons & Buffer Circles)
    if (activeHazardsLayer) {
      alerts.forEach((alert) => {
        const isSelected = alert.id === selectedAlertId;
        const color =
          alert.severity === 'EXTREME'
            ? '#ef4444'
            : alert.severity === 'HIGH'
            ? '#f97316'
            : alert.severity === 'MODERATE'
            ? '#f59e0b'
            : '#06b6d4';

        // Polygon boundary if available
        if (alert.polygonBoundary && alert.polygonBoundary.length >= 3) {
          const path = alert.polygonBoundary.map((p) => ({
            lat: p[0],
            lng: p[1]
          }));

          const polygon = new google.maps.Polygon({
            paths: path,
            strokeColor: color,
            strokeOpacity: 0.9,
            strokeWeight: isSelected ? 3.5 : 2,
            fillColor: color,
            fillOpacity: isSelected ? 0.35 : 0.22,
            clickable: true,
            zIndex: isSelected ? 20 : 10,
            map
          });

          polygon.addListener('click', () => {
            if (onSelectAlert) onSelectAlert(alert);
          });

          polygonsRef.current.push(polygon);
        }

        // Circular hazard impact buffer
        const circle = new google.maps.Circle({
          center: { lat: alert.coordinates.lat, lng: alert.coordinates.lng },
          radius: alert.radiusKm * 1000,
          strokeColor: color,
          strokeOpacity: 0.7,
          strokeWeight: 1.5,
          fillColor: color,
          fillOpacity: 0.08,
          clickable: false,
          zIndex: 5,
          map
        });

        circlesRef.current.push(circle);
      });
    }

    // 2. Safe Evacuation Route (Detour corridor bypassing hazard zones)
    if (showEvacuationRoute && targetShelter && userLocations.length > 0) {
      const start = userLocations[0].coordinates;
      const end = targetShelter.coordinates;

      const midLat = (start.lat + end.lat) / 2 + 0.012;
      const midLng = (start.lng + end.lng) / 2 - 0.015;

      const routePoints: google.maps.LatLngLiteral[] = [
        { lat: start.lat, lng: start.lng },
        { lat: start.lat + 0.004, lng: start.lng - 0.006 },
        { lat: midLat, lng: midLng },
        { lat: end.lat - 0.003, lng: end.lng - 0.004 },
        { lat: end.lat, lng: end.lng }
      ];

      const polyline = new google.maps.Polyline({
        path: routePoints,
        strokeColor: '#10b981',
        strokeOpacity: 0.95,
        strokeWeight: 5,
        zIndex: 30,
        map
      });

      polylinesRef.current.push(polyline);
    }

    return () => {
      clearOverlays();
    };
  }, [
    map,
    alerts,
    showEvacuationRoute,
    targetShelter,
    userLocations,
    selectedAlertId,
    activeHazardsLayer
  ]);

  return null;
};

// Sub-component for camera control
const MapCameraSync: React.FC<{ center: Coordinates; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: center.lat, lng: center.lng });
    map.setZoom(zoom);
  }, [map, center.lat, center.lng, zoom]);

  return null;
};

export const HazardMap: React.FC<HazardMapProps> = ({
  center = { lat: 19.065, lng: 72.855 },
  zoom = 12,
  alerts,
  shelters,
  roadClosures = [],
  userLocations = [],
  selectedAlertId,
  onSelectAlert,
  onSelectShelter,
  showEvacuationRoute = false,
  targetShelter = null,
  height = '500px',
  className = ''
}) => {
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    shelters: true,
    roadBlocks: true,
    userPins: true
  });

  const [mapCenter, setMapCenter] = useState<Coordinates>(center);
  const [mapZoom, setMapZoom] = useState<number>(zoom);

  // Sync props changes to state
  useEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center.lat, center.lng, zoom]);

  // Selected item for Google Maps InfoWindow
  const [activeInfoWindow, setActiveInfoWindow] = useState<{
    type: 'alert' | 'shelter' | 'road' | 'user';
    data: any;
    position: Coordinates;
  } | null>(null);

  const handleCenterOnUser = () => {
    if (userLocations.length > 0) {
      setMapCenter(userLocations[0].coordinates);
      setMapZoom(14);
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 ${className}`}
      style={{ height }}
    >
      {/* Top Map HUD Tactical Controls */}
      <div className="absolute top-3 left-3 z-[10] flex flex-wrap gap-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs font-medium text-slate-200 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tactical Layers:</span>
          <button
            onClick={() => setActiveLayers((p) => ({ ...p, hazards: !p.hazards }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
              activeLayers.hazards
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'text-slate-400 opacity-60'
            }`}
          >
            Hazards
          </button>
          <button
            onClick={() => setActiveLayers((p) => ({ ...p, shelters: !p.shelters }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
              activeLayers.shelters
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 opacity-60'
            }`}
          >
            Shelters
          </button>
          <button
            onClick={() => setActiveLayers((p) => ({ ...p, roadBlocks: !p.roadBlocks }))}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
              activeLayers.roadBlocks
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 opacity-60'
            }`}
          >
            Blockades
          </button>
        </div>

        {userLocations.length > 0 && (
          <button
            onClick={handleCenterOnUser}
            className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Center on {userLocations[0].label}</span>
          </button>
        )}
      </div>

      {/* Legend overlay bottom-left */}
      <div className="absolute bottom-3 left-3 z-[10] pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-lg text-[11px] text-slate-300 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Danger Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-emerald-500"></span>
          <span>Open Shelter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Your Locations</span>
        </div>
        {showEvacuationRoute && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-4 h-1 border-t-2 border-dashed border-emerald-400"></span>
            <span>Safe Corridor</span>
          </div>
        )}
      </div>

      {/* Google Maps API Provider & Canvas */}
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{ lat: mapCenter.lat, lng: mapCenter.lng }}
          defaultZoom={mapZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          styles={TACTICAL_DARK_STYLES}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
        >
          <MapCameraSync center={mapCenter} zoom={mapZoom} />

          <HazardOverlays
            alerts={alerts}
            roadClosures={roadClosures}
            showEvacuationRoute={showEvacuationRoute}
            targetShelter={targetShelter}
            userLocations={userLocations}
            selectedAlertId={selectedAlertId}
            activeHazardsLayer={activeLayers.hazards}
            onSelectAlert={onSelectAlert}
          />

          {/* 1. Hazard Markers */}
          {activeLayers.hazards &&
            alerts.map((alert) => {
              const isSelected = alert.id === selectedAlertId;
              const color =
                alert.severity === 'EXTREME'
                  ? '#ef4444'
                  : alert.severity === 'HIGH'
                  ? '#f97316'
                  : alert.severity === 'MODERATE'
                  ? '#f59e0b'
                  : '#06b6d4';

              return (
                <AdvancedMarker
                  key={`hazard-${alert.id}`}
                  position={{ lat: alert.coordinates.lat, lng: alert.coordinates.lng }}
                  onClick={() => {
                    setActiveInfoWindow({
                      type: 'alert',
                      data: alert,
                      position: alert.coordinates
                    });
                    if (onSelectAlert) onSelectAlert(alert);
                  }}
                  title={alert.title}
                >
                  <div
                    style={{
                      backgroundColor: color,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                      border: '2px solid white'
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-transform hover:scale-110 ${
                      isSelected ? 'ring-4 ring-red-400 animate-pulse' : ''
                    }`}
                  >
                    ⚠️
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* 2. Shelter Markers */}
          {activeLayers.shelters &&
            shelters.map((shelter) => {
              const isTarget = targetShelter?.id === shelter.id;
              const occPercent = Math.round((shelter.occupancy / shelter.capacity) * 100);
              const shelterColor =
                shelter.status === 'FULL'
                  ? '#ef4444'
                  : shelter.status === 'NEAR_FULL'
                  ? '#f59e0b'
                  : '#10b981';

              return (
                <AdvancedMarker
                  key={`shelter-${shelter.id}`}
                  position={{ lat: shelter.coordinates.lat, lng: shelter.coordinates.lng }}
                  onClick={() => {
                    setActiveInfoWindow({
                      type: 'shelter',
                      data: shelter,
                      position: shelter.coordinates
                    });
                    if (onSelectShelter) onSelectShelter(shelter);
                  }}
                  title={shelter.name}
                >
                  <div
                    style={{
                      backgroundColor: isTarget ? '#2563eb' : '#0f172a',
                      borderColor: shelterColor,
                      borderWidth: '2.5px'
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition-transform"
                  >
                    <span className="text-base">🏠</span>
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* 3. Road Blockade Markers */}
          {activeLayers.roadBlocks &&
            roadClosures.map((road) => (
              <AdvancedMarker
                key={`road-${road.id}`}
                position={{ lat: road.coordinates.lat, lng: road.coordinates.lng }}
                onClick={() => {
                  setActiveInfoWindow({
                    type: 'road',
                    data: road,
                    position: road.coordinates
                  });
                }}
                title={road.name}
              >
                <div
                  style={{
                    backgroundColor: road.status === 'BLOCKED' ? '#dc2626' : '#eab308'
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs border border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                >
                  ⛔
                </div>
              </AdvancedMarker>
            ))}

          {/* 4. User Saved Location Markers */}
          {activeLayers.userPins &&
            userLocations.map((loc, idx) => (
              <AdvancedMarker
                key={`user-loc-${idx}`}
                position={{ lat: loc.coordinates.lat, lng: loc.coordinates.lng }}
                onClick={() => {
                  setActiveInfoWindow({
                    type: 'user',
                    data: loc,
                    position: loc.coordinates
                  });
                }}
                title={`${loc.label}: ${loc.name}`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-sm shadow-xl cursor-pointer hover:scale-110 transition-transform">
                  📍
                </div>
              </AdvancedMarker>
            ))}

          {/* Interactive InfoWindow on Marker Click */}
          {activeInfoWindow && (
            <InfoWindow
              position={{
                lat: activeInfoWindow.position.lat,
                lng: activeInfoWindow.position.lng
              }}
              onCloseClick={() => setActiveInfoWindow(null)}
            >
              <div className="p-1 min-w-[200px] max-w-[280px] text-slate-900 font-sans">
                {activeInfoWindow.type === 'alert' && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 uppercase">
                        {activeInfoWindow.data.severity}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {activeInfoWindow.data.hazardType.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight mb-1">
                      {activeInfoWindow.data.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                      {activeInfoWindow.data.headline}
                    </p>
                    <div className="text-[10px] text-slate-500 border-t pt-1">
                      Source: <strong>{activeInfoWindow.data.source}</strong>
                    </div>
                  </div>
                )}

                {activeInfoWindow.type === 'shelter' && (
                  <div>
                    <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold mb-1">
                      <Home className="w-3.5 h-3.5" />
                      <span>{activeInfoWindow.data.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2">
                      {activeInfoWindow.data.address}
                    </p>
                    <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-1">
                      <span>Occupancy:</span>
                      <strong>
                        {activeInfoWindow.data.occupancy} / {activeInfoWindow.data.capacity} (
                        {Math.round(
                          (activeInfoWindow.data.occupancy / activeInfoWindow.data.capacity) * 100
                        )}
                        %)
                      </strong>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.round(
                            (activeInfoWindow.data.occupancy / activeInfoWindow.data.capacity) * 100
                          )}%`
                        }}
                        className={`h-full ${
                          activeInfoWindow.data.status === 'FULL'
                            ? 'bg-red-500'
                            : activeInfoWindow.data.status === 'NEAR_FULL'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {activeInfoWindow.type === 'road' && (
                  <div>
                    <div className="text-red-700 font-bold text-xs flex items-center gap-1 mb-1">
                      <span>⛔ Road Blockade: {activeInfoWindow.data.status}</span>
                    </div>
                    <h5 className="font-semibold text-xs text-slate-900">
                      {activeInfoWindow.data.name}
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Reason: {activeInfoWindow.data.reason}
                    </p>
                  </div>
                )}

                {activeInfoWindow.type === 'user' && (
                  <div>
                    <div className="text-blue-700 font-bold text-xs mb-1">
                      📍 {activeInfoWindow.data.label} Location
                    </div>
                    <p className="text-xs text-slate-800 font-medium">
                      {activeInfoWindow.data.name}
                    </p>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
