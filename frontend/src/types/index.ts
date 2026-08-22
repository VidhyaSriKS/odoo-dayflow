export type UserRole = 'ROLE_EMPLOYEE' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  employeeId?: number;
  employeeCode?: string;
  token?: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  userId?: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  departmentId?: number;
  departmentName?: string;
  designation: string;
  joiningDate: string;
  employmentStatus: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  profilePhotoUrl?: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  leaveType: 'PAID' | 'SICK' | 'UNPAID' | 'CASUAL';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hrComment?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface LeaveBalance {
  paidLeaveBalance: number;
  sickLeaveBalance: number;
  casualLeaveBalance: number;
}

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  designation?: string;
  payPeriodMonth: number;
  payPeriodYear: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PROCESSING';
  paymentDate?: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  attendanceRate: number;
  totalMonthlyPayroll: number;
  attendanceTrend: { month: string; rate: number }[];
  departmentDistribution: { name: string; value: number }[];
  leaveTrends: { type: string; count: number }[];
}

export interface AiInsight {
  id: string;
  severity: 'WARNING' | 'INFO' | 'ALERT';
  employee_code: string;
  employee_name: string;
  department: string;
  attendance_rate: string;
  issue: string;
  pattern_details: string;
  recommendation: string;
}
