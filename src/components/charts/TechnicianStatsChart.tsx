'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TechnicianStats {
  total: number;
  completed: number;
  inProgress: number;
  critical: number;
  completionRate: number;
}

interface Props {
  stats: TechnicianStats;
}

export function TechnicianStatsChart({ stats }: Props) {
  // Bar chart data for intervention status
  const barData = {
    labels: ['Terminées', 'En cours', 'Critiques'],
    datasets: [
      {
        label: 'Nombre d\'interventions',
        data: [stats.completed, stats.inProgress, stats.critical],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(239, 68, 68, 0.8)', // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Doughnut chart data for completion rate
  const doughnutData = {
    labels: ['Terminées', 'En cours'],
    datasets: [
      {
        data: [stats.completed, stats.total - stats.completed],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(229, 231, 235, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(229, 231, 235, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Mes Interventions',
        color: '#000000',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
        },
        grid: {
          color: '#E5E7EB',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6B7280',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `Taux de Résolution: ${stats.completionRate}%`,
        color: '#000000',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}

