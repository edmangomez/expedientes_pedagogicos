import { ChevronDown } from "lucide-react";

export function ExpedientSection({
  id,
  title,
  description,
  children,
  defaultOpen = true,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details id={id} open={defaultOpen} className="group scroll-mt-24 rounded-xl border border-stone-200 bg-white shadow-sm">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span>
          <span className="block text-lg font-semibold text-stone-950">{title}</span>
          {description && <span className="mt-1 block text-sm text-stone-500">{description}</span>}
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-stone-400 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-stone-100 px-5 py-5">{children}</div>
    </details>
  );
}
