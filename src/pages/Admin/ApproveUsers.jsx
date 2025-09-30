import React, { useState, useEffect, useContext } from "react";
import { PendingCountContext } from "../../layouts/adminLayout.jsx";
import {
  getPendingUsers,
  approveUser,
  approveMultipleUsers,
  deleteMultipleUsers,
} from "../../api/authApi.js";
import UserCard from "../../components/UserCard.jsx";
import NotificationModal from "../../components/NotificationModel.jsx";
import UserDashboard from "../../components/UserDashboard.jsx";

function ApproveUsers() {
  const { pendingCount, refreshPendingCount } = useContext(PendingCountContext);
  const [userType, setUserType] = useState("parent");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalProps, setModalProps] = useState({ isOpen: false });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [initialMode, setInitialMode] = useState("details");

  const isSelectMode = selectedUsers.length > 0;

  const openModal = (props) => {
    setModalProps({ isOpen: true, onClose: closeModal, ...props });
  };

  const closeModal = () => {
    setModalProps((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getPendingUsers({ candiRole: userType });
      const pendingUsers = response?.data?.pendingUsers || [];
      setUsers(pendingUsers);
      setLoading(false);
    } catch (error) {
      console.error("Fetch users error:", error);
      setUsers([]);
      setLoading(false);
      if (!error.message?.includes("not found")) {
        openModal({
          type: "error",
          title: "Error",
          message: error.message || "Failed to fetch pending users",
        });
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    refreshPendingCount();
  }, [userType]);

  const handleUserAction = async () => {
    await fetchUsers();
    await refreshPendingCount();
  };

  const toggleSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((x) => x !== userId) : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(users.map((u) => u._id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  // approve/reject/delete for single user stay the same…
  const handleApprove = (user) => {
    openModal({
      type: "confirm",
      title: "Approve User",
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
          await handleUserAction();
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to approve user",
          });
        }
      },
    });
  };

  const handleReject = (user) => {
    openModal({
      type: "confirm",
      title: "Reject User",
      message: `Are you sure you want to reject ${user.name}? This will permanently delete the account.`,
      confirmText: "Yes, Reject",
      onConfirm: async () => {
        try {
          await deleteMultipleUsers([user._id]);
          openModal({
            type: "success",
            title: "Success",
            message: `${user.name} rejected successfully!`,
          });
          await handleUserAction();
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to reject user",
          });
        }
      },
    });
  };

  // bulk approve/reject/delete
  const handleApproveSelected = async () => {
    if (selectedUsers.length === 0) return;
    try {
      setLoading(true);
      await approveMultipleUsers(selectedUsers);
      openModal({
        type: "success",
        title: "Success",
        message: `${selectedUsers.length} user(s) approved successfully!`,
      });
      clearSelection();
      await handleUserAction();
    } catch (error) {
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to approve selected users",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSelected = async () => {
    if (selectedUsers.length === 0) return;
    openModal({
      type: "confirm",
      title: "Confirm Rejection",
      message: `Are you sure you want to reject ${selectedUsers.length} user(s)?`,
      confirmText: "Yes, Reject All",
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteMultipleUsers(selectedUsers);
          openModal({
            type: "success",
            title: "Success",
            message: `${selectedUsers.length} user(s) rejected successfully!`,
          });
          clearSelection();
          await handleUserAction();
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to reject selected users",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // view details/attendance
  const handleViewDetails = (user) => {
    setSelectedUserId(user._id);
    setInitialMode("details");
    clearSelection();
  };
  const handleViewAttendance = (user) => {
    setSelectedUserId(user._id);
    setInitialMode("attendance");
    clearSelection();
  };
  const handleBackFromDashboard = () => {
    setSelectedUserId(null);
    setInitialMode("details");
  };

  if (selectedUserId) {
    return (
      <div className="w-full px-4 py-6 flex flex-col flex-1 overflow-hidden">
        <div className="md:p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow flex-1 overflow-y-auto">
          <UserDashboard
            userId={selectedUserId}
            userType={userType}
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
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark">
          Approve Pending Users
        </h1>
        <div className="bg-warning-light/20 dark:bg-warning-dark/20 px-3 py-1 rounded-full flex items-center gap-2 border border-warning-light/30 dark:border-warning-dark/30 shadow-sm">
          <svg
            className="w-4 h-4 text-warning-light dark:text-warning-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span className="text-warning-light dark:text-warning-dark text-sm font-medium">
            {pendingCount} pending approval{pendingCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* type toggle */}
      <div className="flex gap-2 mb-6">
        {["parent", "teacher"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setUserType(type);
              clearSelection();
            }}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm ${
              userType === type
                ? "bg-primary-light dark:bg-primary-dark text-white-light dark:text-white-dark shadow-md scale-105"
                : "bg-surface-light dark:bg-surface-dark text-text-primaryLight dark:text-text-primaryDark hover:bg-surfaceAlt-light dark:hover:bg-surfaceAlt-dark border border-neutral-light/30 dark:border-neutral-dark/30"
            }`}
          >
            {type === "parent" ? "👨‍👩‍👧‍👦 Parents" : "👨‍🏫 Teachers"}
          </button>
        ))}
      </div>

      {/* bulk buttons (mobile stacked) */}
      {isSelectMode && (
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleApproveSelected}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-light to-accent-light hover:from-green-light/90 hover:to-accent-light/90 disabled:opacity-50 text-white-light font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            ✅ Approve ({selectedUsers.length})
          </button>
          <button
            onClick={handleRejectSelected}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-light to-danger-light hover:from-red-light/90 hover:to-danger-light/90 disabled:opacity-50 text-white-light font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            ❌ Reject ({selectedUsers.length})
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-light dark:border-primary-dark border-t-transparent mx-auto mb-4"></div>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark font-medium">
              Loading users…
            </p>
          </div>
        </div>
      ) : (
        <div className="md:p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow flex-1 overflow-y-auto border border-neutral-light/20 dark:border-neutral-dark/20">
          <div className="space-y-3 p-4">
            {users.length > 0 ? (
              users.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  userType={userType}
                  index={index}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  onViewAttendance={
                    userType === "teacher" ? handleViewAttendance : undefined
                  }
                  onDelete={() => {}}
                  isSelected={selectedUsers.includes(user._id)}
                  onToggleSelect={() => toggleSelect(user._id)}
                  isSelectMode={isSelectMode}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">
                  {userType === "parent" ? "👨‍👩‍👧‍👦" : "👨‍🏫"}
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-3">
                    All Caught Up! 🎉
                  </h3>
                  <p className="text-lg text-text-secondaryLight dark:text-text-secondaryDark mb-2">
                    <span className="font-semibold text-accent-light dark:text-accent-dark">
                      0
                    </span>{" "}
                    {userType}s waiting for approval
                  </p>
                  <p className="text-text-secondaryLight dark:text-text-secondaryDark">
                    All {userType}s have been reviewed. Great job managing the
                    school!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <NotificationModal {...modalProps} />
    </div>
  );
}

export default ApproveUsers;
