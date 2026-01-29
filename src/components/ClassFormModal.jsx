import { useEffect, useState } from "react";
import { createClass, updateClass, getTeachers } from "../api/classApi.js";
import NotificationModel from "../components/NotificationModel.jsx";

const GRADES = ["playgroup", "nursery", "lkg", "ukg"];
const SECTIONS = ["A", "B", "C", "D"];
const SUBJECTS = [
  "Mathematics",
  "EVS",
  "Kannada",
  "Hindi",
  "English",
  "Drawing",
  "Activity",
  "Other",
];

export default function ClassFormModal({ close, refresh, editData }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => {
    const start = currentYear - 5 + i;
    return `${start}-${start + 1}`;
  });

  const [form, setForm] = useState({
    grade: "",
    section: "",
    academicYear: `${currentYear}-${currentYear + 1}`,
    classTeachers: [],
    subjectTeachers: [],
  });

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTeachers();
        const payload = res?.data?.data ?? res?.data ?? [];
        setTeachers(payload || []);
      } catch (err) {
        console.error("Failed to load teachers:", err);
        setNotification({
          isOpen: true,
          type: "error",
          title: "Failed to load teachers",
          message: err?.response?.data?.message || "Could not fetch teacher list",
        });
      }
    };
    load();

    if (editData) {
      setForm({
        grade: editData.grade,
        section: editData.section,
        academicYear: editData.academicYear,
        classTeachers: editData.classTeachers?.map((t) => t._id) || [],
        subjectTeachers:
          editData.subjectTeachers?.map((s) => ({
            subject: s.subject,
            teacher: s.teacher?._id || s.teacher || "",
          })) || [],
      });
    } else {
      setForm((f) => ({
        ...f,
        academicYear: `${currentYear}-${currentYear + 1}`,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  const notify = (obj) => setNotification({ isOpen: true, ...obj });

  const addSubjectRow = () => {
    setForm((p) => ({
      ...p,
      subjectTeachers: [...p.subjectTeachers, { subject: "", teacher: "" }],
    }));
  };

  const updateSubjectRow = (index, key, value) => {
    setForm((p) => {
      const arr = [...p.subjectTeachers];
      arr[index] = { ...arr[index], [key]: value };
      return { ...p, subjectTeachers: arr };
    });
  };

  const removeSubjectRow = (index) => {
    setForm((p) => {
      const arr = [...p.subjectTeachers];
      arr.splice(index, 1);
      return { ...p, subjectTeachers: arr };
    });
  };

  const validate = () => {
    if (!form.grade) {
      notify({ type: "error", title: "Validation", message: "Select grade" });
      return false;
    }
    if (!form.section) {
      notify({ type: "error", title: "Validation", message: "Select section" });
      return false;
    }
    if (!form.academicYear || !/^\d{4}-\d{4}$/.test(form.academicYear)) {
      notify({
        type: "error",
        title: "Validation",
        message: "Academic year must be YYYY-YYYY",
      });
      return false;
    }
    if (!Array.isArray(form.classTeachers) || form.classTeachers.length === 0) {
      notify({
        type: "error",
        title: "Validation",
        message: "Select at least one class teacher",
      });
      return false;
    }
    const subjects = form.subjectTeachers.map((s) => s.subject && s.subject.toLowerCase());
    const dup = subjects.filter((s) => s).length !== new Set(subjects.filter(Boolean)).size;
    if (dup) {
      notify({
        type: "error",
        title: "Validation",
        message: "Duplicate subjects in subject-teacher mapping",
      });
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        grade: form.grade,
        section: form.section,
        academicYear: form.academicYear,
        classTeachers: form.classTeachers,
        subjectTeachers: form.subjectTeachers
          .filter((s) => s.subject && s.teacher)
          .map((s) => ({ subject: s.subject, teacher: s.teacher })),
      };

      if (editData) {
        await updateClass(editData._id, payload);
        notify({ type: "success", title: "Updated", message: "Class updated" });
      } else {
        await createClass(payload);
        notify({ type: "success", title: "Created", message: "Class created" });
      }
      refresh();
      close();
    } catch (err) {
      console.error("Create/update error:", err);
      notify({
        type: "error",
        title: "Save failed",
        message: err?.response?.data?.message || err.message || "Failed to save",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop with blur for iPhone-like effect */}
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-[10px]"
          onClick={close}
        />
        <div
          className="
            relative z-50 w-full max-w-2xl rounded-xl
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            shadow-2xl p-6
            transform transition-all duration-300 ease-out
            scale-100 opacity-100
          "
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editData ? "Edit Class" : "Create Class"}
            </h2>
            <button
              onClick={close}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              <option value="">Select Grade</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              <option value="">Select Section</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              <option value="">Select Academic Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm">Class Teachers (select 1+)</label>
            <select
              multiple
              className="w-full border p-2 rounded h-36 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={form.classTeachers}
              onChange={(e) =>
                setForm({
                  ...form,
                  classTeachers: [...e.target.selectedOptions].map((o) => o.value),
                })
              }
            >
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hold Ctrl/Cmd or use the UI to select multiple teachers.
            </p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-sm">Subject → Teacher</label>
              <button
                onClick={addSubjectRow}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add
              </button>
            </div>

            {form.subjectTeachers.length === 0 && (
              <p className="text-sm text-gray-400 mb-2">No subject assignments yet</p>
            )}

            {form.subjectTeachers.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <select
                  value={s.subject}
                  onChange={(e) => updateSubjectRow(i, "subject", e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                >
                  <option value="">Subject</option>
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

                <select
                  value={s.teacher}
                  onChange={(e) => updateSubjectRow(i, "teacher", e.target.value)}
                  className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                >
                  <option value="">Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <button onClick={() => removeSubjectRow(i)} className="text-red-600 hover:text-red-700 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={close} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Class"}
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <NotificationModel
          isOpen={notification.isOpen}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
