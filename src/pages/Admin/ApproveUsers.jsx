// ApproveUsers.jsx - IMPROVED VERSION with desktop/mobile optimization
import React, { useState, useEffect, useContext } from "react";
import { PendingCountContext } from "../../layouts/adminLayout.jsx";
import {
  getPendingUsers,
  approveUser,
  approveMultipleUsers,
  deleteMultipleUsers,
} from "../../api/authApi.js";
import { getUserDetails } from "../../api/userApi.js";
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
  const [parentPendingCount, setParentPendingCount] = useState(0);
  const [teacherPendingCount, setTeacherPendingCount] = useState(0);

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
      
      // Update individual counts
      if (userType === "parent") {
        setParentPendingCount(pendingUsers.length);
      } else {
        setTeacherPendingCount(pendingUsers.length);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Fetch users error:", error);
      setUsers([]);
      if (userType === "parent") {
        setParentPendingCount(0);
      } else {
        setTeacherPendingCount(0);
      }
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

  // Fetch both counts on mount
  useEffect(() => {
    const fetchBothCounts = async () => {
      try {
        const [parentRes, teacherRes] = await Promise.allSettled([
          getPendingUsers({ candiRole: "parent" }),
          getPendingUsers({ candiRole: "teacher" })
        ]);
        
        if (parentRes.status === 'fulfilled') {
          setParentPendingCount(parentRes.value?.data?.pendingUsers?.length || 0);
        }
        if (teacherRes.status === 'fulfilled') {
          setTeacherPendingCount(teacherRes.value?.data?.pendingUsers?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    
    fetchBothCounts();
  }, []);

  useEffect(() => {
    fetchUsers();
    refreshPendingCount();
  }, [userType]);

  const handleUserAction = async () => {
    await fetchUsers();
    await refreshPendingCount();
    
    // Refresh both counts
    try {
      const [parentRes, teacherRes] = await Promise.allSettled([
        getPendingUsers({ candiRole: "parent" }),
        getPendingUsers({ candiRole: "teacher" })
      ]);
      
      if (parentRes.status === 'fulfilled') {
        setParentPendingCount(parentRes.value?.data?.pendingUsers?.length || 0);
      }
      if (teacherRes.status === 'fulfilled') {
        setTeacherPendingCount(teacherRes.value?.data?.pendingUsers?.length || 0);
      }
    } catch (error) {
      console.error("Error refreshing counts:", error);
    }
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

  const handleApproveSelected = async () => {
    if (selectedUsers.length === 0) return;
    
    openModal({
      type: "confirm",
      title: "Approve Multiple Users",
      message: `Are you sure you want to approve ${selectedUsers.length} user(s)?`,
      confirmText: "Yes, Approve All",
      onConfirm: async () => {
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
      },
    });
  };

  const handleRejectSelected = async () => {
    if (selectedUsers.length === 0) return;
    openModal({
      type: "confirm",
      title: "Confirm Rejection",
      message: `Are you sure you want to reject ${selectedUsers.length} user(s)? This action cannot be undone.`,
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
      {/* Header with pending count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primaryLight dark:text-text-primaryDark">
          Approve Pending Users
        </h1>
        <div className="bg-gradient-to-r from-warning-light/20 to-warning-light/10 dark:from-warning-dark/30 dark:to-warning-dark/20 px-4 py-2 rounded-full flex items-center gap-3 border border-warning-light/30 dark:border-warning-dark/30 shadow-sm">
          <div className="relative">
            <svg
              className="w-5 h-5 text-warning-light dark:text-warning-dark"
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
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger-light dark:bg-danger-dark rounded-full animate-pulse">
                <span className="absolute inset-0 w-2 h-2 bg-danger-light dark:bg-danger-dark rounded-full animate-ping opacity-75"></span>
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-warning-light dark:text-warning-dark text-sm font-semibold">
              {pendingCount} Total Pending
            </span>
            <span className="text-xs text-text-mutedLight dark:text-text-mutedDark">
              {parentPendingCount} Parents • {teacherPendingCount} Teachers
            </span>
          </div>
        </div>
      </div>

      {/* Type toggle with blinking badges */}
      <div className="flex gap-3 mb-6">
        {[
          { type: "parent", icon: "👨‍👩‍👧‍👦", label: "Parents", count: parentPendingCount },
          { type: "teacher", icon: "👨‍🏫", label: "Teachers", count: teacherPendingCount }
        ].map(({ type, icon, label, count }) => (
          <button
            key={type}
            onClick={() => {
              setUserType(type);
              clearSelection();
            }}
            className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
              userType === type
                ? "bg-gradient-to-r from-primary-light to-primary-light/90 dark:from-primary-dark dark:to-primary-dark/90 text-white-light dark:text-white-dark shadow-lg scale-105"
                : "bg-surface-light dark:bg-surface-dark text-text-primaryLight dark:text-text-primaryDark hover:bg-surfaceAlt-light dark:hover:bg-surfaceAlt-dark border border-neutral-light/30 dark:border-neutral-dark/30"
            }`}
          >
            <span className="text-2xl">{icon}</span>
            <span>{label}</span>
            
            {/* Blinking badge for pending count */}
            {count > 0 && (
              <span className={`absolute -top-2 -right-2 min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center text-xs font-bold text-white-light dark:text-white-dark shadow-md ${
                userType === type 
                  ? "bg-danger-light dark:bg-danger-dark animate-pulse" 
                  : "bg-warning-light dark:bg-warning-dark"
              }`}>
                {count}
                {userType === type && (
                  <span className="absolute inset-0 rounded-full bg-danger-light dark:bg-danger-dark animate-ping opacity-75"></span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk action buttons - Mobile: Stacked, Desktop: Row */}
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
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-light to-green-light hover:from-accent-light/90 hover:to-green-light/90 disabled:opacity-50 disabled:cursor-not-allowed text-white-light dark:text-white-dark font-bold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve ({selectedUsers.length})
            </button>
            <button
              onClick={handleRejectSelected}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-danger-light to-red-light hover:from-danger-light/90 hover:to-red-light/90 disabled:opacity-50 disabled:cursor-not-allowed text-white-light dark:text-white-dark font-bold shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject ({selectedUsers.length})
            </button>
          </div>
        </div>
      )}

      {/* User list */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-primary-light/30 dark:border-primary-dark/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-light dark:border-primary-dark rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark font-medium">
              Loading {userType}s...
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
                  onViewAttendance={userType === "teacher" ? handleViewAttendance : undefined}
                  onDelete={() => {}}
                  isSelected={selectedUsers.includes(user._id)}
                  onToggleSelect={() => toggleSelect(user._id)}
                  isSelectMode={isSelectMode}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-bounce">
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
                    All {userType}s have been reviewed. Great job managing the school!
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