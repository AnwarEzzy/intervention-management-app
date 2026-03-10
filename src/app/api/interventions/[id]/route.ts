import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { notifyInterventionAssigned, notifyInterventionCompleted, notifyInterventionValidated } from "@/lib/notificationUtils";

const updateInterventionSchema = z.object({
  statut: z.enum(["EN_ATTENTE", "EN_COURS", "TERMINEE", "ANNULEE"]).optional(),
  technicienId: z.string().optional(),
  adminId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const intervention = await prisma.intervention.findUnique({
      where: { id: params.id },
      include: {
        employe: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
        technicien: {
          select: {
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
            specialite: true,
          },
        },
        admin: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
    });

    if (!intervention) {
      return NextResponse.json({ error: "Intervention non trouvée" }, { status: 404 });
    }

    return NextResponse.json(intervention);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'intervention:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateInterventionSchema.parse(body);

    // Check if intervention exists
    const existingIntervention = await prisma.intervention.findUnique({
      where: { id: params.id },
    });

    if (!existingIntervention) {
      return NextResponse.json({ error: "Intervention non trouvée" }, { status: 404 });
    }

    // Role-based permissions
    const role = session.user.role;
    const updateData: any = {};

    if (role === "ADMIN") {
      // Admin can update everything
      if (validatedData.statut) updateData.statut = validatedData.statut;
      if (validatedData.technicienId) updateData.technicienId = validatedData.technicienId;
      if (validatedData.adminId) updateData.adminId = validatedData.adminId;
    } else if (role.startsWith("TECHNICIAN")) {
      // Technicians can only update status to TERMINEE if they are assigned
      if (existingIntervention.technicienId === session.user.id) {
        if (validatedData.statut === "TERMINEE") {
          updateData.statut = validatedData.statut;
          updateData.dateCloture = new Date();
        }
      }
    }

    const intervention = await prisma.intervention.update({
      where: { id: params.id },
      data: updateData,
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
        admin: {
          select: {
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
    });

    // Send notifications based on changes
    try {
      // If a technician was assigned
      if (validatedData.technicienId && validatedData.technicienId !== existingIntervention.technicienId) {
        await notifyInterventionAssigned(params.id, validatedData.technicienId);
      }

      // If intervention was completed
      if (validatedData.statut === "TERMINEE" && existingIntervention.statut !== "TERMINEE") {
        await notifyInterventionCompleted(params.id, session.user.id);
      }

      // If admin validated the intervention
      if (validatedData.adminId && role === "ADMIN") {
        await notifyInterventionValidated(params.id, session.user.id);
      }
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json(intervention);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error("Erreur lors de la mise à jour de l'intervention:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
