import Link from "next/link";
import { CalendarClock, DatabaseBackup, Download, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  createManualBackupAction,
  deleteBackupAction,
  restoreBackupAction,
  updateBackupScheduleAction,
} from "@/lib/actions";
import type { BackupInfo, BackupScheduleInfo } from "@/lib/backup";
import { formatDate } from "@/lib/utils";

const frequencyLabels: Record<string, string> = {
  DAILY: "Diario",
  WEEKLY: "Semanal",
  MONTHLY: "Mensual",
};

const reasonLabels: Record<string, string> = {
  manual: "Manual",
  scheduled: "Programado",
};

export function BackupManagement({
  backups,
  schedule,
}: {
  backups: BackupInfo[];
  schedule: BackupScheduleInfo;
}) {
  const latestBackup = backups[0];

  return (
    <section className="grid gap-5">
      <div className="rounded-[1.75rem] border border-stone-200 bg-stone-950 p-6 text-white shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">Centro de respaldo</p>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight">Backup y restauracion</h2>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Guarda una copia de la base de datos y documentos subidos. Los respaldos viven fuera del sitio publico para que solo administracion pueda descargarlos o restaurarlos.
            </p>
          </div>
          <form action={createManualBackupAction}>
            <SubmitButton className="bg-amber-200 text-stone-950 hover:bg-amber-100">
              <DatabaseBackup className="h-4 w-4" aria-hidden="true" />
              Crear backup ahora
            </SubmitButton>
          </form>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Metric label="Ultimo backup" value={latestBackup ? formatDate(latestBackup.createdAt) : "Sin backups"} />
          <Metric label="Backups guardados" value={String(backups.length)} />
          <Metric label="Proximo programado" value={schedule.nextRunAt ? formatDate(schedule.nextRunAt) : "No programado"} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <CalendarClock className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-stone-950">Programar backup</h3>
              <p className="mt-2 leading-7 text-stone-600">
                Define una frecuencia. El sistema ejecuta los respaldos pendientes cuando administracion vuelve a entrar al panel.
              </p>
            </div>
          </div>

          <form action={updateBackupScheduleAction} className="mt-6 grid gap-4">
            <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-800">
              <input name="enabled" type="checkbox" defaultChecked={schedule.enabled} className="h-4 w-4 rounded border-stone-300" />
              Activar backups programados
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-800">
              <span>Frecuencia</span>
              <select
                name="frequency"
                defaultValue={schedule.frequency}
                className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
              >
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-800">
              <span>Hora</span>
              <input
                name="timeOfDay"
                type="time"
                defaultValue={schedule.timeOfDay}
                className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
              />
            </label>

            <SubmitButton variant="secondary">Guardar programacion</SubmitButton>
          </form>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <UploadCloud className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-stone-950">Restaurar</h3>
              <p className="mt-2 leading-7 text-stone-600">
                Selecciona un backup guardado. Antes de restaurar, el sistema crea un backup preventivo y luego cierra la sesion.
              </p>
            </div>
          </div>

          <form action={restoreBackupAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-stone-800">
              <span>Backup a restaurar</span>
              <select
                name="fileName"
                required
                className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
              >
                <option value="">Selecciona un backup</option>
                {backups.map((backup) => (
                  <option key={backup.fileName} value={backup.fileName}>
                    {formatDate(backup.createdAt)} - {reasonLabels[backup.reason] ?? backup.reason}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-800">
              <span>Confirmacion</span>
              <input
                name="confirmation"
                placeholder="Escribe RESTAURAR"
                className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-base outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200"
              />
              <span className="text-xs font-normal text-stone-500">Esta accion reemplaza la base actual y los documentos subidos.</span>
            </label>

            <SubmitButton variant="danger" confirm="Restaurar reemplazara los datos actuales. Continuar?">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restaurar backup
            </SubmitButton>
          </form>
        </article>
      </div>

      <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-stone-950">Historial de backups</h3>
            <p className="mt-2 text-sm text-stone-500">Descarga, conserva o elimina respaldos antiguos.</p>
          </div>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">
            Programacion: {schedule.enabled ? `${frequencyLabels[schedule.frequency]} a las ${schedule.timeOfDay}` : "Inactiva"}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {backups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
              Todavia no hay backups. Crea el primero desde el boton superior.
            </div>
          ) : (
            backups.map((backup) => (
              <div key={backup.fileName} className="rounded-xl border border-stone-200 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-stone-950">{backup.fileName}</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {formatDate(backup.createdAt)} · {backup.reason === "scheduled" ? "Programado" : "Manual"} · {formatBytes(backup.size)} · {backup.uploadCount} archivos
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/backups/${encodeURIComponent(backup.fileName)}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Descargar
                    </Link>
                    <form action={deleteBackupAction}>
                      <input type="hidden" name="fileName" value={backup.fileName} />
                      <SubmitButton variant="ghost" className="min-h-10 px-3 text-rose-700" confirm="Eliminar este backup?">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
