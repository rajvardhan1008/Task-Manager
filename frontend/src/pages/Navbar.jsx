import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdOutlineLogout } from "react-icons/md";
import { logoutUser } from '../services/api';

function Navbar({ fullName }) {
  const navigate = useNavigate();
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

 async function handleLogout() {
    try {
      const response = await logoutUser();
      if (response.status === 200) {
        toast.success("Logged out successfully!");
        navigate('/login');
      } else {
        toast.error("Logout failed!");
      }
    } catch (err) {
      toast.error("An error occurred during logout.");
    }
  }

  return (
    <div className='bg-[#faf9f9] flex justify-between px-28 py-3'>
      <p className='text-xl font-bold text-blue-800'>Task Manager</p>
      <div className='flex justify-center items-center gap-4 text-md'>
        <img
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`}
          alt="avatar"
          className='w-8 h-8 rounded-full'
        />
        <button
          className='cursor-pointer text-black text-xl font-medium'
          onClick={handleLogout}
        >
          <MdOutlineLogout />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
