---
title: Installation Laravel
description: Guide d'installation et de configuration de l'application Laravel
sidebar_position: 1
---

# Installation de l'application Laravel

L'application web Laravel constitue le backend principal du projet Le Coursier. Elle fournit les API nécessaires aux applications mobiles et gère toute la logique métier.

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- **Docker** et **Docker Compose** installés
- Les **services pré-requis** en cours d'exécution (voir [Services](../pre-requisites/services))
- Un compte **Firebase** configuré (voir [Firebase](../pre-requisites/firebase))
- Un compte **Stripe** configuré (voir [Stripe](../pre-requisites/stripe))
- Un compte **Sentry** configuré (voir [Sentry](../pre-requisites/sentry))

## Installation

### 1. Cloner le repository

```bash
git clone <url-du-depot-laravel>
cd lecoursier-laravel
```

### 2. Configuration des variables d'environnement

Copiez le fichier d'exemple et configurez les variables :

```bash
cp .env.example .env
```

### 3. Configuration du fichier .env

Modifiez le fichier `.env` avec vos propres valeurs :

#### Configuration de base

```bash
APP_NAME="Le Coursier"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Configuration de la base de données
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=lecoursier
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

#### Configuration Firebase

```bash
FIREBASE_PROJECT_ID=votre-projet-firebase-id
```

#### Configuration Stripe

```bash
STRIPE_KEY=pk_test_votre_cle_publique
STRIPE_SECRET=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
STRIPE_PRODUCT_ID=prod_votre_id_produit
STRIPE_MONTHLY_PRICE_ID=price_votre_id_prix_mensuel
STRIPE_YEARLY_PRICE_ID=price_votre_id_prix_annuel
```

#### Configuration Sentry

```bash
SENTRY_LARAVEL_DSN=https://votre-dsn@sentry.io/projet-id
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0
```

#### Configuration des emails

```bash
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@lecoursier.app"
MAIL_FROM_NAME="${APP_NAME}"
```

### 4. Configuration Firebase

Placez votre fichier de clé de service Firebase :

```bash
# Créer le répertoire
mkdir -p storage/app/json

# Copier votre fichier service-account.json
cp /chemin/vers/votre/service-account.json storage/app/json/service-account.json

# Définir les permissions
chmod 644 storage/app/json/service-account.json
```

### 5. Démarrer l'application

```bash
# Démarrer les conteneurs
docker compose up -d

# Définir les permissions du fichier .env
docker compose exec app chmod 664 .env

# Générer la clé d'application
docker compose exec app php artisan key:generate

# Exécuter les migrations
docker compose exec app php artisan migrate

# (Optionnel) Exécuter les seeders
docker compose exec app php artisan db:seed
```

## Configuration multi-environnements

Le projet supporte plusieurs environnements :

### Production

- **URL** : `lecoursier.josemokeni.cloud`
- **Service** : `app`
- **Image** : `josemokeni/lecoursier-laravel:latest`
- **Fichier env** : `.env`

### Staging

- **URL** : `lecoursier.staging.josemokeni.cloud`
- **Service** : `app-staging`
- **Image** : `josemokeni/lecoursier-laravel-staging:latest`
- **Fichier env** : `.env.staging`

### Development

- **URL** : `lecoursier.develop.josemokeni.cloud`
- **Service** : `app-develop`
- **Image** : `josemokeni/lecoursier-laravel-develop:latest`
- **Fichier env** : `.env.develop`

### Configuration pour plusieurs environnements

```bash
# Créer les fichiers d'environnement
cp .env.example .env.staging
cp .env.example .env.develop

# Configurer chaque environnement
# Modifier .env.staging avec les valeurs de staging
# Modifier .env.develop avec les valeurs de développement

# Démarrer tous les environnements
docker compose up -d

# Configurer chaque environnement
docker compose exec app-staging chmod 644 .env.staging
docker compose exec app-develop chmod 644 .env.develop

docker compose exec app-staging php artisan key:generate
docker compose exec app-develop php artisan key:generate

