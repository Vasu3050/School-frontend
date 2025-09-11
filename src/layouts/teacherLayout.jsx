// src/layouts/TeacherLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdPhotoLibrary,
  MdChecklist,
  MdAssignment,
} from "react-icons/md";
import { Menu } from "lucide-react";
import Sidebar from "../components/sideBar";
import { useSelector } from "react-redux";

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // use the same slice as other layouts
  const name = useSelector((state) => state.user.name);

  const navItems = [
    { path: "/teacher", label: "Dashboard", icon: <MdDashboard size={20} /> },
    {
      path: "/teacher/students",
      label: "Manage Students",
      icon: <MdPeople size={20} />,
    },
    {
      path: "/teacher/photo-gallery",
      label: "Manage Photo Gallery",
      icon: <MdPhotoLibrary size={20} />,
    },
    {
      path: "/teacher/student-attendance",
      label: "Student Attendance",
      icon: <MdChecklist size={20} />,
    },
    {
      path: "/teacher/my-attendance",
      label: "My Attendance",
      icon: <MdChecklist size={20} />,
    },
    {
      path: "/teacher/daily-diary",
      label: "Daily Diary",
      icon: <MdAssignment size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-primaryLight dark:text-text-primaryDark">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <Sidebar
        name={name}
        status="pending"
        role="Teacher"
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 w-full flex flex-col h-full">
        <div className="lg:hidden flex items-center p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-neutral-dark shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-primary-light dark:bg-primary-dark text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Teacher Dashboard</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
