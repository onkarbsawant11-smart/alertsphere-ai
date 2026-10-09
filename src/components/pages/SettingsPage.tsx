import React, { useState } from 'react';
import { useApp } from '../../services/store';
import {
  Settings,
  Bell,
  Shield,
  Eye,
  Languages,
  Trash2,
  Download,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Smartphone
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, deleteAccount } = useApp();

  const [pushStatus, setPushStatus] = useState<string>(() => {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [testTonePlayed, setTestTonePlayed] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  const handleRequestPush = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support Web Push Notifications.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission === 'granted') {
        new Notification('AlertSphere AI', {
          body: 'Emergency push notification channel verified successfully.',
          icon: '/favicon.ico',
        });
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  const handlePlaySiren = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
      setTestTonePlayed(true);
      setTimeout(() => setTestTonePlayed(false), 2000);
    } catch {}
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `alertsphere_user_data_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Application Settings</h1>
              <p className="text-xs text-slate-400">
                Configure notifications, accessibility, security, and privacy preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {saveBanner && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences updated and saved to secure storage.</span>
          </div>
        )}

        {/* Section 1: Notification & Web Push Delivery */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Bell className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">Disaster Notifications & Web Push</h2>
              <p className="text-xs text-slate-400">
                Browser push delivers alerts even when the browser tab is minimized.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60">
            <div>
              <span className="text-xs font-bold text-white block">Browser Push Delivery Status</span>
              <span className="text-xs text-slate-400">
                Current Permission:{' '}
                <strong
                  className={`capitalize ${
                    pushStatus === 'granted'
                      ? 'text-emerald-400'
                      : pushStatus === 'denied'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {pushStatus}
                </strong>
              </span>
            </div>

            <button
              onClick={handleRequestPush}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              {pushStatus === 'granted' ? 'Send Test Push Alert' : 'Enable Web Push'}
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition">
              <div>
                <span className="text-xs font-bold text-white block">Critical Evacuation Orders</span>
                <span className="text-[11px] text-slate-400">Immediate high-priority alert chime</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition">
              <div>
                <span className="text-xs font-bold text-white block">Advisory Warnings (Low/Moderate)</span>
                <span className="text-[11px] text-slate-400">Preparation & watch updates</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            </label>
          </div>
        </div>

        {/* Section 2: Accessibility & Language */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Eye className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Accessibility & Display</h2>
              <p className="text-xs text-slate-400">
                Enhance readability during low-light power outages or visual impairment.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-400">Deepens dark background contrast</span>
              </div>
              <input
                type="checkbox"
                checked={user.accessibility.highContrast}
                onChange={(e) => {
                  updateUser({
                    accessibility: { ...user.accessibility, highContrast: e.target.checked },
                  });
                  triggerSaveNotification();
                }}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Large Readable Font Scale</span>
                <span className="text-[11px] text-slate-400">Increases base typography sizing</span>
              </div>
              <input
                type="checkbox"
                checked={user.accessibility.largeText}
                onChange={(e) => {
                  updateUser({
                    accessibility: { ...user.accessibility, largeText: e.target.checked },
                  });
                  triggerSaveNotification();
                }}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Auditory Warning Siren Test</span>
                <span className="text-[11px] text-slate-400">
                  Plays audio tone to verify hardware speaker functioning
                </span>
              </div>
              <button
                onClick={handlePlaySiren}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{testTonePlayed ? 'Tone Playing...' : 'Test Siren Tone'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Data Privacy, Minimization & Account */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold text-white">Privacy & Data Minimization</h2>
              <p className="text-xs text-slate-400">
                Your coordinates are never sold or shared. Only verified disaster warnings are geofenced.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Consent-based Location Tracking</span>
                <span className="text-[11px] text-slate-400">
                  Allow AlertSphere to calculate distance to active disaster polygons
                </span>
              </div>
              <input
                type="checkbox"
                checked={user.locationConsent}
                onChange={(e) => {
                  updateUser({ locationConsent: e.target.checked });
                  triggerSaveNotification();
                }}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-800/40 rounded-2xl border border-slate-700/60">
              <div>
                <span className="text-xs font-bold text-white block">Export Safety Records</span>
                <span className="text-[11px] text-slate-400">
                  Download personal profile, saved locations, and emergency contacts as JSON
                </span>
              </div>
              <button
                onClick={handleExportData}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Data</span>
              </button>
            </div>

            {/* Account Deletion */}
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-red-300 block">Delete Account & Purge Data</span>
                <span className="text-[11px] text-slate-400">
                  Permanently deletes your account, saved locations, and AI chat histories.
                </span>
              </div>

              {!deleteConfirmOpen ? (
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={deleteAccount}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
