import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Users, UserCog, Home } from "lucide-react";
import Sidebar from "../components/sideBar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/admin/parents", label: "Manage Parents", icon: <Users className="w-5 h-5" /> },
    { path: "/admin/staff", label: "Manage Staff", icon: <UserCog className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-primaryLight dark:text-text-primaryDark">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full flex flex-col h-full">
        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-neutral-dark shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-primary-light dark:bg-primary-dark text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Admin Dashboard</h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
}