import React from "react";
import { Link, useNavigate } from "react-router-dom";

// --- SVG ICON COMPONENTS ---

const CheckCircleIcon = (props) => (
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
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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

const GlobeIcon = (props) => (
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
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
    ></path>
  </svg>
);

const CreditCardIcon = (props) => (
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
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    ></path>
  </svg>
);

const UserIcon = (props) => (
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
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    ></path>
  </svg>
);

const MailIcon = (props) => (
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

const PhoneIcon = (props) => (
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
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    ></path>
  </svg>
);

const LockIcon = (props) => (
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

const Signup = () => {
  // Convert original inline styles to JSX objects

  const backgroundPatternStyle = {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)",
    backgroundSize: "40px 40px",
  };

  const googleButtonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#555",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, box-shadow 0.3s",
    width: "100%",
  };

  const googleSpanStyle = {
    fontWeight: 500,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section: Marketing/Value Proposition */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={backgroundPatternStyle}
            ></div>
          </div>

          <div className="relative z-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Start Your Journey with
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  TimetableMaster
                </span>
              </h1>
              <p className="text-lg text-indigo-100 mb-6 leading-relaxed max-w-lg">
                Join 40,000+ schools worldwide who trust TimetableMaster for
                their scheduling needs.
              </p>

              {/* Free Plan Callout */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-800" />
                  </div>
                  <span className="font-semibold text-lg">
                    Free Forever Plan
                  </span>
                </div>
                <p className="text-indigo-100 text-sm">
                  <strong>No credit card required.</strong> Sign up and start
                  creating schedules immediately with our free version.
                </p>
              </div>

              {/* Feature List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3 text-indigo-100">
                  <CalendarIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Intelligent scheduling algorithms</span>
                </li>
                <li className="flex items-center space-x-3 text-indigo-100">
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Automatic conflict resolution</span>
                </li>
                <li className="flex items-center space-x-3 text-indigo-100">
                  <GlobeIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Access from anywhere, anytime</span>
                </li>
                <li className="flex items-center space-x-3 text-indigo-100">
                  <CreditCardIcon className="w-5 h-5 flex-shrink-0" />
                  <span>No credit card needed for free plan</span>
                </li>
              </ul>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-2xl font-bold">40,000+</div>
                  <div className="text-indigo-200 text-sm">Schools</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">200k+</div>
                  <div className="text-indigo-200 text-sm">Schedules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-indigo-200 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Blur Effect */}
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
            <div className="w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Section: Signup Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Create Your Account
              </h2>

              {/* Google Signup Button */}
              <button type="button" style={googleButtonStyle}>
                {/* Note: /google-icon-logo.webp is a local path and requires you to place the asset in your project's public folder or import it. */}
                <GoogleIcon />
                <span style={googleSpanStyle}>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <hr className="flex-grow border-t border-gray-200" />
                <span className="mx-4 text-sm text-gray-500">
                  or sign up with email
                </span>
                <hr className="flex-grow border-t border-gray-200" />
              </div>

              {/* Detailed Signup Form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Full Name Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Enter your full name"
                      required
                      minLength="2" // Added minLength validation
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      // Remove redundant value="" in React
                    />
                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Address Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      required
                    />
                    <MailIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="countryCode"
                  >
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Input */}
                    <div className="relative w-1/3">
                      <input
                        type="tel"
                        id="countryCode"
                        placeholder="+1"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                      <GlobeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {/* Main Phone Number Input */}
                    <div className="relative w-2/3">
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        pattern="[0-9]{10}" // Added pattern for exactly 10 digits
                        maxLength="10" // Added maxLength for user experience
                      />
                      <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      placeholder="Choose a strong password"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                    <LockIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  tabIndex="0"
                >
                  Create Account
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
