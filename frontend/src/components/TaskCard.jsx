import React from 'react';
import { useNavigate } from 'react-router-dom';

function TaskCard({ task, userId, role }) {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-700';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

const handleViewMore = () => {
  navigate(`/tasks/${task._id}`, { state: { userId, role } });
};

  return (
    <div className="border border-gray-300 min-w-[32%] rounded-lg p-4 shadow-md bg-white mb-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        
        <div className="flex gap-2">
          <span className={`text-white text-sm px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className={`text-white text-sm px-2 py-1 rounded-md ${getStatusColor(task.status)}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mt-2 line-clamp-2">{task.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>

      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
          onClick={handleViewMore}
        >
          View More
        </button>
      </div>
    </div>
  );
}

export default TaskCard;