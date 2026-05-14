import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StudentForm } from "@/components/students/StudentForm";

export default function NewStudentPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Inicio", href: "/dashboard" }, { label: "Estudiantes", href: "/students" }, { label: "Nuevo" }]} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Agregar estudiante</h1>
            <p className="mt-2 text-stone-600">Registra datos ficticios o institucionales autorizados para crear el expediente.</p>
          </div>
          <Link href="/students" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </Link>
        </div>
        <StudentForm />
      </div>
    </AppShell>
  );
}
