// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MdDashboard, MdPeople, MdPersonAdd, MdPhotoLibrary, MdVerifiedUser } from "react-icons/md";
import { Menu } from "lucide-react";
import Sidebar from "../components/sideBar";
import { useSelector, useDispatch } from "react-redux";
import { fetchPendingUsers } from "../store/pendingUsersSlice";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const name = useSelector((state) => state.user?.name || "Admin");

  
  const pendingUsers = useSelector((state) => state.pendingUsers) || {};
  const teachers = pendingUsers.teachers || [];
  const parents = pendingUsers.parents || [];

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const pendingCount = teachers.length + parents.length;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <MdDashboard size={20} /> },
    { path: "/admin/staff", label: "Manage Staff", icon: <MdPersonAdd size={20} /> },
    { path: "/admin/students", label: "Manage Students", icon: <MdPeople size={20} /> },
    {
      path: "/admin/approve-users",
      label: "Approve pending Users",
      icon: (
        <div className="relative">
          <MdVerifiedUser size={20} />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
          )}
        </div>
      ),
    },
    { path: "/admin/photo-gallery", label: "Manage Photo Gallery", icon: <MdPhotoLibrary size={20} /> },
  ];

  const currentLabel = navItems.find((item) => item.path === location.pathname)?.label || "Admin";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>
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
