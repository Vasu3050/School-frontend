import API from "./Axios.js";

// Add a new student
export const addStudent = async (formData) => {
  try {
    const res = await API.post("/students/add-student", formData);
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

// Update a student by ID
export const updateStudent = async ({ id, formData, role }) => {
  try {
    const res = await API.patch(
      `/students/update-student/${id}`,
      { ...formData, role }
    );
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

// Delete a student by ID
export const deleteStudent = async (id) => {
  try {
    const res = await API.delete(`/students/delete-student/${id}`);
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

// Get a single student by ID
export const getStudent = async ({ id, role }) => {
  try {
    if (!id || !role) {
      throw new Error("Student ID and role are required");
    }
    
    const res = await API.get(`/students/get-student/${id}?role=${role}`);
    
    // Handle different response structures
    if (res.data && res.data.data && res.data.data.student) {
      return res.data.data;
    } else if (res.data && res.data.student) {
      return res.data;
    } else if (res.data) {
      return { student: res.data };
    } else {
      throw new Error("Invalid response structure from server");
    }
  } catch (err) {
    const backendMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.statusText ||
      err.message ||
      "Unknown error";
    throw new Error(`${backendMsg} (status ${err.response?.status || "?"})`);
  }
};

// Get list of students with filters
export const getStudents = async ({
  page = 1,
  limit = 10,
  name,
  grade,
  division,
  sid,
  sort = "asc",
  role,
}) => {
  try {
    const params = new URLSearchParams({ page, limit, sort, role });
    if (name) params.append("name", name);
    if (grade) params.append("grade", grade);
    if (division) params.append("division", division);
    if (sid) params.append("sid", sid);

    const res = await API.get(`/students/get-students?${params.toString()}`);
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