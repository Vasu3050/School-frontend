// src/layouts/ParentLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MdDashboard, MdFamilyRestroom, MdBook } from "react-icons/md";
import { Menu } from "lucide-react";
import Sidebar from "../components/sideBar";
import { useSelector } from "react-redux";

export default function ParentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const name = useSelector((state) => state.user?.name || "Guest");
  const location = useLocation();

  const navItems = [
    { path: "/parent", label: "Dashboard", icon: <MdDashboard size={20} /> },
    {
      path: "/parent/children",
      label: "Your Children",
      icon: <MdFamilyRestroom size={20} />,
    },
    {
      path: "/parent/daily-diary",
      label: "Daily Diary",
      icon: <MdBook size={20} />,
    },
  ];

  // find label dynamically for mobile header
  const currentLabel =
    navItems.find((item) => item.path === location.pathname)?.label ||
    "Parent";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar
        name={name}
        status="pending"
        role="Parent"
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 w-full flex flex-col h-full">
        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-lg font-semibold">{currentLabel}</h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
