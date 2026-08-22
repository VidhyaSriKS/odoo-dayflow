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
  Clock,
  Send,
  MessageSquare
} from 'lucide-react';

export const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const isHr = user?.role === 'ROLE_ADMIN';

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [hrComment, setHrComment] = useState('');

  // Form State
  const [leaveType, setLeaveType] = useState<'PAID' | 'SICK' | 'UNPAID' | 'CASUAL'>('SICK');
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-26');
  const [reason, setReason] = useState('');

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
    addNotification('Leave Submitted', 'Your leave application is pending HR approval.', 'INFO');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand-400" />
            <span>{isHr ? 'Leave Approvals Engine' : 'Leave Applications & Balances'}</span>
          </h1>
          <p className="text-xs text-slate-400">Apply for time off, review leave balances, and manage approval workflows.</p>
        </div>

        {!isHr && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-glow flex items-center space-x-2 transition-all"
          >
            <FilePlus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Leave Balances Header Cards (Employee View) */}
      {!isHr && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-brand-500">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Paid Leave Balance</span>
            <div className="text-2xl font-black text-white mt-1">12 Days</div>
            <span className="text-[10px] text-slate-400 mt-1 block">15 total allocated for 2026</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-500">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Sick Leave Balance</span>
            <div className="text-2xl font-black text-white mt-1">8 Days</div>
            <span className="text-[10px] text-slate-400 mt-1 block">10 total allocated for 2026</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Casual Leave Balance</span>
            <div className="text-2xl font-black text-white mt-1">9 Days</div>
            <span className="text-[10px] text-slate-400 mt-1 block">10 total allocated for 2026</span>
          </div>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Leave Type</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Days</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              {isHr && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leaves.map((l) => (
              <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4">
                  <span className="font-bold text-white block">{l.employeeName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{l.employeeCode}</span>
                </td>
                <td className="p-4 font-semibold text-brand-400">{l.leaveType}</td>
                <td className="p-4 font-mono text-slate-300">
                  {l.startDate} → {l.endDate}
                </td>
                <td className="p-4 font-bold text-white">{l.totalDays}d</td>
                <td className="p-4 text-slate-300 max-w-xs truncate">{l.reason}</td>
                <td className="p-4">
                  <Badge status={l.status} />
                </td>
                {isHr && (
                  <td className="p-4 text-right space-x-1">
                    {l.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(l.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(l.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Processed</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Leave Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Leave">
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Leave Type</label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="PAID">Paid Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Reason for Leave</label>
            <textarea
              required
              rows={3}
              placeholder="State reason..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-glow flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Leave Application</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};
