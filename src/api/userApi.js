// userApi.js - API functions for user management
import API from "./Axios.js";


// Get user details by ID - FIXED: This function was missing
export const getUserDetails = async (id) => {
  try {
    const res = await API.get(`/users/get-user/${id}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Update user details
export const updateUserDetails = async ({ id, formData }) => {
  try {
    const res = await API.patch(`/users/update-user/${id}`, formData);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/users/delete-user/${id}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Get users by role with filters
export const getUsersByRole = async ({ 
  role, 
  page = 1, 
  limit = 10, 
  name, 
  email, 
  status,
  sort = "asc" 
}) => {
  try {
    const params = new URLSearchParams({ 
      role, 
      page, 
      limit, 
      sort 
    });
    
    if (name) params.append("name", name);
    if (email) params.append("email", email);
    if (status) params.append("status", status);

    const res = await API.get(`/users/get-users-by-role?${params.toString()}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

export const getParentWithChildren = async (parentId) => {
  try {
    const res = await API.get(`/users/children/${parentId}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Approve multiple users
export const approveMultipleUsers = async (userIds) => {
  try {
    const res = await API.patch("/users/approve-multiple", { 
      role: "admin", 
      userIds 
    });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Reject multiple users
export const rejectMultipleUsers = async (userIds) => {
  try {
    const res = await API.patch("/users/reject-multiple", { 
      role: "admin", 
      userIds 
    });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Delete multiple users
export const deleteMultipleUsers = async (userIds) => {
  try {
    const res = await API.delete("/users/delete-multiple", { 
      data: { userIds }
    });
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};