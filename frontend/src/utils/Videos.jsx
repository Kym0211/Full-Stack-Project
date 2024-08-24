import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDuration, calculateDateDifference } from "../functions/Functions";

export default function Videos({ videos }) {
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videos.length !== 0) {
      setLoading(false);
    }
  }, [videos]);

  const playVideo = async (videoId) => {
    await axios.post(`/api/v1/users/saveHistory/${videoId}`);
    await axios.patch(`/api/v1/videos/views/${videoId}`);
    navigate(`/video/${videoId}`);
  };

  const handleSaveToPlaylist = (videoId) => {
    console.log("Save to playlist:", videoId);
  };

  const handleDontRecommend = (videoId) => {
    console.log("Don't recommend:", videoId);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? (
        <div className="text-center col-span-full">Loading...</div>
      ) : (
        videos.map((video, index) => (
          <div
            key={video._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative cursor-pointer" onClick={() => playVideo(video._id)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button className="bg-black bg-opacity-50 text-white rounded-full p-3">
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
              </div>
              <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded opacity-75">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="p-4 flex items-start justify-between">
              <img
                src={video.owner_details.avatar}
                alt={video.owner_details.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-400">{video.channelName}</p>
                <div className="text-sm text-gray-500">
                  <span>{video.views} views</span> •{" "}
                  <span>{calculateDateDifference(video.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
