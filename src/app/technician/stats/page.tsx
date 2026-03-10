'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChartBarIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TechnicianStatsChart } from '@/components/charts/TechnicianStatsChart';

export default function TechnicianStatsPage() {
  const { data: session } = useSession();
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await fetch('/api/interventions');
      if (response.ok) {
        const data = await response.json();
        setInterventions(data);
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = interventions.length;
    const completed = interventions.filter((i: any) => i.statut === 'TERMINEE').length;
    const inProgress = interventions.filter((i: any) => i.statut === 'EN_COURS').length;
    const critical = interventions.filter((i: any) => i.priorite === 'CRITIQUE').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, critical, completionRate };
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
        <h1 className="text-3xl font-bold text-black mb-2">Mes Statistiques</h1>
        <p className="text-gray-600 text-lg">Vue d'ensemble de vos performances</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <ChartBarIcon className="h-10 w-10 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interventions</p>
              <p className="text-3xl font-bold text-black">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-3xl font-bold text-black">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <ClockIcon className="h-10 w-10 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-3xl font-bold text-black">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critiques</p>
              <p className="text-3xl font-bold text-black">{stats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-6">Graphiques de Performance</h2>
        <TechnicianStatsChart stats={stats} />
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-black mb-6">Résumé de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Interventions assignées</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Interventions terminées</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
            <p className="text-sm text-gray-600">Taux de résolution</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-black mb-6">Activité Récente</h2>
        {interventions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune intervention assignée</p>
        ) : (
          <div className="space-y-4">
            {interventions.slice(0, 5).map((intervention: any) => (
              <div key={intervention.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-black">{intervention.titre}</p>
                  <p className="text-sm text-gray-600">{intervention.statut}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  intervention.priorite === 'CRITIQUE' ? 'bg-red-100 text-red-800' :
                  intervention.priorite === 'HAUTE' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {intervention.priorite}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
