import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsCookie from "js-cookie";
import axios from "axios";
import { RiMenu2Line, RiSearchLine } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";

export default function Header({ isAuthenticated, setIsAuthenticated, toggleSidebar, setPlaylists }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [user, setUser] = useState(null);
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

  const handleLogOut = async () => {
    await axios.post("/api/v1/users/logout").catch((e) => console.log(e));
    jsCookie.remove("authenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/login");
  };

  const handleOpenDashboard = () => {
    navigate("/dashboard");
  };

  const handleCreatePlaylist = () => {
    setShowModal(true); // Open the modal when "Create Playlist" is clicked
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSubmitPlaylist = async () => {
    try {
      const res = await axios.post("/api/v1/playlist/", {
        name: playlistName,
        description: playlistDescription,
      });
      console.log("Playlist created successfully:", res.data.data);
      setShowModal(false);
      setShowDropdown(false);
      setPlaylistName("");
      setPlaylistDescription("");
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        try {
          const res = await axios.get("/api/v1/users/currentUser");
          setUser(res.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUser();
    }
  }, [isAuthenticated]);

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
      <div className="flex space-x-4 items-center relative">
        {isAuthenticated ? (
          <>
            <div className="relative">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg py-2 z-40">
                  <button
                    onClick={handleOpenDashboard}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Open Dashboard
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Create Playlist
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            className="bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition duration-200"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        )}
      </div>

      {/* Modal for Creating Playlist */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create a New Playlist</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Playlist Name</label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPlaylist}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
