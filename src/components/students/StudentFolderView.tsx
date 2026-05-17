import { ClipboardList, FolderOpen, Layers3 } from "lucide-react";
import { StudentCard } from "@/components/students/StudentCard";
import { enumLabel } from "@/lib/utils";
import type { StudentListItem } from "@/types/student";

export function StudentFolderView({ students }: { students: StudentListItem[] }) {
  const groups = students.reduce<Record<string, StudentListItem[]>>((acc, student) => {
    acc[student.gradeSection] ??= [];
    acc[student.gradeSection].push(student);
    return acc;
  }, {});
  const folderEntries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "es"));
  const diagnosisCount = uniqueCount(students.map((student) => student.diagnosis));
  const statusCount = uniqueCount(students.map((student) => student.status));

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 md:grid-cols-3">
        <FolderSummary icon={FolderOpen} label="Carpetas por grado" value={folderEntries.length} />
        <FolderSummary icon={ClipboardList} label="Diagnosticos registrados" value={diagnosisCount} />
        <FolderSummary icon={Layers3} label="Estados activos" value={statusCount} />
      </div>

      {folderEntries.map(([grade, group]) => (
        <section key={grade} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 bg-stone-50/70 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                  <FolderOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Carpeta de grado</p>
                  <h2 className="mt-1 text-xl font-semibold text-stone-950">{grade}</h2>
                  <p className="mt-1 text-sm text-stone-500">{group.length} expediente(s)</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {countBy(group, "diagnosis").slice(0, 3).map(([diagnosis, count]) => (
                  <span key={diagnosis} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                    {diagnosis}: {count}
                  </span>
                ))}
                {countBy(group, "status").map(([status, count]) => (
                  <span key={status} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                    {enumLabel(status)}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {group.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FolderSummary({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-stone-500">{label}</span>
        <Icon className="h-5 w-5 text-stone-400" aria-hidden="true" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-stone-950">{value}</p>
    </article>
  );
}

function uniqueCount(values: string[]) {
  return new Set(values.filter(Boolean)).size;
}

function countBy(students: StudentListItem[], key: "diagnosis" | "status") {
  const counts = students.reduce<Record<string, number>>((acc, student) => {
    const value = student[key];
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, "es"));
}
