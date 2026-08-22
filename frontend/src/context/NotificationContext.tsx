import React, { createContext, useContext, useState } from 'react';
import { NotificationItem } from '../types';

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markAsRead: (id: number) => void;
  unreadCount: number;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    userId: 2,
    title: "Welcome to Dayflow",
    message: "Your profile has been created and verified.",
    type: "SUCCESS",
    read: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    title: "August Payslip Available",
    message: "Your monthly payroll breakdown is ready for download.",
    type: "INFO",
    read: false,
    createdAt: new Date().toISOString()
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const addNotification = (title: string, message: string, type: NotificationItem['type'] = 'INFO') => {
    const newNotif: NotificationItem = {
      id: Date.now(),
      userId: 2,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
