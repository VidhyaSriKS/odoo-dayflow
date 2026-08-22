import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, unreadCount } = useNotifications();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-400" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400">System alerts, leave updates, check-in confirmations, and payroll notifications.</p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/30 rounded-full">
          {unreadCount} Unread
        </span>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
              !n.read
                ? 'bg-brand-500/10 border-brand-500/30 shadow-soft-sm'
                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
            }`}
          >
            <div className={`p-2 rounded-xl text-white ${
              n.type === 'SUCCESS' ? 'bg-emerald-600' :
              n.type === 'WARNING' ? 'bg-amber-600' :
              n.type === 'ALERT' ? 'bg-rose-600' : 'bg-brand-600'
            }`}>
              {n.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{n.title}</h3>
                <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
