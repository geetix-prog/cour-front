# cour-front

Front d'une app type réseau social basée sur une carte. Les utilisateurs posent des "drops" à un endroit précis, et les autres peuvent les voir sur la carte, les liker et les commenter.

Le backend est une API externe, il n'est pas dans ce repo. Ici on fait uniquement le front.

## Stack

- Next.js 16 (App Router) avec React 19 et TypeScript
- Tailwind CSS 4
- npm

Next 16 a pas mal changé par rapport aux anciennes versions. Avant d'écrire du code Next, regarde la doc qui est dans `node_modules/next/dist/docs/` plutôt que de te fier à ce que tu crois savoir. Par exemple `params` et `searchParams` sont des Promise maintenant, et les types `PageProps` / `LayoutProps` sont générés automatiquement.

## Commandes

```
npm run dev     # serveur de dev
npm run build   # build de prod
npm run lint    # eslint
```

Lance `npm run lint` et `npm run build` avant de dire qu'un truc est fini.

## Fonctionnalités prévues

- carte avec les drops affichés dessus
- créer un drop (position + contenu)
- voir le détail d'un drop
- likes
- commentaires
- comptes utilisateurs (inscription / connexion)

## API

- L'URL de base est dans une variable d'env (`API_URL`), jamais en dur dans le code.
- Tous les appels passent par un seul endroit (`lib/api/`), pas de `fetch` éparpillés dans les composants.
- Les types des réponses sont dans `types/`.
- Si tu ne connais pas la forme d'une route ou d'une réponse, demande. N'invente pas d'endpoint.

## Organisation

```
app/            routes (App Router)
components/     composants réutilisables
lib/api/        client API
types/          types TypeScript partagés
```

## Conventions

- Server Components par défaut, `"use client"` seulement quand il faut (carte, formulaires, boutons like...).
- Le style se fait avec des composants Tailwind bien structurés, directement dans le JSX. Pas de fichiers CSS en plus, sauf vraie nécessité.
- Composants en PascalCase, un composant par fichier.
- Tout le texte de l'interface est en français.
- Pas de nouvelle dépendance sans en parler avant.
