import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/missions/[id]/reject
// Body: { code: string, validateurNom: string, raisonRefus: string }
//
// Transition EN_VALIDATION -> EN_COURS ("retour en correction").
// Le code doit également correspondre : on trace QUI a refusé QUOI, avec preuve
// qu'il a bien consulté le bon événement de fin de mission.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

  const mission = await prisma.mission.findUnique({ where: { id: params.id } });
  if (!mission) {
    return NextResponse.json({ error: "Mission introuvable" }, { status: 404 });
  }

  if (mission.statut !== "EN_VALIDATION") {
    return NextResponse.json(
      { error: `Transition invalide : statut actuel ${mission.statut}, attendu EN_VALIDATION` },
      { status: 409 }
    );
  }

  if (!mission.codeValidationEnCours || mission.codeValidationEnCours !== code) {
    return NextResponse.json({ error: "Code de validation incorrect." }, { status: 422 });
  }

  const [updatedMission] = await prisma.$transaction([
    prisma.mission.update({
      where: { id: params.id },
      data: {
        statut: "EN_COURS",
        codeValidationEnCours: null,
      },
    }),
    prisma.missionValidation.create({
      data: {
        missionId: params.id,
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
