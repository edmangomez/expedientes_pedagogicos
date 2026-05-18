import type { StudentWithRelations } from "@/types/student";
import { enumLabel, formatDate } from "@/lib/utils";

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 48;
const contentWidth = pageWidth - margin * 2;

type FontName = "regular" | "bold";

type PdfPage = {
  commands: string[];
};

class PdfBuilder {
  private pages: PdfPage[] = [];
  private current: PdfPage;
  private y = pageHeight - margin;

  constructor() {
    this.current = this.addPage();
  }

  heading(text: string, size = 18) {
    this.ensureSpace(size + 16);
    this.text(text, { size, font: "bold", gap: 8 });
  }

  subheading(text: string) {
    this.ensureSpace(30);
    this.text(text, { size: 13, font: "bold", gap: 6 });
    this.rule();
  }

  paragraph(label: string, value?: string | null) {
    const text = value?.trim() ? value : "Sin registro";
    this.text(`${label}: ${text}`, { size: 10.5, gap: 5 });
  }

  longText(label: string, value?: string | null) {
    const text = value?.trim() ? value : "Sin registro";
    this.text(label, { size: 10.5, font: "bold", gap: 4 });
    this.text(text, { size: 10, gap: 8 });
  }

  text(text: string, options: { size?: number; font?: FontName; gap?: number; indent?: number } = {}) {
    const size = options.size ?? 10;
    const font = options.font ?? "regular";
    const gap = options.gap ?? 4;
    const indent = options.indent ?? 0;
    const maxChars = Math.max(20, Math.floor((contentWidth - indent) / (size * 0.48)));
    const lines = wrapText(text, maxChars);

    for (const line of lines) {
      this.ensureSpace(size + gap);
      this.current.commands.push(
        `BT /${font === "bold" ? "F2" : "F1"} ${size.toFixed(2)} Tf ${margin + indent} ${this.y.toFixed(2)} Td (${escapePdfText(line)}) Tj ET`,
      );
      this.y -= size + gap;
    }
  }

  rule() {
    this.ensureSpace(10);
    this.current.commands.push(`0.78 0.75 0.70 RG 0.7 w ${margin} ${this.y.toFixed(2)} m ${pageWidth - margin} ${this.y.toFixed(2)} l S`);
    this.y -= 12;
  }

  spacer(size = 8) {
    this.ensureSpace(size);
    this.y -= size;
  }

  build() {
    return buildPdf(this.pages.map((page, index) => {
      const footer = `BT /F1 8 Tf ${pageWidth / 2 - 26} 28 Td (Pagina ${index + 1} de ${this.pages.length}) Tj ET`;
      return [...page.commands, footer].join("\n");
    }));
  }

  private ensureSpace(height: number) {
    if (this.y - height < margin) {
      this.current = this.addPage();
    }
  }

  private addPage() {
    const page = { commands: [] };
    this.pages.push(page);
    this.y = pageHeight - margin;
    return page;
  }
}

