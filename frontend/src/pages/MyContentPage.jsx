import React, { useState, useEffect } from "react";
import SideBar from "../utils/sideBar";
import axios from "axios";
import { FaYoutube } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";

export default function MyContentPage({ isAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myContent, setMyContent] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const fetchmyContent = await axios.get("/api/v1/dashboard/videos");
        console.log("My content response:", fetchmyContent.data);
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

  console.log("My content:", publishedContent);

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
          <ul className="space-y-4">
            {publishedContent.map((video) => (
              <li
                key={video._id}
                className="flex items-start bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-48 h-28 object-cover mr-4 rounded"
                />
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
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
