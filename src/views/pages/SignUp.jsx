import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Navbar } from "../components/navbar";
import { authService } from '../../services/services';


export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  if (formData.password !== formData.confirm_password) {
    toast.error("Passwords do not match");
    setLoading(false);
    return;
  }
  
  try {
    const result = await authService.register(formData);
    
    if (result.success) {
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/sign_in"), 1500);
    }
  } catch (error) {
    toast.error(error.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full font-poppins">
      <Toaster position="top-center" richColors />
      <Navbar />

      <div className="bg-white p-5 rounded-2xl shadow-xl w-110 text-center mt-10">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-1">
          Create Account
        </h2>

        <p className="text-gray-500 text-sm mb-3">
          Sign up to start predicting house prices
        </p>

        <form onSubmit={handleSubmit} className="text-left">

          <input
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full mt-3 mb-3 p-3 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-3 mb-3 p-3 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-3 mb-3 p-3 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Confirm password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            className="w-full mt-3 mb-9 p-3 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-gray-500 text-sm mt-5 text-center">
            Already have an account?
            <span
              onClick={() => navigate("/sign_in")}
              className="text-emerald-600 font-semibold ml-1 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}