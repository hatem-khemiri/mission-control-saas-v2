import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/missions/[id]/validate
// Body: { code: string, validateurNom: string }
//
// Transition EN_VALIDATION -> TERMINEE, UNIQUEMENT si :
//   - la mission est bien en EN_VALIDATION
//   - le code envoyé correspond exactement au codeValidationEnCours stocké en base
//   - un nom de validateur est fourni (identité déclarative — voir limites)
//
// LIMITE ASSUMÉE : `validateurNom` n'est pas authentifié. C'est un texte libre.
// Ce endpoint ne doit jamais être présenté comme une preuve d'identité sécurisée.
// À remplacer par l'identité de session dès que l'authentification réelle existe.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const code = (body?.code ?? "").trim().toUpperCase();
  const validateurNom = (body?.validateurNom ?? "").trim();

  if (!code || !validateurNom) {
    return NextResponse.json(
      { error: "code et validateurNom sont obligatoires" },
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
    return NextResponse.json(
      { error: "Code de validation incorrect. Vérifie la valeur affichée sur la bannière." },
      { status: 422 }
    );
  }

  const [updatedMission] = await prisma.$transaction([
    prisma.mission.update({
      where: { id: params.id },
      data: {
        statut: "TERMINEE",
        codeValidationEnCours: null, // consommé : déplacé dans l'historique ci-dessous
      },
    }),
    prisma.missionValidation.create({
      data: {
        missionId: params.id,
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
