---
title: Installation Applications Mobiles
description: Guide d'installation et de configuration des applications mobiles React Native/Expo
sidebar_position: 1
---

# Installation des Applications Mobiles

Le projet Le Coursier comprend deux applications mobiles développées avec React Native et Expo :

1. **Application Utilisateur** (`lecoursier-mobile-app-user`) - Pour les clients finaux
2. **Application Admin** (`lecoursier-mobile-app`) - Pour les administrateurs et coursiers

## Prérequis

### Outils de développement

- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **Expo CLI** : `npm install -g @expo/cli`
- **EAS CLI** : `npm install -g eas-cli`

### Pour le développement natif

- **Android Studio** (développement Android)
- **Xcode** (développement iOS, macOS uniquement)

### Services backend

- Application Laravel démarrée et accessible
- Services Firebase configurés
- Configuration Stripe active

## Installation Application Utilisateur

### 1. Cloner et installer

```bash
git clone <url-du-depot-user>
cd lecoursier-mobile-app-user
npm install
```

### 2. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env
```

Modifier le fichier `.env` :

```bash
# Configuration API
EXPO_PUBLIC_API_URL=http://votre-api-url:port

# Configuration Pusher (temps réel)
EXPO_PUBLIC_PUSHER_HOST=http://votre-pusher-host
EXPO_PUBLIC_PUSHER_APP_KEY=votre-pusher-app-key
EXPO_PUBLIC_PUSHER_APP_SECRET=votre-pusher-app-secret
EXPO_PUBLIC_PUSHER_APP_ID=votre-pusher-app-id
EXPO_PUBLIC_PUSHER_APP_CLUSTER=mt1
EXPO_PUBLIC_PUSHER_PORT=6001

# Clé API Google Maps
GOOGLE_MAPS_API_KEY=votre-cle-google-maps
```

### 3. Configuration Firebase

#### 3.1 Fichiers de configuration Firebase

Placez les fichiers de configuration Firebase dans le répertoire racine :

- **Android** : `google-services.json`
- **iOS** : `GoogleService-Info.plist`

#### 3.2 Configuration dans app.config.js

Vérifiez que la configuration Firebase est correcte dans `app.config.js` :

```javascript
export default {
  expo: {
    name: "Le Coursier User",
    slug: "lecoursier-user",
    version: "1.0.0",
    platforms: ["ios", "android"],

    // Configuration Android
    android: {
      package: "com.lecoursier.user",
      googleServicesFile: "./google-services.json",
    },

    // Configuration iOS
    ios: {
      bundleIdentifier: "com.lecoursier.user",
      googleServicesFile: "./GoogleService-Info.plist",
    },

    // Plugins
    plugins: [
      "expo-dev-client",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Cette app a besoin d'accéder à votre localisation.",
        },
      ],
    ],
  },
};
```

### 4. Générer le certificat SHA-1 (Android)

```bash
# Nettoyer et regénérer le code natif
npx expo prebuild --clean

# Générer le certificat SHA-1
cd android && ./gradlew signingReport
```

Copiez le certificat SHA-1 et ajoutez-le dans votre projet Firebase.

## Installation Application Admin

### 1. Cloner et installer

```bash
git clone <url-du-depot-admin>
cd lecoursier-mobile-app
npm install
```

### 2. Configuration similaire

Suivez les mêmes étapes que pour l'application utilisateur, en adaptant :

- Le nom du package : `com.lecoursier.admin`
- L'identifiant du bundle : `com.lecoursier.admin`
- Le nom de l'application : "Le Coursier Admin"

## Options de développement

### Option 1 : Expo Go (Limitée)

Pour un développement rapide avec des fonctionnalités limitées :

```bash
# Démarrer le serveur de développement
npx expo start

# Scanner le QR code avec Expo Go sur votre appareil
```

:::warning Limitations Expo Go
Certaines fonctionnalités comme les notifications push ne fonctionnent pas dans Expo Go à cause des limitations de l'environnement sandbox.
:::

### Option 2 : Development Build (Recommandée)

Pour tester toutes les fonctionnalités, y compris les notifications :

```bash
# Build pour Android
npx expo run:android

# Build pour iOS (macOS uniquement)
npx expo run:ios
```

### Option 3 : Émulateurs/Simulateurs

#### Android (Android Studio)

```bash
# Démarrer l'émulateur Android
npx expo run:android

# Ou spécifier un appareil
npx expo run:android --device
```

#### iOS (Xcode - macOS uniquement)

```bash
# Démarrer le simulateur iOS
npx expo run:ios

