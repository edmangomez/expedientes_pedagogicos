import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BehaviorEvaluationForm } from "@/components/expedient/BehaviorEvaluationForm";
import { DiagnosticEvaluationForm } from "@/components/expedient/DiagnosticEvaluationForm";
import { ExpedientHeader } from "@/components/expedient/ExpedientHeader";
import { ExpedientSection } from "@/components/expedient/ExpedientSection";
import { InattentionEvaluationForm } from "@/components/expedient/InattentionEvaluationForm";
import { InternalNav } from "@/components/expedient/InternalNav";
import { MathEvaluationForm } from "@/components/expedient/MathEvaluationForm";
import { PedagogicalPlanForm } from "@/components/expedient/PedagogicalPlanForm";
import { ProgressRecordForm } from "@/components/expedient/ProgressRecordForm";
import { StudentGeneralForm } from "@/components/expedient/StudentGeneralForm";
import { getStudentById } from "@/lib/queries";

export default async function StudentExpedientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [{ id }, feedback] = await Promise.all([params, searchParams]);
  const student = await getStudentById(id);
  if (!student) notFound();

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/dashboard" },
            { label: "Estudiantes", href: "/students" },
            { label: student.gradeSection, href: "/students?view=folders" },
            { label: student.fullName },
          ]}
        />

        {(feedback.saved || feedback.deleted) && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 print:hidden">
            Cambios guardados correctamente.
          </p>
        )}

        <ExpedientHeader student={student} />

        <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
          <InternalNav />
          <div className="grid gap-5">
            <ExpedientSection id="datos-generales" title="Datos generales" description="Informacion base del estudiante en modo lectura.">
              <StudentGeneralForm student={student} />
            </ExpedientSection>
            <ExpedientSection id="diagnostico" title="Evaluación diagnóstica - Lectoescritura" description="Observaciones por ítem y fecha de evaluación.">
              <DiagnosticEvaluationForm student={student} />
            </ExpedientSection>
            <ExpedientSection id="conducta" title="Conducta en evaluación" description="Registro de comportamiento observado durante la evaluación.">
              <BehaviorEvaluationForm student={student} />
            </ExpedientSection>
            <ExpedientSection id="inatencion" title="Evaluación de inatención" description="Escala y observaciones de atención.">
              <InattentionEvaluationForm student={student} />
            </ExpedientSection>
            <ExpedientSection id="matematicas" title="Matematicas" description="Observaciones sobre habilidades numericas, operaciones y resolucion de problemas.">
              <MathEvaluationForm student={student} />
            </ExpedientSection>
            <ExpedientSection id="planes" title="Plan de aula pedagógica" description="Planes por parcial y archivos adjuntos simulados.">
              <PedagogicalPlanForm student={student} />
            </ExpedientSection>
            <ExpedientSection id="avances" title="Avances por parcial" description="Historial del 2do, 3er y 4to parcial.">
              <ProgressRecordForm student={student} />
            </ExpedientSection>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

