import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { IncidentReport } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Camera,
  Send,
  CheckCircle2,
  Clock,
  Users,
  LifeBuoy,
  Phone,
  FileText,
  BadgeAlert,
  Flame,
  Droplets,
  Zap
} from 'lucide-react';

export const IncidentReportPage: React.FC = () => {
  const { incidentReports, submitIncidentReport, user } = useApp();

  const [type, setType] = useState<IncidentReport['type']>('flood');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(user.savedLocations[0]?.name || 'Bandra West, Mumbai');
  const [urgency, setUrgency] = useState<IncidentReport['urgency']>('HIGH');
  const [assistanceRequested, setAssistanceRequested] = useState(true);
  const [peopleAffected, setPeopleAffected] = useState<number>(2);
  const [reporterPhone, setReporterPhone] = useState('+91 98201 44521');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    submitIncidentReport({
      type,
      title,
      description,
      locationName,
      coordinates: user.savedLocations[0]?.coordinates || { lat: 19.065, lng: 72.855 },
      urgency,
      reporterName: user.name,
      reporterPhone,
      peopleAffected,
      assistanceRequested,
      photoUrl: photoPreview || undefined,
    });

    setTitle('');
    setDescription('');
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 5000);
  };

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Community Incident Reporting
              </h1>
              <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                Live Field Dispatch Channel
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit crowdsourced hazard intel and rescue requests directly to Emergency Operations Center.
            </p>
          </div>

          <div className="text-xs text-amber-400 bg-amber-950/30 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium">
            ⚠️ In immediate life peril, call <strong className="text-white">112</strong> immediately.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {successBanner && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span>Incident report successfully submitted! Labeled as </span>
              <strong className="text-amber-300 uppercase underline">Unverified</strong>
              <span> until verified by Command Center field responders.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submission Form */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Report a Disaster Hazard or Rescue Need
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submissions are reviewed in real-time by NDRF & civil defense coordinators.
                </p>
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30 uppercase">
                Unverified Submission Policy
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Incident Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Hazard Incident Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'flood', label: 'Flash Flood', icon: Droplets },
                    { id: 'trapped', label: 'Trapped / Rescue', icon: LifeBuoy },
                    { id: 'downed_lines', label: 'Live Powerline', icon: Zap },
                    { id: 'fire', label: 'Fire / Spark', icon: Flame },
                    { id: 'landslide', label: 'Landslide', icon: AlertTriangle },
                    { id: 'medical', label: 'Medical Emergency', icon: Users },
                    { id: 'water_shortage', label: 'Water Shortage', icon: Droplets },
                    { id: 'other', label: 'Other Hazard', icon: ShieldAlert },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                          isSelected
                            ? 'bg-blue-600/20 text-cyan-300 border-blue-500 font-bold'
                            : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Brief Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 4 persons stranded on rooftop near Kurla station"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Field Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe exact landmarks, water depth in feet, presence of infants/elderly, and structural stability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Location & Urgency Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Location / Landmark
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

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Urgency Priority
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRITICAL">🔴 CRITICAL (Immediate Life Threat)</option>
                    <option value="HIGH">🟠 HIGH (Escalating Hazard)</option>
                    <option value="MEDIUM">🟡 MEDIUM (Significant Obstruction)</option>
                    <option value="LOW">🔵 LOW (Informational / Minor)</option>
                  </select>
                </div>
              </div>

              {/* Trapped People & Assistance Requested */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Estimated People Affected / Stranded
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-center text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Direct Rescue / Evacuation Requested
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Flag for immediate inflatable boat / ambulance unit dispatch
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={assistanceRequested}
                    onChange={(e) => setAssistanceRequested(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Photo Upload Simulation */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Damage Photo Attachment (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 cursor-pointer transition">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Upload Field Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUploadSim}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-8 h-8 rounded-lg object-cover border border-emerald-500"
                      />
                      <span>Photo Attached</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Incident to Emergency Command</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Community Reports Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Community Reports Feed ({incidentReports.length})
              </h2>
              <span className="text-[11px] text-slate-500">Live Field Queue</span>
            </div>

            <div className="space-y-3">
              {incidentReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                            report.urgency === 'CRITICAL'
                              ? 'bg-red-500 text-white'
                              : report.urgency === 'HIGH'
                              ? 'bg-orange-500 text-white'
                              : 'bg-amber-500 text-black'
                          }`}
                        >
                          {report.urgency}
                        </span>

                        {/* Status Label (brief requirement: label unverified until reviewed) */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            report.status === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : report.status === 'DISPATCHED'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : report.status === 'RESOLVED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {report.status === 'UNVERIFIED' ? '⚠️ UNVERIFIED (PENDING REVIEW)' : report.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm mt-1">{report.title}</h3>
                    </div>

                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{report.description}</p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{report.locationName}</span>
                    </span>

                    {report.assistanceRequested && (
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        <LifeBuoy className="w-3 h-3" />
                        <span>Rescue Boat Requested</span>
                      </span>
                    )}
                  </div>

                  {report.responderNotes && (
                    <div className="p-2 bg-slate-800/60 rounded-xl text-[11px] text-cyan-300 border border-slate-700/60">
                      <span className="font-bold">Responder Dispatch Note: </span>
                      <span>{report.responderNotes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
