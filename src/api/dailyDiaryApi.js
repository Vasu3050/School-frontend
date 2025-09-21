import API from "./Axios.js";

// Write new diary entry
export const writeNewDiary = async (formData) => {
  try {
    const res = await API.post("/diary/writeNew", formData);
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

// Edit diary entry
export const editDiary = async ({ id, formData }) => {
  try {
    const res = await API.patch(`/diary/update/${id}`, formData);
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

// Delete diary entry
export const deleteDiary = async (id) => {
  try {
    const res = await API.delete(`/diary/delete/${id}`);
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

// Get diary entries with filters
export const getDiary = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const res = await API.get(`/diary/get-diary?${queryParams}`, {
      data: { role: params.role }
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