"use client";

import Link from "next/link";
import { useState } from "react";

type EtatAlerte = "en_validation" | "validee" | "en_correction";

interface MissionValidationAlertProps {
  missionId: string;
  titre: string;
  resultat: string;
  code: string;
  dateFin: string;
}

/**
 * Bannière obligatoire de fin de mission (protocole Mission Control).
 *
 * Règle fondamentale : la génération du code signifie uniquement que le
 * développeur DÉCLARE la mission terminée et DEMANDE sa validation.
 * Cela ne signifie jamais que la mission est officiellement validée.
 * Seule une action humaine explicite sur cette bannière peut faire passer
 * la mission de "En validation" à "Terminée".
 */
export default function MissionValidationAlert({
  missionId,
  titre,
  resultat,
  code,
  dateFin,
}: MissionValidationAlertProps) {
  const [etat, setEtat] = useState<EtatAlerte>("en_validation");
  const [motifRefus, setMotifRefus] = useState<string | null>(null);

  if (etat === "validee") {
    return (
      <div className="rounded-lg border border-emerald-700 bg-emerald-950/40 px-5 py-4 text-sm">
        <p className="font-semibold text-emerald-400">
          MISSION VALIDÉE — {missionId}
        </p>
        <p className="mt-1 text-slate-300">
          Validation humaine enregistrée. Statut : Terminée. Code de fin de
          mission conservé dans l&apos;historique :{" "}
          <span className="font-mono text-emerald-300">{code}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-red-600 bg-red-950/50 shadow-[0_0_0_1px_rgba(220,38,38,0.4)]">
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="flex-1">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-400">
            <span
              className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500"
              aria-hidden
            />
            Mission terminée — validation requise
          </p>

          <p className="mt-2 font-mono text-base font-semibold text-slate-100">
            {missionId}
          </p>
          <p className="text-sm text-slate-300">{titre}</p>

          {etat === "en_correction" ? (
            <p className="mt-2 rounded border border-amber-700 bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
              Retournée en correction. Motif :{" "}
              {motifRefus ?? "à préciser par le validateur."} Une nouvelle
              demande de validation devra être générée après correction.
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-300">
              Résultat disponible — {resultat}
            </p>
          )}

          <p className="mt-3 text-sm">
            Code :{" "}
            <span className="font-mono font-bold text-red-300">{code}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Fin déclarée le {dateFin}. Statut fonctionnel actuel :{" "}
            {etat === "en_correction" ? "En correction" : "En validation"}.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/missions"
              className="rounded border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              Ouvrir la mission
            </Link>
            <button
              type="button"
              onClick={() => setEtat("validee")}
              className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => {
                const motif = window.prompt(
                  "Motif du retour en correction (obligatoire) :"
                );
                setMotifRefus(motif && motif.trim() ? motif.trim() : "non précisé");
                setEtat("en_correction");
              }}
              className="rounded border border-amber-600 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-950/40"
            >
              Retourner en correction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
