// src/api/UserApi.js
import API from "./Axios.js";

// ✅ Auth functions
export const registerUser = async (formData) => {
  try {
    const res = await API.post("/users/register", formData, {
      withCredentials: true,
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

export const loginUser = async (formData) => {
  try {
    const res = await API.patch("/users/login", formData, {
      withCredentials: true,
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

export const logoutUser = async () => {
  try {
    const res = await API.post("/users/logout", {}, { withCredentials: true });
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

// ✅ User self-service
export const getUserDetails = async () => {
  try {
    const res = await API.get("/users/me", { withCredentials: true });
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

export const updateUser = async (formData) => {
  try {
    const res = await API.patch("/users/update", formData, {
      withCredentials: true,
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

export const resetPassword = async (formData) => {
  try {
    const res = await API.patch("/users/reset-password", formData, {
      withCredentials: true,
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

// ✅ Admin moderation
export const getPendingUsers = async (payload) => {
  try {
    const res = await API.get("/users/pending", payload, {
      withCredentials: true,
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

export const approveUser = async (userId, payload) => {
  try {
    const res = await API.patch(`/users/approve/${userId}`, payload, {
      withCredentials: true,
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
