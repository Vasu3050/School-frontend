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

export const loginUser = async (formData) => {
  try {
    const res = await API.patch("/users/login", formData, {
      withCredentials: true,
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

export const logoutUser = async () => {
  try {
    const res = await API.post("/users/logout", {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.statusText ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${error.response?.status || "?"})`);    
  }
}


