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
    <div className="min-h-screen bg-[#FAF9FF] dark:bg-[#0F1020] text-[#1F1937] dark:text-[#F8F7FF] flex flex-col justify-between selection:bg-[#7C3AED] selection:text-white transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-[#E9E5F7] dark:border-[#30334F] bg-white/80 dark:bg-[#121329]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] dark:bg-[#8B5CF6] flex items-center justify-center text-white font-black text-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] overflow-hidden">
            <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1F1937] dark:text-[#F8F7FF]">DAYFLOW</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-xs font-semibold text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED] dark:hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-xs font-semibold text-white bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-20 pb-16 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F5F3FF] dark:bg-purple-950/60 border border-[#E9E5F7] dark:border-purple-800/40 text-[#7C3AED] dark:text-[#A78BFA] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA] animate-pulse" />
            <span>Next-Gen Campus & Enterprise HRMS Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#1F1937] dark:text-[#F8F7FF] tracking-tight leading-tight">
            Every workday,<br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-purple-400 bg-clip-text text-transparent">
              perfectly aligned.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#6B7280] dark:text-[#A9A8BC] max-w-2xl mx-auto leading-relaxed">
            Centralize employee management, real-time attendance check-in, automated leave workflows, payroll generation, and AI-driven HR insights in one seamless portal.
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch HR Admin Demo</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin('employee')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-[#181A30] hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              <span>Launch Employee Demo</span>
            </button>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="pt-6 flex items-center justify-center space-x-6 text-xs text-[#6B7280] dark:text-[#A9A8BC] font-mono">
            <span>Admin: <strong className="text-[#1F1937] dark:text-[#F8F7FF]">admin@dayflow.com</strong></span>
            <span>•</span>
            <span>Employee: <strong className="text-[#1F1937] dark:text-[#F8F7FF]">employee@dayflow.com</strong></span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="px-6 lg:px-12 py-16 bg-white dark:bg-[#121329] border-y border-[#E9E5F7] dark:border-[#30334F]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF]">Built for Modern Organizations</h2>
            <p className="text-[#6B7280] dark:text-[#A9A8BC] text-sm max-w-xl mx-auto">Complete end-to-end operational capabilities for HR administrators and employees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl space-y-3 border border-[#E9E5F7] dark:border-[#30334F]">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">Live Attendance & Check-In</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] leading-relaxed">Real-time status tracking, automated working duration calculation, tardiness logs, and department attendance sheets.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-3 border border-[#E9E5F7] dark:border-[#30334F]">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">AI HR Assistant & Insights</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] leading-relaxed">Natural language HR query processing connected directly to real database metrics + intelligent attendance tardiness anomaly alerts.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-3 border border-[#E9E5F7] dark:border-[#30334F]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F1937] dark:text-[#F8F7FF]">Payroll & PDF Salary Slips</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] leading-relaxed">Admin salary structure manager, itemized allowances & deductions, and downloadable PDF payslips for employees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-[#E9E5F7] dark:border-[#30334F] text-center text-xs text-[#6B7280] dark:text-[#A9A8BC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#7C3AED] dark:bg-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Dayflow HRMS</span>
          <span>© 2026 College Edition</span>
        </div>
        <div className="flex space-x-6">
          <a href="#docs" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">Documentation</a>
          <a href="#privacy" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">Security</a>
          <a href="#terms" className="hover:text-[#7C3AED] dark:hover:text-white transition-colors">API Reference</a>
        </div>
      </footer>
    </div>
  );
};
