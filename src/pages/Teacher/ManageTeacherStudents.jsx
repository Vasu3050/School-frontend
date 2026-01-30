import { useEffect, useState } from "react";
import { getMyClasses } from "../../api/classApi.js";
import NotificationModel from "../../components/NotificationModel.jsx";
import StudentCard from "../../components/StudentCard.jsx"; // keep path unchanged

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchMyClasses = async () => {
    try {
      setLoading(true);
      const res = await getMyClasses();
      const payload = res?.data?.data ?? res?.data ?? [];
      setClasses(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("getMyClasses error:", err);
      setNotification({
        isOpen: true,
        type: "error",
        title: "Failed to load classes",
        message: err?.response?.data?.message || "Could not fetch your classes",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, []);

  // Action handlers: teacher-safe routes / handlers
  const handleViewStudent = (studentId) => {
    // Prefer teacher route or modal; if your router uses navigate, replace with useNavigate.
    window.location.href = `/teacher/students/${studentId}`;
  };

  const handleMarkAttendance = async (studentId, classId) => {
    try {
      // Replace with your real attendance endpoint if available.
      const url = `/student/${studentId}/attendance`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, date: new Date().toISOString().slice(0, 10) }),
        credentials: "include",
      });
      setNotification({ isOpen: true, type: "success", title: "Attendance", message: "Marked attendance (response may be stubbed)" });
    } catch (err) {
      setNotification({ isOpen: true, type: "error", title: "Attendance failed", message: err.message || "Could not mark attendance" });
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Classes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Classes you are assigned to.
        </p>
      </div>

      {loading && <p className="text-gray-500">Loading classes...</p>}
      {!loading && classes.length === 0 && <p className="text-gray-500">No classes assigned to you.</p>}

      <div className="space-y-6">
        {classes.map((cls) => (
          <div key={cls._id} className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {/* display canonical grade (backend already normalizes) */}
                  {cls.grade} - {cls.section}
                </h2>

                <p className="text-sm text-gray-500">{cls.academicYear}</p>

                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    {cls._meta?.teacherRole ?? "Subject Teacher"}
                  </span>

                  {cls._meta?.subjectsForTeacher?.length ? (
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-300">
                      Subjects: <strong>{cls._meta.subjectsForTeacher.join(", ")}</strong>
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="text-sm">
                <span className={`px-2 py-1 rounded ${cls.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                  {cls.status}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(cls.students) && cls.students.length > 0 ? (
                cls.students.map((student, idx) => {
                  // StudentCard supports actions via props: onViewDetails/onViewAttendance/onEdit/onRemove
                  return (
                    <StudentCard
                      key={student._id}
                      student={student}
                      index={idx}
                      isSelectMode={false}
                      onViewDetails={() => handleViewStudent(student._id)}
                      onViewAttendance={() => handleMarkAttendance(student._id, cls._id)}
                      onEdit={() => {
                        // Teachers shouldn't edit core student data — guard
                        setNotification({
                          isOpen: true,
                          type: "error",
                          title: "Not allowed",
                          message: "You don't have permission to edit student details.",
                        });
                      }}
                      onRemove={() => {
                        setNotification({
                          isOpen: true,
                          type: "error",
                          title: "Not allowed",
                          message: "You don't have permission to remove students.",
                        });
                      }}
                    />
                  );
                })
              ) : (
                <div className="text-gray-400">No students found for this class.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {notification && (
        <NotificationModel {...notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}
