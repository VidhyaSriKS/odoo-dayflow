import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  Users,
  CalendarCheck,
  DollarSign,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (role: 'admin' | 'employee') => {
    const email = role === 'admin' ? 'admin@dayflow.com' : 'employee@dayflow.com';
    const password = role === 'admin' ? 'Admin@123' : 'Employee@123';
    const user = await apiClient.login(email, password);
    login(user);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-glow">
            D
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">DAYFLOW</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-xl shadow-glow transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-600/20 via-slate-950/60 to-slate-950 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen Hackathon HRMS Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Every workday,<br />
            <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              perfectly aligned.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Centralize employee management, real-time attendance check-in, automated leave workflows, payroll generation, and AI-driven HR insights in one seamless SaaS platform.
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-sm rounded-xl shadow-glow hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch HR Admin Demo</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin('employee')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-brand-400" />
              <span>Launch Employee Demo</span>
            </button>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="pt-6 flex items-center justify-center space-x-6 text-xs text-slate-400 font-mono">
            <span>Admin: <strong className="text-slate-200">admin@dayflow.com</strong></span>
            <span>•</span>
            <span>Employee: <strong className="text-slate-200">employee@dayflow.com</strong></span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="px-6 lg:px-12 py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Built for Modern Organizations</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Complete end-to-end operational capabilities for HR administrators and employees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Attendance & Check-In</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Real-time status tracking, automated working duration calculation, tardiness logs, and department attendance sheets.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI HR Assistant & Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Natural language HR query processing connected directly to real database metrics + intelligent attendance tardiness anomaly alerts.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Payroll & PDF Salary Slips</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Admin salary structure manager, itemized allowances & deductions, and downloadable PDF payslips for employees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-brand-600 text-white font-bold text-xs flex items-center justify-center">D</div>
          <span className="font-semibold text-slate-300">Dayflow HRMS</span>
          <span>© 2026 Hackathon Edition</span>
        </div>
        <div className="flex space-x-6">
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          <a href="#privacy" className="hover:text-white transition-colors">Security</a>
          <a href="#terms" className="hover:text-white transition-colors">API Reference</a>
        </div>
      </footer>
    </div>
  );
};
