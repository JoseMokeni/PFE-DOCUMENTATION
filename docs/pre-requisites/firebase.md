---
title: Firebase
description: Guide de mise en route de Firebase pour l'execution du projet
sidebar_position: 2
---

# Configuration Firebase

Firebase est utilisé pour les notifications push (FCM - Firebase Cloud Messaging) dans les applications mobiles du projet Le Coursier.

## Création du projet Firebase

### 1. Créer un nouveau projet

1. Rendez-vous sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet" ou sélectionnez un projet existant
3. Suivez les étapes de configuration du projet
4. Activez Firebase Cloud Messaging (FCM) dans les paramètres du projet

### 2. Configuration pour Android

#### 2.1 Ajouter l'application Android

1. Dans la console Firebase, cliquez sur "Ajouter une application" → Android
2. Utilisez le nom du package de votre application (vérifiez dans `app.config.js`)
   - App utilisateur : généralement `com.lecoursier.user`
   - App admin : généralement `com.lecoursier.admin`
3. Téléchargez le fichier `google-services.json`
4. **Placez le fichier `google-services.json` dans le répertoire racine** de votre projet (au même niveau que `package.json`)

#### 2.2 Obtenir le certificat SHA-1

```bash
# Nettoyer et regénérer le code natif
npx expo prebuild --clean

# Générer le rapport de signature
cd android && ./gradlew signingReport
```

Copiez l'empreinte SHA-1 depuis la sortie et ajoutez-la dans les paramètres de votre application Android Firebase.

### 3. Configuration pour iOS

#### 3.1 Ajouter l'application iOS

1. Dans la console Firebase, cliquez sur "Ajouter une application" → iOS
2. Utilisez l'identifiant du bundle de votre application (vérifiez dans `app.config.js`)
3. Téléchargez le fichier `GoogleService-Info.plist`
4. **Placez le fichier `GoogleService-Info.plist` dans le répertoire racine** de votre projet

## Configuration du backend Laravel

### 1. ID du projet Firebase

Ajoutez l'ID de votre projet Firebase dans le fichier `.env` :

```bash
FIREBASE_PROJECT_ID=votre-projet-firebase-id
```

Vous pouvez trouver l'ID du projet dans la console Firebase sous Paramètres du projet → Onglet Général.

### 2. Clé de service Firebase

#### 2.1 Télécharger la clé de service

1. Dans la console Firebase, allez dans Paramètres du projet → Comptes de service
2. Cliquez sur "Générer une nouvelle clé privée" et téléchargez le fichier JSON

#### 2.2 Placer le fichier dans le projet Laravel

1. **Placez le fichier de clé de service** dans le répertoire suivant :

   ```
   storage/app/json/service-account.json
   ```

2. **Assurez-vous que le répertoire existe** :

   ```bash
   mkdir -p storage/app/json
   ```

3. **Définissez les bonnes permissions** :
   ```bash
   chmod 644 storage/app/json/service-account.json
   ```

### 3. Configuration Docker (Production)

Pour la production avec Docker, placez le fichier de service dans :

```
docker/firebase/service-account.json
```

## Variables d'environnement

### Applications mobiles

Ajoutez ces variables dans vos fichiers `.env` des applications mobiles :

```bash
# Configuration Firebase (si nécessaire pour certaines fonctionnalités)
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre-projet-firebase-id
```

### Backend Laravel

```bash
# ID du projet Firebase
FIREBASE_PROJECT_ID=votre-projet-firebase-id
```

## Sécurité

:::danger Important

- **Jamais** committer le fichier `service-account.json` dans le contrôle de version
- Ajoutez `storage/app/json/` au fichier `.gitignore`
- Ajoutez `docker/firebase/service-account.json` au fichier `.gitignore`
- Utilisez des variables d'environnement pour les configurations sensibles
  :::

## Test des notifications

Une fois la configuration terminée, vous pouvez tester les notifications :

1. **Via la console Firebase** : Utilisez l'outil "Cloud Messaging" pour envoyer des notifications test
2. **Via l'API Laravel** : Utilisez les endpoints d'API pour envoyer des notifications programmatiques
3. **Via l'application** : Testez les notifications lors d'événements comme les nouvelles commandes

## Dépannage

### Problèmes courants

1. **Notifications non reçues** :

   - Vérifiez que les fichiers `google-services.json` et `GoogleService-Info.plist` sont au bon endroit
   - Confirmez que le certificat SHA-1 est ajouté dans Firebase
   - Assurez-vous que FCM est activé dans votre projet

2. **Erreurs de build** :

   - Exécutez `npx expo prebuild --clean` pour regénérer le code natif
   - Vérifiez que tous les packages Firebase sont installés

3. **Erreurs backend** :
   - Vérifiez que le fichier `service-account.json` existe et a les bonnes permissions
   - Confirmez que `FIREBASE_PROJECT_ID` correspond à votre projet Firebase
