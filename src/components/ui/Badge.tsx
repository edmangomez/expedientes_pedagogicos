import { cn, enumLabel, statusTone } from "@/lib/utils";

export function Badge({ value, className }: { value: string; className?: string }) {
  const tone = statusTone(value);

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tone === "warning" && "border-amber-200 bg-amber-50 text-amber-800",
        tone === "danger" && "border-rose-200 bg-rose-50 text-rose-800",
        tone === "neutral" && "border-stone-200 bg-stone-100 text-stone-700",
        className,
      )}
    >
      {enumLabel(value)}
    </span>
  );
}
