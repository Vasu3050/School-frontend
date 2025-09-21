// ApproveUsers.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPendingUsers } from "../store/pendingUsersSlice.js";
import { approveUser } from "../api/authApi.js";
import UserListCard from "../components/UserListCard.jsx";

export default function ApproveUsers() {
  const { list, loading, error } = useSelector((s) => s.pendingUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const handleApprove = async (user) => {
    try {
      await approveUser(user._id, { approved: true });
      dispatch(fetchPendingUsers());
    } catch (err) {
      alert(err.message);
    }
  };

  // Split by roles here
  const teachers = list.filter((u) => u.roles.includes("teacher"));
  const parents = list.filter((u) => u.roles.includes("parent"));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Pending User Approvals</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Teachers</h2>
          <div className="space-y-4">
            {teachers.length === 0 ? (
              <p className="text-gray-500">No pending teachers</p>
            ) : (
              teachers.map((teacher) => (
                <UserListCard
                  key={teacher._id}
                  user={teacher}
                  actions={[
                    {
                      label: "Approve",
                      onClick: handleApprove,
                      className: "bg-green-500 text-white hover:bg-green-600",
                    },
                  ]}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Parents</h2>
          <div className="space-y-4">
            {parents.length === 0 ? (
              <p className="text-gray-500">No pending parents</p>
            ) : (
              parents.map((parent) => (
                <UserListCard
                  key={parent._id}
                  user={parent}
                  actions={[
                    {
                      label: "Approve",
                      onClick: handleApprove,
                      className: "bg-green-500 text-white hover:bg-green-600",
                    },
                  ]}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
