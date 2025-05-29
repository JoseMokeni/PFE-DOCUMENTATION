---
title: API et Intégrations
description: Documentation de l'API Laravel et des intégrations tierces
sidebar_position: 3
---

# API et Intégrations

Cette section documente l'API Laravel du projet Le Coursier et ses intégrations avec les services tiers.

## Architecture de l'API

### Structure générale

L'API Laravel suit les principes RESTful et utilise :

- **Authentification** : Laravel Sanctum (tokens API)
- **Validation** : Form Requests Laravel
- **Réponses** : Format JSON standardisé
- **Versioning** : Préfixe `/api/v1/`
- **Rate Limiting** : Protection contre les abus
- **CORS** : Configuration pour les applications mobiles

### Format des réponses

#### Réponse de succès

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Données de la réponse
  },
  "meta": {
    // Métadonnées (pagination, etc.)
  }
}
```

#### Réponse d'erreur

```json
{
  "status": "error",
  "message": "Error description",
  "errors": {
    // Détails des erreurs de validation
  },
  "code": "ERROR_CODE"
}
```

## Authentification

### Endpoints d'authentification

#### Inscription

```http
POST /api/v1/auth/register
```

**Paramètres :**

```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+33123456789",
  "role": "client" // client | courier | admin
}
```

**Réponse :**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "phone": "+33123456789",
      "role": "client",
      "email_verified_at": null,
      "created_at": "2024-01-01T00:00:00.000000Z"
    },
    "token": "1|abcd1234..."
  }
}
```

#### Connexion

```http
POST /api/v1/auth/login
```

**Paramètres :**

```json
{
  "email": "jean.dupont@example.com",
  "password": "password123",
  "device_name": "iPhone 14" // Optionnel
}
```

