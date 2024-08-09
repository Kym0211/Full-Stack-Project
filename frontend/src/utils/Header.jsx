import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsCookie from "js-cookie";
import axios from "axios";
import { RiMenu2Line, RiSearchLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";

export default function Header({isAuthenticated, setIsAuthenticated, toggleSidebar}) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = jsCookie.get("accessToken");
      if (accessToken) {
      }
    };
    checkAuth();
  }, []);

  const handleLogOut = async () => {
    await axios.post("/api/v1/users/logout").catch((e) => console.log(e));
    jsCookie.remove("authenticated");
    setIsAuthenticated(false);
  };

  const handleSignUp = () => {
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-gray-900 shadow-md z-30 border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <RiMenu2Line size={28} className="text-white" />
        </button>
        <div className="flex items-center space-x-1">
          <FaYoutube size={28} className="text-red-600" />
          <span className="text-lg text-white font-semibold hidden sm:inline">
            YouTube
          </span>
        </div>
      </div>
      <div className="flex-1 mx-4 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-800 text-white rounded-full pl-4 pr-12 py-2 focus:outline-none placeholder-gray-400"
          />
          <button className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3 bg-gray-700 rounded-r-full">
            <RiSearchLine size={20} className="text-white" />
          </button>
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <button
          className="bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition duration-200"
          onClick={isAuthenticated ? handleLogOut : handleSignUp}
        >
          {isAuthenticated ? "Sign Out" : "Sign Up"}
        </button>
      </div>
    </header>
  );
}
