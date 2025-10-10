import React, { useEffect } from "react";
import useTimetableStore from "../../../../Stores/TimetableStore";
import { Link } from "react-router-dom";

// --- SVG Icon Components ---
const PresentationChartBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-5 w-5 mr-2 text-indigo-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
    />
  </svg>
);

const InfoIcon = ({ className = "" }) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 416.979 416.979"
    xml:space="preserve"
    className={className}
    fill="currentColor"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g>
        {" "}
        <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path>{" "}
      </g>{" "}
    </g>
  </svg>
);

const CalculatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6 mr-2 text-indigo-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

// --- Interactive Number Stepper Component --- //
const NumberStepper = ({ value, onValueChange }) => (
  <div className="flex items-center">
    <button
      type="button"
      onClick={() => onValueChange(Math.max(0, value - 1))}
      className="px-2.5 py-1.5 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100"
    >
      -
    </button>
    <span className="px-4 py-1.5 border-t border-b border-gray-300 text-center w-12">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onValueChange(value + 1)}
      className="px-2.5 py-1.5 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100"
    >
      +
    </button>
  </div>
);

// --- Toggle Switch Component for double slot --- //
const ToggleSwitch = ({ enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`${
      enabled ? "bg-indigo-600" : "bg-gray-200"
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
  >
    <span
      className={`${
        enabled ? "translate-x-5" : "translate-x-0"
      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);

// --- Main Classes App --- //
export default function Classes() {
  const {
    subjects,
    updateSubjectValue,
    toggleSubjectDoubleSlot,
    weeklyTotals,
    calculateWeeklyTotals,
  } = useTimetableStore();

  useEffect(() => {
    calculateWeeklyTotals();
  }, [subjects, calculateWeeklyTotals]);

  return (
    <div className="font-sans flex items-center justify-center p-6">
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <PresentationChartBarIcon />
                Classes & Labs Configuration
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Set lectures/labs per week. Double slot lectures count as 2
                hours, labs are 2 hours.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {subjects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-3">
                <InfoIcon className="h-10 w-10 mx-auto text-blue-400" />
                <h3 className="text-sm font-medium text-gray-900">
                  No Subjects Found
                </h3>
                <p className="text-sm text-gray-500">
                  Please add subjects in the 'Subjects' step to continue.
                </p>
              </div>
            ) : (
              subjects.map((subject) => {
                // --- MODIFIED CALCULATION ---
                const lectureHours = subject.isDoubleSlot
                  ? subject.lecturesPerWeek * 2
                  : subject.lecturesPerWeek;
                const labHours = subject.labsPerWeek * 2;
                const subjectTotalHours = lectureHours + labHours;

                return (
                  <div
                    key={subject.id}
                    className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="w-full md:w-1/4">
                      <p className="font-semibold text-gray-800">
                        {subject.name}
                      </p>
                      <p className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">
                        {subject.shortName}
                      </p>
                    </div>

                    <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center justify-between sm:justify-start space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          Lectures / week
                        </label>
                        <NumberStepper
                          value={subject.lecturesPerWeek}
                          onValueChange={(newValue) =>
                            updateSubjectValue(
                              subject.id,
                              "lecturesPerWeek",
                              newValue
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-start space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          Labs / week
                        </label>
                        <NumberStepper
                          value={subject.labsPerWeek}
                          onValueChange={(newValue) =>
                            updateSubjectValue(
                              subject.id,
                              "labsPerWeek",
                              newValue
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-start space-x-3">
                        <label className="text-sm font-medium text-gray-700">
                          Double Slot
                        </label>
                        <ToggleSwitch
                          enabled={subject.isDoubleSlot}
                          onToggle={() => toggleSubjectDoubleSlot(subject.id)}
                        />
                      </div>

                      <div className="flex items-center justify-between sm:justify-start space-x-3 bg-indigo-50 p-2 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Total Hours
                        </span>
                        <span className="font-bold text-gray-600 text-lg">
                          {subjectTotalHours}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {subjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <CalculatorIcon />
              Weekly Hours Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Total Lecture Hours
                </p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {weeklyTotals.totalLectureHours}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Total Lab Hours
                </p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {weeklyTotals.totalLabHours}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Grand Total Weekly Hours
                </p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {weeklyTotals.grandTotalHours}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <Link
              to="/dashboard/timetable/new/faculty"
              className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="h-5 w-5 sm:mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </Link>

            <div className="text-sm text-gray-500 text-center px-2">
              Step <span className="font-semibold text-gray-700">4</span> of{" "}
              <span className="font-semibold text-gray-700">7</span>
            </div>

            <Link
              to="/dashboard/timetable/new/rooms"
              className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="h-5 w-5 sm:ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
