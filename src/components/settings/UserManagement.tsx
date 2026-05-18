import { ShieldCheck, UserRound, UserRoundCheck, UserRoundX } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createUserAction, toggleUserStatusAction } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

type ManagedUser = {
  id: string;
  name: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  _count: { sessions: number };
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  TEACHER: "Docente",
  READ_ONLY: "Solo lectura",
};

export function UserManagement({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-stone-950 text-white">
            <UserRoundCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Agregar usuario</h2>
            <p className="mt-2 leading-7 text-stone-600">
              Crea accesos para las personas que trabajaran con los expedientes. Cada usuario entra con su propio usuario y contrasena.
            </p>
          </div>
        </div>

        <form action={createUserAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            <span>Nombre completo</span>
            <input name="name" required className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            <span>Usuario</span>
            <input name="username" required minLength={3} className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            <span>Contrasena temporal</span>
            <input name="password" type="password" required minLength={8} className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200" />
            <span className="text-xs font-normal text-stone-500">Minimo 8 caracteres. La persona puede usarla para iniciar sesion.</span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            <span>Rol</span>
            <select name="role" defaultValue="ADMIN" className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200">
              <option value="ADMIN">Administrador</option>
              <option value="TEACHER">Docente</option>
              <option value="READ_ONLY">Solo lectura</option>
            </select>
          </label>
          <SubmitButton>Crear usuario</SubmitButton>
        </form>
      </article>

      <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Usuarios registrados</h2>
            <p className="mt-2 text-sm text-stone-500">Activa o desactiva accesos sin borrar el historial de la cuenta.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {users.filter((user) => user.isActive).length} activos
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          {users.map((user) => {
            const toggleAction = toggleUserStatusAction.bind(null, user.id);
            const isCurrentUser = user.id === currentUserId;

            return (
              <div key={user.id} className="rounded-xl border border-stone-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800">
                      <UserRound className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-stone-950">{user.name}</h3>
                        {isCurrentUser && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">Tu cuenta</span>}
                      </div>
                      <p className="mt-1 text-sm text-stone-500">@{user.username} · {roleLabels[user.role] ?? user.role}</p>
                      <p className="mt-1 text-xs text-stone-400">Creado: {formatDate(user.createdAt)} · Sesiones: {user._count.sessions}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={user.isActive ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800" : "rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                    <form action={toggleAction}>
                      <SubmitButton
                        variant="secondary"
                        className="min-h-9 px-3"
                        confirm={user.isActive ? `Desactivar a ${user.name}?` : undefined}
                      >
                        {user.isActive ? <UserRoundX className="h-4 w-4" aria-hidden="true" /> : <UserRoundCheck className="h-4 w-4" aria-hidden="true" />}
                        {user.isActive ? "Desactivar" : "Activar"}
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
