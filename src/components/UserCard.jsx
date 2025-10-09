// UserCard.jsx — Compact StudentCard-style layout with desktop big buttons
import React, { useState, useRef } from "react";

function UserCard({
  user,
  userType,
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
  const bgColor = isEven
    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700"
    : "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800";

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const closeMenu = () => setIsMenuOpen(false);

  // Mobile long press to select
  const handleTouchStart = () => {
    if (isSelectMode) return;
    touchTimer.current = setTimeout(() => {
      onStartSelect();
    }, 500);
  };
  const handleTouchEnd = () => clearTimeout(touchTimer.current);
  const handleTouchMove = () => clearTimeout(touchTimer.current);

  const handleCardClick = () => {
    if (isSelectMode) onToggleSelect();
  };

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl shadow-md transition-all duration-200 ${bgColor} text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 relative`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-800 flex items-center justify-center cursor-pointer z-10 ${isSelectMode ? "" : "hidden"}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        {isSelected && (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Row layout - all in one line */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
            {user.name?.charAt(0) ?? "U"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold truncate">{user.name}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 select-none">|</span>
              <span className="text-xs sm:text-sm font-medium capitalize">{userType}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {user.email} | {user.phone}
            </div>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop Big Buttons */}
          <div className="hidden md:flex gap-2">
            {user.status === "pending" && (
              <>
                <button
                  onClick={() => onApprove(user)}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-sm transition-all text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(user)}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-sm transition-all text-sm"
                >
                  Reject
                </button>
              </>
            )}

            <button
              onClick={() => onViewDetails(user)}
              title="View Details"
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
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
                onClick={() => onViewAttendance(user)}
                title="View Attendance"
                className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4"
                  />
                </svg>
              </button>
            )}

            <button
              onClick={() => onDelete(user)}
              title="Delete"
              className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile 3-dot menu */}
          <div className="md:hidden relative">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-auto min-w-[170px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 py-1">
                {user.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        onApprove(user);
                        closeMenu();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 font-medium"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => {
                        onReject(user);
                        closeMenu();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 font-medium"
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    onViewDetails(user);
                    closeMenu();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 font-medium"
                >
                  👁️ View Details
                </button>
                {userType === "teacher" && (
                  <button
                    onClick={() => {
                      onViewAttendance(user);
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-600 font-medium"
                  >
                    📊 View Attendance
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(user);
                    closeMenu();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
