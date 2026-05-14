import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { deleteStudentAction } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import type { StudentListItem } from "@/types/student";

export function StudentTable({ students }: { students: StudentListItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Grado y sección</th>
              <th className="px-4 py-3">Diagnóstico</th>
              <th className="px-4 py-3">Edad</th>
              <th className="px-4 py-3">Docente guía</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Actualización</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {students.map((student) => {
              const deleteAction = deleteStudentAction.bind(null, student.id);
              return (
                <tr key={student.id} className="align-top">
                  <td className="px-4 py-3 font-semibold text-stone-950">{student.fullName}</td>
                  <td className="px-4 py-3 text-stone-700">{student.gradeSection}</td>
                  <td className="px-4 py-3 text-stone-700">{student.diagnosis}</td>
                  <td className="px-4 py-3 text-stone-700">{student.chronologicalAge || "Sin registro"}</td>
                  <td className="px-4 py-3 text-stone-700">{student.teacherName}</td>
                  <td className="px-4 py-3"><Badge value={student.status} /></td>
                  <td className="px-4 py-3 text-stone-700">{formatDate(student.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/students/${student.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-200 px-3 font-semibold hover:bg-stone-50">
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Ver
                      </Link>
                      <form action={deleteAction}>
                        <SubmitButton variant="ghost" className="min-h-10 px-3 text-rose-700" confirm={`¿Eliminar el expediente de ${student.fullName}?`}>
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </SubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
