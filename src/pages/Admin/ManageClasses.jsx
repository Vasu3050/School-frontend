import { useEffect, useState } from "react";
import {
  getAllClasses,
  toggleClassStatus,
  deleteClass,
} from "../../api/classApi.js";
import ClassFormModal from "../../components/ClassFormModal.jsx";
import NotificationModel from "../../components/NotificationModel.jsx";

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = (obj) =>
    setNotification((p) => ({ ...p, ...obj, isOpen: true }));

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getAllClasses();
      const payload = res?.data?.data ?? res?.data ?? [];
      setClasses(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("fetchClasses error:", err);
      notify({
        type: "error",
        title: "Load failed",
        message: err?.response?.data?.message || "Failed to load classes",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleStatusToggle = async (id) => {
    try {
      await toggleClassStatus(id);
      notify({ type: "success", title: "Status updated", message: "" });
      fetchClasses();
    } catch (err) {
      console.error("toggle error:", err);
      notify({
        type: "error",
        title: "Status update failed",
        message: err?.response?.data?.message || "Could not update status",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete class? This action cannot be undone.")) return;
    try {
      await deleteClass(id);
      notify({ type: "success", title: "Deleted", message: "Class removed" });
      fetchClasses();
    } catch (err) {
      console.error("delete error:", err);
      notify({
        type: "error",
        title: "Delete failed",
        message: err?.response?.data?.message || "Could not delete class",
      });
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Manage Classes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage academic classes</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditClass(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Class
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No classes found</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Section</th>
                <th className="px-4 py-3 text-left">Academic Year</th>
                <th className="px-4 py-3 text-left">Class Teachers</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3">{cls.grade}</td>
                  <td className="px-4 py-3">{cls.section}</td>
                  <td className="px-4 py-3">{cls.academicYear}</td>
                  <td className="px-4 py-3">
                    {cls.classTeachers?.length ? (
                      cls.classTeachers.map((t) => t.name).join(", ")
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-2 py-1 rounded text-sm ${
                      cls.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => {
                        setEditClass(cls);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleStatusToggle(cls._id)}
                      className="text-indigo-600 hover:underline"
                    >
                      {cls.status === "active" ? "Archive" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ClassFormModal
          close={() => setModalOpen(false)}
          refresh={fetchClasses}
          editData={editClass}
        />
      )}

      {notification && (
        <NotificationModel
          isOpen={notification.isOpen ?? true}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
