import React, { useState } from "react";
import StudentCard from "../../components/StudentCard.jsx";

function ManageStudents() {
  // ✅ hooks first
  const [activeTab, setActiveTab] = useState("add");

  const tabs = [
    { id: "add", label: "Add Student" },
    { id: "update", label: "Update Student" },
    { id: "view", label: "View All Students" },
    { id: "attendance", label: "Check Attendance" },
  ];

  return (
    <div className="w-full px-4 py-6">
      {/* Top Tabs */}
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
                  ? "bg-primary-light text-white dark:bg-primary-dark dark:text-white shadow text-zinc-50"
                  : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="md:p-4 rounded-xl bg-gray-50 dark:bg-gray-900 shadow">
        {activeTab === "add" && (
          <p className="text-gray-800 dark:text-gray-100">
            Add student component will load here.
          </p>
        )}

        {activeTab === "update" && (
          // Replace with your actual update component
          <p className="text-gray-800 dark:text-gray-100">
            Update Student Component will load here.
          </p>
          // <StudentCard /> // if you have a StudentCard component
        )}

        {activeTab === "view" && (
          <StudentCard/>
        )}

        {activeTab === "attendance" && (
          <p className="text-gray-800 dark:text-gray-100">
            Attendance Component will load here.
          </p>
        )}
      </div>
    </div>
  );
}

export default ManageStudents;
