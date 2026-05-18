"use client";

import Link from "next/link";
import { FolderOpen, Gauge, GraduationCap, LogOut, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";
import type { CurrentUser } from "@/lib/auth";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/students", label: "Estudiantes", icon: GraduationCap },
  { href: "/students?view=folders", label: "Carpetas", icon: FolderOpen },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function MobileNav({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 bg-[#f7f5f1] lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-14 w-full items-center justify-between px-4 text-sm font-semibold text-stone-900"
        aria-expanded={open}
      >
        <span>Expedientes Pedagogicos</span>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <nav className="grid gap-1 px-3 pb-3" aria-label="Navegacion movil">
          <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm">
            <p className="font-semibold text-stone-950">{user.name}</p>
            <p className="text-xs text-stone-500">@{user.username}</p>
          </div>
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
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone-700 hover:bg-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesion
            </button>
          </form>
        </nav>
      )}
    </div>
  );
}
