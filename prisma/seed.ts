import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@intervention.com' },
    update: {},
    create: {
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@intervention.com',
      telephone: '0123456789',
      role: 'ADMIN',
      specialite: 'Administration',
      motDePasse: hashedPassword,
      statut: 'ACTIF',
    },
  })

  // Create Technician users
  const techN1 = await prisma.user.upsert({
    where: { email: 'tech1@intervention.com' },
    update: {},
    create: {
      nom: 'Martin',
      prenom: 'Jean',
      email: 'tech1@intervention.com',
      telephone: '0123456790',
      role: 'TECHNICIAN_N1',
      specialite: 'Maintenance générale',
      motDePasse: hashedPassword,
      statut: 'ACTIF',
    },
  })

  const techN2 = await prisma.user.upsert({
    where: { email: 'tech2@intervention.com' },
    update: {},
    create: {
      nom: 'Durand',
      prenom: 'Pierre',
      email: 'tech2@intervention.com',
      telephone: '0123456791',
      role: 'TECHNICIAN_N2',
      specialite: 'Réseau et sécurité',
      motDePasse: hashedPassword,
      statut: 'ACTIF',
    },
  })

  const techN3 = await prisma.user.upsert({
    where: { email: 'tech3@intervention.com' },
    update: {},
    create: {
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'tech3@intervention.com',
      telephone: '0123456792',
      role: 'TECHNICIAN_N3',
      specialite: 'Systèmes critiques',
      motDePasse: hashedPassword,
      statut: 'ACTIF',
    },
  })

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@intervention.com' },
    update: {},
    create: {
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'user1@intervention.com',
      telephone: '0123456793',
      role: 'USER',
      motDePasse: hashedPassword,
      statut: 'ACTIF',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@intervention.com' },
    update: {},
    create: {
      nom: 'Leroy',
      prenom: 'Paul',
      email: 'user2@intervention.com',
      telephone: '0123456794',
      role: 'USER',
      motDePasse: hashedPassword,
      statut: 'ACTIF',
    },
  })

  // Create sample interventions
  const intervention1 = await prisma.intervention.create({
    data: {
      titre: 'Problème réseau - Bâtiment A',
      description: 'Connexion internet très lente dans le bâtiment A. Les utilisateurs signalent des temps de chargement excessifs.',
      priorite: 'HAUTE',
      equipement: 'Switch principal - Bâtiment A',
      dateEcheance: new Date('2024-02-20T17:00:00Z'),
      statut: 'EN_ATTENTE',
      employeId: user1.id,
    },
  })

  const intervention2 = await prisma.intervention.create({
    data: {
      titre: 'Maintenance imprimante HP',
      description: 'L\'imprimante HP du bureau 205 ne fonctionne plus. Message d\'erreur "Cartouche manquante" affiché.',
      priorite: 'NORMALE',
      equipement: 'Imprimante HP LaserJet Pro M404n',
      dateEcheance: new Date('2024-02-25T12:00:00Z'),
      statut: 'EN_COURS',
      employeId: user2.id,
      technicienId: techN1.id,
      adminId: admin.id,
    },
  })

  const intervention3 = await prisma.intervention.create({
    data: {
      titre: 'Panne serveur critique',
      description: 'Le serveur principal ne répond plus. Tous les services sont inaccessibles. Urgence maximale.',
      priorite: 'CRITIQUE',
      equipement: 'Serveur principal - Salle serveurs',
      dateEcheance: new Date('2024-02-15T10:00:00Z'),
      statut: 'EN_COURS',
      employeId: user1.id,
      technicienId: techN3.id,
      adminId: admin.id,
    },
  })

  const intervention4 = await prisma.intervention.create({
    data: {
      titre: 'Installation logiciel Adobe',
      description: 'Besoin d\'installer Adobe Creative Suite sur 5 postes de travail du département design.',
      priorite: 'BASSE',
      equipement: 'Postes de travail - Département Design',
      dateEcheance: new Date('2024-03-01T16:00:00Z'),
      statut: 'TERMINEE',
      employeId: user2.id,
      technicienId: techN1.id,
      adminId: admin.id,
      dateCloture: new Date('2024-02-10T14:30:00Z'),
    },
  })

  const intervention5 = await prisma.intervention.create({
    data: {
      titre: 'Configuration VPN',
      description: 'Configuration du VPN pour permettre le télétravail de 10 employés.',
      priorite: 'HAUTE',
      equipement: 'Serveur VPN',
      dateEcheance: new Date('2024-02-18T18:00:00Z'),
      statut: 'EN_COURS',
      employeId: user1.id,
      technicienId: techN2.id,
      adminId: admin.id,
    },
  })

  // Create sample statistics
  await prisma.statistique.create({
    data: {
      mois: 1,
      annee: 2024,
      interventionsParMois: 25,
      tempsMoyenResolution: 4.5,
      tauxResolution: 92.0,
      interventionsTerminees: 23,
      interventionsEnCours: 2,
    },
  })

  await prisma.statistique.create({
    data: {
      mois: 2,
      annee: 2024,
      interventionsParMois: 18,
      tempsMoyenResolution: 3.2,
      tauxResolution: 94.4,
      interventionsTerminees: 17,
      interventionsEnCours: 1,
    },
  })

  // Create sample logs
  await prisma.log.create({
    data: {
      action: 'Création intervention',
      details: 'Nouvelle intervention créée: Problème réseau - Bâtiment A',
      userId: user1.id,
      interventionId: intervention1.id,
    },
  })

  await prisma.log.create({
    data: {
      action: 'Assignation technicien',
      details: 'Intervention assignée au technicien Jean Martin',
      userId: admin.id,
      interventionId: intervention2.id,
    },
  })

  await prisma.log.create({
    data: {
      action: 'Mise à jour statut',
      details: 'Statut changé de EN_ATTENTE à EN_COURS',
      userId: techN1.id,
      interventionId: intervention2.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Test accounts created:')
  console.log('👨‍💼 Admin: admin@intervention.com / password123')
  console.log('🔧 Tech N1: tech1@intervention.com / password123')
  console.log('🔧 Tech N2: tech2@intervention.com / password123')
  console.log('🔧 Tech N3: tech3@intervention.com / password123')
  console.log('👤 User 1: user1@intervention.com / password123')
  console.log('👤 User 2: user2@intervention.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
