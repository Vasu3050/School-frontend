// Updated src/api/authApi.js with all required functions
import API from "./Axios.js";

export const registerAdmin = async (formData) => {
  try {
    const res = await API.post("/users/admin-register", formData);
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

export const registerUser = async (formData) => {
  try {
    const res = await API.post("/users/register", formData);
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

export const loginUser = async (formData) => {
  try {
    const res = await API.patch("/users/login", formData);
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

export const logoutUser = async () => {
  try {
    const res = await API.patch("/users/logout", {});
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

export const resetPassword = async (formData) => {
  try {
    const res = await API.patch("/users/reset-password", formData);
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

export const updateUser = async (formData) => {
  try {
    const res = await API.patch("/users/update-user", formData);
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

// Get pending users with correct API call structure
export const getPendingUsers = async ({ candiRole }) => {
  try {
    const res = await API.post("/users/pending", { 
      role: "admin", 
      candiRole: candiRole 
    });
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

// Get total pending count (both teachers and parents)
export const getPendingCount = async () => {
  try {
    // Get both teacher and parent pending counts using POST requests
    const [teacherRes, parentRes] = await Promise.allSettled([
      API.post("/users/pending", { role: "admin", candiRole: "teacher" }),
      API.post("/users/pending", { role: "admin", candiRole: "parent" })
    ]);
    
    // Handle teacher response
    let teacherCount = 0;
    if (teacherRes.status === 'fulfilled') {
      teacherCount = teacherRes.value?.data?.data?.pendingUsers?.length || 0;
    } else {
      console.log("Teacher pending fetch failed:", teacherRes.reason);
    }
    
    // Handle parent response  
    let parentCount = 0;
    if (parentRes.status === 'fulfilled') {
      parentCount = parentRes.value?.data?.data?.pendingUsers?.length || 0;
    } else {
      console.log("Parent pending fetch failed:", parentRes.reason);
    }
    
    return {
      count: teacherCount + parentCount,
      teacherCount,
      parentCount
    };
  } catch (error) {
    console.error("Error fetching pending count:", error);
    return { count: 0, teacherCount: 0, parentCount: 0 };
  }
};

export const approveUser = async ({ id, role }) => {
  try {
    const res = await API.patch(`/users/approve/${id}`, { role });
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

// New functions for bulk operations
export const approveMultipleUsers = async (userIds) => {
  try {
    const res = await API.patch("/users/approve-multiple", { 
      role: "admin", 
      userIds 
    });
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

export const rejectMultipleUsers = async (userIds) => {
  try {
    const res = await API.patch("/users/reject-multiple", { 
      role: "admin", 
      userIds 
    });
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};

export const deleteMultipleUsers = async (userIds) => {
  try {
    const res = await API.delete("/users/delete-multiple", { 
      data: { userIds }
    });
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
};