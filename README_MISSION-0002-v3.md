# MISSION-0002 v3 — Correction finale du schéma (sans régression)

## 1. Contrôle de régression MISSION-0001 → MISSION-0002 v3

**MISSION-0001 conservé intégralement (aucune suppression, aucun renommage) :**

| Champ | Statut v3 |
|---|---|
| `id` | conservé |
| `reference` | conservé — reste l'identifiant fonctionnel unique |
| `titre` | conservé |
| `objectif` | **conservé** (supprimé par erreur en v2, réintégré) |
| `statut` | conservé |
| `responsable` | **conservé** (supprimé par erreur en v2, réintégré) |
| `codeValidation` | **conservé** (supprimé par erreur en v2, réintégré) — champ MISSION-0001, non réutilisé par la logique MISSION-0002 |
| `createdAt` | conservé |
| `updatedAt` | conservé |

**MISSION-0002 ajouté (aucun conflit de nom avec l'existant) :**

- `resultat`
- `testsEffectues`
- `codeValidationEnCours` — **distinct** de `Mission.codeValidation` (v1) : nom différent, rôle différent (code en attente de vérification pour le cycle de validation MISSION-0002), pas de collision.
- `declaredCompleteAt`
- relation `validations` → modèle `MissionValidation`
- modèle `MissionValidation` (nouveau)
- enum `ValidationDecision` (nouveau)

Contrôle automatique effectué avant packaging : recherche de résidus de l'ancien champ inventé `description` (absent), recherche de résidus de l'ancienne convention `mission.code`/`params.id`/`[id]` (absents), vérification que `reference` est utilisé de façon cohérente dans tous les fichiers livrés.

## 2. Ce qui reste une hypothèse — à vérifier avant migration

Je connais les **noms** de `objectif`, `responsable`, `codeValidation` (fournis par toi), mais pas leur **type exact** ni leur **nullabilité réelle** dans le schéma MISSION-0001 d'origine. J'ai posé par défaut :

- `objectif String?`
- `responsable String?`
- `codeValidation String?`

**Point de risque le plus élevé : `responsable`.** Si dans MISSION-0001 c'est en réalité une **relation** vers un modèle `User`/`Utilisateur` (et non un simple texte), la définition scalaire ci-dessus est fausse et casserait la contrainte de clé étrangère existante si elle était appliquée telle quelle. **Vérifie ce point avant toute migration** — si c'est une relation, remplace le champ par la relation réelle (le reste du schéma n'en dépend pas).

Si `objectif` ou `codeValidation` sont en réalité `NOT NULL` dans ton schéma actuel, retire le `?` correspondant avant de migrer.

## 3. Fichiers livrés

Identiques à la structure v2 (`src/app/`, `src/components/`, `src/lib/`, `prisma/`), avec :
- `prisma/schema.prisma` corrigé (section 1).
- `src/components/MissionValidationPanel.tsx` : type TypeScript `Mission` mis à jour pour inclure `objectif`, `responsable`, `codeValidation` (cohérence de typage uniquement — **aucun affichage supplémentaire ajouté**, hors périmètre de MISSION-0002).
- Aucun autre fichier modifié par rapport à v2 (routes API et page serveur inchangées : elles ne sélectionnent pas de champs spécifiques, donc `objectif`/`responsable`/`codeValidation` transitent déjà automatiquement dans les réponses JSON sans modification de code nécessaire).

**Remarque sur `src/app/missions/[reference]/page.tsx`** : cette page reste volontairement minimale (titre, référence, panneau de validation). Si MISSION-0001 a déjà une page de détail de mission affichant `objectif`/`responsable`/`codeValidation`, **ne pas écraser ce fichier** — importer plutôt `<MissionValidationPanel mission={mission} />` dans la page existante.

## 4. Installation

Fusionner chaque fichier à l'emplacement identique. Vérifier l'alias `"@/*": ["./src/*"]` dans `tsconfig.json`.

## 5. Commandes Prisma

**Non exécutées à ce stade, conformément à ta consigne.** Quand tu seras prêt :

```bash
npx prisma migrate dev --name mission_lifecycle_and_validation
npx prisma generate
```

⚠️ Avant cette commande : résoudre le point de risque `responsable` (section 2), et vérifier la nullabilité de `objectif`/`codeValidation` contre ton schéma réel.

## 6. Tests à effectuer (une fois la migration faite, hors périmètre de cette livraison)

Identique au protocole v2 : déclarer une mission terminée (`/complete`) → recharger → valider avec le code → recharger → constater la persistance. Détails complets dans le message de livraison v2 précédent si besoin de les reformuler ici.

## 7. Limites connues (inchangées)

- Identité du validateur non authentifiée (texte libre).
- Pas d'autorisation par rôle.
- Pas de protection contre les doubles soumissions concurrentes au-delà de la transaction Prisma atomique.
- Bloc `generator`/`datasource` toujours non vérifié en direct.
- Types de `objectif`/`responsable`/`codeValidation` non confirmés (section 2).

## 8. Statut

**Non déclarée terminée.** Cette livraison est une correction de schéma préalable à intégration, conformément à la consigne.
