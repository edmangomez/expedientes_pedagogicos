import { createStudentAction } from "@/lib/actions";
import { enumLabel } from "@/lib/utils";
import { Field, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

const statuses = ["IN_PROCESS", "COMPLETE", "PENDING_PLANS", "NEEDS_REVIEW"].map((value) => ({
  value,
  label: enumLabel(value),
}));

export function StudentForm() {
  return (
    <form action={createStudentAction} className="grid gap-5 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre del estudiante" name="fullName" required />
        <Field label="Fecha de ingreso al aula" name="admissionDate" type="date" />
        <Field label="Fecha de nacimiento" name="birthDate" type="date" helper="Si dejas la edad vacía, se calculará automáticamente." />
        <Field label="Grado y sección" name="gradeSection" required />
        <Field label="Diagnóstico" name="diagnosis" required />
        <Field label="Edad cronológica" name="chronologicalAge" helper="Puede escribirse manualmente." />
        <Field label="Nombre de docente guía" name="teacherName" required />
        <SelectField label="Estado del expediente" name="status" defaultValue="IN_PROCESS" options={statuses} />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Crear estudiante</SubmitButton>
      </div>
    </form>
  );
}
