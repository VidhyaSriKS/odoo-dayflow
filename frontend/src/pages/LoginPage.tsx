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
    <div className="min-h-screen bg-[#FAF9FF] dark:bg-[#0F1020] flex items-center justify-center p-4 selection:bg-[#7C3AED] selection:text-white transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] dark:bg-[#8B5CF6] flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
              D
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">Welcome to DAYFLOW</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Sign in to your HR management dashboard</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/40 text-[#EF4444] text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Password</label>
              <a href="#forgot" className="text-[11px] text-[#7C3AED] dark:text-[#A78BFA] hover:underline">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-[#6B7280] dark:text-[#A9A8BC] cursor-pointer">
              <input type="checkbox" className="rounded bg-[#FAF9FF] dark:bg-[#1E2038] border-[#E9E5F7] dark:border-[#30334F] text-[#7C3AED] focus:ring-0" defaultChecked />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all duration-200 flex items-center justify-center space-x-2"
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
        <div className="pt-4 border-t border-[#E9E5F7] dark:border-[#30334F] space-y-2">
          <span className="text-[11px] font-bold text-[#6B7280] dark:text-[#A9A8BC] uppercase tracking-wider block text-center">Instant Demo Access</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoAccount('admin@dayflow.com', 'Admin@123')}
              className="px-3 py-2 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#30334F] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl text-xs font-medium text-[#1F1937] dark:text-[#F8F7FF] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Admin Demo</span>
            </button>
            <button
              onClick={() => handleDemoAccount('employee@dayflow.com', 'Employee@123')}
              className="px-3 py-2 bg-[#FAF9FF] dark:bg-[#1E2038] hover:bg-[#F5F3FF] dark:hover:bg-[#30334F] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl text-xs font-medium text-[#1F1937] dark:text-[#F8F7FF] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Employee Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#6B7280] dark:text-[#A9A8BC] pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#7C3AED] dark:text-[#A78BFA] font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
