#!/usr/bin/env node
// Détrompeur minimal — MISSION-0004
//
// Empêche UNIQUEMENT la régression déjà observée en MISSION-0003 :
// la page détail d'une mission qui cesse silencieusement d'utiliser le vrai
// composant de validation (MissionValidationPanel, persistance Prisma) pour
// revenir à un composant local fictif (ex: un useState non persistant).
//
// Ce script ne prétend rien vérifier d'autre. Ce n'est pas un framework de
// test général : juste un contrôle statique, exécutable en CI ou en local.
//
// Usage : node scripts/check-validation-wiring.mjs

import { readFileSync, existsSync } from "node:fs";

const PAGE_PATH = "src/app/missions/[id]/page.tsx";

function fail(message) {
  console.error(`❌ Détrompeur validation KO : ${message}`);
  process.exit(1);
}

if (!existsSync(PAGE_PATH)) {
  fail(`fichier introuvable : ${PAGE_PATH}`);
}

const content = readFileSync(PAGE_PATH, "utf8");

if (!content.includes('from "@/components/MissionValidationPanel"')) {
  fail(
    "la page détail n'importe plus MissionValidationPanel (le vrai panneau de validation persistante)."
  );
}

if (!content.includes("<MissionValidationPanel")) {
  fail("MissionValidationPanel est importé mais n'est plus rendu dans la page.");
}

if (content.includes("MissionValidationAlert")) {
  fail(
    "la page détail référence encore MissionValidationAlert (composant local fictif, non persistant). " +
      "Ce composant a été retiré du projet : toute réintroduction dans la page détail est la régression que ce script détecte."
  );
}

console.log(
  "✅ Détrompeur validation OK : la page détail utilise bien MissionValidationPanel (persistance Prisma), " +
    "et ne référence pas le composant fictif MissionValidationAlert."
);
