import Link from "next/link";
import { Edit3, ExternalLink, Folder, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteStudentAction } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import type { StudentListItem } from "@/types/student";

export function StudentCard({ student }: { student: StudentListItem }) {
  const deleteAction = deleteStudentAction.bind(null, student.id);

  return (
    <article className="group rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-800">
            <Folder className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-stone-950">{student.fullName}</h3>
            <p className="mt-1 text-sm text-stone-500">{student.gradeSection}</p>
          </div>
        </div>
        <Badge value={student.status} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Diagnóstico</dt>
          <dd className="mt-1 text-stone-800">{student.diagnosis}</dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Edad</dt>
            <dd className="mt-1 text-stone-800">{student.chronologicalAge || "Sin registro"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Docente</dt>
            <dd className="mt-1 text-stone-800">{student.teacherName}</dd>
          </div>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Última actualización</dt>
          <dd className="mt-1 text-stone-800">{formatDate(student.updatedAt)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/students/${student.id}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-stone-950 px-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Ver expediente
        </Link>
        <Link
          href={`/students/${student.id}#datos-generales`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Editar
        </Link>
        <form action={deleteAction}>
          <SubmitButton
            variant="ghost"
            className="min-h-10 px-3 text-rose-700 hover:bg-rose-50"
            confirm={`¿Eliminar el expediente de ${student.fullName}?`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar
          </SubmitButton>
        </form>
      </div>
    </article>
  );
}
