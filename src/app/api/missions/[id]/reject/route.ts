import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/missions/[id]/reject
// Body: { code: string, validateurNom: string, raisonRefus: string }
//
// Transition EN_VALIDATION -> EN_COURS.
// Le refus est une décision humaine et la raison est conservée dans l'historique.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const code = (body?.code ?? "").trim().toUpperCase();
  const validateurNom = (body?.validateurNom ?? "").trim();
  const raisonRefus = (body?.raisonRefus ?? "").trim();

  if (!code || !validateurNom || !raisonRefus) {
    return NextResponse.json(
      { error: "code, validateurNom et raisonRefus sont obligatoires" },
      { status: 400 }
    );
  }

  const mission = await prisma.mission.findUnique({
    where: { reference: id },
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
      where: { reference: id },
      data: {
        statut: "EN_COURS",
        codeValidationEnCours: null,
      },
    }),

    prisma.missionValidation.create({
      data: {
        // FK réelle : MissionValidation.missionId référence Mission.id (cuid interne),
        // pas Mission.reference. Utiliser mission.id trouvé ci-dessus.
        missionId: mission.id,
        codeValidation: code,
        statutAvant: "EN_VALIDATION",
        statutApres: "EN_COURS",
        decision: "REFUSEE",
        validateurNom,
        raisonRefus,
      },
    }),
  ]);

  return NextResponse.json(updatedMission);
}
