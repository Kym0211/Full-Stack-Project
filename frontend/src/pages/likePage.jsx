import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaYoutube } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";
import SideBar from "../utils/sideBar"; 
import { calculateDateDifference, formatDuration } from "../functions/Functions";

export default function LikePage({ isAuthenticated }) {
  const [likes, setLikes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const playVideo =async (videoId) => {
    const res = await axios.post(`/api/v1/users/saveHistory/${videoId}`);
    const response = await axios.patch(`/api/v1/videos/views/${videoId}`);
    navigate(`/video/${videoId}`);
  };

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
              <div
                key={video[0]._id}
                className="flex relative items-start bg-gray-800 p-4 rounded-lg shadow-lg"
                onClick={() => playVideo(video[0]._id)}
              >
                <button className="bg-black opacity-0 hover:opacity-100 absolute top-11 left-20 bg-opacity-50 text-white rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-6.525-3.763A1 1 0 007 8.192v7.616a1 1 0 001.227.966l6.525-1.684a1 1 0 00.746-.966V12a1 1 0 00-.746-.832z"
                    />
                  </svg>
                </button>
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
              </div>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
