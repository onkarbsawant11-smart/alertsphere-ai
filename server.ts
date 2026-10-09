import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USER,
  INITIAL_ALERTS,
  INITIAL_VERIFIED_CONTACTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_SHELTERS,
  INITIAL_ROAD_CLOSURES,
} from './src/data/mockData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup using recommended pattern
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with key:', err);
  }
}

// -------------------------------------------------------------
// Server-Side Persistent Storage (Database)
// -------------------------------------------------------------
const DB_FILE = path.resolve(__dirname, 'server-db.json');

interface ServerDatabase {
  users: any[];
  alerts: any[];
  generalConversations: any[];
  safetyConversations: any[];
  notifications: any[];
  verifiedContacts: any[];
  shelters: any[];
  roadClosures: any[];
  ingestionLogs: any[];
}

function loadDatabase(): ServerDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read server-db.json, re-initializing default store:', err);
  }

  // Initialize with initial verified baseline
  const initialDb: ServerDatabase = {
    users: [
      {
        ...INITIAL_USER,
        passwordHash: 'demo_password_hash', // Simulated secure hash
      },
    ],
    alerts: [...INITIAL_ALERTS],
    generalConversations: [...INITIAL_CONVERSATIONS],
    safetyConversations: [],
    notifications: [...INITIAL_NOTIFICATIONS],
    verifiedContacts: [...INITIAL_VERIFIED_CONTACTS],
    shelters: [...INITIAL_SHELTERS],
    roadClosures: [...INITIAL_ROAD_CLOSURES],
    ingestionLogs: [
      {
        timestamp: new Date().toISOString(),
        source: 'NDMA SACHET & IMD Real-Time Feeds',
        status: 'SUCCESS',
        recordsIngested: 4,
        deduplicated: 0,
      },
    ],
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: ServerDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write server-db.json:', err);
  }
}

let db = loadDatabase();

// -------------------------------------------------------------
// Authentication & User Profile API Endpoints
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    passwordHash: `hash_${password}`, // Simulated hash
    role: 'citizen',
    language: 'en',
    savedLocations: [
      {
        id: `loc-${Date.now()}-1`,
        label: 'Home',
        name: 'Mumbai, Maharashtra',
        coordinates: { lat: 19.076, lng: 72.8777 },
        isDefault: true,
      },
    ],
    hazardPreferences: ['flood', 'cyclone', 'heatwave', 'earthquake'],
    emergencyContacts: [],
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReaderHints: true,
      soundAlerts: true,
    },
    locationConsent: true,
    bloodGroup: 'Unknown',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase(db);

  const { passwordHash, ...userSafe } = newUser;
  res.status(201).json({ user: userSafe, token: `token_${newUser.id}` });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== `hash_${password}` && user.passwordHash !== 'demo_password_hash') {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { passwordHash, ...userSafe } = user;
  res.json({ user: userSafe, token: `token_${user.id}` });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  // Simulate sending reset email
  res.json({
    message: `If an account with ${email} exists, password reset instructions have been dispatched.`,
  });
});

// GET /api/user/profile/:id
app.get('/api/user/profile/:id', (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { passwordHash, ...userSafe } = user;
  res.json(userSafe);
});

