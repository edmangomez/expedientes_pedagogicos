"use client";

import { KeyRound, Loader2, UserPlus } from "lucide-react";
import { useActionState } from "react";
import type { AuthActionState } from "@/lib/actions";

type AuthAction = (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;

export function LoginForm({ action, mode }: { action: AuthAction; mode: "login" | "setup" }) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSetup = mode === "setup";

  return (
    <form action={formAction} className="grid gap-4">
      {isSetup && (
        <label className="grid gap-2 text-sm font-semibold text-stone-800">
          <span>Nombre completo</span>
          <input
            name="name"
            autoComplete="name"
            required
            placeholder="Ej. Edman Gomez"
            className="min-h-12 rounded-xl border border-stone-200 bg-white/90 px-4 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
          />
        </label>
      )}

      <label className="grid gap-2 text-sm font-semibold text-stone-800">
        <span>Usuario</span>
        <input
          name="username"
          autoComplete="username"
          required
          placeholder="usuario"
          className="min-h-12 rounded-xl border border-stone-200 bg-white/90 px-4 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-stone-800">
        <span>Contrasena</span>
        <input
          name="password"
          type="password"
          autoComplete={isSetup ? "new-password" : "current-password"}
          required
          minLength={isSetup ? 8 : undefined}
          placeholder={isSetup ? "Minimo 8 caracteres" : "Tu contrasena"}
          className="min-h-12 rounded-xl border border-stone-200 bg-white/90 px-4 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-100"
        />
      </label>

      {state.error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 text-sm font-bold text-white shadow-lg shadow-stone-950/10 transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : isSetup ? <UserPlus className="h-4 w-4" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
        {isSetup ? "Crear administrador" : "Entrar al sistema"}
      </button>
    </form>
  );
}
