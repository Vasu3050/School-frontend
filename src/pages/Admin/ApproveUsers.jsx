import React, { useContext, useEffect } from 'react';
import { PendingCountContext } from '../../layouts/adminLayout.jsx';

function ApproveUsers() {
  const { pendingCount, refreshPendingCount } = useContext(PendingCountContext);

  // Refresh pending count when component mounts
  useEffect(() => {
    refreshPendingCount();
  }, []);

  // Function to handle user approval/rejection - call this after any action
  const handleUserAction = async () => {
    // After approving/rejecting a user, refresh the count
    await refreshPendingCount();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primaryLight dark:text-text-primaryDark">
          Approve Users
        </h1>
        <div className="bg-yellow-100 dark:bg-yellow-800/30 px-4 py-2 rounded-lg">
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">
            {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {/* Your approval interface will go here */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-neutral-light dark:border-neutral-dark p-6">
        <p className="text-text-secondaryLight dark:text-text-secondaryDark">
          Approval interface will be implemented here...
        </p>
        
        {/* Example button to test the refresh functionality */}
        <button 
          onClick={handleUserAction}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test Refresh Count
        </button>
      </div>
    </div>
  );
}

export default ApproveUsers;