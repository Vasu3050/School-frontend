// UserDashboard.jsx - View user details component
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { getUserDetails, updateUserDetails, deleteUser, getParentWithChildren } from "../api/userApi.js";

const UserDashboard = ({ userId, userType, initialMode, onBack, openModal }) => {
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const attendanceRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        openModal({
          type: "error",
          title: "Invalid Request",
          message: "Invalid user ID provided.",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // If parent, use the new getParentWithChildren API
        if (userType === "parent") {
          const parentResponse = await getParentWithChildren(userId);
          console.log("Parent with children response:", parentResponse);
          
          const parentData = parentResponse?.data?.parent || parentResponse?.parent;
          const childrenData = parentResponse?.data?.children || parentResponse?.children || [];
          
          if (!parentData || !parentData._id) {
            throw new Error("Invalid parent data received.");
          }
          
          setUser(parentData);
          setChildren(childrenData);
          reset({
            name: parentData.name || "",
            email: parentData.email || "",
            phone: parentData.phone || "",
          });
        } else {
          // For non-parent users, use getUserDetails
          const userResponse = await getUserDetails(userId);
          console.log("User fetch response:", userResponse);
          
          const userData = userResponse?.data?.user || userResponse?.user || userResponse;
          
          if (!userData || !userData._id) {
            throw new Error("Invalid user data received.");
          }
          
          setUser(userData);
          reset({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Fetch user error:", error);
        setLoading(false);
        openModal({
          type: "error",
          title: "Error",
          message: error.message || "Failed to fetch user details. Please try again.",
        });
      }
    };
    
    fetchUserData();
  }, [userId, userType, reset, openModal]);

  useEffect(() => {
    if (user && user._id && !loading) {
      if (initialMode === "edit") {
        setIsEditing(true);
      }
      if (initialMode === "attendance" && attendanceRef.current) {
        setTimeout(() => {
          attendanceRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [user, initialMode, loading]);

  const handleUpdate = async (data) => {
    try {
      await updateUserDetails({ id: userId, formData: data });
      setIsEditing(false);
      
      // Refresh user data based on userType
      if (userType === "parent") {
        const parentResponse = await getParentWithChildren(userId);
        const parentData = parentResponse?.data?.parent || parentResponse?.parent;
        const childrenData = parentResponse?.data?.children || parentResponse?.children || [];
        
        setUser(parentData);
        setChildren(childrenData);
        reset({
          name: parentData.name || "",
          email: parentData.email || "",
          phone: parentData.phone || "",
        });
      } else {
        const response = await getUserDetails(userId);
        const userData = response?.data?.user || response?.user || response;
        setUser(userData);
        reset({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      }
      
      openModal({
        type: "success",
        title: "Success",
        message: "User updated successfully!",
      });
    } catch (error) {
      console.error("Update user error:", error);
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to update user.",
      });
    }
  };

  const handleDelete = () => {
    if (!user) return;
    
    openModal({
      type: "confirm",
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${user.name || 'this user'} (${user.email || 'N/A'})? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await deleteUser(user._id);
          openModal({
            type: "success",
            title: "Success",
            message: "User deleted successfully!",
          });
          onBack();
        } catch (error) {
          console.error("Delete user error:", error);
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete user.",
          });
        }
      },
    });
  };

  // Generate attendance data for teachers (dummy data)
  const generateAttendanceData = (start, end) => {
    const data = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);
    while (currentDate <= endDate) {
      const day = currentDate.getDay();
      let color;
      if (day === 0) {  // Sunday = holiday (blue)
        color = "bg-blue-500 dark:bg-blue-600";
      } else {
        color = Math.random() > 0.15 ? "bg-green-500 dark:bg-green-600" : "bg-red-500 dark:bg-red-600";
      }
      data.push({ date: new Date(currentDate), color });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Failed to load user details.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white-primary rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "pending":
        return "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "blocked":
        return "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  // Generate dummy attendance data for teachers
  const months = userType === "teacher" ? [
    { name: "June 2025", data: generateAttendanceData("2025-06-01", "2025-06-30") },
    { name: "July 2025", data: generateAttendanceData("2025-07-01", "2025-07-31") },
    { name: "August 2025", data: generateAttendanceData("2025-08-01", "2025-08-31") },
    { name: "September 2025", data: generateAttendanceData("2025-09-01", "2025-09-20") },
  ] : [];

  const allData = months.flatMap(q => q.data);
  const totalDays = allData.length;
  const presentCount = allData.filter(d => d.color.startsWith("bg-green")).length;
  const absentCount = allData.filter(d => d.color.startsWith("bg-red")).length;
  const holidayCount = allData.filter(d => d.color.startsWith("bg-blue")).length;
  const presentPercent = totalDays - holidayCount > 0 ? ((presentCount / (totalDays - holidayCount)) * 100).toFixed(1) : 0;

  const renderMonthGrid = (data) => {
    const weeks = Math.ceil(data.length / 7);
    const grid = [];
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        const index = week * 7 + day;
        grid.push(index < data.length ? data[index] : { color: "bg-transparent" });
      }
    }
    return (
      <div className="grid grid-rows-7 gap-1" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
        {grid.map((day, idx) => (
          <div key={idx} className={`w-3 h-3 rounded-sm ${day.color}`} title={day.date?.toLocaleDateString()}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white-light rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            title="Edit"
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white-light shadow-sm"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white-primary shadow-sm"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          {userType === "teacher" && (
            <button
              onClick={() => attendanceRef.current?.scrollIntoView({ behavior: "smooth" })}
              title="Attendance"
              className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white-primary shadow-sm"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* User Details Section */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white-primary font-bold text-2xl">
            {userType === "parent" ? "👨‍👩‍👧‍👦" : "👨‍🏫"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white-primary">{user?.name || "N/A"}</h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user?.status)}`}>
                {user?.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userType} • Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Name</label>
              <input
                {...register("name", { 
                  required: "Name is required", 
                  minLength: { value: 3, message: "Min 3 characters" }, 
                  maxLength: { value: 50, message: "Max 50 characters" } 
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format"
                  }
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                {...register("phone", { 
                  required: "Phone is required",
                  minLength: { value: 10, message: "Min 10 digits" }
                })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white-primary rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
              >
                Update
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white-primary rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <p className="text-gray-900 dark:text-white-primary">{user?.email || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                <p className="text-gray-900 dark:text-white-primary">{user?.phone || "N/A"}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Roles:</span>
                <p className="text-gray-900 dark:text-white-primary">
                  {user?.roles && Array.isArray(user.roles) ? user.roles.join(", ") : userType}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user?.status)}`}>
                  {user?.status}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
                <p className="text-gray-900 dark:text-white-primary">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Updated:</span>
                <p className="text-gray-900 dark:text-white-primary">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Children Section (for parents) */}
      {userType === "parent" && (
        <div className="border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white-primary mb-4">Children</h3>
          {children && children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child, index) => (
                <div key={child._id || index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white-primary font-bold">
                      {child.name?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white-primary">{child.name || "N/A"}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {child.sid} • Grade {child.grade} • Div {child.division}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Age: {child.dob ? Math.floor((new Date() - new Date(child.dob)) / (1000 * 60 * 60 * 24 * 365.25)) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No children found for this parent.</p>
            </div>
          )}
        </div>
      )}

      {/* Attendance Section (for teachers) */}
      {userType === "teacher" && (
        <div ref={attendanceRef}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white-primary mb-4">Attendance (Last 4 Months)</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <span className="font-medium">Status:</span>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <span className="font-medium">Present Days:</span>
                <p className="text-lg font-bold text-blue-600">{presentCount}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <span className="font-medium">Absent Days:</span>
                <p className="text-lg font-bold text-red-600">{absentCount}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <span className="font-medium">Attendance:</span>
                <p className="text-lg font-bold text-green-600">{presentPercent}%</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="space-y-6">
                {months.map((month, i) => (
                  <div key={i}>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{month.name}</h4>
                    {renderMonthGrid(month.data)}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-6 text-xs text-gray-700 dark:text-gray-300 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 dark:bg-red-600 rounded-sm"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-sm"></div>
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white-primary mb-2">Additional Information</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>User ID: {user?._id}</p>
          <p>Account Type: {userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
          {user?.roles && user.roles.length > 1 && (
            <p>Multiple Roles: {user.roles.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;