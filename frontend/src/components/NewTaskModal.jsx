import React from 'react';
import { FaTimes } from 'react-icons/fa';

const NewTaskModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [taskData, setTaskData] = React.useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
    setTaskData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-sky-100 rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Task</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-900 mb-2" htmlFor="title">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-900 mb-2" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-900 mb-2" htmlFor="dueDate">
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-900 mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              disabled={isLoading}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;