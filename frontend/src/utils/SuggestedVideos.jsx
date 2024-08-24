import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDuration, calculateDateDifference } from "../functions/Functions"

export default function SuggestedVideos({ suggestedVideos }) {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md lg:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Suggested Videos</h2>
        <div className="space-y-4">
        {suggestedVideos.map((video) => (
            <div
            key={video._id}
            className="relative flex items-center cursor-pointer"
            onClick={() => navigate(`/video/${video._id}`)}
            >
            {/* Video Thumbnail with Duration */}
            <div className="relative">
                <img
                src={video.thumbnail}
                alt={video.title}
                className="w-36 h-24 rounded-lg object-cover"
                />
                <button className="bg-black opacity-0 hover:opacity-100 absolute bg-opacity-50 text-white rounded-full top-8 left-14 ">
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
                <span className="absolute top-1 right-1 bg-opacity-75 text-gray-400 text-sm px-1 py-0.5 rounded">
                {formatDuration(video.duration)}
                </span>

            {/* Video Details */}
            <div className="ml-4 flex-1 relative">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold">{video.title}</h3>
                        <p className="text-lg text-gray-400">{video.owner_details.username}</p>
                        <p className="text-lg text-gray-500">{video.views} views • {calculateDateDifference(video.createdAt)}</p>
                    </div>
                </div>
                <div className="flex absolute bottom-1 right-1 items-center" >
                    <img
                        src={video.owner_details.avatar}
                        alt={video.owner_details.username}
                        className="w-10 h-10 rounded-full"
                    />
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
  )
}