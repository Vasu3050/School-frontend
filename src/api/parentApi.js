import API from "./Axios.js";

// Get children of a parent
export const getChildren = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await API.get(`/parents/get-children?${queryParams}`, {
      data: { role: "parent" }
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