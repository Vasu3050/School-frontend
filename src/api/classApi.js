// src/api/classApi.js
import API from "./Axios.js";

export const getAllClasses = () => API.get("/class/all");
export const createClass = (payload) => API.post("/class/create", payload);
export const updateClass = (classId, payload) =>
  API.patch(`/class/${classId}`, payload);
export const toggleClassStatus = (classId) =>
  API.patch(`/class/${classId}/status`);
export const deleteClass = (classId) => API.delete(`/class/${classId}`);

// helper to fetch teachers (backend route we added/should add)
export const getTeachers = () => API.get("/users/teachers");
