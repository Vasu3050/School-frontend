import React, { useState, useEffect } from "react";
import {
  getUsersByRole,
  deleteUser,
  deleteMultipleUsers,
} from "../../api/userApi.js";
import {
  approveUser,
  approveMultipleUsers,
} from "../../api/authApi.js";
import UserCard from "../../components/UserCard.jsx";
import UserDashboard from "../../components/UserDashboard.jsx";
import NotificationModal from "../../components/NotificationModel.jsx";

const ManageStaff = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "",
    sort: "asc",
  });
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProps, setModalProps] = useState({ isOpen: false });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [initialMode, setInitialMode] = useState("details");

  const isSelectMode = selected.length > 0;

  const openModal = (props) => {
    setModalProps({ isOpen: true, onClose: closeModal, ...props });
  };

  const closeModal = () => {
    setModalProps((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getUsersByRole({
        role: "teacher",
        page,
        limit: 10,
        ...filters,
      });

      setUsers(response.data.users || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalUsers: response.data.totalUsers || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Fetch teachers error:", error);
      setLoading(false);
      openModal({
        type: "error",
        title: "Error",
        message:
          error.message ||
          "Failed to fetch teachers. Please check your connection and try again.",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchUsers(page);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(users.map((u) => u._id));
  };

  const clearSelection = () => {
    setSelected([]);
  };

  // ✅ Approve Selected
  const handleApproveSelected = async () => {
    if (selected.length === 0) return;
    openModal({
      type: "confirm",
      title: "Approve Multiple Teachers",
      message: `Are you sure you want to approve ${selected.length} teacher(s)?`,
      confirmText: "Yes, Approve All",
      onConfirm: async () => {
        try {
          setLoading(true);
          await approveMultipleUsers(selected);
          openModal({
            type: "success",
            title: "Success",
            message: `${selected.length} teacher(s) approved successfully!`,
          });
          clearSelection();
          await fetchUsers(pagination.currentPage);
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to approve selected teachers",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // ✅ Reject Selected
  const handleRejectSelected = async () => {
    if (selected.length === 0) return;
    openModal({
      type: "confirm",
      title: "Reject Multiple Teachers",
      message: `Are you sure you want to reject ${selected.length} teacher(s)? This will permanently delete their accounts.`,
      confirmText: "Yes, Reject All",
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteMultipleUsers(selected);
          openModal({
            type: "success",
            title: "Success",
            message: `${selected.length} teacher(s) rejected successfully!`,
          });
          clearSelection();
          await fetchUsers(pagination.currentPage);
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to reject selected teachers",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // ✅ Approve One
  const handleApprove = (user) => {
    openModal({
      type: "confirm",
      title: "Approve Teacher",
      message: `Are you sure you want to approve ${user.name}?`,
      confirmText: "Yes, Approve",
      onConfirm: async () => {
        try {
          await approveUser({ id: user._id, role: "admin" });
          openModal({
            type: "success",
            title: "Success",
            message: `${user.name} approved successfully!`,
          });
          await fetchUsers(pagination.currentPage);
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to approve teacher",
          });
        }
      },
    });
  };

  // ✅ Reject One
  const handleReject = (user) => {
    openModal({
      type: "confirm",
      title: "Reject Teacher",
      message: `Are you sure you want to reject ${user.name}? This will permanently delete their account.`,
      confirmText: "Yes, Reject",
      onConfirm: async () => {
        try {
          await deleteMultipleUsers([user._id]);
          openModal({
            type: "success",
            title: "Success",
            message: `${user.name} rejected successfully!`,
          });
          await fetchUsers(pagination.currentPage);
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to reject teacher",
          });
        }
      },
    });
  };

  const handleViewDetails = (user) => {
    setSelected([]);
    setSelectedUserId(user._id);
    setInitialMode("details");
  };

  const handleViewAttendance = (user) => {
    setSelected([]);
    setSelectedUserId(user._id);
    setInitialMode("attendance");
  };

  const handleBackFromDashboard = () => {
    setSelectedUserId(null);
    setInitialMode("details");
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
              ? "bg-blue-500 text-white-light dark:text-white-dark"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (selectedUserId) {
    return (
      <div className="w-full px-4 py-6 flex flex-col flex-1 overflow-hidden">
        <div className="md:p-4 rounded-xl bg-white-light dark:bg-black-light shadow flex-1 overflow-y-auto">
          <UserDashboard
            userId={selectedUserId}
            userType="teacher"
            initialMode={initialMode}
            onBack={handleBackFromDashboard}
            openModal={openModal}
          />
        </div>
        <NotificationModal {...modalProps} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primaryLight dark:text-text-primaryDark">
            Manage Teachers
          </h1>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 shadow-sm">
          <span className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
            {pagination.totalUsers} Total Teachers
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 overflow-x-auto pb-2">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-lg dark:bg-surface-dark bg-surface-light text-text-primaryLight dark:text-text-primaryDark focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        />
        <input
          type="text"
          name="email"
          placeholder="Search by email"
          value={filters.email}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-lg dark:bg-surface-dark bg-surface-light text-text-primaryLight dark:text-text-primaryDark focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-lg dark:bg-surface-dark bg-surface-light text-text-primaryLight dark:text-text-primaryDark focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-lg dark:bg-surface-dark bg-surface-light text-text-primaryLight dark:text-text-primaryDark focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        >
          <option value="asc">Sort: Name A-Z</option>
          <option value="desc">Sort: Name Z-A</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {isSelectMode && (
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex gap-2 items-center">
            <button
              onClick={selectAll}
              className="px-4 py-2 rounded-lg bg-info-light dark:bg-info-dark text-white-light dark:text-white-dark font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Select All ({users.length})
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 rounded-lg bg-neutral-light dark:bg-neutral-dark text-white-light dark:text-white-dark font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:flex-1">
            <button
              onClick={handleApproveSelected}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-light to-green-light hover:from-accent-light/90 hover:to-green-light/90 disabled:opacity-50 disabled:cursor-not-allowed text-white-light dark:text-white-dark font-bold shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Approve ({selected.length})
            </button>
            <button
              onClick={handleRejectSelected}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-danger-light to-red-light hover:from-danger-light/90 hover:to-red-light/90 disabled:opacity-50 disabled:cursor-not-allowed text-white-light dark:text-white-dark font-bold shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Reject ({selected.length})
            </button>
          </div>
        </div>
      )}

      {/* Teachers List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-primary-light/30 dark:border-primary-dark/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-light dark:border-primary-dark rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark font-medium">
              Loading teachers...
            </p>
          </div>
        </div>
      ) : (
        <div className="md:p-4 rounded-xl bg-white-light dark:bg-black-light shadow flex-1 overflow-y-auto border border-neutral-light/20 dark:border-neutral-dark/20">
          <div className="space-y-3 p-4">
            {users.length > 0 ? (
              users.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  userType="teacher"
                  index={index}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  onViewAttendance={handleViewAttendance}
                  isSelected={selected.includes(user._id)}
                  onToggleSelect={() => toggleSelect(user._id)}
                  isSelectMode={isSelectMode}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-bounce">👨‍🏫</div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-3">
                    No Teachers Found
                  </h3>
                  <p className="text-lg text-text-secondaryLight dark:text-text-secondaryDark">
                    There are no teachers matching your filters.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalUsers > 0 && (
        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2 mt-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-sm min-w-[80px] hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-sm min-w-[80px] hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}

      <NotificationModal {...modalProps} />
    </div>
  );
};

export default ManageStaff;
