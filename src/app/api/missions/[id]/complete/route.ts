import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateValidationCode } from "@/lib/generateValidationCode";

// POST /api/missions/[id]/complete
// Body: { resultat: string, testsEffectues: string }
//
// Transition EN_COURS -> EN_VALIDATION.
// Génère un code MC-XXXX et le persiste sur la mission.
// Ceci ne valide rien : c'est uniquement la déclaration du développeur.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json().catch(() => null);

  if (!body?.resultat || !body?.testsEffectues) {
    return NextResponse.json(
      { error: "resultat et testsEffectues sont obligatoires" },
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

  if (mission.statut !== "EN_COURS") {
    return NextResponse.json(
      {
        error: `Transition invalide : la mission est en statut ${mission.statut}, pas EN_COURS`,
      },
      { status: 409 }
    );
  }

  const code = generateValidationCode();

  const updated = await prisma.mission.update({
    where: { id },
    data: {
      statut: "EN_VALIDATION",
      resultat: body.resultat,
      testsEffectues: body.testsEffectues,
      codeValidationEnCours: code,
      declaredCompleteAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
