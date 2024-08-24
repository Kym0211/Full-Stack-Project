import React, { useState, useEffect } from "react";
import SideBar from "../utils/sideBar";
import axios from "axios";
import { FaYoutube } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";
import { calculateDateDifference, formatDuration } from "../functions/Functions";
import { useNavigate } from "react-router-dom";

export default function MyContentPage({ isAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myContent, setMyContent] = useState([]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const fetchmyContent = await axios.get("/api/v1/dashboard/videos");
        setMyContent(fetchmyContent.data.data);
      } catch (error) {
        console.error("Error fetching my content:", error);
      }
    };

    fetch();
  }, []);

  let publishedContent = [];
  if (myContent.length) {
    publishedContent = myContent.filter((content) => content.isPublished);
  }

  if(publishedContent.length === 0) {
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
          <h1 className="text-2xl font-bold mb-4">No content available.</h1>
        </main>
      </div>
    );
  }

  const playVideo = async (videoId) => {
    const res = await axios.post(`/api/v1/users/saveHistory/${videoId}`);
    const response = await axios.patch(`/api/v1/videos/views/${videoId}`);
    navigate(`/video/${videoId}`);
  }

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
        {!isAuthenticated ? (
          <h1 className="text-2xl font-bold mb-4">
            You need to log in to see your content.
          </h1>
        ) : (
          <div className="space-y-4">
            {publishedContent.map((video) => (
              <div
                key={video._id}
                className="flex relative hover:cursor-pointer items-start bg-gray-800 p-4 rounded-lg shadow-lg"
                onClick={() => playVideo(video._id)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-48 h-28 object-cover mr-4 rounded"
                />
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
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-400">
                    {video.ownerDetails.username}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span>{video.views} views</span> •{" "}
                    <span>{calculateDateDifference(video.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4 space-y-10">
                  <span className="text-sm text-gray-400">
                    {formatDuration(video.duration)}
                  </span>
                  <img
                    src={video.ownerDetails.avatar}
                    alt={video.ownerDetails.username}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
