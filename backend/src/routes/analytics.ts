import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/dashboard', async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count({
      where: { employmentStatus: 'ACTIVE' }
    });

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presentToday = await prisma.attendance.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: 'PRESENT'
      }
    });

    const absentToday = await prisma.attendance.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: 'ABSENT'
      }
    });

    const pendingLeaveRequests = await prisma.leaveRequest.count({
      where: { status: 'PENDING' }
    });

    const attendanceRate = totalEmployees > 0 
      ? Math.round((presentToday / totalEmployees) * 100) 
      : 0;

    res.json({
      totalEmployees,
      presentToday,
      absentToday,
      onLeaveToday: 0, // Simplified for now
      pendingLeaveRequests,
      attendanceRate,
      totalMonthlyPayroll: totalEmployees * 5000,
      attendanceTrend: [
        { month: 'Jan', rate: 92 },
        { month: 'Feb', rate: 94 },
        { month: 'Mar', rate: 91 },
        { month: 'Apr', rate: 95 },
        { month: 'May', rate: 93 },
        { month: 'Jun', rate: attendanceRate }
      ],
      departmentDistribution: [
        { name: 'Engineering', value: await prisma.employee.count({ where: { department: { name: 'Engineering' } } }) },
        { name: 'Sales', value: await prisma.employee.count({ where: { department: { name: 'Sales' } } }) },
        { name: 'Marketing', value: await prisma.employee.count({ where: { department: { name: 'Marketing' } } }) },
        { name: 'HR', value: await prisma.employee.count({ where: { department: { name: 'Human Resources' } } }) }
      ],
      leaveTrends: [
        { type: 'Sick', count: 12 },
        { type: 'Casual', count: 8 },
        { type: 'Paid', count: 15 }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
