import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../utils/sideBar";
import Header from "../utils/Header";
import { FaYoutube } from "react-icons/fa";
import Videos from "../utils/Videos";

export default function HomePage({ isAuthenticated, setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/api/v1/videos/");
        const shuffledVideos = shuffleArray(res.data.data); // Shuffle videos
        setVideos(shuffledVideos);
        setAllVideos(shuffledVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const resetVideos = () => {
    setVideos(allVideos);
  }

  return (
    <div className="w-screen min-h-screen h-inherit bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <Header
        toggleSidebar={toggleSidebar}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        videos={videos}
        setVideos={setVideos}
        resetVideos={resetVideos}
      />

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
