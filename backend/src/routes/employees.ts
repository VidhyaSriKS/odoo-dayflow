import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        user: true
      }
    });

    // Map to frontend expected format
    const mapped = employees.map(emp => ({
      id: emp.id,
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      fullName: emp.user?.fullName || `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      departmentName: emp.department?.name,
      designation: emp.designation,
      employmentStatus: emp.employmentStatus,
      basicSalary: emp.basicSalary,
      allowances: emp.allowances,
      deductions: emp.deductions,
      netSalary: emp.basicSalary + emp.allowances - emp.deductions,
      phone: emp.phone,
      joiningDate: emp.joiningDate
    }));

    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { firstName, lastName, email, departmentName, designation, basicSalary } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const generatedPassword = 'pass' + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const employeeCode = 'EMP' + Math.floor(1000 + Math.random() * 9000);

    let departmentId = null;
    if (departmentName) {
      const dept = await prisma.department.upsert({
        where: { name: departmentName },
        update: {},
        create: { name: departmentName }
      });
      departmentId = dept.id;
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName: `${firstName} ${lastName}`,
        role: 'ROLE_EMPLOYEE',
        employee: {
          create: {
            employeeCode,
            firstName,
            lastName,
            email,
            departmentId,
            designation,
            basicSalary: Number(basicSalary) || 50000,
            joiningDate: new Date()
          }
        }
      },
      include: {
        employee: true
      }
    });

    res.json({
      id: user.employee?.id,
      employeeCode: user.employee?.employeeCode,
      firstName: user.employee?.firstName,
      lastName: user.employee?.lastName,
      fullName: user.fullName,
      email: user.employee?.email,
      departmentName: departmentName,
      designation: user.employee?.designation,
      employmentStatus: user.employee?.employmentStatus,
      basicSalary: user.employee?.basicSalary,
      allowances: user.employee?.allowances,
      deductions: user.employee?.deductions,
      netSalary: (user.employee?.basicSalary || 0) + (user.employee?.allowances || 0) - (user.employee?.deductions || 0),
      phone: user.employee?.phone,
      joiningDate: user.employee?.joiningDate,
      generatedPassword
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
