import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'secret';

router.post('/login', async (req, res) => {
  const { loginIdOrEmail, password } = req.body;
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdOrEmail },
          { employee: { employeeCode: loginIdOrEmail } }
        ]
      },
      include: {
        employee: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });
    
    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      employeeId: user.employee?.id || user.id,
      employeeCode: user.employee?.employeeCode,
      token
    });
  } catch (err: any) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { companyName, companyLogo, fullName, email, phone, password } = req.body;
  
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employeeCode = 'ODJ' + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000);

    // Create User, Employee, and a default Department if they register a company
    const newDept = await prisma.department.upsert({
      where: { name: 'Headquarters' },
      update: {},
      create: { name: 'Headquarters', managerName: fullName }
    });

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        role: 'ROLE_ADMIN',
        employee: {
          create: {
            employeeCode,
            firstName: fullName.split(' ')[0] || '',
            lastName: fullName.split(' ')[1] || '',
            email,
            phone,
            departmentId: newDept.id,
            designation: 'Administrator',
            joiningDate: new Date(),
            basicSalary: 0
          }
        }
      },
      include: {
        employee: true
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      employeeId: user.employee?.id,
      employeeCode: user.employee?.employeeCode,
      token
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
