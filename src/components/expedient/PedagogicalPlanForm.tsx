import { FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Field, SelectField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createPlanAction, deleteAttachmentAction, deletePlanAction } from "@/lib/actions";
import { enumLabel, formatDate, toDateInput } from "@/lib/utils";
import type { StudentWithRelations } from "@/types/student";

const partials = ["FIRST", "SECOND", "THIRD", "FOURTH"].map((value) => ({ value, label: enumLabel(value) }));

export function PedagogicalPlanForm({ student }: { student: StudentWithRelations }) {
  const action = createPlanAction.bind(null, student.id);

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Parcial" name="partial" defaultValue="FIRST" options={partials} />
          <Field label="Fecha de creación" name="creationDate" type="date" defaultValue={toDateInput(new Date())} />
          <Field label="Título del plan" name="title" required className="md:col-span-2" />
        </div>
        <div className="grid gap-4">
          <TextAreaField label="Descripción del plan" name="description" rows={3} />
          <TextAreaField label="Objetivos pedagógicos" name="objectives" rows={3} />
          <TextAreaField label="Estrategias a utilizar" name="strategies" rows={3} />
          <TextAreaField label="Recursos necesarios" name="resources" rows={3} />
        </div>
        <div className="grid gap-4 rounded-lg border border-dashed border-stone-300 bg-white p-4 md:grid-cols-3">
          <Field label="Nombre del archivo" name="attachmentName" helper="Ej. plan-primer-parcial.pdf" />
          <Field label="Tipo de archivo" name="attachmentType" helper="PDF, Word o imagen" />
          <Field label="URL o ruta simulada" name="attachmentUrl" helper="Preparado para Supabase Storage." />
        </div>
        <div className="flex justify-end">
          <SubmitButton>Agregar plan</SubmitButton>
        </div>
      </form>

      <div className="grid gap-3">
        {student.pedagogicalPlans.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-500">
            Todavía no hay planes registrados para este expediente.
          </p>
        ) : (
          student.pedagogicalPlans.map((plan) => (
            <article key={plan.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-stone-950">{plan.title}</h3>
                    <Badge value={plan.partial} />
                  </div>
                  <p className="mt-1 text-sm text-stone-500">Creado: {formatDate(plan.creationDate)}</p>
                </div>
                <form action={deletePlanAction.bind(null, student.id, plan.id)}>
                  <SubmitButton variant="ghost" className="text-rose-700" confirm={`¿Eliminar el plan "${plan.title}"?`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Eliminar
                  </SubmitButton>
                </form>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-stone-700">
                {plan.description && <p><strong>Descripción:</strong> {plan.description}</p>}
                {plan.objectives && <p><strong>Objetivos:</strong> {plan.objectives}</p>}
                {plan.strategies && <p><strong>Estrategias:</strong> {plan.strategies}</p>}
                {plan.resources && <p><strong>Recursos:</strong> {plan.resources}</p>}
              </div>
              {plan.attachments.length > 0 && (
                <div className="mt-4 grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Archivos adjuntos</p>
                  {plan.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex flex-col gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <a href={attachment.fileUrl} className="inline-flex items-center gap-2 text-sm font-medium text-stone-800 hover:text-stone-950" target="_blank" rel="noreferrer">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        {attachment.fileName} <span className="text-stone-400">({attachment.fileType})</span>
                      </a>
                      <form action={deleteAttachmentAction.bind(null, student.id, attachment.id)}>
                        <SubmitButton variant="ghost" className="min-h-9 px-2 text-rose-700" confirm={`¿Eliminar el archivo ${attachment.fileName}?`}>
                          Eliminar archivo
                        </SubmitButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
