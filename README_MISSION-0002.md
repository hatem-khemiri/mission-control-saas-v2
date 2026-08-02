# MISSION-0002 — Guide d'intégration

## 1. Intégration dans le projet réel

1. Copier/fusionner le contenu de `prisma/schema.prisma` dans le schema existant
   (conserver le bloc `generator`/`datasource` déjà en place).
2. Copier `lib/prisma.ts` et `lib/generateValidationCode.ts` dans `lib/`
   (si `lib/prisma.ts` existe déjà, ne garder que l'ajout de logs si pertinent).
3. Copier les dossiers `app/api/missions/[id]/...` et `app/missions/[id]/page.tsx`.
4. Copier `components/MissionValidationPanel.tsx`.

## 2. Migration base de données

```bash
npx prisma migrate dev --name mission_lifecycle_and_validation
npx prisma generate
```

⚠️ Si un modèle `Mission` existe déjà en base avec des valeurs de statut hors du
nouvel enum (ex. ancien `"VALIDATION"` au lieu de `"EN_VALIDATION"`), la migration
échouera au niveau de l'`ALTER TYPE`. Dans ce cas, écrire une migration de données
manuelle (`UPDATE "Mission" SET statut = 'EN_VALIDATION' WHERE statut = 'VALIDATION'`)
**avant** de relancer `migrate dev`. Ne jamais forcer un reset qui perdrait des données.

## 3. Créer une mission de test (seed rapide)

```ts
// prisma/seed-test-mission.ts (à exécuter une fois avec `npx tsx prisma/seed-test-mission.ts`)
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.mission.create({
    data: {
      code: "MISSION-0001",
      titre: "Audit fonctionnel initial",
      statut: "EN_COURS",
    },
  });
}
main().then(() => process.exit(0));
```

## 4. Protocole de test manuel — critère de MISSION-0002

1. Récupérer l'`id` de la mission créée (via Prisma Studio : `npx prisma studio`).
2. Aller sur `/missions/<id>`.
3. Appeler `POST /api/missions/<id>/complete` avec :
   ```json
   { "resultat": "Résultat disponible — tests effectués.", "testsEffectues": "Tests manuels OK" }
   ```
   (ex. via `curl`, Postman, ou un formulaire à ajouter dans une prochaine mission).
4. Recharger `/missions/<id>` → la bannière rouge doit apparaître, avec le code `MC-XXXX`
   affiché (celui **lu depuis la base**, pas généré côté client).
5. Cliquer **VALIDER**, saisir le code exact + un nom, confirmer.
6. Constater `✅ MISSION VALIDÉE` avec code, validateur, date.
7. **Recharger complètement la page (F5) et/ou redémarrer `npm run dev`.**
8. Constater que `✅ MISSION VALIDÉE` est toujours affiché, avec les mêmes informations.
   → C'est ce rechargement qui prouve la persistance PostgreSQL réelle.

Test du chemin de refus : répéter les étapes 1-4, cliquer **RETOURNER EN CORRECTION**,
saisir un code faux → doit être rejeté (422) ; saisir le bon code + raison → la mission
repasse en `EN_COURS`, et l'événement de refus reste consultable via
`GET /api/missions/<id>` (`validations[]`).

## 5. Limites assumées — à ne jamais présenter comme résolues

- **Identité du validateur non authentifiée.** Le champ "nom" est déclaratif. Pour la
  remplacer par une vraie identité : injecter `session.user.name` (NextAuth ou équivalent)
  à la place du champ libre dans `MissionValidationPanel.tsx`, et supprimer l'input.
- **Pas d'autorisation par rôle.** N'importe qui accédant à la page peut valider ou
  refuser. À corriger avec l'authentification réelle (vérifier un rôle "validateur").
- **Pas de protection contre les doubles soumissions concurrentes** (deux validations
  simultanées) au-delà de la vérification atomique du statut dans la transaction Prisma.
