import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { FamilyMemberCheckIn } from '../../types';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Battery,
  MapPin,
  Clock,
  PhoneCall,
  Send,
  ShieldCheck,
  Share2,
  Heart,
  Navigation
} from 'lucide-react';

export const FamilySafetyPage: React.FC = () => {
  const { familyMembers, submitCheckIn, user } = useApp();

  const [status, setStatus] = useState<FamilyMemberCheckIn['status']>('SAFE');
  const [message, setMessage] = useState('');
  const [locationName, setLocationName] = useState(user.savedLocations[0]?.name || 'Home - Bandra West');
  const [alertSentNotice, setAlertSentNotice] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    submitCheckIn(status, message || (status === 'SAFE' ? 'Safe and accounted for.' : 'Need assistance.'), locationName);
    setAlertSentNotice(true);
    setMessage('');
    setTimeout(() => setAlertSentNotice(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Family & Loved Ones Safety Check-in
              </h1>
              <span className="bg-blue-500/10 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                Encrypted Emergency Circle
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Consent-based status pings, battery tracking, and safe shelter check-ins.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Location shared only during active advisories</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {alertSentNotice && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Check-in status updated successfully! Your family circle has received your ping.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Quick Check-in Broadcast Form */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">
              Broadcast Your Safety Status
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Update your emergency circle in one tap. SMS broadcast will be simulated to your emergency contacts.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4">
              {/* Status Selectors */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('SAFE')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    status === 'SAFE'
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>I'm Safe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('SHELTERED')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    status === 'SHELTERED'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>In Shelter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('EVACUATING')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    status === 'EVACUATING'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Evacuating</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('NEED_HELP')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    status === 'NEED_HELP'
                      ? 'bg-red-600/20 text-red-300 border-red-500 ring-1 ring-red-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>I Need Help (SOS)</span>
                </button>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Current Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 pl-8 focus:outline-none focus:border-cyan-500"
                  />
                  <MapPin className="w-4 h-4 text-cyan-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Optional Note to Family
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Safe with neighbor on 3rd floor, phone battery is 85%..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                  status === 'NEED_HELP'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {status === 'NEED_HELP' ? 'Broadcast Urgent SOS Ping' : 'Broadcast Status to Circle'}
                </span>
              </button>
            </form>
          </div>

          {/* Family Circle Status Board */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Family & Circle Members ({familyMembers.length})
              </h2>
              <span className="text-[11px] text-slate-500">Live Battery & Location Pings</span>
            </div>

            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{member.name}</h3>
                        <span className="text-xs text-slate-400 font-medium">({member.relation})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{member.locationName}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border shrink-0 ${
                        member.status === 'SAFE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : member.status === 'SHELTERED'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : member.status === 'EVACUATING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {member.status === 'NEED_HELP' ? 'SOS HELP' : member.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                    "{member.message}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{member.timestamp}</span>
                      </span>

                      <span className="flex items-center gap-1 text-slate-300">
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{member.batteryPercent}%</span>
                      </span>
                    </div>

                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {member.name.split(' ')[0]}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
