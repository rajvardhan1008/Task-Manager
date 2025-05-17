import React from 'react';

const UserListModal = ({ isOpen, onClose, users, onDelete, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay (no blur) */}
      <div 
        className="fixed inset-0 bg-opacity-30"
        onClick={onClose}
      />
      
      {/* Modal content - stays sharp */}
      <div className="relative z-50 bg-sky-100 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Select User to Delete</h2>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map(user => (
              <div key={user._id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => onDelete(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No users found</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserListModal;