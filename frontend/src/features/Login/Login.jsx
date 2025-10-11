import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// --- SVG Icons (No changes needed here) ---

const ClockIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    ></path>
  </svg>
);

const CalendarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    ></path>
  </svg>
);

const ShieldCheckIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    ></path>
  </svg>
);

const EnvelopeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    ></path>
  </svg>
);

const LockClosedIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    data-slot="icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    ></path>
  </svg>
);

const GoogleIcon = (props) => {
  return (
    <svg
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      fill="#000000"
      className="w-4 h-4 mr-2 flex-shrink-0"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        ></path>
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        ></path>
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        ></path>
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        ></path>
      </g>
    </svg>
  );
};

// --- Main Login Component ---

const Login = () => {
  const navigate = useNavigate();

  // State for form inputs, errors, and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // The Django API endpoint
  const API_URL = "http://10.100.102.27:8000/auth/login/";

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state
    setError(""); // Clear previous errors

    try {
      // Send POST request to the Django backend
      const response = await axios.post(API_URL, {
        email: email,
        password: password,
      });

      // Assuming the backend returns a token upon successful login
      const token = response.data.token; // 1. Token is received here

      // 2. You correctly store the token right here
      localStorage.setItem("authToken", token); // ✅ THIS IS THE CORRECT SPOT

      // Set the authorization header for subsequent requests globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //

      console.log("Login successful:", response.data); //
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      setLoading(false); // Stop loading
      if (err.response) {
        // The server responded with an error (e.g., 400, 401)
        console.error("Login Error:", err.response.data);
        // Set a user-friendly error message. Adjust based on your API's error format.
        setError(err.response.data.detail || "Invalid email or password.");
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error. Could not connect to the server.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const backgroundPatternStyle = {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0px)",
    backgroundSize: "40px 40px",
  };

  const googleButtonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(85, 85, 85)",
    border: "1px solid rgb(221, 221, 221)",
    borderRadius: "4px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px",
    transition: "background-color 0.3s, box-shadow 0.3s",
    width: "100%",
  };

  const googleSpanStyle = {
    fontWeight: 500,
  };

  return (
    <main className="">
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Section: Marketing/Welcome Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={backgroundPatternStyle}
            ></div>
          </div>
          <div className="relative z-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Welcome Back to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  TimetableMaster
                </span>
              </h1>
              <p className="text-lg text-indigo-100 mb-8 leading-relaxed max-w-lg">
                Continue your journey of effortless scheduling and time
                management with the most intelligent timetable generator.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3 text-indigo-100">
                  <ClockIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Save hours of manual scheduling work</span>
                </li>
                <li className="flex items-center space-x-3 text-indigo-100">
                  <CalendarIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Access your timetables anywhere, anytime</span>
                </li>
                <li className="flex items-center space-x-3 text-indigo-100">
                  <ShieldCheckIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Secure and reliable scheduling platform</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
            <div className="w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Log In to Your Account
              </h2>

              <button type="button" style={googleButtonStyle}>
                <GoogleIcon />
                <span style={googleSpanStyle}>Continue with Google</span>
              </button>

              <div className="my-6 flex items-center">
                <hr className="flex-grow border-t border-gray-200" />
                <span className="mx-4 text-sm text-gray-500">
                  or continue with email
                </span>
                <hr className="flex-grow border-t border-gray-200" />
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  tabIndex="0"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>

              <p className="mt-4 text-center text-gray-600">
                <a
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                  href="/forgot-password"
                >
                  Forgot your password?
                </a>
              </p>
              <p className="mt-6 text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
