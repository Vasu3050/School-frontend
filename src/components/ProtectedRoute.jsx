import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, requiredStatus = null }) => {
  const { isAuthenticated, roles, role, status } = useSelector((state) => state.user);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(allowedRole => roles?.includes(allowedRole));
    const isCurrentRole = allowedRoles.includes(role);
    
    if (!hasRole || !isCurrentRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // TEMPORARILY DISABLED: Skip status check for now
  // This allows all registered users to access their dashboards
  // Later you can uncomment this when you want to enforce approval workflow
  /*
  if (requiredStatus && status !== requiredStatus) {
    if (status === 'pending') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-800/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Pending Approval</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your account is currently pending approval from the administrator. You will be notified once your account is approved.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Status: <span className="font-medium text-yellow-600 dark:text-yellow-400 capitalize">{status}</span>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/unauthorized" replace />;
  }
  */

  return children;
};

export default ProtectedRoute;