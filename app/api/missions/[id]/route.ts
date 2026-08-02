import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/missions/[id]
// Lecture de l'état réel depuis PostgreSQL. Aucune donnée dérivée du navigateur.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: {
      validations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!mission) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  return NextResponse.json(mission);
}
