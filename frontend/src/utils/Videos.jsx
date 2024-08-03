import React, { useEffect, useState } from "react";

export default function Videos({ videos }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videos.length !== 0) {
      setLoading(false);
    }
  }, [videos]);

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
      return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
    }
  }

  // Function to format duration from seconds to "minutes:seconds"
  function formatDuration(duration) {
    const mins = Math.floor(duration);
    const secs = Math.floor((duration - mins) * 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="relative">
                {/* Video Thumbnail */}
                <img
                  src={video.thumbnail || "path/to/default-thumbnail.jpg"}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-black bg-opacity-50 text-white rounded-full p-3"
                    onClick={() => alert(`Play video: ${video.title}`)}
                  >
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
                {/* Video Duration Overlay */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={video.owner_details.avatar}
                    alt={video.owner_details.username}
                    className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h1 className="text-lg font-semibold line-clamp-2">
                      {video.title}
                    </h1>
                    <div className="flex flex-col mt-1 space-y-1 text-sm text-gray-400">
                      <p className="flex items-center space-x-1">
                        <span className="font-medium">
                          {video.owner_details.username}
                        </span>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                          Creator
                        </span>
                      </p>
                      <div className="flex space-x-2">
                        <p>{calculateDateDifference(video.createdAt)}</p>
                        <span>•</span>
                        <p>{video.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
