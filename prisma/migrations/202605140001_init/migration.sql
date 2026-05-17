PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "Student" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "admissionDate" DATETIME,
  "birthDate" DATETIME,
  "gradeSection" TEXT NOT NULL,
  "diagnosis" TEXT NOT NULL,
  "chronologicalAge" TEXT,
  "teacherName" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'IN_PROCESS',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" DATETIME
);

CREATE TABLE IF NOT EXISTS "DiagnosticEvaluation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "evaluationDate" DATETIME,
  "evaluatorName" TEXT,
  "uppercaseLowercaseGraphemeObservation" TEXT,
  "simpleSyllablesObservation" TEXT,
  "inverseSyllablesObservation" TEXT,
  "mixedSyllablesObservation" TEXT,
  "compoundSyllablesObservation" TEXT,
  "monosyllabicWordsObservation" TEXT,
  "bisyllabicWordsObservation" TEXT,
  "trisyllabicWordsObservation" TEXT,
  "shortSentencesObservation" TEXT,
  "longSentencesObservation" TEXT,
  "paragraphsObservation" TEXT,
  "shortStoriesObservation" TEXT,
  "generalObservations" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DiagnosticEvaluation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BehaviorEvaluation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "behaviorStatus" TEXT NOT NULL DEFAULT 'OBSERVATION',
  "attitudeObservation" TEXT,
  "collaborationObservation" TEXT,
  "instructionsObservation" TEXT,
  "frustrationToleranceObservation" TEXT,
  "teacherInteractionObservation" TEXT,
  "relevantBehaviorObservation" TEXT,
  "generalObservations" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BehaviorEvaluation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "InattentionEvaluation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "attentionLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
  "easilyDistractedObservation" TEXT,
  "maintainAttentionObservation" TEXT,
  "instructionRepetitionObservation" TEXT,
  "changesActivityObservation" TEXT,
  "constantSupportObservation" TEXT,
  "generalObservations" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InattentionEvaluation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "MathEvaluation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "numberRecognitionObservation" TEXT,
  "countingObservation" TEXT,
  "basicOperationsObservation" TEXT,
  "problemSolvingObservation" TEXT,
  "quantityConceptObservation" TEXT,
  "sequencesPatternsObservation" TEXT,
  "geometricShapesObservation" TEXT,
  "generalObservations" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MathEvaluation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PedagogicalPlan" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "partial" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "objectives" TEXT,
  "strategies" TEXT,
  "resources" TEXT,
  "creationDate" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PedagogicalPlan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProgressRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "partial" TEXT NOT NULL,
  "recordDate" DATETIME,
  "observedProgress" TEXT,
  "difficulties" TEXT,
  "appliedStrategies" TEXT,
  "recommendations" TEXT,
  "classroomRecommendations" TEXT,
  "progressStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProgressRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Attachment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "planId" TEXT,
  "fileName" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Attachment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Attachment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PedagogicalPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "DiagnosticEvaluation_studentId_key" ON "DiagnosticEvaluation"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "BehaviorEvaluation_studentId_key" ON "BehaviorEvaluation"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "InattentionEvaluation_studentId_key" ON "InattentionEvaluation"("studentId");
CREATE UNIQUE INDEX IF NOT EXISTS "MathEvaluation_studentId_key" ON "MathEvaluation"("studentId");
CREATE INDEX IF NOT EXISTS "Student_fullName_idx" ON "Student"("fullName");
CREATE INDEX IF NOT EXISTS "Student_gradeSection_idx" ON "Student"("gradeSection");
CREATE INDEX IF NOT EXISTS "Student_diagnosis_idx" ON "Student"("diagnosis");
CREATE INDEX IF NOT EXISTS "Student_teacherName_idx" ON "Student"("teacherName");
CREATE INDEX IF NOT EXISTS "Student_status_idx" ON "Student"("status");
CREATE INDEX IF NOT EXISTS "Student_updatedAt_idx" ON "Student"("updatedAt");
CREATE INDEX IF NOT EXISTS "PedagogicalPlan_studentId_idx" ON "PedagogicalPlan"("studentId");
CREATE INDEX IF NOT EXISTS "PedagogicalPlan_partial_idx" ON "PedagogicalPlan"("partial");
CREATE INDEX IF NOT EXISTS "ProgressRecord_studentId_idx" ON "ProgressRecord"("studentId");
CREATE INDEX IF NOT EXISTS "ProgressRecord_partial_idx" ON "ProgressRecord"("partial");
CREATE INDEX IF NOT EXISTS "ProgressRecord_progressStatus_idx" ON "ProgressRecord"("progressStatus");
CREATE INDEX IF NOT EXISTS "MathEvaluation_studentId_idx" ON "MathEvaluation"("studentId");
CREATE INDEX IF NOT EXISTS "Attachment_studentId_idx" ON "Attachment"("studentId");
CREATE INDEX IF NOT EXISTS "Attachment_planId_idx" ON "Attachment"("planId");

PRAGMA foreign_keys=ON;
