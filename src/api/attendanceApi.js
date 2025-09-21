import API from "./Axios.js";

// Mark attendance (present)
export const markPresent = async ({ id, role, candiRole, userLatitude, userLongititude }) => {
  try {
    const endpoint = id ? `/attendance/add-attendance/${id}` : '/attendance/add-attendance';
    const res = await API.post(endpoint, {
      role,
      candiRole,
      userLatitude,
      userLongititude
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

// Mark absent (delete attendance record)
export const markAbsent = async ({ id, role, candiRole }) => {
  try {
    const res = await API.delete(`/attendance/delete-attendance/${id}`, {
      data: { role, candiRole }
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

// Get attendance by ID
export const getAttendanceById = async ({ id, role, candiRole }) => {
  try {
    const res = await API.get(`/attendance/get-attendance/${id}`, {
      data: { role, candiRole }
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

// Get attendance by date
export const getAttendanceByDate = async ({ date, role, candiRole }) => {
  try {
    const res = await API.get(`/attendance/get-attendances`, {
      data: { role, candiRole },
      params: { date }
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