import React, { useState } from 'react';
import { useApp } from '../../services/store';
import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
  User,
  Bell,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Languages,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser, navigate } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Basic profile
  const [displayName, setDisplayName] = useState(user.name);
  const [phone, setPhone] = useState('+91 ');
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>(user.language);

  // Step 2: Location
  const [locLabel, setLocLabel] = useState('Home');
  const [locName, setLocName] = useState('Bandra West, Mumbai');
  const [locLat, setLocLat] = useState('19.0596');
  const [locLng, setLocLng] = useState('72.8295');
  const [alertRadius, setAlertRadius] = useState(15);
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Step 3: Emergency Contacts & Notifications
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Family');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 ');
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleDetectDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocLat(pos.coords.latitude.toFixed(4));
        setLocLng(pos.coords.longitude.toFixed(4));
        setLocName('Detected Device Location');
        setLocationDetecting(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationDetecting(false);
      }
    );
  };

  const handleFinishOnboarding = () => {
    const updatedLocations = [
      {
        id: `loc-primary`,
        label: locLabel,
        name: locName,
        coordinates: {
          lat: parseFloat(locLat) || 19.0596,
          lng: parseFloat(locLng) || 72.8295,
        },
        isDefault: true,
      },
    ];

    const updatedContacts = [...user.emergencyContacts];
    if (emergencyName.trim() && emergencyPhone.trim()) {
      updatedContacts.push({
        id: `cnt-${Date.now()}`,
        name: emergencyName.trim(),
        relation: emergencyRelation,
        phone: emergencyPhone.trim(),
        isSmsEnabled: true,
      });
    }

    updateUser({
      name: displayName,
      language,
      savedLocations: updatedLocations,
      emergencyContacts: updatedContacts,
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Safety Profile Onboarding</span>
            <span className="text-cyan-400">Step {step} of 3</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* STEP 1: Basic Profile */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-3">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Welcome to AlertSphere AI</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Let's personalize your emergency warning profile.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="+91 98200 00000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Preferred Advisory Language
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'hi', label: 'हिन्दी (Hindi)' },
                      { id: 'mr', label: 'मराठी (Marathi)' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLanguage(l.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          language === l.id
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!displayName.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>Continue to Location Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Location Setup */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Save Primary Safe Location</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  AlertSphere will geofence official disaster warnings to this anchor.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  {['Home', 'College', 'Workplace'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setLocLabel(lbl)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        locLabel === lbl
                          ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Location Name / Landmark</label>
                  <input
                    type="text"
                    required
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Bandra West, Mumbai"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={locLat}
                      onChange={(e) => setLocLat(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={locLng}
                      onChange={(e) => setLocLng(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDetectDeviceLocation}
                  disabled={locationDetecting}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{locationDetecting ? 'Detecting GPS...' : 'Use Device GPS Location (Consent-Based)'}</span>
                </button>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>Alert Geofence Radius:</span>
                    <span className="text-cyan-400">{alertRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={alertRadius}
                    onChange={(e) => setAlertRadius(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <span>Continue to Emergency Circle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Emergency Contacts & Notifications */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Emergency Circle & Alerts</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Optional contact notified automatically if you tap "I Need Help (SOS)".
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">Add Trusted Contact (Optional)</span>

                  <input
                    type="text"
                    placeholder="Contact Name (e.g. Dr. Rajiv Sharma)"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Relation (e.g. Father)"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (+91...)"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">In-App Hazard Warning Badges</span>
                    <span className="text-[11px] text-slate-400">Receive verified critical advisories</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Setup & Enter Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
