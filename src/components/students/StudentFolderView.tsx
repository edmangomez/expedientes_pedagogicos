import { FolderOpen } from "lucide-react";
import { StudentCard } from "@/components/students/StudentCard";
import type { StudentListItem } from "@/types/student";

export function StudentFolderView({ students }: { students: StudentListItem[] }) {
  const groups = students.reduce<Record<string, StudentListItem[]>>((acc, student) => {
    acc[student.gradeSection] ??= [];
    acc[student.gradeSection].push(student);
    return acc;
  }, {});

  return (
    <div className="grid gap-6">
      {Object.entries(groups).map(([grade, group]) => (
        <section key={grade} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-50 text-sky-700">
              <FolderOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-stone-950">{grade}</h2>
              <p className="text-sm text-stone-500">{group.length} expediente(s)</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
