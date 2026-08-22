import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with full schema...');
  
  // Clear existing data (handled by Cascade if we delete users/departments, but to be safe)
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  // 1. Departments
  const deptEngineering = await prisma.department.create({ data: { id: 1, name: 'Engineering', description: 'Software engineering, DevOps, and cloud architecture', managerName: 'Sarah Connor', location: 'Building A, Floor 3' } });
  const deptHR = await prisma.department.create({ data: { id: 2, name: 'Human Resources', description: 'Talent acquisition, employee wellness, and payroll', managerName: 'Admin HR', location: 'Building B, Floor 1' } });
  const deptFinance = await prisma.department.create({ data: { id: 3, name: 'Finance', description: 'Financial planning, accounting, and audit', managerName: 'Robert Langdon', location: 'Building A, Floor 2' } });
  const deptMarketing = await prisma.department.create({ data: { id: 4, name: 'Marketing', description: 'Product marketing, brand strategy, and growth', managerName: 'Elena Rostova', location: 'Building C, Floor 4' } });
  const deptOperations = await prisma.department.create({ data: { id: 5, name: 'Operations', description: 'Business operations, logistics, and facilities', managerName: 'Marcus Vance', location: 'Building B, Floor 2' } });

  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
  const hashedEmpPassword = await bcrypt.hash('Employee@123', 10);

  // 2. Users & Employees
  
  // Admin HR
  const user1 = await prisma.user.create({ data: { id: 1, email: 'admin@dayflow.com', passwordHash: hashedAdminPassword, fullName: 'Dayflow Admin', role: 'ROLE_ADMIN' } });
  const emp1 = await prisma.employee.create({ data: { id: 1, employeeCode: 'EMP1001', userId: 1, firstName: 'Admin', lastName: 'HR', email: 'admin@dayflow.com', phone: '+1 (555) 019-2831', address: '100 HR Way, Silicon Valley, CA', departmentId: deptHR.id, designation: 'HR Director', joiningDate: new Date('2023-01-15'), employmentStatus: 'ACTIVE', basicSalary: 95000.00, allowances: 12000.00, deductions: 5000.00 } });

  // Sanjay Taylor
  const user2 = await prisma.user.create({ data: { id: 2, email: 'employee@dayflow.com', passwordHash: hashedEmpPassword, fullName: 'Alex Taylor', role: 'ROLE_EMPLOYEE' } });
  const emp2 = await prisma.employee.create({ data: { id: 2, employeeCode: 'EMP1002', userId: 2, firstName: 'Sanjay', lastName: 'Taylor', email: 'employee@dayflow.com', phone: '+1 (555) 014-9281', address: '404 Innovation Drive, Austin, TX', departmentId: deptEngineering.id, designation: 'Senior Software Engineer', joiningDate: new Date('2023-06-01'), employmentStatus: 'ACTIVE', basicSalary: 85000.00, allowances: 8000.00, deductions: 3500.00 } });

  // Sarah Connor
  const user3 = await prisma.user.create({ data: { id: 3, email: 'sarah.engineering@dayflow.com', passwordHash: hashedEmpPassword, fullName: 'Sarah Connor', role: 'ROLE_EMPLOYEE' } });
  const emp3 = await prisma.employee.create({ data: { id: 3, employeeCode: 'EMP1003', userId: 3, firstName: 'Sarah', lastName: 'Connor', email: 'sarah.engineering@dayflow.com', phone: '+1 (555) 018-3729', address: '77 Tech Boulevard, Seattle, WA', departmentId: deptEngineering.id, designation: 'Engineering Manager', joiningDate: new Date('2022-11-10'), employmentStatus: 'ACTIVE', basicSalary: 110000.00, allowances: 15000.00, deductions: 6000.00 } });

  // Michael Scott
  const user4 = await prisma.user.create({ data: { id: 4, email: 'michael.finance@dayflow.com', passwordHash: hashedEmpPassword, fullName: 'Michael Scott', role: 'ROLE_EMPLOYEE' } });
  const emp4 = await prisma.employee.create({ data: { id: 4, employeeCode: 'EMP1004', userId: 4, firstName: 'Michael', lastName: 'Scott', email: 'michael.finance@dayflow.com', phone: '+1 (555) 012-4820', address: '172 Scranton Lane, Scranton, PA', departmentId: deptFinance.id, designation: 'Financial Analyst', joiningDate: new Date('2024-02-01'), employmentStatus: 'ACTIVE', basicSalary: 65000.00, allowances: 6000.00, deductions: 2500.00 } });

  // Elena Rostova
  const user5 = await prisma.user.create({ data: { id: 5, email: 'elena.marketing@dayflow.com', passwordHash: hashedEmpPassword, fullName: 'Elena Rostova', role: 'ROLE_EMPLOYEE' } });
  const emp5 = await prisma.employee.create({ data: { id: 5, employeeCode: 'EMP1005', userId: 5, firstName: 'Elena', lastName: 'Rostova', email: 'elena.marketing@dayflow.com', phone: '+1 (555) 016-9382', address: '89 Brand Avenue, New York, NY', departmentId: deptMarketing.id, designation: 'Head of Marketing', joiningDate: new Date('2023-09-15'), employmentStatus: 'ACTIVE', basicSalary: 90000.00, allowances: 10000.00, deductions: 4000.00 } });

  // 3. Leave Balances
  await prisma.leaveBalance.create({ data: { employeeId: emp1.id, paidLeaveBalance: 20, sickLeaveBalance: 12, casualLeaveBalance: 10, year: 2026 } });
  await prisma.leaveBalance.create({ data: { employeeId: emp2.id, paidLeaveBalance: 12, sickLeaveBalance: 8, casualLeaveBalance: 9, year: 2026 } });
  await prisma.leaveBalance.create({ data: { employeeId: emp3.id, paidLeaveBalance: 18, sickLeaveBalance: 10, casualLeaveBalance: 8, year: 2026 } });
  await prisma.leaveBalance.create({ data: { employeeId: emp4.id, paidLeaveBalance: 15, sickLeaveBalance: 10, casualLeaveBalance: 10, year: 2026 } });
  await prisma.leaveBalance.create({ data: { employeeId: emp5.id, paidLeaveBalance: 14, sickLeaveBalance: 9, casualLeaveBalance: 7, year: 2026 } });

  // 4. Sample Attendance for Today (to show on dashboard)
  const today = new Date();
  today.setHours(0,0,0,0);
  
  await prisma.attendance.create({ data: { employeeId: emp2.id, date: today, checkInTime: new Date(today.getTime() + 9*60*60*1000), status: 'PRESENT' } });
  await prisma.attendance.create({ data: { employeeId: emp3.id, date: today, checkInTime: new Date(today.getTime() + 8.5*60*60*1000), status: 'PRESENT' } });
  await prisma.attendance.create({ data: { employeeId: emp4.id, date: today, status: 'ABSENT' } });
  await prisma.attendance.create({ data: { employeeId: emp5.id, date: today, checkInTime: new Date(today.getTime() + 9.5*60*60*1000), status: 'PRESENT' } });

  console.log('Seeding finished successfully.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
