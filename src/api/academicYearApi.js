// academicYearApi.js
import API from "./Axios";

// Create academic year
export const createAcademicYear = async (formData) => {
  try {
    const res = await API.post("/academic-years", formData);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";

    throw new Error(
      `${backendMsg} (status ${err.response?.status || "?"})`
    );
  }
};

// Get all academic years
export const getAllAcademicYears = async () => {
  try {
    const res = await API.get("/academic-years");
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";

    throw new Error(
      `${backendMsg} (status ${err.response?.status || "?"})`
    );
  }
};

// Get academic year by ID
export const getAcademicYearById = async (id) => {
  try {
    const res = await API.get(`/academic-years/${id}`);
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";

    throw new Error(
      `${backendMsg} (status ${err.response?.status || "?"})`
    );
  }
};

// Update academic year
export const updateAcademicYear = async ({ id, formData }) => {
  try {
    const res = await API.patch(
      `/academic-years/${id}`,
      formData
    );
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";

    throw new Error(
      `${backendMsg} (status ${err.response?.status || "?"})`
    );
  }
};

// Delete academic year
export const deleteAcademicYear = async (id) => {
  try {
    const res = await API.delete(
      `/academic-years/${id}`
    );
    return res.data;
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      "Unknown error";

    throw new Error(
      `${backendMsg} (status ${err.response?.status || "?"})`
    );
  }
};