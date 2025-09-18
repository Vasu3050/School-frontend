import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addStudent, getStudents, deleteStudent } from "../../api/StudentApi.js";
import StudentCard from "../../components/StudentCard.jsx";
import NotificationModal from "../../components/NotificationModel.jsx"; // Adjust path as needed

const ViewAllStudents = ({ openModal }) => {
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
      });
      setStudents(response.data.students || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalStudents: response.data.totalStudents || 0,
      });
    } catch (error) {
      console.error("Error fetching students:", error.message);
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
      value = value.trim().toUpperCase();
      if (value.startsWith("SID")) {
        value = value.slice(3);
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

  const handleDeleteSelected = () => {
    openModal({
      type: "confirm",
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${selected.length} student(s)? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await Promise.all(selected.map((id) => deleteStudent(id)));
          fetchStudents(pagination.currentPage);
          openModal({
            type: "success",
            title: "Success",
            message: `${selected.length} student(s) deleted successfully!`,
          });
          clearSelection();
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete students",
          });
        }
      },
    });
  };

  const handleEdit = (student) => {
    console.log("Edit student:", student);
    // Implement edit logic (e.g., open a modal with pre-filled form)
  };

  const handleRemove = (student) => {
    openModal({
      type: "confirm",
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${student.name} (${student.sid})? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await deleteStudent(student._id);
          fetchStudents(pagination.currentPage);
          openModal({
            type: "success",
            title: "Success",
            message: "Student deleted successfully!",
          });
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete student",
          });
        }
      },
    });
  };

  const handleViewDetails = (student) => {
    console.log("View details:", student);
    // Implement view details logic
  };

  const handleViewAttendance = (student) => {
    console.log("View attendance:", student);
    // Implement attendance logic
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
              ? "bg-primary-light text-white"
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
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        <select
          name="grade"
          value={filters.grade}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
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
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
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
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="asc">Sort: SID Ascending</option>
          <option value="desc">Sort: SID Descending</option>
        </select>
      </div>

      {/* Results Count and Select Controls */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {pagination.totalStudents} {pagination.totalStudents === 1 ? "student" : "students"} found
        </p>
        {isSelectMode && (
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selected.length === 0}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
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
          <p className="text-gray-700 dark:text-gray-200">No students found.</p>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalStudents > 0 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const AddStudent = ({ openModal }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    data.name = data.name.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    data.division = data.division.toUpperCase();
    try {
      await addStudent(data);
      reset();
      openModal({
        type: "success",
        title: "Success",
        message: "Student added successfully!",
      });
    } catch (error) {
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to add student",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Name</label>
        <input
          {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" }, maxLength: { value: 100, message: "Name must be at most 100 characters" } })}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Date of Birth</label>
        <input
          type="date"
          {...register("dob", { required: "Date of Birth is required", validate: value => new Date(value) <= new Date() || "Date of birth cannot be in the future" })}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Grade</label>
        <select
          {...register("grade", { required: "Grade is required" })}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Select Grade</option>
          {["playgroup", "nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        {errors.grade && <p className="text-red-500">{errors.grade.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Division</label>
        <select
          {...register("division", { required: "Division is required" })}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Select Division</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        {errors.division && <p className="text-red-500">{errors.division.message}</p>}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-primary-light text-white rounded hover:bg-primary-dark"
      >
        Add Student
      </button>
    </form>
  );
};

function ManageStudents() {
  const [activeTab, setActiveTab] = useState("view");
  const [modalProps, setModalProps] = useState({ isOpen: false });

  const openModal = (props) => {
    setModalProps({ isOpen: true, onClose: closeModal, ...props });
  };

  const closeModal = () => {
    setModalProps((prev) => ({ ...prev, isOpen: false }));
  };

  const tabs = [
    { id: "add", label: "Add Student" },
    { id: "view", label: "View All Students" },
  ];

  return (
    <div className="w-full px-4 py-6 flex flex-col flex-1 overflow-hidden">
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
      <div className="md:p-4 rounded-xl bg-gray-50 dark:bg-gray-900 shadow flex-1 overflow-y-auto">
        {activeTab === "add" && <AddStudent openModal={openModal} />}
        {activeTab === "view" && <ViewAllStudents openModal={openModal} />}
      </div>

      <NotificationModal {...modalProps} />
    </div>
  );
}

export default ManageStudents;