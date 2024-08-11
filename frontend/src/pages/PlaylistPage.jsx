import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../utils/sideBar";
import { FaYoutube } from "react-icons/fa";
import { RiMenu2Line } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5"

export default function PlaylistPage({ isAuthenticated }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get("/api/v1/playlist/user");
        setPlaylists(res.data.data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistClick = async (playlist) => {
    try {
      const videoFetchPromises = playlist.videos.map((videoId) =>
        axios.get(`/api/v1/videos/${videoId}`)
      );
      const videoResponses = await Promise.all(videoFetchPromises);
      const fetchedVideos = videoResponses.map((res) => res.data.data.video);

      setVideos(fetchedVideos);

      setSelectedPlaylist(playlist);

      console.log("Videos:", fetchedVideos);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
    }
  };

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

  function formatDuration(duration) {
    const mins = Math.floor(duration);
    const secs = Math.floor((duration - mins) * 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  const deletePlaylistItem = async (playlistID, videoId) => {
    try {
      console.log(`Deleting video ID: ${videoId} from playlist ID: ${playlistID}`);
      const res = await axios.delete(`/api/v1/playlist/remove/${videoId}/${playlistID}`);
      if (res.status === 200) {
        setVideos((prevVideos) => prevVideos.filter((video) => video[0]._id !== videoId));
  
        console.log("Deleted video with ID:", videoId);
      } else {
        console.error("Failed to delete video. Status code:", res.status);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };


  const handleBackClick = () => {
    setSelectedPlaylist(null);
  };

  const deletePlaylist = async (playlistID) => {
    try {
      console.log(`Deleting playlist ID: ${playlistID}`);
      const res = await axios.delete(`/api/v1/playlist/p/${playlistID}`);

      if (res.status === 200) {
        setPlaylists((prevPlaylists) =>
          prevPlaylists.filter((playlist) => playlist._id !== playlistID)
        );
  
        console.log("Deleted playlist with ID:", playlistID);
      } else {
        console.error("Failed to delete playlist. Status code:", res.status);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

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
        <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
  
        {selectedPlaylist ? (
          <>
            <button
              onClick={handleBackClick}
              className="mb-4 text-gray-400 hover:text-white flex items-center"
            >
              <IoArrowBack size={20} className="mr-2" />
              Back to Playlists
            </button>
  
            {videos.length === 0 ? (
              <p>No videos found in this playlist.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {videos.map((video) => (
                  <li
                    key={video[0]._id} 
                    className="flex items-start bg-gray-800 p-4 rounded-lg shadow-lg relative"
                  >
                    <img
                      src={video[0].thumbnail} 
                      alt={video[0].title}
                      className="w-48 h-28 object-cover mr-4 rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{video[0].title}</h3>
                      <p className="text-sm text-gray-400">{video[0].channelName}</p>
                      <div className="text-sm text-gray-500">
                        <span>{video[0].views} views</span> •{" "}
                        <span>{calculateDateDifference(video[0].createdAt)}</span>
                      </div>
                      <button
                        className="mt-2 text-red-500 hover:underline"
                        onClick={() => deletePlaylistItem(selectedPlaylist._id, video[0]._id)}
                      >
                        Delete from Playlist
                      </button>
                    </div>
                    <div className="flex flex-col items-end ml-4 space-y-10">
                      <span className="text-sm text-gray-400">
                        {formatDuration(video[0].duration)}
                      </span>
                      <img
                        src={video[0].owner_details.avatar}
                        alt={video[0].owner_details.username}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                  </li>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {playlists.length === 0 ? (
              <p>No playlists found. Create a playlist to see it here.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold" onClick={() => handlePlaylistClick(playlist)}>{playlist.name}</h2>
                    <p className="text-gray-400 mt-2">{playlist.description}</p>
                    <p className="text-gray-500 mt-2 text-sm">
                      Created at: {new Date(playlist.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      className="mt-2 text-red-500 hover:underline"
                      onClick={() => deletePlaylist(playlist._id)}
                    >
                      Delete Playlist
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
  
}
