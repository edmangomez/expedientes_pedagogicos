import { BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { loginAction, setupAdminAction } from "@/lib/actions";
import { getUserCount } from "@/lib/queries";

export default async function LoginPage() {
  const [currentUser, userCount] = await Promise.all([getCurrentUser(), getUserCount()]);
  if (currentUser) redirect("/dashboard");

  const isSetup = userCount === 0;

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f4efe4] text-stone-950">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-amber-300/35 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-stone-400/20 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="hidden rounded-[2rem] border border-white/70 bg-white/45 p-8 shadow-2xl shadow-stone-950/10 backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-stone-950 text-white">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-stone-500">Aula pedagogica</p>
              <h1 className="font-[var(--font-display)] text-5xl font-semibold tracking-tight">Expedientes con calma y control.</h1>
            </div>
          </div>

          <div className="mt-14 grid gap-4">
            <Feature title="Acceso privado" text="La informacion estudiantil queda detras de una sesion segura." />
            <Feature title="Usuarios desde Configuracion" text="Despues del primer administrador, puedes agregar mas cuentas desde la app." />
            <Feature title="Trabajo ordenado" text="Evaluaciones, planes y avances siguen en el mismo flujo, ahora protegido." />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-2xl shadow-stone-950/10 backdrop-blur sm:p-8">
          <div className="mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              {isSetup ? <Sparkles className="h-6 w-6" aria-hidden="true" /> : <ShieldCheck className="h-6 w-6" aria-hidden="true" />}
            </span>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-stone-500">
              {isSetup ? "Primer acceso" : "Acceso seguro"}
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-4xl font-semibold tracking-tight">
              {isSetup ? "Crea el administrador" : "Inicia sesion"}
            </h2>
            <p className="mt-3 leading-7 text-stone-600">
              {isSetup
                ? "No hay usuarios todavia. Crea la primera cuenta para activar el acceso privado."
                : "Entra con tu usuario y contrasena para continuar gestionando expedientes."}
            </p>
          </div>

          <LoginForm action={isSetup ? setupAdminAction : loginAction} mode={isSetup ? "setup" : "login"} />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white/70 p-5">
      <h3 className="font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 leading-7 text-stone-600">{text}</p>
    </article>
  );
}
