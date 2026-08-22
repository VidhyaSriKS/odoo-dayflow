import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, unreadCount } = useNotifications();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F1937] dark:text-[#F8F7FF] tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC]">System alerts, leave updates, check-in confirmations, and payroll notifications.</p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-[#F5F3FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#A78BFA] border border-[#E9E5F7] dark:border-purple-800/40 rounded-full">
          {unreadCount} Unread
        </span>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-[#E9E5F7] dark:border-[#30334F] space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
              !n.read
                ? 'bg-[#F5F3FF] dark:bg-[#1E2038] border-[#7C3AED]/40 dark:border-[#8B5CF6]/40 shadow-sm'
                : 'bg-white/50 dark:bg-[#181A30]/40 border-[#E9E5F7] dark:border-[#30334F]/50 hover:bg-[#FAF9FF] dark:hover:bg-[#1E2038]'
            }`}
          >
            <div className={`p-2 rounded-xl text-white ${
              n.type === 'SUCCESS' ? 'bg-[#22C55E]' :
              n.type === 'WARNING' ? 'bg-[#F59E0B]' :
              n.type === 'ALERT' ? 'bg-[#EF4444]' : 'bg-[#7C3AED] dark:bg-[#8B5CF6]'
            }`}>
              {n.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1F1937] dark:text-[#F8F7FF] text-sm">{n.title}</h3>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A9A8BC]">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#A9A8BC] mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
