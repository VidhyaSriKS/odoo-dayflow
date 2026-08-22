import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, BadgeCheck, ArrowRight } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        email,
        fullName,
        role: role === 'ADMIN' ? 'ROLE_ADMIN' as const : 'ROLE_EMPLOYEE' as const,
        employeeCode: employeeCode || 'EMP' + Math.floor(1000 + Math.random() * 9000),
        token: 'new-user-token'
      };
      login(newUser);
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-soft-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 mx-auto flex items-center justify-center text-white font-black text-2xl shadow-glow">
            D
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Dayflow Account</h1>
          <p className="text-xs text-slate-400">Join your organization's HR platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Employee ID</label>
              <input
                type="text"
                required
                placeholder="EMP1020"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">HR / Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm rounded-xl shadow-glow transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
