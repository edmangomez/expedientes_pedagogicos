"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  className,
  variant = "primary",
  confirm,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  confirm?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) {
          event.preventDefault();
        }
      }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-stone-950 text-white hover:bg-stone-800 focus-visible:outline-stone-900",
        variant === "secondary" && "border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 focus-visible:outline-stone-500",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600",
        variant === "ghost" && "text-stone-600 hover:bg-stone-100",
        className,
      )}
    >
      {pending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
