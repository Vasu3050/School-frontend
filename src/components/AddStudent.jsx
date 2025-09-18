// AddStudent.jsx
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { addStudent } from "../api/StudentApi.js";

const AddStudent = ({ openModal }) => {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { students: [{}] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "students"
  });

  const onSubmit = async (data) => {
    const studentsData = data.students.map(s => ({
      ...s,
      name: s.name.trim().replace(/\b\w/g, c => c.toUpperCase()),
      division: s.division.toUpperCase(),
    }));
    try {
      for (const s of studentsData) {
        await addStudent(s);
      }
      reset({ students: [{}] });
      openModal({
        type: "success",
        title: "Success",
        message: "Student(s) added successfully!",
      });
    } catch (error) {
      openModal({
        type: "error",
        title: "Error",
        message: error.message || "Failed to add student(s)",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-4">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white-light">Student {index + 1}</h3>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm">Name</label>
            <input
              {...register(`students.${index}.name`, { required: "Required", minLength: { value: 3, message: "Min 3 chars" }, maxLength: { value: 100, message: "Max 100 chars" } })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-200 text-sm"
            />
            {errors.students?.[index]?.name && <p className="text-red-500 text-xs">{errors.students[index].name.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm">Date of Birth</label>
            <input
              type="date"
              {...register(`students.${index}.dob`, { required: "Required", validate: value => new Date(value) <= new Date() || "Cannot be future" })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-200 text-sm"
            />
            {errors.students?.[index]?.dob && <p className="text-red-500 text-xs">{errors.students[index].dob.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm">Grade</label>
            <select
              {...register(`students.${index}.grade`, { required: "Required" })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-200 text-sm"
            >
              <option value="">Select Grade</option>
              {["playgroup", "nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map(grade => <option key={grade} value={grade}>{grade}</option>)}
            </select>
            {errors.students?.[index]?.grade && <p className="text-red-500 text-xs">{errors.students[index].grade.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm">Division</label>
            <select
              {...register(`students.${index}.division`, { required: "Required" })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-200 text-sm"
            >
              <option value="">Select Division</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            {errors.students?.[index]?.division && <p className="text-red-500 text-xs">{errors.students[index].division.message}</p>}
          </div>
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Remove This Student
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => append({})}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 text-sm"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Student
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Add {fields.length > 1 ? "Students" : "Student"}
        </button>
      </div>
    </form>
  );
};

export default AddStudent;