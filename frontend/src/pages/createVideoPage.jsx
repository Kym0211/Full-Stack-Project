import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !title.trim() || !thumbnailFile) {
      setErrorMessage("Please provide a title, select a video, and upload a thumbnail.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await axios.post("/api/v1/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploading(false);
      setSuccessMessage("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (error) {
      setUploading(false);
      setErrorMessage("Failed to upload video. Please try again.");
      console.error("Error uploading video:", error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Video</h2>
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition duration-200"
          >
            Back
          </button>
        </div>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