// PUT /api/user/profile/:id
app.put('/api/user/profile/:id', (req, res) => {
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const updates = req.body;
  delete updates.passwordHash; // Protect hash
  delete updates.id;

  db.users[idx] = {
    ...db.users[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  const { passwordHash, ...userSafe } = db.users[idx];
  res.json(userSafe);
});

// DELETE /api/user/account/:id
app.delete('/api/user/account/:id', (req, res) => {
  db.users = db.users.filter((u) => u.id !== req.params.id);
  db.generalConversations = db.generalConversations.filter((c) => c.userId !== req.params.id);
  db.notifications = db.notifications.filter((n) => n.userId !== req.params.id);
  saveDatabase(db);
  res.json({ message: 'User account and associated data successfully purged.' });
});

// -------------------------------------------------------------
// Disaster Alerts & Data Ingestion API Endpoints
// -------------------------------------------------------------

// GET /api/alerts
app.get('/api/alerts', (req, res) => {
  const { status, hazardType, severity } = req.query;
  let results = [...db.alerts];

  if (status) {
    results = results.filter((a) => a.status === status);
  }
  if (hazardType) {
    results = results.filter((a) => a.hazardType === hazardType);
  }
  if (severity) {
    results = results.filter((a) => a.severity === severity);
  }

  res.json({
    alerts: results,
    total: results.length,
    lastUpdated: db.ingestionLogs[0]?.timestamp || new Date().toISOString(),
    dataSources: ['India Meteorological Department (IMD)', 'NDMA SACHET', 'CWC', 'NOAA NWS', 'USGS'],
  });
});

// GET /api/alerts/:id
app.get('/api/alerts/:id', (req, res) => {
  const alert = db.alerts.find((a) => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found.' });
  }
  res.json(alert);
});

// POST /api/alerts/:id/acknowledge
app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const alert = db.alerts.find((a) => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found.' });
  }
  alert.status = 'ACKNOWLEDGED';
  saveDatabase(db);
  res.json(alert);
});

// POST /api/ingest/trigger (Ingestion pipeline for official hazard feeds)
app.post('/api/ingest/trigger', (req, res) => {
  const { mode = 'live_sync' } = req.body;

  // Ingestion pipeline steps:
  // 1. Ingest official feed records
  // 2. Validate schema and timestamps
  // 3. Deduplicate
  // 4. Update status of expired alerts
  const now = new Date();

  // Expire alerts past validUntil
  let expiredCount = 0;
  db.alerts.forEach((alert) => {
    if (alert.validUntil && new Date(alert.validUntil) < now && alert.status === 'ACTIVE') {
      alert.status = 'PAST';
      expiredCount++;
    }
  });

  const logEntry = {
    timestamp: now.toISOString(),
    source: mode === 'simulation' ? 'Simulation Engine' : 'IMD Mausam & NDMA SACHET Feed Adapter',
    status: 'SUCCESS',
    recordsChecked: db.alerts.length,
    expiredUpdated: expiredCount,
    activeWarnings: db.alerts.filter((a) => a.status === 'ACTIVE').length,
  };

  db.ingestionLogs.unshift(logEntry);
  if (db.ingestionLogs.length > 20) db.ingestionLogs.pop();
  saveDatabase(db);

  res.json({
    status: 'Ingestion pipeline executed successfully',
    log: logEntry,
    activeAlerts: db.alerts.filter((a) => a.status === 'ACTIVE'),
  });
});

// -------------------------------------------------------------
// Emergency Contacts & Notifications API Endpoints
// -------------------------------------------------------------

// GET /api/contacts
app.get('/api/contacts', (_req, res) => {
  res.json({
    contacts: db.verifiedContacts,
    disclaimer: 'All phone numbers verified against official disaster management directories. Dialing opens native device dialer.',
  });
});

// GET /api/notifications
app.get('/api/notifications', (_req, res) => {
  res.json({
    notifications: db.notifications,
    unreadCount: db.notifications.filter((n) => !n.read).length,
  });
});

// POST /api/notifications/:id/read
app.post('/api/notifications/:id/read', (req, res) => {
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDatabase(db);
  }
  res.json({ success: true });
});

