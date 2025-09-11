import React from "react";

export default function AdminDash() {
  // Mock user data
  const user = {
    name: "Admin test",
    email: "testadmin001@gmail.com",
    phone: "8073710000",
    status: "active", // or pending
    role: "Admin", // added for display
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 hidden lg:block text-text-primaryLight dark:text-text-primaryDark">
          Welcome, {user?.name || "User"}
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-2">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
              <div className="flex items-center gap-4 mb-6">
                {/* Admin icon */}
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
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    className="w-full px-4 py-3 rounded-lg bg-surfaceAlt-light dark:bg-surfaceAlt-dark border border-neutral-light dark:border-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primaryLight dark:text-text-primaryDark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondaryLight dark:text-text-secondaryDark">
                    Phone
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.phone || ""}
                    className="w-full px-4 py-3 rounded-lg bg-surfaceAlt-light dark:bg-surfaceAlt-dark border border-neutral-light dark:border-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primaryLight dark:text-text-primaryDark"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
              <h3 className="text-xl font-semibold mb-6 text-text-primaryLight dark:text-text-primaryDark">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-dark/30 p-4 rounded-lg border border-blue-100 dark:border-blue-dark">
                  <div className="text-3xl font-bold text-blue-light dark:text-blue-dark">
                    24
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Active Students
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-dark/30 p-4 rounded-lg border border-green-100 dark:border-green-dark">
                  <div className="text-3xl font-bold text-green-light dark:text-green-dark">
                    8
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Staff Members
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-pink-dark/30 p-4 rounded-lg border border-purple-100 dark:border-pink-dark">
                  <div className="text-3xl font-bold text-pink-light dark:text-pink-dark">
                    16
                  </div>
                  <div className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                    Parent Accounts
                  </div>
                </div>
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
                  statusColor:
                    "text-accent-light dark:text-accent-dark",
                },
                {
                  label: "Database",
                  status: "Healthy",
                  color: "bg-green-500",
                  width: "95%",
                  statusColor:
                    "text-accent-light dark:text-accent-dark",
                },
                {
                  label: "Storage",
                  status: "78% Used",
                  color: "bg-yellow-500",
                  width: "78%",
                  statusColor:
                    "text-warning-light dark:text-warning-dark",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondaryLight dark:text-text-secondaryDark">
                      {item.label}
                    </span>
                    <span className={`${item.statusColor}`}>
                      {item.status}
                    </span>
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
