---
title: Stripe
description: Guide de configuration de Stripe pour l'execution du projet
sidebar_position: 3
---

# Configuration Stripe

Stripe est utilisé pour le traitement des paiements et la gestion des abonnements dans le projet Le Coursier.

## Création du compte Stripe

### 1. Créer un compte Stripe

1. Rendez-vous sur [Stripe.com](https://stripe.com)
2. Créez un compte ou connectez-vous à votre compte existant
3. Activez votre compte pour les paiements en production (si nécessaire)

### 2. Configuration des clés API

#### 2.1 Obtenir les clés API

1. Dans le tableau de bord Stripe, allez dans **Développeurs** → **Clés API**
2. Copiez vos clés :
   - **Clé publique** : `pk_test_...` (test) ou `pk_live_...` (production)
   - **Clé secrète** : `sk_test_...` (test) ou `sk_live_...` (production)

#### 2.2 Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` Laravel :

```bash
# Clés API Stripe
STRIPE_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET=sk_test_votre_cle_secrete_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_ici
```

## Configuration des produits et prix

### 1. Créer un produit

1. Dans le tableau de bord Stripe, allez dans **Produits**
2. Cliquez sur "Créer un produit"
3. Remplissez les informations du produit (nom, description, etc.)
4. Sauvegardez et copiez l'ID du produit (`prod_...`)

### 2. Créer les prix récurrents

#### 2.1 Prix mensuel

1. Dans votre produit, cliquez sur "Ajouter un prix"
2. Configurez :
   - **Type** : Récurrent
   - **Période de facturation** : Mensuel
   - **Prix** : Montant de l'abonnement mensuel
3. Sauvegardez et copiez l'ID du prix (`price_...`)

#### 2.2 Prix annuel

1. Répétez l'opération pour l'abonnement annuel
2. Configurez :
   - **Type** : Récurrent
   - **Période de facturation** : Annuel
   - **Prix** : Montant de l'abonnement annuel
3. Sauvegardez et copiez l'ID du prix (`price_...`)

### 3. Variables d'environnement pour les produits

Ajoutez ces variables dans votre fichier `.env` :

```bash
# Configuration produit et prix
STRIPE_PRODUCT_ID=prod_votre_id_produit
STRIPE_MONTHLY_PRICE_ID=price_votre_id_prix_mensuel
STRIPE_YEARLY_PRICE_ID=price_votre_id_prix_annuel
```

## Configuration des webhooks

Les webhooks permettent à Stripe de notifier votre application des événements de paiement.

### Pour la production

#### 1. Utiliser Laravel Cashier

Laravel Cashier peut créer automatiquement les webhooks nécessaires :

```bash
# Dans votre conteneur Docker Laravel
docker compose exec app php artisan cashier:webhook
```

#### 2. Configuration manuelle

1. Dans le tableau de bord Stripe, allez dans **Développeurs** → **Webhooks**
2. Cliquez sur "Ajouter un endpoint"
3. URL de l'endpoint : `https://votre-domaine.com/stripe/webhook`
4. Sélectionnez les événements à écouter (ou tous les événements)
5. Sauvegardez et copiez le secret de signature du webhook

### Pour le développement local

#### 1. Installer Stripe CLI

Suivez le [guide d'installation officiel](https://stripe.com/docs/stripe-cli) pour votre système d'exploitation.

#### 2. Se connecter à Stripe

```bash
stripe login
```

#### 3. Rediriger les webhooks vers votre application locale

```bash
stripe listen --forward-to localhost:8000/stripe/webhook
```

#### 4. Récupérer le secret webhook

Le CLI Stripe affichera le secret de signature dans la sortie. Copiez-le et ajoutez-le à votre `.env` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_secret_affiche_par_cli
```

## Configuration complète

### Fichier .env complet pour Stripe

```bash
# Clés API Stripe
STRIPE_KEY=pk_test_votre_cle_publique
STRIPE_SECRET=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook

# Configuration produit et prix
STRIPE_PRODUCT_ID=prod_votre_id_produit
STRIPE_MONTHLY_PRICE_ID=price_votre_id_prix_mensuel
STRIPE_YEARLY_PRICE_ID=price_votre_id_prix_annuel
```

## Test des paiements

### 1. Cartes de test Stripe

Utilisez ces numéros de carte pour tester les paiements :

- **Succès** : `4242424242424242`
- **Échec** : `4000000000000002`
- **Authentification 3D Secure** : `4000002500003155`

### 2. Informations de test

- **Date d'expiration** : N'importe quelle date future
- **CVC** : N'importe quel nombre à 3 chiffres
- **Code postal** : N'importe quel code postal valide

## Monitoring et logs

### 1. Logs Stripe

- Consultez les logs dans **Développeurs** → **Logs** du tableau de bord Stripe
- Surveillez les webhooks dans **Développeurs** → **Webhooks** → votre endpoint

### 2. Logs Laravel

- Vérifiez les logs Laravel dans `storage/logs/laravel.log`
- Utilisez `docker compose logs app` pour voir les logs du conteneur

## Sécurité

:::danger Important

- **Jamais** exposer vos clés secrètes Stripe dans le code frontend
- Utilisez toujours les clés de test pendant le développement
- Validez toujours les webhooks avec le secret de signature
- Activez l'authentification forte (3D Secure) pour les paiements européens
  :::

## Dépannage

### Problèmes courants

1. **Webhooks non reçus** :

   - Vérifiez que l'URL de webhook est accessible publiquement
   - Confirmez que le secret webhook est correct
   - Vérifiez les logs Stripe pour les tentatives de livraison

2. **Paiements échoués** :

   - Utilisez les cartes de test appropriées
   - Vérifiez les logs pour les erreurs spécifiques
   - Assurez-vous que les montants sont dans la devise correcte

3. **Erreurs d'abonnement** :
   - Vérifiez que les IDs de prix sont corrects
   - Confirmez que le produit est actif
   - Vérifiez la configuration des métadonnées

### Ressources utiles

- [Documentation Stripe](https://stripe.com/docs)
- [Documentation Laravel Cashier](https://laravel.com/docs/billing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
