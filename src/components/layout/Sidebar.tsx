import Link from "next/link";
import { BookOpen, FolderOpen, Gauge, GraduationCap, History, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/students", label: "Estudiantes", icon: GraduationCap },
  { href: "/students?view=folders", label: "Carpetas", icon: FolderOpen },
  { href: "/dashboard#recientes", label: "Recientes", icon: History },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-[#f7f5f1] px-4 py-5 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
      <Link href="/dashboard" className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-stone-950">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-950 text-white">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Expedientes</span>
          <span className="block text-xs text-stone-500">Aula pedagógica</span>
        </span>
      </Link>

      <nav className="mt-6 grid gap-1" aria-label="Navegación principal">
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
    </aside>
  );
}
