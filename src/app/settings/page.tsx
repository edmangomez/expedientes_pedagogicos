import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UserManagement } from "@/components/settings/UserManagement";
import { requireAdmin } from "@/lib/auth";
import { getUsers } from "@/lib/queries";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [currentUser, users, params] = await Promise.all([requireAdmin(), getUsers(), searchParams]);

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Inicio", href: "/dashboard" }, { label: "Configuracion" }]} />

        {params.saved && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Cambios guardados correctamente.
          </p>
        )}
        {params.error === "self" && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            No puedes desactivar la cuenta con la que estas trabajando.
          </p>
        )}
        {params.error === "username" && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            Ese nombre de usuario ya existe. Usa uno diferente.
          </p>
        )}

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Configuracion y usuarios</h1>
              <p className="mt-3 leading-7 text-stone-600">
                Administra quienes pueden entrar a la aplicacion. El acceso queda protegido con usuario, contrasena y sesiones privadas.
              </p>
            </div>
          </div>
        </section>

        <UserManagement users={users} currentUserId={currentUser.id} />
      </div>
    </AppShell>
  );
}
