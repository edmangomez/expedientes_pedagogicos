"use client";

import Link from "next/link";
import { ArrowLeft, FileDown, Save } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { StudentWithRelations } from "@/types/student";

export function ExpedientHeader({ student }: { student: StudentWithRelations }) {
  return (
    <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-stone-950 text-white">
            <Save className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-stone-500">Expediente pedagógico</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-950">{student.fullName}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge value={student.status} />
              <span className="inline-flex min-h-7 items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700">
                {student.gradeSection}
              </span>
              <span className="inline-flex min-h-7 items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700">
                {student.diagnosis}
              </span>
            </div>
            <p className="mt-3 text-sm text-stone-500">Última actualización: {formatDate(student.updatedAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Link href="/students" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            Exportar PDF
          </button>
        </div>
      </div>
    </header>
  );
}
