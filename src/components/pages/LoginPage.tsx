import React, { useState } from 'react';
import { useApp } from '../../services/store';
import {
  ShieldAlert,
  Mail,
  Lock,
  ArrowRight,
  User,
  Radio,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin, navigate, authMessage, setAuthMessage } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid credentials.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setResetModalOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Logo & Headline */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 mb-3">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Log in to AlertSphere AI</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your personalized early-warning dashboard and safety copilot.
          </p>
        </div>

        {/* Auth notice banner (e.g. redirected from protected page) */}
        {authMessage && (
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authMessage}</span>
          </div>
        )}

        {/* One-Click Hackathon Evaluator Access */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 space-y-3 shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
            Instant Demo Access:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickDemoLogin('citizen')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-center transition cursor-pointer"
            >
              <div className="text-xs font-bold text-white">Citizen</div>
              <div className="text-[10px] text-slate-400">Aarav</div>
            </button>
            <button
              onClick={() => quickDemoLogin('responder')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-amber-500/30 text-center transition cursor-pointer"
            >
              <div className="text-xs font-bold text-amber-300">Responder</div>
              <div className="text-[10px] text-slate-400">Capt. Neha</div>
            </button>
            <button
              onClick={() => quickDemoLogin('admin')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-purple-500/30 text-center transition cursor-pointer"
            >
              <div className="text-xs font-bold text-purple-300">Commander</div>
              <div className="text-[10px] text-slate-400">Dr. Verma</div>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@alertsphere.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white pl-9 focus:outline-none focus:border-cyan-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white pl-9 focus:outline-none focus:border-cyan-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-cyan-400 font-bold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white">Reset Password</h3>
            <p className="text-xs text-slate-400">
              Enter your email address and we'll dispatch a secure recovery link.
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Reset instructions dispatched! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                  >
                    Send Recovery Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
