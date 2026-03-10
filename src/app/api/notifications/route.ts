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

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Get notifications for the current user
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      include: {
        intervention: {
          select: {
            id: true,
            titre: true,
            statut: true,
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
      take: 50, // Limit to 50 most recent notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, status } = body;

    if (!notificationId || !status) {
      return NextResponse.json(
        { message: 'ID de notification et statut requis' },
        { status: 400 }
      );
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Update notification status
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: user.id, // Ensure user can only update their own notifications
      },
      data: { status },
    });

    if (notification.count === 0) {
      return NextResponse.json(
        { message: 'Notification non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Notification mise à jour' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
