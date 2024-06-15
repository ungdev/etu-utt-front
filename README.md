# etu-utt-front

## Installation du projet (pour le développement)

Entrez les commandes suivantes :

```sh
git clone https://github.com/ungdev/etu-utt-front.git
cd etu-utt-front
pnpm install
cp .env.dist .env.dev
cp .env.dist .env.prod
```

Les 2 fichiers d'environnement sont alors `.env.dev` et `.env.prod`, pour respectivement l'environnement de développement et l'environnement de production.

## Installation de l'add-on

Un add-on Firefox nécessaire pour le fonctionnement de la connexion CAS en local a été développer.
Pour l'installer, vous pouvez aller dans les paramètres des add-ons de firefox, et ajouter un nouvel add-on en tant que fichier (ne pas parcourir le store, il n'est pas stocké en ligne).
Le fichier à ajouter est `devplugin/web-ext-artifacts/<nom de fichier>.xpi`.

Si vous voulez signer l'add-on, vous devez installer web-ext. Vous pouvez ensuite exécuter la commande `web-ext sign --api-key xxx --api-secret xxx`.
Vous pouvez trouver vos identifiants sur https://addons.mozilla.org/en-US/developers/addon/api/key/. Vous devez déjà avoir un compte Mozilla. Si vous n'en avez pas, créez-en un.

## Différentes commandes

### Lancer en mode développement

```sh
pnpm dev
```

Vous pouvez alors aller sur http://localhost:8080. Les modifications que vous ferez au code seront automatiquement appliquées, sans que vous ayez besoin de relancer la commande.

### Build

```sh
pnpm build
```

### Lancer en mode production

```sh
pnpm start
```

Vous pouvez alors aller sur http://localhost:8080.

### Lint le code

```sh
pnpm lint
```

La commande renverra des erreurs si le code ne respecte pas les règles ESLint.

Voir [Lint le code - corrections automatiques](#lint-le-code---corrections-automatiques) pour le lint automatique.

### Lint le code - corrections automatiques

```sh
pnpm lint:fix
```

Le code sera alors linté, à l'aide des règles ESLint. Cela permet de rendre le code plus propre, plus lisibles, et de respecter certaines conventions de code.
Certaines erreurs ne seront cependant pas corrigées automatiquement, et devront être corrigées manuellement. C'est le cas par exemple des variables non utilisées.
