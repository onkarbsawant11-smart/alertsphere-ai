import React from 'react';
import { useApp } from '../../services/store';
import { ShieldCheck, PhoneCall, ExternalLink, Heart, AlertOctagon } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Helplines Grid */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold text-sm">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Official Emergency Helplines (Toll-Free 24x7)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">National Emergency</span>
              <span className="text-base font-extrabold text-red-400">112</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">NDMA / NDRF Ops</span>
              <span className="text-base font-extrabold text-amber-400">1070</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">Ambulance Service</span>
              <span className="text-base font-extrabold text-emerald-400">108</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">Fire Brigade</span>
              <span className="text-base font-extrabold text-orange-400">101</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">State Disaster Cell</span>
              <span className="text-base font-extrabold text-cyan-400">1077</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-[10px] text-slate-400 block uppercase">Red Cross First Aid</span>
              <span className="text-base font-extrabold text-blue-400">1800-180-1104</span>
            </div>
          </div>
        </div>

        {/* Links & Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-200 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>AlertSphere AI Disaster Management Platform</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xl">
              Engineered for hackathon evaluation. Uses deterministic rule validation for official warning feeds and Gemini 3.8 Flash for multilingual safety guidance. Does not substitute local civil defense broadcast orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button
              onClick={() => setCurrentView('safety-guides')}
              className="text-slate-300 hover:text-cyan-400 transition"
            >
              Preparedness Guides
            </button>
            <button
              onClick={() => setCurrentView('simulation-lab')}
              className="text-amber-400 hover:text-amber-300 transition"
            >
              Simulation Lab
            </button>
            <button
              onClick={() => setCurrentView('command-center')}
              className="text-slate-300 hover:text-cyan-400 transition"
            >
              Command Center
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="text-slate-300 hover:text-cyan-400 transition"
            >
              Privacy & Consent
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
