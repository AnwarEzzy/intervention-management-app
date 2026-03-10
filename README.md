# Système de Gestion des Interventions

Application web complète pour la gestion des demandes d'intervention technique avec authentification basée sur les rôles.

## 🚀 Fonctionnalités

### Authentification et Gestion des rôles
- **Système d'authentification sécurisé** avec NextAuth.js et JWT
- **Rôles utilisateurs** : Admin, Utilisateur (employé), Technicien (Niveau 1, 2, 3)
- **Interface différente** selon le rôle de l'utilisateur

### Dashboard par rôle
- **Admin** : Gestion des demandes, statistiques, gestion des utilisateurs
- **Utilisateur** : Création de demandes, suivi des demandes
- **Technicien** : Interventions assignées, mise à jour des statuts

### Gestion des interventions
- **Création de demandes** avec titre, description, priorité, équipement
- **Workflow complet** : En attente → En cours → Terminée
- **Affectation automatique** selon la priorité :
  - Normale/Basse → Technicien N1
  - Haute → Technicien N2
  - Critique → Technicien N3

### Statistiques et rapports
- **Taux de résolution** et temps moyen de résolution
- **Évolution des interventions** par mois
- **Performance des techniciens**

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : NextAuth.js
- **Validation** : Zod
- **Icons** : Heroicons

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd intervention
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
# Créer le fichier .env.local
touch .env.local
```

Modifiez le fichier `.env.local` avec vos paramètres :
```env
# Database - Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/intervention_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-change-this-in-production"
```

4. **Configuration de la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# (Optionnel) Voir la base de données
npx prisma studio
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🗄️ Structure de la base de données

### Tables principales

#### Users
- `id` : Identifiant unique
- `nom`, `prenom` : Nom et prénom
- `email` : Email unique
- `telephone` : Numéro de téléphone
- `role` : Rôle (ADMIN, USER, TECHNICIAN_N1, TECHNICIAN_N2, TECHNICIAN_N3)
- `specialite` : Spécialité (pour les techniciens)
- `statut` : Statut (ACTIF, INACTIF)
- `motDePasse` : Mot de passe hashé
- `dateCreation`, `dateModification` : Timestamps

#### Interventions
- `id` : Identifiant unique
- `titre`, `description` : Détails de l'intervention
- `priorite` : Priorité (BASSE, NORMALE, HAUTE, CRITIQUE)
- `equipement` : Équipement concerné
- `dateEcheance` : Date d'échéance
- `statut` : Statut (EN_ATTENTE, EN_COURS, TERMINEE, ANNULEE)
- `employeId` : Référence vers l'employé demandeur
- `technicienId` : Référence vers le technicien assigné
- `adminId` : Référence vers l'admin qui a validé
- `dateCreation`, `dateCloture` : Timestamps

#### Statistiques
- `mois`, `annee` : Période
- `interventionsParMois` : Nombre d'interventions
- `tempsMoyenResolution` : Temps moyen de résolution
- `tauxResolution` : Taux de résolution en pourcentage

## 🔐 Rôles et permissions

### Admin
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Validation et affectation des interventions
- Consultation des statistiques

### Utilisateur (Employé)
- Création de demandes d'intervention
- Consultation de ses propres demandes
- Suivi du statut des demandes

### Technicien (N1, N2, N3)
- Consultation des interventions assignées
- Mise à jour du statut (En cours → Terminée)
- Consultation des statistiques personnelles

## 📱 Interface utilisateur

### Design responsive
- Interface moderne avec Tailwind CSS
- Sidebar dynamique selon le rôle
- Tableaux de bord personnalisés
- Formulaires intuitifs

### Navigation
- **Dashboard** : Vue d'ensemble selon le rôle
- **Interventions** : Gestion des demandes (Admin)
- **Utilisateurs** : Gestion des utilisateurs (Admin)
- **Statistiques** : Rapports et analyses (Admin)
- **Paramètres** : Configuration personnelle

## 🚀 Déploiement

### Variables d'environnement de production
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
```

### Build de production
```bash
npm run build
npm start
```

## 🔧 Développement

### Scripts disponibles
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Démarrage production
npm run lint         # Linting
```

### Structure des dossiers
```
src/
├── app/                    # Pages Next.js 14
│   ├── api/               # API routes
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Dashboard principal
│   ├── interventions/     # Gestion des interventions
│   ├── admin/             # Pages admin
│   ├── user/              # Pages utilisateur
│   └── technician/        # Pages technicien
├── components/            # Composants React
│   ├── layout/           # Layout et navigation
│   ├── dashboard/        # Composants de dashboard
│   └── providers/        # Providers (NextAuth)
├── lib/                  # Utilitaires
│   ├── auth.ts          # Configuration NextAuth
│   └── prisma.ts        # Client Prisma
└── types/               # Types TypeScript
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les issues existantes
3. Créez une nouvelle issue avec les détails du problème

---

**Note** : Cette application est conçue pour la gestion d'interventions techniques dans un environnement professionnel. Assurez-vous de configurer correctement la sécurité et les permissions selon vos besoins spécifiques.
