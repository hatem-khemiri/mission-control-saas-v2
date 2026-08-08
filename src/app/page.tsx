import Link from "next/link";
import NavBar from "@/components/NavBar";
import {
  MISSION_STATUS_LABEL,
  MISSION_STATUS_BADGE_CLASS,
} from "@/lib/missions";
import { MISSIONS } from "@/lib/missionsData";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function HomePage() {
  const total = MISSIONS.length;
  const enCours = MISSIONS.filter((m) => m.statut === "EN_COURS").length;
  const enValidation = MISSIONS.filter(
    (m) => m.statut === "EN_VALIDATION"
  );
  const terminees = MISSIONS.filter((m) => m.statut === "TERMINEE").length;

  const missionsTriees = [...MISSIONS].sort((a, b) => {
    if (a.statut === "EN_VALIDATION" && b.statut !== "EN_VALIDATION") {
      return -1;
    }
    if (b.statut === "EN_VALIDATION" && a.statut !== "EN_VALIDATION") {
      return 1;
    }
    return (
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });

  return (
    <div className="flex min-h-full flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <section className="border-b border-slate-800 pb-8">
          <p className="text-sm font-medium uppercase tracking-widest text-red-500">
            SYS-0001 — Atelier Delta
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Mission Control
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Vue centrale de pilotage des missions : ce qui existe, où ça en
            est, ce qui nécessite une action humaine.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-2xl font-bold text-slate-50">{total}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              Missions totales
            </p>
          </div>

          <div className="rounded-lg border border-blue-900 bg-blue-950/30 p-4">
            <p className="text-2xl font-bold text-blue-300">{enCours}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              En cours
            </p>
          </div>

          <div className="rounded-lg border border-red-800 bg-red-950/30 p-4">
            <p className="text-2xl font-bold text-red-300">
              {enValidation.length}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              En validation
            </p>
          </div>

          <div className="rounded-lg border border-emerald-900 bg-emerald-950/30 p-4">
            <p className="text-2xl font-bold text-emerald-300">{terminees}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              Terminées
            </p>
          </div>
        </section>

        {enValidation.length > 0 && (
          <section className="pb-8">
            <div className="rounded-lg border-2 border-red-600 bg-red-950/40 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-400">
                <span
                  className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500"
                  aria-hidden
                />
                {enValidation.length} mission
                {enValidation.length > 1 ? "s" : ""} en attente de validation
                humaine
              </p>

              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {enValidation.map((m) => (
                  <li key={m.reference}>
                    <Link
                      href={`/missions/${m.reference}`}
                      className="font-mono text-red-300 underline-offset-2 hover:underline"
                    >
                      {m.reference}
                    </Link>{" "}
                    — {m.titre}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="pb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Missions
          </h2>

          <div className="grid gap-3">
            {missionsTriees.map((mission) => (
              <Link
                key={mission.reference}
                href={`/missions/${mission.reference}`}
                className={`block rounded-lg border p-4 transition hover:border-slate-600 ${
                  mission.statut === "EN_VALIDATION"
                    ? "border-red-700 bg-red-950/20"
                    : "border-slate-800 bg-slate-900/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-slate-200">
                        {mission.reference}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${
                          MISSION_STATUS_BADGE_CLASS[mission.statut]
                        }`}
                      >
                        {MISSION_STATUS_LABEL[mission.statut]}
                      </span>
                    </div>

                    <p className="mt-1 font-medium text-slate-100">
                      {mission.titre}
                    </p>

                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      {mission.objectif}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Responsable : {mission.responsable} · Mis à jour le{" "}
                      {formatDate(mission.updatedAt)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition group-hover:bg-slate-800">
                    Ouvrir la mission
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        Mission Control · Atelier Delta · Conforme à SYS-0001 v2.0.0
      </footer>
    </div>
  );
}
