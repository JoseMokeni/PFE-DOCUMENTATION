---
title: Guide de Dépannage
description: Solutions aux problèmes courants du projet Le Coursier
sidebar_position: 3
---

# Guide de Dépannage

Ce guide présente les solutions aux problèmes les plus fréquents rencontrés lors de l'installation et de l'utilisation du projet Le Coursier.

## Problèmes d'infrastructure

### Services Docker ne démarrent pas

#### Symptômes

- Erreurs lors du `docker-compose up`
- Conteneurs qui s'arrêtent immédiatement
- Ports déjà utilisés

#### Solutions

**1. Vérifier les réseaux Docker**

```bash
# Créer les réseaux manquants
docker network create lecoursier
docker network create traefik-public

# Lister les réseaux existants
docker network ls
```

**2. Libérer les ports occupés**

```bash
# Vérifier les ports utilisés
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Arrêter les services conflictuels
sudo systemctl stop apache2  # ou nginx
```

**3. Nettoyer Docker**

```bash
# Arrêter tous les conteneurs
docker-compose down

# Nettoyer les ressources inutilisées
docker system prune -f

# Redémarrer Docker
sudo systemctl restart docker
```

### Base de données PostgreSQL inaccessible

#### Symptômes

- Erreurs de connexion depuis Laravel
- pgAdmin ne se connecte pas
- Messages "Connection refused"

#### Solutions

**1. Vérifier le statut du conteneur**

```bash
# Vérifier que PostgreSQL fonctionne
docker-compose ps postgres

# Voir les logs PostgreSQL
docker-compose logs postgres
```

**2. Tester la connexion**

```bash
# Se connecter directement au conteneur
docker-compose exec postgres psql -U postgres -d lecoursier

# Tester depuis l'extérieur
telnet localhost 5432
```

**3. Réinitialiser la base de données**

```bash
# Supprimer les volumes
docker-compose down -v

# Redémarrer avec volumes propres
docker-compose up -d
```

### Redis non accessible

#### Symptômes

- Cache Laravel non fonctionnel
- Sessions perdues
- Erreurs "Connection refused"

#### Solutions

**1. Vérifier Redis**

```bash
# Statut du conteneur Redis
docker-compose ps redis

# Logs Redis
docker-compose logs redis

# Test de connexion
docker-compose exec redis redis-cli ping
```

**2. Vider le cache Redis**

```bash
# Se connecter à Redis
docker-compose exec redis redis-cli

# Vider toutes les données
FLUSHALL
```

## Problèmes Backend Laravel

### Application Laravel ne démarre pas

#### Symptômes

- Page blanche ou erreur 500
- Erreurs dans les logs
- Variables d'environnement manquantes

#### Solutions

**1. Vérifier les permissions**

```bash
# Permissions des fichiers
docker-compose exec app chmod -R 775 storage bootstrap/cache

# Permissions du fichier .env
docker-compose exec app chmod 664 .env
```

**2. Vérifier la configuration**

```bash
# Régénérer la clé d'application
docker-compose exec app php artisan key:generate

# Vérifier la configuration
docker-compose exec app php artisan config:show

# Nettoyer le cache
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
```

**3. Vérifier les logs**

```bash
# Logs du conteneur
docker-compose logs app

# Logs Laravel
docker-compose exec app tail -f storage/logs/laravel.log
```

### Migrations échouent

#### Symptômes

- Erreurs lors de `php artisan migrate`
- Tables manquantes
- Erreurs de contraintes

#### Solutions

**1. Vérifier la connexion DB**

```bash
# Tester la connexion
docker-compose exec app php artisan db:show

# Vérifier les variables d'environnement
docker-compose exec app php artisan env
```

**2. Réinitialiser les migrations**

```bash
# Migration propre
docker-compose exec app php artisan migrate:fresh

# Migration avec seeders
docker-compose exec app php artisan migrate:fresh --seed
```

**3. Migration manuelle**

```bash
# Voir le statut des migrations
docker-compose exec app php artisan migrate:status

# Migrer étape par étape
docker-compose exec app php artisan migrate --step
```

### API non accessible

#### Symptômes

