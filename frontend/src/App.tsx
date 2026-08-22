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
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';
import { HrDashboard } from './pages/HrDashboard';
import { EmployeeListPage } from './pages/EmployeeListPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavePage } from './pages/LeavePage';
import { PayrollPage } from './pages/PayrollPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

// Route Guard: Require HR / Admin access
const RequireHr: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Route Guard: Require Employee access (redirect HR to /admin)
const RequireEmployee: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

// Route Guard: Require any logged in user
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Default redirect after login based on user role
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
                
                {/* Employee Only Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireEmployee>
                      <EmployeeDashboard />
                    </RequireEmployee>
                  }
                />
                
                {/* HR Only Routes */}
                <Route
                  path="/admin"
                  element={
                    <RequireHr>
                      <HrDashboard />
                    </RequireHr>
                  }
                />
                <Route
                  path="/admin/employees"
                  element={
                    <RequireHr>
                      <EmployeeListPage />
                    </RequireHr>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <RequireHr>
                      <AnalyticsPage />
                    </RequireHr>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <RequireHr>
                      <ReportsPage />
                    </RequireHr>
                  }
                />
                <Route
                  path="/audit-logs"
                  element={
                    <RequireHr>
                      <AuditLogsPage />
                    </RequireHr>
                  }
                />

                {/* Shared User Routes */}
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <EmployeeProfilePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <RequireAuth>
                      <AttendancePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/leaves"
                  element={
                    <RequireAuth>
                      <LeavePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/payroll"
                  element={
                    <RequireAuth>
                      <PayrollPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <RequireAuth>
                      <NotificationsPage />
                    </RequireAuth>
                  }
                />
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
