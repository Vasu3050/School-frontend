import API from "./Axios.js";

// Get parents of a student
export const getParents = async ({ id, role }) => {
  try {
    const res = await API.get(`/teachers/get-parents/${id}`, {
      data: { role }
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