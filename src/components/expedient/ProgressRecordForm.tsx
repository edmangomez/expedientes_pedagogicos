import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Field, SelectField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createProgressAction, deleteProgressAction } from "@/lib/actions";
import { enumLabel, formatDate, toDateInput } from "@/lib/utils";
import type { StudentWithRelations } from "@/types/student";

const partials = ["SECOND", "THIRD", "FOURTH"].map((value) => ({ value, label: enumLabel(value) }));
const statuses = ["NOT_STARTED", "IN_PROGRESS", "SIGNIFICANT_PROGRESS", "NEEDS_REINFORCEMENT"].map((value) => ({
  value,
  label: enumLabel(value),
}));

export function ProgressRecordForm({ student }: { student: StudentWithRelations }) {
  const action = createProgressAction.bind(null, student.id);

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField label="Parcial" name="partial" defaultValue="SECOND" options={partials} />
          <Field label="Fecha del registro" name="recordDate" type="date" defaultValue={toDateInput(new Date())} />
          <SelectField label="Estado del avance" name="progressStatus" defaultValue="IN_PROGRESS" options={statuses} />
        </div>
        <div className="grid gap-4">
          <TextAreaField label="Avance observado" name="observedProgress" rows={3} />
          <TextAreaField label="Dificultades encontradas" name="difficulties" rows={3} />
          <TextAreaField label="Estrategias aplicadas" name="appliedStrategies" rows={3} />
          <TextAreaField label="Recomendaciones de casa" name="recommendations" rows={3} />
          <TextAreaField label="Recomendaciones para adecuacion en el aula" name="classroomRecommendations" rows={3} />
        </div>
        <div className="flex justify-end">
          <SubmitButton>Guardar avance</SubmitButton>
        </div>
      </form>

      <div className="grid gap-3">
        {student.progressRecords.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
            Aún no hay avances registrados del 2do al 4to parcial.
          </p>
        ) : (
          student.progressRecords.map((record) => (
            <article key={record.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge value={record.partial} />
                  <Badge value={record.progressStatus} />
                  <span className="text-sm text-stone-500">{formatDate(record.recordDate)}</span>
                </div>
                <form action={deleteProgressAction.bind(null, student.id, record.id)}>
                  <SubmitButton variant="ghost" className="text-rose-700" confirm="¿Eliminar este registro de avance?">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Eliminar
                  </SubmitButton>
                </form>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-stone-700">
                {record.observedProgress && <p><strong>Avance:</strong> {record.observedProgress}</p>}
                {record.difficulties && <p><strong>Dificultades:</strong> {record.difficulties}</p>}
                {record.appliedStrategies && <p><strong>Estrategias:</strong> {record.appliedStrategies}</p>}
                {record.recommendations && <p><strong>Recomendaciones de casa:</strong> {record.recommendations}</p>}
                {record.classroomRecommendations && <p><strong>Recomendaciones para adecuacion en el aula:</strong> {record.classroomRecommendations}</p>}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
