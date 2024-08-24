import React, { useState } from "react";
import {
  RiHomeLine,
  RiVideoLine,
  RiHistoryLine,
  RiPlayListLine,
  RiUserLine,
  RiSettings3Line,
  RiGalleryLine, // Icon for Posts
  RiFolderLine,  // Icon for Collections
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function SideBar({ sidebarOpen }) {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const buttonStyle = `relative w-full flex items-center text-white hover:bg-gray-700 p-3 rounded-lg text-lg transition-colors duration-200 ${
    sidebarOpen ? "justify-start" : "justify-center"
  }`;

  const handleMouseEnter = (item, event) => {
    if (!sidebarOpen) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({ top: rect.top + window.scrollY, left: rect.right });
      setHoveredItem(item);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const homeButton = () => {
    navigate("/");
  };

  const likedVideosButton = () => {
    navigate("/liked-videos");
  };

  const historyButton = () => {
    navigate("/history");
  };

  const myContentButton = () => {
    navigate("/my-content");
  };

  const playlistButton = () => {
    navigate("/playlist");
  };

  const subscriptionButton = () => {
    navigate("/subscriptions");
  };

  const settingsButton = () => {
    navigate("/settings");
  };

  const postsButton = () => {
    navigate("/posts");
  };

  return (
    <aside
      className={`fixed top-11 left-0 h-[calc(100%-64px)] bg-gray-900 transform transition-transform duration-300 z-20 ${
        sidebarOpen ? "w-64" : "w-16"
      } shadow-lg border-r border-gray-800 flex flex-col justify-between`}
    >
      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-4 pt-4">
          <li
            onMouseEnter={(e) => handleMouseEnter("Home", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={homeButton}>
              <RiHomeLine size={24} className="mr-3" />
              {sidebarOpen && "Home"}
            </button>
          </li>
          <li
            onMouseEnter={(e) => handleMouseEnter("Liked Videos", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={likedVideosButton}>
              <RiVideoLine size={24} className="mr-3" />
              {sidebarOpen && "Liked Videos"}
            </button>
          </li>
          <li
            onMouseEnter={(e) => handleMouseEnter("History", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={historyButton}>
              <RiHistoryLine size={24} className="mr-3" />
              {sidebarOpen && "History"}
            </button>
          </li>
          <li
            onMouseEnter={(e) => handleMouseEnter("My Content", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={myContentButton}>
              <RiPlayListLine size={24} className="mr-3" />
              {sidebarOpen && "My Content"}
            </button>
          </li>
          <li
            onMouseEnter={(e) => handleMouseEnter("My Playlists", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={playlistButton}>
              <RiFolderLine size={24} className="mr-3" />
              {sidebarOpen && "My Playlists"}
            </button>
          </li>
          <li
            onMouseEnter={(e) => handleMouseEnter("Subscriptions", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={subscriptionButton}>
              <RiUserLine size={24} className="mr-3" />
              {sidebarOpen && "Subscriptions"}
            </button>
          </li>
          <li
            onMouseEnter={(e) => handleMouseEnter("Posts", e)}
            onMouseLeave={handleMouseLeave}
          >
            <button className={buttonStyle} onClick={postsButton}>
              <RiGalleryLine size={24} className="mr-3" />
              {sidebarOpen && "Posts"}
            </button>
          </li>
        </ul>
      </div>
      <div
        className="flex-shrink-0 pb-4"
        onMouseEnter={(e) => handleMouseEnter("Settings", e)}
        onMouseLeave={handleMouseLeave}
      >
        <button className={buttonStyle} onClick={settingsButton}>
          <RiSettings3Line size={24} className="mr-3" />
          {sidebarOpen && "Settings"}
        </button>
      </div>

      {/* Floating Tooltip */}
      {!sidebarOpen && hoveredItem && (
        <div
          className="fixed bg-gray-700 text-white py-1 px-3 rounded-md z-50 shadow-lg"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          {hoveredItem}
        </div>
      )}
    </aside>
  );
}