# Ou spécifier un simulateur
npx expo run:ios --simulator "iPhone 14 Pro"
```

## Configuration avancée

### 1. Configuration Google Maps

#### Obtenir une clé API

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez un projet existant
3. Activez l'API Google Maps
4. Créez une clé API et configurez les restrictions

#### Configuration dans l'application

```javascript
// Configuration dans app.config.js
export default {
  expo: {
    // ... autres configurations
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    ios: {
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
};
```

### 2. Configuration Pusher (WebSockets)

Pusher est utilisé pour les fonctionnalités temps réel :

```bash
# Variables d'environnement Pusher
EXPO_PUBLIC_PUSHER_HOST=http://10.0.2.2  # Pour l'émulateur Android
EXPO_PUBLIC_PUSHER_APP_KEY=votre_app_key
EXPO_PUBLIC_PUSHER_APP_SECRET=votre_app_secret
EXPO_PUBLIC_PUSHER_APP_ID=votre_app_id
EXPO_PUBLIC_PUSHER_APP_CLUSTER=mt1
EXPO_PUBLIC_PUSHER_PORT=6001
```

### 3. Configuration réseau pour le développement

#### Émulateur Android

```bash
# L'émulateur Android utilise 10.0.2.2 pour localhost
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
EXPO_PUBLIC_PUSHER_HOST=http://10.0.2.2
```

#### Appareil physique

```bash
# Utilisez l'IP de votre machine de développement
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
EXPO_PUBLIC_PUSHER_HOST=http://192.168.1.100
```

#### Simulateur iOS

```bash
# iOS peut utiliser localhost directement
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_PUSHER_HOST=http://localhost
```

## Builds de production

### Builds locaux

#### Android APK

```bash
# Générer un APK de release
cd android
./gradlew assembleRelease

# Le fichier APK sera dans :
# android/app/build/outputs/apk/release/app-release.apk
```

#### Android Bundle (AAB)

```bash
# Générer un bundle de release pour Google Play Store
cd android
./gradlew bundleRelease

# Le fichier AAB sera dans :
# android/app/build/outputs/bundle/release/app-release.aab
```

### Builds avec EAS (Recommandé)

#### Configuration EAS

```bash
# Se connecter à Expo
eas login

# Configurer EAS pour le projet
eas build:configure
```

#### Builds de développement

```bash
# Build pour Android et iOS
eas build --profile development --platform all

# Build pour Android uniquement
eas build --profile development --platform android

# Build pour iOS uniquement
eas build --profile development --platform ios
```

#### Builds de production

```bash
# Build pour production (Android et iOS)
eas build --profile production --platform all

# Build pour Android (Google Play Store)
eas build --profile production --platform android

# Build pour iOS (App Store)
eas build --profile production --platform ios
```

#### Soumission aux stores

```bash
# Soumission automatique au Google Play Store
eas submit --platform android

# Soumission automatique à l'App Store
eas submit --platform ios
```

## Structure des applications

### Dossiers principaux

```
src/
├── components/          # Composants réutilisables
├── screens/            # Écrans de l'application
├── navigation/         # Configuration de navigation
├── services/           # Services API et utilitaires
├── hooks/             # Hooks React personnalisés
├── context/           # Contextes React (état global)
├── types/             # Types TypeScript
└── utils/             # Fonctions utilitaires

assets/
├── images/            # Images et icônes
├── fonts/             # Polices personnalisées
└── sounds/            # Fichiers audio
```

### Fonctionnalités principales

#### Application Utilisateur

- **Authentification** : Inscription/Connexion
- **Commandes** : Création et suivi des commandes
- **Géolocalisation** : Sélection d'adresses et suivi en temps réel
- **Paiements** : Intégration Stripe
- **Notifications** : Notifications push Firebase
- **Profil** : Gestion du profil utilisateur

#### Application Admin

- **Dashboard** : Vue d'ensemble des commandes
- **Gestion des commandes** : Attribution et suivi
- **Gestion des coursiers** : Affectation et monitoring
- **Statistiques** : Rapports et analyses
- **Notifications** : Alertes administrateur

## Débogage et développement

### Logs et debugging

```bash
# Logs Expo
npx expo start --clear

# Logs React Native
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Debug avec Flipper
npx react-native start --reset-cache
```

### Outils de développement

- **React Native Debugger** : Debug de l'état React
- **Flipper** : Inspection réseau et base de données
- **Expo Dev Tools** : Interface web de développement
- **Chrome DevTools** : Debug JavaScript

### Tests

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm test --coverage
```

## Performance et optimisation

### Optimisations courantes

1. **Images** : Utilisez des formats optimisés (WebP)
2. **Bundle size** : Analysez avec `npx expo install @expo/webpack-config`
3. **Navigation** : Implémentez la navigation lazy
4. **Cache** : Configurez le cache des images et API

## Dépannage

### Problèmes courants

1. **Erreurs Metro** :

   ```bash
   npx expo start --clear
   rm -rf node_modules && npm install
   ```

2. **Problèmes Android** :

   ```bash
   cd android && ./gradlew clean
   npx expo prebuild --clean
   ```

3. **Problèmes iOS** :

   ```bash
   cd ios && rm -rf Pods && pod install
   npx expo prebuild --clean
   ```

4. **Notifications non reçues** :
   - Vérifiez les fichiers Firebase
   - Confirmez le certificat SHA-1
   - Testez sur un appareil physique

### Ressources utiles

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation EAS](https://docs.expo.dev/eas/)

:::tip Conseil de développement
Pour un développement efficace, utilisez les Development Builds avec EAS Build. Cela vous permet de tester toutes les fonctionnalités natives tout en gardant la flexibilité d'Expo.
:::
