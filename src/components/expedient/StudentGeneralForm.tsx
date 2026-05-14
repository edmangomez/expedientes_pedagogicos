import { updateStudentAction } from "@/lib/actions";
import { enumLabel, toDateInput } from "@/lib/utils";
import { Field, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { StudentWithRelations } from "@/types/student";

const statuses = ["IN_PROCESS", "COMPLETE", "PENDING_PLANS", "NEEDS_REVIEW"].map((value) => ({
  value,
  label: enumLabel(value),
}));

export function StudentGeneralForm({ student }: { student: StudentWithRelations }) {
  const action = updateStudentAction.bind(null, student.id);

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre del estudiante" name="fullName" defaultValue={student.fullName} required />
        <Field label="Fecha de ingreso al aula" name="admissionDate" type="date" defaultValue={toDateInput(student.admissionDate)} />
        <Field label="Fecha de nacimiento" name="birthDate" type="date" defaultValue={toDateInput(student.birthDate)} helper="Si dejas la edad vacía, se calculará automáticamente." />
        <Field label="Grado y sección" name="gradeSection" defaultValue={student.gradeSection} required />
        <Field label="Diagnóstico" name="diagnosis" defaultValue={student.diagnosis} required />
        <Field label="Edad cronológica" name="chronologicalAge" defaultValue={student.chronologicalAge} helper="Puede escribirse manualmente." />
        <Field label="Nombre de docente guía" name="teacherName" defaultValue={student.teacherName} required />
        <SelectField label="Estado del expediente" name="status" defaultValue={student.status} options={statuses} />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Guardar datos generales</SubmitButton>
      </div>
    </form>
  );
}
