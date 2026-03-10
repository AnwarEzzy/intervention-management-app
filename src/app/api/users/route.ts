import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const createUserSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().nullable().optional(),
  role: z.enum(['USER', 'TECHNICIAN_N1', 'TECHNICIAN_N2', 'TECHNICIAN_N3', 'ADMIN']),
  specialite: z.string().nullable().optional(),
  statut: z.enum(['ACTIF', 'INACTIF']),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé. Administrateur requis.' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Un utilisateur avec cet email existe déjà' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.motDePasse, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        email: validatedData.email,
        telephone: validatedData.telephone || null,
        role: validatedData.role,
        specialite: validatedData.specialite || null,
        statut: validatedData.statut,
        motDePasse: hashedPassword,
        dateCreation: new Date(),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        role: true,
        specialite: true,
        statut: true,
        dateCreation: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé. Administrateur requis.' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        role: true,
        specialite: true,
        statut: true,
        dateCreation: true,
      },
      orderBy: {
        dateCreation: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
