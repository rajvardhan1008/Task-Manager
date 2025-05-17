import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import TaskDetailsPage from './components/TaskDetailsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register></Register>} ></Route>
      <Route path='/login' element={<Login></Login>} ></Route>
      <Route path='/user/dashboard' element={<UserDashboard></UserDashboard>} ></Route>
      <Route path="/tasks/:taskId" element={<TaskDetailsPage/>} />
      <Route path="/admin/dashboard" element={<AdminDashboard></AdminDashboard>} />
    </Routes>
  );
}

export default App;
