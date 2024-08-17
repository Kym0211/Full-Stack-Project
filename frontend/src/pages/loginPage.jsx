import React, { useEffect, useState } from "react";
import axios from "axios";
import jsCookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";

export default function Login({ isAuthenticated, setIsAuthenticated }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect( ()=> {
        const checkAuth = () => {
            const accessToken = jsCookie.get("accessToken");
            if (accessToken) {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
        if (isAuthenticated) {
            navigate("/");
        }
    })

    const payload = {
        password: password,
        ...(username.includes("@") ? { email: username } : { username: username }),
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await axios.post("/api/v1/users/login", {
            ...payload
        }).catch((err) => {
            setLoading(false);
            alert("Invalid username or password");
        });
        setLoading(false);

        setTimeout(() => {
            setIsAuthenticated(false);
            jsCookie.remove("authenticated");
            alert("Your session is expired. Please login again");
            try {
                axios.get('/api/v1/users/refreshToken').then((res) => {
                    setIsAuthenticated(true);
                    jsCookie.set("authenticated", true);
                })
            } catch (error) {
                console.error("Error refreshing token:", error);
            }
        },1800000)
    };




    return (
        <div className="w-screen min-h-screen h-inherit bg-gray-800 flex items-center justify-center">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-4xl text-center mb-12">Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-col mb-8">
                            <label htmlFor="username" className="mb-2">Username or Email:</label>
                            <input
                                id="username"
                                className="px-2 py-1 rounded border border-gray-400"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        {!loading && <button
                            className="px-4 py-2 bg-gray-800 text-white rounded transition-transform transform hover:scale-105 active:scale-95 focus:outline-none"
                            type="submit"
                        >
                            Login
                        </button>}
                        <MoonLoader loading={loading} size={30} color={"#123abc"} />
                    </div>
                </form>
                <div className="text-center mt-8">
                    <p>Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a></p>
                </div>
            </div>
        </div>
    );
}
