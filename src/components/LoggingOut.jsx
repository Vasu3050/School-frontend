import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as userLogout } from "../store/userSlice";
import { logoutUser } from "../api/authApi";

export default function LoggingOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logoutUser(); // clear backend session
      } catch (err) {
        console.error("Logout error:", err);
      }
      dispatch(userLogout()); // clear Redux state
    };

    doLogout();

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-900 dark:to-blue-950 p-4">
      <div className="relative w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/30 p-8 text-center">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-200 dark:bg-red-900 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200 dark:bg-blue-900 rounded-full blur-xl animate-pulse"></div>

        {/* Logout Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mb-6 shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-4">
          Logging you out…
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
          Please wait, you will be redirected to login page shortly.
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center gap-2">
          <div
            className="w-3 h-3 bg-red-500 dark:bg-rose-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-3 h-3 bg-red-500 dark:bg-rose-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-red-500 dark:bg-rose-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
