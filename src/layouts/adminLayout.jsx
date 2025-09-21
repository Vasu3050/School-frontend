// src/layouts/AdminLayout.jsx
import React, { useState, createContext, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdPersonAdd,
  MdPhotoLibrary,
  MdVerifiedUser,
} from "react-icons/md";
import { Menu } from "lucide-react";
import Sidebar from "../components/sideBar";
import { useSelector } from "react-redux";
import { getPendingCount } from "../api/authApi.js";

// Create context to share pending count across components
export const PendingCountContext = createContext();

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const name = useSelector((state) => state.user?.name || "Admin");
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <MdDashboard size={20} /> },
    { path: "/admin/staff", label: "Manage Staff", icon: <MdPersonAdd size={20} /> },
    { path: "/admin/students", label: "Manage Students", icon: <MdPeople size={20} /> },
    {
      path: "/admin/approve-users",
      label: "Approve pending Users",
      icon: <MdVerifiedUser size={20} />,
      hasBadge: true, // Flag to show badge
      badgeCount: pendingCount
    },
    {
      path: "/admin/photo-gallery",
      label: "Manage Photo Gallery",
      icon: <MdPhotoLibrary size={20} />,
    },
  ];

  // Fetch pending count on mount and provide refresh function
  React.useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      console.log("Fetching pending count..."); // Debug log
      const data = await getPendingCount();
      console.log("Pending count data:", data); // Debug log
      setPendingCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching pending count:", error);
      setPendingCount(0); // Set to 0 on error
    }
  };

  // dynamic label for mobile header
  const currentLabel =
    navItems.find((item) => item.path === location.pathname)?.label ||
    "Admin";

  return (
    <PendingCountContext.Provider value={{ pendingCount, refreshPendingCount: fetchPendingCount }}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <Sidebar
          name={name}
          status="active"
          role="Admin"
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
    </PendingCountContext.Provider>
  );
}