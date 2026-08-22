import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardLayout } from './layouts/DashboardLayout';

import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeHomePage } from './pages/EmployeeHomePage';
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';
import { HrDashboard } from './pages/HrDashboard';
import { EmployeeListPage } from './pages/EmployeeListPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavePage } from './pages/LeavePage';
import { PayrollPage } from './pages/PayrollPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

const RoleBasedHome: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Protected Application Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/home" element={<RoleBasedHome />} />
                <Route path="/dashboard" element={<EmployeeHomePage />} />
                <Route path="/profile" element={<EmployeeProfilePage />} />
                <Route path="/admin" element={<HrDashboard />} />
                <Route path="/admin/employees" element={<EmployeeListPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/leaves" element={<LeavePage />} />
                <Route path="/payroll" element={<PayrollPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/ai-assistant" element={<AiAssistantPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
