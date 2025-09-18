// StudentCard.jsx
import React, { useState, useRef } from "react";

function StudentCard({
  student,
  index = 0,
  onEdit = () => {},
  onRemove = () => {},
  onViewDetails = () => {},
  onViewAttendance = () => {},
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

  const handleEdit = () => {
    onEdit(student);
    closeMenu();
  };
  const handleRemove = () => {
    onRemove(student);
    closeMenu();
  };
  const handleViewDetails = () => {
    onViewDetails(student);
    closeMenu();
  };
  const handleViewAttendance = () => {
    onViewAttendance(student);
    closeMenu();
  };

  const handleTouchStart = () => {
    if (isSelectMode) return;
    touchTimer.current = setTimeout(() => {
      onStartSelect();
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimer.current);
  };

  const handleTouchMove = () => {
    clearTimeout(touchTimer.current);
  };

  const handleCardClick = (e) => {
    if (isSelectMode) {
      onToggleSelect();
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl shadow-lg transition-all duration-200 ${bgColor} text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 relative`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={handleCardClick}
    >
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

      <div className="flex items-center gap-3 flex-nowrap">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
          {student.name?.charAt(0) ?? "U"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-base sm:text-xl font-bold truncate">
                {student.name}
              </h3>

              <span className="text-xs text-gray-500 dark:text-gray-400 select-none">|</span>
              <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                {student.sid}
              </span>
            </div>

            {!isSelectMode && (
              <>
                <div className="hidden lg:flex gap-2">
                  <button
                    onClick={handleEdit}
                    title="Edit"
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleRemove}
                    title="Remove"
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleViewDetails}
                    title="View"
                    className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-sm"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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

                  <button
                    onClick={handleViewAttendance}
                    title="Attendance"
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </button>
                </div>

                <div className="lg:hidden relative">
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                    aria-label="More options"
                    title="More"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="absolute right-0 top-full mt-2 w-auto min-w-[180px] max-w-[95vw] bg-white-light dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 py-1"
                        role="menu"
                      >
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-100"
                        >
                          <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="font-medium">Edit Student</span>
                        </button>

                        <button
                          onClick={handleViewDetails}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-800 dark:text-gray-100"
                        >
                          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium">View Details</span>
                        </button>

                        <button
                          onClick={handleViewAttendance}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-800 dark:text-gray-100"
                        >
                          <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <span className="font-medium">View Attendance</span>
                        </button>

                        <hr className="my-1 border-gray-200 dark:border-gray-600" />

                        <button
                          onClick={handleRemove}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="font-medium">Remove Student</span>
                        </button>
                      </div>

                      <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden">
            <span className="truncate">Age {calculateAge(student.dob)}</span>
            <span className="truncate">• {student.grade}</span>
            <span className="truncate">• Div {student.division}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;