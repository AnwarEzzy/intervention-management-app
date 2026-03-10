"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Intervention {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  equipement?: string;
  dateEcheance?: string;
  statut: string;
  dateCreation: string;
  dateCloture?: string;
  technicien?: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function MyRequestsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await fetch("/api/interventions");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des demandes");
      }
      const data = await response.json();
      setInterventions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800";
      case "EN_COURS":
        return "bg-blue-100 text-blue-800";
      case "TERMINEE":
        return "bg-green-100 text-green-800";
      case "ANNULEE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "EN_ATTENTE":
        return "En attente";
      case "EN_COURS":
        return "En cours";
      case "TERMINEE":
        return "Terminée";
      case "ANNULEE":
        return "Annulée";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITIQUE":
        return "bg-red-100 text-red-800";
      case "HAUTE":
        return "bg-orange-100 text-orange-800";
      case "NORMALE":
        return "bg-blue-100 text-blue-800";
      case "BASSE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "CRITIQUE":
        return "Critique";
      case "HAUTE":
        return "Haute";
      case "NORMALE":
        return "Normale";
      case "BASSE":
        return "Basse";
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes demandes d'intervention</h1>
          <p className="text-gray-600">Suivez l'état de vos demandes d'intervention</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {interventions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Aucune demande d'intervention trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priorité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technicien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Échéance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interventions.map((intervention) => (
                    <tr key={intervention.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {intervention.titre}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {intervention.description}
                          </div>
                          {intervention.equipement && (
                            <div className="text-xs text-gray-400">
                              Équipement: {intervention.equipement}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(intervention.priorite)}`}>
                          {getPriorityText(intervention.priorite)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(intervention.statut)}`}>
                          {getStatusText(intervention.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {intervention.technicien ? (
                          <div>
                            <div>{intervention.technicien.prenom} {intervention.technicien.nom}</div>
                            <div className="text-xs text-gray-500">{intervention.technicien.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(intervention.dateCreation), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {intervention.dateEcheance ? (
                          format(new Date(intervention.dateEcheance), "dd/MM/yyyy HH:mm", { locale: fr })
                        ) : (
                          <span className="text-gray-400">Non définie</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
