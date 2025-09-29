import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

const Navbar = () => {
  const router = useNavigate()
  const [open, setOpen] = useState(false)

  const go = (path: string) => {
    router(path)
    setOpen(false)
  }

  return (
    <nav className="bg-white border-b-2 border-gray-300 sticky top-0 z-1000">
      <div className="flex items-center justify-between px-2 sm:px-20 py-3">
        <h1
          className="text-2xl sm:text-3xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => go('/')}
        >
          Slotify
        </h1>

        <p className='font-bold text-slate-600 text-xl sm:text-xl'>Your Schedule</p>

        <div className="hidden sm:flex justify-center gap-10 font-medium">
          <button
            className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
            onClick={() => go('/')}
          >
            Home
          </button>
          <button
            className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
            onClick={() => go('/schedule')}
          >
            Schedule
          </button>
        </div>

        <button
          className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          aria-label="Toggle Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon fontSize="medium" /> : <MenuIcon fontSize="medium" />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden px-5 py-2 border-t border-gray-200 animate-slideDown">
          <div className="flex flex-col gap-3 font-medium">
            <button
              className="text-left py-2 hover:text-indigo-600 transition-all duration-300"
              onClick={() => go('/')}
            >
              Home
            </button>
            <button
              className="text-left py-2 hover:text-indigo-600 transition-all duration-300"
              onClick={() => go('/schedule')}
            >
              Schedule
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
