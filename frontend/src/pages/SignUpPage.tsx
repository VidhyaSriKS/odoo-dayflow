import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, ArrowRight, Building, Phone, UploadCloud, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../api/client';

export const SignUpPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const user = await apiClient.registerAdmin({
        companyName,
        companyLogo,
        fullName,
        email,
        phone,
        password,
        role: 'ADMIN'
      });
      login(user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FF] dark:bg-[#0F1020] flex items-center justify-center p-4 selection:bg-[#7C3AED] selection:text-white transition-colors duration-200 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] dark:bg-[#8B5CF6] flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
              D
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight">Sign Up Page</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Create your organization workspace (Admin Only)</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/40 text-[#EF4444] text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Company Name & Logo */}
          <div className="flex gap-3">
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Company Name </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Odoo India"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5 w-14 flex flex-col items-center">
              <label className="text-[10px] font-semibold text-[#6B7280] dark:text-[#A9A8BC] whitespace-nowrap">Upload Logo</label>
              <label className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center cursor-pointer hover:bg-[#6D28D9] transition-colors shadow-sm">
                <UploadCloud className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Name </label>
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
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Email </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="email"
                required
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Phone </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type="tel"
                required
                placeholder="+1 234 567 890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Password </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-10 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F1937] dark:hover:text-[#F8F7FF] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Confirm Password </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A9A8BC]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl pl-10 pr-10 py-2 text-sm text-[#1F1937] dark:text-[#F8F7FF] placeholder-[#9CA3AF] dark:placeholder-[#77768A] focus:border-[#7C3AED] dark:focus:border-[#8B5CF6] focus:outline-none"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F1937] dark:hover:text-[#F8F7FF] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] text-white font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center space-x-2 mt-4"
          >
            <span>{loading ? 'Creating...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-[#6B7280] dark:text-[#A9A8BC] pt-2">
          Already have an account ?{' '}
          <Link to="/login" className="text-[#1F1937] dark:text-[#F8F7FF] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
