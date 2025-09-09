import React from 'react'
import { Link } from 'react-router-dom'

function LoginBtn({ to = "/login" }) {
  return (
    <Link
      to={to}
      className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full font-medium shadow-lg 
                 hover:shadow-xl transform hover:scale-105 transition-all duration-300 
                 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 
                      to-transparent -translate-x-full group-hover:translate-x-full 
                      transition-transform duration-1000"></div>
      <svg
        className="h-4 w-4 relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
      <span className="relative z-10">Login / Register</span>
    </Link>
  )
}

export default LoginBtn
