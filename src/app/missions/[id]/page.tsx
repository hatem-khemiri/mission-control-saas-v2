import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import MissionValidationAlert from "@/components/MissionValidationAlert";
import {
  MISSION_STATUS_LABEL,
  MISSION_STATUS_BADGE_CLASS,
} from "@/lib/missions";
import { getMissionByReference } from "@/lib/missionsData";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mission = getMissionByReference(id);

  if (!mission) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Retour au dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-slate-50">
            {mission.reference}
          </h1>

          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              MISSION_STATUS_BADGE_CLASS[mission.statut]
            }`}
          >
            {MISSION_STATUS_LABEL[mission.statut]}
          </span>
        </div>

        <p className="mt-2 text-lg text-slate-200">{mission.titre}</p>

        <p className="mt-1 text-sm text-slate-500">
          Responsable : {mission.responsable}
        </p>

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Objectif
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            {mission.objectif}
          </p>
        </section>

        {mission.resultat && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Résultat
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              {mission.resultat}
            </p>
          </section>
        )}

        {mission.testsEffectues && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Tests effectués
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              {mission.testsEffectues}
            </p>
          </section>
        )}

        {mission.statut === "EN_VALIDATION" && mission.codeValidation && (
          <section className="mt-8">
            <MissionValidationAlert
              missionId={mission.reference}
              titre={mission.titre}
              resultat={mission.resultat ?? ""}
              code={mission.codeValidation}
              dateFin={new Date(mission.updatedAt).toLocaleString("fr-FR")}
            />
          </section>
        )}
      </main>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        Mission Control · Atelier Delta · Conforme à SYS-0001 v2.0.0
      </footer>
    </div>
  );
}
