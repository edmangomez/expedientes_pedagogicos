import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: Date | string | null) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function toDateInput(date?: Date | string | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function calculateChronologicalAge(birthDate?: Date | string | null) {
  if (!birthDate) return "";
  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (Number.isNaN(years) || years < 0) return "";
  return `${years} años${months ? `, ${months} meses` : ""}`;
}

export function enumLabel(value: string) {
  const labels: Record<string, string> = {
    IN_PROCESS: "En proceso",
    COMPLETE: "Completo",
    PENDING_PLANS: "Planes pendientes",
    NEEDS_REVIEW: "Requiere revisión",
    ADEQUATE: "Adecuada",
    OBSERVATION: "En observación",
    NEEDS_SUPPORT: "Requiere apoyo",
    OTHER: "Otro",
    LOW: "Bajo",
    MEDIUM: "Medio",
    HIGH: "Alto",
    FIRST: "1er parcial",
    SECOND: "2do parcial",
    THIRD: "3er parcial",
    FOURTH: "4to parcial",
    NOT_STARTED: "Sin iniciar",
    IN_PROGRESS: "En proceso",
    SIGNIFICANT_PROGRESS: "Avance significativo",
    NEEDS_REINFORCEMENT: "Requiere refuerzo",
  };

  return labels[value] ?? value;
}

export function statusTone(value: string) {
  if (["COMPLETE", "ADEQUATE", "LOW", "SIGNIFICANT_PROGRESS"].includes(value)) {
    return "success";
  }
  if (["PENDING_PLANS", "OBSERVATION", "MEDIUM", "IN_PROGRESS"].includes(value)) {
    return "warning";
  }
  if (["NEEDS_REVIEW", "NEEDS_SUPPORT", "HIGH", "NEEDS_REINFORCEMENT"].includes(value)) {
    return "danger";
  }
  return "neutral";
}
