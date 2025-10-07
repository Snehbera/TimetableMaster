import React, { useState } from "react";
import useTimetableStore from "../../../../Stores/TimetableStore";

const ReviewGenerate = () => {
  // Get all data from the store
  const store = useTimetableStore();

  // Add state for API communication
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { timetableNames, days, periodsPerDay, subjects, faculty, rooms } =
    useTimetableStore();

  // --- CHANGE 1: Get all timetable names ---
  // Map through the array to get each name, then join them into a single string.
  const allTimetableDisplayNames =
    timetableNames.map((tt) => tt.name).join(", ") || "Untitled";

  const workingDays = days.filter((d) => d.isSchoolDay).map((d) => d.fullName);

  const overview = {
    subjects: subjects.length,
    // --- CHANGE 2: Calculate total classes from ALL timetables ---
    // Use reduce to sum up the subdivisions from every timetable entry.
    classes: timetableNames.reduce(
      (acc, tt) => acc + (tt.subdivisions || []).filter(Boolean).length,
      0
    ),
    teachers: faculty.length,
    rooms: rooms.length,
    lessons: subjects.reduce(
      (acc, sub) => acc + (sub.lecturesPerWeek || 0) + (sub.labsPerWeek || 0),
      0
    ),
    totalPeriods: subjects.reduce(
      (acc, sub) => acc + (sub.lecturesPerWeek || 0) + (sub.labsPerWeek || 0),
      0
    ),
  };

  // Create the function to handle the API call
  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);

    // Prepare the payload object with all the data
    const payload = {
      timetableNames: store.timetableNames,
      days: store.days,
      periodsPerDay: store.periodsPerDay,
      subjects: store.subjects,
      faculty: store.faculty,
      rooms: store.rooms,
      // You can add any other relevant data from your store here
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle HTTP errors like 404 or 500
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Success! Response from Django:", result);

      // TODO: Here is where you would store the result and navigate to the next step
      // For example, you might have another function in your Zustand store:
      // store.setGeneratedTimetable(result);
      // history.push('/next-step'); // (if using React Router)

      alert(
        "Timetable generated successfully! Check the console for the response."
      );
    } catch (err) {
      console.error("❌ Error sending data to Django:", err);
      setError(err.message);
      alert("Failed to generate timetable. See console for details.");
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
              {/* --- CHANGE 3: Display all names and update the label --- */}
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

          {/* ... The rest of your component remains the same ... */}

          {/* Setup Overview */}
          <div className="pb-4 sm:pb-6">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2 sm:mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                ></path>
              </svg>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Setup Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <OverviewCard
                label="Subjects / Courses"
                value={overview.subjects}
              />
              <Classes label="Classes / Groups" value={overview.classes} />
              <Faculty label="Faculty" value={overview.teachers} />
              <Rooms label="Rooms" value={overview.rooms} />
              <OverviewCard
                label="Total Lesson Periods (including double, triple)"
                value={overview.totalPeriods}
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
              {/* Display error messages */}
              {error && <p className="text-red-500 mt-2">Error: {error}</p>}
            </div>

            {/* 5. Update the button's onClick and disabled state */}
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className={`flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-white font-medium rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                  isLoading ? "animate-spin" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {/* Conditionally render icon based on loading state */}
                {isLoading ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.006h-4.992a8.25 8.25 0 01-11.667 0c0 0 0 0 0 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                )}
              </svg>
              {/* Change button text while loading */}
              <span>{isLoading ? "Generating..." : "Generate Timetable"}</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Previous
            </button>
            <div className="text-xs sm:text-sm text-gray-500 text-center">
              Step <span className="font-semibold text-gray-700">7</span> of{" "}
              <span className="font-semibold text-gray-700">7</span>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md shadow-sm bg-gray-400 text-white cursor-not-allowed"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Card and Overview Card components remain the same
const InfoCard = ({ label, value, colSpan }) => (
  <div
    className={`bg-gray-50 p-3 sm:p-4 rounded-lg ${
      colSpan ? "sm:col-span-2" : ""
    }`}
  >
    <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-medium text-gray-800 text-sm sm:text-base">{value}</p>
  </div>
);

const OverviewCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm flex items-center space-x-3 sm:space-x-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      ></path>
    </svg>
    <div>
      <span className="block text-lg sm:text-xl font-bold text-indigo-600">
        {value}
      </span>
      <span className="block text-xs sm:text-sm text-gray-700">{label}</span>
    </div>
  </div>
);

const Classes = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm flex items-center space-x-3 sm:space-x-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      ></path>
    </svg>
    <div>
      <span className="block text-lg sm:text-xl font-bold text-indigo-600">
        {value}
      </span>
      <span className="block text-xs sm:text-sm text-gray-700">{label}</span>
    </div>
  </div>
);

const Faculty = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm flex items-center space-x-3 sm:space-x-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      ></path>
    </svg>
    <div>
      <span className="block text-lg sm:text-xl font-bold text-indigo-600">
        {value}
      </span>
      <span className="block text-xs sm:text-sm text-gray-700">{label}</span>
    </div>
  </div>
);

const Rooms = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm flex items-center space-x-3 sm:space-x-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
      ></path>
    </svg>
    <div>
      <span className="block text-lg sm:text-xl font-bold text-indigo-600">
        {value}
      </span>
      <span className="block text-xs sm:text-sm text-gray-700">{label}</span>
    </div>
  </div>
);

export default ReviewGenerate;
