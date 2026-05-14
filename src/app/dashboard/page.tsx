import Link from "next/link";
import { ClipboardCheck, FileClock, FolderKanban, Plus, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StudentCard } from "@/components/students/StudentCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { seedDemoDataAction } from "@/lib/actions";
import { getDashboardStats, getStudents } from "@/lib/queries";
import { StudentsWorkspace } from "@/components/students/StudentsWorkspace";

export default async function DashboardPage() {
  const [stats, students] = await Promise.all([getDashboardStats(), getStudents()]);

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Inicio" }, { label: "Dashboard" }]} />

        <section className="grid gap-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">Workspace educativo</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
              Expedientes Pedagógicos
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-stone-600">
              Gestión organizada de evaluaciones, planes y avances estudiantiles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/students/new" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar estudiante
            </Link>
            {stats.total === 0 && (
              <form action={seedDemoDataAction}>
                <SubmitButton variant="secondary">Cargar demo ficticio</SubmitButton>
              </form>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Resumen de expedientes">
          <Stat title="Total de estudiantes" value={stats.total} icon={Users} />
          <Stat title="Expedientes completos" value={stats.complete} icon={ClipboardCheck} />
          <Stat title="Expedientes en proceso" value={stats.inProcess} icon={FileClock} />
          <Stat title="Planes pendientes" value={stats.pendingPlans} icon={FolderKanban} />
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-stone-950">Base de estudiantes</h2>
              <p className="mt-1 text-sm text-stone-500">Busca, filtra y abre expedientes desde una vista tipo carpeta.</p>
            </div>
          </div>
          <StudentsWorkspace students={students} />
        </section>

        <section id="recientes" className="grid gap-4">
          <h2 className="text-xl font-semibold text-stone-950">Expedientes recientes</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.recent.map((student) => (
              <StudentCard
                key={student.id}
                student={{
                  ...student,
                  _count: { pedagogicalPlans: 0, progressRecords: 0 },
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-stone-500">{title}</span>
        <Icon className="h-5 w-5 text-stone-400" aria-hidden="true" />
      </div>
      <p className="mt-4 text-3xl font-semibold text-stone-950">{value}</p>
    </article>
  );
}
