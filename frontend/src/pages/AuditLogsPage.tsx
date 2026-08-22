import React from 'react';
import { ShieldCheck, Clock, User, FileText } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const auditLogs = [
    { id: 1, action: 'LEAVE_APPROVE', performedBy: 'admin@dayflow.com', details: 'Approved Sick Leave request ID: 101 for Alex Taylor', timestamp: '2026-08-22 09:42:15' },
    { id: 2, action: 'ATTENDANCE_CHECKIN', performedBy: 'employee@dayflow.com', details: 'Checked in at 09:02 AM. Status: PRESENT', timestamp: '2026-08-22 09:02:00' },
    { id: 3, action: 'PAYROLL_UPDATE', performedBy: 'admin@dayflow.com', details: 'Updated monthly basic salary to $85,000.00 for EMP1002', timestamp: '2026-08-21 16:20:00' },
    { id: 4, action: 'EMPLOYEE_CREATE', performedBy: 'admin@dayflow.com', details: 'Created new employee profile EMP1015 (Noah Silver)', timestamp: '2026-08-20 11:15:30' },
    { id: 5, action: 'USER_LOGIN', performedBy: 'admin@dayflow.com', details: 'Authenticated successfully from IP 192.168.1.45', timestamp: '2026-08-20 08:30:00' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>System Security Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-400">Complete immutable record of system administrative actions, security events, logins, and leave approvals.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
            <tr>
              <th className="p-4">Event Timestamp</th>
              <th className="p-4">Action Event</th>
              <th className="p-4">Performed By</th>
              <th className="p-4">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-mono text-slate-400">{log.timestamp}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-brand-500/10 text-brand-400 border border-brand-500/30">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-semibold text-white">{log.performedBy}</td>
                <td className="p-4 text-slate-300">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
