import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';

function Footer() {
  const { mode } = useSelector((state) => state.theme);
  const logoUrl = import.meta.env.VITE_LOGO_URL || null;

  // Fetch environment variables
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || "Little Stars Preschool";
  const email = import.meta.env.VITE_CONTACT_EMAIL || "info@littlestarspreschool.com";
  const phone = import.meta.env.VITE_CONTACT_PHONE || "(123) 456-7890";
  const address = import.meta.env.VITE_CONTACT_ADDRESS || "123 Star Lane, Happy Town, USA";
  const googleMapsLink = import.meta.env.VITE_GOOGLE_MAPS_LINK || "https://maps.google.com";
  const googleRating = import.meta.env.VITE_GOOGLE_RATING || "4.8";
  const licenseInfo = import.meta.env.VITE_LICENSE_INFO || "Licensed by Happy Town Education Board, License #12345";

  // Generate star rating SVGs
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="h-5 w-5 text-secondary-light dark:text-secondary-dark" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="h-5 w-5 text-secondary-light dark:text-secondary-dark" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-.588 0V2.927z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="h-5 w-5 text-neutral-light dark:text-neutral-dark" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <footer className="bg-surface-light dark:bg-surface-dark text-text-primaryLight dark:text-text-primaryDark border-t border-neutral-light dark:border-neutral-dark">
      {/* Top decorative bar */}
      <div className="h-2 bg-gradient-to-r from-pink-light via-blue-light to-green-light dark:from-pink-dark dark:via-blue-dark dark:to-green-dark"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* School Info and Logo */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-light via-secondary-light to-green-light dark:from-red-dark dark:via-secondary-dark dark:to-green-dark bg-clip-text text-transparent">
              {schoolName}
            </h2>
            <p className="mt-2 text-sm text-text-mutedLight dark:text-text-mutedDark">
              Where Learning is Fun!
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-secondary-light to-accent-light dark:from-secondary-dark dark:to-accent-dark rounded-full flex items-center justify-center shadow-md">
              <img
                  src={logoUrl}
                  alt={schoolName}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-yellow-400 group-hover:ring-4 transition-all duration-300"
                />
              </div>
              <p className="text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                Inspiring young minds 
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/contact", label: "Contact Us" },
                { to: "/contact", label: "Enquire Admission" },
                { to: "/login", label: "Login" },
                { to: "/gallery", label: "Photo Gallery" },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm transition-all duration-300 hover:text-primary-light hover:dark:text-primary-dark ${
                        isActive ? `text-primary-light dark:text-primary-dark font-medium` : `text-text-secondaryLight dark:text-text-secondaryDark`
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info and Rating */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-text-primaryLight dark:text-text-primaryDark">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-primary-light hover:dark:text-primary-dark">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone}`} className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-primary-light hover:dark:text-primary-dark">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondaryLight dark:text-text-secondaryDark hover:text-primary-light hover:dark:text-primary-dark"
                >
                  {address}
                </a>
              </li>
              <li className="flex items-center gap-2 mt-2">
                <div className="flex">{renderStars(parseFloat(googleRating))}</div>
                <span className="text-text-secondaryLight dark:text-text-secondaryDark">
                  {googleRating} / 5.0
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Licensing Info */}
        <div className="mt-8 pt-6 border-t border-neutral-light dark:border-neutral-dark text-center">
          <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">
            {licenseInfo}
          </p>
          <p className="mt-2 text-xs text-text-mutedLight dark:text-text-mutedDark">
            &copy; {new Date().getFullYear()} {schoolName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div className="h-2 bg-gradient-to-r from-secondary-light via-pink-light to-blue-light dark:from-secondary-dark dark:via-pink-dark dark:to-blue-dark"></div>
    </footer>
  );
}

export default Footer;