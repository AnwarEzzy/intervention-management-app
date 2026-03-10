"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusIcon, DocumentArrowDownIcon, PrinterIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { exportToPDF, exportToExcel, printInterventions, InterventionExport } from "@/lib/exportUtils";

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
  employe: {
    nom: string;
    prenom: string;
    email: string;
  };
  technicien?: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchInterventions();
  }, [statusFilter]);

  const fetchInterventions = async () => {
    try {
      const url = statusFilter 
        ? `/api/interventions?status=${statusFilter}`
        : "/api/interventions";
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des interventions");
      }
      const data = await response.json();
      setInterventions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (interventionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/interventions/${interventionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      // Refresh the list
      fetchInterventions();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
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

  // Export functions
  const handleExportPDF = () => {
    const title = statusFilter 
      ? `Fiches d'interventions - ${getStatusText(statusFilter)}`
      : 'Fiches d\'interventions - Toutes';
    exportToPDF(interventions as InterventionExport[], title);
  };

  const handleExportExcel = () => {
    const title = statusFilter 
      ? `Fiches d'interventions - ${getStatusText(statusFilter)}`
      : 'Fiches d\'interventions - Toutes';
    exportToExcel(interventions as InterventionExport[], title);
  };

  const handlePrint = () => {
    const title = statusFilter 
      ? `Fiches d'interventions - ${getStatusText(statusFilter)}`
      : 'Fiches d\'interventions - Toutes';
    printInterventions(interventions as InterventionExport[], title);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des interventions</h1>
            <p className="text-gray-600">Gérez toutes les demandes d'intervention</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{color: "black"}}>
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ANNULEE">Annulée</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Link
              href="/interventions/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Créer une intervention
            </Link>
          </div>
          
          {/* Export Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleExportPDF}
              disabled={interventions.length === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Exporter en PDF"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              PDF
            </button>
            
            <button
              onClick={handleExportExcel}
              disabled={interventions.length === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Exporter en Excel"
            >
              <TableCellsIcon className="h-4 w-4 mr-1" />
              Excel
            </button>
            
            <button
              onClick={handlePrint}
              disabled={interventions.length === 0}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Imprimer"
            >
              <PrinterIcon className="h-4 w-4 mr-1" />
              Imprimer
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {interventions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Aucune intervention trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intervention
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demandeur
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
                      Actions
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{intervention.employe.prenom} {intervention.employe.nom}</div>
                          <div className="text-xs text-gray-500">{intervention.employe.email}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {intervention.statut === "EN_ATTENTE" && (
                            <button
                              onClick={() => handleStatusUpdate(intervention.id, "EN_COURS")}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Démarrer
                            </button>
                          )}
                          {intervention.statut === "EN_COURS" && (
                            <button
                              onClick={() => handleStatusUpdate(intervention.id, "TERMINEE")}
                              className="text-green-600 hover:text-green-900"
                            >
                              Terminer
                            </button>
                          )}
                        </div>
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
