"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ValidationEvent = {
  id: string;
  codeValidation: string;
  decision: "VALIDEE" | "REFUSEE";
  validateurNom: string;
  raisonRefus: string | null;
  createdAt: Date | string;
};

type Mission = {
  id: string;
  reference: string;
  titre: string;
  objectif: string | null;
  statut: string;
  responsable: string | null;
  codeValidation: string | null; // champ MISSION-0001, distinct de codeValidationEnCours
  resultat: string | null;
  testsEffectues: string | null;
  codeValidationEnCours: string | null;
  validations: ValidationEvent[];
};

export default function MissionValidationPanel({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [codeInput, setCodeInput] = useState("");
  const [nomInput, setNomInput] = useState("");
  const [raisonInput, setRaisonInput] = useState("");
  const [mode, setMode] = useState<"idle" | "validate" | "reject">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dernierEvenement = mission.validations[0] ?? null;

  async function submit(action: "validate" | "reject") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/missions/${mission.reference}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "validate"
            ? { code: codeInput, validateurNom: nomInput }
            : { code: codeInput, validateurNom: nomInput, raisonRefus: raisonInput }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue");
        return;
      }
      // Recharge les données serveur (App Router) : preuve que l'état vient bien
      // de la base et pas d'un state local qui disparaîtrait au reload.
      router.refresh();
      setMode("idle");
      setCodeInput("");
      setNomInput("");
      setRaisonInput("");
    } finally {
      setLoading(false);
    }
  }

  // --- État : mission validée (persistant, lu depuis la base) ---
  if (mission.statut === "TERMINEE" && dernierEvenement?.decision === "VALIDEE") {
    return (
      <div className="rounded-lg border-2 border-green-600 bg-green-50 p-4">
        <p className="text-lg font-bold text-green-800">✅ MISSION VALIDÉE</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-green-900">
          <dt className="font-medium">Code utilisé</dt>
          <dd>{dernierEvenement.codeValidation}</dd>
          <dt className="font-medium">Validée par</dt>
          <dd>{dernierEvenement.validateurNom}</dd>
          <dt className="font-medium">Date de validation</dt>
          <dd>{new Date(dernierEvenement.createdAt).toLocaleString("fr-FR")}</dd>
        </dl>
      </div>
    );
  }

  // --- État : pas encore en validation ---
  if (mission.statut !== "EN_VALIDATION") {
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
        Statut actuel : <span className="font-semibold">{mission.statut}</span> — pas de
        validation en attente.
      </div>
    );
  }

  // --- État : EN_VALIDATION — bannière rouge persistante ---
  return (
    <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4">
      <p className="text-lg font-bold text-red-700">🔴 MISSION TERMINÉE — VALIDATION REQUISE</p>
      <p className="mt-1 font-mono text-sm text-red-900">{mission.reference}</p>
      <p className="mt-2 text-sm text-red-900">{mission.resultat}</p>
      <p className="text-sm text-red-800">Tests : {mission.testsEffectues}</p>
      <p className="mt-2 font-mono text-base font-bold text-red-700">
        Code : {mission.codeValidationEnCours}
      </p>

      {mode === "idle" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setMode("validate")}
            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            VALIDER
          </button>
          <button
            onClick={() => setMode("reject")}
            className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            RETOURNER EN CORRECTION
          </button>
        </div>
      )}

      {mode !== "idle" && (
        <div className="mt-4 space-y-2 rounded border border-red-300 bg-white p-3">
          <p className="text-xs text-gray-500">
            ⚠️ Identité déclarative uniquement — aucune authentification réelle à ce stade.
          </p>
          <input
            className="w-full rounded border px-2 py-1 text-sm"
            placeholder="Code de validation (ex: MC-7F42)"
            value={codeInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodeInput(e.target.value)}
          />
          <input
            className="w-full rounded border px-2 py-1 text-sm"
            placeholder="Votre nom"
            value={nomInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNomInput(e.target.value)}
          />
          {mode === "reject" && (
            <textarea
              className="w-full rounded border px-2 py-1 text-sm"
              placeholder="Raison du refus"
              value={raisonInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRaisonInput(e.target.value)}
            />
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={() => submit(mode === "validate" ? "validate" : "reject")}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Confirmer"}
            </button>
            <button
              onClick={() => setMode("idle")}
              className="rounded bg-gray-200 px-3 py-1.5 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
