import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import google from "../assets/google.png";   
import axios from "axios";
import { toast, Toaster } from 'sonner';
import { Navbar } from "../components/navbar";

export default function SignIn(
    
    // { setIsLoggedIn, setUserData }
) { // Added setUserData prop
  const navigate = useNavigate();
//   const [username, setUsername] = useState("");  
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
  
//   try {
//     const res = await axios.post(
//       "http://127.0.0.1:8000/api/accounts/login/",
//       { username, password }
//     );

//     console.log("Login Response:", res.data);
    
//     // Store tokens in localStorage
//     localStorage.setItem("access_token", res.data.access);
//     localStorage.setItem("refresh_token", res.data.refresh);
    
//     // ✅ PROPERLY handle avatar URL - convert relative to absolute if needed
//     let avatarUrl = res.data.user?.avatar || "";
    
//     if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
//       avatarUrl = `http://localhost:8000${avatarUrl}`;
//     }
    
//     // Store user data in state
//     const userData = {
//       username: res.data.user?.username || "",
//       email: res.data.user?.email || "",
//       avatar: avatarUrl
//     };
    
//     // ✅ ALSO update localStorage with proper avatar URL
//     localStorage.setItem("username", userData.username);
//     localStorage.setItem("email", userData.email);
//     localStorage.setItem("avatar", userData.avatar);
    
//     // Update parent component state
//     setUserData(userData);
//     setIsLoggedIn(true);
    
//     // Navigate to home page
//     navigate("/");
    
//   } catch (err) {
//     console.error("Login Error:", err);
//     alert(err.response?.data?.error || "Login failed. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

  return (
    <div className="flex flex-col items-center justify-start  w-full font-poppins">
        <Toaster position="top-center" richColors />
          <Navbar />
      <div className="bg-white p-5 rounded-2xl shadow-xl w-110 text-center mt-20">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-1">Welcome</h2>
        <p className="text-gray-500 text-sm mb-3">
          Login to continue your analysis
        </p>
        <form  className="text-left">
          <div>
            <label className="font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter username"
            //   value={}
            //   onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-3 mb-3 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 caret-blue-400"
            />
          </div>
          <div>
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter password"
            //   value={}
            //   onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-3 mb-9 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 caret-blue-400"
            />
          </div>
          <button
            type="submit"
            // disabled={loading}
            className={`w-full bg-emerald-600 text-white py-3 rounded-xl text-lg font-medium transition 
            {
             loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
            }`
        }
          >
            Login
          </button>

          <p className="text-gray-500 text-sm mt-5 text-center">
            Don't have an account?
            <span
              onClick={() => navigate("/sign_up")}
              className="text-emerald-600 font-semibold ml-1 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}