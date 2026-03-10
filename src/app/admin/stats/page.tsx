'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InterventionStatsChart } from '@/components/charts/InterventionStatsChart';
import { UserStatsChart } from '@/components/charts/UserStatsChart';

export default function AdminStatsPage() {
  const { data: session } = useSession();
  const [interventions, setInterventions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [interventionsRes, usersRes] = await Promise.all([
        fetch('/api/interventions'),
        fetch('/api/users')
      ]);

      if (interventionsRes.ok) {
        const interventionsData = await interventionsRes.json();
        setInterventions(interventionsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalInterventions = interventions.length;
    const completedInterventions = interventions.filter((i: any) => i.statut === 'TERMINEE').length;
    const pendingInterventions = interventions.filter((i: any) => i.statut === 'EN_ATTENTE').length;
    const inProgressInterventions = interventions.filter((i: any) => i.statut === 'EN_COURS').length;
    const criticalInterventions = interventions.filter((i: any) => i.priorite === 'CRITIQUE').length;
    
    const totalUsers = users.length;
    const activeUsers = users.filter((u: any) => u.statut === 'ACTIF').length;
    const technicians = users.filter((u: any) => u.role.startsWith('TECHNICIAN')).length;
    const admins = users.filter((u: any) => u.role === 'ADMIN').length;
    const regularUsers = users.filter((u: any) => u.role === 'USER').length;

    const completionRate = totalInterventions > 0 ? Math.round((completedInterventions / totalInterventions) * 100) : 0;

    return {
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
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Statistiques Globales</h1>
        <p className="text-gray-600 text-lg">Vue d'ensemble du système d'interventions</p>
      </div>

      {/* Intervention Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-10 w-10 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interventions</p>
              <p className="text-3xl font-bold text-black">{stats.interventions.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-3xl font-bold text-black">{stats.interventions.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <ClockIcon className="h-10 w-10 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-3xl font-bold text-black">{stats.interventions.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critiques</p>
              <p className="text-3xl font-bold text-black">{stats.interventions.critical}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <ChartBarIcon className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux de Résolution</p>
              <p className="text-3xl font-bold text-black">{stats.interventions.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <UserGroupIcon className="h-10 w-10 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-3xl font-bold text-black">{stats.users.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <UserGroupIcon className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-3xl font-bold text-black">{stats.users.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-10 w-10 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Techniciens</p>
              <p className="text-3xl font-bold text-black">{stats.users.technicians}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <UserGroupIcon className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administrateurs</p>
              <p className="text-3xl font-bold text-black">{stats.users.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8 mb-8">
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
        <h2 className="text-xl font-bold text-black mb-6">Activité Récente</h2>
        {interventions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune intervention enregistrée</p>
        ) : (
          <div className="space-y-4">
            {interventions.slice(0, 10).map((intervention: any) => (
              <div key={intervention.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-black">{intervention.titre}</p>
                  <p className="text-sm text-gray-600">
                    {intervention.employe?.prenom} {intervention.employe?.nom}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    intervention.statut === 'TERMINEE' ? 'bg-green-100 text-green-800' :
                    intervention.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {intervention.statut}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    intervention.priorite === 'CRITIQUE' ? 'bg-red-100 text-red-800' :
                    intervention.priorite === 'HAUTE' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {intervention.priorite}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
