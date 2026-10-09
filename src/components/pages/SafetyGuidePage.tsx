import React, { useState } from 'react';
import { useApp } from '../../services/store';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  LogOut,
  PhoneCall,
  Download,
  Flame,
  Droplets,
  Wind,
  Activity,
  Heart,
  ExternalLink
} from 'lucide-react';

export const SafetyGuidePage: React.FC = () => {
  const { setCurrentView, alerts, user, switchUserRole } = useApp();
  const [activeGuideTab, setActiveGuideTab] = useState<'flood' | 'cyclone' | 'earthquake' | 'heatwave' | 'fire'>('flood');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPlan = () => {
    const text = `ALERTSPHERE EMERGENCY PREPAREDNESS PLAN\nPrepared for: ${user.name}\nGenerated: ${new Date().toLocaleDateString()}\n\nSAVED SAFE LOCATIONS:\n${user.savedLocations.map(l => `- ${l.label}: ${l.name} (${l.coordinates.lat}, ${l.coordinates.lng})`).join('\n')}\n\nEMERGENCY CONTACTS:\n${user.emergencyContacts.map(c => `- ${c.name} (${c.relation}): ${c.phone}`).join('\n')}\n\nEMERGENCY HELPLINES:\n- National Emergency: 112\n- NDRF Disaster Cell: 1070\n- Ambulance: 108\n- Fire: 101\n\nGO-BAG ESSENTIALS:\n1. 3L Water per person per day (3-day supply)\n2. Non-perishable energy rations\n3. Flashlight + batteries + powerbank\n4. First aid kit + chronic medicines\n5. Waterproof folder for government ID & cash\n6. Whistle for acoustic rescue signaling\n\nALWAYS FOLLOW OFFICIAL DIRECTIVES FROM NDMA & LOCAL POLICE.`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AlertSphere_Safety_Plan_${user.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const guides = {
    flood: {
      title: 'Monsoon Floods & Flash Inundation Protocol',
      icon: Droplets,
      color: 'text-cyan-400',
      dos: [
        'Move immediately to designated reinforced shelters or high-ground floors.',
        'Turn off the main electrical circuit breaker (MCB) and LPG cylinder valve if water enters your premises.',
        'Drink only bottled or boiled water (boiled minimum 1 minute) to avoid leptospirosis and cholera.',
        'Keep emergency whistles accessible for signaling rescue boats in low visibility.',
      ],
      donts: [
        'Never walk, wade, or drive into floodwaters ("Turn around, don’t drown"). As little as 15cm of flowing water can knock you down.',
        'Never touch electrical switchboards or loose overhead wiring standing in water.',
        'Do not eat food that has come into direct contact with stagnant floodwaters.',
      ],
    },
    cyclone: {
      title: 'Tropical Cyclones & Severe Gale Winds',
      icon: Wind,
      color: 'text-teal-400',
      dos: [
        'Inspect your roof and secure loose metal sheeting, outdoor tiles, and solar mounts.',
        'Charge mobile phones, battery-operated emergency lights, and power banks beforehand.',
        'Stay indoors in the strongest, windowless room (such as a central hallway or bathroom).',
        'Remain sheltered even when wind calms suddenly; the "eye" of the cyclone may be passing.',
      ],
      donts: [
        'Do not venture outside during the calm eye of the cyclone; violent winds will reverse abruptly.',
        'Do not park motor vehicles beneath old trees or electrical transmission towers.',
        'Do not spread unverified social media rumors regarding landfall timings.',
      ],
    },
    earthquake: {
      title: 'Earthquake Tremors & Structural Shaking',
      icon: Activity,
      color: 'text-amber-400',
      dos: [
        'Execute: DROP (to hands & knees), COVER (under sturdy table), HOLD ON (until shaking stops).',
        'If outdoors, move into an open area away from tall building facades, glass windows, and electric poles.',
        'Expect aftershocks. Inspect gas lines for smells of sulfur before using matches or lighters.',
      ],
      donts: [
        'Never use elevators or stairwells while the ground is actively shaking.',
        'Do not stand in doorways unless confirmed load-bearing and reinforced.',
        'Do not panic or rush toward crowded exits simultaneously.',
      ],
    },
    heatwave: {
      title: 'Severe Heatwave & Desiccating Loo Winds',
      icon: Flame,
      color: 'text-orange-400',
      dos: [
        'Drink Oral Rehydration Salts (ORS), homemade lassi, torani (rice water), and lemon water frequently.',
        'Keep curtains closed during peak sunlight hours (11:00 AM – 4:30 PM).',
        'Cover your head with a damp white cotton cloth when outdoors.',
      ],
      donts: [
        'Never leave infants, children, or pets inside parked automobiles under any circumstances.',
        'Avoid strenuous outdoor physical labor during peak temperature hours.',
        'Do not consume excessive alcohol, caffeine, or carbonated sugary drinks which dehydrate the body.',
      ],
    },
    fire: {
      title: 'Structural & Wildfire Emergency',
      icon: Flame,
      color: 'text-red-400',
      dos: [
        'Crawl low under smoke: clean breathable air is closest to the floor (within 30cm of the ground).',
        'Touch door handles with the back of your hand; if hot, do not open.',
        'If clothing catches fire: STOP, DROP, and ROLL.',
      ],
      donts: [
        'Never return inside a burning building to retrieve personal valuables.',
        'Do not open hot doors or throw water on electrical or cooking oil fires.',
      ],
    },
  };

  const currentGuide = guides[activeGuideTab];
  const Icon = currentGuide.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Disaster Safety & Preparedness Knowledge Base
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Official NDMA Guidelines
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive do's & don'ts, downloadable survival plan, and emergency hotline directory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPlan}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Plan Downloaded!' : 'Download Personal Plan'}</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Disaster Type Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'flood', label: 'Floods & Inundation', icon: Droplets },
            { id: 'cyclone', label: 'Tropical Cyclones', icon: Wind },
            { id: 'earthquake', label: 'Earthquakes', icon: Activity },
            { id: 'heatwave', label: 'Extreme Heatwave', icon: Flame },
            { id: 'fire', label: 'Fires & Smoke', icon: Flame },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSel = activeGuideTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveGuideTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap border ${
                  isSel
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Guide Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl">
              <Icon className={`w-6 h-6 ${currentGuide.color}`} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{currentGuide.title}</h2>
              <p className="text-xs text-slate-400">Standard Civil Defense Protocols</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DO's */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>WHAT YOU MUST DO</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {currentGuide.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DONT's */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>WHAT YOU MUST AVOID</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {currentGuide.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Resources & Contacts Board */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">
            Emergency Contacts & Civic Hotlines
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">National Emergency</span>
              <span className="text-lg font-bold text-red-400">112</span>
              <span className="text-[10px] text-slate-500 block">Single emergency number</span>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">NDRF Control Room</span>
              <span className="text-lg font-bold text-amber-400">1070 / 011-24363260</span>
              <span className="text-[10px] text-slate-500 block">Disaster rescue ops</span>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Medical Ambulance</span>
              <span className="text-lg font-bold text-emerald-400">108</span>
              <span className="text-[10px] text-slate-500 block">Emergency paramedical</span>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Child Helpline</span>
              <span className="text-lg font-bold text-cyan-400">1098</span>
              <span className="text-[10px] text-slate-500 block">Vulnerable protection</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Logged in as <strong className="text-white">{user.name}</strong> ({user.role})
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
            >
              Return to Main Dashboard
            </button>
            <button
              onClick={() => {
                switchUserRole('citizen');
                setCurrentView('landing');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Exit Demo / Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
