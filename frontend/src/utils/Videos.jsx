import React, { useEffect, useState } from "react";
import { generateApiKey } from "generate-api-key";

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
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    }
  }

  function formatDuration(duration) {
    const mins = Math.floor(duration);
    const secs = Math.floor((duration - mins) * 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? (
        <div className="text-center col-span-full">Loading...</div>
      ) : (
        videos.map((video) => (
          <div
            key={generateApiKey(10)}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
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
              <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded opacity-75">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-400">{video.channelName}</p>
              <div className="text-sm text-gray-500">
                <span>{video.views} views</span> •{" "}
                <span>{calculateDateDifference(video.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
