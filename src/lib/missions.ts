// Référence méthodologique : DOC-0004 — Méthodologie officielle de gestion des missions
// Référence fonctionnelle   : SYS-0001 — Mission Control — Spécification fonctionnelle officielle
//
// Ce fichier centralise les définitions liées au cycle de vie d'une mission.
// Il ne contient aucune donnée métier fictive : uniquement la mission réelle
// de cette phase d'initialisation (MISSION-0001).

export type MissionStatus =
  | "BROUILLON"
  | "QUALIFIEE"
  | "EN_COURS"
  | "EN_VALIDATION"
  | "TERMINEE"
  | "SUSPENDUE"
  | "ABANDONNEE";

export const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  BROUILLON: "Brouillon",
  QUALIFIEE: "Qualifiée",
  EN_COURS: "En cours",
  EN_VALIDATION: "En validation",
  TERMINEE: "Terminée",
  SUSPENDUE: "Suspendue",
  ABANDONNEE: "Abandonnée",
};

/**
 * Génère un code de fin de mission au format MC-XXXX.
 * Rappel obligatoire (SYS-0001 / DOC-0004, règle R6) :
 * ce code atteste uniquement qu'une fin de mission a été DÉCLARÉE par le développeur.
 * Il ne constitue jamais une validation. Seule une action humaine explicite
 * fait passer la mission de "En validation" à "Terminée".
 */
export function generateValidationCode(): string {
  const chars = "0123456789ABCDEF";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MC-${suffix}`;
}
