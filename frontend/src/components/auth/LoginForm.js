import React, { useState } from "react";
import { Heart, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a successful login (replace with real API later)
    const user = {
      email: formData.email,
      role: "donor", // optional
    };

    localStorage.setItem("donor", JSON.stringify(user));
    alert(`Welcome back, ${user.email}!`);
    navigate("/donate/123"); // TODO: Replace 123 with actual causeId dynamically
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden lg:h-[85vh] lg:max-h-[700px]">
        {/* Image Section */}
        <div className="hidden lg:block relative">
          <img
            src="https://cdn.discordapp.com/attachments/1395611202104721448/1397273166983856269/9e502536-7068-4912-80e0-179e62827465.png?ex=68811f8b&is=687fce0b&hm=3446c7c112fd95d83785b85f2bf65760a59c24356acf217954b2c7e7326700e4&"
            alt="Person logging into the platform securely"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white text-center bg-gradient-to-t from-black/60 to-black/10">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome Back to the Community.
            </h2>
            <p className="mt-4 text-lg text-blue-100/80 max-w-sm">
              Your continued support fuels our mission and brings hope to many.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="h-10 w-10 text-blue-500" />
                <span className="text-3xl font-bold text-blue-500">
                  plsfundme
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Login to Your Account
              </h1>
              <p className="text-gray-500 mt-2">
                Continue your journey of giving.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className={iconClass} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                >
                  Log In
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
