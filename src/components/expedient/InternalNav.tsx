import Link from "next/link";

const sections = [
  ["datos-generales", "Datos generales"],
  ["diagnostico", "Evaluación diagnóstica"],
  ["conducta", "Conducta en evaluación"],
  ["inatencion", "Evaluación de inatención"],
  ["matematicas", "Matematicas"],
  ["planes", "Plan de aula pedagógica"],
  ["avances", "Avances por parcial"],
];

export function InternalNav() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Índice</p>
        <nav className="mt-3 grid gap-1" aria-label="Índice del expediente">
          {sections.map(([href, label]) => (
            <Link key={href} href={`#${href}`} className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-950">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
