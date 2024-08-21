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
            </div>
                <span className="absolute top-1 right-1 bg-opacity-75 text-gray-400 text-sm px-1 py-0.5 rounded">
                {formatDuration(video.duration)}
                </span>

            {/* Video Details */}
            <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-semibold">{video.title}</h3>
                    <p className="text-xs text-gray-400">{video.channelName}</p>
                    <p className="text-xs text-gray-500">{video.views} views • {calculateDateDifference(video.createdAt)}</p>
                </div>
                </div>
                <div className="flex items-center mt-2">
                <img
                    src={video.owner_details.avatar}
                    alt={video.owner_details.username}
                    className="w-6 h-6 rounded-full"
                />
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
  )
}