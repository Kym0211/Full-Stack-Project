import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../utils/sideBar";
import SuggestedVideos from "../utils/SuggestedVideos";
import Comments from "../utils/Comments"
import { RiMenu2Line } from "react-icons/ri";
import { FaYoutube, FaThumbsUp, FaThumbsDown, FaRegBookmark } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { calculateDateDifference } from "../functions/Functions";

export default function VideoPage({ isAuthenticated, setIsAuthenticated }) {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");


  useEffect(() => {
    const checkLike = async (videoId) => {
        const fetchUser = await axios.get("/api/v1/users/currentUser")
        const ownerId = fetchUser.data.data._id
        try {
            const res = await axios.get(`/api/v1/likes/videos`);
            res.data.message.likedVideos.forEach((video) => {
                if( video.video === videoId && video.likedBy === ownerId){
                    setIsLiked(true)
                }
            })
        } catch (error) {
            console.error("Error checking like:", error);
        }
    }

    const checkSubscription = async (ownerId) => {
      try {
        const res = await axios.get(`/api/v1/subscriptions/channels`);
        res.data.data.forEach((channel) => {
          if (channel.channel._id === ownerId) {
            setIsSubscribed(true);
          }
        });
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
  
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/v1/videos/${videoId}`);
        const videoData = res.data.data.video[0];
        setVideo(videoData);
  
        if (videoData && videoData.owner_details) {
          checkSubscription(videoData.owner_details._id);
          checkLike(videoId)
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
  
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      try {
        const res = await axios.get(`/api/v1/videos`);
        setSuggestedVideos(res.data.data);
      } catch (error) {
        console.error("Error fetching suggested videos:", error);
      }
    };
    fetchSuggestedVideos();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/v1/comments/${videoId}`);
        setComments(res.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [videoId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubscribe = async (id) => {
    if (!isAuthenticated) {
      alert("You have to sign up first!");
      return navigate("/login");
    }

    try {
        console.log("Subscribing to channel...");
      setIsSubscribed(!isSubscribed);
      const res = await axios.post(`/api/v1/subscriptions/c/${id}`);
      console.log(res.data);
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("You have to sign up first!");
      return navigate("/login");
    }

    try {
        setIsLiked(!isLiked)
        const res = await axios.post(`/api/v1/likes/toggle/v/${videoId}`)
        console.log(res.data)
    } catch (error) {
        
    }
  };


  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`/api/v1/playlist/user`);
      setPlaylists(res.data.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };


  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("You need to sign up to save videos to a playlist.");
      navigate("/signup");
      return;
    }

    await fetchPlaylists();
    setIsModalOpen(true);
  };
  const handleSaveToPlaylist = async () => {
    if (!isAuthenticated) {
      alert("You need to sign up to save videos to a playlist.");
      navigate("/signup");
      return;
    }
  
    try {
      let playlistId = selectedPlaylistId;
      let description = "test"
  
      // Create a new playlist if a name is provided
      if (newPlaylistName) {
        const createRes = await axios.post("/api/v1/playlist", { name: newPlaylistName, description: description });
        playlistId = createRes.data.data._id;
      }
  
      // Save the video to the selected or newly created playlist
      const saveRes = await axios.post(`/api/v1/playlist/add/${videoId}/${playlistId}`);
      console.log(saveRes.data);
  
      setIsModalOpen(false); // Close the modal after saving
      setIsSaved(true); // Update the saved state to reflect in the UI
    } catch (error) {
      console.error("Error saving video to playlist:", error);
    }
  };

  return (
    <div className="w-full min-h-screen h-full bg-gray-900 text-white flex flex-col">
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

      {/* Main Content */}
      <div className="flex-1 flex ml-16 mt-16 p-4 overflow-hidden">
        <main className="flex-1 p-4">
          {video ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {/* Video Player */}
                <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={video.videoFile}
                    title={video.title}
                    frameBorder="0"
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video Details */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{video.title}</h1>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleLike}
                        className="flex items-center space-x-1 text-lg text-gray-400 hover:text-white"
                      >
                        {isLiked ? <FaThumbsDown /> : <FaThumbsUp />}
                        <span>{isLiked ? "Unlike" : "Like"}</span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 text-lg text-gray-400 hover:text-white"
                      >
                        {isSaved ? <BsFillBookmarkFill /> : <FaRegBookmark />}
                        <span>{isSaved ? "Saved" : "Save to Playlist"}</span>
                      </button>
                      <button
                        onClick={() => handleSubscribe(video.owner_details._id)}
                        className="text-lg text-gray-400 hover:text-white"
                      >
                        {isSubscribed ? "Unsubscribe" : "Subscribe"}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {video.channelName}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {video.views} views • {calculateDateDifference(video.createdAt)}
                  </p>
                  <p className="mt-4">{video.description}</p>
                </div>
              </div>

              {/* Suggested Videos */}
              <SuggestedVideos suggestedVideos={suggestedVideos} />

              {/* Comments Section */}
              <Comments comments={comments} />
            </div>
          ) : (
            <div className="text-center flex justify-center items-center h-full">
              <p className="text-gray-400">Loading video...</p>
            </div>
          )}
        </main>
      </div>

      {/* Playlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Save to Playlist</h2>

            {/* Existing Playlists */}
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <div key={playlist._id} className="flex items-center">
                  <input
                    type="radio"
                    name="playlist"
                    value={playlist._id}
                    checked={selectedPlaylistId === playlist._id}
                    onChange={() => setSelectedPlaylistId(playlist._id)}
                    className="mr-2"
                  />
                  <label>{playlist.name}</label>
                </div>
              ))}
            </div>

            {/* New Playlist */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="New Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="New Playlist Description"
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToPlaylist}
                className="py-2 px-4 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
