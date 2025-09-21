// src/pages/ApproveUsers.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPendingUsers } from "../../store/pendingUsersSlice.js";
import UserListCard from "../../components/UserListCard.jsx";

export default function ApproveUsers() {
  const dispatch = useDispatch();

  
  const pendingUsersState = useSelector((state) => state.pendingUsers) || {};
  const teachers = pendingUsersState.teachers || [];
  const parents = pendingUsersState.parents || [];

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((user) => (
        <UserListCard key={user._id} user={user} />
      ))}
      {parents.map((user) => (
        <UserListCard key={user._id} user={user} />
      ))}
    </div>
  );
}
