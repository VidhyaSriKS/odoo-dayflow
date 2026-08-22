import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { LeaveRequest } from '../types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { useNotifications } from '../context/NotificationContext';
import {
  CalendarDays,
  FilePlus,
  CheckCircle2,
  XCircle,
  Send,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_DAYS = ['S','M','T','W','T','F','S'];

function MiniCalendar({ year, month }: { year: number; month: number }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="text-[10px]">
      <p className="font-bold text-[#1F1937] dark:text-[#F8F7FF] text-center mb-1 text-[11px]">{MONTHS[month]}</p>
      <div className="grid grid-cols-7 gap-px">
        {SHORT_DAYS.map((d, i) => (
          <div key={i} className="text-center text-[#9CA3AF] dark:text-[#77768A] font-semibold py-0.5">{d}</div>
        ))}
        {cells.map((day, i) => {
          const isToday = day !== null && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          return (
            <div key={i} className={`text-center py-0.5 rounded ${
              day === null ? '' : isToday
                ? 'bg-[#7C3AED] text-white font-bold rounded-full'
                : 'text-[#1F1937] dark:text-[#F8F7FF] hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038] cursor-pointer'
            }`}>
              {day ?? ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const isHr = user?.role === 'ROLE_ADMIN';

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [hrComment, setHrComment] = useState('');

  // Form State
  const [leaveType, setLeaveType] = useState<'PAID' | 'SICK' | 'UNPAID' | 'CASUAL'>('PAID');
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-26');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  // Calendar year
  const calYear = 2026;

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    const data = await apiClient.getLeaves();
    setLeaves(data);
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = await apiClient.applyLeave(user?.employeeId || 2, {
      leaveType,
      startDate,
      endDate,
      totalDays: 2,
      reason
    });
    setLeaves(prev => [newReq, ...prev]);
    setShowApplyModal(false);
    addNotification('Time Off Submitted', 'Your time off request is pending HR approval.', 'INFO');
  };

  const handleApprove = (id: number) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'APPROVED', hrComment: hrComment || 'Approved by HR' } : l));
    setSelectedLeave(null);
    setHrComment('');
    addNotification('Leave Approved', 'Updated leave request status to APPROVED.', 'SUCCESS');
  };

  const handleReject = (id: number) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'REJECTED', hrComment: hrComment || 'Rejected by HR' } : l));
    setSelectedLeave(null);
    setHrComment('');
    addNotification('Leave Rejected', 'Updated leave request status to REJECTED.', 'WARNING');
  };

  return (
    <div className="space-y-6">

      {/* ── EMPLOYEE TIME OFF VIEW ── */}
      {!isHr && (
        <div className="space-y-5">
          {/* Header */}
          <div className="glass-panel p-4 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F] flex items-center justify-between">
            <h1 className="text-xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#7C3AED] dark:text-[#A78BFA]" />
              Time Off
            </h1>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              NEW
            </button>
          </div>

          {/* Leave Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#7C3AED] dark:border-l-[#8B5CF6] space-y-1">
              <span className="text-xs font-semibold text-[#7C3AED] dark:text-[#A78BFA] uppercase tracking-wider block">Paid time Off</span>
              <div className="text-2xl font-black text-[#1F1937] dark:text-[#F8F7FF]">24 Days Available</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#22C55E] space-y-1">
              <span className="text-xs font-semibold text-[#22C55E] uppercase tracking-wider block">Sick time off</span>
              <div className="text-2xl font-black text-[#1F1937] dark:text-[#F8F7FF]">07 Days Available</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#F59E0B] space-y-1">
              <span className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wider block">Unpaid Leaves</span>
              <div className="text-2xl font-black text-[#1F1937] dark:text-[#F8F7FF]">Unlimited</div>
            </div>
          </div>

          {/* Yearly Calendar */}
          <div className="glass-panel p-5 rounded-2xl border border-[#E9E5F7] dark:border-[#30334F]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#1F1937] dark:text-[#F8F7FF]">{calYear} — Leave Calendar</h2>
              <div className="flex items-center gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#22C55E] inline-block" /> Validated</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#F59E0B] inline-block" /> To Approve</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#EF4444] inline-block" /> Refused</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, m) => (
                <MiniCalendar key={m} year={calYear} month={m} />
              ))}
            </div>

            {/* Public Holidays */}
            <div className="mt-5 pt-4 border-t border-[#E9E5F7] dark:border-[#30334F]">
              <p className="text-[10px] font-bold text-[#6B7280] dark:text-[#A9A8BC] uppercase tracking-wider mb-2">Public Holidays</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">
                {[
                  'Jan 14 – Pongal / Makar Sankranti', 'Jan 26 – Republic Day', 'Mar 4 – Chindi', 'Aug 15 – Independence Day',
                  'Aug 26 – Rakhi', 'Oct 2 – Gandhi Jayanti', 'Nov 8 – Diwali', 'Nov 10 – New Year', 'Nov 11 – Khali Day'
                ].map(h => <span key={h}>{h}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HR ADMIN VIEW ── */}
      {isHr && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
                <span>Leave Approvals Engine</span>
              </h1>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">Apply for time off, review leave balances, and manage approval workflows.</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-[#E9E5F7] dark:border-[#30334F]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F3FF] dark:bg-[#1E2038] text-[#6B7280] dark:text-[#A9A8BC] font-semibold uppercase tracking-wider border-b border-[#E9E5F7] dark:border-[#30334F]">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Leave Type</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Days</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E5F7] dark:divide-[#30334F]">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F5F3FF] dark:hover:bg-[#1E2038]/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#1F1937] dark:text-[#F8F7FF] block">{l.employeeName}</span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC] font-mono">{l.employeeCode}</span>
                    </td>
                    <td className="p-4 font-semibold text-[#7C3AED] dark:text-[#A78BFA]">{l.leaveType}</td>
                    <td className="p-4 font-mono text-[#6B7280] dark:text-[#A9A8BC]">{l.startDate} → {l.endDate}</td>
                    <td className="p-4 font-bold text-[#1F1937] dark:text-[#F8F7FF]">{l.totalDays}d</td>
                    <td className="p-4 text-[#6B7280] dark:text-[#A9A8BC] max-w-xs truncate">{l.reason}</td>
                    <td className="p-4"><Badge status={l.status} /></td>
                    <td className="p-4 text-right space-x-1">
                      {l.status === 'PENDING' ? (
                        <>
                          <button onClick={() => handleApprove(l.id)} className="px-2.5 py-1 bg-[#22C55E] hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors">Approve</button>
                          <button onClick={() => handleReject(l.id)} className="px-2.5 py-1 bg-[#EF4444] hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition-colors">Reject</button>
                        </>
                      ) : (
                        <span className="text-[10px] text-[#9CA3AF] dark:text-[#77768A] italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Time Off Request Modal (Employee) */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Time off Type Request">
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">

          {/* Employee (read-only) */}
          <div className="flex items-center gap-4">
            <span className="w-28 font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Employee</span>
            <span className="text-[#7C3AED] dark:text-[#A78BFA] font-semibold">[{user?.fullName || 'Employee'}]</span>
          </div>

          {/* Time off Type */}
          <div className="flex items-center gap-4">
            <span className="w-28 font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Time off Type</span>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as any)}
              className="flex-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#7C3AED] dark:text-[#A78BFA] font-semibold focus:outline-none"
            >
              <option value="PAID">Paid time off</option>
              <option value="SICK">Sick Leave</option>
              <option value="UNPAID">Unpaid Leaves</option>
            </select>
          </div>

          {/* Validity Period */}
          <div className="flex items-center gap-4">
            <span className="w-28 font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Validity Period</span>
            <div className="flex items-center gap-2 flex-1">
              <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                className="flex-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#7C3AED] dark:text-[#A78BFA] font-semibold focus:outline-none" />
              <span className="text-[#6B7280] dark:text-[#A9A8BC] font-bold">To</span>
              <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)}
                className="flex-1 bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl px-3 py-2 text-[#7C3AED] dark:text-[#A78BFA] font-semibold focus:outline-none" />
            </div>
          </div>

          {/* Allocation */}
          <div className="flex items-center gap-4">
            <span className="w-28 font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Allocation</span>
            <div className="flex items-center gap-2 text-[#7C3AED] dark:text-[#A78BFA] font-semibold">
              <span>01.00</span>
              <span>Days</span>
            </div>
          </div>

          {/* Attachment */}
          <div className="flex items-center gap-4">
            <span className="w-28 font-semibold text-[#1F1937] dark:text-[#F8F7FF]">Attachment:</span>
            <label className="flex items-center gap-2 cursor-pointer text-[#7C3AED] dark:text-[#A78BFA] font-semibold">
              <div className="p-2 bg-[#F5F3FF] dark:bg-[#1E2038] rounded-lg">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-[#6B7280] dark:text-[#A9A8BC] font-normal">
                {attachment ? attachment.name : '(For sick leave certificate)'}
              </span>
              <input type="file" className="hidden" onChange={e => setAttachment(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Reason */}
          <div>
            <label className="font-semibold text-[#1F1937] dark:text-[#F8F7FF] block mb-1">Reason (optional)</label>
            <textarea rows={2} placeholder="State reason..." value={reason} onChange={e => setReason(e.target.value)}
              className="w-full bg-[#FAF9FF] dark:bg-[#1E2038] border border-[#E9E5F7] dark:border-[#30334F] rounded-xl p-3 text-[#1F1937] dark:text-[#F8F7FF] focus:outline-none" />
          </div>

          {/* Submit / Discard */}
          <div className="flex gap-3 pt-1">
            <button type="submit"
              className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#8B5CF6] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(124,58,237,0.3)] flex items-center gap-2 transition-all">
              <Send className="w-3.5 h-3.5" />
              Submit
            </button>
            <button type="button" onClick={() => setShowApplyModal(false)}
              className="px-5 py-2 bg-[#EF4444] hover:bg-rose-600 text-white font-bold rounded-xl transition-all">
              Discard
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};


