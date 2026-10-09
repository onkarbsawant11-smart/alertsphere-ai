import React from 'react';
import { AlertSeverity } from '../../types';

interface RiskGaugeProps {
  severity: AlertSeverity | 'NONE';
  label?: string;
  rainfallMm?: number;
  waterLevelM?: number;
  flowSpeedMs?: number;
  temperatureC?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  severity,
  label,
  rainfallMm = 0,
  waterLevelM = 1.2,
  flowSpeedMs = 0.4,
  temperatureC,
}) => {
  // Needle angle: -90 deg (Safe/Green) to +90 deg (Extreme/Red)
  let angle = -70; // default Safe
  let statusText = 'Aman (Safe)';
  let statusSub = 'Weather conditions normal or minor light rain. Enjoy your day with peace of mind.';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let gaugeColor = '#10b981';

  if (severity === 'LOW') {
    angle = -35;
    statusText = 'Waspada (Advisory)';
    statusSub = 'Precautionary advisory in effect. Stay aware of regional weather updates.';
    badgeColor = 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    gaugeColor = '#14b8a6';
  } else if (severity === 'MODERATE') {
    angle = 5;
    statusText = 'Siaga (Elevated Watch)';
    statusSub = 'Water bodies or storm winds showing anomalous growth. Prepare emergency kits.';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    gaugeColor = '#f59e0b';
  } else if (severity === 'HIGH') {
    angle = 45;
    statusText = 'Bahaya (High Warning)';
    statusSub = 'Severe localized hazard detected. Avoid low-lying corridors and prepare for evacuation.';
    badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    gaugeColor = '#f97316';
  } else if (severity === 'EXTREME') {
    angle = 80;
    statusText = 'Awas (Critical Danger)';
    statusSub = 'Imminent life-safety hazard! Evacuate to reinforced shelters immediately.';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
    gaugeColor = '#ef4444';
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: gaugeColor }} />
          <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400">
            {label || 'Hazard Exposure & Risk Status'}
          </h3>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badgeColor}`}>
          {severity === 'NONE' ? 'SAFE' : severity}
        </span>
      </div>

      {/* Speedometer Gauge Visualizer (Screenshot 2 design) */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg viewBox="0 0 200 115" className="w-56 h-32 overflow-visible">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#84cc16" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Gradient colored active arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset="0"
          />

          {/* Center pivot */}
          <circle cx="100" cy="100" r="8" fill="#334155" stroke="#0f172a" strokeWidth="2" />

          {/* Needle */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <polygon points="98,100 102,100 100,28" fill="#f8fafc" />
            <circle cx="100" cy="100" r="4" fill="#ef4444" />
          </g>
        </svg>

        {/* Status text */}
        <div className="text-center -mt-3">
          <p className="text-xl font-bold tracking-tight text-white">{statusText}</p>
          <p className="text-xs text-slate-400 max-w-xs mt-1 px-4">{statusSub}</p>
        </div>
      </div>

      {/* Sensor telemetry bar (Screenshot 2: Curah Hujan, Tinggi Air, Arus Air) */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
        <div className="bg-slate-800/60 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Rainfall</span>
          <span className="text-base font-bold text-cyan-400">{rainfallMm} mm</span>
          <span className="text-[10px] text-slate-500 block">
            {rainfallMm > 80 ? 'Heavy' : rainfallMm > 30 ? 'Moderate' : 'Stable'}
          </span>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Water Crest</span>
          <span className="text-base font-bold text-blue-400">{waterLevelM} m</span>
          <span className="text-[10px] text-slate-500 block">
            {waterLevelM > 2.5 ? 'Danger mark' : 'Within bank'}
          </span>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">
            {temperatureC !== undefined ? 'Temperature' : 'Flow Speed'}
          </span>
          <span className="text-base font-bold text-amber-400">
            {temperatureC !== undefined ? `${temperatureC}°C` : `${flowSpeedMs} m/s`}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {temperatureC !== undefined ? 'Ambient' : 'Stream velocity'}
          </span>
        </div>
      </div>
    </div>
  );
};
