import React, { useState } from "react";
import { FaHome, FaStar, FaBars, FaTimes } from "react-icons/fa"; // Added FaBars for menu icon
import { GiArtificialIntelligence } from "react-icons/gi"; // AI icon

const LeftBar = ({ userInitial, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Icon */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-200 rounded-full"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* LeftBar */}
      <div
        className={`lg:w-1/4 lg:static lg:translate-x-0 lg:transition-none fixed top-0 left-0 h-screen w-64 bg-white  transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out p-4 flex flex-col justify-between border-r-2 border-gray-300`}
      >
        <div>
          <div className="flex items-center space-x-2 text-2xl font-bold mb-6">
            <GiArtificialIntelligence size={40} className="text-blue-500" />
            <span>Smart Notes</span>
          </div>

          {/* Home Button */}
          <button className="flex items-center space-x-2 w-full mb-6 bg-gray-200 text-black-500 hover:bg-blue-400 px-4 py-3 rounded-full">
            <FaHome size={20} />
            <span>Home</span>
          </button>

          {/* Favorites Button */}
          <button className="flex items-center space-x-2 w-full mb-6 bg-gray-200 text-black-500 hover:bg-blue-400 px-4 py-3 rounded-full">
            <FaStar size={20} />
            <span>Favorites</span>
          </button>
        </div>

        {/* User Initial and Username at the Bottom */}
        <div className="mt-auto"> {/* Push this section to the bottom */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
              {userInitial}
            </div>
            <div className="text-sm text-black">{userName}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftBar;