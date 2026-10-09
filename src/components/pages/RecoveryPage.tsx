import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { RecoveryResource } from '../../types';
import {
  LifeBuoy,
  Droplets,
  Heart,
  DollarSign,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MapPin,
  ExternalLink,
  FileCheck,
  Navigation,
  FileText
} from 'lucide-react';

export const RecoveryPage: React.FC = () => {
  const { recoveryResources, roadClosures } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Claim form state
  const [claimantName, setClaimantName] = useState('Aarav Sharma');
  const [damageType, setDamageType] = useState('Structural Water Damage');
  const [address, setAddress] = useState('Bandra West, Mumbai');
  const [estLoss, setEstLoss] = useState('₹ 1,50,000');

  const filteredResources = recoveryResources.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => setClaimSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Post-Disaster Recovery & Relief Hub
              </h1>
              <span className="bg-blue-500/10 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                Phase 3: Rebuild & Restore
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified relief resources, road reopening updates, medical camps, and damage claims.
            </p>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audited by State Disaster Relief Commissioner</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Relief Services' },
            { id: 'water', label: 'Potable Water Tankers', icon: Droplets },
            { id: 'food', label: 'Community Food Rations', icon: Heart },
            { id: 'medical', label: 'Trauma & Medical Clinics', icon: Heart },
            { id: 'power', label: 'Device Charging & Power', icon: Zap },
            { id: 'financial', label: 'Relief Claims Desks', icon: DollarSign },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Verified Relief Resources */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Relief Deployment Points ({filteredResources.length})
            </h2>

            <div className="space-y-3">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                        {res.category.toUpperCase()} RELIEF
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{res.title}</h3>
                      <p className="text-xs text-slate-400">Provider: {res.provider}</p>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{res.locationName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.scheduleOrHours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-500">Verified by: {res.verifiedBy}</span>
                    <a
                      href={`tel:${res.contact}`}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{res.contact}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmed Road Reopening Updates */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 mt-6">
              <h3 className="text-sm font-bold text-white">
                Confirmed Road & Transit Reopening Updates
              </h3>

              <div className="space-y-2.5">
                {roadClosures.map((road) => (
                  <div
                    key={road.id}
                    className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{road.name}</span>
                      <span className="text-slate-400 block text-[11px]">
                        Condition: {road.reason} ({road.reportedAt})
                      </span>
                    </div>

                    <span
                      className={`font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase border ${
                        road.status === 'REOPENED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : road.status === 'PASSABLE_HEAVY_ONLY'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                    >
                      {road.status === 'REOPENED' ? '✓ REOPENED' : road.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Damage Claim & Financial Relief Registration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">
                  Post-Disaster Relief & Damage Assessment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Register preliminary structural or asset losses for state disaster relief compensation.
                </p>
              </div>

              {claimSubmitted && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Claim ticket #REC-2026-8812 registered. State surveyor will contact you.</span>
                </div>
              )}

              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Claimant Name</label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Property Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                    <select
                      value={damageType}
                      onChange={(e) => setDamageType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      <option value="Structural Water Damage">Residential Flooding</option>
                      <option value="Commercial Shop Inventory">Shop / Inventory</option>
                      <option value="Vehicle Loss">Automobile Submersion</option>
                      <option value="Agricultural Crop Damage">Crops / Farmland</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Loss</label>
                    <input
                      type="text"
                      value={estLoss}
                      onChange={(e) => setEstLoss(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Relief Compensation Claim</span>
                </button>
              </form>
            </div>

            {/* Recovery Safety Guide Highlights */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Post-Flood Safe Return Checklist
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span>Do not turn on electrical appliances until inspected by a licensed electrician.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <span>Boil municipal water for at least 1 minute before drinking or cooking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <span>Wear thick rubber gloves and sturdy boots when cleaning mud and debris.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
