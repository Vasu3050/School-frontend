import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ navItems, isOpen, onClose }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed rounded-sm lg:relative z-50 lg:z-auto h-full w-64 transform bg-white-light dark:bg-surface-dark border-r border-gray-700 dark:border-neutral-dark transition-transform duration-300 ease-in-out flex-shrink-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-4 lg:hidden border-b border-gray-700 dark:border-neutral-dark">
        <span className="font-semibold text-lg text-white dark:text-text-primaryDark">Menu</span>
        <button
          onClick={onClose}
          className="text-white dark:text-text-primaryDark hover:bg-gray-700 dark:hover:bg-neutral-dark p-2 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar content */}
      <div className="h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 hidden lg:block text-white dark:text-text-primaryDark">
            Admin Panel
          </h2>
          <nav className="space-y-2">
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