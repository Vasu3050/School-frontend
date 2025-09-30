// UserCard.jsx - styled like StudentCard, mobile-friendly with dropdown actions
import React, { useState, useRef } from "react";

function UserCard({
  user,
  userType, // "parent" or "teacher"
  index = 0,
  onApprove = () => {},
  onReject = () => {},
  onViewDetails = () => {},
  onViewAttendance = () => {},
  onDelete = () => {},
  isSelected = false,
  onToggleSelect = () => {},
  onStartSelect = () => {},
  isSelectMode = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const touchTimer = useRef(null);

  const isEven = index % 2 === 0;
  const baseColor = userType === "parent" ? "purple" : "blue";

  const bgColor = isEven
    ? `bg-gradient-to-r from-${baseColor}-50 to-${baseColor}-100 dark:from-surfaceAlt-dark dark:to-surface-dark`
    : `bg-gradient-to-r from-${baseColor}-100 to-${baseColor}-200 dark:from-surface-dark dark:to-surfaceAlt-dark`;

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const closeMenu = () => setIsMenuOpen(false);

  const handleApprove = () => {
    onApprove(user);
    closeMenu();
  };
  const handleReject = () => {
    onReject(user);
    closeMenu();
  };
  const handleViewDetails = () => {
    onViewDetails(user);
    closeMenu();
  };
  const handleViewAttendance = () => {
    onViewAttendance(user);
    closeMenu();
  };
  const handleDelete = () => {
    onDelete(user);
    closeMenu();
  };

  const handleCardClick = () => {
    if (isSelectMode) onToggleSelect();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-accent-light bg-accent-light/10 dark:text-accent-dark dark:bg-accent-dark/20 border border-accent-light/20 dark:border-accent-dark/20";
      case "pending":
        return "text-warning-light bg-warning-light/10 dark:text-warning-dark dark:bg-warning-dark/20 border border-warning-light/20 dark:border-warning-dark/20";
      case "blocked":
        return "text-danger-light bg-danger-light/10 dark:text-danger-dark dark:bg-danger-dark/20 border border-danger-light/20 dark:border-danger-dark/20";
      default:
        return "text-neutral-light bg-neutral-light/10 dark:text-neutral-dark dark:bg-neutral-dark/20 border border-neutral-light/20 dark:border-neutral-dark/20";
    }
  };

  const getRoleIcon = () => (userType === "parent" ? "👨‍👩‍👧‍👦" : "👨‍🏫");

  return (
    <div
      className={`relative p-4 rounded-xl shadow-sm transition-all duration-200 ${bgColor} text-text-primaryLight dark:text-text-primaryDark border border-neutral-light/20 dark:border-neutral-dark/20 hover:shadow-md hover:scale-[1.02] ${
        isSelected
          ? "ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 ring-offset-surface-light dark:ring-offset-surface-dark"
          : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-3 left-3 w-6 h-6 rounded-full border-2 border-primary-light dark:border-primary-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center cursor-pointer z-10 transition-all duration-200 ${
          isSelectMode ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } ${isSelected ? "bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        {isSelected && (
          <svg
            className="w-4 h-4 text-white-light dark:text-white-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className={`flex items-center gap-4 transition-all duration-200 ${isSelectMode ? "ml-8" : ""}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-${baseColor}-400 to-${baseColor}-600 dark:from-${baseColor}-500 dark:to-${baseColor}-700 flex items-center justify-center text-white-light shadow-md`}
        >
          <span className="text-2xl">{getRoleIcon()}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold truncate">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </span>
                  <span className="text-xs text-text-secondaryLight dark:text-text-secondaryDark capitalize font-medium">
                    {userType}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            {!isSelectMode && (
              <div className="hidden lg:flex gap-2">
                {user.status === "pending" && (
                  <>
                    <button
                      onClick={handleApprove}
                      title="Approve"
                      className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white-primary shadow-sm"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleReject}
                      title="Reject"
                      className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white-primary shadow-sm"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  onClick={handleViewDetails}
                  title="View Details"
                  className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white-primary shadow-sm"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                {userType === "teacher" && (
                  <button
                    onClick={handleViewAttendance}
                    title="Attendance"
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white-primary shadow-sm"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  title="Delete"
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white-primary shadow-sm"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Mobile 3-dot Menu */}
            {!isSelectMode && (
              <div className="lg:hidden relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                  }}
                  className="p-2 rounded-full bg-surface-light dark:bg-surface-dark hover:bg-surfaceAlt-light dark:hover:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark border border-neutral-light/30 dark:border-neutral-dark/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={closeMenu} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-neutral-light/20 dark:border-neutral-dark/20 z-20 overflow-hidden">
                      {user.status === "pending" && (
                        <>
                          <button
                            onClick={handleApprove}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-800 dark:text-gray-100"
                          >
                            <span className="text-green-500">✅</span>
                            <span className="font-medium">Approve</span>
                          </button>
                          <button
                            onClick={handleReject}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                          >
                            <span className="text-red-500">❌</span>
                            <span className="font-medium">Reject</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={handleViewDetails}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-800 dark:text-gray-100"
                      >
                        <span className="text-green-500">👁️</span>
                        <span className="font-medium">View Details</span>
                      </button>
                      {userType === "teacher" && (
                        <button
                          onClick={handleViewAttendance}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-800 dark:text-gray-100"
                        >
                          <span className="text-purple-500">📊</span>
                          <span className="font-medium">View Attendance</span>
                        </button>
                      )}
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      >
                        <span>🗑️</span>
                        <span className="font-medium">Delete User</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondaryLight dark:text-text-secondaryDark">📧</span>
              <span className="truncate text-text-primaryLight dark:text-text-primaryDark font-medium">
                {user.email}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondaryLight dark:text-text-secondaryDark">📱</span>
              <span className="text-text-primaryLight dark:text-text-primaryDark font-medium">
                {user.phone}
              </span>
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-2 text-xs text-text-secondaryLight dark:text-text-secondaryDark">
                <span>📅</span>
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSelectMode && (
        <div className="absolute inset-0 bg-primary-light/5 dark:bg-primary-dark/5 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

export default UserCard;
