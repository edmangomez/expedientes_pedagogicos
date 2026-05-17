import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? new Date(value) : null));

const optionalText = z
  .string()
  .trim()
  .max(5000, "El texto es demasiado largo.")
  .optional()
  .transform((value) => value || null);

export const studentSchema = z.object({
  fullName: z.string().trim().min(2, "Escribe el nombre del estudiante."),
  admissionDate: optionalDate,
  birthDate: optionalDate,
  gradeSection: z.string().trim().min(1, "Indica grado y sección."),
  diagnosis: z.string().trim().min(1, "Indica el diagnóstico."),
  chronologicalAge: z.string().trim().max(80).optional().transform((value) => value || null),
  teacherName: z.string().trim().min(2, "Indica el docente guía."),
  status: z.enum(["IN_PROCESS", "COMPLETE", "PENDING_PLANS", "NEEDS_REVIEW"]),
});

export const diagnosticSchema = z.object({
  evaluationDate: optionalDate,
  evaluatorName: z.string().trim().max(120).optional().transform((value) => value || null),
  uppercaseLowercaseGraphemeObservation: optionalText,
  simpleSyllablesObservation: optionalText,
  inverseSyllablesObservation: optionalText,
  mixedSyllablesObservation: optionalText,
  compoundSyllablesObservation: optionalText,
  monosyllabicWordsObservation: optionalText,
  bisyllabicWordsObservation: optionalText,
  trisyllabicWordsObservation: optionalText,
  shortSentencesObservation: optionalText,
  longSentencesObservation: optionalText,
  paragraphsObservation: optionalText,
  shortStoriesObservation: optionalText,
  generalObservations: optionalText,
});

export const behaviorSchema = z.object({
  behaviorStatus: z.enum(["ADEQUATE", "OBSERVATION", "NEEDS_SUPPORT", "OTHER"]),
  attitudeObservation: optionalText,
  collaborationObservation: optionalText,
  instructionsObservation: optionalText,
  frustrationToleranceObservation: optionalText,
  teacherInteractionObservation: optionalText,
  relevantBehaviorObservation: optionalText,
  generalObservations: optionalText,
});

export const inattentionSchema = z.object({
  attentionLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  easilyDistractedObservation: optionalText,
  maintainAttentionObservation: optionalText,
  instructionRepetitionObservation: optionalText,
  changesActivityObservation: optionalText,
  constantSupportObservation: optionalText,
  generalObservations: optionalText,
});

export const mathSchema = z.object({
  numberRecognitionObservation: optionalText,
  countingObservation: optionalText,
  basicOperationsObservation: optionalText,
  problemSolvingObservation: optionalText,
  quantityConceptObservation: optionalText,
  sequencesPatternsObservation: optionalText,
  geometricShapesObservation: optionalText,
  generalObservations: optionalText,
});

export const planSchema = z.object({
  partial: z.enum(["FIRST", "SECOND", "THIRD", "FOURTH"]),
  title: z.string().trim().min(2, "Escribe un título para el plan."),
  description: optionalText,
  objectives: optionalText,
  strategies: optionalText,
  resources: optionalText,
  creationDate: optionalDate,
});

export const progressSchema = z.object({
  partial: z.enum(["SECOND", "THIRD", "FOURTH"]),
  recordDate: optionalDate,
  observedProgress: optionalText,
  difficulties: optionalText,
  appliedStrategies: optionalText,
  recommendations: optionalText,
  classroomRecommendations: optionalText,
  progressStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "SIGNIFICANT_PROGRESS", "NEEDS_REINFORCEMENT"]),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
