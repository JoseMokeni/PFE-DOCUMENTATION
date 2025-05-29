---
title: Services
description: Guide de mise en route des services pré-requis pour l'execution du projet
sidebar_position: 1
---

# Services Pré-requis

Le projet Le Coursier nécessite plusieurs services pour fonctionner correctement. Cette section vous guide dans la configuration de l'infrastructure nécessaire.

## Vue d'ensemble

L'infrastructure du projet comprend :

- **PostgreSQL** - Base de données principale
- **Redis** - Cache en mémoire et gestion des sessions
- **Traefik** - Reverse proxy avec certificats SSL automatiques
- **pgAdmin** - Interface web pour PostgreSQL
- **Redis Commander** - Interface web pour Redis
- **Mailhog** - Service de test d'emails
- **Soketi** - Serveur WebSocket pour les fonctionnalités temps réel

## Configuration réseau

### 1. Création des réseaux Docker

Avant de démarrer les services, vous devez créer les réseaux Docker requis :

```bash
# Réseau interne pour la communication entre services
docker network create lecoursier

# Réseau public pour le reverse proxy Traefik
docker network create traefik-public
```

### 2. Configuration des domaines

#### Option A : Développement local

Ajoutez les entrées suivantes dans votre fichier `/etc/hosts` :

```bash
127.0.0.1 pgadmin.josemokeni.cloud
127.0.0.1 redis.josemokeni.cloud
127.0.0.1 mailhog.josemokeni.cloud
```

#### Option B : Domaines personnalisés

Si vous utilisez vos propres domaines, mettez à jour les labels Traefik dans le fichier `docker-compose.yaml` :

```yaml
# Pour pgAdmin
- "traefik.http.routers.pgadmin.rule=Host(`pgadmin.votre-domaine.com`)"

# Pour Redis Commander
- "traefik.http.routers.redis-commander.rule=Host(`redis.votre-domaine.com`)"

# Pour Mailhog
- "traefik.http.routers.mailhog.rule=Host(`mailhog.votre-domaine.com`)"
```

## Installation

### 1. Cloner le dépôt des services

```bash
git clone <url-du-depot-pfe-services>
cd PFE-SERVICES
```

### 2. Démarrer les services

```bash
docker-compose up -d
```

### 3. Configuration SSL (Production)

Pour activer Traefik avec les certificats SSL automatiques :

1. Décommentez la section Traefik dans `docker-compose.yaml`
2. Mettez à jour l'adresse email pour Let's Encrypt
3. Configurez les permissions pour le fichier ACME :

```bash
chmod 600 docker/traefik/acme.json
```

## Accès aux services

Une fois les services démarrés, vous pouvez y accéder via :

- **pgAdmin** : https://pgadmin.josemokeni.cloud (admin@lecoursier.app / admin)
- **Redis Commander** : https://redis.josemokeni.cloud
- **Mailhog** : https://mailhog.josemokeni.cloud
- **PostgreSQL** : Disponible sur le réseau `lecoursier` (postgres / postgres)
- **Redis** : Disponible sur le réseau `lecoursier`
- **Soketi WebSocket** : Ports 6001 et 9601

## Architecture réseau

- **lecoursier** : Réseau interne pour la communication inter-services
- **traefik-public** : Réseau public pour le routage du reverse proxy
- **default** : Réseau Docker par défaut pour les services n'ayant pas besoin d'accès externe

:::warning Sécurité
Assurez-vous que vos domaines pointent vers l'IP publique de votre serveur pour la validation des certificats Let's Encrypt.
:::

:::note Important
Les services PostgreSQL et Redis sont uniquement accessibles via le réseau Docker interne `lecoursier` pour des raisons de sécurité.
:::
