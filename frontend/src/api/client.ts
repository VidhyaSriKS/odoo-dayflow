import { mockEmployees, mockAttendanceRecords, mockLeaveRequests, mockAnalyticsData } from '../data/mockData';
import { User, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, AnalyticsData } from '../types';

const API_BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const userStr = localStorage.getItem('dayflow_user');
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    return user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
  } catch (e) {
    return {};
  }
}

// Local mock database for offline demo
function getMockUsers(): any[] {
  const users = localStorage.getItem('dayflow_mock_users');
  return users ? JSON.parse(users) : [];
}

function saveMockUser(user: any) {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('dayflow_mock_users', JSON.stringify(users));
}

export const apiClient = {
  // Auth
  async login(loginIdOrEmail: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginIdOrEmail, password })
      });
      if (res.ok) {
        const data = await res.json();
        return {
          id: data.id,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          employeeId: data.employeeId,
          employeeCode: data.employeeCode,
          token: data.token
        };
      } else {
        const text = await res.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Invalid login credentials');
        } catch (e) {
          throw new Error('Backend error: ' + res.status);
        }
      }
    } catch (e: any) {
      console.warn('Backend unavailable, using client auth handler:', e);
    }

    // Fallback demo login verification
    const mockUsers = getMockUsers();
    const foundUser = mockUsers.find(u => 
      u.email.toLowerCase() === loginIdOrEmail.toLowerCase() || 
      (u.employeeCode && u.employeeCode.toLowerCase() === loginIdOrEmail.toLowerCase())
    );

    if (foundUser && foundUser.password === password) {
      return foundUser;
    }

    if (loginIdOrEmail.toLowerCase().includes('admin')) {
      return {
        id: 1,
        email: 'admin@dayflow.com',
        fullName: 'Admin HR',
        role: 'ROLE_ADMIN',
        employeeId: 1,
        employeeCode: 'EMP1001',
        token: 'demo-jwt-token-admin'
      };
    } else if (loginIdOrEmail.toLowerCase().includes('employee') || loginIdOrEmail.toLowerCase().includes('emp')) {
      return {
        id: 2,
        email: 'employee@dayflow.com',
        fullName: 'Alex Taylor',
        role: 'ROLE_EMPLOYEE',
        employeeId: 2,
        employeeCode: 'EMP1002',
        token: 'demo-jwt-token-employee'
      };
    }
    
    throw new Error('Invalid login credentials');
  },

  async registerAdmin(data: any): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return await res.json();
      }
      const text = await res.text();
      try {
        const err = JSON.parse(text);
        throw new Error(err.message || 'Registration failed');
      } catch (e) {
        throw new Error('Backend error: ' + res.status);
      }
    } catch (e: any) {
      console.warn('Backend unavailable, using client fallback for register:', e);
      const mockAdmin: User = {
        id: Date.now(),
        email: data.email,
        fullName: data.fullName,
        role: 'ROLE_ADMIN',
        employeeId: Date.now(),
        employeeCode: 'ODJ' + new Date().getFullYear() + '0001',
        token: 'demo-jwt-token-admin'
      };
      saveMockUser(mockAdmin);
      return mockAdmin;
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to change password');
    }
  },

  // Employees
  async createEmployee(data: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return await res.json();
      }
      const text = await res.text();
      try {
        const err = JSON.parse(text);
        throw new Error(err.message || 'Failed to create employee');
      } catch (e) {
        throw new Error('Backend error: ' + res.status);
      }
    } catch (e: any) {
      console.warn('Backend unavailable, using client fallback for createEmployee:', e);
      const generatedCode = 'EMP' + Math.floor(1000 + Math.random() * 9000);
      const generatedPass = 'pass' + Math.floor(1000 + Math.random() * 9000);
      
      const newEmp = {
        id: Date.now(),
        employeeCode: generatedCode,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        departmentName: data.departmentName,
        designation: data.designation,
        employmentStatus: 'ACTIVE',
        basicSalary: data.basicSalary,
        generatedPassword: generatedPass
      };
      
      // Save for login
      saveMockUser({
        ...newEmp,
        role: 'ROLE_EMPLOYEE',
        password: generatedPass,
        token: 'demo-jwt-token-emp'
      });
      
      return newEmp;
    }
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockEmployees;
  },

  // Attendance
  async checkIn(employeeId: number): Promise<AttendanceRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-in?employeeId=${employeeId}`, {
        method: 'POST',
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    
    return {
      id: Date.now(),
      employeeId,
      employeeName: 'Alex Taylor',
      employeeCode: 'EMP1002',
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toISOString(),
      status: 'PRESENT',
      workingHours: 0
    };
  },

  async checkOut(employeeId: number): Promise<AttendanceRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out?employeeId=${employeeId}`, {
        method: 'POST',
        headers: getAuthHeader()
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      id: Date.now(),
      employeeId,
      employeeName: 'Alex Taylor',
      employeeCode: 'EMP1002',
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      checkOutTime: new Date().toISOString(),
      status: 'PRESENT',
      workingHours: 8.5
    };
  },

  // Leave
  async applyLeave(employeeId: number, leaveData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      };
      const res = await fetch(`${API_BASE_URL}/leaves?employeeId=${employeeId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leaveData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      id: Date.now(),
      employeeId,
      employeeName: 'Alex Taylor',
      employeeCode: 'EMP1002',
      leaveType: leaveData.leaveType || 'PAID',
      startDate: leaveData.startDate || new Date().toISOString().split('T')[0],
      endDate: leaveData.endDate || new Date().toISOString().split('T')[0],
      totalDays: leaveData.totalDays || 1,
      reason: leaveData.reason || 'Medical / Personal Leave',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  },

  async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockLeaveRequests;
  },

  async getMyLeaves(employeeId: number): Promise<LeaveRequest[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves/me?employeeId=${employeeId}`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockLeaveRequests.filter(l => l.employeeId === employeeId);
  },

  async getLeaveBalance(employeeId: number): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves/balance?employeeId=${employeeId}`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      paidLeaveBalance: 24,
      sickLeaveBalance: 7,
      casualLeaveBalance: 10,
      year: 2026
    };
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockAnalyticsData;
  }
};
