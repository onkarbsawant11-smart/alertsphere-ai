import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { HazardMap } from '../map/HazardMap';
import { getAlertExplanation, AlertExplanation } from '../../services/geminiService';
import {
  ArrowLeft,
  Share2,
  Volume2,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Compass,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export const AlertDetailsPage: React.FC = () => {
  const { selectedAlert, setCurrentView, user, shelters } = useApp();
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AlertExplanation | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(true);

  const alert = selectedAlert;

  useEffect(() => {
    if (!alert) return;
    let isMounted = true;
    setIsLoadingAi(true);

    getAlertExplanation(alert, user.language)
      .then((res) => {
        if (isMounted) {
          setAiExplanation(res);
          setIsLoadingAi(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingAi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [alert, user.language]);

  if (!alert) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 text-center">
        <p>No alert selected.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const text = `🚨 [ALERTSPHERE EMERGENCY ADVISORY]\n${alert.title} in ${alert.locationName}\nSeverity: ${alert.severity}\nSource: ${alert.source}\nValid Until: ${alert.validUntil}\nInstructions: ${alert.recommendedActions.slice(0, 2).join(' ')}\nCheck live status: https://alertsphere.internal/alerts/${alert.id}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${alert.title}. Issued by ${alert.source}. ${alert.headline}. ${alert.recommendedActions.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isPlayingAudio
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Listen to advisory audio"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{isPlayingAudio ? 'Reading...' : 'Listen Audio'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/25"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Alert Card!' : 'Share Alert'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Main Card (Styled closely after Screenshot 1) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Top Mini Map Polygon Visualizer (Screenshot 1 top banner) */}
          <div className="relative h-64 w-full bg-slate-950">
            <HazardMap
              center={alert.coordinates}
              zoom={11}
              alerts={[alert]}
              shelters={shelters}
              userLocations={user.savedLocations}
              selectedAlertId={alert.id}
              height="256px"
            />
            {/* Overlay badge */}
            <div className="absolute top-3 left-3 z-[1000] bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-semibold text-cyan-300">
              Impact Polygon & Hazard Buffer
            </div>
          </div>

          {/* Banner: "Explore additional resources in your area" (Screenshot 1) */}
          <div
            onClick={() => setCurrentView('shelters')}
            className="bg-emerald-950/40 hover:bg-emerald-900/40 border-y border-emerald-500/20 px-5 py-3 flex items-center justify-between cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🏠</span>
              <span className="text-xs font-bold text-emerald-300">
                Explore the verified shelters and emergency resources available in your area.
              </span>
            </div>
            <span className="text-emerald-400 font-bold text-sm">›</span>
          </div>

          {/* Headline & Red Advisory Badge (Screenshot 1) */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {alert.hazardType === 'cyclone' ? '🌀' : alert.hazardType === 'flood' ? '🌊' : '⚠️'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {alert.title}
                </h1>
              </div>
              <p className="text-sm font-semibold text-slate-400">
                In {alert.locationName}
              </p>
            </div>

            {/* Issued Notice (Screenshot 1: Issued 4/20 at 1:37pm by NOAA) */}
            <div className="bg-red-600 rounded-2xl px-4 py-3 text-white flex items-center justify-between shadow-lg shadow-red-600/20">
              <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                <span>Issued by {alert.source}</span>
              </div>
              <span className="text-xs text-red-100 font-medium">
                Valid until {new Date(alert.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Advisory Description */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Advisory Bulletin
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {alert.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 border-t border-slate-700/60">
                <a
                  href={alert.officialAdvisoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Verify Original Civil Defense Bulletin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-slate-500 text-[11px]">
                  Uncertainty Score: {alert.uncertaintyScore || 5}%
                </span>
              </div>
            </div>

            {/* AI Simplified Breakdown (Multilingual Support) */}
            <div className="bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    AI Safety Breakdown ({user.language.toUpperCase()})
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  Gemini 3.8 Flash
                </span>
              </div>

              {isLoadingAi ? (
                <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                  <span>Generating simplified local language safety summary...</span>
                </div>
              ) : aiExplanation ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-200 font-medium">
                    {aiExplanation.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/20">
                      <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Immediate Steps to Take</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {aiExplanation.keyActions?.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-red-500/20">
                      <div className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>What NOT to Do</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1.5">
                        {aiExplanation.avoidActions?.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Sensor Telemetry Cards */}
            <div className="grid grid-cols-3 gap-3">
              {alert.metrics.rainfallMm !== undefined && (
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rainfall</span>
                  <span className="text-lg font-extrabold text-cyan-400">{alert.metrics.rainfallMm} mm</span>
                  <span className="text-[10px] text-slate-500 block">Precipitation</span>
                </div>
              )}
              {alert.metrics.waterLevelM !== undefined && (
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Water Crest</span>
                  <span className="text-lg font-extrabold text-blue-400">{alert.metrics.waterLevelM} m</span>
                  <span className="text-[10px] text-slate-500 block">Gauge Elevation</span>
                </div>
              )}
              {alert.metrics.windSpeedKmh !== undefined && (
                <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wind Gusts</span>
                  <span className="text-lg font-extrabold text-amber-400">{alert.metrics.windSpeedKmh} km/h</span>
                  <span className="text-[10px] text-slate-500 block">Anemometer</span>
                </div>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setCurrentView('copilot')}
                className="px-4 py-2.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-2"
              >
                <span>Ask AI Copilot for Safety Help</span>
              </button>

              <button
                onClick={() => setCurrentView('shelters')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Compass className="w-4 h-4" />
                <span>Navigate to Verified Shelter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
