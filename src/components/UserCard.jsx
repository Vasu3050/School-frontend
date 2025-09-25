// UserCard.jsx - Reusable component for Parent/Teacher cards
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
    ? `bg-gradient-to-r from-${baseColor}-50 to-${baseColor}-100 dark:from-gray-800 dark:to-gray-700`
    : `bg-gradient-to-r from-${baseColor}-100 to-${baseColor}-200 dark:from-gray-900 dark:to-gray-800`;

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
    if (isSelectMode) {
      onToggleSelect();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "blocked":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  const getRoleIcon = () => {
    return userType === "parent" ? "👨‍👩‍👧‍👦" : "👨‍🏫";
  };

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl shadow-lg transition-all duration-200 ${bgColor} text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 relative`}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-${baseColor}-500 bg-white-light dark:bg-gray-800 flex items-center justify-center cursor-pointer z-10 ${isSelectMode ? "" : "hidden"}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        {isSelected && (
          <svg className={`w-4 h-4 text-${baseColor}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="flex items-center gap-3 flex-nowrap">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-${baseColor}-400 to-${baseColor}-600 flex items-center justify-center text-white-primary font-bold text-lg`}>
          <span className="text-2xl">{getRoleIcon()}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold truncate">{user.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>

            {!isSelectMode && (
              <div className="hidden lg:flex gap-2">
                {user.status === "pending" && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white-primary text-sm font-medium shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white-primary text-sm font-medium shadow-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={handleViewDetails}
                  className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white-primary text-sm font-medium shadow-sm"
                >
                  View Details
                </button>

                {userType === "teacher" && (
                  <button
                    onClick={handleViewAttendance}
                    className="px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white-primary text-sm font-medium shadow-sm"
                  >
                    View Attendance
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white-primary text-sm font-medium shadow-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="mt-1 flex flex-col gap-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="truncate">{user.phone}</span>
              <span className="text-gray-400">•</span>
              <span className="capitalize">{userType}</span>
            </div>
            {user.createdAt && (
              <div className="text-xs text-gray-500">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
