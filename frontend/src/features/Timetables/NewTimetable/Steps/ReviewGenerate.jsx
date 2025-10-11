import React, { useState } from "react";
import useTimetableStore from "../../../../Stores/TimetableStore";
import { Link, useNavigate } from "react-router-dom"; // ✅ Changed useHistory to useNavigate

// --- SVG Icon Components ---
const IconBook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    ></path>
  </svg>
);

const IconAcademicCap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14v7m0 0l-3-1m3 1l3-1"
    />
  </svg>
);

const IconBuilding = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const InfoCard = ({ label, value, colSpan }) => (
  <div
    className={`bg-gray-50 p-3 sm:p-4 rounded-lg ${
      colSpan ? "sm:col-span-2" : ""
    }`}
  >
    <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
      {value}
    </p>
  </div>
);

const OverviewCard = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm flex items-center space-x-3 sm:space-x-4">
    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <span className="block text-lg sm:text-xl font-bold text-indigo-600">
        {value}
      </span>
      <span className="block text-xs sm:text-sm text-gray-700">{label}</span>
    </div>
  </div>
);

// ✅ Helper function to recursively remove all 'id' keys
const removeIdsRecursively = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(removeIdsRecursively);

  const newObj = {};
  for (const key in obj) {
    if (key !== "id") newObj[key] = removeIdsRecursively(obj[key]);
  }
  return newObj;
};

// ✅ Master cleanup: removes all IDs and replaces them with readable names/shortNames
const cleanStoreDataDeep = (store) => {
  const { subjects, faculty, rooms, timetableNames, ...rest } = store;

  // 1️⃣ --- Create lookup maps ---
  const subjectIdToShortName = new Map();
  subjects.forEach((sub) => {
    if (sub.id !== undefined && sub.shortName)
      subjectIdToShortName.set(sub.id, sub.shortName);
  });

  const timetableIdToName = new Map();
  timetableNames.forEach((tt) => {
    if (tt.id !== undefined && tt.name) timetableIdToName.set(tt.id, tt.name);
  });

  // 2️⃣ --- Clean Subjects (remove IDs) ---
  const cleanedSubjects = subjects.map(({ id, ...rest }) => rest);

  // 3️⃣ --- Clean Faculty (replace assignedSubjects IDs → shortNames) ---
  const cleanedFaculty = faculty.map(({ id, assignedSubjects = [], ...f }) => ({
    ...f,
    assignedSubjects: assignedSubjects.map(
      (sid) => subjectIdToShortName.get(sid) || sid
    ),
  }));

  // 4️⃣ --- Clean Rooms (replace timetableId & subjectId → readable names) ---
  const cleanedRooms = rooms.map(({ id, homeRoomFor = {}, ...room }) => {
    const { timetableId, subjectId, ...restHome } = homeRoomFor;

    const newHome = {
      ...restHome,
      ...(timetableId !== undefined
        ? { timetableName: timetableIdToName.get(timetableId) || timetableId }
        : {}),
      ...(subjectId !== undefined
        ? { subjectShortName: subjectIdToShortName.get(subjectId) || subjectId }
        : {}),
    };

    return { ...room, homeRoomFor: newHome };
  });

  // 5️⃣ --- Recursive cleanup for other leftover IDs ---
  const removeIdsRecursively = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(removeIdsRecursively);
    const newObj = {};
    for (const key in obj) {
      if (key !== "id") newObj[key] = removeIdsRecursively(obj[key]);
    }
    return newObj;
  };

  const cleanedRest = removeIdsRecursively(rest);

  // 6️⃣ --- Return final cleaned structure ---
  return {
    ...cleanedRest,
    subjects: cleanedSubjects,
    faculty: cleanedFaculty,
    rooms: cleanedRooms,
  };
};

