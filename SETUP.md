# 🗄️ Configuration Base de Données Locale

## Prérequis

1. **PostgreSQL** installé localement
2. **Node.js** 18+ 
3. **npm** ou **yarn**

## 📋 Étapes de configuration

### 1. Installation de PostgreSQL

#### Windows
```bash
# Télécharger depuis https://www.postgresql.org/download/windows/
# Ou utiliser Chocolatey
choco install postgresql
```

#### macOS
```bash
# Avec Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configuration PostgreSQL

#### Créer un utilisateur et une base de données
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer un utilisateur (remplacez 'password' par votre mot de passe)
CREATE USER postgres WITH PASSWORD 'password';

# Créer la base de données
CREATE DATABASE intervention_db;

# Donner les privilèges
GRANT ALL PRIVILEGES ON DATABASE intervention_db TO postgres;

# Quitter
\q
```

### 3. Configuration de l'environnement

```bash
# Créer le fichier .env.local
touch .env.local

# Éditer le fichier .env.local avec vos paramètres
```

**Contenu du fichier `.env.local` :**
```env
# Database - Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/intervention_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-change-this-in-production"
```

### 4. Installation des dépendances

```bash
# Installer les dépendances
npm install

# Installer tsx pour le seeding
npm install -D tsx
```

### 5. Configuration de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# Peupler la base avec des données de test
npm run db:seed
```

### 6. Lancer l'application

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🔐 Comptes de test

Après le seeding, vous pouvez vous connecter avec :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@intervention.com | password123 |
| **Technicien N1** | tech1@intervention.com | password123 |
| **Technicien N2** | tech2@intervention.com | password123 |
| **Technicien N3** | tech3@intervention.com | password123 |
| **Utilisateur 1** | user1@intervention.com | password123 |
| **Utilisateur 2** | user2@intervention.com | password123 |

## 🛠️ Commandes utiles

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# Peupler la base avec des données de test
npm run db:seed

# Ouvrir Prisma Studio (interface graphique)
npm run db:studio

# Reset complet de la base de données
npx prisma migrate reset
```

## 🔍 Vérification

### Vérifier la connexion PostgreSQL
```bash
# Se connecter à la base de données
psql -h localhost -U postgres -d intervention_db

# Lister les tables
\dt

# Quitter
\q
```

### Vérifier les données
```bash
# Ouvrir Prisma Studio
npm run db:studio
```

## 🚨 Dépannage

### Erreur de connexion PostgreSQL
- Vérifiez que PostgreSQL est démarré
- Vérifiez les paramètres de connexion dans `.env.local`
- Vérifiez que l'utilisateur et la base de données existent

### Erreur de permissions
```bash
# Donner tous les privilèges à l'utilisateur
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE intervention_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### Erreur de port
- Vérifiez que PostgreSQL écoute sur le port 5432
- Vérifiez qu'aucun autre service n'utilise ce port

## 📊 Structure de la base de données

Après le seeding, vous aurez :
- **6 utilisateurs** (1 admin, 3 techniciens, 2 utilisateurs)
- **5 interventions** de test
- **2 enregistrements de statistiques**
- **3 logs** d'activité

## 🔄 Mise à jour du schéma

Si vous modifiez le schéma Prisma :

```bash
# Régénérer le client
npm run db:generate

# Pousser les changements
npm run db:push

# (Optionnel) Reseeder
npm run db:seed
```
