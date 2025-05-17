import React, { useState } from 'react'
import FirstNavbar from './FirstNavbar'
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';

function Login() {

async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await loginUser(email, password);
      if (res.status === 200) {
        toast.success("Login successful!");
        console.log("user details", res.data.user);
        if(res.data.user.role === 'user'){
            navigate('/user/dashboard', { state: { user: res.data.user } });
        }
        else{
            navigate('/admin/dashboard', {state: {admin : res.data.user}});
        }
      }
    } catch (err) {
      toast.error("Invalid email or password. Try again.");
    }
  }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

  return (
    <div className='w-full h-screen'>
        <FirstNavbar></FirstNavbar>
        <div className='flex flex-col justify-center items-center h-screen bg-white' >
            <div className='flex justify-center items-center flex-col border-gray-300 border-[1px]  py-8 gap-2 px-8 rounded-lg w-[30%]'>
                <h1 className='text-2xl font-bold'>Login</h1>
                <p className='text-gray-600 text-sm'>Enter your credentials to access your account</p>
                <form
                    onSubmit={handleLogin}
                    className="bg-white rounded-lg shadow-lg w-full max-w-sm mt-4"
                    >
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

                    <button
                        type="submit"
                        className="w-full bg-blue-800 cursor-pointer text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    <button
                        className="w-full cursor-pointer text-gray-700 font-semibold py-4 rounded-md text-sm"
                        onClick={() => navigate('/register')}
                    >
                        Don't have an Account ? <span className='text-blue-800 hover:text-blue-700 text-md' >Register</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login