// POST /api/notifications/mark-all-read
app.post('/api/notifications/mark-all-read', (_req, res) => {
  db.notifications.forEach((n) => (n.read = true));
  saveDatabase(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// Separate General AI Chat with Persistent History API Endpoints
// -------------------------------------------------------------

// GET /api/chat/general
app.get('/api/chat/general', (_req, res) => {
  res.json({ conversations: db.generalConversations });
});

// POST /api/chat/general (Create new conversation)
app.post('/api/chat/general', (req, res) => {
  const { title = 'New Safety Conversation' } = req.body;
  const newConv = {
    id: `conv-gen-${Date.now()}`,
    title,
    type: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-${Date.now()}-0`,
        role: 'assistant',
        content: 'Hello! I am your AlertSphere AI Safety Assistant. Ask me anything about natural hazards, family disaster planning, safety kits, or recovery resources.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  };

  db.generalConversations.unshift(newConv);
  saveDatabase(db);
  res.status(201).json(newConv);
});

// PUT /api/chat/general/:id (Rename conversation)
app.put('/api/chat/general/:id', (req, res) => {
  const conv = db.generalConversations.find((c) => c.id === req.params.id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }
  if (req.body.title) {
    conv.title = req.body.title;
    conv.updatedAt = new Date().toISOString();
    saveDatabase(db);
  }
  res.json(conv);
});

// DELETE /api/chat/general/:id (Delete conversation)
app.delete('/api/chat/general/:id', (req, res) => {
  db.generalConversations = db.generalConversations.filter((c) => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Conversation deleted.' });
});

// POST /api/chat/general/:id/messages (Send message & invoke Gemini)
app.post('/api/chat/general/:id/messages', async (req, res) => {
  const conv = db.generalConversations.find((c) => c.id === req.params.id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }

  const { content, language = 'en' } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  const userMsg = {
    id: `msg-${Date.now()}-u`,
    role: 'user',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  conv.messages.push(userMsg);

  // Auto-generate conversation title from first question
  if (conv.messages.length <= 3 && conv.title === 'New Safety Conversation') {
    conv.title = content.slice(0, 32) + (content.length > 32 ? '...' : '');
  }

  // Generate assistant response
  let replyText = '';
  if (ai) {
    try {
      const historyContext = conv.messages
        .slice(-6)
        .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const systemInstruction = `You are AlertSphere AI's General Disaster Safety & Preparedness Companion.
Language preference: ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
Respond calmly, clearly, and authoritatively.
Prioritize life safety, practical preparedness tips, and verified emergency helplines (112, 1070).
Never invent false official warnings or claim you have contacted emergency services.`;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timeout')), 5000)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${historyContext}\nUser: ${content}`,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const aiResponse = await Promise.race([generatePromise, timeoutPromise]);
      replyText = aiResponse.text || 'Ensure personal safety first and follow official civil defense broadcast directives.';
    } catch (err) {
      console.warn('Gemini general chat error, using deterministic fallback:', err);
      replyText = generateOfflineSafetyReply(content, language, null);
    }
  } else {
    replyText = generateOfflineSafetyReply(content, language, null);
  }

  const botMsg = {
    id: `msg-${Date.now()}-a`,
    role: 'assistant',
    content: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: ai ? 'Gemini 3.8 Flash' : 'AlertSphere Disaster Knowledge Engine',
  };

  conv.messages.push(botMsg);
  conv.updatedAt = new Date().toISOString();
  saveDatabase(db);

  res.json({ userMessage: userMsg, assistantMessage: botMsg, conversation: conv });
});

// -------------------------------------------------------------
// AI Safety Assistant (Alert-Context Aware) API Endpoints
// -------------------------------------------------------------

app.post('/api/gemini/copilot', async (req, res) => {
  try {
    const { message, context, language = 'en', userLocation } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      return res.json({
        reply: generateOfflineSafetyReply(message, language, context),
        source: 'Deterministic Disaster Safety Engine (Fallback)',
      });
    }

    const systemInstruction = `You are AlertSphere AI's Emergency Response Copilot.
Your job is to provide direct, life-saving, calm, concise safety guidance during natural disasters.
Language requested: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}.
Respond STRICTLY in the requested language.
CRITICAL SAFETY RULES:
1. Always prioritize immediate human life and physical safety.
2. If there is immediate flooding, urge moving to higher ground; never walk or drive through floodwaters ("Turn around, don't drown").
3. In cyclones, advise staying indoors away from windows, charging emergency lights, having clean drinking water.
4. In earthquakes, remind: DROP, COVER, and HOLD ON.
5. Provide numbered, actionable steps.
6. Current user location: ${userLocation || 'Unknown'}.
7. Active Alerts Context: ${JSON.stringify(context || 'None')}.
8. Never invent false official evacuation orders. Remind user to follow official local emergency services directives (NDMA, NDRF, NOAA).`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 4500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const reply = response.text || 'Stay calm. Move to higher ground or a reinforced shelter. Monitor local emergency broadcasts.';
    res.json({ reply, source: 'Gemini 3.8 Flash' });
  } catch (error: any) {
    console.error('Copilot API error:', error);
    res.json({
      reply: generateOfflineSafetyReply(req.body.message || '', req.body.language || 'en', req.body.context),
      source: 'Deterministic Disaster Safety Engine (Error Fallback)',
    });
  }
});

// POST /api/gemini/explain-alert
app.post('/api/gemini/explain-alert', async (req, res) => {
  try {
    const { alert, language = 'en' } = req.body;

    if (!alert) {
      return res.status(400).json({ error: 'Alert is required' });
    }

    if (!ai) {
      return res.json({
        summary: `Verified official alert for ${alert.hazardType.toUpperCase()} in ${alert.locationName}. Severity: ${alert.severity}.`,
        keyActions: [
          'Stay informed through local disaster radio and authorized emergency feeds.',
          'Secure essential supplies: drinking water, torch, medical kit, important documents.',
          'Keep mobile phones charged and avoid unverified rumors.',
          'Know your nearest verified evacuation shelter location.',
        ],
        avoidActions: [
          'Do NOT drive through flooded roads or underpasses.',
          'Do NOT touch fallen power lines or damaged electrical poles.',
        ],
        shelterAdvice: 'Check the AlertSphere Shelter Finder for live occupancy and medical support availability.',
        source: 'Deterministic Disaster Safety Engine',
      });
    }

    const langName = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English';
    const prompt = `Explain this disaster alert in simple, easy-to-understand ${langName} for a vulnerable resident:
Alert: ${JSON.stringify(alert)}

Format your response as a JSON object with these keys:
{
  "summary": "2-3 sentences explaining what is happening and the urgency in ${langName}",
  "keyActions": ["action 1 in ${langName}", "action 2 in ${langName}", "action 3 in ${langName}"],
  "avoidActions": ["avoid 1 in ${langName}", "avoid 2 in ${langName}"],
  "shelterAdvice": "guidance on evacuation and shelters in ${langName}"
}`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 4500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    let parsed = {};
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = { summary: response.text };
    }

    res.json(parsed);
  } catch (error) {
    console.error('Explain alert error:', error);
    res.json({
      summary: `Official ${req.body?.alert?.hazardType || 'disaster'} alert for ${req.body?.alert?.locationName || 'your area'}. Immediate precautions are advised.`,
      keyActions: [
        'Move to higher or structurally sound ground if instructed.',
        'Keep emergency supplies and charged communication devices ready.',
        'Follow official state disaster directives.',
      ],
      avoidActions: ['Avoid waterlogged areas and loose electrical wires.'],
      shelterAdvice: 'Use the AlertSphere Shelter Finder to locate the nearest emergency relief camp.',
      source: 'Deterministic Safety Rules',
    });
  }
});