const ReviewGenerate = () => {
  const navigate = useNavigate();
  const store = useTimetableStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [showJson, setShowJson] = useState(false);

  const {
    timetableNames,
    periodsPerDay,
    subjects,
    faculty,
    rooms,
    timings,
    weeklyTotals,
  } = store;

  const firstTimetableWorkingDays = timetableNames[0]?.workingDays || {};

  const workingDays = Object.entries(firstTimetableWorkingDays)
    .filter(([, isWorking]) => isWorking)
    .map(([day]) => day);

  const allTimetableDisplayNames =
    timetableNames.map((tt) => tt.name || "Untitled").join(", ") || "None";

  const overview = {
    subjects: subjects.length,
    classes: timetableNames.reduce(
      (acc, tt) => acc + (tt.subdivisions || []).filter(Boolean).length,
      0
    ),
    faculty: faculty.length,
    rooms: rooms.length,
    totalPeriods: weeklyTotals.grandTotalHours,
  };
  const cleanStoreData = cleanStoreDataDeep(store);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);

    // 1️⃣ Retrieve the token from localStorage
    const token = localStorage.getItem("authToken");

    // Optional: Check if the token exists before making the call
    if (!token) {
      setError("Authentication error: No token found. Please log in again.");
      setIsLoading(false);
      // You might want to redirect to the login page here
      // navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://10.100.102.27:8000/timetable/r/generate-semester-api/",
        {
          method: "POST",
          // 2️⃣ Add the Authorization header
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Use the retrieved token here
          },
          body: JSON.stringify(cleanStoreData),
        }
      );

      if (!response.ok) {
        // Handle specific auth errors like 401 Unauthorized
        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          // Consider clearing localStorage and redirecting
          // localStorage.removeItem("authToken");
          // navigate("/login");
        } else {
          throw new Error("Failed to generate timetable");
        }
        return; // Stop execution if response is not ok
      }

      const result = await response.json();
      console.log("✅ Success! Response from Django:", result);

      setGeneratedData(result);
      navigate("/dashboard/timetable/Viewtimetable", {
        state: { timetableData: result },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="mb-6 sm:mb-8 border-b border-gray-200 pb-4 sm:pb-6">
            <div className="flex items-center mb-4">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2 sm:mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                General Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoCard
                label="Timetables to Generate"
                value={allTimetableDisplayNames}
              />
              <InfoCard label="Periods Per Day" value={periodsPerDay} />
              <InfoCard
                label="Working Days"
                value={workingDays.join(", ") || "Not selected"}
                colSpan
              />
            </div>
          </div>

          {/* Setup Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Setup Overview
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <OverviewCard
                label="Subjects / Courses"
                value={overview.subjects}
                icon={<IconBook />}
              />
              <OverviewCard
                label="Classes / Groups"
                value={overview.classes}
                icon={<IconUsers />}
              />
              <OverviewCard
                label="Faculty"
                value={overview.faculty}
                icon={<IconAcademicCap />}
              />
              <OverviewCard
                label="Rooms"
                value={overview.rooms}
                icon={<IconBuilding />}
              />
              <OverviewCard
                label="Total Weekly Periods"
                value={overview.totalPeriods}
                icon={<IconClock />}
              />
            </div>
          </div>
        </div>

        {/* Generate CTA and Navigation */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-sm border border-indigo-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Ready to Generate Your Timetable?
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                All your data is ready. Click the button to start the process.
              </p>
              {error && <p className="text-red-500 mt-2">Error: {error}</p>}
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              // 🎨 I've added your custom color and ensured the text is white
              className={`relative flex items-center justify-center px-6 py-3 font-medium text-white rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto sm:min-w-[220px] overflow-hidden ${
                isLoading
                  ? "bg-[#8c7df9] cursor-not-allowed" // Lighter shade for disabled state
                  : "bg-[#4f39f6] hover:bg-[#422de0] active:scale-95" // Your color + a darker hover shade
              }`}
            >
              {/* The SVG and Text are now absolutely positioned to allow for smooth cross-fading */}
              <div
                className={`transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="flex items-center">
                  {/* Default Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                    />
                  </svg>
                  <span>Generate Timetable</span>
                </div>
              </div>

              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isLoading ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* ✨ New, cleaner spinner SVG */}
                <svg
                  className="w-5 h-5 mr-3 animate-spin"
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

                {/* ✨ Animated ellipsis for a more dynamic loading text */}
                <span className="flex items-center">
                  Generating
                  <span
                    className="animate-bounce-dot"
                    style={{ animationDelay: "0ms" }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce-dot"
                    style={{ animationDelay: "150ms" }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce-dot"
                    style={{ animationDelay: "300ms" }}
                  >
                    .
                  </span>
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* JSON Data Inspector */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Store Data Inspector
            </h3>
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {showJson ? "Hide" : "Show"} Raw Data
            </button>
          </div>
          {showJson && (
            <pre className="bg-gray-900 text-white rounded-lg p-4 mt-4 overflow-x-auto text-xs">
              <code>{JSON.stringify(cleanStoreData, null, 2)}</code>
            </pre>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <Link
              to="/dashboard/timetable/new/rooms"
              className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 sm:mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                ></path>
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </Link>

            <div className="text-sm text-gray-500 text-center px-2">
              Step <span className="font-semibold text-gray-700">2</span> of{" "}
              <span className="font-semibold text-gray-700">7</span>
            </div>

            <Link
              to="/dashboard/timetable/new/review"
              className={`inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !generatedData
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={(e) => !generatedData && e.preventDefault()}
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 sm:ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewGenerate;
