import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Build search conditions based on user role
    let whereConditions: any = {
      OR: [
        {
          titre: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          equipement: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    };

    // Role-based filtering
    if (user.role === 'USER') {
      // Users can only see their own interventions
      whereConditions.employeId = user.id;
    } else if (user.role.startsWith('TECHNICIAN')) {
      // Technicians can see interventions assigned to them or all if they're admin
      whereConditions.OR = [
        ...whereConditions.OR,
        {
          technicienId: user.id,
        },
      ];
    }
    // Admins can see all interventions (no additional filtering)

    const interventions = await prisma.intervention.findMany({
      where: whereConditions,
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
      orderBy: [
        {
          priorite: 'desc', // Critical first
        },
        {
          dateCreation: 'desc',
        },
      ],
      take: 10, // Limit results to 10 for performance
    });

    return NextResponse.json(interventions);
  } catch (error) {
    console.error('Error searching interventions:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
