import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addStudent, getStudents, updateStudent, deleteStudent } from "../../api/StudentApi.js";
import StudentCard from "../../components/StudentCard.jsx";

const ViewAllStudents = () => {
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
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchStudents(page);
    }
  };

  const handleEdit = (student) => {
    console.log("Edit student:", student);
    // Implement edit logic (e.g., open a modal with pre-filled form)
  };

  const handleRemove = async (student) => {
    try {
      await deleteStudent(student._id);
      fetchStudents(pagination.currentPage); // Refresh the list
      alert("Student deleted successfully!");
    } catch (error) {
      alert(`Error deleting student: ${error.message}`);
    }
  };

  const handleViewDetails = (student) => {
    console.log("View details:", student);
    // Implement view details logic (e.g., show a modal with student info)
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
        <input
          type="text"
          name="grade"
          placeholder="Filter by grade"
          value={filters.grade}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          name="division"
          placeholder="Filter by division"
          value={filters.division}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        <input
          type="text"
          name="sid"
          placeholder="Filter by SID"
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

const AddStudent = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    data.name = data.name.trim().replace(/\b\w/g, (c) => c.toUpperCase()); // Standard format: capitalize each word
    data.division = data.division.toUpperCase(); // Upper case
    try {
      await addStudent(data);
      reset();
      alert("Student added successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
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

const UpdateStudent = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [studentId, setStudentId] = useState("");

  const onSubmit = async (data) => {
    if (!studentId) {
      alert("Please enter a Student ID.");
      return;
    }
    if (data.name) data.name = data.name.trim().replace(/\b\w/g, (c) => c.toUpperCase()); // Standard format: capitalize each word
    if (data.division) data.division = data.division.toUpperCase(); // Upper case
    try {
      await updateStudent({ id: studentId, formData: data });
      alert("Student updated successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
          placeholder="Enter Student ID"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Name</label>
        <input
          {...register("name", { minLength: { value: 3, message: "Name must be at least 3 characters" }, maxLength: { value: 100, message: "Name must be at most 100 characters" } })}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Date of Birth</label>
        <input
          type="date"
          {...register("dob", { validate: value => !value || new Date(value) <= new Date() || "Date of birth cannot be in the future" })}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200">Grade</label>
        <select
          {...register("grade")}
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
          {...register("division")}
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
      <div>
        <label className="block text-gray-700 dark:text-gray-200">SID</label>
        <input
          {...register("sid")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
        />
        {errors.sid && <p className="text-red-500">{errors.sid.message}</p>}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-primary-light text-white rounded hover:bg-primary-dark"
      >
        Update Student
      </button>
    </form>
  );
};

function ManageStudents() {
  const [activeTab, setActiveTab] = useState("view");

  const tabs = [
    { id: "add", label: "Add Student" },
    { id: "update", label: "Update Student" },
    { id: "view", label: "View All Students" },
    { id: "attendance", label: "Check Attendance" },
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
        {activeTab === "add" && <AddStudent />}
        {activeTab === "update" && <UpdateStudent />}
        {activeTab === "view" && <ViewAllStudents />}
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