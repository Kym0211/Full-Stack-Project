import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../utils/sideBar";
import { FaYoutube } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";

export default function SubscriptionsPage({ isAuthenticated }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get("/api/v1/subscriptions/channels");
        setSubscriptions(res.data.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  
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
        <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

        {subscriptions.length === 0 ? (
          <p>No subscriptions found. Subscribe to channels to see them here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.channel._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={subscription.channel.avatar}
                    alt={subscription.channel.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{subscription.channel.username}</h2>
                    <p className="text-gray-400">{subscription.subscriberCount} subscribers</p>
                  </div>
                </div>
                <div className="mt-4">
                  {subscription.videos.length === 0 ? (
                    <p className="text-gray-400">No recent videos.</p>
                  ) : (
                    subscription.videos.slice(0, 2).map((video) => (
                      <div
                        key={video._id}
                        className="flex items-start bg-gray-700 p-2 rounded-lg mb-2"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-32 h-20 object-cover mr-4 rounded"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{video.title}</h3>
                          <p className="text-sm text-gray-400">{calculateDateDifference(video.createdAt)}</p>
                          <p className="text-sm text-gray-500">{video.views} views</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
