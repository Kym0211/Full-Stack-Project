import React from "react";
import {
  RiHomeLine,
  RiVideoLine,
  RiHistoryLine,
  RiPlayListLine,
  RiUserLine,
  RiSettings3Line,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function SideBar({ sidebarOpen }) {
  const navigate = useNavigate()
  const buttonStyle = `w-full flex items-center text-white hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200 ${
    sidebarOpen ? "justify-start" : "justify-center"
  }`;

  const homeButton = () => {
    navigate("/");
  }

  const likedVideosButton = () => {
    navigate("/liked-videos");
  }

  const historyButton = () => {
    navigate("/history");
  }

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100%-64px)] bg-gray-900 transform transition-transform duration-300 z-20 ${
        sidebarOpen ? "w-64" : "w-16"
      } shadow-lg border-r border-gray-800 flex flex-col justify-between`}
    >
      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-4 pt-4">
          <li>
            <button className={buttonStyle} onClick={homeButton}>
              <RiHomeLine size={24} className="mr-3" />
              {sidebarOpen && "Home"}
            </button>
          </li>
          <li>
            <button className={buttonStyle} onClick={likedVideosButton} >
              <RiVideoLine size={24} className="mr-3" />
              {sidebarOpen && "Liked Videos"}
            </button>
          </li>
          <li>
            <button className={buttonStyle} onClick={historyButton} >
              <RiHistoryLine size={24} className="mr-3" />
              {sidebarOpen && "History"}
            </button>
          </li>
          <li>
            <button className={buttonStyle}>
              <RiPlayListLine size={24} className="mr-3" />
              {sidebarOpen && "My Content"}
            </button>
          </li>
          <li>
            <button className={buttonStyle}>
              <RiPlayListLine size={24} className="mr-3" />
              {sidebarOpen && "Collections"}
            </button>
          </li>
          <li>
            <button className={buttonStyle}>
              <RiUserLine size={24} className="mr-3" />
              {sidebarOpen && "Subscribers"}
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-shrink-0 pb-4">
        <button className={buttonStyle}>
          <RiSettings3Line size={24} className="mr-3" />
          {sidebarOpen && "Settings"}
        </button>
      </div>
    </aside>
  );
}
