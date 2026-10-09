import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { EmergencyContact } from '../../types';
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Heart,
  Flame,
  Droplets,
  AlertOctagon,
  Building
} from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { verifiedContacts, user, updateUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Family');
  const [newPhone, setNewPhone] = useState('+91 ');

  const filteredVerified = verifiedContacts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.jurisdiction.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.supportedHazards.some((h) => h.toLowerCase().includes(q))
    );
  });

  const handleAddPersonalContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: `cnt-${Date.now()}`,
      name: newName.trim(),
      relation: newRelation,
      phone: newPhone.trim(),
      isSmsEnabled: true,
    };

    updateUser({
      emergencyContacts: [...user.emergencyContacts, newContact],
    });

    setNewName('');
    setNewPhone('+91 ');
    setShowAddContact(false);
  };

  const handleDeletePersonalContact = (id: string) => {
    updateUser({
      emergencyContacts: user.emergencyContacts.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Emergency Help & Verified Contacts
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Official Government Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified public emergency hotlines and personal trusted emergency contact network.
            </p>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Clicking "Call" launches native device dialer</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Urgent National Hotlines Ribbon */}
        <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Immediate Life-Saving Emergency Toll-Free Numbers (Pan-India 24x7)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a
              href="tel:112"
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-red-500/40 rounded-2xl flex items-center justify-between group transition"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  National ERSS
                </span>
                <span className="text-xl font-extrabold text-red-400 group-hover:scale-105 transition inline-block">
                  112
                </span>
                <span className="text-[10px] text-slate-500 block">All Emergency Ops</span>
              </div>
              <PhoneCall className="w-5 h-5 text-red-400" />
            </a>

            <a
              href="tel:1070"
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 rounded-2xl flex items-center justify-between group transition"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  NDRF Control Room
                </span>
                <span className="text-xl font-extrabold text-amber-400 group-hover:scale-105 transition inline-block">
                  1070
                </span>
                <span className="text-[10px] text-slate-500 block">Disaster Rescue Ops</span>
              </div>
              <PhoneCall className="w-5 h-5 text-amber-400" />
            </a>

            <a
              href="tel:108"
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 rounded-2xl flex items-center justify-between group transition"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Ambulance Dispatch
                </span>
                <span className="text-xl font-extrabold text-emerald-400 group-hover:scale-105 transition inline-block">
                  108
                </span>
                <span className="text-[10px] text-slate-500 block">Emergency Trauma</span>
              </div>
              <PhoneCall className="w-5 h-5 text-emerald-400" />
            </a>

            <a
              href="tel:101"
              className="p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-orange-500/40 rounded-2xl flex items-center justify-between group transition"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Fire Brigade
                </span>
                <span className="text-xl font-extrabold text-orange-400 group-hover:scale-105 transition inline-block">
                  101
                </span>
                <span className="text-[10px] text-slate-500 block">Fire & Gas Leaks</span>
              </div>
              <PhoneCall className="w-5 h-5 text-orange-400" />
            </a>
          </div>
        </div>

        {/* Section 1: Official Emergency Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">
                Official Verified Public Safety Agencies
              </h2>
              <p className="text-xs text-slate-400">
                Contact details verified by Ministry of Home Affairs, NDMA & state disaster management cells.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search emergency services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVerified.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-3 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{contact.name}</h3>
                    <p className="text-xs text-cyan-400 font-medium">{contact.organization}</p>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-emerald-600/30 shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {contact.phone}</span>
                  </a>
                </div>

                {contact.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {contact.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {contact.supportedHazards.map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{contact.jurisdiction}</span>
                  </span>
                  <span className="text-slate-500">
                    Source: {contact.verificationSource}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Personal Trusted Emergency Contacts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Your Personal Trusted Circle</h2>
              <p className="text-xs text-slate-400">
                Contacts notified immediately when you trigger SOS or safety check-in pings.
              </p>
            </div>

            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Personal Contact</span>
            </button>
          </div>

          {showAddContact && (
            <form
              onSubmit={handleAddPersonalContact}
              className="p-4 bg-slate-850 rounded-2xl border border-blue-500/30 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Relation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sister / Spouse / Neighbor"
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Save to Emergency Circle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {user.emergencyContacts.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-white text-sm block">{c.name}</span>
                  <span className="text-slate-400 text-xs block">{c.relation}</span>
                  <span className="text-cyan-400 text-xs font-mono block mt-1">{c.phone}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${c.phone}`}
                    className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-xl transition"
                    title={`Call ${c.name}`}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeletePersonalContact(c.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
