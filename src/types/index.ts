export type HazardType =
  | 'flood'
  | 'cyclone'
  | 'heatwave'
  | 'earthquake'
  | 'wildfire'
  | 'landslide'
  | 'air_quality'
  | 'chemical'
  | 'storm'
  | 'tsunami';

export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type OperationalPhase = 'PRE_DISASTER' | 'ON_TIME' | 'POST_DISASTER';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HazardAlert {
  id: string;
  hazardType: HazardType;
  title: string;
  severity: AlertSeverity;
  phase: OperationalPhase;
  locationName: string;
  coordinates: Coordinates;
  radiusKm: number;
  polygonBoundary?: [number, number][]; // lat, lng points
  source: string; // e.g. "IMD", "NDMA SACHET", "NOAA", "CWC", "USGS"
  sourceUrl?: string;
  issuedAt: string;
  validUntil: string;
  headline: string;
  description: string;
  officialAdvisoryUrl: string;
  recommendedActions: string[];
  metrics: {
    rainfallMm?: number;
    windSpeedKmh?: number;
    waterLevelM?: number;
    magnitude?: number;
    temperatureC?: number;
    aqi?: number;
  };
  isSimulated?: boolean;
  affectedZones: string[];
  uncertaintyScore?: number; // 0 to 100
  dataFreshnessMinutes?: number;
  status: 'ACTIVE' | 'PAST' | 'ACKNOWLEDGED';
  isRead?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  source?: string;
  isVerifiedFact?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  type: 'safety' | 'general';
  relatedAlertId?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  alertId?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface VerifiedEmergencyContact {
  id: string;
  name: string;
  organization: string;
  phone: string;
  jurisdiction: string;
  supportedHazards: string[];
  verificationSource: string;
  lastVerifiedAt: string;
  description?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  capacity: number;
  occupancy: number;
  status: 'OPEN' | 'NEAR_FULL' | 'FULL' | 'STANDBY';
  type: string; // "Gym", "School", "Community Center", "Relief Camp"
  amenities: string[];
  contactPhone: string;
  medicalSupport: boolean;
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  distanceKm?: number;
}

export interface RoadClosure {
  id: string;
  name: string;
  coordinates: Coordinates;
  reason: 'Flooding' | 'Landslide' | 'Debris' | 'Bridge Damage' | 'Downed Power Lines';
  status: 'BLOCKED' | 'PASSABLE_HEAVY_ONLY' | 'REOPENED';
  reportedAt: string;
}

export interface IncidentReport {
  id: string;
  type: 'flood' | 'fire' | 'landslide' | 'medical' | 'trapped' | 'downed_lines' | 'water_shortage' | 'other';
  title: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'UNVERIFIED' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED';
  reportedAt: string;
  reporterName: string;
  reporterPhone?: string;
  photoUrl?: string;
  peopleAffected?: number;
  assistanceRequested: boolean;
  responderNotes?: string;
}

export interface FamilyMemberCheckIn {
  id: string;
  name: string;
  relation: string;
  status: 'SAFE' | 'NEED_HELP' | 'EVACUATING' | 'SHELTERED';
  locationName: string;
  coordinates?: Coordinates;
  timestamp: string;
  batteryPercent: number;
  message: string;
  phone: string;
}

export interface SavedLocation {
  id: string;
  label: string; // "Home", "Work", "College", "Parents"
  name: string;
  coordinates: Coordinates;
  isDefault?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isSmsEnabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'responder' | 'admin';
  language: 'en' | 'hi' | 'mr';
  savedLocations: SavedLocation[];
  hazardPreferences: HazardType[];
  emergencyContacts: EmergencyContact[];
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReaderHints: boolean;
    soundAlerts: boolean;
  };
  locationConsent: boolean;
  bloodGroup?: string;
}

export interface RecoveryResource {
  id: string;
  category: 'water' | 'food' | 'medical' | 'financial' | 'counseling' | 'power' | 'shelter_rehab';
  title: string;
  provider: string;
  locationName: string;
  coordinates: Coordinates;
  scheduleOrHours: string;
  contact: string;
  status: 'ACTIVE' | 'LIMITED' | 'COMPLETED';
  verifiedBy: string;
}

export interface SimulationParams {
  hazardType: HazardType;
  locationName: string;
  coordinates: Coordinates;
  severity: AlertSeverity;
  radiusKm: number;
  rainfallMm?: number;
  windSpeedKmh?: number;
  magnitude?: number;
  temperatureC?: number;
}

export interface SimulationResult {
  simulatedAlert: HazardAlert;
  affectedUsersCount: number;
  matchedSavedLocations: {
    userName: string;
    locationLabel: string;
    locationName: string;
    distanceFromEpicenterKm: number;
    isInHazardPolygon: boolean;
  }[];
  evacuationRoutesCalculated: number;
  sheltersAssigned: number;
  pipelineLatencyMs: number;
  timestamp: string;
}
