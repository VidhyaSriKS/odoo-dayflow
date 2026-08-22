import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        employee: {
          include: { user: true, department: true }
        }
      }
    });

    const mapped = leaves.map(l => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employee.user?.fullName || l.employee.firstName,
      employeeCode: l.employee.employeeCode,
      departmentName: l.employee.department?.name,
      leaveType: l.leaveType,
      startDate: l.startDate.toISOString().split('T')[0],
      endDate: l.endDate.toISOString().split('T')[0],
      totalDays: l.totalDays,
      reason: l.reason,
      status: l.status,
      hrComment: l.hrComment,
      approvedBy: l.approvedBy,
      createdAt: l.createdAt.toISOString()
    }));

    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { employeeId } = req.query;
  const { leaveType, startDate, endDate, totalDays, reason } = req.body;
  
  try {
    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: Number(employeeId),
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays: Number(totalDays),
        reason
      },
      include: {
        employee: { include: { user: true, department: true } }
      }
    });

    res.json({
      id: leave.id,
      employeeId: leave.employeeId,
      employeeName: leave.employee.user?.fullName || leave.employee.firstName,
      employeeCode: leave.employee.employeeCode,
      departmentName: leave.employee.department?.name,
      leaveType: leave.leaveType,
      startDate: leave.startDate.toISOString().split('T')[0],
      endDate: leave.endDate.toISOString().split('T')[0],
      totalDays: leave.totalDays,
      reason: leave.reason,
      status: leave.status,
      createdAt: leave.createdAt.toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
