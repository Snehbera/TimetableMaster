import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useTimetableStore from "../../../../Stores/TimetableStore";

// --- SVG Icon Components ---
const PresentationChartBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-indigo-600"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H6.75m11.25 0h1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h.008v.016m0 0h.008v.016m0 0h.008v.016m0 0h.008v.016m10.5-11.25h.008v.016m0 0h.008v.016m0 0h.008v.016m0 0h.008v.016m-4.5-1.5h.008v.016m0 0h.008v.016m0 0h.008v.016m0 0h.008v.016m-4.5-1.5h.008v.016m0 0h.008v.016m0 0h.008v.016m0 0h.008v.016"
    />{" "}
  </svg>
);
const PrevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    className="h-5 w-5 mr-2"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />{" "}
  </svg>
);
const NextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    className="h-5 w-5 ml-2"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
    />{" "}
  </svg>
);

// --- Interactive Number Stepper Component --- //
const NumberStepper = ({ value, onValueChange }) => (
  <div className="flex items-center">
    <button
      type="button"
      onClick={() => onValueChange(value - 1)}
      className="px-2.5 py-1.5 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100"
    >
      {" "}
      -{" "}
    </button>
    <span className="px-4 py-1.5 border-t border-b border-gray-300 text-center w-12">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onValueChange(value + 1)}
      className="px-2.5 py-1.5 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100"
    >
      {" "}
      +{" "}
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
  const { subjects, updateSubjectValue, toggleSubjectDoubleSlot } =
    useTimetableStore();

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
                Set the number of lectures and labs per week for each subject.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-gray-50/70 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="w-full md:w-1/3">
                  <p className="font-semibold text-gray-800">{subject.name}</p>

                  <p className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">
                    {subject.shortName}
                  </p>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        updateSubjectValue(subject.id, "labsPerWeek", newValue)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-start space-x-3">
                    <label className="text-sm font-medium text-gray-700">
                      Double Slot Lecture
                    </label>

                    <ToggleSwitch
                      enabled={subject.isDoubleSlot}
                      onToggle={() => toggleSubjectDoubleSlot(subject.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <Link
              type="button"
              to="/dashboard/timetable/new/faculty"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <PrevIcon /> Previous
            </Link>

            <div className="text-sm text-gray-500">
              Step <span className="font-semibold text-gray-700">4</span> of 7
            </div>

            <Link
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Next <NextIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
