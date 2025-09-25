// AddStudent.jsx (Enhanced with multiple students support)
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { addStudent } from "../api/StudentApi.js";

const AddStudent = ({ openModal }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      students: [{ name: "", dob: "", grade: "", division: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    try {
      // Process each student sequentially
      for (let i = 0; i < data.students.length; i++) {
        try {
          await addStudent(data.students[i]);
          successCount++;
        } catch (error) {
          failureCount++;
          errors.push(`Student ${i + 1}: ${error.message}`);
        }
      }

      // Show result modal
      if (failureCount === 0) {
        openModal({
          type: "success",
          title: "Success",
          message: `All ${successCount} student(s) added successfully!`,
        });
        reset({
          students: [{ name: "", dob: "", grade: "", division: "" }]
        });
      } else if (successCount === 0) {
        openModal({
          type: "error",
          title: "Error",
          message: `Failed to add all students:\n${errors.join('\n')}`,
        });
      } else {
        openModal({
          type: "warning",
          title: "Partial Success",
          message: `${successCount} student(s) added successfully, ${failureCount} failed:\n${errors.join('\n')}`,
        });
      }
    } catch (error) {
      openModal({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred while adding students.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addStudentField = () => {
    append({ name: "", dob: "", grade: "", division: "" });
  };

  const removeStudentField = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const clearAllFields = () => {
    reset({
      students: [{ name: "", dob: "", grade: "", division: "" }]
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white-dark mb-4">
          Add New Student{fields.length > 1 ? 's' : ''}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {fields.length} student{fields.length > 1 ? 's' : ''} to add
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white-dark">
                Student {index + 1}
              </h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStudentField(index)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  title="Remove this student"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
                  Student Name *
                </label>
                <input
                  {...register(`students.${index}.name`, { 
                    required: "Name is required", 
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                    maxLength: { value: 100, message: "Name must be less than 100 characters" }
                  })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white-dark focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  placeholder="Enter student's full name"
                />
                {errors.students?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.students[index].name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  {...register(`students.${index}.dob`, { 
                    required: "Date of birth is required",
                    validate: value => new Date(value) <= new Date() || "Date of birth cannot be in the future"
                  })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white-dark focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                {errors.students?.[index]?.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.students[index].dob.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
                  Grade *
                </label>
                <select
                  {...register(`students.${index}.grade`, { required: "Grade is required" })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white-dark focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Grade</option>
                  {["playgroup", "nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                {errors.students?.[index]?.grade && (
                  <p className="text-red-500 text-xs mt-1">{errors.students[index].grade.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">
                  Division *
                </label>
                <select
                  {...register(`students.${index}.division`, { required: "Division is required" })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white-dark focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Division</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                {errors.students?.[index]?.division && (
                  <p className="text-red-500 text-xs mt-1">{errors.students[index].division.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Student Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addStudentField}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white-dark rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Another Student
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-500 text-white-dark rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white-dark"></div>
                Adding Student{fields.length > 1 ? 's' : ''}...
              </div>
            ) : (
              `Add ${fields.length} Student${fields.length > 1 ? 's' : ''}`
            )}
          </button>
          <button
            type="button"
            onClick={clearAllFields}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-500 text-white-dark rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          <p>💡 You can add multiple students at once. Each student will be processed individually.</p>
          {fields.length > 1 && (
            <p className="mt-1">📋 {fields.length} students will be added to the system.</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddStudent;