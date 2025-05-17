import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const loginUser = (email, password) => {
  return API.post('/auth/login', { email, password });
};

export const registerUser = ({ fullName, email, password, role }) => {
  return API.post('/auth/signup', { fullName, email, password, role });
};

export async function fetchAllTasks(userId, role) {
  try {
    const response = await API.get(`/task/all/${userId}`);
    return response.data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(taskData) {
  try {
    const response = await API.post('/task/create', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    const response = await API.post('/auth/logout', {});
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
}

// In api.js, update fetchTaskDetails:
export const fetchTaskDetails = async (taskId, userId, role) => {
  try {
    const response = await API.get(`/task/${taskId}`, {
      params: { userId, role } // Send as query params
      // or:
      // headers: { 'x-user-id': userId, 'x-user-role': role } // Send as headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, newStatus, userId, role) => {
  try {
    const response = await API.patch(`/task/update-status/${taskId}`, { 
      status: newStatus,
      userId, role
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export const deleteTask = async (taskId, userId) => {
  try {
    return await API.delete(`/task/delete/${taskId}`, { 
      data: { userId } // Send userId in request body for DELETE
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const getAllUsers = async (role) => {
  try {
    const response = await API.get('/user/getallusers', {
      params: { role } // Send role as query parameter
    });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const assignTaskToUser = async (taskId, userId, role) => {
  try {
    const response = await API.post(`/user/assigntask/${userId}`, { taskId, role });
    return response.data;
  } catch (error) {
    console.error('Error assigning task:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (userId, adminId, role) => {
  try {
    const response = await API.delete(`/user/deleteuser/${userId}`, {
      data: { role }, // Send role in request body for DELETE
      headers: {
        'x-admin-id': adminId, // Include admin ID in headers if needed
        'x-admin-role': role   // Include admin role in headers if needed
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};