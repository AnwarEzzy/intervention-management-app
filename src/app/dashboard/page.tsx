"use client";

import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { TechnicianDashboard } from "@/components/dashboard/TechnicianDashboard";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Chargement...</div>;
  }

  const role = session.user.role;

  return (
    <DashboardLayout>
      {role === "ADMIN" && <AdminDashboard />}
      {role === "USER" && <UserDashboard />}
      {(role === "TECHNICIAN_N1" || role === "TECHNICIAN_N2" || role === "TECHNICIAN_N3") && (
        <TechnicianDashboard />
      )}
    </DashboardLayout>
  );
}
