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
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface UserStats {
  total: number;
  active: number;
  technicians: number;
  admins: number;
  users: number;
}

interface Props {
  stats: UserStats;
}

export function UserStatsChart({ stats }: Props) {
  // Bar chart data for user roles
  const barData = {
    labels: ['Utilisateurs', 'Techniciens', 'Administrateurs'],
    datasets: [
      {
        label: 'Nombre d\'utilisateurs',
        data: [stats.users, stats.technicians, stats.admins],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(245, 158, 11, 0.8)', // Orange
          'rgba(147, 51, 234, 0.8)', // Purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(147, 51, 234, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Pie chart data for active vs inactive users
  const pieData = {
    labels: ['Actifs', 'Inactifs'],
    datasets: [
      {
        data: [stats.active, stats.total - stats.active],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green
          'rgba(239, 68, 68, 0.8)', // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
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
        text: 'Répartition par Rôle',
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

  const pieOptions = {
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
        text: `Utilisateurs Actifs: ${Math.round((stats.active / stats.total) * 100)}%`,
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
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
}