export function generateExpedientPdf(student: StudentWithRelations) {
  const pdf = new PdfBuilder();

  pdf.heading("Expediente Pedagogico", 22);
  pdf.text(student.fullName, { size: 16, font: "bold", gap: 8 });
  pdf.paragraph("Fecha de exportacion", formatDate(new Date()));
  pdf.paragraph("Estado", enumLabel(student.status));
  pdf.paragraph("Grado y seccion", student.gradeSection);
  pdf.paragraph("Diagnostico", student.diagnosis);
  pdf.paragraph("Ultima actualizacion", formatDate(student.updatedAt));
  pdf.spacer();

  pdf.subheading("Datos generales");
  pdf.paragraph("Nombre del estudiante", student.fullName);
  pdf.paragraph("Fecha de ingreso al aula", formatDate(student.admissionDate));
  pdf.paragraph("Fecha de nacimiento", formatDate(student.birthDate));
  pdf.paragraph("Edad cronologica", student.chronologicalAge);
  pdf.paragraph("Docente guia", student.teacherName);

  pdf.subheading("Evaluacion diagnostica - Lectoescritura");
  const diagnostic = student.diagnosticEvaluation;
  pdf.paragraph("Fecha de evaluacion", formatDate(diagnostic?.evaluationDate));
  pdf.paragraph("Evaluador", diagnostic?.evaluatorName);
  pdf.longText("Mayusculas, minusculas y grafemas", diagnostic?.uppercaseLowercaseGraphemeObservation);
  pdf.longText("Silabas simples", diagnostic?.simpleSyllablesObservation);
  pdf.longText("Silabas inversas", diagnostic?.inverseSyllablesObservation);
  pdf.longText("Silabas trabadas", diagnostic?.mixedSyllablesObservation);
  pdf.longText("Silabas compuestas", diagnostic?.compoundSyllablesObservation);
  pdf.longText("Palabras monosilabas", diagnostic?.monosyllabicWordsObservation);
  pdf.longText("Palabras bisilabas", diagnostic?.bisyllabicWordsObservation);
  pdf.longText("Palabras trisilabas", diagnostic?.trisyllabicWordsObservation);
  pdf.longText("Oraciones cortas", diagnostic?.shortSentencesObservation);
  pdf.longText("Oraciones largas", diagnostic?.longSentencesObservation);
  pdf.longText("Parrafos", diagnostic?.paragraphsObservation);
  pdf.longText("Cuentos cortos", diagnostic?.shortStoriesObservation);
  pdf.longText("Observaciones generales", diagnostic?.generalObservations);

  pdf.subheading("Conducta en evaluacion");
  const behavior = student.behaviorEvaluation;
  pdf.paragraph("Estado de conducta", behavior?.behaviorStatus ? enumLabel(behavior.behaviorStatus) : null);
  pdf.longText("Actitud durante la evaluacion", behavior?.attitudeObservation);
  pdf.longText("Colaboracion", behavior?.collaborationObservation);
  pdf.longText("Seguimiento de instrucciones", behavior?.instructionsObservation);
  pdf.longText("Tolerancia a la frustracion", behavior?.frustrationToleranceObservation);
  pdf.longText("Interaccion con docente", behavior?.teacherInteractionObservation);
  pdf.longText("Conducta relevante", behavior?.relevantBehaviorObservation);
  pdf.longText("Observaciones generales", behavior?.generalObservations);

  pdf.subheading("Evaluacion de inatencion");
  const inattention = student.inattentionEvaluation;
  pdf.paragraph("Nivel de atencion", inattention?.attentionLevel ? enumLabel(inattention.attentionLevel) : null);
  pdf.longText("Se distrae facilmente", inattention?.easilyDistractedObservation);
  pdf.longText("Mantiene la atencion", inattention?.maintainAttentionObservation);
  pdf.longText("Repeticion de instrucciones", inattention?.instructionRepetitionObservation);
  pdf.longText("Cambios de actividad", inattention?.changesActivityObservation);
  pdf.longText("Apoyo constante", inattention?.constantSupportObservation);
  pdf.longText("Observaciones generales", inattention?.generalObservations);

  pdf.subheading("Matematicas");
  const math = student.mathEvaluation;
  pdf.longText("Reconocimiento de numeros", math?.numberRecognitionObservation);
  pdf.longText("Conteo", math?.countingObservation);
  pdf.longText("Operaciones basicas", math?.basicOperationsObservation);
  pdf.longText("Resolucion de problemas", math?.problemSolvingObservation);
  pdf.longText("Concepto de cantidad", math?.quantityConceptObservation);
  pdf.longText("Secuencia y patrones", math?.sequencesPatternsObservation);
  pdf.longText("Reconocimiento de figuras geometricas", math?.geometricShapesObservation);
  pdf.longText("Observaciones", math?.generalObservations);

  pdf.subheading("Planes de aula pedagogica");
  if (student.pedagogicalPlans.length === 0) {
    pdf.text("No hay planes registrados.");
  } else {
    student.pedagogicalPlans.forEach((plan, index) => {
      pdf.text(`${index + 1}. ${enumLabel(plan.partial)} - ${plan.title}`, { font: "bold", gap: 5 });
      pdf.paragraph("Fecha", formatDate(plan.creationDate));
      pdf.longText("Descripcion", plan.description);
      pdf.longText("Objetivos", plan.objectives);
      pdf.longText("Estrategias", plan.strategies);
      pdf.longText("Recursos", plan.resources);
      if (plan.attachments.length > 0) {
        pdf.text(`Adjuntos: ${plan.attachments.map((attachment) => attachment.fileName).join(", ")}`, { size: 9.5, gap: 8 });
      }
      pdf.spacer(4);
    });
  }

  pdf.subheading("Avances por parcial");
  if (student.progressRecords.length === 0) {
    pdf.text("No hay avances registrados.");
  } else {
    student.progressRecords.forEach((record, index) => {
      pdf.text(`${index + 1}. ${enumLabel(record.partial)} - ${enumLabel(record.progressStatus)}`, { font: "bold", gap: 5 });
      pdf.paragraph("Fecha", formatDate(record.recordDate));
      pdf.longText("Avance observado", record.observedProgress);
      pdf.longText("Dificultades encontradas", record.difficulties);
      pdf.longText("Estrategias aplicadas", record.appliedStrategies);
      pdf.longText("Recomendaciones de casa", record.recommendations);
      pdf.longText("Recomendaciones para adecuacion en el aula", record.classroomRecommendations);
      pdf.spacer(4);
    });
  }

  return pdf.build();
}

export function pdfFileName(studentName: string) {
  const safeName = normalizeText(studentName)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `expediente-${safeName || "estudiante"}.pdf`;
}

function wrapText(text: string, maxChars: number) {
  const normalized = normalizeText(text).replace(/\s+/g, " ").trim();
  if (!normalized) return [""];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }

  if (current) lines.push(current);
  return lines;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(value: string) {
  return normalizeText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(pageStreams: string[]) {
  const objects: string[] = [];
  const addObject = (value: string) => {
    objects.push(value);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds: number[] = [];

  for (const stream of pageStreams) {
    const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  }

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(chunks.join(""), "ascii"));
    chunks.push(`${index + 1} 0 obj\n${objects[index]}\nendobj\n`);
  }

  const xrefOffset = Buffer.byteLength(chunks.join(""), "ascii");
  chunks.push(`xref\n0 ${objects.length + 1}\n`);
  chunks.push("0000000000 65535 f \n");
  for (let index = 1; index < offsets.length; index += 1) {
    chunks.push(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return Buffer.from(chunks.join(""), "ascii");
}
