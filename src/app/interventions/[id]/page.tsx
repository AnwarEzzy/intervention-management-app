'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowLeftIcon, PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  admin?: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export default function InterventionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchIntervention(params.id as string);
    }
  }, [params.id]);

  const fetchIntervention = async (id: string) => {
    try {
      const response = await fetch(`/api/interventions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setIntervention(data);
      } else {
        setError('Intervention non trouvée');
      }
    } catch (error) {
      setError('Erreur lors du chargement de l\'intervention');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'TERMINEE':
        return 'bg-green-100 text-green-800';
      case 'ANNULEE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINEE':
        return 'Terminée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITIQUE':
        return 'bg-red-100 text-red-800';
      case 'HAUTE':
        return 'bg-orange-100 text-orange-800';
      case 'NORMALE':
        return 'bg-blue-100 text-blue-800';
      case 'BASSE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'CRITIQUE':
        return 'Critique';
      case 'HAUTE':
        return 'Haute';
      case 'NORMALE':
        return 'Normale';
      case 'BASSE':
        return 'Basse';
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

  if (error || !intervention) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <Link
              href="/interventions"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Retour aux interventions
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link
              href="/interventions"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Retour
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{intervention.titre}</h1>
              <p className="text-gray-600">Détails de l'intervention</p>
            </div>
            <div className="flex space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(intervention.statut)}`}>
                {getStatusText(intervention.statut)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(intervention.priorite)}`}>
                {getPriorityText(intervention.priorite)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{intervention.description}</p>
            </div>

            {/* Equipment */}
            {intervention.equipement && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Équipement</h2>
                <p className="text-gray-700">{intervention.equipement}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut actuel:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(intervention.statut)}`}>
                    {getStatusText(intervention.statut)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priorité:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(intervention.priorite)}`}>
                    {getPriorityText(intervention.priorite)}
                  </span>
                </div>
              </div>
            </div>

            {/* People Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personnes impliquées</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demandeur</p>
                  <p className="text-gray-900">{intervention.employe.prenom} {intervention.employe.nom}</p>
                  <p className="text-sm text-gray-500">{intervention.employe.email}</p>
                </div>
                
                {intervention.technicien && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Technicien assigné</p>
                    <p className="text-gray-900">{intervention.technicien.prenom} {intervention.technicien.nom}</p>
                    <p className="text-sm text-gray-500">{intervention.technicien.email}</p>
                  </div>
                )}

                {intervention.admin && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Administrateur</p>
                    <p className="text-gray-900">{intervention.admin.prenom} {intervention.admin.nom}</p>
                    <p className="text-sm text-gray-500">{intervention.admin.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dates Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date de création</p>
                  <p className="text-gray-900">
                    {format(new Date(intervention.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
                
                {intervention.dateEcheance && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date d'échéance</p>
                    <p className="text-gray-900">
                      {format(new Date(intervention.dateEcheance), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </p>
                  </div>
                )}

                {intervention.dateCloture && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date de clôture</p>
                    <p className="text-gray-900">
                      {format(new Date(intervention.dateCloture), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
