import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../utils/sideBar";
import Header from "../utils/Header";
import { FaYoutube } from "react-icons/fa";
import Videos from "../utils/Videos";
import Cookies from "js-cookie";

export default function HomePage({ isAuthenticated, setIsAuthenticated }) {
  const [test, setTest] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/api/v1/videos/");
        setVideos(res.data.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="w-screen min-h-screen h-inherit bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setPlaylists={setPlaylists} />

      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        <main className="flex-1 ml-16 p-4">
          {!videos.length ? (
            <div className="text-center flex justify-center flex-col items-center">
              <FaYoutube size={100} />
              <h2 className="text-2xl">No videos available</h2>
              <p className="text-gray-400">
                There are no videos here available. Please try to search something else.
              </p>
            </div>
          ) : (
            <Videos videos={videos} />
          )}
        </main>
      </div>
    </div>
  );
}
