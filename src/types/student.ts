import type {
  Attachment,
  BehaviorEvaluation,
  DiagnosticEvaluation,
  InattentionEvaluation,
  PedagogicalPlan,
  ProgressRecord,
  Student,
} from "@prisma/client";

export type StudentWithRelations = Student & {
  diagnosticEvaluation: DiagnosticEvaluation | null;
  behaviorEvaluation: BehaviorEvaluation | null;
  inattentionEvaluation: InattentionEvaluation | null;
  pedagogicalPlans: (PedagogicalPlan & { attachments: Attachment[] })[];
  progressRecords: ProgressRecord[];
  attachments: Attachment[];
};

export type StudentListItem = Student & {
  _count: {
    pedagogicalPlans: number;
    progressRecords: number;
  };
};
