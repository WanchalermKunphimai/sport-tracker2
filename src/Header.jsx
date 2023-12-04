import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const linkStyles = {
    textDecoration: "none",
  };

  return (
    <div className="bg-black header">
      {/* //medium to big screen// */}
      <div className="py-4 hidden sm:block bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-white text-3xl font-bold sm:text-4xl lg:text-5xl">
            <span className="text-red-500">Sports</span>
            <span className="text-white">Tracker</span>
          </div>
          <nav className="hidden sm:flex justify-center items-center text-white text-lg font-semibold mt-4">
            <Link to="/" style={linkStyles} className="hover:text-blue-500 mr-4">
              Home
            </Link>
            <Link to="/favorite-teams" style={linkStyles} className="hover:text-blue-500 mr-4">
              Favorite Team
            </Link>
            <Link to="/scores" style={linkStyles} className="hover:text-blue-500 mr-4">
              Scores
            </Link>
            <Link to="/fixture" style={linkStyles} className="hover:text-blue-500 mr-4">
              Fixture
            </Link>
            <Link to="/news" style={linkStyles} className="hover:text-blue-500 mr-4">
              News
            </Link>
            <Link to="/select-teams" style={linkStyles} className="hover:text-blue-500">
              Select Teams
            </Link>
          </nav>
        </div>
      </div>
    </div>

      {/* small screen */}

      <div className="bg-black sm:hidden">
        <div className="container mx-auto px-0 pb-0 pt-4">
          <div className="text-white text-4xl font-bold sm:hidden">
            <div className="flex justify-center items-center align-middle pb-4">
              <span className="text-red-500">Sports</span>
              <span className="text-white">Tracker</span>
            </div>
          </div>
          <div className="sm:hidden text-white text-2xl bg-gray-300 overflow-x-auto flex flex-nowrap touch-pan-x">
            <Link
              to="/"
              style={linkStyles}
              className="hover:text-blue-500 text-espn-black px-4 py-2"
            >
              Home
            </Link>
            <Link
              to="/favorite-teams"
              style={linkStyles}
              className="hover:text-blue-500 text-espn-black px-4 py-2 whitespace-nowrap"
            >
              Favorite Team
            </Link>
            <Link
              to="/favorite-teams"
              style={linkStyles}
              className="hover:text-blue-500 text-espn-black px-2 py-2"
            >
              Score
            </Link>
            <Link
              to="/fixture"
              style={linkStyles}
              className="hover:text-blue-500 text-espn-black px-4 py-2"
            >
              Fixture
            </Link>
            <Link
              to="/schedule"
              style={linkStyles}
              className="hover:text-blue-500 text-espn-black px-4 py-2"
            >
              Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
