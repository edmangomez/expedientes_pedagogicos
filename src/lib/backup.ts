import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const backupVersion = 1;
const backupRoot = path.join(process.cwd(), "storage", "backups");
const databasePath = path.join(process.cwd(), "prisma", "dev.db");
const uploadsRoot = path.join(process.cwd(), "public", "uploads");
const scheduleId = "default";

type BackupPayload = {
  version: number;
  createdAt: string;
  reason: "manual" | "scheduled";
  database: {
    path: string;
    base64: string;
  };
  uploads: Array<{
    path: string;
    base64: string;
  }>;
};

export type BackupInfo = {
  fileName: string;
  createdAt: Date;
  reason: string;
  size: number;
  uploadCount: number;
};

export type BackupScheduleInfo = {
  enabled: boolean;
  frequency: string;
  timeOfDay: string;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
};

export async function createBackup(reason: "manual" | "scheduled" = "manual") {
  await mkdir(backupRoot, { recursive: true });
  const createdAt = new Date();
  const payload: BackupPayload = {
    version: backupVersion,
    createdAt: createdAt.toISOString(),
    reason,
    database: {
      path: "prisma/dev.db",
      base64: (await readFile(databasePath)).toString("base64"),
    },
    uploads: await readUploads(),
  };

  const safeStamp = createdAt.toISOString().replace(/[:.]/g, "-");
  const fileName = `expedientes-${safeStamp}-${randomUUID().slice(0, 8)}.backup.json`;
  await writeFile(path.join(backupRoot, fileName), JSON.stringify(payload, null, 2), "utf8");

  return fileName;
}

export async function listBackups(): Promise<BackupInfo[]> {
  await mkdir(backupRoot, { recursive: true });
  const entries = await readdir(backupRoot, { withFileTypes: true });
  const backups = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".backup.json"))
      .map(async (entry) => {
        const filePath = path.join(backupRoot, entry.name);
        const [fileStat, raw] = await Promise.all([stat(filePath), readFile(filePath, "utf8")]);
        const payload = JSON.parse(raw) as BackupPayload;

        return {
          fileName: entry.name,
          createdAt: new Date(payload.createdAt),
          reason: payload.reason,
          size: fileStat.size,
          uploadCount: payload.uploads?.length ?? 0,
        };
      }),
  );

  return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function restoreBackup(fileName: string) {
  const filePath = resolveBackupFile(fileName);
  const payload = JSON.parse(await readFile(filePath, "utf8")) as BackupPayload;
  if (payload.version !== backupVersion || !payload.database?.base64 || !Array.isArray(payload.uploads)) {
    throw new Error("El archivo de backup no es compatible.");
  }

  await mkdir(path.dirname(databasePath), { recursive: true });
  await writeFile(databasePath, Buffer.from(payload.database.base64, "base64"));

  await rm(uploadsRoot, { recursive: true, force: true });
  await mkdir(uploadsRoot, { recursive: true });
  for (const file of payload.uploads) {
    const target = resolveUploadPath(file.path);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, Buffer.from(file.base64, "base64"));
  }
}

export async function deleteBackup(fileName: string) {
  await rm(resolveBackupFile(fileName), { force: true });
}

export async function readBackupForDownload(fileName: string) {
  const filePath = resolveBackupFile(fileName);
  return {
    fileName,
    bytes: await readFile(filePath),
  };
}

export async function getBackupSchedule(): Promise<BackupScheduleInfo> {
  const schedule = await prisma.backupSchedule.findUnique({ where: { id: scheduleId } });
  return {
    enabled: schedule?.enabled ?? false,
    frequency: schedule?.frequency ?? "DAILY",
    timeOfDay: schedule?.timeOfDay ?? "17:00",
    lastRunAt: schedule?.lastRunAt ?? null,
    nextRunAt: schedule?.nextRunAt ?? null,
  };
}

export async function updateBackupSchedule(data: { enabled: boolean; frequency: string; timeOfDay: string }) {
  const nextRunAt = data.enabled ? calculateNextRun(data.frequency, data.timeOfDay) : null;
  await prisma.backupSchedule.upsert({
    where: { id: scheduleId },
    create: { id: scheduleId, ...data, nextRunAt },
    update: { ...data, nextRunAt },
  });
}

export async function ensureScheduledBackup() {
  const schedule = await prisma.backupSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule?.enabled || !schedule.nextRunAt || schedule.nextRunAt > new Date()) return;

  await createBackup("scheduled");
  await prisma.backupSchedule.update({
    where: { id: scheduleId },
    data: {
      lastRunAt: new Date(),
      nextRunAt: calculateNextRun(schedule.frequency, schedule.timeOfDay),
    },
  });
}

export function calculateNextRun(frequency: string, timeOfDay: string, from = new Date()) {
  const [hours = "17", minutes = "00"] = timeOfDay.split(":");
  const next = new Date(from);
  next.setHours(Number(hours), Number(minutes), 0, 0);

  if (next <= from) {
    if (frequency === "WEEKLY") next.setDate(next.getDate() + 7);
    else if (frequency === "MONTHLY") next.setMonth(next.getMonth() + 1);
    else next.setDate(next.getDate() + 1);
  }

  return next;
}

async function readUploads() {
  const exists = await stat(uploadsRoot).then((value) => value.isDirectory()).catch(() => false);
  if (!exists) return [];

  const files = await collectFiles(uploadsRoot);
  return Promise.all(
    files.map(async (filePath) => ({
      path: path.relative(uploadsRoot, filePath).replace(/\\/g, "/"),
      base64: (await readFile(filePath)).toString("base64"),
    })),
  );
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectFiles(fullPath);
      if (entry.isFile()) return [fullPath];
      return [];
    }),
  );

  return files.flat();
}

function resolveBackupFile(fileName: string) {
  const resolved = path.resolve(backupRoot, fileName);
  if (!resolved.startsWith(path.resolve(backupRoot)) || !fileName.endsWith(".backup.json")) {
    throw new Error("Backup invalido.");
  }
  return resolved;
}

function resolveUploadPath(relativePath: string) {
  const resolved = path.resolve(uploadsRoot, relativePath);
  if (!resolved.startsWith(path.resolve(uploadsRoot))) {
    throw new Error("Ruta de archivo invalida.");
  }
  return resolved;
}
