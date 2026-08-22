import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Lock, Mail, ShieldCheck, User as UserIcon, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await apiClient.login(email, password);
      login(user);
      navigate(user.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccount = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);
    try {
      const user = await apiClient.login(demoEmail, demoPass);
      login(user);
      navigate(user.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError('Failed to authenticate demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-soft-lg space-y-6 relative overflow-hidden">
        {/* Top Glow Background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white font-black text-2xl shadow-glow">
              D
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome to DAYFLOW</h1>
          <p className="text-xs text-slate-400">Sign in to your HR management dashboard</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <a href="#forgot" className="text-[11px] text-brand-400 hover:text-brand-300">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-0" defaultChecked />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm rounded-xl shadow-glow transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In to Dayflow</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Account Quick Launch Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">Instant Demo Access</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoAccount('admin@dayflow.com', 'Admin@123')}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Admin Demo</span>
            </button>
            <button
              onClick={() => handleDemoAccount('employee@dayflow.com', 'Employee@123')}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Employee Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-400 font-semibold hover:text-brand-300">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
