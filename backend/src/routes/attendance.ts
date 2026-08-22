import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.post('/check-in', async (req, res) => {
  const { employeeId } = req.query;
  
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: Number(employeeId),
          date: today
        }
      },
      update: {
        checkInTime: new Date(),
        status: 'PRESENT'
      },
      create: {
        employeeId: Number(employeeId),
        date: today,
        checkInTime: new Date(),
        status: 'PRESENT'
      },
      include: {
        employee: {
          include: { user: true }
        }
      }
    });

    res.json({
      id: attendance.id,
      employeeId: attendance.employeeId,
      employeeName: attendance.employee.user?.fullName || attendance.employee.firstName,
      date: attendance.date.toISOString().split('T')[0],
      checkInTime: attendance.checkInTime?.toISOString(),
      status: attendance.status,
      workingHours: attendance.workingHours
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/check-out', async (req, res) => {
  const { employeeId } = req.query;
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: Number(employeeId),
          date: today
        }
      }
    });

    if (!existing || !existing.checkInTime) {
      return res.status(400).json({ success: false, message: 'Not checked in' });
    }

    const checkOut = new Date();
    const hours = (checkOut.getTime() - existing.checkInTime.getTime()) / (1000 * 60 * 60);

    const attendance = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOutTime: checkOut,
        workingHours: hours
      },
      include: {
        employee: { include: { user: true } }
      }
    });

    res.json({
      id: attendance.id,
      employeeId: attendance.employeeId,
      employeeName: attendance.employee.user?.fullName || attendance.employee.firstName,
      date: attendance.date.toISOString().split('T')[0],
      checkInTime: attendance.checkInTime?.toISOString(),
      checkOutTime: attendance.checkOutTime?.toISOString(),
      status: attendance.status,
      workingHours: attendance.workingHours
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
