import { FileText, Paperclip, Trash2 } from "lucide-react";
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
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-600">
              <Paperclip className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-stone-950">Adjunto opcional del plan</h3>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                Sube un documento de apoyo para este plan, como PDF, Word o imagen. El archivo quedara guardado localmente
                y podras abrirlo despues desde la lista de adjuntos del expediente.
              </p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            <span>Documento para subir</span>
            <input
              name="attachmentFile"
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
              className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 py-2 text-base text-stone-900 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-stone-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-800 focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
            />
            <span className="text-xs font-normal text-stone-500">Formatos permitidos: PDF, Word, JPG, PNG o WebP. Tamano maximo: 10 MB.</span>
          </label>
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
