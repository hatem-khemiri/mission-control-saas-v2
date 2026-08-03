import NavBar from "@/components/NavBar";
import MissionValidationAlert from "@/components/MissionValidationAlert";
import { generateValidationCode } from "@/lib/missions";

// Code de fin de mission généré côté serveur, une seule fois par rendu,
// pour rester stable entre le rendu serveur et l'hydratation client.
const CODE_VALIDATION_MISSION_0001 = generateValidationCode();

const piliers = [
  {
    titre: "Missions",
    description:
      "Chaque MISSION-XXXX porte un objectif, un résultat attendu identifiable et un responsable humain (R1, R2).",
  },
  {
    titre: "Preuves & traçabilité",
    description:
      "Aucun résultat n'est considéré acquis sans preuve démontrable et sans historique des décisions (R5, R8).",
  },
  {
    titre: "Validation humaine",
    description:
      "Une mission ne peut jamais être déclarée Terminée sans validation humaine explicite (R6).",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <section className="border-b border-slate-800 pb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-red-500">
            SYS-0001 — Atelier Delta
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Mission Control
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Mission Control est le système interne officiel de pilotage des
            missions d&apos;Atelier Delta. Il permet de qualifier une mission,
            suivre son exécution réelle, réunir ses preuves et déclencher sa
            validation humaine — sans jamais se substituer à la décision
            humaine ni à la méthodologie officielle définie dans DOC-0004.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="/missions"
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Accéder aux missions
            </a>
          </div>
        </section>

        <section className="grid gap-4 py-10 sm:grid-cols-3">
          {piliers.map((pilier) => (
            <div
              key={pilier.titre}
              className="rounded-lg border border-slate-800 bg-slate-900/40 p-5"
            >
              <h2 className="font-semibold text-slate-100">{pilier.titre}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {pilier.description}
              </p>
            </div>
          ))}
        </section>

        <section className="pb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            État courant
          </h2>
          <MissionValidationAlert
            missionId="MISSION-0001"
            titre="Initialisation de Mission Control SaaS V2"
            resultat="base technique Next.js/TypeScript/Tailwind/Prisma initialisée et première interface d'accueil livrée — tests de démarrage effectués."
            code={CODE_VALIDATION_MISSION_0001}
            dateFin={new Date().toLocaleString("fr-FR")}
          />
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        Mission Control · Atelier Delta · Conforme à SYS-0001 v2.0.0
      </footer>
    </div>
  );
}
