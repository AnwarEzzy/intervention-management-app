"use client";

import { useSession, signOut } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { InterventionSearch } from "@/components/search/InterventionSearch";

export function Header() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <InterventionSearch />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-gray-500">{session?.user?.role}</p>
            </div>
          </div>
          
          {/* Notification Bell */}
          <NotificationDropdown />
          
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
