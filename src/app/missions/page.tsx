import NavBar from "@/components/NavBar";
import { MISSION_STATUS_LABEL, type MissionStatus } from "@/lib/missions";

// Cette liste n'est PAS un jeu de données fictif : elle reflète l'unique
// mission réellement exécutée à ce stade (MISSION-0001). La persistance en
// base PostgreSQL via Prisma (cf. prisma/schema.prisma) sera branchée dans
// une mission ultérieure dédiée à la gestion des missions (CRUD + DB).
const missions: {
  reference: string;
  titre: string;
  statut: MissionStatus;
  responsable: string;
}[] = [
  {
    reference: "MISSION-0001",
    titre: "Initialisation de Mission Control SaaS V2",
    statut: "EN_VALIDATION",
    responsable: "Lead Developer",
  },
];

export default function MissionsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <NavBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-50">Missions</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Liste des missions suivies par Mission Control. La création de
          mission, le filtrage, le scoring et le score santé seront ajoutés
          progressivement, conformément à SYS-0001.
        </p>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Référence</th>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission) => (
                <tr
                  key={mission.reference}
                  className="border-t border-slate-800 hover:bg-slate-900/40"
                >
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {mission.reference}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{mission.titre}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-amber-700 bg-amber-950/40 px-2.5 py-0.5 text-xs text-amber-300">
                      {MISSION_STATUS_LABEL[mission.statut]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {mission.responsable}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-600">
        Mission Control · Atelier Delta · Conforme à SYS-0001 v2.0.0
      </footer>
    </div>
  );
}
