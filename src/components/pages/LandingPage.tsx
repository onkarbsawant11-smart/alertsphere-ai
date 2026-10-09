import React from 'react';
import { useApp } from '../../services/store';
import {
  ShieldAlert,
  Radio,
  Bot,
  Compass,
  Flame,
  LifeBuoy,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  MapPin,
  Clock,
  Bell,
  HeartHandshake,
  MessageSquare,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, quickDemoLogin, activeAlertsCount, isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Public Safety Platform • {activeAlertsCount} Verified Regional Advisories</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            AI-Powered Disaster <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Early-Warning, Response & Recovery
            </span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl font-semibold text-cyan-300 tracking-wide">
            "Be Aware. Be Prepared. Be Safe."
          </p>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            AlertSphere AI monitors verified government disaster feeds (IMD, NDMA SACHET, CWC, USGS),
            matches hazards to your saved home & campus locations, provides multilingual safety copilot assistance,
            and guides citizens to verified relief shelters.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Enter Safety Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Get Started (Sign Up)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition cursor-pointer"
                >
                  <span>Log In</span>
                </button>
              </>
            )}

            <button
              onClick={() => quickDemoLogin('citizen')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-300 font-bold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* Live Alert Ticker Bar */}
          <div className="mt-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 max-w-3xl mx-auto text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <Bell className="w-5 h-5 animate-bounce" />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                  <span>Current High Alert</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  <span>Mumbai & Coastal Belt</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  Severe Urban Flash Flood & Mithi River Basin Overflow (142mm rain)
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/alerts/alt-mumbai-flood')}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Inspect Advisory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3 LEVELS OF SAFETY SUPPORT (Section 10 of Spec) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            Three Levels of Safety Support
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            End-to-End Resilience Across the Disaster Lifecycle
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Never communicates that a user is safe solely because there are no active warnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEVEL 1: PRE-ALERT */}
          <div className="bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-500/40 rounded-3xl p-6 transition shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-bold text-lg">
              L1
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              LEVEL 1 — PRE-ALERT SUPPORT
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Prepare & Understand</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Hazard awareness before confirmed emergencies. Pre-disaster checklists, supplies planning, and risk comprehension.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Explains verified official IMD & NDMA forecasts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>72-hour family go-bag emergency checklists</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Geofenced exposure monitoring for saved homes</span>
              </li>
            </ul>
          </div>

          {/* LEVEL 2: ON-TIME ALERT */}
          <div className="bg-slate-900/60 border border-red-500/20 hover:border-red-500/40 rounded-3xl p-6 transition shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 font-bold text-lg">
              L2
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
              LEVEL 2 — ON-TIME ALERT SUPPORT
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Alert & Respond</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Immediate actionable assistance during confirmed active warnings. Sub-second notifications, AI copilot, and safe routing.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>AI Copilot multilingual safety advice (EN / HI / MR)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Safe navigation corridor avoiding flooded roads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Verified emergency helplines (112, NDRF 1070)</span>
              </li>
            </ul>
          </div>

          {/* LEVEL 3: POST-ALERT */}
          <div className="bg-slate-900/60 border border-blue-500/20 hover:border-blue-500/40 rounded-3xl p-6 transition shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 font-bold text-lg">
              L3
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
              LEVEL 3 — POST-ALERT SUPPORT
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Recover & Rebuild</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Post-event safety and community rehabilitation. Verified relief supplies, damage claims, and safe re-entry instructions.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Potable water tankers & community relief kitchens</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Confirmed road & transit reopening updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Structural damage registration & relief claims</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Interactive Capabilities</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Everything Needed Before, During, and After Emergencies
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={() => navigate('/alerts')}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Disaster Alerts Registry</h4>
              <p className="text-xs text-slate-400">
                Tabs for Active, Past, and Acknowledged alerts across floods, cyclones, heatwaves, and air quality.
              </p>
            </div>

            <div
              onClick={() => navigate('/map')}
              className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">Interactive Hazard Map</h4>
              <p className="text-xs text-slate-400">
                Vector polygons, buffer circles, user home pins, shelter capacities, and road closures.
              </p>
            </div>

            <div
              onClick={() => navigate('/safety-assistant')}
              className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-5 rounded-2xl transition cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">AI Safety Assistant</h4>
              <p className="text-xs text-slate-400">
                Context-aware disaster explanations powered by Gemini 3.8 Flash with multilingual voice support.
              </p>
            </div>

            <div
              onClick={() => navigate('/chat')}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm mb-1">General AI Chat with History</h4>
              <p className="text-xs text-slate-400">
                Dedicated conversation manager with multi-turn history, renaming, and persistent cloud storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Verification Footer Banner */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Grounded in Official Civil Defense Protocols • Zero AI Hallucination Policy</span>
        </div>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          AlertSphere AI does not replace local civil defense sirens or official evacuation directives.
          Always obey law enforcement personnel and emergency services on site.
        </p>
      </section>
    </div>
  );
};