- Erreurs 404 sur les routes API
- CORS bloquées
- Authentification échoue

#### Solutions

**1. Vérifier les routes**

```bash
# Lister les routes API
docker-compose exec app php artisan route:list --path=api

# Nettoyer le cache des routes
docker-compose exec app php artisan route:clear
```

**2. Vérifier CORS**

```bash
# Publier la configuration CORS
docker-compose exec app php artisan vendor:publish --tag="cors"

# Vérifier la configuration
docker-compose exec app cat config/cors.php
```

**3. Tester l'API**

```bash
# Test direct avec curl
curl -X GET http://localhost:8000/api/health

# Test avec authentification
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/user
```

## Problèmes Applications Mobiles

### Application ne compile pas

#### Symptômes

- Erreurs Metro/Expo
- Dépendances manquantes
- Erreurs de build Android/iOS

#### Solutions

**1. Nettoyer l'environnement**

```bash
# Nettoyer le cache Metro
npx expo start --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install

# Nettoyer le build
rm -rf .expo
```

**2. Problèmes Android**

```bash
# Nettoyer le build Android
cd android
./gradlew clean
cd ..

# Régénérer le code natif
npx expo prebuild --clean --platform android
```

**3. Problèmes iOS**

```bash
# Nettoyer les pods iOS
cd ios
rm -rf Pods
pod install
cd ..

# Régénérer le code natif
npx expo prebuild --clean --platform ios
```

### Application ne se connecte pas à l'API

#### Symptômes

- Erreurs réseau
- Timeouts de connexion
- API unreachable

#### Solutions

**1. Vérifier les URLs**

```bash
# Variables d'environnement
cat .env | grep API_URL

# Test de connectivité
curl -I http://10.0.2.2:8000  # Émulateur Android
curl -I http://localhost:8000  # Simulateur iOS
```

**2. Configuration réseau par appareil**

**Émulateur Android :**

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
EXPO_PUBLIC_PUSHER_HOST=http://10.0.2.2
```

**Simulateur iOS :**

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_PUSHER_HOST=http://localhost
```

**Appareil physique :**

```bash
# Remplacer par l'IP de votre machine
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
EXPO_PUBLIC_PUSHER_HOST=http://192.168.1.100
```

**3. Vérifier le pare-feu**

```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 8000

# CentOS/RHEL
sudo firewall-cmd --list-ports
sudo firewall-cmd --add-port=8000/tcp --permanent
```

### Notifications push non reçues

#### Symptômes

- Notifications ne s'affichent pas
- Erreurs Firebase
- Token invalide

#### Solutions

**1. Vérifier la configuration Firebase**

```bash
# Fichiers présents
ls -la google-services.json
ls -la GoogleService-Info.plist

# Certificat SHA-1 ajouté dans Firebase
cd android && ./gradlew signingReport
```

**2. Tester sur appareil physique**

```bash
# Les notifications ne fonctionnent pas dans l'émulateur
# Tester obligatoirement sur un appareil réel

# Build de développement
eas build --profile development --platform android
```

**3. Vérifier le backend**

```bash
# Fichier service account présent
docker-compose exec app ls -la storage/app/json/service-account.json

# Test d'envoi de notification
docker-compose exec app php artisan tinker
# Tester l'envoi de notification
```

### Géolocalisation ne fonctionne pas

#### Symptômes

- Position non détectée
- Permissions refusées
- Maps ne s'affichent pas

#### Solutions

**1. Vérifier les permissions**

```bash
# Permissions dans app.config.js
"plugins": [
  [
    "expo-location",
    {
      "locationAlwaysAndWhenInUsePermission": "Cette app a besoin de votre localisation."
    }
  ]
]
```

**2. Vérifier Google Maps API**

```bash
# Clé API configurée
echo $GOOGLE_MAPS_API_KEY

# API activée dans Google Cloud Console
# - Maps SDK for Android
# - Maps SDK for iOS
# - Geocoding API
```

**3. Tester en extérieur**

```bash
# GPS nécessite un signal satellite
# Tester dehors, pas en intérieur
# Calibrer la boussole du téléphone
```

## Problèmes Services Externes

### Stripe : Paiements échouent

