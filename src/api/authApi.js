// src/api/authApi.js
import API from "./Axios.js";

export const registerUser = async (formData) => {
  try {
    const res = await API.post("/users/register", formData, {
      withCredentials: true
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
