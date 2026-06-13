import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { Navbar } from "../components/navbar";
import { authService } from '../../services/services';

export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
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
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed";
      let fieldErrors = {};
      
      if (error.errors) {
        fieldErrors = error.errors;
        
        // Get first error message for toast (prioritize email > username > password)
        if (fieldErrors.email && fieldErrors.email.length > 0) {
          errorMessage = fieldErrors.email[0];
        } else if (fieldErrors.username && fieldErrors.username.length > 0) {
          errorMessage = fieldErrors.username[0];
        } else if (fieldErrors.password && fieldErrors.password.length > 0) {
          errorMessage = fieldErrors.password[0];
        } else if (fieldErrors.password2 && fieldErrors.password2.length > 0) {
          errorMessage = fieldErrors.password2[0];
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setErrors(fieldErrors);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    if (errors[fieldName] && errors[fieldName].length > 0) {
      return errors[fieldName][0];
    }
    return null;
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

          {/* Username Field */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
                getFieldError('username') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('username') && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {getFieldError('username')}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('email') && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
                getFieldError('password') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('password') && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {getFieldError('password')}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1 text-left">
              Password must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-9">
            <input
              type="password"
              placeholder="Confirm password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
                getFieldError('confirm_password') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('confirm_password') && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {getFieldError('confirm_password')}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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