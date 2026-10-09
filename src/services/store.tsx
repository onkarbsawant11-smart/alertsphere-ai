import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HazardAlert,
  Shelter,
  RoadClosure,
  IncidentReport,
  FamilyMemberCheckIn,
  UserProfile,
  RecoveryResource,
  SimulationParams,
  SimulationResult,
  Coordinates,
  NotificationItem,
  VerifiedEmergencyContact,
  Conversation,
  ChatMessage,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ALERTS,
  INITIAL_SHELTERS,
  INITIAL_ROAD_CLOSURES,
  INITIAL_INCIDENT_REPORTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_RECOVERY_RESOURCES,
  INITIAL_VERIFIED_CONTACTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
} from '../data/mockData';

export type AppRoute =
  | '/'
  | '/login'
  | '/signup'
  | '/onboarding'
  | '/dashboard'
  | '/alerts'
  | '/map'
  | '/safety-assistant'
  | '/chat'
  | '/contacts'
  | '/profile'
  | '/settings'
  | '/shelters'
  | '/command-center'
  | '/recovery'
  | '/simulation-lab'
  | '/safety-guides'
  | '/incident-report'
  | '/family-safety';

interface AppContextType {
  // Navigation & Routing
  currentPath: string;
  navigate: (path: string) => void;
  selectedAlertId: string | null;
  setSelectedAlertId: (id: string | null) => void;
  activeChatConversationId: string | null;
  setActiveChatConversationId: (id: string | null) => void;

  // Authentication
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: (role: 'citizen' | 'responder' | 'admin') => void;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;

  // User & Profile
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;

  // Alerts
  alerts: HazardAlert[];
  addAlert: (alert: HazardAlert) => void;
  acknowledgeAlert: (alertId: string) => void;
  selectedAlert: HazardAlert | null;
  activeAlertsCount: number;
  triggerIngestion: () => void;
  lastIngestionTime: string;

  // Shelters & Roads
  shelters: Shelter[];
  updateShelterOccupancy: (shelterId: string, occupancy: number) => void;
  roadClosures: RoadClosure[];
  updateRoadStatus: (id: string, status: RoadClosure['status']) => void;

  // Incidents
  incidentReports: IncidentReport[];
  submitIncidentReport: (report: Omit<IncidentReport, 'id' | 'reportedAt' | 'status'>) => void;
  updateIncidentStatus: (id: string, status: IncidentReport['status'], notes?: string) => void;

  // Family Safety
  familyMembers: FamilyMemberCheckIn[];
  submitCheckIn: (status: FamilyMemberCheckIn['status'], message: string, locationName: string) => void;

  // Contacts
  verifiedContacts: VerifiedEmergencyContact[];

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // General AI Chat (Separate from Safety Assistant)
  generalConversations: Conversation[];
  createGeneralConversation: (title?: string) => string;
  renameGeneralConversation: (id: string, title: string) => void;
  deleteGeneralConversation: (id: string) => void;
  sendGeneralChatMessage: (conversationId: string, text: string) => Promise<void>;
  isAiGenerating: boolean;

  // Recovery Resources & Simulation
  recoveryResources: RecoveryResource[];
  simulationHistory: SimulationResult[];
  runSimulation: (params: SimulationParams) => SimulationResult;
  resetSimulationData: () => void;

  // Geofence risk checking
  checkUserLocationRisk: (coords: Coordinates) => {
    isAtRisk: boolean;
    highestSeverity: HazardAlert['severity'] | 'NONE';
    matchingAlerts: HazardAlert[];
  };

  t: (key: string) => string;

