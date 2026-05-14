"use client";

import Link from "next/link";
import { Grid2X2, LayoutList, Plus, Search, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import { StudentCard } from "@/components/students/StudentCard";
import { StudentFolderView } from "@/components/students/StudentFolderView";
import { StudentTable } from "@/components/students/StudentTable";
import { cn, enumLabel } from "@/lib/utils";
import type { StudentListItem } from "@/types/student";

type ViewMode = "cards" | "table" | "folders";

export function StudentsWorkspace({
  students,
  initialView = "cards",
}: {
  students: StudentListItem[];
  initialView?: ViewMode;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [diagnosis, setDiagnosis] = useState("all");
  const [teacher, setTeacher] = useState("all");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<ViewMode>(initialView);

  const grades = unique(students.map((student) => student.gradeSection));
  const diagnoses = unique(students.map((student) => student.diagnosis));
  const teachers = unique(students.map((student) => student.teacherName));
  const statuses = unique(students.map((student) => student.status));

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesQuery =
        !normalized ||
        [student.fullName, student.gradeSection, student.diagnosis, student.teacherName]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return (
        matchesQuery &&
        (grade === "all" || student.gradeSection === grade) &&
        (diagnosis === "all" || student.diagnosis === diagnosis) &&
        (teacher === "all" || student.teacherName === teacher) &&
        (status === "all" || student.status === status)
      );
    });
  }, [students, query, grade, diagnosis, teacher, status]);

  return (
    <section className="grid gap-5">
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="md:col-span-2 xl:col-span-1">
              <span className="text-sm font-medium text-stone-700">Buscar</span>
              <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-stone-200 px-3 focus-within:border-stone-500 focus-within:ring-4 focus-within:ring-stone-200">
                <Search className="h-4 w-4 text-stone-400" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre, diagnóstico, docente..."
                  className="w-full bg-transparent text-base outline-none"
                />
              </span>
            </label>
            <Filter label="Grado y sección" value={grade} onChange={setGrade} options={grades} />
            <Filter label="Diagnóstico" value={diagnosis} onChange={setDiagnosis} options={diagnoses} />
            <Filter label="Docente guía" value={teacher} onChange={setTeacher} options={teachers} />
            <Filter label="Estado" value={status} onChange={setStatus} options={statuses.map((item) => ({ value: item, label: enumLabel(item) }))} />
          </div>
          <div className="flex flex-wrap gap-2">
            <ViewButton active={view === "cards"} onClick={() => setView("cards")} icon={Grid2X2} label="Tarjetas" />
            <ViewButton active={view === "table"} onClick={() => setView("table")} icon={Table2} label="Tabla" />
            <ViewButton active={view === "folders"} onClick={() => setView("folders")} icon={LayoutList} label="Carpetas" />
            <Link href="/students/new" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar estudiante
            </Link>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-stone-950">No hay expedientes con esos filtros.</p>
          <p className="mt-2 text-sm text-stone-500">Prueba limpiar la búsqueda o agrega un estudiante nuevo.</p>
        </div>
      ) : view === "table" ? (
        <StudentTable students={filtered} />
      ) : view === "folders" ? (
        <StudentFolderView students={filtered} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </section>
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "es"));
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  return (
    <label>
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-base outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
      >
        <option value="all">Todos</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
        active ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
