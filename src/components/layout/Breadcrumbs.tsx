import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-stone-500" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href} className="rounded-md hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-500">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-stone-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
