// ManageStudents.jsx (FIXED)
import React, { useState, useEffect } from "react";
import ViewAllStudents from "../../components/ViewAllStudents.jsx";
import AddStudent from "../../components/AddStudent.jsx";
import StudentDashboard from "../../components/StudentDashboard.jsx";
import NotificationModal from "../../components/NotificationModel.jsx";

function ManageStudents() {
  const [activeTab, setActiveTab] = useState("view");
  const [modalProps, setModalProps] = useState({ isOpen: false });
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [initialMode, setInitialMode] = useState("details");

  // Debug logging
  useEffect(() => {
    console.log("ManageStudents state updated:", {
      activeTab,
      selectedStudentId,
      initialMode
    });
  }, [activeTab, selectedStudentId, initialMode]);

  const openModal = (props) => {
    setModalProps({ isOpen: true, onClose: closeModal, ...props });
  };

  const closeModal = () => {
    setModalProps((prev) => ({ ...prev, isOpen: false }));
  };

  // FIXED: Reset to view tab when going back from student dashboard
  const handleBackFromDashboard = () => {
    setSelectedStudentId(null);
    setInitialMode("details");
    setActiveTab("view");
  };

  // FIXED: Better state management for navigation
  const handleStudentSelection = (studentId, mode = "details") => {
    console.log("Navigating to student:", studentId, "mode:", mode);
    setSelectedStudentId(studentId);
    setInitialMode(mode);
    setActiveTab("view"); // Ensure we're in the correct tab
  };

  const tabs = [
    { id: "add", label: "Add Student" },
    { id: "view", label: "View All Students" },
  ];

  // FIXED: Only show tabs when not viewing individual student
  const showTabs = !selectedStudentId;

  return (
    <div className="w-full px-4 py-6 flex flex-col flex-1 overflow-hidden">
      {/* FIXED: Only show tabs when not in student dashboard mode */}
      {showTabs && (
        <div className="flex flex-col md:flex-row md:justify-start gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                rounded-xl transition-colors font-medium
                w-full md:w-auto
                px-3 py-2 md:px-4 md:py-2
                text-sm md:text-base
                ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-white shadow"
                    : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="md:p-4 rounded-xl bg-gray-50 dark:bg-gray-900 shadow flex-1 overflow-y-auto">
        {selectedStudentId ? (
          <StudentDashboard
            id={selectedStudentId}
            initialMode={initialMode}
            onBack={handleBackFromDashboard}
            openModal={openModal}
          />
        ) : activeTab === "add" ? (
          <AddStudent openModal={openModal} />
        ) : (
          <ViewAllStudents
            openModal={openModal}
            setSelectedStudentId={(studentId) => handleStudentSelection(studentId, "details")}
            setInitialMode={(mode) => {
              // This will be called by the ViewAllStudents component
              setInitialMode(mode);
            }}
          />
        )}
      </div>

      <NotificationModal {...modalProps} />
    </div>
  );
}

export default ManageStudents;