import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { notifyInterventionCreated } from '@/lib/notificationUtils';

const createInterventionSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  priorite: z.enum(['BASSE', 'NORMALE', 'HAUTE', 'CRITIQUE']),
  equipement: z.string().optional(),
  dateEcheance: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createInterventionSchema.parse(body);

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Create the intervention
    const intervention = await prisma.intervention.create({
      data: {
        titre: validatedData.titre,
        description: validatedData.description,
        priorite: validatedData.priorite,
        equipement: validatedData.equipement || null,
        dateEcheance: validatedData.dateEcheance ? new Date(validatedData.dateEcheance) : null,
        statut: 'EN_ATTENTE',
        employeId: user.id,
        dateCreation: new Date(),
      },
      include: {
        employe: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
    });

    // Send notification to admins
    try {
      await notifyInterventionCreated(intervention.id, user.id);
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json(intervention, { status: 201 });
  } catch (error) {
    console.error('Error creating intervention:', error);
    
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    let whereClause: any = {};

    // Filter by status if provided
    if (status) {
      whereClause.statut = status;
    }

    // Role-based filtering
    if (user.role === 'ADMIN') {
      // Admin can see all interventions
    } else if (user.role.startsWith('TECHNICIAN')) {
      // Technicians can see interventions assigned to them
      whereClause.technicienId = user.id;
    } else {
      // Regular users can only see their own interventions
      whereClause.employeId = user.id;
    }

    const interventions = await prisma.intervention.findMany({
      where: whereClause,
      include: {
        employe: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
        technicien: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
      orderBy: {
        dateCreation: 'desc',
      },
    });

    return NextResponse.json(interventions);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
