import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, AnalyticsData } from '../types';

export const mockEmployees: Employee[] = [
  {
    id: 1,
    employeeCode: 'EMP1001',
    firstName: 'Admin',
    lastName: 'HR',
    fullName: 'Admin HR',
    email: 'admin@dayflow.com',
    phone: '+1 (555) 019-2831',
    address: '100 HR Way, Silicon Valley, CA',
    departmentName: 'Human Resources',
    designation: 'HR Director',
    joiningDate: '2023-01-15',
    employmentStatus: 'ACTIVE',
    basicSalary: 95000,
    allowances: 12000,
    deductions: 5000,
    netSalary: 102000
  },
  {
    id: 2,
    employeeCode: 'EMP1002',
    firstName: 'Alex',
    lastName: 'Taylor',
    fullName: 'Alex Taylor',
    email: 'employee@dayflow.com',
    phone: '+1 (555) 014-9281',
    address: '404 Innovation Drive, Austin, TX',
    departmentName: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2023-06-01',
    employmentStatus: 'ACTIVE',
    basicSalary: 85000,
    allowances: 8000,
    deductions: 3500,
    netSalary: 89500
  },
  {
    id: 3,
    employeeCode: 'EMP1003',
    firstName: 'Sarah',
    lastName: 'Connor',
    fullName: 'Sarah Connor',
    email: 'sarah.connor@dayflow.com',
    phone: '+1 (555) 018-3729',
    address: '77 Tech Boulevard, Seattle, WA',
    departmentName: 'Engineering',
    designation: 'Engineering Manager',
    joiningDate: '2022-11-10',
    employmentStatus: 'ACTIVE',
    basicSalary: 110000,
    allowances: 15000,
    deductions: 6000,
    netSalary: 119000
  },
  {
    id: 4,
    employeeCode: 'EMP1004',
    firstName: 'Michael',
    lastName: 'Scott',
    fullName: 'Michael Scott',
    email: 'michael.scott@dayflow.com',
    phone: '+1 (555) 012-4820',
    address: '172 Scranton Lane, Scranton, PA',
    departmentName: 'Finance',
    designation: 'Financial Analyst',
    joiningDate: '2024-02-01',
    employmentStatus: 'ACTIVE',
    basicSalary: 65000,
    allowances: 6000,
    deductions: 2500,
    netSalary: 68500
  },
  {
    id: 5,
    employeeCode: 'EMP1005',
    firstName: 'Elena',
    lastName: 'Rostova',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@dayflow.com',
    phone: '+1 (555) 016-9382',
    address: '89 Brand Avenue, New York, NY',
    departmentName: 'Marketing',
    designation: 'Head of Marketing',
    joiningDate: '2023-09-15',
    employmentStatus: 'ACTIVE',
    basicSalary: 90000,
    allowances: 10000,
    deductions: 4000,
    netSalary: 96000
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 1, employeeId: 2, employeeName: 'Alex Taylor', employeeCode: 'EMP1002', departmentName: 'Engineering', date: '2026-08-22', checkInTime: '2026-08-22T09:02:00', checkOutTime: '2026-08-22T17:34:00', workingHours: 8.5, status: 'PRESENT' },
  { id: 2, employeeId: 3, employeeName: 'Sarah Connor', employeeCode: 'EMP1003', departmentName: 'Engineering', date: '2026-08-22', checkInTime: '2026-08-22T08:55:00', checkOutTime: '2026-08-22T18:00:00', workingHours: 9.0, status: 'PRESENT' },
  { id: 3, employeeId: 4, employeeName: 'Michael Scott', employeeCode: 'EMP1004', departmentName: 'Finance', date: '2026-08-22', status: 'ABSENT' },
  { id: 4, employeeId: 5, employeeName: 'Elena Rostova', employeeCode: 'EMP1005', departmentName: 'Marketing', date: '2026-08-22', status: 'LEAVE', notes: 'Approved Annual Leave' }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 101,
    employeeId: 2,
    employeeName: 'Alex Taylor',
    employeeCode: 'EMP1002',
    departmentName: 'Engineering',
    leaveType: 'SICK',
    startDate: '2026-08-23',
    endDate: '2026-08-24',
    totalDays: 2,
    reason: 'Fever and rest recommended by doctor.',
    status: 'PENDING',
    createdAt: '2026-08-22T08:30:00'
  },
  {
    id: 102,
    employeeId: 3,
    employeeName: 'Sarah Connor',
    employeeCode: 'EMP1003',
    departmentName: 'Engineering',
    leaveType: 'PAID',
    startDate: '2026-08-15',
    endDate: '2026-08-16',
    totalDays: 2,
    reason: 'Family annual vacation.',
    status: 'APPROVED',
    hrComment: 'Approved by HR Director',
    approvedBy: 'admin@dayflow.com',
    createdAt: '2026-08-10T10:15:00'
  }
];

export const mockAnalyticsData: AnalyticsData = {
  totalEmployees: 250,
  presentToday: 218,
  absentToday: 18,
  onLeaveToday: 14,
  pendingLeaveRequests: 12,
  attendanceRate: 87.2,
  totalMonthlyPayroll: 1845000,
  attendanceTrend: [
    { month: 'Mar', rate: 91.2 },
    { month: 'Apr', rate: 93.4 },
    { month: 'May', rate: 89.6 },
    { month: 'Jun', rate: 94.8 },
    { month: 'Jul', rate: 92.1 },
    { month: 'Aug', rate: 87.2 }
  ],
  departmentDistribution: [
    { name: 'Engineering', value: 85 },
    { name: 'Human Resources', value: 25 },
    { name: 'Finance', value: 40 },
    { name: 'Marketing', value: 50 },
    { name: 'Operations', value: 50 }
  ],
  leaveTrends: [
    { type: 'Paid', count: 45 },
    { type: 'Sick', count: 28 },
    { type: 'Casual', count: 19 },
    { type: 'Unpaid', count: 12 }
  ]
};
