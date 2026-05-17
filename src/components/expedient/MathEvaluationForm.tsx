import { updateMathAction } from "@/lib/actions";
import { TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatDate } from "@/lib/utils";
import type { StudentWithRelations } from "@/types/student";

const items = [
  ["numberRecognitionObservation", "Reconocimiento de numeros"],
  ["countingObservation", "Conteo"],
  ["basicOperationsObservation", "Operaciones basicas"],
  ["problemSolvingObservation", "Resolucion de problemas"],
  ["quantityConceptObservation", "Concepto de cantidad"],
  ["sequencesPatternsObservation", "Secuencia y patrones"],
  ["geometricShapesObservation", "Reconocimiento de figuras geometricas"],
] as const;

export function MathEvaluationForm({ student }: { student: StudentWithRelations }) {
  const evaluation = student.mathEvaluation;
  const action = updateMathAction.bind(null, student.id);

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4">
        {items.map(([name, label]) => (
          <TextAreaField key={name} label={label} name={name} defaultValue={evaluation?.[name]} rows={3} />
        ))}
        <TextAreaField label="Observaciones" name="generalObservations" defaultValue={evaluation?.generalObservations} rows={5} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500">Ultima modificacion: {formatDate(evaluation?.updatedAt)}</p>
        <SubmitButton>Guardar evaluacion de matematicas</SubmitButton>
      </div>
    </form>
  );
}
