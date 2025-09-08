import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirecting() {
  const navigate = useNavigate();

  // Redirect to /login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black-light dark:via-background-dark dark:to-blue-dark p-4">
      <div className="relative w-full max-w-md bg-white-light/80 dark:bg-surface-dark/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white-light/50 dark:border-surfaceAlt-dark/30 p-8 text-center">
        {/* Decorative Circle */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-accent-light/20 dark:bg-accent-dark/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-light/20 dark:bg-blue-dark/20 rounded-full blur-xl animate-pulse"></div>

        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-light to-accent-light dark:from-green-dark dark:to-accent-dark rounded-full mb-6 shadow-lg">
          <svg
            className="w-8 h-8 text-white-light dark:text-white-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-light via-blue-light to-accent-light dark:from-primary-dark dark:via-blue-dark dark:to-accent-dark bg-clip-text text-transparent mb-4">
          Successfully Registered!
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-lg mb-6">
          Your account has been created. Redirecting to login page...
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-primary-light dark:bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-primary-light dark:bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-primary-light dark:bg-primary-dark rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}