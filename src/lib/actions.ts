"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  behaviorSchema,
  diagnosticSchema,
  inattentionSchema,
  mathSchema,
  planSchema,
  progressSchema,
  studentSchema,
} from "@/lib/validations";
import { calculateChronologicalAge } from "@/lib/utils";

const uploadDir = path.join(process.cwd(), "public", "uploads", "plans");
const maxUploadSize = 10 * 1024 * 1024;
const allowedUploadTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function readForm(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function validate<T>(schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } }, value: unknown) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new Error("Revisa los campos obligatorios del formulario.");
  }
  return parsed.data;
}

export async function createStudentAction(formData: FormData) {
  const data = validate(studentSchema, readForm(formData));
  const student = await prisma.student.create({
    data: {
      ...data,
      chronologicalAge: data.chronologicalAge || calculateChronologicalAge(data.birthDate),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/students");
  redirect(`/students/${student.id}?saved=created`);
}

export async function updateStudentAction(studentId: string, formData: FormData) {
  const data = validate(studentSchema, readForm(formData));
  await prisma.student.update({
    where: { id: studentId },
    data: {
      ...data,
      chronologicalAge: data.chronologicalAge || calculateChronologicalAge(data.birthDate),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=general`);
}

export async function deleteStudentAction(studentId: string) {
  await prisma.student.update({
    where: { id: studentId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/students");
  redirect("/students?deleted=1");
}

export async function updateDiagnosticAction(studentId: string, formData: FormData) {
  const data = validate(diagnosticSchema, readForm(formData));
  await prisma.diagnosticEvaluation.upsert({
    where: { studentId },
    create: { studentId, ...data },
    update: data,
  });

  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=diagnostic#diagnostico`);
}

export async function updateBehaviorAction(studentId: string, formData: FormData) {
  const data = validate(behaviorSchema, readForm(formData));
  await prisma.behaviorEvaluation.upsert({
    where: { studentId },
    create: { studentId, ...data },
    update: data,
  });

  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=behavior#conducta`);
}

export async function updateInattentionAction(studentId: string, formData: FormData) {
  const data = validate(inattentionSchema, readForm(formData));
  await prisma.inattentionEvaluation.upsert({
    where: { studentId },
    create: { studentId, ...data },
    update: data,
  });

  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=inattention#inatencion`);
}

export async function updateMathAction(studentId: string, formData: FormData) {
  const data = validate(mathSchema, readForm(formData));
  await prisma.mathEvaluation.upsert({
    where: { studentId },
    create: { studentId, ...data },
    update: data,
  });

  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=math#matematicas`);
}

export async function createPlanAction(studentId: string, formData: FormData) {
  const uploadedFile = formData.get("attachmentFile");
  const attachment = uploadedFile instanceof File && uploadedFile.size > 0 ? await savePlanAttachment(uploadedFile) : null;
  const data = validate(planSchema, readForm(formData));

  await prisma.pedagogicalPlan.create({
    data: {
      studentId,
      ...data,
      attachments:
        attachment
          ? {
              create: {
                studentId,
                fileName: attachment.fileName,
                fileType: attachment.fileType,
                fileUrl: attachment.fileUrl,
              },
            }
          : undefined,
    },
  });

  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=plan#planes`);
}

export async function deletePlanAction(studentId: string, planId: string) {
  const plan = await prisma.pedagogicalPlan.findUnique({
    where: { id: planId },
    include: { attachments: true },
  });

  await prisma.pedagogicalPlan.delete({ where: { id: planId } });
  await Promise.all(plan?.attachments.map((attachment) => deleteStoredAttachment(attachment.fileUrl)) ?? []);
  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?deleted=plan#planes`);
}

export async function deleteAttachmentAction(studentId: string, attachmentId: string) {
  const attachment = await prisma.attachment.delete({ where: { id: attachmentId } });
  await deleteStoredAttachment(attachment.fileUrl);
  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?deleted=attachment#planes`);
}

export async function createProgressAction(studentId: string, formData: FormData) {
  const data = validate(progressSchema, readForm(formData));
  await prisma.progressRecord.create({
    data: { studentId, ...data },
  });

  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?saved=progress#avances`);
}

export async function deleteProgressAction(studentId: string, progressId: string) {
  await prisma.progressRecord.delete({ where: { id: progressId } });
  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?deleted=progress#avances`);
}

async function touchStudent(studentId: string) {
  await prisma.student.update({
    where: { id: studentId },
    data: { updatedAt: new Date() },
  });
}

async function savePlanAttachment(file: File) {
  if (file.size > maxUploadSize) {
    throw new Error("El archivo no puede superar 10 MB.");
  }

  if (file.type && !allowedUploadTypes.has(file.type)) {
    throw new Error("Solo se permiten PDF, Word e imagenes JPG, PNG o WebP.");
  }

  await mkdir(uploadDir, { recursive: true });
  const originalName = sanitizeFileName(file.name || "documento");
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  const storedName = `${baseName}-${randomUUID()}${extension}`.toLowerCase();
  const filePath = path.join(uploadDir, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    fileName: originalName,
    fileType: file.type || "Archivo",
    fileUrl: `/uploads/plans/${storedName}`,
  };
}

async function deleteStoredAttachment(fileUrl: string) {
  if (!fileUrl.startsWith("/uploads/plans/")) return;

  const filePath = path.join(process.cwd(), "public", fileUrl);
  const resolved = path.resolve(filePath);
  const allowedRoot = path.resolve(uploadDir);

  if (!resolved.startsWith(allowedRoot)) return;
  await unlink(resolved).catch(() => undefined);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "documento";
}
