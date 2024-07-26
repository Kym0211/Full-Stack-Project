import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsCookie from "js-cookie";
import axios from "axios";
import { RiMenu2Line } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";


export default function Header({ toggleSidebar }){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = () => {
        const accessToken = jsCookie.get("accessToken");
        if (accessToken) {
          setIsAuthenticated(true);
        }
      };
      checkAuth();
    }, []);

    
      const handleLogIn = () => {
        navigate("/login");
      };
    
      const handleLogOut = async () => {
        await axios.post("/api/v1/users/logout").catch((e) => console.log(e));
        setIsAuthenticated(false);
      };
    
      const handleSignUp = () => {
        navigate("/signup");
      };
    return(
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md z-30">
        <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="focus:outline-none md:mr-10 sm:mr-2">
            <RiMenu2Line size={24} />
        </button>
        <FaYoutube size={40} />
        </div>
        <div className="flex space-x-4">
        {!isAuthenticated && (
            <button
            className="bg-transparent hover:underline"
            onClick={handleLogIn}
            >
            Log In
            </button>
        )}
        <button
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            onClick={isAuthenticated ? handleLogOut : handleSignUp}
        >
            {isAuthenticated ? "Log Out" : "Sign Up"}
        </button>
        </div>
    </header>
    )
}