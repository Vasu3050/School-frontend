// src/api/calendarApi.js
import API from "./Axios.js";

export const getCalendarMonth = (academicYearId, year, month) =>
  API.get(`/calendar/month?academicYear=${academicYearId}&year=${year}&month=${month}`);

export const getCalendarDay = (academicYearId, dateISO) =>
  API.get(`/calendar/day/${dateISO}?academicYear=${academicYearId}`);

export const createOverride = (payload) =>
  API.post("/calendar", payload);

export const updateOverride = (id, payload) =>
  API.patch(`/calendar/${id}`, payload);

export const deleteOverride = (id) =>
  API.delete(`/calendar/${id}`);