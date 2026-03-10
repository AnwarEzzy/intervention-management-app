"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  const navigation = getNavigationByRole(role);

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
      <img src="/ocp-group.png" alt="logo" style={{width: "80px", height: "65px", position: "absolute" , left: "0px"}} />
        <h1 className="text-xl font-bold" style={{position: "absolute" , left: "100px"}}>Group O.C.P</h1>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function getNavigationByRole(role?: string) {
  switch (role) {
    case "ADMIN":
      return [
        { name: "Tableau de bord", href: "/dashboard", icon: HomeIcon },
        { name: "Interventions", href: "/interventions", icon: WrenchScrewdriverIcon },
        { name: "Utilisateurs", href: "/admin/users", icon: UserGroupIcon },
        { name: "Statistiques", href: "/admin/stats", icon: ChartBarIcon },
        { name: "Paramètres", href: "/settings", icon: CogIcon },
      ];
    
    case "USER":
      return [
        { name: "Tableau de bord", href: "/dashboard", icon: HomeIcon },
        { name: "Nouvelle demande", href: "/user/new-request", icon: PlusCircleIcon },
        { name: "Mes demandes", href: "/user/my-requests", icon: ClipboardDocumentListIcon },
        { name: "Paramètres", href: "/settings", icon: CogIcon },
      ];
    
    case "TECHNICIAN_N1":
    case "TECHNICIAN_N2":
    case "TECHNICIAN_N3":
      return [
        { name: "Tableau de bord", href: "/dashboard", icon: HomeIcon },
        { name: "Mes interventions", href: "/technician/interventions", icon: WrenchScrewdriverIcon },
        { name: "Mes statistiques", href: "/technician/stats", icon: ChartBarIcon },
        { name: "Paramètres", href: "/settings", icon: CogIcon },
      ];
    
    default:
      return [
        { name: "Tableau de bord", href: "/dashboard", icon: HomeIcon },
        { name: "Paramètres", href: "/settings", icon: CogIcon },
      ];
  }
}
