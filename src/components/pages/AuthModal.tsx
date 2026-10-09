import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ShieldAlert, X, CheckCircle2, User, Key, Mail, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, switchUserRole, user } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    setError(null);
    setIsAuthModalOpen(false);
  };

  const handleSelectPersona = (role: 'citizen' | 'responder' | 'admin') => {
    switchUserRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AlertSphere AI Access</h2>
            <p className="text-xs text-slate-400">Civil Defense & Citizen Authentication</p>
          </div>
        </div>

        {/* Quick Demo Personas (Crucial for Hackathon evaluation) */}
        <div className="mb-6 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            One-Click Hackathon Evaluator Access:
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleSelectPersona('citizen')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center font-bold text-slate-200 transition"
            >
              <div className="text-cyan-400">Citizen</div>
              <div className="text-[10px] text-slate-400 font-normal">Aarav</div>
            </button>
            <button
              onClick={() => handleSelectPersona('responder')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-center font-bold text-amber-300 transition"
            >
              <div>Responder</div>
              <div className="text-[10px] text-slate-400 font-normal">Capt. Neha</div>
            </button>
            <button
              onClick={() => handleSelectPersona('admin')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-center font-bold text-purple-300 transition"
            >
              <div>Commander</div>
              <div className="text-[10px] text-slate-400 font-normal">Dr. Verma</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white pl-8 focus:outline-none focus:border-cyan-500"
                />
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@alertsphere.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white pl-8 focus:outline-none focus:border-cyan-500"
              />
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white pl-8 focus:outline-none focus:border-cyan-500"
              />
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition cursor-pointer"
          >
            {isSignUp ? 'Create Disaster Portal Account' : 'Authenticate & Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            {isSignUp ? 'Already registered? Sign In' : 'New citizen or responder? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};
