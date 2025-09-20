// AddStudent.jsx (FIXED - in case it's missing)
import React from "react";
import { useForm } from "react-hook-form";
import { addStudent } from "../api/StudentApi.js";

const AddStudent = ({ openModal }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await addStudent(data);
      openModal({
        type: "success",
        title: "Success",
        message: "Student added successfully!",
      });
      reset();
    } catch (error) {
      console.error("Add student error:", error);
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to add student.",
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white-primary mb-4">Add New Student</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
            Student Name *
          </label>
          <input
            {...register("name", { 
              required: "Name is required", 
              minLength: { value: 3, message: "Name must be at least 3 characters" },
              maxLength: { value: 100, message: "Name must be less than 100 characters" }
            })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student's full name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            {...register("dob", { 
              required: "Date of birth is required",
              validate: value => new Date(value) <= new Date() || "Date of birth cannot be in the future"
            })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
            Grade *
          </label>
          <select
            {...register("grade", { required: "Grade is required" })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Grade</option>
            {["playgroup", "nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
            Division *
          </label>
          <select
            {...register("division", { required: "Division is required" })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Division</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division.message}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white-primary rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Add Student
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-500 text-white-primary rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;