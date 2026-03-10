"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  CheckCircleIcon 
} from "@heroicons/react/24/outline";
import { InterventionStatsChart } from "@/components/charts/InterventionStatsChart";
import { UserStatsChart } from "@/components/charts/UserStatsChart";

interface DashboardStats {
  interventions: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    critical: number;
    completionRate: number;
  };
  users: {
    total: number;
    active: number;
    technicians: number;
    admins: number;
    users: number;
  };
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    interventions: {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      critical: 0,
      completionRate: 0,
    },
    users: {
      total: 0,
      active: 0,
      technicians: 0,
      admins: 0,
      users: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [interventionsRes, usersRes] = await Promise.all([
        fetch('/api/interventions'),
        fetch('/api/users')
      ]);

      let interventionsData = [];
      let usersData = [];

      if (interventionsRes.ok) {
        interventionsData = await interventionsRes.json();
      }

      if (usersRes.ok) {
        usersData = await usersRes.json();
      }

      // Calculate stats
      const totalInterventions = interventionsData.length;
      const completedInterventions = interventionsData.filter((i: any) => i.statut === 'TERMINEE').length;
      const pendingInterventions = interventionsData.filter((i: any) => i.statut === 'EN_ATTENTE').length;
      const inProgressInterventions = interventionsData.filter((i: any) => i.statut === 'EN_COURS').length;
      const criticalInterventions = interventionsData.filter((i: any) => i.priorite === 'CRITIQUE').length;
      
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter((u: any) => u.statut === 'ACTIF').length;
      const technicians = usersData.filter((u: any) => u.role.startsWith('TECHNICIAN')).length;
      const admins = usersData.filter((u: any) => u.role === 'ADMIN').length;
      const regularUsers = usersData.filter((u: any) => u.role === 'USER').length;

      const completionRate = totalInterventions > 0 ? Math.round((completedInterventions / totalInterventions) * 100) : 0;

      setStats({
        interventions: {
          total: totalInterventions,
          completed: completedInterventions,
          pending: pendingInterventions,
          inProgress: inProgressInterventions,
          critical: criticalInterventions,
          completionRate
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          technicians,
          admins,
          users: regularUsers
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.users.total,
      icon: UserGroupIcon,
      color: "bg-blue-500",
    },
    {
      title: "Interventions",
      value: stats.interventions.total,
      icon: WrenchScrewdriverIcon,
      color: "bg-green-500",
    },
    {
      title: "En attente",
      value: stats.interventions.pending,
      icon: ClockIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Terminées",
      value: stats.interventions.completed,
      icon: CheckCircleIcon,
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Tableau de bord Admin</h1>
        <p className="text-gray-600 text-lg">Vue d'ensemble du système</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-black mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/interventions"
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            Gérer les interventions
          </Link>
          <Link 
            href="/admin/users"
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Gérer les utilisateurs
          </Link>
          <Link 
            href="/admin/stats"
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Voir les statistiques
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Statistiques des Interventions</h2>
          <InterventionStatsChart stats={stats.interventions} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Statistiques des Utilisateurs</h2>
          <UserStatsChart stats={stats.users} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-black mb-6">Activité récente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Nouvelle intervention créée par Jean Dupont
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Intervention #123 assignée au technicien N2
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Intervention #120 marquée comme terminée
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
