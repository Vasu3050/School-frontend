import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      sid: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const role = watch("role");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registered:", data);
      navigate("/redirecting"); // Changed from /login to /redirecting
    },
  });

  const onSubmit = (formData) => {
    // If role is not parent, remove sid from formData
    if (formData.role !== "parent") {
      delete formData.sid;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-8">
      <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl p-8 relative">
        <h2 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-6 text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" },
            }}
            render={({ field }) => (
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={field.value}
                onChange={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
            }}
            render={({ field }) => (
              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
              />
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone number is required",
              validate: (value) => {
                const phone = value.replace(/\D/g, "").slice(-10);
                return /^\d{10}$/.test(phone) || "Enter a valid 10-digit phone number";
              },
            }}
            render={({ field }) => (
              <InputField
                label="Phone Number"
                placeholder="Enter 10-digit phone number"
                value={field.value}
                onChange={field.onChange}
                error={errors.phone?.message}
              />
            )}
          />

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primaryLight dark:text-text-primaryDark">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  value="parent"
                  {...control.register("role", { required: "Please select a role" })}
                  className="sr-only peer"
                />
                <div
                  className="p-3 rounded-xl border-2 transition-all duration-300 text-center border-neutral-light bg-surface-light text-text-primaryLight hover:border-primary-light hover:shadow-md dark:border-neutral-dark dark:bg-surfaceAlt-dark dark:text-text-primaryDark dark:hover:border-primary-dark peer-checked:bg-gradient-to-r peer-checked:from-green-light peer-checked:to-green-dark peer-checked:text-white-light peer-checked:border-transparent peer-checked:shadow-lg peer-checked:scale-105 dark:peer-checked:from-green-dark dark:peer-checked:to-green-light dark:peer-checked:text-white-dark"
                >
                  <div className="text-xl mb-1">👨‍👩‍👧‍👦</div>
                  <div className="text-sm font-medium">Parent</div>
                </div>
              </label>
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  value="teacher"
                  {...control.register("role", { required: "Please select a role" })}
                  className="sr-only peer"
                />
                <div
                  className="p-3 rounded-xl border-2 transition-all duration-300 text-center border-neutral-light bg-surface-light text-text-primaryLight hover:border-primary-light hover:shadow-md dark:border-neutral-dark dark:bg-surfaceAlt-dark dark:text-text-primaryDark dark:hover:border-primary-dark peer-checked:bg-gradient-to-r peer-checked:from-blue-light peer-checked:to-blue-dark peer-checked:text-white-light peer-checked:border-transparent peer-checked:shadow-lg peer-checked:scale-105 dark:peer-checked:from-blue-dark dark:peer-checked:to-blue-light dark:peer-checked:text-white-dark"
                >
                  <div className="text-xl mb-1">👩‍🏫</div>
                  <div className="text-sm font-medium">Teacher</div>
                </div>
              </label>
            </div>
            {errors.role && (
              <p className="text-sm text-danger-light dark:text-danger-dark flex items-center gap-1 mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Student ID (Conditional for Parent Role) */}
          {role === "parent" && (
            <Controller
              name="sid"
              control={control}
              rules={{
                required: "Student ID is required for parent registration",
                pattern: {
                  value: /^sid\d{1,5}$/,
                  message: "Student ID must be in the format 'sid' followed by 1-5 digits (e.g., sid1, sid009, sid00006)",
                },
              }}
              render={({ field }) => (
                <InputField
                  label="Student ID"
                  placeholder="Enter student ID (e.g., sid1, sid009)"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.sid?.message}
                />
              )}
            />
          )}

          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            }}
            render={({ field }) => (
              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={field.value}
                onChange={field.onChange}
                error={errors.password?.message}
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm Password is required",
              validate: (value) => value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={field.value}
                onChange={field.onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Submit Button */}
          <SubmitButton
            type="submit"
            disabled={mutation.isLoading}
            className="w-full bg-gradient-to-r from-primary-light to-blue-light dark:from-primary-dark dark:to-blue-dark text-white-light dark:text-white-dark font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {mutation.isLoading ? "Registering..." : "Register"}
          </SubmitButton>

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