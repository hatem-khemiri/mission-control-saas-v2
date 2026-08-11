import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import MissionValidationPanel from "@/components/MissionValidationPanel";
import {
  MISSION_STATUS_LABEL,
  MISSION_STATUS_BADGE_CLASS,
} from "@/lib/missions";
import { prisma } from "@/lib/prisma";

// MISSION-0004 : cette page lit désormais l'état réel de la mission depuis
// PostgreSQL (via Prisma), et non plus depuis src/lib/missionsData.ts.
// [id] est la référence publique de la mission (ex: MISSION-0001) — c'est ce
// qui est utilisé pour la recherche (Mission.reference), jamais l'id interne.
//
// Le tableau de bord (/) et la liste (/missions) restent volontairement
// alimentés par missionsData.ts : ce n'est pas le périmètre de MISSION-0004
// (voir DELIVERY-MISSION-0004.md, section "Points connus").
export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const mission = await prisma.mission.findUnique({
    where: { reference: id },
    include: {
      validations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

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

        {/*
          Panneau de validation réel (MISSION-0002/MISSION-0004) : persistance
          PostgreSQL via /api/missions/[id]/validate et /reject. Rendu
          inconditionnel : le panneau gère lui-même l'affichage selon le
          statut (en attente / validée persistée / pas de validation en
          cours). Remplace définitivement l'ancien composant d'alerte à état
          local (useState, non persistant), qui a été retiré du projet.
        */}
        <section className="mt-8">
          <MissionValidationPanel mission={mission} />
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        Mission Control · Atelier Delta · Conforme à SYS-0001 v2.0.0
      </footer>
    </div>
  );
}