#### Symptômes

- Webhooks non reçus
- Paiements refusés
- Erreurs d'authentification

#### Solutions

**1. Vérifier les clés API**

```bash
# Clés dans Laravel
docker-compose exec app php artisan config:show stripe

# Test des clés
curl -u sk_test_...: https://api.stripe.com/v1/charges
```

**2. Webhooks en développement**

```bash
# Installer Stripe CLI
stripe login

# Rediriger les webhooks
stripe listen --forward-to localhost:8000/stripe/webhook

# Copier le webhook secret affiché
```

**3. Tester les paiements**

```bash
# Utiliser les cartes de test Stripe
# 4242424242424242 - Succès
# 4000000000000002 - Échec
```

### Firebase : Erreurs de configuration

#### Symptômes

- Erreurs d'authentification
- Projet non trouvé
- Service account invalide

#### Solutions

**1. Vérifier le projet Firebase**

```bash
# ID projet correct
echo $FIREBASE_PROJECT_ID

# Fichier service account
docker-compose exec app cat storage/app/json/service-account.json
```

**2. Permissions Firebase**

```bash
# Service account doit avoir les rôles :
# - Firebase Admin SDK Administrator Service Agent
# - Cloud Messaging Admin
```

**3. Certificats SHA-1**

```bash
# Générer et ajouter le certificat
cd android && ./gradlew signingReport

# Ajouter dans Firebase Console > Paramètres > Applications
```

### Sentry : Erreurs non remontées

#### Symptômes

- Erreurs non visibles dans Sentry
- DSN invalide
- Quotas dépassés

#### Solutions

**1. Vérifier la configuration**

```bash
# DSN configuré
echo $SENTRY_LARAVEL_DSN

# Test d'envoi
docker-compose exec app php artisan tinker
# \Sentry\captureException(new Exception('Test'));
```

**2. Vérifier les quotas**

```bash
# Connexion Sentry
# Vérifier : Settings > Usage & Billing
# Augmenter les quotas si nécessaire
```

## Outils de diagnostic

### Commandes utiles

**Docker :**

```bash
# État global
docker system df
docker system events

# Logs de tous les services
docker-compose logs -f

# Ressources utilisées
docker stats
```

**Laravel :**

```bash
# Informations système
docker-compose exec app php artisan about

# Santé de l'application
docker-compose exec app php artisan health:check

# Queue workers
docker-compose exec app php artisan queue:monitor
```

**Réseau :**

```bash
# Test de connectivité
ping google.com
nslookup lecoursier.josemokeni.cloud

# Ports ouverts
netstat -tulpn
ss -tulpn
```

### Logs importants

**Emplacements des logs :**

```bash
# Docker Compose
docker-compose logs [service]

# Laravel
storage/logs/laravel.log

# Nginx (si utilisé)
/var/log/nginx/error.log

# Système
journalctl -f
```

## Support et ressources

### Avant de contacter le support

1. **Vérifiez cette documentation**
2. **Consultez les logs** des services concernés
3. **Testez les composants** individuellement
4. **Vérifiez les variables d'environnement**

### Informations à fournir

Lors d'une demande de support, incluez :

- **Description détaillée** du problème
- **Étapes pour reproduire** l'erreur
- **Messages d'erreur complets**
- **Configuration de l'environnement** (OS, versions)
- **Logs pertinents**

### Ressources externes

- **Docker** : https://docs.docker.com/
- **Laravel** : https://laravel.com/docs
- **Expo** : https://docs.expo.dev/
- **Firebase** : https://firebase.google.com/docs
- **Stripe** : https://stripe.com/docs

:::tip Méthode de dépannage

1. **Isolez le problème** : Testez chaque composant séparément
2. **Vérifiez les logs** : Commencez toujours par regarder les logs
3. **Reproductibilité** : Assurez-vous de pouvoir reproduire l'erreur
4. **Documentation** : Consultez la documentation officielle des outils
5. **Communauté** : Recherchez des solutions dans les forums et GitHub Issues
   :::

:::warning Sauvegarde
Toujours sauvegarder vos données avant d'effectuer des opérations de nettoyage ou de réinitialisation.
:::