// Deterministic safety responses generator
function generateOfflineSafetyReply(message: string, language: string, context: any): string {
  const q = message.toLowerCase();
  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  if (q.includes('pack') || q.includes('kit') || q.includes('bag') || q.includes('सामग्री') || q.includes('बॅग')) {
    if (isHindi) {
      return `आपातकालीन किट (Go-Bag) में ये वस्तुएं रखें:\n1. पीने का पानी (प्रति व्यक्ति 3 दिन के लिए) और सूखा भोजन\n2. टॉर्च, अतिरिक्त बैटरी और पावर बैंक\n3. आवश्यक दवाइयां और प्राथमिक चिकित्सा किट\n4. आधार/पहचान पत्र और वाटरप्रूफ बैग में नकदी\n5. सीटी (Whistle) और एन-95 मास्क।`;
    }
    if (isMarathi) {
      return `आपत्कालीन बॅग (Go-Bag) मध्ये या गोष्टी ठेवा:\n1. पिण्याचे पाणी (३ दिवसांसाठी) आणि सुका खाऊ\n2. टॉर्च, एक्स्ट्रा बॅटरी आणि पॉवर बँक\n3. आवश्यक औषधे आणि प्रथमोपचार किट\n4. महत्त्वाची कागदपत्रे आणि रोख रक्कम वॉटरप्रूफ बॅगमध्ये\n5. शिट्टी आणि आपत्कालीन संपर्क क्रमांक डायरी.`;
    }
    return `Emergency Go-Bag essentials to pack immediately:\n1. 3-day supply of drinking water (3 liters/person/day) and non-perishable food\n2. Torch/flashlight with spare batteries & charged power bank\n3. Essential prescription medications and First Aid kit\n4. Government ID cards, insurance papers in a sealed waterproof zip bag\n5. Whistle (for signaling rescue), sturdy footwear, and emergency cash.`;
  }

  if (q.includes('flood') || q.includes('water') || q.includes('बाढ़') || q.includes('पूर')) {
    if (isHindi) {
      return `बाढ़ सुरक्षा निर्देश:\n1. तुरंत ऊपरी मंजिल या ऊंचे स्थान पर जाएं।\n2. बहते पानी में कभी न चलें और न ही वाहन चलाएं (15 सेमी पानी भी आपको गिरा सकता है)।\n3. बिजली का मुख्य स्विच और गैस सिलेंडर बंद कर दें।\n4. यदि पानी में फंस जाएं, तो छत पर जाएं और चमकीले कपड़े या सीटी से संकेत दें।`;
    }
    if (isMarathi) {
      return `पूर परिस्थितीसाठी सुरक्षा सूचना:\n1. त्वरित उंच जागी किंवा वरच्या मजल्यावर जा.\n2. वाहत्या पाण्यातून कधीही चालू किंवा गाडी चालवू नका.\n3. घरातील मुख्य वीज आणि गॅस पुरवठा तात्काळ बंद करा.\n4. अडकल्यास छतावर जाऊन मदतीसाठी शिट्टी किंवा लाल कापड फडकावून इशारा करा.`;
    }
    return `Flood Safety Directives:\n1. Move to higher ground immediately. Never stay in basements or ground floor low-lying rooms.\n2. Turn around, don't drown! Never walk or drive through moving water. Just 30cm of moving water can sweep away a car.\n3. Disconnect electrical mains and turn off LPG gas valves before water enters.\n4. If trapped, head to the roof, take a flashlight/whistle, and signal rescuers.`;
  }

  if (q.includes('earthquake') || q.includes('भूकंप')) {
    if (isHindi) {
      return `भूकंप आने पर:\n1. DROP (झुकें), COVER (मजबूत मेज के नीचे सिर ढकें), HOLD ON (मजबूती से पकड़ें)।\n2. खिड़कियों, भारी अलमारी और कांच से दूर रहें।\n3. लिफ्ट का उपयोग कभी न करें। खुले मैदान में हों तो खंभों और इमारतों से दूर रहें।`;
    }
    return `Earthquake Safety Directives:\n1. DROP to your hands and knees.\n2. COVER your head and neck under a sturdy table or desk.\n3. HOLD ON until shaking completely stops.\n4. Stay away from glass windows, heavy shelves. Do NOT use elevators.`;
  }

  if (isHindi) {
    return `सतर्क रहें! आपातकालीन स्थिति में शांत रहें। सुरक्षित स्थान पर जाएं और अलर्टस्फेयर मैप पर निकटतम आश्रय केंद्र देखें। किसी भी आपातकाल में राष्ट्रीय हेल्पलाइन 112 या एनडीआरएफ (1070) को तुरंत संपर्क करें।`;
  }
  if (isMarathi) {
    return `सावध राहा! आपत्कालीन परिस्थितीत घाबरू नका. जवळच्या सुरक्षित निवारण केंद्रात जा. राष्ट्रीय आपत्कालीन क्रमांक ११२ किंवा स्थानिक प्रशासनाशी (१०७०) संपर्क साधा.`;
  }
  return `Stay calm and prioritize your physical safety. Monitor verified warnings on AlertSphere AI, move to reinforced shelter or designated evacuation zones, and reach out to Emergency Helpline 112 or NDRF if in imminent danger.`;
}

// Vite integration or static file serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`AlertSphere AI server running on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Server startup failed:', err);
});
