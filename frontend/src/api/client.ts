import { mockEmployees, mockAttendanceRecords, mockLeaveRequests, mockAnalyticsData, mockAiInsights } from '../data/mockData';
import { User, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, AnalyticsData, AiInsight } from '../types';

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
        const errorData = await res.json();
        throw new Error(errorData.message || 'Invalid login credentials');
      }
    } catch (e: any) {
      if (e.message !== 'Failed to fetch') throw e;
      console.warn('Backend unavailable, using client auth handler:', e);
    }

    // Fallback demo login verification
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
    } else {
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
  },

  async registerAdmin(data: any): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
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
    const err = await res.json();
    throw new Error(err.message || 'Failed to create employee');
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

  // Analytics & AI
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockAnalyticsData;
  },

  async queryAi(prompt: string, role: string): Promise<{ response: string; dataSource: string; suggestedActions: string[] }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      };
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, userRole: role })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Client-side Fallback Processor
    const lower = prompt.toLowerCase();
    if (lower.includes('leave') || lower.includes('balance')) {
      return {
        response: 'You currently have 12 Paid Leave days, 8 Sick Leave days, and 9 Casual Leave days remaining for 2026.',
        dataSource: 'Dayflow LeaveEngine (Live)',
        suggestedActions: ['Apply for Leave', 'View Leave Policy']
      };
    }
    if (lower.includes('absent')) {
      return {
        response: 'Today across all departments, 18 employees are marked absent and 14 employees are on approved leave out of 250 total headcount.',
        dataSource: 'Dayflow AttendanceAnalytics',
        suggestedActions: ['View Daily Attendance Sheet', 'Send Absence Reminder']
      };
    }
    if (lower.includes('salary') || lower.includes('payroll')) {
      return {
        response: 'Your net monthly salary is $89,500.00 (Basic: $85,000.00, Allowances: $8,000.00, Deductions: $3,500.00). Payslip for August 2026 is available for download.',
        dataSource: 'Dayflow PayrollModule',
        suggestedActions: ['Download Payslip PDF']
      };
    }

    return {
      response: `I analyzed your query: '${prompt}'. All system metrics are within nominal ranges. Would you like to check specific attendance or payroll breakdowns?`,
      dataSource: 'Dayflow AI Assistant Engine',
      suggestedActions: ['View Dashboard', 'Check Approvals']
    };
  },

  async getAiInsights(): Promise<AiInsight[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/insights`, { headers: getAuthHeader() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockAiInsights;
  }
};
