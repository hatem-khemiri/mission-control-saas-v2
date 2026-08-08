// ============================================================================
// SOURCE DE DONNÉES TEMPORAIRE — MISSION-0003
// ============================================================================

import type { MissionStatus } from "./missions";

export interface MissionRecord {
  reference: string;
  titre: string;
  objectif: string;
  statut: MissionStatus;
  responsable: string;
  updatedAt: string;
  resultat?: string;
  testsEffectues?: string;
  codeValidation?: string;
}

export const MISSIONS: MissionRecord[] = [
  {
    reference: "MISSION-0001",
    titre: "Initialisation de Mission Control SaaS V2",
    objectif:
      "Bootstrapper l'application Next.js/TypeScript/Tailwind/Prisma et livrer la première interface d'accueil.",
    statut: "EN_VALIDATION",
    responsable: "Lead Developer",
    updatedAt: "2025-01-01T00:00:00.000Z",
    resultat:
      "Base technique initialisée (App Router, Tailwind v4, Prisma). Build, tsc et lint validés. Routes HTTP 200.",
    testsEffectues:
      "npx tsc --noEmit · npm run build · vérification HTTP 200 des routes",
  },
  {
    reference: "MISSION-0002",
    titre: "Cycle de vie des missions & protocole de validation",
    objectif:
      "Ajouter le cycle de vie DOC-0004 au schéma, l'audit de validation, les routes API de fin de mission/validation/refus et la bannière de validation.",
    statut: "EN_VALIDATION",
    responsable: "Lead Developer",
    updatedAt: "2025-01-15T00:00:00.000Z",
    resultat:
      "Schéma, routes API (complete/validate/reject) et bannière de validation livrés. Persistance réelle non prouvée empiriquement (blocage environnemental : pas de connexion PostgreSQL disponible en sandbox).",
    testsEffectues:
      "npx tsc --noEmit · npm run build (composants) · revue manuelle du protocole",
    codeValidation: "MC-7F2A",
  },
  {
    reference: "MISSION-0003",
    titre: "Dashboard Mission Control",
    objectif:
      "Transformer la page d'accueil en dashboard central : indicateurs, liste des missions, mise en avant des missions en validation, navigation vers le détail.",
    statut: "EN_COURS",
    responsable: "Lead Developer",
    updatedAt: new Date().toISOString(),
  },
];

export function getMissionByReference(
  reference: string
): MissionRecord | undefined {
  return MISSIONS.find((m) => m.reference === reference);
}
