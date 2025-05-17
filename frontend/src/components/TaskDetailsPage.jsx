import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  fetchTaskDetails, 
  updateTaskStatus, 
  deleteTask,
  getAllUsers,
  assignTaskToUser
} from '../services/api';

function TaskDetailsPage() {
  const { taskId } = useParams();
  const location = useLocation();
  const { userId, role } = location.state || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setIsLoading(true);
        const taskData = await fetchTaskDetails(taskId, userId, role);
        console.log("task", taskData);
        setTask(taskData.task);
      } catch (err) {
        setError('Failed to fetch task details');
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId, userId, role]);

  useEffect(() => {
    const loadUsers = async () => {
      if (showAssignModal && users.length === 0) {
        try {
          const userList = await getAllUsers(role);
          console.log("all users response", userList);
          setUsers(userList.filter((user) => user.role != 'admin'));
        } catch (error) {
          console.error('Failed to load users:', error);
        }
      }
    };
    loadUsers();
  }, [showAssignModal]);

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-400';
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-400';
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-700';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleComplete = async () => {
    try {
      setActionLoading(true);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTaskStatus(taskId, newStatus, userId, role);
      setTask({ ...task, status: newStatus });
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteTask(taskId, userId);
      navigate('/');
    } catch (err) {
      console.error('Error deleting task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTask = async () => {
  if (!selectedUser) return;
  
  try {
    setAssignLoading(true);
    const response = await assignTaskToUser(taskId, selectedUser._id, role);
    
    // Update the local task state with the newly assigned task
    setTask(response.task);
    setShowAssignModal(false);
    setSelectedUser(null);
    
    // Show success message
    setError(null);
  } catch (error) {
    console.error('Assignment failed:', error);
    setError(error.response?.data?.message || 'Failed to assign task');
  } finally {
    setAssignLoading(false);
  }
};

  const canModifyTask = () => {
    if (!task || !userId) return false;
    return (
      role === 'admin' ||
      task.createdBy._id === userId ||
      (task.assignedTo && task.assignedTo._id === userId)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'Task not found'}</p>
      </div>
    );
  }

  const AssignUserModal = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-sky-100 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Task to User</h2>
        
        <div className="max-h-96 overflow-y-auto mb-4">
          {users.map(user => (
            <div 
              key={user._id} 
              className={`flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === user._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {selectedUser?._id === user._id && (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowAssignModal(false);
              setSelectedUser(null);
            }}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignTask}
            disabled={!selectedUser || assignLoading}
            className={`px-4 py-2 rounded-md text-white ${
              !selectedUser ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {assignLoading ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to tasks
      </button>

      <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{task.title || 'Untitled Task'}</h1>
          <div className="flex gap-2">
            <span className={`text-white text-sm px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
              {formatText(task.priority || 'unknown')}
            </span>
            <span className={`text-white text-sm px-2 py-1 rounded-md ${getStatusColor(task.status)}`}>
              {formatText(task.status || 'unknown')}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {task.description || 'No description provided'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-medium text-gray-600">Due Date</h3>
            <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Created At</h3>
            <p>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}</p>
          </div>
          {task.assignedTo && (
            <div>
              <h3 className="font-medium text-gray-600">Assigned To</h3>
              <p>{task.assignedTo.fullName}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-600">Created By</h3>
            <p>{task.createdBy.fullName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-end mt-6">
          {role === 'admin' && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center min-w-[160px] cursor-pointer"
              onClick={() => setShowAssignModal(true)}
              disabled={actionLoading}
            >
              Assign To
            </button>
          )}
          
          {canModifyTask() && (
            <button
              className={`${
                task.status === 'completed' 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center min-w-[160px] cursor-pointer`}
              onClick={handleComplete}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <span className="animate-spin">↻</span>
              ) : (
                task.status === "completed" ? "Mark Incomplete" : "Mark Complete"
              )}
            </button>
          )}
          
          {canModifyTask() && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors min-w-[120px] flex items-center justify-center cursor-pointer"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? <span className="animate-spin">↻</span> : "Delete Task"}
            </button>
          )}
        </div>
      </div>

      {showAssignModal && <AssignUserModal />}
    </div>
  );
}

export default TaskDetailsPage;