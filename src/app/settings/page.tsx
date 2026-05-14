import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Inicio", href: "/dashboard" }, { label: "Configuración" }]} />
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Configuración básica</h1>
              <p className="mt-3 leading-7 text-stone-600">
                Esta versión deja preparada la arquitectura para login, roles de administrador, docente y solo lectura, Supabase,
                reportes y respaldo de expedientes. No hay secretos hardcodeados ni datos reales de estudiantes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
