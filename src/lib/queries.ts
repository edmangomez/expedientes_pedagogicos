import { prisma } from "@/lib/prisma";
import { ensureScheduledBackup, getBackupSchedule, listBackups } from "@/lib/backup";

export async function getStudents() {
  return prisma.student.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          pedagogicalPlans: true,
          progressRecords: true,
        },
      },
    },
  });
}

export async function getRecentStudents(limit = 5) {
  return prisma.student.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getStudentById(id: string) {
  return prisma.student.findFirst({
    where: { id, deletedAt: null },
    include: {
      diagnosticEvaluation: true,
      behaviorEvaluation: true,
      inattentionEvaluation: true,
      mathEvaluation: true,
      pedagogicalPlans: {
        orderBy: [{ partial: "asc" }, { updatedAt: "desc" }],
        include: { attachments: true },
      },
      progressRecords: {
        orderBy: [{ partial: "asc" }, { updatedAt: "desc" }],
      },
      attachments: true,
    },
  });
}

export async function getDashboardStats() {
  const [total, complete, inProcess, pendingPlans, recent] = await Promise.all([
    prisma.student.count({ where: { deletedAt: null } }),
    prisma.student.count({ where: { deletedAt: null, status: "COMPLETE" } }),
    prisma.student.count({ where: { deletedAt: null, status: "IN_PROCESS" } }),
    prisma.student.count({ where: { deletedAt: null, status: "PENDING_PLANS" } }),
    getRecentStudents(6),
  ]);

  return { total, complete, inProcess, pendingPlans, recent };
}

export async function getUserCount() {
  return prisma.user.count();
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { sessions: true },
      },
    },
  });
}

export async function getBackupAdminData() {
  await ensureScheduledBackup();
  const [backups, schedule] = await Promise.all([listBackups(), getBackupSchedule()]);
  return { backups, schedule };
}
