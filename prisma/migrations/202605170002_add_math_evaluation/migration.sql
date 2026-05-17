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

CREATE UNIQUE INDEX IF NOT EXISTS "MathEvaluation_studentId_key" ON "MathEvaluation"("studentId");
CREATE INDEX IF NOT EXISTS "MathEvaluation_studentId_idx" ON "MathEvaluation"("studentId");
