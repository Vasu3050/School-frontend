// Header.jsx
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const schoolName = import.meta.env.VITE_SCHOOL_NAME || "Little Stars Preschool";
  const logoUrl = import.meta.env.VITE_LOGO_URL || null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
      isActive
        ? "bg-white/30 text-white shadow-lg backdrop-blur-sm border border-white/20"
        : "text-white hover:bg-white/10"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20">
      {/* Top decorative bar */}
      <div className="h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 flex-wrap">
          {/* Logo and School Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={schoolName}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-4 transition-all duration-300"
                />
              ) : (
                <div className="h-10 w-10 sm:h-5 sm:w-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center ring-2 ring-yellow-400 group-hover:ring-4 transition-all duration-300 shadow-md">
                  {/* Star Icon SVG */}
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                </div>
              )}
              {/* Heart decoration */}
              <svg
                className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-pink-500 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 via-yellow-400 to-green-700 bg-clip-text text-transparent">
                {schoolName}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden md:block">
                Where Learning is Fun!
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 shadow-lg">
              <div className="bg-white rounded-full p-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full px-2 py-1 flex items-center gap-2">
                  <NavLink to="/" className={navLinkClass}>
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Home
                    </span>
                  </NavLink>
                  <NavLink to="/gallery" className={navLinkClass}>
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Photo gallery
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>

          {/* Right side - Login/Register button and Mobile menu */}
          <div className="flex items-center justify-between gap-2 flex-shrink-0 ">
            <Link
              to="/login"
              className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 shadow-inner border-2 border-blue-100">
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </span>
            </NavLink>
            <NavLink
              to="/gallery"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Gallery
              </span>
            </NavLink>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-blue-200">
              <p className="text-center text-sm text-gray-500 font-medium">
                🌈 More options coming soon! 🎨
              </p>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 transform translate-y-full"></div>
    </header>
  );
}

export default Header;
