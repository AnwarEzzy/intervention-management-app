'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TechnicianInterventionsPage() {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'black' }}>Mes Interventions</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'black' }}>Interventions Assignées</h2>
        {interventions.length === 0 ? (
          <p className="text-black" style={{ color: 'black' }}>Aucune intervention assignée</p>
        ) : (
          <div className="space-y-4">
            {interventions.map((intervention: any) => (
              <div key={intervention.id} className="border rounded-lg p-4">
                <h3 className="font-medium" style={{ color: 'black' }}>{intervention.titre}</h3>
                <p className="text-black" style={{ color: 'black' }}>{intervention.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {intervention.statut}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
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
