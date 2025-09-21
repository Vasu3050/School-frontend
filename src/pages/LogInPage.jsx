import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import { setUser } from "../store/userSlice.js";
import API from "../api/Axios";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
      role: "parent"
    }
  });

  // Normalize phone to 10 digits
  const formatLoginData = (formData) => {
    const { identifier, password, role } = formData;
    const phone = identifier.replace(/^\+91/, "").replace(/\D/g, "").slice(-10);
    return { phone, password, role };
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const apiData = formatLoginData(formData);
      const res = await API.patch("/users/login", apiData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data, formData) => {
      const { user, accessToken, refreshToken } = data.data;
      dispatch(
        setUser({
          name: user.name,
          phone: user.phone,
          email: user.email,
          roles: user.roles,
          role : formData.role,
          status: user.status,
          accessToken,
          refreshToken,
        })
      );

      // FIXED: Allow navigation regardless of status
      // Navigate based on role, not status
      if (user.roles.includes("admin") && formData.role === "admin") {
        navigate("/admin");
      } else if (user.roles.includes("teacher") && formData.role === "teacher") {
        navigate("/teacher");
      } else if (user.roles.includes("parent") && formData.role === "parent") {
        navigate("/parent");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Login failed";
      alert(errorMessage);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black-light dark:via-background-dark dark:to-blue-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-pink-light/20 dark:bg-pink-dark/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-light/20 dark:bg-blue-dark/20 rounded-full blur-xl"></div>

        {/* Login card */}
        <div className="relative bg-white-light/80 dark:bg-surface-dark/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white-light/50 dark:border-surfaceAlt-dark/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-light to-blue-light dark:from-primary-dark dark:to-blue-dark rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white-light dark:text-white-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-light via-blue-light to-accent-light dark:from-primary-dark dark:via-blue-dark dark:to-accent-dark bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-text-secondaryLight dark:text-text-secondaryDark">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-6">
            {/* Phone Input */}
            <Controller
              name="identifier"
              control={control}
              rules={{
                required: "Phone number is required",
                validate: (value) => {
                  const phone = value.replace(/^\+91/, "").replace(/\D/g, "").slice(-10);
                  return /^\d{10}$/.test(phone) || "Enter a valid 10-digit phone number";
                }
              }}
              render={({ field }) => (
                <InputField
                  label="Phone Number"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter 10-digit phone number"
                  error={errors.identifier?.message}
                />
              )}
            />

            {/* Password Input */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              }}
              render={({ field }) => (
                <InputField
                  label="Password"
                  type="password"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                />
              )}
            />

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-text-primaryLight dark:text-text-primaryDark">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="parent"
                        checked={field.value === "parent"}
                        onChange={field.onChange}
                        className="sr-only peer"
                      />
                      <div className="p-3 rounded-xl border-2 transition-all duration-300 text-center border-neutral-light bg-surface-light text-text-primaryLight hover:border-primary-light hover:shadow-md dark:border-neutral-dark dark:bg-surfaceAlt-dark dark:text-text-primaryDark dark:hover:border-primary-dark peer-checked:bg-gradient-to-r peer-checked:from-green-light peer-checked:to-green-dark peer-checked:text-white-light peer-checked:border-transparent peer-checked:shadow-lg peer-checked:scale-105 dark:peer-checked:from-green-dark dark:peer-checked:to-green-light dark:peer-checked:text-white-dark">
                        <div className="text-xl mb-1">👨‍👩‍👧‍👦</div>
                        <div className="text-xs font-medium">Parent</div>
                      </div>
                    </label>
                  )}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="teacher"
                        checked={field.value === "teacher"}
                        onChange={field.onChange}
                        className="sr-only peer"
                      />
                      <div className="p-3 rounded-xl border-2 transition-all duration-300 text-center border-neutral-light bg-surface-light text-text-primaryLight hover:border-primary-light hover:shadow-md dark:border-neutral-dark dark:bg-surfaceAlt-dark dark:text-text-primaryDark dark:hover:border-primary-dark peer-checked:bg-gradient-to-r peer-checked:from-blue-light peer-checked:to-blue-dark peer-checked:text-white-light peer-checked:border-transparent peer-checked:shadow-lg peer-checked:scale-105 dark:peer-checked:from-blue-dark dark:peer-checked:to-blue-light dark:peer-checked:text-white-dark">
                        <div className="text-xl mb-1">👩‍🏫</div>
                        <div className="text-xs font-medium">Teacher</div>
                      </div>
                    </label>
                  )}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        value="admin"
                        checked={field.value === "admin"}
                        onChange={field.onChange}
                        className="sr-only peer"
                      />
                      <div className="p-3 rounded-xl border-2 transition-all duration-300 text-center border-neutral-light bg-surface-light text-text-primaryLight hover:border-primary-light hover:shadow-md dark:border-neutral-dark dark:bg-surfaceAlt-dark dark:text-text-primaryDark dark:hover:border-primary-dark peer-checked:bg-gradient-to-r peer-checked:from-pink-light peer-checked:to-pink-dark peer-checked:text-white-light peer-checked:border-transparent peer-checked:shadow-lg peer-checked:scale-105 dark:peer-checked:from-pink-dark dark:peer-checked:to-pink-light dark:peer-checked:text-white-dark">
                        <div className="text-xl mb-1">👨‍💼</div>
                        <div className="text-xs font-medium">Admin</div>
                      </div>
                    </label>
                  )}
                />
              </div>
              {errors.role && (
                <p className="text-sm text-danger-light dark:text-danger-dark flex items-center gap-1 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <SubmitButton
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-primary-light to-blue-light dark:from-primary-dark dark:to-blue-dark text-white-light font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </SubmitButton>
          </form>

          {/* Register Section */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-light/30 dark:border-neutral-dark/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white-light/80 dark:bg-surface-dark/90 text-text-secondaryLight dark:text-text-secondaryDark">
                  Don't have an account?
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-gradient-to-r from-accent-light via-green-light to-secondary-light dark:from-accent-dark dark:via-green-dark dark:to-secondary-dark text-white-light font-bold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <span>Create New Account</span>
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
                  FREE
                </div>
              </div>
            </button>
            <p className="text-center text-xs text-text-mutedLight dark:text-text-mutedDark mt-2">
              🎓 Perfect for parents, teachers, and administrators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}