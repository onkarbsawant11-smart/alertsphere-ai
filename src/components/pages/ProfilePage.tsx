import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { SavedLocation, EmergencyContact, HazardType } from '../../types';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  ShieldCheck,
  Languages,
  Bell,
  Eye,
  Volume2,
  CheckCircle2,
  Save,
  PhoneCall,
  Heart
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [locationConsent, setLocationConsent] = useState(user.locationConsent);

  // New location modal/fields
  const [newLocLabel, setNewLocLabel] = useState('New Campus');
  const [newLocName, setNewLocName] = useState('Andheri East, Mumbai');
  const [newLat, setNewLat] = useState('19.1136');
  const [newLng, setNewLng] = useState('72.8697');
  const [showAddLoc, setShowAddLoc] = useState(false);

  // Emergency contact fields
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Spouse');
  const [newContactPhone, setNewContactPhone] = useState('+91 98200 00000');
  const [showAddContact, setShowAddContact] = useState(false);

  const [savedBanner, setSavedBanner] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      bloodGroup,
      locationConsent,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleAddLocation = () => {
    if (!newLocName || !newLocLabel) return;
    const newLoc: SavedLocation = {
      id: `loc-${Date.now()}`,
      label: newLocLabel,
      name: newLocName,
      coordinates: { lat: parseFloat(newLat) || 19.05, lng: parseFloat(newLng) || 72.85 },
    };
    updateUser({ savedLocations: [...user.savedLocations, newLoc] });
    setShowAddLoc(false);
  };

  const handleDeleteLocation = (id: string) => {
    if (user.savedLocations.length <= 1) return;
    updateUser({ savedLocations: user.savedLocations.filter((l) => l.id !== id) });
  };

  const handleAddContact = () => {
    if (!newContactName) return;
    const newC: EmergencyContact = {
      id: `cnt-${Date.now()}`,
      name: newContactName,
      relation: newContactRelation,
      phone: newContactPhone,
      isSmsEnabled: true,
    };
    updateUser({ emergencyContacts: [...user.emergencyContacts, newC] });
    setShowAddContact(false);
    setNewContactName('');
  };

  const handleDeleteContact = (id: string) => {
    updateUser({ emergencyContacts: user.emergencyContacts.filter((c) => c.id !== id) });
  };

  const toggleHazardPreference = (haz: HazardType) => {
    const exists = user.hazardPreferences.includes(haz);
    const updated = exists
      ? user.hazardPreferences.filter((h) => h !== haz)
      : [...user.hazardPreferences, haz];
    updateUser({ hazardPreferences: updated });
  };

  const handleTestSiren = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                User Profile & Safety Preferences
              </h1>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full border border-cyan-500/20">
                Data Minimization Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage saved geofenced locations, hazard categories, emergency contacts, and accessibility.
            </p>
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {savedBanner && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Personal info & Saved Locations */}
          <div className="lg:col-span-7 space-y-6">
            {/* Personal Details */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white">Personal Profile</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Preferred Language</label>
                  <select
                    value={user.language}
                    onChange={(e) => updateUser({ language: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Saved Locations Manager (Home / Work / College / Parents) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Saved Geofenced Locations</h2>
                  <p className="text-xs text-slate-400">
                    AlertSphere actively intersects official hazard polygons with these saved points.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddLoc(!showAddLoc)}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Location</span>
                </button>
              </div>

              {showAddLoc && (
                <div className="p-4 bg-slate-800/60 border border-cyan-500/30 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Label</label>
                      <input
                        type="text"
                        placeholder="e.g. College / School"
                        value={newLocLabel}
                        onChange={(e) => setNewLocLabel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="e.g. St. Xavier's College"
                        value={newLocName}
                        onChange={(e) => setNewLocName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Latitude</label>
                      <input
                        type="text"
                        value={newLat}
                        onChange={(e) => setNewLat(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Longitude</label>
                      <input
                        type="text"
                        value={newLng}
                        onChange={(e) => setNewLng(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddLocation}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Save Point
                    </button>
                    <button
                      onClick={() => setShowAddLoc(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {user.savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center font-bold">
                        📍
                      </div>
                      <div>
                        <span className="font-bold text-white">{loc.label}: </span>
                        <span className="text-slate-300">{loc.name}</span>
                        <span className="text-[10px] text-slate-500 block">
                          Lat: {loc.coordinates.lat.toFixed(4)}, Lng: {loc.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {user.savedLocations.length > 1 && (
                        <button
                          onClick={() => handleDeleteLocation(loc.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
                          title="Delete location"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hazards, Contacts, Accessibility */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hazard Alert Preferences */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white">Hazard Alert Triggers</h2>
              <p className="text-xs text-slate-400">
                Choose which disaster types you wish to receive priority siren notifications for.
              </p>

              <div className="space-y-2">
                {[
                  { id: 'flood', label: 'Flash Floods & Water Crests' },
                  { id: 'cyclone', label: 'Tropical Cyclones & Storm Surges' },
                  { id: 'heatwave', label: 'Severe Heatwaves (Loo Winds)' },
                  { id: 'earthquake', label: 'Earthquake Tremor Reports' },
                  { id: 'landslide', label: 'Hill Landslides & Mudflows' },
                ].map((haz) => {
                  const isChecked = user.hazardPreferences.includes(haz.id as any);
                  return (
                    <label
                      key={haz.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer"
                    >
                      <span className="text-xs text-slate-300">{haz.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleHazardPreference(haz.id as any)}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Emergency Contacts</h2>
                <button
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="text-xs text-cyan-400 font-bold hover:underline"
                >
                  + Add Contact
                </button>
              </div>

              {showAddContact && (
                <div className="p-3 bg-slate-800 rounded-xl space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (+91...)"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddContact}
                      className="px-3 py-1 bg-blue-600 text-white rounded font-bold"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddContact(false)}
                      className="px-2 py-1 text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {user.emergencyContacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 bg-slate-800/40 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-slate-400 text-[11px] block">{c.phone}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility & Consent */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white">Accessibility & Privacy</h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Test Emergency Audio Chime</span>
                    <span className="text-slate-400">Verifies hardware speaker playback</span>
                  </div>
                  <button
                    onClick={handleTestSiren}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Tone</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">Consent-based Geofencing</span>
                    <span className="text-slate-400">
                      Coordinates remain local; no advertising tracking.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={locationConsent}
                    onChange={(e) => setLocationConsent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
