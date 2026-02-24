// src/pages/CalendarManagement.jsx
import React, { useEffect, useState } from "react";
import CalendarView from "../../components/CalendarView.jsx";
import {
  getCalendarMonth,
  createOverride,
  updateOverride,
  deleteOverride,
} from "../../api/calendarApi.js";
import API from "../../api/Axios.js";

export default function CalendarManagement() {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [notification, setNotification] = useState(null);
  const [overridesList, setOverridesList] = useState([]);

  useEffect(() => {
    loadAcademicYears();
  }, []);

  async function loadAcademicYears() {
    try {
      const res = await API.get("/academic/years");
      const data = res?.data?.data || [];
      setAcademicYears(data);

      if (data.length) {
        const current =
          data.find((y) => y.isCurrent) || data[0];
        setSelectedYear(current._id);
      }
    } catch (err) {
      console.error("loadAcademicYears", err);
    }
  }

  async function onMonthFetch(year, month) {
    if (!selectedYear) return;

    try {
      const res = await getCalendarMonth(
        selectedYear,
        year,
        month
      );
      setOverridesList(res?.data?.data || []);
    } catch (err) {
      console.error("Month fetch error:", err);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const form = e.target;

    const payload = {
      academicYear: selectedYear,
      date: form.date.value,
      type: form.type.value,
      title: form.title.value,
      affectsAttendance: form.affectsAttendance.checked,
      notes: form.notes.value,
    };

    try {
      await createOverride(payload);

      setNotification({
        type: "success",
        message: "Override created",
      });

      const d = new Date(payload.date);
      onMonthFetch(d.getFullYear(), d.getMonth() + 1);

      form.reset();
    } catch (err) {
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Create failed",
      });
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete override?")) return;

    try {
      await deleteOverride(id);

      setNotification({
        type: "success",
        message: "Deleted successfully",
      });

      const now = new Date();
      onMonthFetch(now.getFullYear(), now.getMonth() + 1);
    } catch (err) {
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Delete failed",
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">
        Calendar Management
      </h1>

      {/* Academic Year Selector */}
      <div className="mt-4">
        <label>Academic Year</label>
        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value)
          }
          className="ml-2 p-2 border rounded"
        >
          <option value="">
            Select year
          </option>
          {academicYears.map((y) => (
            <option
              key={y._id}
              value={y._id}
            >
              {y.name}
              {y.isCurrent ? " (current)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <CalendarView
            academicYearId={selectedYear}
            onDateClick={(dateISO) => {
              const el = document.getElementById(
                "override-form-date"
              );
              if (el) el.value = dateISO;
            }}
          />
        </div>

        {/* Form + List */}
        <div>
          {/* Create Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="font-medium mb-2">
              Create Override
            </h2>

            <form onSubmit={handleCreate}>
              <div className="mb-2">
                <label className="block text-sm">
                  Date
                </label>
                <input
                  id="override-form-date"
                  name="date"
                  required
                  type="date"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm">
                  Type
                </label>
                <select
                  name="type"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="holiday">
                    Holiday
                  </option>
                  <option value="working_override">
                    Working (override)
                  </option>
                  <option value="half_day">
                    Half Day
                  </option>
                  <option value="event">
                    Event (no attendance)
                  </option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm">
                  Title
                </label>
                <input
                  name="title"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-2 flex items-center gap-2">
                <input
                  name="affectsAttendance"
                  type="checkbox"
                  defaultChecked
                />
                <label>
                  Affects attendance
                </label>
              </div>

              <div className="mb-2">
                <label className="block text-sm">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>

              <button className="px-3 py-2 bg-blue-600 text-white rounded">
                Create
              </button>
            </form>
          </div>

          {/* Overrides List */}
          <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-medium">
              Overrides (this month)
            </h3>

            {overridesList.length === 0 ? (
              <p className="text-gray-500">
                No overrides
              </p>
            ) : (
              <ul>
                {overridesList.map((o) => (
                  <li
                    key={o._id}
                    className="flex justify-between py-2"
                  >
                    <div>
                      <div className="font-medium">
                        {o.title || o.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(
                          o.date
                        ).toDateString()}{" "}
                        • {o.type}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(o._id)
                      }
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mt-4 p-3 rounded ${
                notification.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {notification.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}