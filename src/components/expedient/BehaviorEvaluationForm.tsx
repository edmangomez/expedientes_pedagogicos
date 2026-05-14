import { updateBehaviorAction } from "@/lib/actions";
import { enumLabel } from "@/lib/utils";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { StudentWithRelations } from "@/types/student";

const statuses = ["ADEQUATE", "OBSERVATION", "NEEDS_SUPPORT", "OTHER"].map((value) => ({
  value,
  label: enumLabel(value),
}));

const fields = [
  ["attitudeObservation", "Actitud durante la evaluación"],
  ["collaborationObservation", "Nivel de colaboración"],
  ["instructionsObservation", "Seguimiento de instrucciones"],
  ["frustrationToleranceObservation", "Tolerancia a la frustración"],
  ["teacherInteractionObservation", "Interacción con el docente"],
  ["relevantBehaviorObservation", "Conducta relevante observada"],
] as const;

export function BehaviorEvaluationForm({ student }: { student: StudentWithRelations }) {
  const evaluation = student.behaviorEvaluation;
  const action = updateBehaviorAction.bind(null, student.id);

  return (
    <form action={action} className="grid gap-5">
      <SelectField label="Estado general" name="behaviorStatus" defaultValue={evaluation?.behaviorStatus ?? "OBSERVATION"} options={statuses} />
      <div className="grid gap-4">
        {fields.map(([name, label]) => (
          <TextAreaField key={name} label={label} name={name} defaultValue={evaluation?.[name]} rows={3} />
        ))}
        <TextAreaField label="Observaciones generales" name="generalObservations" defaultValue={evaluation?.generalObservations} rows={5} />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Guardar conducta</SubmitButton>
      </div>
    </form>
  );
}
