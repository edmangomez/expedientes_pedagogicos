import { updateDiagnosticAction } from "@/lib/actions";
import { Field, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatDate, toDateInput } from "@/lib/utils";
import type { StudentWithRelations } from "@/types/student";

const items = [
  ["uppercaseLowercaseGraphemeObservation", "Grafema mayúsculas y minúsculas"],
  ["simpleSyllablesObservation", "Sílabas simples"],
  ["inverseSyllablesObservation", "Sílabas inversas"],
  ["mixedSyllablesObservation", "Sílabas trabadas"],
  ["compoundSyllablesObservation", "Sílabas compuestas"],
  ["monosyllabicWordsObservation", "Palabras monosílabas"],
  ["bisyllabicWordsObservation", "Palabras bisílabas"],
  ["trisyllabicWordsObservation", "Palabras trisílabas"],
  ["shortSentencesObservation", "Oraciones cortas"],
  ["longSentencesObservation", "Oraciones largas"],
  ["paragraphsObservation", "Párrafos"],
  ["shortStoriesObservation", "Cuentos cortos"],
] as const;

export function DiagnosticEvaluationForm({ student }: { student: StudentWithRelations }) {
  const evaluation = student.diagnosticEvaluation;
  const action = updateDiagnosticAction.bind(null, student.id);

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Fecha de evaluación" name="evaluationDate" type="date" defaultValue={toDateInput(evaluation?.evaluationDate)} />
        <Field label="Nombre del evaluador/docente" name="evaluatorName" defaultValue={evaluation?.evaluatorName} />
      </div>
      <div className="grid gap-4">
        {items.map(([name, label]) => (
          <TextAreaField key={name} label={label} name={name} defaultValue={evaluation?.[name]} rows={3} />
        ))}
        <TextAreaField label="Observaciones generales" name="generalObservations" defaultValue={evaluation?.generalObservations} rows={5} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500">Última modificación: {formatDate(evaluation?.updatedAt)}</p>
        <SubmitButton>Guardar evaluación diagnóstica</SubmitButton>
      </div>
    </form>
  );
}
