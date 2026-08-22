import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pencil, Plus, Shield, Eye, EyeOff } from 'lucide-react';

type Tab = 'resume' | 'private' | 'salary' | 'security';

// ─── Salary calculation helpers ───────────────────────────────────────────────
function calcComponents(wage: number) {
  const basic = wage * 0.50;
  const hra = basic * 0.50;                         // 50% of basic
  const standard = 4167;                             // fixed
  const performanceBonus = wage * 0.0833;
  const lta = wage * 0.08333;
  const fixed = wage - (basic + hra + standard + performanceBonus + lta);
  return { basic, hra, standard, performanceBonus, lta, fixed };
}

function calcPf(wage: number) {
  const basic = wage * 0.50;
  const empPf = basic * 0.12;
  const erPf = basic * 0.12;
  return { empPf, erPf };
}

const PROF_TAX = 200;

// ─── Small reusable field ──────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', readOnly = false
}: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; readOnly?: boolean;
}) {
  const base =
    'w-full bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm py-1.5 focus:outline-none focus:border-[#7C3AED] transition-colors';
  return (
    <div>
      <label className="text-[11px] font-medium text-[#6B7280] dark:text-[#A9A8BC] block mb-0.5">{label}</label>
      {readOnly ? (
        <p className="text-sm text-[#1F1937] dark:text-[#F8F7FF] border-b border-[#E9E5F7] dark:border-[#30334F] pb-1.5">{value || '—'}</p>
      ) : (
        <input type={type} value={value} onChange={e => onChange?.(e.target.value)} className={base} />
      )}
    </div>
  );
}

