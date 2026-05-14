import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StudentsWorkspace } from "@/components/students/StudentsWorkspace";
import { getStudents } from "@/lib/queries";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: "cards" | "table" | "folders" }>;
}) {
  const [{ view }, students] = await Promise.all([searchParams, getStudents()]);

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Inicio", href: "/dashboard" }, { label: "Estudiantes" }]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Estudiantes</h1>
            <p className="mt-2 text-stone-600">Carpetas pedagógicas organizadas por grado, diagnóstico y estado.</p>
          </div>
          <Link href="/students/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar estudiante
          </Link>
        </div>
        <StudentsWorkspace students={students} initialView={view ?? "cards"} />
      </div>
    </AppShell>
  );
}
