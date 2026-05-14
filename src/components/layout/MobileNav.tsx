"use client";

import Link from "next/link";
import { FolderOpen, Gauge, GraduationCap, Menu, Settings } from "lucide-react";
import { useState } from "react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/students", label: "Estudiantes", icon: GraduationCap },
  { href: "/students?view=folders", label: "Carpetas", icon: FolderOpen },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 bg-[#f7f5f1] lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-14 w-full items-center justify-between px-4 text-sm font-semibold text-stone-900"
        aria-expanded={open}
      >
        <span>Expedientes Pedagógicos</span>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <nav className="grid gap-1 px-3 pb-3" aria-label="Navegación móvil">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone-700 hover:bg-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
