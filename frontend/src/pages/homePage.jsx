import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsCookie from "js-cookie";
import SideBar from "../utils/sideBar";
import Header from "../utils/Header";
import { FaYoutube } from "react-icons/fa";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center flex justify-ceter flex-col items-center">
            <FaYoutube size={100} />
            <h2 className="text-2xl">No videos available</h2>
            <p className="text-gray-400">
              There are no videos here available. Please try to search something
              else.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
