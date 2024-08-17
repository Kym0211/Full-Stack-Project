import React, { useState, useEffect } from "react";
import SideBar from "../utils/sideBar";
import Header from "../utils/Header";
import axios from "axios";

export default function DashboardPage({ isAuthenticated, setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [status, setStatus] = useState("Online");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get("/api/v1/dashboard/stats");
        setStats(statsRes.data.data);

        const statusRes = await axios.get("/api/v1/healthcheck/")
        if(statusRes.success) {
            setStatus("Offline");
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  
  
  return (
    <div className="w-screen min-h-screen h-inherit bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <Header
        toggleSidebar={toggleSidebar}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        <main className="flex-1 ml-16 p-4">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Subscribers</h2>
              <p className="text-4xl font-bold mt-4">{stats.totalSubscribers || 0}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Videos</h2>
              <p className="text-4xl font-bold mt-4">{stats.totalVideos || 0}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Views</h2>
              <p className="text-4xl font-bold mt-4">{stats.totalViews || 0}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Likes</h2>
              <p className="text-4xl font-bold mt-4">{stats.totalLikes || 0}</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">System Health</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Server Status</h3>
                <p className={`mt-4 text-lg font-bold ${status === "Online" ? "text-green-500" : "text-red-500"}`}>
                  {status || "Unknown"}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Database Status</h3>
                <p className={`mt-4 text-lg font-bold ${status === "Online" ? "text-green-500" : "text-red-500"}`}>
                  {status || "Unknown"}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
