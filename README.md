# DocuChat - Frontend

Interface utilisateur moderne pour **DocuChat**, un système de **RAG (Retrieval-Augmented Generation)** permettant d'interagir intelligemment avec vos documents via l'IA.

## 🚀 Fonctionnalités

- **Interface de Chat Interactive** : Conversation fluide avec vos documents en temps réel
- **Upload de Documents** : Importation facile de fichiers PDF pour indexation
- **Affichage Markdown** : Rendu élégant des réponses formatées de l'IA
- **Notifications Toast** : Retours visuels pour les actions utilisateur
- **Design Moderne** : Interface responsive avec Tailwind CSS

## 🛠️ Stack Technique

- **Framework** : React 19 + TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS 4
- **HTTP Client** : Axios
- **UI Components** :
  - `lucide-react` pour les icônes
  - `react-hot-toast` pour les notifications
  - `react-markdown` pour le rendu des réponses

## 📋 Prérequis

- Node.js v22.20.0 ou supérieur
- npm ou yarn
- Backend DocuChat en cours d'exécution (voir `/backend/README.md`)

## ⚙️ Installation

1. **Installer les dépendances** :

   ```bash
   npm install
   ```

2. **Configuration** :
   Assurez-vous que le backend est accessible à l'adresse configurée dans `/src/api/`

3. **Lancer le serveur de développement** :

   ```bash
   npm run dev
   ```

4. **Accéder à l'application** :
   Ouvrez votre navigateur à l'adresse affichée (généralement `http://localhost:5173`)

## 📦 Scripts Disponibles

- `npm run dev` : Lance le serveur de développement avec hot reload
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## 🏗️ Structure du Projet

```
frontend/
├── src/
│   ├── components/     # Composants React réutilisables
│   ├── api/           # Configuration et appels API
│   ├── assets/        # Images et fichiers statiques
│   ├── App.tsx        # Composant principal de l'application
│   ├── main.tsx       # Point d'entrée de l'application
│   └── index.css      # Styles globaux
├── public/            # Fichiers publics statiques
└── index.html         # Template HTML
```

## 🔗 Intégration Backend

Cette application frontend communique avec le backend DocuChat via API REST :

- **POST /api/upload** : Upload et indexation de documents PDF
- **POST /api/chat** : Envoi de questions et réception de réponses contextuelles

## 🎨 Personnalisation

L'application utilise Tailwind CSS pour le styling. Vous pouvez personnaliser les couleurs, les espacements et autres styles directement dans les composants ou via la configuration Tailwind.

## 📝 Développement

### Configuration ESLint

Le projet est configuré avec ESLint pour maintenir la qualité du code. Pour une configuration plus stricte en production, consultez la section "Expanding the ESLint configuration" dans la documentation officielle de Vite.

### Hot Module Replacement (HMR)

Le projet utilise `@vitejs/plugin-react` avec Babel pour un rechargement rapide des modules pendant le développement.

## 🚀 Déploiement

1. **Build de production** :

   ```bash
   npm run build
   ```

2. **Les fichiers compilés** seront dans le dossier `dist/`

3. **Déployer** le contenu du dossier `dist/` sur votre hébergeur (Vercel, Netlify, etc.)

## 📄 Licence

Ce projet fait partie du système DocuChat.
# docuchat_frontend
