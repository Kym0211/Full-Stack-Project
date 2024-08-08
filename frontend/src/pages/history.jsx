import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaYoutube } from "react-icons/fa";
import SideBar from "../utils/sideBar";
import { RiMenu2Line } from "react-icons/ri";
import { generateApiKey } from "generate-api-key";

export default function HistoryPage({ isAuthenticated, setIsAuthenticated }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if(!isAuthenticated) {
    return (
      <>
      <div className="w-screen min-h-screen h-inherit bg-gray-900 text-white flex flex-col">
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
        </header>
      <SideBar sidebarOpen={sidebarOpen} />
      <main className="ml-20 mt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">You need to log in to watch your history.</h1>
      </main>
      </div>
      </>
    )
  }

  function calculateDateDifference(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    const diffInMillis = today - inputDate;
    const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
    const diffInSeconds = Math.floor(diffInMillis / 1000);

    if (diffInDays >= 1) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    }
  }

  function formatDuration(duration) {
    const mins = Math.floor(duration);
    const secs = Math.floor((duration - mins) * 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/v1/users/history");
        setHistory(response.data.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);



  const deleteHistoryItem = async (videoId) => {
    console.log(videoId)
    try {
      const response = await axios.patch(`/api/v1/users/removeVideo/${videoId}`);
      setHistory(response.data.data);
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  if(!history.length){
    return(
      <div className="w-screen min-h-screen h-inherit bg-gray-900 text-white flex flex-col">
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
        </header>
        <SideBar sidebarOpen={sidebarOpen} />
        <main className="ml-20 mt-16 p-4">
          <h1 className="text-2xl font-bold mb-4">No history available.</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
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
      </header>
      <SideBar sidebarOpen={sidebarOpen} />
      <main className="ml-20 mt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Watch History</h1>
        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((video) => (
              <li
                key={generateApiKey(10)}
                className="flex items-start bg-gray-800 p-4 rounded-lg shadow-lg relative"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-48 h-28 object-cover mr-4 rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-400">{video.channelName}</p>
                  <div className="text-sm text-gray-500">
                    <span>{video.views} views</span> •{" "}
                    <span>{calculateDateDifference(video.createdAt)}</span>
                  </div>
                  <button
                    className="mt-2 text-red-500 hover:underline"
                    onClick={() => deleteHistoryItem(video._id)}
                  >
                    Delete from history
                  </button>
                </div>
                <span className="text-sm text-gray-400 ml-4">
                  {formatDuration(video.duration)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
