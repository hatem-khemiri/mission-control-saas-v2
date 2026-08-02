import { randomBytes } from "crypto";

/**
 * Génère un code de validation au format MC-XXXX (4 caractères alphanumériques majuscules).
 * Utilisé uniquement au moment où le développeur déclare une mission terminée.
 * Ce code ne constitue PAS une validation — il doit être renvoyé par l'action
 * humaine de validation pour que le statut change réellement (voir /validate).
 */
export function generateValidationCode(): string {
  const bytes = randomBytes(3);
  const hex = bytes.toString("hex").toUpperCase().slice(0, 4);
  return `MC-${hex}`;
}
