"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  behaviorSchema,
  diagnosticSchema,
  inattentionSchema,
  planSchema,
  progressSchema,
  studentSchema,
} from "@/lib/validations";
import { calculateChronologicalAge } from "@/lib/utils";

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

export async function createPlanAction(studentId: string, formData: FormData) {
  const { attachmentName, attachmentType, attachmentUrl, ...data } = validate(planSchema, readForm(formData));
  await prisma.pedagogicalPlan.create({
    data: {
      studentId,
      ...data,
      attachments:
        attachmentName && attachmentUrl
          ? {
              create: {
                studentId,
                fileName: attachmentName,
                fileType: attachmentType ?? "Archivo",
                fileUrl: attachmentUrl,
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
  await prisma.pedagogicalPlan.delete({ where: { id: planId } });
  await touchStudent(studentId);
  revalidatePath(`/students/${studentId}`);
  redirect(`/students/${studentId}?deleted=plan#planes`);
}

export async function deleteAttachmentAction(studentId: string, attachmentId: string) {
  await prisma.attachment.delete({ where: { id: attachmentId } });
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
