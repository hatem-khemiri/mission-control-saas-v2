import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/missions/[id]/validate
// Body: { code: string, validateurNom: string }
//
// Transition EN_VALIDATION -> TERMINEE.
// La validation est exclusivement déclenchée par une action humaine explicite.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const code = (body?.code ?? "").trim().toUpperCase();
  const validateurNom = (body?.validateurNom ?? "").trim();

  if (!code || !validateurNom) {
    return NextResponse.json(
      { error: "code et validateurNom sont obligatoires" },
      { status: 400 }
    );
  }

  const mission = await prisma.mission.findUnique({
    where: { id },
  });

  if (!mission) {
    return NextResponse.json(
      { error: "Mission introuvable" },
      { status: 404 }
    );
  }

  if (mission.statut !== "EN_VALIDATION") {
    return NextResponse.json(
      {
        error: `Transition invalide : statut actuel ${mission.statut}, attendu EN_VALIDATION`,
      },
      { status: 409 }
    );
  }

  if (
    !mission.codeValidationEnCours ||
    mission.codeValidationEnCours !== code
  ) {
    return NextResponse.json(
      { error: "Code de validation incorrect." },
      { status: 422 }
    );
  }

  const [updatedMission] = await prisma.$transaction([
    prisma.mission.update({
      where: { id },
      data: {
        statut: "TERMINEE",
        codeValidationEnCours: null,
      },
    }),

    prisma.missionValidation.create({
      data: {
        missionId: id,
        codeValidation: code,
        statutAvant: "EN_VALIDATION",
        statutApres: "TERMINEE",
        decision: "VALIDEE",
        validateurNom,
      },
    }),
  ]);

  return NextResponse.json(updatedMission);
}
