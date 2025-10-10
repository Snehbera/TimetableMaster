import React, { useState } from "react";
// FIXED: Adjusted the import path. You may need to change this depending on your file structure.
import useUserProfileStore from "../../Stores/userProfileStore";

// --- Helper function to get initials from a name ---
const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
};

// --- Helper function to generate a consistent color from a string (for the avatar) ---
const generateColorFromName = (name) => {
  if (!name) return "#cccccc";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 65%, 75%)`; // Adjusted for a slightly softer tone
  return color;
};

// --- Reusable Input Field Component for consistency ---
const ProfileInput = ({ label, id, type = "text", value, onChange, icon }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
      />
    </div>
  </div>
);

// --- Main User Profile Component ---
function UserProfile() {
  const {
    name,
    email,
    phone,
    facultyId,
    setName,
    setEmail,
    setPhone,
    setFacultyId,
  } = useUserProfileStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500); // Hide success message after 2.5s
    }, 1500);
  };

  const avatarColor = generateColorFromName(name);
  const initials = getInitials(name);

  return (
    <div className="Hero-wrapper">
      <div className="Hero-container">
        <div className="Hero-content">
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* --- Page Header --- */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Account Settings
                </h1>
                <p className="mt-1 text-base text-gray-600">
                  Manage your faculty profile, information, and settings.
                </p>
              </div>

              {/* --- Main Content Grid --- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Profile Card --- */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-indigo-400 to-purple-400 relative">
                      <div
                        style={{ backgroundColor: avatarColor }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 w-28 h-28 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-gray-800"
                      >
                        {initials}
                      </div>
                    </div>
                    <div className="text-center pt-20 pb-6 px-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {name || "Faculty Name"}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{email}</p>
                    </div>
                    <div className="border-t border-gray-200 p-4 space-y-3">
                      <button className="w-full flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                        <IconSecurity />
                        <span className="ml-2">Change Password</span>
                      </button>
                      <button className="w-full flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                        <IconBell />
                        <span className="ml-2">Notification Settings</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- Right Column: Edit Form --- */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg">
                    <div className="p-6 sm:p-8 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Personal Information
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your personal details here.
                      </p>
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="space-y-6">
                        <ProfileInput
                          id="fullName"
                          label="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          icon={<IconUser />}
                        />
                        <ProfileInput
                          id="email"
                          label="Email Address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          icon={<IconMail />}
                        />
                        <ProfileInput
                          id="phone"
                          label="Phone Number"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          icon={<IconPhone />}
                        />
                        <ProfileInput
                          id="facultyId"
                          label="Faculty ID"
                          value={facultyId}
                          onChange={(e) => setFacultyId(e.target.value)}
                          icon={<IconIdentification />}
                        />
                      </div>
                      {/* --- Action Buttons --- */}
                      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
                        {showSuccess && (
                          <span className="text-sm text-green-600 flex items-center transition-opacity duration-300">
                            <IconCheckCircle />
                            Profile saved successfully!
                          </span>
                        )}
                        <button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
                        >
                          {isSaving ? <IconSpinner /> : <IconSave />}
                          <span className="ml-2">
                            {isSaving ? "Saving..." : "Save Changes"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SVG Icon Components ---
const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IconMail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const IconPhone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const IconIdentification = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4m-4 0a2 2 0 100 4 2 2 0 000-4z"
    />
  </svg>
);
const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconSave = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
  </svg>
);
const IconSpinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
const IconSecurity = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);
const IconBell = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

export default UserProfile;
