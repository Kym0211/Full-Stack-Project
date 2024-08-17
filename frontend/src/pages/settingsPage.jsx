import React, { useState } from "react";
import axios from "axios";
import SideBar from "../utils/sideBar";
import Header from "../utils/Header";
import { RiMenu2Line } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";

export default function SettingsPage({ isAuthenticated, setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if(!isAuthenticated) {
    return (
      <>
      <div className="w-screen min-h-screen h-inherit bg-gray-900 text-white flex flex-col">
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
        <h1 className="text-2xl font-bold mb-4">You need to log in to change Settings.</h1>
      </main>
      </div>
      </>
    )
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setPreviewCoverImage(URL.createObjectURL(file));
  };

  const saveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (avatar) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatar);
        const avatarResponse = await axios.patch("/api/v1/users/updateAvatar", avatarFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage((prevMessage) => `${prevMessage ? prevMessage + ' ' : ''}Avatar updated successfully.`);
      }

      if (coverImage) {
        const coverImageFormData = new FormData();
        coverImageFormData.append("coverImage", coverImage);
        const coverImageResponse = await axios.patch("/api/v1/users/updateCoverImage", coverImageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage((prevMessage) => `${prevMessage ? prevMessage + ' ' : ''}Cover image updated successfully.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while saving changes");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  }
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }
  const changePassword = async () => {
    if (newPassword !== ConfirmPassword){
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/api/v1/users/changePassword", {
        currentPassword: password,
        newPassword
      });
      setPasswordSuccessMessage(response.data.message);
      console.log("Password changed successfully:", response.data.message);
    }
    catch (error) {
      console.error("Error changing password:", error);
    }
  }


  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col overflow-x-hidden">
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
      <div className="flex flex-1 ml-16 mt-16 overflow-x-hidden">
        <main className="flex-1 p-4">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          {/* Profile Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none cursor-pointer file:bg-gray-700 file:border-none file:text-gray-400 file:cursor-pointer hover:file:bg-gray-600"
                  onChange={handleAvatarChange}
                />
                {previewAvatar && (
                  <img
                    src={previewAvatar}
                    alt="Avatar Preview"
                    className="mt-4 rounded-full w-24 h-24 object-cover"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none cursor-pointer file:bg-gray-700 file:border-none file:text-gray-400 file:cursor-pointer hover:file:bg-gray-600"
                  onChange={handleCoverImageChange}
                />
                {previewCoverImage && (
                  <img
                    src={previewCoverImage}
                    alt="Cover Image Preview"
                    className="mt-4 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
              <button
                onClick={saveChanges}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {successMessage && (
                <p className="text-green-500 mt-4">{successMessage}</p>
              )}
            </div>
          </section>

          {/* Password Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Password</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Enter current password"
                  onChange={handlePasswordChange} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2" >New Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                  onChange={handleNewPasswordChange} 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                  onChange={handleConfirmPasswordChange} 
                />
              </div>
              <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded" onClick={changePassword}>
                Change Password
              </button>
            </div>
          </section>

          {/* Account Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-gray-400 mb-4">
                If you want to delete your account, please be aware that this action is irreversible.
              </p>
              <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded">
                Delete Account
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
