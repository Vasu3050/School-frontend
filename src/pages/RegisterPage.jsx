import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registered:", data);
      navigate("/login"); 
    },
  });

  const onSubmit = (formData) => {
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-6 text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-neutral-dark bg-surfaceAlt-light dark:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
            {errors.name && (
              <p className="text-danger-light dark:text-danger-dark text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-neutral-dark bg-surfaceAlt-light dark:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
            {errors.email && (
              <p className="text-danger-light dark:text-danger-dark text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-neutral-dark bg-surfaceAlt-light dark:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
            {errors.password && (
              <p className="text-danger-light dark:text-danger-dark text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-neutral-dark bg-surfaceAlt-light dark:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              <option value="">Select Role</option>              
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>              
            </select>
            {errors.role && (
              <p className="text-danger-light dark:text-danger-dark text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phone", { required: "Phone number is required" })}
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 rounded-lg border border-neutral-light dark:border-neutral-dark bg-surfaceAlt-light dark:bg-surfaceAlt-dark text-text-primaryLight dark:text-text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
            {errors.phone && (
              <p className="text-danger-light dark:text-danger-dark text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full py-2 rounded-lg bg-primary-light dark:bg-primary-dark text-white-light dark:text-white-dark font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {mutation.isLoading ? "Registering..." : "Register"}
          </button>

          {/* Error Message */}
          {mutation.isError && (
            <p className="text-danger-light dark:text-danger-dark text-sm text-center mt-2">
              {mutation.error.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