docker compose exec app-staging php artisan migrate
docker compose exec app-develop php artisan migrate
```

## Commandes utiles

### Gestion des environnements

```bash
# Production
docker compose exec app <commande>

# Staging
docker compose exec app-staging <commande>

# Development
docker compose exec app-develop <commande>
```

### Commandes Laravel courantes

```bash
# Migrations
docker compose exec app php artisan migrate
docker compose exec app php artisan migrate:rollback
docker compose exec app php artisan migrate:fresh --seed

# Cache
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache

# Queues
docker compose exec app php artisan queue:work
docker compose exec app php artisan queue:restart

# Seeders
docker compose exec app php artisan db:seed
docker compose exec app php artisan db:seed --class=UserSeeder
```

### Logs et débogage

```bash
# Voir les logs en temps réel
docker compose logs -f app

# Accéder au conteneur
docker compose exec app bash

# Voir les logs Laravel
docker compose exec app tail -f storage/logs/laravel.log
```

## Structure de l'application

### Dossiers principaux

```
app/
├── Http/Controllers/API/     # Contrôleurs API pour les mobiles
├── Http/Controllers/Web/     # Contrôleurs pour l'interface web
├── Models/                   # Modèles Eloquent
├── Services/                 # Services métier
├── Notifications/            # Notifications Firebase
└── Jobs/                     # Jobs en arrière-plan

config/
├── database.php             # Configuration DB
├── firebase.php             # Configuration Firebase
├── services.php             # Services externes
└── sentry.php              # Configuration Sentry

routes/
├── api.php                 # Routes API
└── web.php                 # Routes web
```

### Fonctionnalités principales

- **Authentification** : Laravel Sanctum pour les API
- **Paiements** : Laravel Cashier + Stripe
- **Notifications** : Firebase Cloud Messaging
- **Temps réel** : WebSockets via Soketi
- **Géolocalisation** : Services de géolocalisation
- **Administration** : Interface web pour la gestion

## Tests

### Exécuter les tests

```bash
# Tous les tests
docker compose exec app php artisan test

# Tests spécifiques
docker compose exec app php artisan test --filter=UserTest

# Tests avec couverture
docker compose exec app php artisan test --coverage
```

### Types de tests

- **Feature Tests** : Tests d'intégration des API
- **Unit Tests** : Tests unitaires des services
- **Browser Tests** : Tests end-to-end avec Laravel Dusk

## Dépannage

### Problèmes courants

1. **Erreur de permissions** :

   ```bash
   docker compose exec app chmod -R 775 storage bootstrap/cache
   ```

2. **Base de données non accessible** :

   - Vérifiez que les services PostgreSQL sont démarrés
   - Confirmez la configuration réseau Docker

3. **Erreurs Stripe** :

   - Vérifiez les clés API et webhook secret
   - Consultez les logs Stripe dans le dashboard

4. **Notifications Firebase** :
   - Vérifiez le fichier service-account.json
   - Confirmez l'ID du projet Firebase

### Logs importants

```bash
# Logs de l'application
docker compose logs app

# Logs Laravel
docker compose exec app tail -f storage/logs/laravel.log

# Logs des jobs
docker compose exec app php artisan queue:work
```

## Déploiement

### Production avec Docker

L'application utilise Watchtower pour les mises à jour automatiques :

- **Intervalle** : 10 secondes
- **Nettoyage** : Suppression automatique des anciennes images
- **Rolling restart** : Mise à jour sans interruption
- **Basé sur les labels** : Seuls les conteneurs marqués sont mis à jour

### CI/CD

Le projet a été intégré avec :

- **GitHub Actions** : Pour les builds et tests automatiques
- **Docker Hub** : Pour le stockage des images
- **Sentry** : Pour le monitoring des releases

### Variables d'environnement de production

```bash
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

:::tip Conseil
Pour un déploiement en production, utilisez les images Docker pré-construites et configurez les variables d'environnement spécifiques à votre infrastructure.
:::
