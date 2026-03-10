import { prisma } from '@/lib/prisma';

export enum NotificationType {
  INTERVENTION_CREATED = 'INTERVENTION_CREATED',
  INTERVENTION_ASSIGNED = 'INTERVENTION_ASSIGNED',
  INTERVENTION_COMPLETED = 'INTERVENTION_COMPLETED',
  INTERVENTION_VALIDATED = 'INTERVENTION_VALIDATED',
}

export interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  interventionId?: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        type: params.type,
        title: params.title,
        message: params.message,
        userId: params.userId,
        interventionId: params.interventionId,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Helper functions for specific notification types
export const notifyInterventionCreated = async (interventionId: string, employeId: string) => {
  // Get all admins
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
  });

  // Create notifications for all admins
  const notifications = await Promise.all(
    admins.map(admin =>
      createNotification({
        type: NotificationType.INTERVENTION_CREATED,
        title: 'Nouvelle intervention créée',
        message: 'Une nouvelle intervention nécessite votre validation',
        userId: admin.id,
        interventionId,
      })
    )
  );

  return notifications;
};

export const notifyInterventionAssigned = async (interventionId: string, technicienId: string) => {
  const intervention = await prisma.intervention.findUnique({
    where: { id: interventionId },
    include: { employe: true },
  });

  if (!intervention) return;

  return createNotification({
    type: NotificationType.INTERVENTION_ASSIGNED,
    title: 'Intervention assignée',
    message: `L'intervention "${intervention.titre}" vous a été assignée`,
    userId: technicienId,
    interventionId,
  });
};

export const notifyInterventionCompleted = async (interventionId: string, technicienId: string) => {
  const intervention = await prisma.intervention.findUnique({
    where: { id: interventionId },
    include: { employe: true },
  });

  if (!intervention) return;

  // Notify the employee who created the intervention
  return createNotification({
    type: NotificationType.INTERVENTION_COMPLETED,
    title: 'Intervention terminée',
    message: `Votre intervention "${intervention.titre}" a été terminée`,
    userId: intervention.employeId,
    interventionId,
  });
};

export const notifyInterventionValidated = async (interventionId: string, adminId: string) => {
  const intervention = await prisma.intervention.findUnique({
    where: { id: interventionId },
    include: { employe: true },
  });

  if (!intervention) return;

  // Notify the employee who created the intervention
  return createNotification({
    type: NotificationType.INTERVENTION_VALIDATED,
    title: 'Intervention validée',
    message: `Votre intervention "${intervention.titre}" a été validée par l'administrateur`,
    userId: intervention.employeId,
    interventionId,
  });
};
