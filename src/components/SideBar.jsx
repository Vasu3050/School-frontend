import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ name, role, status, navItems, isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const statusColor =
    status === "active" ? "bg-green-500" :
    status === "pending" ? "bg-red-500" : "bg-yellow-500";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white-light dark:bg-surface-dark border-r border-gray-700 dark:border-neutral-dark transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex flex-col h-screen">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700 dark:border-neutral-dark lg:hidden">
          <span className="font-semibold text-lg text-white dark:text-text-primaryDark">Menu</span>
          <button
            onClick={onClose}
            className="text-white dark:text-text-primaryDark hover:bg-gray-700 dark:hover:bg-neutral-dark p-2 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain hide-scrollbar">
          {/* Profile box */}
          <div className="p-6 flex flex-col items-center text-center border-b border-gray-700 dark:border-neutral-dark">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-white">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className={`absolute bottom-0 right-0 block w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark ${statusColor}`} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold text-white dark:text-text-primaryDark">{name}</span>
              <span className="text-xs text-gray-400 dark:text-text-secondaryDark mt-1">{role} – {status}</span>
            </div>
          </div>

          {/* Menu heading */}
          <div className="px-4 pt-3 pb-1 text-sm uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">Menu</div>

          {/* Nav items */}
          <nav className="space-y-2 p-4 pt-0">
            {navItems.map((item, index) => (
              <Link
                key={`nav-item-${index}`}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary-light dark:bg-primary-dark text-white dark:text-text-primaryDark"
                    : "text-white dark:text-text-secondaryDark hover:bg-gray-700 dark:hover:bg-neutral-dark hover:text-white dark:hover:text-text-primaryDark"
                }`}
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