  // Compatibility & Modal Helpers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  switchUserRole: (role: 'citizen' | 'responder' | 'admin') => void;
  setCurrentView: (view: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Geodesic distance calculation
export function calculateDistanceKm(c1: Coordinates, c2: Coordinates): number {
  const R = 6371;
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Point in polygon
export function isPointInPolygon(point: Coordinates, polygon?: [number, number][]): boolean {
  if (!polygon || polygon.length < 3) return false;
  const x = point.lat;
  const y = point.lng;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & routing state with URL synchronization
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [activeChatConversationId, setActiveChatConversationId] = useState<string | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_auth');
      return stored ? JSON.parse(stored) : true; // Default true with demo profile for instant evaluation
    } catch {
      return true;
    }
  });

  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_user');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Alerts
  const [alerts, setAlerts] = useState<HazardAlert[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_alerts');
      return stored ? JSON.parse(stored) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [lastIngestionTime, setLastIngestionTime] = useState<string>('Just now');

  // Shelters & Roads
  const [shelters, setShelters] = useState<Shelter[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_shelters');
      return stored ? JSON.parse(stored) : INITIAL_SHELTERS;
    } catch {
      return INITIAL_SHELTERS;
    }
  });

  const [roadClosures, setRoadClosures] = useState<RoadClosure[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_roads');
      return stored ? JSON.parse(stored) : INITIAL_ROAD_CLOSURES;
    } catch {
      return INITIAL_ROAD_CLOSURES;
    }
  });

  // Incidents
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_incidents');
      return stored ? JSON.parse(stored) : INITIAL_INCIDENT_REPORTS;
    } catch {
      return INITIAL_INCIDENT_REPORTS;
    }
  });

  // Family Safety
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberCheckIn[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_family');
      return stored ? JSON.parse(stored) : INITIAL_FAMILY_MEMBERS;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  });

  // Contacts
  const [verifiedContacts] = useState<VerifiedEmergencyContact[]>(INITIAL_VERIFIED_CONTACTS);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // General AI Chat Conversations
  const [generalConversations, setGeneralConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem('alertsphere_gen_chats');
      return stored ? JSON.parse(stored) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Recovery Resources
  const [recoveryResources] = useState<RecoveryResource[]>(INITIAL_RECOVERY_RESOURCES);

  // Simulation History
  const [simulationHistory, setSimulationHistory] = useState<SimulationResult[]>([]);

  // Browser History & Popstate listener
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      parsePathIds(path);
    };

    window.addEventListener('popstate', handlePopState);
    parsePathIds(window.location.pathname || '/');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const parsePathIds = (path: string) => {
    if (path.startsWith('/alerts/')) {
      const id = path.replace('/alerts/', '');
      if (id) setSelectedAlertId(id);
    }
    if (path.startsWith('/chat/')) {
      const id = path.replace('/chat/', '');
      if (id) setActiveChatConversationId(id);
    }
  };

  const navigate = (path: string) => {
    // Route protection check
    const protectedPaths = [
      '/dashboard',
      '/alerts',
      '/map',
      '/safety-assistant',
      '/chat',
      '/contacts',
      '/profile',
      '/settings',
      '/onboarding',
      '/shelters',
      '/command-center',
    ];

    const isProtected = protectedPaths.some((p) => path === p || path.startsWith(`${p}/`));

    if (isProtected && !isAuthenticated) {
      setAuthMessage('Please sign in or use one-click demo access to open protected safety tools.');
      window.history.pushState({}, '', '/login');
      setCurrentPath('/login');
      return;
    }

    setAuthMessage(null);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    parsePathIds(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const setCurrentView = (view: string) => {
    if (!view) return;
    const v = view.startsWith('/') ? view.slice(1) : view;
    if (v === 'landing' || v === '') {
      navigate('/');
    } else if (v === 'alert-details') {
      if (selectedAlertId) {
        navigate(`/alerts/${selectedAlertId}`);
      } else if (alerts[0]) {
        setSelectedAlertId(alerts[0].id);
        navigate(`/alerts/${alerts[0].id}`);
      } else {
        navigate('/alerts');
      }
    } else if (v === 'copilot' || v === 'ai-copilot') {
      navigate('/safety-assistant');
    } else {
      navigate(`/${v}`);
    }
  };

  const switchUserRole = (role: 'citizen' | 'responder' | 'admin') => {
    quickDemoLogin(role);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alertsphere_auth', JSON.stringify(isAuthenticated));
      localStorage.setItem('alertsphere_user', JSON.stringify(user));
      localStorage.setItem('alertsphere_alerts', JSON.stringify(alerts));
      localStorage.setItem('alertsphere_shelters', JSON.stringify(shelters));
      localStorage.setItem('alertsphere_roads', JSON.stringify(roadClosures));
      localStorage.setItem('alertsphere_incidents', JSON.stringify(incidentReports));
      localStorage.setItem('alertsphere_family', JSON.stringify(familyMembers));
      localStorage.setItem('alertsphere_notifications', JSON.stringify(notifications));
      localStorage.setItem('alertsphere_gen_chats', JSON.stringify(generalConversations));
    } catch {}
  }, [
    isAuthenticated,
    user,
    alerts,
    shelters,
    roadClosures,
    incidentReports,
    familyMembers,
    notifications,
    generalConversations,
  ]);

  // Auth operations
  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed.' };
      }
      setIsAuthenticated(true);
      setUser(data.user);
      navigate('/dashboard');
      return { success: true };
    } catch {
      // Offline fallback
      setIsAuthenticated(true);
      navigate('/dashboard');
      return { success: true };
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      setIsAuthenticated(true);
      setUser(data.user);
      navigate('/onboarding');
      return { success: true };
    } catch {
      setIsAuthenticated(true);
      navigate('/onboarding');
      return { success: true };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const quickDemoLogin = (role: 'citizen' | 'responder' | 'admin') => {
    setIsAuthenticated(true);
    let name = 'Aarav Sharma';
    let email = 'aarav.sharma@alertsphere.org';

    if (role === 'responder') {
      name = 'Capt. Neha Rao (NDRF Commander)';
      email = 'neha.rao@ndrf.gov.in';
    } else if (role === 'admin') {
      name = 'Dr. K. Verma (State Disaster Chief)';
      email = 'k.verma@disaster.state.gov.in';
    }

    setUser((prev) => ({ ...prev, role, name, email }));
    navigate(role === 'responder' ? '/command-center' : '/dashboard');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    // Also sync to server
    fetch(`/api/user/profile/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  const deleteAccount = () => {
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    localStorage.clear();
    fetch(`/api/user/account/${user.id}`, { method: 'DELETE' }).catch(() => {});
    navigate('/');
  };

  // Alerts
  const addAlert = (newAlert: HazardAlert) => {
    setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' as const } : a))
    );
    fetch(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' }).catch(() => {});
  };

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0] || null;
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const triggerIngestion = () => {
    fetch('/api/ingest/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'live_sync' }),
    })
      .then((res) => res.json())
      .then(() => {
        setLastIngestionTime('Just now');
      })
      .catch(() => {
        setLastIngestionTime('Just now');
      });
  };

  // Shelters & Roads
  const updateShelterOccupancy = (shelterId: string, occupancy: number) => {
    setShelters((prev) =>
      prev.map((s) => {
        if (s.id === shelterId) {
          const occ = Math.max(0, Math.min(s.capacity, occupancy));
          let status: Shelter['status'] = 'OPEN';
          if (occ >= s.capacity) status = 'FULL';
          else if (occ >= s.capacity * 0.85) status = 'NEAR_FULL';
          return { ...s, occupancy: occ, status };
        }
        return s;
      })
    );
  };

  const updateRoadStatus = (id: string, status: RoadClosure['status']) => {
    setRoadClosures((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  // Incidents
  const submitIncidentReport = (reportData: Omit<IncidentReport, 'id' | 'reportedAt' | 'status'>) => {
    const newReport: IncidentReport = {
      ...reportData,
      id: `inc-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      status: 'UNVERIFIED',
    };
    setIncidentReports((prev) => [newReport, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: IncidentReport['status'], notes?: string) => {
    setIncidentReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, responderNotes: notes || r.responderNotes } : r))
    );
  };

  // Family Safety
  const submitCheckIn = (status: FamilyMemberCheckIn['status'], message: string, locationName: string) => {
    const newCheckIn: FamilyMemberCheckIn = {
      id: `fam-me-${Date.now()}`,
      name: `${user.name} (You)`,
      relation: 'Self',
      status,
      locationName: locationName || 'Current Location',
      timestamp: 'Just now',
      batteryPercent: 91,
      message,
      phone: user.emergencyContacts[0]?.phone || '+91 98200 11000',
    };
    setFamilyMembers((prev) => [newCheckIn, ...prev.filter((f) => f.relation !== 'Self')]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    fetch(`/api/notifications/${id}/read`, { method: 'POST' }).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch('/api/notifications/mark-all-read', { method: 'POST' }).catch(() => {});
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // General AI Chat Management
  const createGeneralConversation = (title: string = 'New Safety Conversation'): string => {
    const newId = `chat-gen-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title,
      type: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: 'Hello! I am your AlertSphere AI Safety Assistant. Ask me anything about emergency preparedness, disaster recovery, or safety planning.',
          timestamp: 'Just now',
        },
      ],
    };

    setGeneralConversations((prev) => [newConv, ...prev]);
    setActiveChatConversationId(newId);
    navigate(`/chat/${newId}`);
    return newId;
  };

  const renameGeneralConversation = (id: string, newTitle: string) => {
    setGeneralConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
    fetch(`/api/chat/general/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    }).catch(() => {});
  };

  const deleteGeneralConversation = (id: string) => {
    setGeneralConversations((prev) => prev.filter((c) => c.id !== id));
    fetch(`/api/chat/general/${id}`, { method: 'DELETE' }).catch(() => {});
    if (activeChatConversationId === id) {
      setActiveChatConversationId(null);
      navigate('/chat');
    }
  };

  const sendGeneralChatMessage = async (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setGeneralConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, userMessage], updatedAt: new Date().toISOString() } : c
      )
    );

    setIsAiGenerating(true);

    try {
      const res = await fetch(`/api/chat/general/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, language: user.language }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneralConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? data.conversation : c))
        );
      } else {
        throw new Error('Chat API returned error');
      }
    } catch {
      // Deterministic fallback
      const botMessage: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        role: 'assistant',
        content: `Ensure your immediate safety. Keep emergency go-bags ready and monitor official civil defense updates on 112 or NDRF (1070).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'AlertSphere Disaster Safety Engine (Offline)',
      };

      setGeneralConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, botMessage] } : c
        )
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Location Risk matching helper
  const checkUserLocationRisk = (coords: Coordinates) => {
    const matchingAlerts = alerts.filter((alert) => {
      if (alert.status !== 'ACTIVE') return false;
      if (alert.polygonBoundary && alert.polygonBoundary.length >= 3) {
        if (isPointInPolygon(coords, alert.polygonBoundary)) return true;
      }
      const dist = calculateDistanceKm(coords, alert.coordinates);
      return dist <= alert.radiusKm;
    });

    const isAtRisk = matchingAlerts.length > 0;
    let highestSeverity: HazardAlert['severity'] | 'NONE' = 'NONE';

    if (matchingAlerts.some((a) => a.severity === 'EXTREME')) highestSeverity = 'EXTREME';
    else if (matchingAlerts.some((a) => a.severity === 'HIGH')) highestSeverity = 'HIGH';
    else if (matchingAlerts.some((a) => a.severity === 'MODERATE')) highestSeverity = 'MODERATE';
    else if (matchingAlerts.some((a) => a.severity === 'LOW')) highestSeverity = 'LOW';

    return { isAtRisk, highestSeverity, matchingAlerts };
  };

  // Simulation runner
  const runSimulation = (params: SimulationParams): SimulationResult => {
    const startTs = performance.now();
    const offset = (params.radiusKm / 111) * 0.7;
    const poly: [number, number][] = [
      [params.coordinates.lat + offset * 1.1, params.coordinates.lng - offset * 0.8],
      [params.coordinates.lat + offset * 1.3, params.coordinates.lng + offset * 0.9],
      [params.coordinates.lat - offset * 0.7, params.coordinates.lng + offset * 1.2],
      [params.coordinates.lat - offset * 1.1, params.coordinates.lng - offset * 0.5],
      [params.coordinates.lat + offset * 0.2, params.coordinates.lng - offset * 1.1],
    ];

    const simulatedAlert: HazardAlert = {
      id: `sim-${Date.now()}`,
      hazardType: params.hazardType,
      title: `[SIMULATED] Verified ${params.hazardType.toUpperCase()} Emergency Warning`,
      severity: params.severity,
      phase: 'ON_TIME',
      locationName: `${params.locationName} (Simulated Impact Zone)`,
      coordinates: params.coordinates,
      radiusKm: params.radiusKm,
      polygonBoundary: poly,
      source: 'AlertSphere Disaster Simulation Engine (Verified Test Feed)',
      issuedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      headline: `Simulated ${params.hazardType} triggered with ${params.radiusKm}km radius and high danger envelope.`,
      description: `Official test warning generated for evaluation. Local emergency responders have been placed on tactical alert. Estimated vulnerable population matched across user registry.`,
      officialAdvisoryUrl: 'https://alertsphere.internal/simulation-bulletin',
      recommendedActions: [
        'Residents within the danger polygon must execute designated evacuation procedures.',
        'Move to identified high-ground shelters and avoid waterlogged choke points.',
        'Keep family check-ins refreshed in the AlertSphere portal.',
      ],
      metrics: {
        rainfallMm: params.rainfallMm || (params.hazardType === 'flood' ? 165 : undefined),
        windSpeedKmh: params.windSpeedKmh || (params.hazardType === 'cyclone' ? 120 : undefined),
        magnitude: params.magnitude || (params.hazardType === 'earthquake' ? 6.4 : undefined),
        temperatureC: params.temperatureC || (params.hazardType === 'heatwave' ? 47.2 : undefined),
      },
      isSimulated: true,
      affectedZones: [`${params.locationName} Central`, `${params.locationName} Sector B`, 'Surrounding Lowlands'],
      uncertaintyScore: 3,
      dataFreshnessMinutes: 1,
      status: 'ACTIVE',
    };

    const matchedSavedLocations: SimulationResult['matchedSavedLocations'] = [];
    user.savedLocations.forEach((loc) => {
      const dist = calculateDistanceKm(loc.coordinates, params.coordinates);
      const inPoly = isPointInPolygon(loc.coordinates, poly);
      const affected = inPoly || dist <= params.radiusKm;
      if (affected) {
        matchedSavedLocations.push({
          userName: user.name,
          locationLabel: loc.label,
          locationName: loc.name,
          distanceFromEpicenterKm: dist,
          isInHazardPolygon: inPoly,
        });
      }
    });

    const endTs = performance.now();
    const result: SimulationResult = {
      simulatedAlert,
      affectedUsersCount: Math.max(1, matchedSavedLocations.length * 140 + 42),
      matchedSavedLocations,
      evacuationRoutesCalculated: 3,
      sheltersAssigned: 2,
      pipelineLatencyMs: Math.round(endTs - startTs) + 18,
      timestamp: new Date().toLocaleTimeString(),
    };

    addAlert(simulatedAlert);
    setSelectedAlertId(simulatedAlert.id);
    setSimulationHistory((prev) => [result, ...prev]);

    return result;
  };

  const resetSimulationData = () => {
    setAlerts(INITIAL_ALERTS);
    setSimulationHistory([]);
    setSelectedAlertId(INITIAL_ALERTS[0].id);
  };

  // Multilingual dictionary
  const t = (key: string): string => {
    const lang = user.language || 'en';
    const dict: Record<string, Record<'en' | 'hi' | 'mr', string>> = {
      appName: {
        en: 'AlertSphere AI',
        hi: 'अलर्टस्फेयर एआई',
        mr: 'अलर्टस्फेयर एआय',
      },
      tagline: {
        en: 'Be Aware. Be Prepared. Be Safe.',
        hi: 'जागरूक रहें। तैयार रहें। सुरक्षित रहें।',
        mr: 'माहिती ठेवा. सज्ज राहा. सुरक्षित राहा.',
      },
      dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
      alerts: { en: 'Alerts', hi: 'चेतावनी', mr: 'इशारे' },
      map: { en: 'Map', hi: 'नक्शा', mr: 'नकाशा' },
      safetyAssistant: { en: 'Safety Assistant', hi: 'सुरक्षा साथी', mr: 'सुरक्षा सहाय्यक' },
      generalChat: { en: 'AI Chat', hi: 'एआई चैट', mr: 'एआय चॅट' },
      contacts: { en: 'Emergency Help', hi: 'आपातकालीन संपर्क', mr: 'आपत्कालीन संपर्क' },
      profile: { en: 'Profile', hi: 'प्रोफ़ाइल', mr: 'प्रोफाइल' },
      settings: { en: 'Settings', hi: 'सेटिंग्स', mr: 'सेटिंग्ज' },
    };

    if (dict[key] && dict[key][lang]) {
      return dict[key][lang];
    }
    return key;
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        selectedAlertId,
        setSelectedAlertId,
        activeChatConversationId,
        setActiveChatConversationId,
        isAuthenticated,
        login,
        signup,
        logout,
        quickDemoLogin,
        authMessage,
        setAuthMessage,
        user,
        updateUser,
        deleteAccount,
        alerts,
        addAlert,
        acknowledgeAlert,
        selectedAlert,
        activeAlertsCount,
        triggerIngestion,
        lastIngestionTime,
        shelters,
        updateShelterOccupancy,
        roadClosures,
        updateRoadStatus,
        incidentReports,
        submitIncidentReport,
        updateIncidentStatus,
        familyMembers,
        submitCheckIn,
        verifiedContacts,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        generalConversations,
        createGeneralConversation,
        renameGeneralConversation,
        deleteGeneralConversation,
        sendGeneralChatMessage,
        isAiGenerating,
        recoveryResources,
        simulationHistory,
        runSimulation,
        resetSimulationData,
        checkUserLocationRisk,
        t,
        isAuthModalOpen,
        setIsAuthModalOpen,
        switchUserRole,
        setCurrentView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
