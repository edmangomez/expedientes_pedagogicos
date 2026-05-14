import { updateInattentionAction } from "@/lib/actions";
import { enumLabel } from "@/lib/utils";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { StudentWithRelations } from "@/types/student";

const levels = ["LOW", "MEDIUM", "HIGH"].map((value) => ({ value, label: enumLabel(value) }));
const fields = [
  ["easilyDistractedObservation", "Se distrae con facilidad"],
  ["maintainAttentionObservation", "Dificultad para mantener la atención"],
  ["instructionRepetitionObservation", "Necesita repetición de instrucciones"],
  ["changesActivityObservation", "Cambia de actividad constantemente"],
  ["constantSupportObservation", "Requiere acompañamiento constante"],
] as const;

export function InattentionEvaluationForm({ student }: { student: StudentWithRelations }) {
  const evaluation = student.inattentionEvaluation;
  const action = updateInattentionAction.bind(null, student.id);

  return (
    <form action={action} className="grid gap-5">
      <SelectField label="Escala de inatención" name="attentionLevel" defaultValue={evaluation?.attentionLevel ?? "MEDIUM"} options={levels} />
      <div className="grid gap-4">
        {fields.map(([name, label]) => (
          <TextAreaField key={name} label={label} name={name} defaultValue={evaluation?.[name]} rows={3} />
        ))}
        <TextAreaField label="Observaciones generales" name="generalObservations" defaultValue={evaluation?.generalObservations} rows={5} />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Guardar inatención</SubmitButton>
      </div>
    </form>
  );
}
