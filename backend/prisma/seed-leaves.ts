import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding leave requests...');

  // Get employees Alex Taylor and Michael Scott
  const alex = await prisma.employee.findFirst({ where: { employeeCode: 'EMP1002' } });
  const michael = await prisma.employee.findFirst({ where: { employeeCode: 'EMP1004' } });

  if (alex) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: alex.id,
        leaveType: 'SICK',
        startDate: new Date('2026-08-23'),
        endDate: new Date('2026-08-24'),
        totalDays: 2,
        reason: 'Down with the flu, doctor advised rest.',
        status: 'PENDING'
      }
    });
  }

  if (michael) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: michael.id,
        leaveType: 'PAID',
        startDate: new Date('2026-08-28'),
        endDate: new Date('2026-08-28'),
        totalDays: 1,
        reason: 'Personal errands to attend to.',
        status: 'PENDING'
      }
    });
  }

  // Add an approved leave for Sarah Connor just so there's history
  const sarah = await prisma.employee.findFirst({ where: { employeeCode: 'EMP1003' } });
  if (sarah) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: sarah.id,
        leaveType: 'CASUAL',
        startDate: new Date('2026-08-10'),
        endDate: new Date('2026-08-11'),
        totalDays: 2,
        reason: 'Family event out of town.',
        status: 'APPROVED',
        hrComment: 'Approved, have a good time.',
        approvedBy: 'Admin HR'
      }
    });
  }

  console.log('Leave requests seeded successfully.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
