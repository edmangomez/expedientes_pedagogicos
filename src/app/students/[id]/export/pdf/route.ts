import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { generateExpedientPdf, pdfFileName } from "@/lib/expedient-pdf";
import { getStudentById } from "@/lib/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) notFound();

  const pdf = generateExpedientPdf(student);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFileName(student.fullName)}"`,
      "Cache-Control": "no-store",
    },
  });
}
