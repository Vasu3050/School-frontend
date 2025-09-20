// ViewAllStudents.jsx (FIXED)
import React, { useState, useEffect } from "react";
import { getStudents, deleteStudent } from "../api/StudentApi.js";
import StudentCard from "./StudentCard.jsx";

const ViewAllStudents = ({ openModal, setSelectedStudentId, setInitialMode }) => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    grade: "",
    division: "",
    sid: "",
    sort: "asc",
  });
  const [selected, setSelected] = useState([]);

  const isSelectMode = selected.length > 0;

  const fetchStudents = async (page = 1) => {
    try {
      const response = await getStudents({
        page,
        limit: 10,
        ...filters,
        role: "admin",
      });
      setStudents(response.data.students || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalStudents: response.data.totalStudents || 0,
      });
    } catch (error) {
      console.error("Fetch students error:", error);
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch students",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleFilterChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "sid") {
      value = value.trim().toLowerCase();
      if (value.startsWith("sid")) {
        value = value.slice(3);
      }
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        value = "sid" + num.toString().padStart(2, "0");
      } else {
        value = "";
      }
    }
    setFilters({ ...filters, [e.target.name]: value });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchStudents(page);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(students.map((s) => s._id));
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const handleDeleteSelected = async () => {
    openModal({
      type: "confirm",
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${selected.length} student(s)? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          // Queue delete requests sequentially
          for (const id of selected) {
            await deleteStudent(id);
          }
          await fetchStudents(pagination.currentPage);
          openModal({
            type: "success",
            title: "Success",
            message: `${selected.length} student(s) deleted successfully!`,
          });
          clearSelection();
        } catch (error) {
          console.error("Delete selected error:", error);
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete students",
          });
        }
      },
    });
  };

  const handleRemove = (student) => {
    openModal({
      type: "confirm",
      title: "Delete Student",
      message: `Delete ${student.name} (${student.sid}) only, select multiple, or cancel?`,
      confirmText: "Delete Only This",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteStudent(student._id);
          await fetchStudents(pagination.currentPage);
          openModal({
            type: "success",
            title: "Success",
            message: "Student deleted successfully!",
          });
        } catch (error) {
          console.error("Delete student error:", error);
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete student",
          });
        }
      },
      secondaryConfirmText: "Select Multiple",
      secondaryOnConfirm: () => {
        toggleSelect(student._id);
      },
    });
  };

  // FIXED: These handlers now properly call the parent component functions
  const handleEdit = (student) => {
    console.log("Navigating to edit for student:", student._id);
    // Clear any existing selection first
    setSelected([]);
    // Set the student ID and mode
    setSelectedStudentId(student._id);
    setInitialMode("edit");
  };

  const handleViewDetails = (student) => {
    console.log("Navigating to details for student:", student._id);
    // Clear any existing selection first
    setSelected([]);
    // Set the student ID and mode
    setSelectedStudentId(student._id);
    setInitialMode("details");
  };

  const handleViewAttendance = (student) => {
    console.log("Navigating to attendance for student:", student._id);
    // Clear any existing selection first
    setSelected([]);
    // Set the student ID and mode
    setSelectedStudentId(student._id);
    setInitialMode("attendance");
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            pagination.currentPage === i
              ? "bg-blue-500 text-white-primary"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2">
        <input
          type="text"
          name="name"
          placeholder="Search by name (case-insensitive)"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 min-w-[150px]"
        />
        <select
          name="grade"
          value={filters.grade}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 min-w-[150px]"
        >
          <option value="">Filter by grade</option>
          {["playgroup", "nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <select
          name="division"
          value={filters.division}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 min-w-[150px]"
        >
          <option value="">Filter by division</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <input
          type="text"
          name="sid"
          placeholder="Filter by SID (e.g., 01 or sid01)"
          value={filters.sid}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 min-w-[150px]"
        />
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 min-w-[150px]"
        >
          <option value="asc">Sort: SID Ascending</option>
          <option value="desc">Sort: SID Descending</option>
        </select>
      </div>

      {/* Results Count and Select Controls */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          {pagination.totalStudents} {pagination.totalStudents === 1 ? "student" : "students"} found
        </p>
        {isSelectMode && (
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 rounded bg-blue-500 text-white-primary hover:bg-blue-600 text-sm"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1 rounded bg-gray-500 text-white-primary hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
              className="px-3 py-1 rounded bg-red-500 text-white-primary hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              Delete Selected ({selected.length})
            </button>
          </div>
        )}
      </div>

      {/* Student List */}
      <div className="space-y-3 p-4">
        {students.length > 0 ? (
          students.map((student, index) => (
            <StudentCard
              key={student._id}
              student={student}
              index={index}
              onEdit={handleEdit}
              onRemove={handleRemove}
              onViewDetails={handleViewDetails}
              onViewAttendance={handleViewAttendance}
              isSelected={selected.includes(student._id)}
              onToggleSelect={() => toggleSelect(student._id)}
              onStartSelect={() => toggleSelect(student._id)}
              isSelectMode={isSelectMode}
            />
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-200 text-sm">No students found.</p>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalStudents > 0 && (
        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-sm min-w-[80px]"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-sm min-w-[80px]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAllStudents;