import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/missions/[id]
// Lecture de l'état réel depuis PostgreSQL.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      validations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!mission) {
    return NextResponse.json(
      { error: "Mission introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json(mission);
}
