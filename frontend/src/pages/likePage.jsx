import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaYoutube } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";
import SideBar from "../utils/sideBar"; 

export default function LikePage({ isAuthenticated }) {
  const [likes, setLikes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return (
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
          <h1 className="text-2xl font-bold mb-4">
            You need to log in to see liked videos.
          </h1>
        </main>
      </div>
    );
  }

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get("/api/v1/likes/videos");
        setLikes(response.data.message.likedVideos);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLikes();
  }, []);
  
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const videoFetchPromises = likes.map(async (like) => {
          if (like.video) {
            const videoExists = videos.some((video) => video[0]._id === like.video);
            if (!videoExists) {
              const res = await axios.get(`/api/v1/videos/${like.video}`);
              console.log("Video data:", res.data.data.video);
              return res.data.data.video;
            }
          }
          return null;
        });
        const fetchedVideos = await Promise.all(videoFetchPromises);
  
        const newVideos = fetchedVideos.filter(Boolean);
  
        setVideos((prev) => {
          const existingIds = new Set(prev.map((video) => video[0]._id));
          const uniqueVideos = newVideos.filter((video) => !existingIds.has(video[0]._id));
          return [...prev, ...uniqueVideos];
        });
  
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
  
    if (likes.length > 0) {
      fetchVideoData();
    }
  }, [likes]);
  

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

  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white flex flex-col">
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
        <h1 className="text-2xl font-bold mb-4">Liked Videos</h1>
        {loading ? (
          <p>Loading liked videos...</p>
        ) : videos.length === 0 ? (
          <p>No liked videos available.</p>
        ) : (
          <ul className="space-y-4">
            {videos.map((video) => (
              <li
                key={video[0]._id}
                className="flex items-start bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <img
                  src={video[0].thumbnail}
                  alt={video[0].title}
                  className="w-48 h-28 object-cover mr-4 rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{video[0].title}</h3>
                <p className="text-sm text-gray-400">{video[0].owner_details.username}</p>
                  <div className="text-sm text-gray-500">
                    <span>{video[0].views} views</span> •{" "}
                    <span>{calculateDateDifference(video[0].createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4 space-y-10">
                  <span className="text-sm text-gray-400">
                    {formatDuration(video[0].duration)}
                  </span>
                  <img
                    src={video[0].owner_details.avatar}
                    alt={video[0].owner_details.username}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
