import Link from "next/link";
import { BookOpen, FolderOpen, Gauge, GraduationCap, History, LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import type { CurrentUser } from "@/lib/auth";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/students", label: "Estudiantes", icon: GraduationCap },
  { href: "/students?view=folders", label: "Carpetas", icon: FolderOpen },
  { href: "/dashboard#recientes", label: "Recientes", icon: History },
  { href: "/settings", label: "Configuracion", icon: Settings },
];

export function Sidebar({ user }: { user: CurrentUser }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-[#f7f5f1] px-4 py-5 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
      <Link href="/dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-stone-950">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-950 text-white">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Expedientes</span>
          <span className="block text-xs text-stone-500">Aula pedagogica</span>
        </span>
      </Link>

      <nav className="mt-6 grid gap-1" aria-label="Navegacion principal">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone-700 transition hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Sesion activa</p>
        <p className="mt-2 truncate text-sm font-semibold text-stone-950">{user.name}</p>
        <p className="truncate text-xs text-stone-500">@{user.username}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesion
          </button>
        </form>
      </div>
    </aside>
  );
}
