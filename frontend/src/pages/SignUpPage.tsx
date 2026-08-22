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
    <div className="min-h-screen bg-[#FAF9FF] dark:bg-[#0F1020] flex items-center justify-center p-4 selection:bg-[#7C3AED] selection:text-white transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] dark:bg-[#8B5CF6] mx-auto flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
            D
          </div>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">Create Dayflow Account</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Join your organization's HR platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Employee ID</label>
              <input
                type="text"
                required
                placeholder="EMP1020"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3.5 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">HR / Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="email"
                required
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#6B7280] dark:text-[#A9A8BC] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7C3AED] dark:text-[#A78BFA] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
