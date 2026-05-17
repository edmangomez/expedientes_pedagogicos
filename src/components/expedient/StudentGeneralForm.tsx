"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { updateStudentAction } from "@/lib/actions";
import { formatDate, toDateInput } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Field, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { StudentWithRelations } from "@/types/student";

const statuses = ["IN_PROCESS", "COMPLETE", "PENDING_PLANS", "NEEDS_REVIEW"].map((value) => ({
  value,
  label: value === "IN_PROCESS" ? "En proceso" : value === "COMPLETE" ? "Completo" : value === "PENDING_PLANS" ? "Planes pendientes" : "Requiere revision",
}));

export function StudentGeneralForm({ student }: { student: StudentWithRelations }) {
  const [isEditing, setIsEditing] = useState(false);
  const action = updateStudentAction.bind(null, student.id);

  if (!isEditing) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ReadOnlyField label="Nombre del estudiante" value={student.fullName} className="md:col-span-2 xl:col-span-1" />
          <ReadOnlyField label="Fecha de ingreso al aula" value={formatDate(student.admissionDate)} />
          <ReadOnlyField label="Fecha de nacimiento" value={formatDate(student.birthDate)} />
          <ReadOnlyField label="Grado y seccion" value={student.gradeSection} />
          <ReadOnlyField label="Diagnostico" value={student.diagnosis} className="md:col-span-2 xl:col-span-1" />
          <ReadOnlyField label="Edad cronologica" value={student.chronologicalAge || "Sin registrar"} />
          <ReadOnlyField label="Docente guia" value={student.teacherName} />
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Estado del expediente</p>
            <div className="mt-2">
              <Badge value={student.status} />
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar datos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Estas editando los datos base del expediente. Guarda los cambios o cancela para volver al modo de solo lectura.
      </div>
      <form action={action} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre del estudiante" name="fullName" defaultValue={student.fullName} required />
          <Field label="Fecha de ingreso al aula" name="admissionDate" type="date" defaultValue={toDateInput(student.admissionDate)} />
          <Field label="Fecha de nacimiento" name="birthDate" type="date" defaultValue={toDateInput(student.birthDate)} helper="Si dejas la edad vacia, se calculara automaticamente." />
          <Field label="Grado y seccion" name="gradeSection" defaultValue={student.gradeSection} required />
          <Field label="Diagnostico" name="diagnosis" defaultValue={student.diagnosis} required />
          <Field label="Edad cronologica" name="chronologicalAge" defaultValue={student.chronologicalAge} helper="Puede escribirse manualmente." />
          <Field label="Nombre de docente guia" name="teacherName" defaultValue={student.teacherName} required />
          <SelectField label="Estado del expediente" name="status" defaultValue={student.status} options={statuses} />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancelar
          </button>
          <SubmitButton>Guardar datos generales</SubmitButton>
        </div>
      </form>
    </div>
  );
}

function ReadOnlyField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-stone-50 p-4 ${className ?? ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 text-base font-medium text-stone-950">{value}</p>
    </div>
  );
}
