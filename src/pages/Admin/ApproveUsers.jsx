// Fixed ApproveUsers.jsx - Simplified without tabs
import React, { useState, useEffect, useContext } from 'react';
import { PendingCountContext } from '../../layouts/adminLayout.jsx';
import { getPendingUsers, approveUser, approveMultipleUsers, deleteMultipleUsers } from '../../api/authApi.js';
import UserCard from '../../components/UserCard.jsx';
import UserDashboard from '../../components/UserDashboard.jsx';
import NotificationModal from '../../components/NotificationModel.jsx';

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

  // Fetch pending users only
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
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch pending users",
      });
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

  // Individual user actions with multiple choice modal
  const handleApprove = (user) => {
    openModal({
      type: "confirm",
      title: "Approve User",
      message: `Approve ${user.name} only, select multiple, or cancel?`,
      confirmText: "Approve Only This",
      cancelText: "Cancel",
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
      secondaryConfirmText: "Select Multiple",
      secondaryOnConfirm: () => {
        toggleSelect(user._id);
      },
    });
  };

  const handleReject = (user) => {
    openModal({
      type: "confirm",
      title: "Reject User",
      message: `Reject ${user.name} only, select multiple, or cancel? Rejection will permanently delete the account.`,
      confirmText: "Reject Only This",
      cancelText: "Cancel",
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
      secondaryConfirmText: "Select Multiple",
      secondaryOnConfirm: () => {
        toggleSelect(user._id);
      },
    });
  };

  const handleDelete = (user) => {
    openModal({
      type: "confirm",
      title: "Delete User",
      message: `Delete ${user.name} only, select multiple, or cancel?`,
      confirmText: "Delete Only This",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteMultipleUsers([user._id]);
          openModal({
            type: "success",
            title: "Success",
            message: `${user.name} deleted successfully!`,
          });
          await handleUserAction();
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete user",
          });
        }
      },
      secondaryConfirmText: "Select Multiple",
      secondaryOnConfirm: () => {
        toggleSelect(user._id);
      },
    });
  };

  // Bulk actions
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
      message: `Are you sure you want to reject ${selectedUsers.length} user(s)? This will delete their accounts permanently.`,
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

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return;
    
    openModal({
      type: "confirm",
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
      confirmText: "Yes, Delete All",
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteMultipleUsers(selectedUsers);
          openModal({
            type: "success",
            title: "Success",
            message: `${selectedUsers.length} user(s) deleted successfully!`,
          });
          clearSelection();
          await handleUserAction();
        } catch (error) {
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete selected users",
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

  // Show user dashboard if a user is selected
  if (selectedUserId) {
    return (
      <div className="w-full px-4 py-6 flex flex-col flex-1 overflow-hidden">
        <div className="md:p-4 rounded-xl bg-gray-50 dark:bg-gray-900 shadow flex-1 overflow-y-auto">
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark">
          Approve Pending Users
        </h1>
        <div className="bg-yellow-100 dark:bg-yellow-800/30 px-4 py-2 rounded-lg">
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">
            {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* User Type Toggle */}
      <div className="flex gap-2 mb-6">
        {["parent", "teacher"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setUserType(type);
              clearSelection();
            }}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${
                userType === type
                  ? "bg-purple-500 text-white dark:bg-purple-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
          >
            {type === "parent" ? "👨‍👩‍👧‍👦 Parents" : "👨‍🏫 Teachers"}
          </button>
        ))}
      </div>

      {/* Selection Controls */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p>
          {users.length} pending {userType}{users.length !== 1 ? 's' : ''} found
        </p>
        
        {isSelectMode && (
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1 rounded bg-blue-500 text-white-primary hover:bg-blue-600 text-sm font-medium"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1 rounded bg-gray-500 text-white-primary hover:bg-gray-600 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveSelected}
              disabled={selectedUsers.length === 0 || loading}
              className="px-3 py-1 rounded bg-green-500 text-white-primary hover:bg-green-600 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Processing..." : `Approve (${selectedUsers.length})`}
            </button>
            <button
              onClick={handleRejectSelected}
              disabled={selectedUsers.length === 0 || loading}
              className="px-3 py-1 rounded bg-red-500 text-white-primary hover:bg-red-600 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Processing..." : `Reject (${selectedUsers.length})`}
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedUsers.length === 0 || loading}
              className="px-3 py-1 rounded bg-gray-600 text-white-primary hover:bg-gray-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Processing..." : `Delete (${selectedUsers.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-700 dark:text-gray-300">Loading users...</p>
          </div>
        </div>
      )}

      {/* Users List */}
      {!loading && (
        <div className="md:p-4 rounded-xl bg-gray-50 dark:bg-gray-900 shadow flex-1 overflow-y-auto">
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
                  onDelete={handleDelete}
                  isSelected={selectedUsers.includes(user._id)}
                  onToggleSelect={() => toggleSelect(user._id)}
                  onStartSelect={() => toggleSelect(user._id)}
                  isSelectMode={isSelectMode}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">
                  {userType === "parent" ? "👨‍👩‍👧‍👦" : "👨‍🏫"}
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-2">
                  No Pending {userType}s
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  All {userType}s have been approved. Great job! 🎉
                </p>
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