// ─── Salary row ───────────────────────────────────────────────────────────────
function SalaryRow({ label, amount, pct, note, editable = false, onWageChange }: {
  label: string; amount: number; pct?: string; note?: string; editable?: boolean; onWageChange?: (n: number) => void;
}) {
  return (
    <div className="py-3 border-b border-[#F3F4F6] dark:border-[#1E2038]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">{label}</p>
          {note && <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] mt-0.5">{note}</p>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF]">
            ₹{amount.toFixed(2)} <span className="text-[10px] font-normal text-[#6B7280] dark:text-[#A9A8BC]">/ month</span>
          </span>
          {pct && (
            <span className="text-[11px] font-semibold text-[#7C3AED] dark:text-[#A78BFA] w-14 text-right">{pct}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export const EmployeeProfilePage: React.FC = () => {
  const { user } = useAuth();
  const isHr = user?.role === 'ROLE_ADMIN';

  const [activeTab, setActiveTab] = useState<Tab>('resume');

  // ── Header info ──────────────────────────────────────────────────────────────
  const [name] = useState(user?.fullName || 'My Name');
  const [jobPosition] = useState('Senior Software Engineer');
  const [loginId] = useState(user?.email || 'employee@dayflow.com');
  const [email] = useState(user?.email || 'employee@dayflow.com');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [company] = useState('Dayflow Technologies');
  const [department] = useState('Engineering');
  const [manager] = useState('Priya Sharma');
  const [location] = useState('Bangalore, India');

  // ── Resume tab ───────────────────────────────────────────────────────────────
  const [about] = useState(
    'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
  );
  const [lovesAbout] = useState(
    'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
  );
  const [interests] = useState(
    'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
  );
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Java', 'Spring Boot']);
  const [certs, setCerts] = useState(['AWS Certified Developer', 'Google Cloud Professional']);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // ── Private Info ─────────────────────────────────────────────────────────────
  const [dob, setDob] = useState('1995-07-14');
  const [address, setAddress] = useState('12, MG Road, Bangalore - 560001');
  const [nationality, setNationality] = useState('Indian');
  const [personalEmail, setPersonalEmail] = useState('alex.personal@gmail.com');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [joiningDate] = useState('2022-03-01');
  const [accountNumber, setAccountNumber] = useState('1234 5678 9012 3456');
  const [bankName, setBankName] = useState('State Bank of India');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [panNo, setPanNo] = useState('ABCDE1234F');
  const [uanNo, setUanNo] = useState('100123456789');
  const [empCode] = useState(user?.employeeCode || 'EMP1002');

  // ── Salary Info ──────────────────────────────────────────────────────────────
  const [monthWage, setMonthWage] = useState(50000);
  const [workingDays, setWorkingDays] = useState(5);
  const [breakTime, setBreakTime] = useState('01:00');
  const [pfRate, setPfRate] = useState(12);
  const components = useMemo(() => calcComponents(monthWage), [monthWage]);
  const pf = useMemo(() => calcPf(monthWage), [monthWage]);

  // ── Security ─────────────────────────────────────────────────────────────────
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Tabs — Salary Info visible to all, but editable only by HR
  const tabs: { key: Tab; label: string }[] = [
    { key: 'resume', label: 'Resume' },
    { key: 'private', label: 'Private Info' },
    { key: 'salary', label: 'Salary Info' },
    { key: 'security', label: 'Security' },
  ];

  const sectionTitle = 'text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF] mb-3';
  const boxClass = 'bg-[#FAF9FF] dark:bg-[#181A30] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl p-4';

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="glass-panel px-5 py-3 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
        <h1 className="text-base font-extrabold text-[#1F1937] dark:text-[#F8F7FF]">My Profile</h1>
      </div>

      <div className="glass-panel rounded-2xl border border-[#E9E5F7] dark:border-[#30334F] overflow-hidden">

        {/* ── Profile Header ── */}
        <div className="p-5 border-b border-[#E9E5F7] dark:border-[#30334F]">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0 self-start">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-extrabold text-white">
                  {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#7C3AED] rounded-full flex items-center justify-center shadow hover:bg-[#6D28D9] transition-colors">
                <Pencil className="w-3 h-3 text-white" />
              </button>
            </div>

            {/* Left: Name + Login ID + Email + Mobile */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-extrabold text-[#1F1937] dark:text-[#F8F7FF]">{name}</p>
                  <p className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-semibold mt-0.5">{jobPosition}</p>
                </div>
                <Field label="Login ID" value={loginId} readOnly />
                <Field label="Email" value={email} readOnly />
                <Field label="Mobile" value={mobile} onChange={setMobile} />
              </div>

              {/* Right: Company + Department + Manager + Location */}
              <div className="space-y-3">
                <Field label="Company" value={company} readOnly />
                <Field label="Department" value={department} readOnly />
                <Field label="Manager" value={manager} readOnly />
                <Field label="Location" value={location} readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#E9E5F7] dark:border-[#30334F] px-5 gap-0.5 pt-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? 'border-[#7C3AED] text-[#7C3AED] dark:text-[#A78BFA] dark:border-[#A78BFA] bg-[#F5F3FF] dark:bg-[#1E2038]'
                  : 'border-transparent text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#1F1937] dark:hover:text-[#F8F7FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="p-5">

          {/* ════ RESUME TAB ════ */}
          {activeTab === 'resume' && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">
              {/* Left: About sections */}
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className={sectionTitle}>About</h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] leading-relaxed">{about}</p>
                </div>
                <div>
                  <h3 className={sectionTitle}>What I love about my job</h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] leading-relaxed">{lovesAbout}</p>
                </div>
                <div>
                  <h3 className={sectionTitle}>My interests and hobbies</h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] leading-relaxed">{interests}</p>
                </div>
              </div>

              {/* Right: Skills + Certification boxes */}
              <div className="space-y-4">
                {/* Skills */}
                <div className={boxClass}>
                  <h3 className={sectionTitle}>Skills</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-[#F5F3FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-full text-[10px] font-semibold text-[#7C3AED] dark:text-[#A78BFA]">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { setSkills(p => [...p, newSkill.trim()]); setNewSkill(''); } }}
                      placeholder="Add skill..."
                      className="flex-1 text-xs bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] py-1 focus:outline-none focus:border-[#7C3AED]"
                    />
                    <button
                      onClick={() => { if (newSkill.trim()) { setSkills(p => [...p, newSkill.trim()]); setNewSkill(''); } }}
                      className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] flex items-center gap-1 hover:opacity-80"
                    >
                      <Plus className="w-3 h-3" /> Add Skills
                    </button>
                  </div>
                </div>

                {/* Certification */}
                <div className={boxClass}>
                  <h3 className={sectionTitle}>Certification</h3>
                  <div className="space-y-1 mb-3">
                    {certs.map(c => (
                      <p key={c} className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] dark:bg-[#A78BFA] flex-shrink-0" />{c}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newCert}
                      onChange={e => setNewCert(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newCert.trim()) { setCerts(p => [...p, newCert.trim()]); setNewCert(''); } }}
                      placeholder="Add certification..."
                      className="flex-1 text-xs bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] py-1 focus:outline-none focus:border-[#7C3AED]"
                    />
                    <button
                      onClick={() => { if (newCert.trim()) { setCerts(p => [...p, newCert.trim()]); setNewCert(''); } }}
                      className="text-[10px] font-bold text-[#7C3AED] dark:text-[#A78BFA] flex items-center gap-1 hover:opacity-80"
                    >
                      <Plus className="w-3 h-3" /> Add Skills
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ PRIVATE INFO TAB ════ */}
          {activeTab === 'private' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {/* Left: Personal info */}
              <div className="space-y-4">
                <Field label="Date of Birth" value={dob} type="date" onChange={setDob} />
                <Field label="Residing Address" value={address} onChange={setAddress} />
                <Field label="Nationality" value={nationality} onChange={setNationality} />
                <Field label="Personal Email" value={personalEmail} type="email" onChange={setPersonalEmail} />
                <div>
                  <label className="text-[11px] font-medium text-[#6B7280] dark:text-[#A9A8BC] block mb-0.5">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm py-1.5 focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
                  >
                    <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#6B7280] dark:text-[#A9A8BC] block mb-0.5">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={e => setMaritalStatus(e.target.value)}
                    className="w-full bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm py-1.5 focus:outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
                  >
                    <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                  </select>
                </div>
                <Field label="Date of Joining" value={joiningDate} readOnly />
              </div>

              {/* Right: Bank Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] border-b border-[#E9E5F7] dark:border-[#30334F] pb-2">
                  Bank Details
                </h3>
                <Field label="Account Number" value={accountNumber} onChange={setAccountNumber} />
                <Field label="Bank Name" value={bankName} onChange={setBankName} />
                <Field label="IFSC Code" value={ifscCode} onChange={setIfscCode} />
                <Field label="PAN No" value={panNo} onChange={setPanNo} />
                <Field label="UAN NO" value={uanNo} onChange={setUanNo} />
                <Field label="Emp Code" value={empCode} readOnly />
              </div>

              {/* Save button */}
              <div className="md:col-span-2 pt-2">
                <button className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ════ SALARY INFO TAB ════ */}
          {activeTab === 'salary' && (
            <div className="space-y-5">

              {/* Admin-only notice for employees */}
              {!isHr && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF9EC] dark:bg-[#2A2310] border border-[#F59E0B]/40 rounded-xl text-xs text-[#D97706] font-semibold">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  Salary details are read-only. Contact HR for any changes.
                </div>
              )}

              {/* Wage + Schedule row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Left: Wage */}
                <div className={boxClass}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] w-24 flex-shrink-0">Month Wage</span>
                      {isHr ? (
                        <input
                          type="number"
                          value={monthWage}
                          onChange={e => setMonthWage(Number(e.target.value))}
                          className="flex-1 bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm font-bold py-1 focus:outline-none focus:border-[#7C3AED]"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF]">₹{monthWage.toLocaleString()}</span>
                      )}
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">/ Month</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] w-24 flex-shrink-0">Yearly wage</span>
                      <span className="text-sm font-bold text-[#7C3AED] dark:text-[#A78BFA]">₹{(monthWage * 12).toLocaleString()}</span>
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">/ Yearly</span>
                    </div>
                  </div>
                </div>

                {/* Right: Schedule */}
                <div className={boxClass}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] flex-1">No of working days in a week</span>
                      {isHr ? (
                        <input type="number" min={1} max={7} value={workingDays} onChange={e => setWorkingDays(Number(e.target.value))}
                          className="w-16 bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm font-bold py-1 text-center focus:outline-none focus:border-[#7C3AED]" />
                      ) : (
                        <span className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF]">{workingDays}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC] flex-1">Break Time</span>
                      {isHr ? (
                        <input type="text" value={breakTime} onChange={e => setBreakTime(e.target.value)}
                          className="w-20 bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm font-bold py-1 text-center focus:outline-none focus:border-[#7C3AED]" />
                      ) : (
                        <span className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF]">{breakTime}</span>
                      )}
                      <span className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">hrs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Components + PF / Tax */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                {/* Left: Salary Components table */}
                <div className={boxClass}>
                  <h3 className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] mb-1 border-b border-[#E9E5F7] dark:border-[#30334F] pb-2">
                    Salary Components
                  </h3>

                  <SalaryRow
                    label="Basic Salary"
                    amount={components.basic}
                    pct="50.00 %"
                    note="Define Basic salary from company cost compute. It is based on monthly wage."
                  />
                  <SalaryRow
                    label="House Rent Allowance"
                    amount={components.hra}
                    pct="50.00 %"
                    note="HRA provided to employees 50% of the basic salary"
                  />
                  <SalaryRow
                    label="Standard Allowance"
                    amount={components.standard}
                    pct="16.67 %"
                    note="A standard allowance is a predetermined, fixed amount provided to employees as part of their salary."
                  />
                  <SalaryRow
                    label="Performance Bonus"
                    amount={components.performanceBonus}
                    pct="8.33 %"
                    note="Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary."
                  />
                  <SalaryRow
                    label="Leave Travel Allowance"
                    amount={components.lta}
                    pct="8.33 %"
                    note="LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary."
                  />
                  <SalaryRow
                    label="Fixed Allowances"
                    amount={Math.max(0, components.fixed)}
                    pct={`${((Math.max(0, components.fixed) / monthWage) * 100).toFixed(2)} %`}
                    note="Fixed allowance: portion of wages is determined after calculating all salary components."
                  />
                </div>

                {/* Right: PF + Tax */}
                <div className="space-y-4">
                  {/* PF */}
                  <div className={boxClass}>
                    <h3 className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] border-b border-[#E9E5F7] dark:border-[#30334F] pb-2 mb-3">
                      Provident Fund (PF) Contribution
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-medium">Employee</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">
                            ₹{pf.empPf.toFixed(2)} <span className="text-[10px] font-normal text-[#6B7280] dark:text-[#A9A8BC]">/ month</span>
                          </span>
                          <span className="text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA]">
                            {isHr ? (
                              <input type="number" value={pfRate} onChange={e => setPfRate(Number(e.target.value))}
                                className="w-10 bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#7C3AED] dark:text-[#A78BFA] text-xs font-bold text-center focus:outline-none" />
                            ) : pfRate} %
                          </span>
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] mt-0.5">PF is calculated based on the basic salary</p>
                      </div>
                      <div className="border-t border-[#E9E5F7] dark:border-[#30334F] pt-3">
                        <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-medium">Employer</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">
                            ₹{pf.erPf.toFixed(2)} <span className="text-[10px] font-normal text-[#6B7280] dark:text-[#A9A8BC]">/ month</span>
                          </span>
                          <span className="text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA]">{pfRate} %</span>
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] mt-0.5">PF is calculated based on the basic salary</p>
                      </div>
                    </div>
                  </div>

                  {/* Tax Deductions */}
                  <div className={boxClass}>
                    <h3 className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] border-b border-[#E9E5F7] dark:border-[#30334F] pb-2 mb-3">
                      Tax Deductions
                    </h3>
                    <div>
                      <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-medium">Professional Tax</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF]">
                          ₹{PROF_TAX.toFixed(2)} <span className="text-[10px] font-normal text-[#6B7280] dark:text-[#A9A8BC]">/ month</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] mt-0.5">Professional Tax deducted from the Gross salary</p>
                    </div>
                  </div>
                </div>
              </div>

              {isHr && (
                <div className="pt-1">
                  <button className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all">
                    Save Salary Settings
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════ SECURITY TAB ════ */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-4">
              <h3 className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF]">Change Password</h3>

              <div>
                <label className="text-[11px] font-medium text-[#6B7280] dark:text-[#A9A8BC] block mb-0.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    className="w-full bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm py-1.5 pr-8 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  <button onClick={() => setShowPass(p => !p)} className="absolute right-0 top-1.5 text-[#6B7280] dark:text-[#A9A8BC] hover:text-[#7C3AED]">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#6B7280] dark:text-[#A9A8BC] block mb-0.5">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm py-1.5 focus:outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#6B7280] dark:text-[#A9A8BC] block mb-0.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D1D5DB] dark:border-[#30334F] text-[#1F1937] dark:text-[#F8F7FF] text-sm py-1.5 focus:outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>

              {confirmPass && newPass !== confirmPass && (
                <p className="text-[10px] text-[#EF4444] font-semibold">Passwords do not match.</p>
              )}

              <button
                disabled={!currentPass || !newPass || newPass !== confirmPass}
                className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Update Password
              </button>

              <div className="border-t border-[#E9E5F7] dark:border-[#30334F] pt-4">
                <h3 className="text-xs font-bold text-[#1F1937] dark:text-[#F8F7FF] mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-[#FAF9FF] dark:bg-[#181A30] rounded-xl border border-[#E9E5F7] dark:border-[#30334F]">
                  <div>
                    <p className="text-xs font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Authenticator App</p>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] mt-0.5">Add an extra layer of security</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706]">Not Set Up</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
