import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import { fetchAllTasks, createTask, updateTaskStatus, deleteTask, deleteUser, getAllUsers } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import { FaPlus, FaUserTimes } from "react-icons/fa";
import NewTaskModal from '../components/NewTaskModal';
import { TiThSmall } from "react-icons/ti";
import { MdOutlineDoneOutline, MdPendingActions, MdAddAlert } from "react-icons/md";
import UserListModal from '../components/UserListModal';

function AdminDashboard() {
  const location = useLocation();
  const admin = location.state?.admin;

  const [allTasks, setAllTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState([]);
  const [mediumPriorityTasks, setMediumPriorityTasks] = useState([]);
  const [lowPriorityTasks, setLowPriorityTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  useEffect(() => {
    getAllTasks();
  }, []);

  async function getAllTasks() {
    try {
      setIsLoading(true);
      const tasks = await fetchAllTasks(admin._id, admin.role);
      setAllTasks(tasks);

      setCompletedTasks(tasks.filter(task => task.status === 'completed'));
      setPendingTasks(tasks.filter(task => task.status === 'pending'));
      setHighPriorityTasks(tasks.filter(task => task.priority === 'high'));
      setMediumPriorityTasks(tasks.filter(task => task.priority === 'medium'));
      setLowPriorityTasks(tasks.filter(task => task.priority === 'low'));
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      setIsLoading(true);
      await createTask({
        ...taskData,
        userId: admin._id,
        createdBy: admin._id
      });
      await getAllTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating task", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      setIsLoading(true);
      const task = allTasks.find(t => t._id === id);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      
      if (!admin?._id || !admin?.role) {
        throw new Error('User information missing');
      }

      await updateTaskStatus(id, admin._id, admin.role, newStatus);
      await getAllTasks();
    } catch (error) {
      console.error("Error updating task status:", error.response?.data || error.message);
      if (error.response?.status === 403) {
        alert('Session expired. Please login again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      console.log(`Deleting task ${id}`);
      const res = await deleteTask(id, admin._id, admin.role);
      console.log("delete response", res);
      await getAllTasks();
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUserClick = async () => {
    try {
      setIsLoading(true);
      const allUsers = await getAllUsers(admin.role);
      setUsers(allUsers.filter(user => user._id !== admin._id));
      setIsUserModalOpen(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      setIsDeletingUser(true);
      await deleteUser(userId, admin._id, admin.role);
      const allUsers = await getAllUsers(admin.role);
      setUsers(allUsers.filter(user => user._id !== admin._id));
      alert('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
      alert('Failed to delete user');
    } finally {
      setIsDeletingUser(false);
    }
  };

  const getFilteredTasks = () => {
    switch (selectedFilter) {
      case 'completed': return completedTasks;
      case 'pending': return pendingTasks;
      case 'high': return highPriorityTasks;
      case 'medium': return mediumPriorityTasks;
      case 'low': return lowPriorityTasks;
      default: return allTasks;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Dashboard content with conditional blur */}
      <div className={isUserModalOpen ? 'blur-sm' : ''}>
        <Navbar fullName={admin?.fullName || 'Admin'} />
        
        <div className='flex justify-between px-28 items-center mt-12'>
          <div className='flex gap-2 flex-col'>
            <h1 className='text-3xl font-bold'>Welcome, {admin.fullName.split(" ")[0]}</h1>
            <p className='text-gray-800'>Your task management admin dashboard</p>
          </div>
          <div className='flex gap-4'>
            <button 
              onClick={() => setIsModalOpen(true)}
              className='flex justify-center items-center gap-2 cursor-pointer bg-blue-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-900 transition-colors'
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Create New Task'} <FaPlus />
            </button>
            <button 
              onClick={handleDeleteUserClick}
              className='flex justify-center items-center gap-2 cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors'
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Delete User'} <FaUserTimes />
            </button>
          </div>
        </div>

        <NewTaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
          isLoading={isLoading}
        />

        {/* Summary Cards */}
        <div className='flex flex-col lg:flex-row gap-4 px-28 w-full mt-8'>
          <DashboardCard cardHeading={"Total Tasks"} cardNumber={allTasks.length} cardIcon={<TiThSmall />} />
          <DashboardCard cardHeading={"Completed Tasks"} cardNumber={completedTasks.length} cardIcon={<MdOutlineDoneOutline />} iconStyle={"text-green-700"} />
          <DashboardCard cardHeading={"Pending Tasks"} cardNumber={pendingTasks.length} cardIcon={<MdPendingActions />} iconStyle={"text-yellow-500"} />
          <DashboardCard cardHeading={"High Priority"} cardNumber={highPriorityTasks.length} cardIcon={<MdAddAlert />} iconStyle={"text-red-600"} />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-between px-28 mt-12 w-full">
          {['all', 'pending', 'completed', 'high', 'medium', 'low'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-12 py-2 rounded-md cursor-pointer ${
                selectedFilter === filter ? 'bg-blue-500 text-white font-semibold' : 'bg-zinc-200 text-gray-500'
              }`}
              disabled={isLoading}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks
            </button>
          ))}
        </div>

        {/* Task Cards */}
        <div className="px-28 mt-6 flex w-full gap-4 flex-wrap justify-start">
          {isLoading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : getFilteredTasks().length > 0 ? (
            getFilteredTasks().map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
                userId={admin._id}
                role={admin.role}
              /> 
            ))
          ) : (
            <p className="text-gray-600">No tasks found for this filter.</p>
          )}
        </div>
      </div>

      {/* User List Modal - Outside the blurred content */}
      <UserListModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={users}
        onDelete={handleUserDelete}
        isLoading={isDeletingUser}
      />
    </div>
  );
}

export default AdminDashboard;