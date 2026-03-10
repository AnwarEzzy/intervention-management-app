"use client";

import { useState, useEffect } from "react";
import { 
  PlusCircleIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface UserStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  urgentRequests: number;
}

export function UserDashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    urgentRequests: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalRequests: 8,
      pendingRequests: 3,
      completedRequests: 5,
      urgentRequests: 1,
    });
  }, []);

  const statCards = [
    {
      title: "Mes demandes",
      value: stats.totalRequests,
      icon: PlusCircleIcon,
      color: "bg-blue-500",
    },
    {
      title: "En attente",
      value: stats.pendingRequests,
      icon: ClockIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Terminées",
      value: stats.completedRequests,
      icon: CheckCircleIcon,
      color: "bg-green-500",
    },
    {
      title: "Urgentes",
      value: stats.urgentRequests,
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Tableau de bord</h1>
        <p className="text-gray-600">Gérez vos demandes d'intervention</p>
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
            href="/user/new-request"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Nouvelle demande
          </Link>
          <Link
            href="/user/my-requests"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Voir mes demandes
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes demandes récentes</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Problème réseau - Bâtiment A</h3>
              <p className="text-sm text-gray-600">Créée le 15/01/2024</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              En attente
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Maintenance imprimante</h3>
              <p className="text-sm text-gray-600">Créée le 12/01/2024</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Terminée
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Installation logiciel</h3>
              <p className="text-sm text-gray-600">Créée le 10/01/2024</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              En cours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