#### Déconnexion

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
Authorization: Bearer {token}
```

### Gestion des tokens FCM

#### Enregistrer un token FCM

```http
POST /api/v1/auth/fcm-token
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "fcm_token": "fcm_token_here",
  "platform": "android" // android | ios
}
```

## Gestion des utilisateurs

### Profil utilisateur

#### Obtenir le profil

```http
GET /api/v1/user/profile
Authorization: Bearer {token}
```

#### Mettre à jour le profil

```http
PUT /api/v1/user/profile
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "name": "Jean Dupont",
  "phone": "+33123456789",
  "avatar": "base64_image_data", // Optionnel
  "notification_preferences": {
    "order_updates": true,
    "promotions": false,
    "system_notifications": true
  }
}
```

### Gestion des adresses

#### Lister les adresses

```http
GET /api/v1/user/addresses
Authorization: Bearer {token}
```

#### Ajouter une adresse

```http
POST /api/v1/user/addresses
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "label": "Domicile",
  "address": "123 Rue de la Paix",
  "city": "Paris",
  "postal_code": "75001",
  "country": "France",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "is_default": true
}
```

## Gestion des commandes

### Endpoints des commandes

#### Créer une commande

```http
POST /api/v1/orders
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "pickup_address": {
    "address": "123 Rue A",
    "city": "Paris",
    "postal_code": "75001",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "contact_name": "Jean Dupont",
    "contact_phone": "+33123456789"
  },
  "delivery_address": {
    "address": "456 Rue B",
    "city": "Paris",
    "postal_code": "75002",
    "latitude": 48.8606,
    "longitude": 2.3376,
    "contact_name": "Marie Martin",
    "contact_phone": "+33987654321"
  },
  "package_type": "small", // small | medium | large | document
  "package_description": "Documents importants",
  "scheduled_pickup": "2024-01-01T14:00:00Z", // Optionnel
  "instructions": "Sonner 2 fois",
  "priority": "normal" // normal | urgent
}
```

#### Lister les commandes

```http
GET /api/v1/orders
Authorization: Bearer {token}
```

**Paramètres de requête :**

- `status` : Filtrer par statut
- `page` : Numéro de page
- `per_page` : Éléments par page (max 50)
- `from_date` : Date de début
- `to_date` : Date de fin

#### Détails d'une commande

```http
GET /api/v1/orders/{id}
Authorization: Bearer {token}
```

#### Suivi en temps réel

```http
GET /api/v1/orders/{id}/tracking
Authorization: Bearer {token}
```

**Réponse :**

```json
{
  "status": "success",
  "data": {
    "order_id": 123,
    "status": "in_delivery",
    "courier": {
      "id": 5,
      "name": "Paul Courier",
      "phone": "+33555666777",
      "current_location": {
        "latitude": 48.8576,
        "longitude": 2.3445
      }
    },
    "estimated_delivery": "2024-01-01T15:30:00Z",
    "timeline": [
      {
        "status": "created",
        "timestamp": "2024-01-01T13:00:00Z",
        "description": "Commande créée"
      },
      {
        "status": "assigned",
        "timestamp": "2024-01-01T13:15:00Z",
        "description": "Coursier assigné"
      }
    ]
  }
}
```

#### Annuler une commande

```http
DELETE /api/v1/orders/{id}
Authorization: Bearer {token}
```

### États des commandes

- **created** : Commande créée
- **assigned** : Coursier assigné
- **pickup_in_progress** : En cours de récupération
- **picked_up** : Colis récupéré
- **in_delivery** : En livraison
- **delivered** : Livré
- **cancelled** : Annulé
- **failed** : Échec de livraison

## API Coursier

### Gestion du statut

#### Changer le statut de service

```http
POST /api/v1/courier/status
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "status": "available", // available | busy | offline
  "location": {
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

#### Mettre à jour la position

```http
POST /api/v1/courier/location
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "latitude": 48.8566,
  "longitude": 2.3522,
  "accuracy": 10, // Précision en mètres
  "timestamp": "2024-01-01T14:00:00Z"
}
```

### Gestion des commandes (Coursier)

#### Accepter une commande

```http
POST /api/v1/courier/orders/{id}/accept
Authorization: Bearer {token}
```

#### Confirmer la récupération

```http
POST /api/v1/courier/orders/{id}/pickup
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "pickup_proof": "base64_image_data", // Photo optionnelle
  "pickup_signature": "base64_signature", // Signature
  "notes": "Colis en bon état"
}
```

#### Confirmer la livraison

```http
POST /api/v1/courier/orders/{id}/deliver
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "delivery_proof": "base64_image_data", // Photo obligatoire
  "recipient_signature": "base64_signature",
  "recipient_name": "Marie Martin",
  "notes": "Livré en main propre"
}
```

## API Administration

### Dashboard

#### Statistiques globales

```http
GET /api/v1/admin/dashboard/stats
Authorization: Bearer {token}
```

**Réponse :**

```json
{
  "status": "success",
  "data": {
    "total_orders": 1250,
    "active_orders": 45,
    "available_couriers": 12,
    "revenue_today": 2840.5,
    "average_delivery_time": 32, // minutes
    "success_rate": 98.5 // pourcentage
  }
}
```

### Gestion des commandes (Admin)

#### Assigner manuellement un coursier

```http
POST /api/v1/admin/orders/{id}/assign
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "courier_id": 5,
  "reason": "Demande client spécifique"
}
```

#### Lister tous les coursiers

```http
GET /api/v1/admin/couriers
Authorization: Bearer {token}
```

**Paramètres de requête :**

- `status` : Filtrer par statut (available, busy, offline)
- `zone` : Filtrer par zone géographique

## Paiements et abonnements

### Intégration Stripe

#### Créer un abonnement

```http
POST /api/v1/subscriptions
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "price_id": "price_monthly_subscription",
  "payment_method_id": "pm_card_visa",
  "billing_details": {
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com"
  }
}
```

#### Gérer l'abonnement

```http
GET /api/v1/subscriptions/current
PUT /api/v1/subscriptions/current
DELETE /api/v1/subscriptions/current
Authorization: Bearer {token}
```

### Webhooks Stripe

#### Endpoint de webhook

```http
POST /stripe/webhook
```

**Événements gérés :**

- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Notifications

### Envoi de notifications push

#### Notification à un utilisateur

```http
POST /api/v1/admin/notifications/send
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "user_id": 123,
  "title": "Votre commande est en route",
  "body": "Le coursier Paul sera chez vous dans 10 minutes",
  "data": {
    "order_id": 456,
    "type": "order_update"
  }
}
```

#### Notification de masse

```http
POST /api/v1/admin/notifications/broadcast
Authorization: Bearer {token}
```

**Paramètres :**

```json
{
  "target": "all_users", // all_users | couriers | clients
  "title": "Maintenance prévue",
  "body": "L'application sera en maintenance demain de 2h à 4h",
  "schedule_at": "2024-01-02T02:00:00Z" // Optionnel
}
```

## WebSockets (Temps réel)

### Configuration Pusher

#### Se connecter au canal

```javascript
// JavaScript/React Native
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: process.env.PUSHER_APP_CLUSTER,
  wsHost: process.env.PUSHER_HOST,
  wsPort: process.env.PUSHER_PORT,
  wssPort: process.env.PUSHER_PORT,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
});

// Canal privé pour un utilisateur
const channel = pusher.subscribe(`private-user.${userId}`);

// Canal public pour les mises à jour générales
const publicChannel = pusher.subscribe("orders");
```

### Événements en temps réel

#### Suivi de commande

```javascript
// Écouter les mises à jour de commande
channel.bind("order.updated", (data) => {
  console.log("Order update:", data);
  // data.order_id, data.status, data.location, etc.
});

// Position du coursier
channel.bind("courier.location", (data) => {
  console.log("Courier location:", data);
  // data.latitude, data.longitude, data.order_id
});
```

#### Notifications système

```javascript
// Nouvelles notifications
channel.bind("notification.received", (data) => {
  console.log("New notification:", data);
  // Afficher la notification dans l'app
});
```

## Rate Limiting

### Limites par défaut

- **Authentification** : 5 tentatives/minute
- **API générale** : 60 requêtes/minute
- **Géolocalisation** : 120 requêtes/minute
- **Uploads** : 10 fichiers/minute

### Headers de réponse

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## Gestion des erreurs

### Codes d'erreur HTTP

- **400** : Bad Request - Paramètres invalides
- **401** : Unauthorized - Token manquant ou invalide
- **403** : Forbidden - Accès interdit
- **404** : Not Found - Ressource non trouvée
- **422** : Unprocessable Entity - Erreurs de validation
- **429** : Too Many Requests - Rate limit dépassé
- **500** : Internal Server Error - Erreur serveur

### Codes d'erreur personnalisés

```json
{
  "status": "error",
  "message": "Order cannot be cancelled",
  "code": "ORDER_NOT_CANCELLABLE",
  "details": {
    "order_status": "in_delivery",
    "reason": "Order is already being delivered"
  }
}
```

## Intégrations tierces

### Google Maps API

#### Géocodage

```http
GET /api/v1/geocoding/address
Authorization: Bearer {token}
```

**Paramètres :**

- `address` : Adresse à géocoder
- `language` : Langue des résultats (fr, en)

#### Calcul de distance

```http
GET /api/v1/geocoding/distance
Authorization: Bearer {token}
```

**Paramètres :**

- `origin` : Point de départ (lat,lng)
- `destination` : Point d'arrivée (lat,lng)
- `mode` : Mode de transport (driving, walking, bicycling)

### Firebase Cloud Messaging

#### Enregistrement automatique

L'API gère automatiquement l'enregistrement des tokens FCM via les endpoints d'authentification.

#### Types de notifications

- **Transactionnelles** : Mises à jour de commandes
- **Marketing** : Promotions et offres
- **Système** : Maintenance et mises à jour

## Tests de l'API

### Collection Postman

Une collection Postman complète est disponible dans `/docs/postman/` avec :

- Tous les endpoints documentés
- Variables d'environnement
- Tests automatisés
- Exemples de réponses

### Tests automatisés

```bash
# Exécuter les tests API
docker compose exec app php artisan test --filter=ApiTest

# Tests spécifiques
docker compose exec app php artisan test tests/Feature/Api/OrderTest.php
```

## Documentation interactive

### Swagger/OpenAPI

Accédez à la documentation interactive à :

```
http://localhost:8000/api/documentation
```

La documentation inclut :

- Tous les endpoints avec exemples
- Modèles de données
- Testeur intégré
- Export en différents formats

:::tip Bonnes pratiques

- Toujours inclure le header `Accept: application/json`
- Gérer les erreurs de réseau côté client
- Utiliser HTTPS en production
- Stocker les tokens de manière sécurisée
- Implémenter un refresh automatique des tokens
  :::
