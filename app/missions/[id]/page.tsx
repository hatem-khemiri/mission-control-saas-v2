import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MissionValidationPanel from "@/components/MissionValidationPanel";

// Server Component : lecture directe depuis PostgreSQL à chaque requête / reload.
// Aucun cache client, aucun state local ne détermine cet affichage.
export default async function MissionPage({ params }: { params: { id: string } }) {
  const mission = await prisma.mission.findUnique({
    where: { id: params.id },
    include: { validations: { orderBy: { createdAt: "desc" } } },
  });

  if (!mission) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-bold">{mission.titre}</h1>
      <p className="text-sm text-gray-500">{mission.code}</p>
      <div className="mt-4">
        <MissionValidationPanel mission={mission} />
      </div>
    </main>
  );
}
