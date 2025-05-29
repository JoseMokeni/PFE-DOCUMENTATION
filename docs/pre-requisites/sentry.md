---
title: Sentry
description: Guide de configuration de Sentry pour le projet
sidebar_position: 4
---

# Configuration Sentry

Sentry est utilisé pour le monitoring des erreurs et la surveillance des performances dans le projet Le Coursier.

## Création du compte Sentry

### 1. Créer un compte Sentry

1. Rendez-vous sur [Sentry.io](https://sentry.io)
2. Créez un compte ou connectez-vous à votre compte existant
3. Créez une nouvelle organisation ou utilisez une organisation existante

### 2. Créer les projets

Vous devez créer un projet Sentry pour chaque composant de l'application :

#### 2.1 Projet Laravel (Backend)

1. Cliquez sur "Créer un projet"
2. Sélectionnez la plateforme **Laravel**
3. Donnez un nom au projet : `lecoursier-laravel`
4. Copiez le DSN fourni

#### 2.2 Projet React Native (Applications mobiles)

1. Créez un nouveau projet
2. Sélectionnez la plateforme **React Native**
3. Donnez un nom au projet : `lecoursier-mobile-user` (et/ou `lecoursier-mobile-admin`)
4. Copiez le DSN fourni

## Configuration Laravel

### 1. Installation du package Sentry

Le package Sentry pour Laravel est généralement déjà installé. Si ce n'est pas le cas :

```bash
composer require sentry/sentry-laravel
```

### 2. Configuration des variables d'environnement

Ajoutez ces variables dans votre fichier `.env` Laravel :

```bash
# Configuration Sentry
SENTRY_LARAVEL_DSN=https://votre-dsn@sentry.io/projet-id
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0
```

### 3. Configuration avancée (optionnel)

Créez ou modifiez le fichier `config/sentry.php` pour une configuration personnalisée :

```php
<?php

return [
    'dsn' => env('SENTRY_LARAVEL_DSN'),
    'release' => env('SENTRY_RELEASE'),
    'environment' => env('APP_ENV', 'production'),

    'breadcrumbs' => [
        'logs' => true,
        'cache' => true,
        'livewire' => true,
    ],

    'tracing' => [
        'spans_sample_rate' => env('SENTRY_TRACES_SAMPLE_RATE', 0.0),
        'queue_job_transactions' => true,
        'sql_queries' => true,
        'redis_commands' => true,
    ],

    'profiles_sample_rate' => env('SENTRY_PROFILES_SAMPLE_RATE', 0.0),
];
```

## Configuration Applications Mobiles

### 1. Installation du package Sentry

Dans vos projets React Native/Expo :

```bash
# Installation du package
npx expo install @sentry/react-native

# Configuration automatique
npx @sentry/wizard -i reactNative -p ios android
```

### 2. Configuration des variables d'environnement

Ajoutez dans vos fichiers `.env` des applications mobiles :

```bash
# Configuration Sentry
SENTRY_DSN=https://votre-dsn-mobile@sentry.io/projet-id
SENTRY_DEBUG=true
```

### 3. Configuration dans app.config.js

Ajoutez la configuration Sentry dans votre `app.config.js` :

```javascript
export default {
  // ... autres configurations
  plugins: [
    // ... autres plugins
    [
      "@sentry/react-native/expo",
      {
        organization: "votre-organisation",
        project: "lecoursier-mobile-user",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "votre-project-id-eas",
    },
  },
};
```

### 4. Initialisation dans l'application

Créez ou modifiez votre point d'entrée (généralement `App.js` ou `index.js`) :

```javascript
import * as Sentry from "@sentry/react-native";

// Initialisation de Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  tracesSampleRate: 1.0,
});

// Votre composant App
function App() {
  // ... votre code d'application
}

export default Sentry.wrap(App);
```

## Configuration par environnement

### Variables d'environnement par contexte

#### Production

```bash
SENTRY_LARAVEL_DSN=https://prod-dsn@sentry.io/projet-id
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
SENTRY_RELEASE=v1.0.0
```

#### Staging

```bash
SENTRY_LARAVEL_DSN=https://staging-dsn@sentry.io/projet-id
SENTRY_TRACES_SAMPLE_RATE=0.5
SENTRY_PROFILES_SAMPLE_RATE=0.5
SENTRY_RELEASE=staging
```

#### Développement

```bash
SENTRY_LARAVEL_DSN=https://dev-dsn@sentry.io/projet-id
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0
SENTRY_RELEASE=development
```

## Fonctionnalités avancées

### 1. Release Tracking

Pour suivre les déploiements et versions :

```bash
# Dans votre pipeline CI/CD
sentry-cli releases new "v1.0.0"
sentry-cli releases set-commits "v1.0.0" --auto
sentry-cli releases finalize "v1.0.0"
```

### 2. Source Maps (Applications mobiles)

Pour les builds de production, configurez l'upload des source maps :

```bash
# Dans votre processus de build
npx @sentry/cli upload-sourcemaps ./dist
```

### 3. Alertes personnalisées

Configurez des alertes dans l'interface Sentry :

1. Allez dans **Alerts** → **Rules**
2. Créez des règles pour :
   - Nouvelles erreurs
   - Spike d'erreurs
   - Erreurs critiques
   - Performance dégradée

## Monitoring et utilisation

### 1. Tableaux de bord

Créez des tableaux de bord personnalisés pour :

- **Santé de l'application** : Taux d'erreurs, utilisateurs affectés
- **Performance** : Temps de réponse, throughput
- **Releases** : Impact des déploiements sur la stabilité

### 2. Intégrations

Configurez les intégrations avec :

- **Slack** : Notifications en temps réel
- **Email** : Alertes critiques
- **GitHub** : Liaison avec les commits et PR

### 3. Filtres et échantillonnage

Configurez des filtres pour :

```javascript
// Filtrer les erreurs non critiques
beforeSend(event) {
  if (event.exception) {
    const error = event.exception.values[0];
    if (error.type === 'NetworkError') {
      return null; // Ne pas envoyer les erreurs réseau
    }
  }
  return event;
}
```

## Bonnes pratiques

### 1. Gestion des erreurs

```php
// Laravel : Capture contextuelle
\Sentry\captureException($exception, [
    'user' => ['id' => auth()->id()],
    'extra' => ['order_id' => $orderId],
]);
```

```javascript
// React Native : Capture avec contexte
Sentry.withScope((scope) => {
  scope.setTag("feature", "order-creation");
  scope.setUser({ id: userId });
  Sentry.captureException(error);
});
```

### 2. Performance Monitoring

```php
// Laravel : Transaction personnalisée
$transaction = \Sentry\startTransaction(['name' => 'order.process']);
\Sentry\SentrySdk::getCurrentHub()->setSpan($transaction);

// ... logique métier ...

$transaction->finish();
```

### 3. Breadcrumbs personnalisés

```javascript
// React Native : Breadcrumbs
Sentry.addBreadcrumb({
  message: "User clicked checkout button",
  category: "ui.click",
  data: { orderId: "12345" },
});
```

## Sécurité et confidentialité

:::warning Données sensibles

- **Jamais** envoyer de mots de passe ou tokens dans Sentry
- Utilisez `beforeSend` pour filtrer les données sensibles
- Configurez des règles de scrubbing dans l'interface Sentry
  :::

### Configuration du scrubbing

```javascript
beforeSend(event) {
  // Supprimer les données sensibles
  if (event.request) {
    delete event.request.headers['Authorization'];
    delete event.request.data.password;
  }
  return event;
}
```

## Dépannage

### Problèmes courants

1. **Erreurs non remontées** :

   - Vérifiez le DSN dans les variables d'environnement
   - Confirmez que Sentry est initialisé avant les autres services
   - Vérifiez les quotas du projet Sentry

2. **Performance impact** :

   - Réduisez `traces_sample_rate` en production
   - Utilisez `beforeSend` pour filtrer les erreurs non pertinentes
   - Configurez l'échantillonnage adapté à votre trafic

3. **Source maps manquants** :
   - Vérifiez la configuration d'upload des source maps
   - Assurez-vous que les releases correspondent
   - Confirmez que les source maps sont uploadés avant le déploiement

### Ressources utiles

- [Documentation Sentry Laravel](https://docs.sentry.io/platforms/php/guides/laravel/)
- [Documentation Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [Sentry CLI](https://docs.sentry.io/cli/)
