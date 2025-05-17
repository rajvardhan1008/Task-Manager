import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeImage from '../assests/home_page_image.webp'
import FirstNavbar from './FirstNavbar';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password, role });

    // Add your authentication and role-check logic here
  };

  return (
    <div className='w-full h-screen overflow-hidden bg-sky-100'>
      <div>
        <FirstNavbar></FirstNavbar>
      </div>

      <div className='flex justify-between w-full pt-28 items-center bg-sky-100 px-28'>
        <div className='flex flex-col gap-6 max-w-[45%]'>
          <h1 className='text-5xl font-bold' >Make a Schedule for your <span className='text-blue-900 text-5xl font-bold'>Important Tasks</span> </h1>
          <p className='text-lg text-gray-700'>Organize, prioritize, and track your tasks with our intuitive task management system.</p>
          <div className='flex gap-4'>
            <button className='bg-blue-800 font-semibold text-white px-4 py-2 rounded-md text-lg cursor-pointer' onClick={() => navigate('/login')}>Get Starterd</button>
            <button className='text-lg cursor-pointer' onClick={() => navigate('register')}>Signup</button>
          </div>
        </div>
        <div>
          <img src={homeImage} alt="" width={500} className='rounded-lg' />
        </div>
      </div>

    </div>
  );
}

export default Home;
