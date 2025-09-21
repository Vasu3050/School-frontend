import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDash() {
  const navigate = useNavigate();

  // Mock user & stats (replace with API calls)
  const [user, setUser] = useState({
    name: "Admin test",
    email: "testadmin001@gmail.com",
    phone: "8073710000",
    status: "active",
    role: "Admin",
  });

  const [pendingCount, setPendingCount] = useState(5); // from API
  const [academicYear, setAcademicYear] = useState("2024-25"); // from API
  const [newPassword, setNewPassword] = useState("");

  // handlers
  const handleSave = () => {
    // send user data to backend (except createdAt/updatedAt)
    console.log("Saving user info", user);
  };

  const handleAdvanceAcademicYear = () => {
    if (
      window.confirm(
        `Advance academic year to next grade? This will promote all students.`
      )
    ) {
      // call backend to advance year
      console.log("Advancing academic year");
      // setAcademicYear(nextYearFromBackend)
    }
  };

  const handleResetPassword = () => {
    if (!newPassword) return alert("Enter a new password");
    // call backend to reset password
    console.log("Resetting password to:", newPassword);
    setNewPassword("");
    alert("Password reset successful!");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 hidden lg:block text-text-primaryLight dark:text-text-primaryDark">
          Welcome, {user?.name || "User"}
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile + Password */}
          <div className="xl:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-light dark:bg-blue-dark text-blue-light dark:text-blue-dark text-3xl">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark">
                    {user?.name || "User"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`capitalize font-medium ${
                        user?.status === "active"
                          ? "text-accent-light dark:text-accent-dark"
                          : "text-warning-light dark:text-warning-dark"
                      }`}
                    >
                      {user?.status}
                    </span>
                    <span className="text-neutral-light dark:text-neutral-dark">
                      | {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondaryLight dark:text-text-secondaryDark">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surfaceAlt-light dark:bg-surfaceAlt-dark border border-neutral-light dark:border-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primaryLight dark:text-text-primaryDark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondaryLight dark:text-text-secondaryDark">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surfaceAlt-light dark:bg-surfaceAlt-dark border border-neutral-light dark:border-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primaryLight dark:text-text-primaryDark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondaryLight dark:text-text-secondaryDark">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-surfaceAlt-light dark:bg-surfaceAlt-dark border border-neutral-light dark:border-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primaryLight dark:text-text-primaryDark"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-lg bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Reset Password */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
              <h3 className="text-xl font-semibold mb-4 text-text-primaryLight dark:text-text-primaryDark">
                Reset Password
              </h3>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-surfaceAlt-light dark:bg-surfaceAlt-dark border border-neutral-light dark:border-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primaryLight dark:text-text-primaryDark"
                />
                <button
                  onClick={handleResetPassword}
                  className="px-6 py-3 rounded-lg bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
              <h3 className="text-xl font-semibold mb-6 text-text-primaryLight dark:text-text-primaryDark">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div onClick={() => navigate("/admin/students")} className="bg-blue-50 dark:bg-blue-dark/30 p-4 rounded-lg border border-blue-100 dark:border-blue-dark">
                  <div className="text-3xl font-bold text-blue-light dark:text-blue-dark">
                    24
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Active Students
                  </div>
                </div>
                <div 
                onClick={() => navigate("/admin/staff")}
                className="bg-green-50 dark:bg-green-dark/30 p-4 rounded-lg border border-green-100 dark:border-green-dark">
                  <div className="text-3xl font-bold text-green-light dark:text-green-dark">
                    8
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Staff Members
                  </div>
                </div>
                <div 
                 
                className="bg-purple-50 dark:bg-pink-dark/30 p-4 rounded-lg border border-purple-100 dark:border-pink-dark">
                  <div className="text-3xl font-bold text-pink-light dark:text-pink-dark">
                    16
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Parent Accounts
                  </div>
                </div>

                {/* Pending Users */}
                <div
                  onClick={() => navigate("/admin/approve-users")}
                  className="cursor-pointer bg-yellow-50 dark:bg-yellow-800/30 p-4 rounded-lg border border-yellow-100 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-800 transition"
                >
                  <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
                    {pendingCount}
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Pending Users
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Year */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
              <h3 className="text-xl font-semibold mb-4 text-text-primaryLight dark:text-text-primaryDark">
                Academic Year
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">
                  Current Academic Year:{" "}
                  <span className="font-semibold text-text-primaryLight dark:text-text-primaryDark">
                    {academicYear}
                  </span>
                </span>
                <button
                  onClick={handleAdvanceAcademicYear}
                  className="px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
                >
                  Advance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
            <h3 className="text-lg font-semibold mb-4 text-text-primaryLight dark:text-text-primaryDark">
              System Health
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Server Status",
                  status: "Online",
                  color: "bg-green-500",
                  width: "98%",
                  statusColor: "text-accent-light dark:text-accent-dark",
                },
                {
                  label: "Database",
                  status: "Healthy",
                  color: "bg-green-500",
                  width: "95%",
                  statusColor: "text-accent-light dark:text-accent-dark",
                },
                {
                  label: "Storage",
                  status: "78% Used",
                  color: "bg-yellow-500",
                  width: "78%",
                  statusColor: "text-warning-light dark:text-warning-dark",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondaryLight dark:text-text-secondaryDark">
                      {item.label}
                    </span>
                    <span className={`${item.statusColor}`}>{item.status}</span>
                  </div>
                  <div className="w-full bg-neutral-light dark:bg-neutral-dark rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: item.width }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}