// Référence méthodologique : DOC-0004 — Méthodologie officielle de gestion des missions
// Référence fonctionnelle   : SYS-0001 — Mission Control — Spécification fonctionnelle officielle
//
// Ce fichier centralise les définitions liées au cycle de vie d'une mission.
//
// MissionStatus est réexporté depuis @prisma/client (source de vérité du
// modèle de données) plutôt que redéfini ici. Avant MISSION-0004, ce fichier
// dupliquait manuellement les valeurs de l'enum Prisma MissionStatus, et cette
// copie avait dérivé : il manquait PLANIFIEE et ARCHIVEE (présents dans
// prisma/schema.prisma). Cela aurait cassé la compilation dès qu'une mission
// réelle (issue de Prisma) était affichée avec ces statuts. Correction
// indispensable au raccordement MISSION-0004 (page détail lisant désormais
// Prisma) : un seul type MissionStatus, synchronisé avec le schéma.
import type { MissionStatus as PrismaMissionStatus } from "@prisma/client";

export type MissionStatus = PrismaMissionStatus;

export const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  BROUILLON: "Brouillon",
  QUALIFIEE: "Qualifiée",
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  EN_VALIDATION: "En validation",
  TERMINEE: "Terminée",
  ARCHIVEE: "Archivée",
  SUSPENDUE: "Suspendue",
  ABANDONNEE: "Abandonnée",
};

export const MISSION_STATUS_BADGE_CLASS: Record<MissionStatus, string> = {
  BROUILLON: "border-slate-600 bg-slate-800/60 text-slate-300",
  QUALIFIEE: "border-sky-700 bg-sky-950/40 text-sky-300",
  PLANIFIEE: "border-sky-700 bg-sky-950/40 text-sky-300",
  EN_COURS: "border-blue-700 bg-blue-950/40 text-blue-300",
  EN_VALIDATION: "border-red-600 bg-red-950/50 text-red-300",
  TERMINEE: "border-emerald-700 bg-emerald-950/40 text-emerald-300",
  ARCHIVEE: "border-slate-600 bg-slate-800/60 text-slate-300",
  SUSPENDUE: "border-amber-700 bg-amber-950/40 text-amber-300",
  ABANDONNEE: "border-rose-800 bg-rose-950/40 text-rose-400",
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
