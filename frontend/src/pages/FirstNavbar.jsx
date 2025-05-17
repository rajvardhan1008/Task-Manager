import React from 'react'
import { useNavigate } from 'react-router-dom';

function FirstNavbar() {
  const navigate = useNavigate();

  return (
    <div className='bg-[#faf9f9] flex justify-between px-28 py-3'>
        <p className='text-xl font-bold text-blue-800'>Task Manager</p>
        <div className='flex justify-center items-center gap-4 text-md'>
          <button className='cursor-pointer' onClick={() => navigate('/login')} >Login</button>
          <button onClick={() => navigate('/register')} className='font-semibold bg-blue-800 px-2 py-1 text-white rounded-md cursor-pointer' >Sign Up</button>
        </div>
      </div>
  )
}

export default FirstNavbar;