// StudentDashboard.jsx (COMPLETE AND FIXED)
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { getStudent, updateStudent, deleteStudent } from "../api/StudentApi.js";

const StudentDashboard = ({ id, initialMode, onBack, openModal }) => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const attendanceRef = useRef(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id || typeof id !== "string" || id.trim() === "") {
        openModal({
          type: "error",
          title: "Invalid Request",
          message: "Invalid student ID provided.",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching student with ID:", id);
        
        const response = await getStudent({ id, role: "admin" });
        console.log("Student fetch response:", response);
        
        const studentData = response?.data?.student || response?.student || response;
        
        if (!studentData || !studentData._id) {
          throw new Error("Invalid student data received.");
        }
        
        setStudent(studentData);
        reset({
          name: studentData.name || "",
          dob: studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "",
          grade: studentData.grade || "",
          division: studentData.division || "",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Fetch student error:", error);
        setLoading(false);
        openModal({
          type: "error",
          title: "Error",
          message: error.message || "Failed to fetch student details. Please try again.",
        });
      }
    };
    
    fetchStudent();
  }, [id, reset, openModal]);

  useEffect(() => {
    if (student && student._id && !loading) {
      if (initialMode === "edit") {
        setIsEditing(true);
      }
      if (initialMode === "attendance" && attendanceRef.current) {
        setTimeout(() => {
          attendanceRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [student, initialMode, loading]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return "N/A";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleUpdate = async (data) => {
    try {
      await updateStudent({ id, formData: data, role: "admin" });
      setIsEditing(false);
      const response = await getStudent({ id, role: "admin" });
      const studentData = response?.data?.student || response?.student || response;
      setStudent(studentData);
      reset({
        name: studentData.name || "",
        dob: studentData.dob ? new Date(studentData.dob).toISOString().split("T")[0] : "",
        grade: studentData.grade || "",
        division: studentData.division || "",
      });
      openModal({
        type: "success",
        title: "Success",
        message: "Student updated successfully!",
      });
    } catch (error) {
      console.error("Update student error:", error);
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to update student.",
      });
    }
  };

  const handleDelete = () => {
    if (!student) return; // Guard clause
    
    openModal({
      type: "confirm",
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${student.name || 'this student'} (${student.sid || 'N/A'})? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await deleteStudent(student._id);
          openModal({
            type: "success",
            title: "Success",
            message: "Student deleted successfully!",
          });
          onBack();
        } catch (error) {
          console.error("Delete student error:", error);
          openModal({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete student.",
          });
        }
      },
    });
  };

  // Early return if still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading student details...</p>
        </div>
      </div>
    );
  }

  // Early return if no student data
  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Failed to load student details.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white-primary rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Generate attendance data only after we have student data
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
        color = Math.random() > 0.2 ? "bg-green-500 dark:bg-green-600" : "bg-red-500 dark:bg-red-600";
      }
      data.push({ date: new Date(currentDate), color });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  // Generate dummy data for last 4 months (June to September 2025, based on current date Sep 20, 2025)
  // Adjust end date for September to current date
  const months = [
    { name: "June 2025", data: generateAttendanceData("2025-06-01", "2025-06-30") },
    { name: "July 2025", data: generateAttendanceData("2025-07-01", "2025-07-31") },
    { name: "August 2025", data: generateAttendanceData("2025-08-01", "2025-08-31") },
    { name: "September 2025", data: generateAttendanceData("2025-09-01", "2025-09-20") },
  ];

  const allData = months.flatMap(q => q.data);
  const totalDays = allData.length;
  const presentCount = allData.filter(d => d.color.startsWith("bg-green")).length;
  const absentCount = allData.filter(d => d.color.startsWith("bg-red")).length;
  const holidayCount = allData.filter(d => d.color.startsWith("bg-blue")).length;
  const presentPercent = totalDays - holidayCount > 0 ? ((presentCount / (totalDays - holidayCount)) * 100).toFixed(1) : 0;

  const today = new Date("2025-09-20");
  const todayData = allData.find(d => d.date.toDateString() === today.toDateString());
  const presentToday = todayData?.color.startsWith("bg-green");

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Failed to load student details.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white-primary rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

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
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white-primary shadow-sm"
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
          <button
            onClick={() => attendanceRef.current.scrollIntoView({ behavior: "smooth" })}
            title="Attendance"
            className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white-primary shadow-sm"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white-primary mb-2">Student Details</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm">Name</label>
              <input
                {...register("name", { required: "Name is required", minLength: { value: 3, message: "Min 3 characters" }, maxLength: { value: 100, message: "Max 100 characters" } })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "Required", validate: value => new Date(value) <= new Date() || "Cannot be future" })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 text-sm"
              />
              {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm">Grade</label>
              <select
                {...register("grade", { required: "Required" })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="">Select Grade</option>
                {["playgroup", "nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.grade && <p className="text-red-500 text-xs">{errors.grade.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm">Division</label>
              <select
                {...register("division", { required: "Required" })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="">Select Division</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              {errors.division && <p className="text-red-500 text-xs">{errors.division.message}</p>}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white-primary rounded hover:bg-blue-600 text-sm">Update</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white-primary rounded hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-medium">Name:</span> {student?.name || "N/A"}</p>
            <p><span className="font-medium">SID:</span> {student?.sid || "N/A"}</p>
            <p><span className="font-medium">Age:</span> {calculateAge(student?.dob)}</p>
            <p><span className="font-medium">Grade:</span> {student?.grade || "N/A"}</p>
            <p><span className="font-medium">Division:</span> {student?.division || "N/A"}</p>
            <p><span className="font-medium">Created:</span> {student?.createdAt ? new Date(student.createdAt).toLocaleString() : "N/A"}</p>
            <p><span className="font-medium">Updated:</span> {student?.updatedAt ? new Date(student.updatedAt).toLocaleString() : "N/A"}</p>
          </div>
        )}
      </div>

      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white-primary mb-2">Parent Details</h2>
        {student?.parent && Array.isArray(student.parent) && student.parent.length > 0 ? (
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {student.parent.map((p, index) => (
              <p key={index}>
                <span className="font-medium">Parent {index + 1}:</span> {p?.name || "N/A"} ({p?.email || "N/A"})
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300">No parent details available.</p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">Parent details are populated from dummy data (API integration pending).</p>
      </div>

      <div ref={attendanceRef}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white-primary mb-2">Attendance (Last 4 Months)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-medium">Active:</span> Yes</p>
            <p><span className="font-medium">Present Today:</span> {presentToday ? "Yes" : "No"}</p>
            <p><span className="font-medium">Total Present:</span> {presentCount}</p>
            <p><span className="font-medium">Total Absent:</span> {absentCount}</p>
          </div>
          <div className="flex justify-center">
            <div 
              className="w-24 h-24 rounded-full"
              style={{ background: `conic-gradient(#22c55e 0% ${presentPercent}%, #ef4444 ${presentPercent}% 100%)` }}
            >
              <div className="flex items-center justify-center h-full text-sm text-gray-800 dark:text-gray-200">
                {presentPercent}% Present
              </div>
            </div>
          </div>
          <div className="space-y-6 overflow-x-auto pb-2">
            {months.map((month, i) => (
              <div key={i}>
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{month.name}</h3>
                {renderMonthGrid(month.data)}
              </div>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 dark:bg-green-600"></div> Present</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 dark:bg-red-600"></div> Absent</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 dark:bg-blue-600"></div> Holiday</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;