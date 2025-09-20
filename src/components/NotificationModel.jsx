// NotificationModal.jsx
import React from "react";

const NotificationModal = ({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  onConfirm,
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  secondaryConfirmText,
  secondaryOnConfirm,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose && type !== "confirm") {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose, type]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white-primary/70 dark:bg-gray-900/70",
          border: "border-green-200 dark:border-green-800",
          iconBg: "bg-green-100 dark:bg-green-900/50",
          icon: "text-green-600 dark:text-green-400",
          iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          button: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
        };
      case "error":
        return {
          bg: "bg-white-primary/70 dark:bg-gray-900/70",
          border: "border-red-200 dark:border-red-800",
          iconBg: "bg-red-100 dark:bg-red-900/50",
          icon: "text-red-600 dark:text-red-400",
          iconPath:
            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
          button: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
        };
      case "warning":
      case "confirm":
        return {
          bg: "bg-white-primary/70 dark:bg-gray-900/70",
          border: "border-yellow-200 dark:border-yellow-800",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
          icon: "text-yellow-600 dark:text-yellow-400",
          iconPath:
            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
          button: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
          secondaryButton: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
        };
      default:
        return {
          bg: "bg-white-primary/70 dark:bg-gray-900/70",
          border: "border-blue-200 dark:border-blue-800",
          iconBg: "bg-blue-100 dark:bg-blue-900/50",
          icon: "text-blue-600 dark:text-blue-400",
          iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          button: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with iPhone-like blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={type !== "confirm" ? onClose : undefined}
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      />

      {/* Modal with glass morphism effect */}
      <div
        className={`relative max-w-sm w-full mx-4 rounded-2xl ${styles.bg} ${styles.border} border shadow-2xl transform transition-all duration-500 scale-100 animate-in fade-in slide-in-from-bottom-4`}
        style={{
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="p-6">
          {/* Icon and content */}
          <div className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
              <svg className={`w-8 h-8 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{message}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            {type === "confirm" ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-700/80 rounded-xl hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-200 backdrop-blur-sm"
                >
                  {cancelText}
                </button>
                {secondaryConfirmText && (
                  <button
                    onClick={async () => {
                      await secondaryOnConfirm();
                      onClose();
                    }}
                    className={`px-6 py-3 text-sm font-medium text-white-primary rounded-xl transition-all duration-200 ${styles.secondaryButton} focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg`}
                  >
                    {secondaryConfirmText}
                  </button>
                )}
                <button
                  onClick={async () => {
                    await onConfirm();
                    onClose();
                  }}
                  className={`px-6 py-3 text-sm font-medium text-white-primary rounded-xl transition-all duration-200 ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg`}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`px-8 py-3 text-sm font-medium text-white-primary rounded-xl transition-all duration-200 ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg`}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;