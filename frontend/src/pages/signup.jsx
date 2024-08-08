import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !fullname || !password) {
            alert("Please fill in all required fields.");
            return;
        }
        if (!avatar ) {
            alert("Please upload an avatar.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("fullname", fullname);
            formData.append("password", password);
            if (avatar) formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);

            const response = await axios.post("/api/v1/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUsername("");
            setEmail("");
            setFullname("");
            setPassword("");
            setAvatar(null);
            setCoverImage(null);

            navigate("/login");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen min-h-screen h-inherit bg-gray-800 flex items-center justify-center">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl text-center mb-12">Register User</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-col mb-8">
                            <label htmlFor="username" className="mb-2">Username:</label>
                            <input
                                id="username"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="fullname" className="mb-2">Full Name:</label>
                            <input
                                id="fullname"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="email" className="mb-2">Email:</label>
                            <input
                                id="email"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="password" className="mb-2">Password:</label>
                            <input
                                id="password"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="avatar" className="mb-2">Avatar:</label>
                            <input
                                id="avatar"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                        </div>

                        <div className="flex flex-col mb-8">
                            <label htmlFor="coverImage" className="mb-2">Cover Image:</label>
                            <input
                                id="coverImage"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="file"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </div>

                        <div className="flex justify-center">
                            {!loading && (
                                <button
                                    className="px-4 py-2 bg-gray-800 text-white rounded transition-transform transform hover:scale-105 active:scale-95 focus:outline-none"
                                    type="submit"
                                >
                                    Register
                                </button>
                            )}
                            <MoonLoader loading={loading} size={30} color={"#123abc"} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
