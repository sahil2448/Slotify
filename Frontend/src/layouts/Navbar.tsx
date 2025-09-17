import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const router = useNavigate();
  return (
    <div className='flex items-center justify-between px-20 py-3 bg-slate-100 border-b-1 border-gray-300'>
        <h1 className='text-3xl font-bold  text-indigo-600 cursor-pointer' onClick={()=>router("/")}>Slotify</h1>
        <div className='flex justify-center gap-10 font-medium'>        
            <a className='cursor-pointer hover:text-indigo-600 transition-all duration-300' onClick={()=>router("/")}>Home</a>
            <a className='cursor-pointer hover:text-indigo-600 transition-all duration-300' onClick={()=>router("/schedule")}>Schedule</a>
        </div>
    </div>
  )
}

export default Navbar