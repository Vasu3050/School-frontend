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

export const getPendingUsers = async (formData) => {
  try {
    const res = await API.get("/users/pending", { data: formData });
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