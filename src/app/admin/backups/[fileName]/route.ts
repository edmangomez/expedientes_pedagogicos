import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readBackupForDownload } from "@/lib/backup";

export async function GET(_request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  await requireAdmin();
  const { fileName } = await params;
  const backup = await readBackupForDownload(decodeURIComponent(fileName));

  return new NextResponse(backup.bytes, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${backup.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
