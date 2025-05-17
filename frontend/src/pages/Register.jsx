import React, { useState } from 'react'
import FirstNavbar from './FirstNavbar'
import axios from 'axios';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../services/api';

function Register() {

    const navigate = useNavigate();

    async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassowrd) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await registerUser({ fullName, email, password, role: selectedRole });

      if (response.status === 201 || response.status === 200) {
        toast.success("Registered successfully!");
        navigate('/login');
      } else {
        toast.error("Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during registration.");
    }
  }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassowrd, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassowrd, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectRole] = useState('user');

  return (
    <div className='w-full h-screen'>
        <FirstNavbar></FirstNavbar>
        <div className='flex flex-col justify-center items-center h-screen bg-white' >
            <div className='flex justify-center items-center flex-col border-gray-300 border-[1px]  py-8 gap-2 px-8 rounded-lg w-[30%]'>
                <h1 className='text-2xl font-bold'>Create An Account</h1>
                <p className='text-gray-600 text-sm'>Enter your credentials to access your account</p>
                <form
                    onSubmit={handleRegister}
                    className="bg-white rounded-lg shadow-lg w-full max-w-sm mt-4"
                    >

                    <div className="mb-4 w-full">
                        <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input
                        type="text"
                        id="fullName"
                        placeholder='Rajvardhan Dangi'
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                        type="email"
                        id="email"
                        placeholder='example@email.com'
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='password@9883'
                        id="password"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        <div className='absolute top-[60%] left-[90%] cursor-pointer text-xl' onClick={() => {
                            setShowPassword((prev ) => !prev)
                        }}>
                            {
                                showPassword ? (<GoEye></GoEye>) : (<GoEyeClosed></GoEyeClosed>)
                            }
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <input
                        type={showConfirmPassowrd ? 'text' : 'password'}
                        placeholder='password@9883'
                        id="confirmPassword"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmPassowrd}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        />
                        <div className='absolute top-[60%] left-[90%] cursor-pointer text-xl' onClick={() => {
                            setShowConfirmPassword((prev ) => !prev)
                        }}>
                            {
                                showConfirmPassowrd ? (<GoEye></GoEye>) : (<GoEyeClosed></GoEyeClosed>)
                            }
                        </div>
                    </div>

                    <div className='mb-6 flex justify-start gap-8 items-center'>
                        <label htmlFor="role" className="block text-gray-700 font-medium mb-1">Select Role</label>
                        <select
                            id="role"
                            value={selectedRole}
                            onChange={(e) => setSelectRole(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-[71%]"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-800 cursor-pointer text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Register
                    </button>

                    <button
                        className="w-full cursor-pointer text-gray-700 font-semibold py-4 rounded-md text-sm"
                        onClick={() => Navigate('/login')}
                    >
                        Already have an Account ? <span className='text-blue-800 hover:text-blue-700 text-md'>Login</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Register