"use client";

import { useState, useEffect } from "react";
import { 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface TechnicianStats {
  assignedInterventions: number;
  inProgressInterventions: number;
  completedInterventions: number;
  urgentInterventions: number;
}

export function TechnicianDashboard() {
  const [stats, setStats] = useState<TechnicianStats>({
    assignedInterventions: 0,
    inProgressInterventions: 0,
    completedInterventions: 0,
    urgentInterventions: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      assignedInterventions: 6,
      inProgressInterventions: 2,
      completedInterventions: 4,
      urgentInterventions: 1,
    });
  }, []);

  const statCards = [
    {
      title: "Interventions assignées",
      value: stats.assignedInterventions,
      icon: WrenchScrewdriverIcon,
      color: "bg-blue-500",
    },
    {
      title: "En cours",
      value: stats.inProgressInterventions,
      icon: ClockIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Terminées",
      value: stats.completedInterventions,
      icon: CheckCircleIcon,
      color: "bg-green-500",
    },
    {
      title: "Urgentes",
      value: stats.urgentInterventions,
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Technicien</h1>
        <p className="text-gray-600">Gérez vos interventions assignées</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/technician/interventions"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            Mes interventions
          </Link>
          <Link
            href="/technician/stats"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Mes statistiques
          </Link>
        </div>
      </div>

      {/* Current Interventions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interventions en cours</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-gray-900">Panne serveur critique</h3>
              <p className="text-sm text-gray-600">Priorité: Critique • Échéance: Aujourd'hui</p>
              <p className="text-sm text-gray-600">Demandeur: Marie Martin</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              Urgent
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div>
              <h3 className="font-medium text-gray-900">Maintenance réseau</h3>
              <p className="text-sm text-gray-600">Priorité: Haute • Échéance: Demain</p>
              <p className="text-sm text-gray-600">Demandeur: Pierre Durand</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              En cours
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div>
              <h3 className="font-medium text-gray-900">Installation logiciel</h3>
              <p className="text-sm text-gray-600">Priorité: Normale • Échéance: 20/01/2024</p>
              <p className="text-sm text-gray-600">Demandeur: Sophie Bernard</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              En cours
            </span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé de performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">95%</p>
            <p className="text-sm text-gray-600">Taux de résolution</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">2.3h</p>
            <p className="text-sm text-gray-600">Temps moyen</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">4.8/5</p>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
