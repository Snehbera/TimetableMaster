import React from "react";
import "./GeneralSettings.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useTimetableStore from "../../../../Stores/TimetableStore";

// --- SVG Icon Components --- //
const TimetableIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-indigo-600 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2 transition-transform duration-300"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2 transition-transform duration-300"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 15.75 7.5-7.5 7.5 7.5"
    />
  </svg>
);
const PlusCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);
const MinusCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-indigo-600 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);
// --- NEW ICON ---
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-indigo-600 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    />
  </svg>
);
const CheckCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);
const SunIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
    />
  </svg>
);

// --- Redesigned Days Configuration Component --- //
const DaysConfiguration = () => {
  const { timetableNames, toggleWorkingDayForTimetable } = useTimetableStore();

  // Set the first timetable as active by default, if it exists
  const [activeTab, setActiveTab] = useState(timetableNames[0]?.id);

  // Define the order of days for consistent display
  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const activeTimetable = timetableNames.find((tt) => tt.id === activeTab);

  // Handle case where timetables might be empty
  if (!activeTimetable) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center mb-4">
          <CalendarIcon />
          <h2 className="text-lg font-semibold text-gray-900">
            Working Day Configuration
          </h2>
        </div>
        <p className="text-sm text-gray-500">
          Please add a timetable name first to configure its working days.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
      <div className="flex items-center mb-4">
        <CalendarIcon />
        <h2 className="text-lg font-semibold text-gray-900">
          Working Day Configuration
        </h2>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Select the working days for each main division. You can set a different
        schedule for each.
      </p>

      {/* Tabs for each Main Division */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {timetableNames.map((tt) => (
            <button
              key={tt.id}
              onClick={() => setActiveTab(tt.id)}
              className={`${
                activeTab === tt.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none`}
            >
              {tt.name || "Untitled"}
            </button>
          ))}
        </nav>
      </div>

      {/* Day Toggles for the active tab */}
      <div className="mt-6">
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {dayOrder.map((dayKey) => {
              // ✅ Corrected Line
              const isWorking = activeTimetable?.workingDays?.[dayKey];
              return (
                <button
                  key={dayKey}
                  type="button"
                  onClick={() =>
                    toggleWorkingDayForTimetable(activeTab, dayKey)
                  }
                  className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center border text-center ${
                    isWorking
                      ? "bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <span className="font-medium">{dayKey}</span>
                  <span className="text-xs mt-1">
                    {isWorking ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <SunIcon className="w-4 h-4 text-orange-500" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total working days for{" "}
            <strong>{activeTimetable.name || "this division"}</strong>:{" "}
            <strong>
              {
                // ✅ Corrected Line
                Object.values(activeTimetable?.workingDays || {}).filter(
                  Boolean
                ).length
              }
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Timetable Names Components (MODIFIED) --- //
const TimetableNames = () => {
  const {
    timetableNames,
    addTimetableName,
    updateTimetableName,
    removeTimetableName,
    addSubdivision,
    updateSubdivision,
    removeSubdivision,
  } = useTimetableStore();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
      <div className="flex items-center mb-4">
        <TimetableIcon />
        <h2 className="text-lg font-semibold text-gray-900">
          Divisions / classNamees
        </h2>
      </div>

      {(timetableNames || []).map((timetable, index) => (
        <div
          key={timetable.id}
          className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50/50"
        >
          <div className="flex items-center space-x-2">
            <input
              placeholder="e.g., Computer Engineering"
              className="s1-input-field font-medium"
              type="text"
              value={timetable.name}
              onChange={(e) =>
                updateTimetableName(timetable.id, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeTimetableName(timetable.id)}
              className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
              disabled={(timetableNames || []).length <= 1}
              aria-label="Remove timetable name"
            >
              <MinusCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="pl-8 mt-3 space-y-2">
            {(timetable.subdivisions || []).length > 0 && (
              <label className="text-sm font-medium text-gray-600">
                Subdivisions
              </label>
            )}
            {(timetable.subdivisions || []).map((sub, subIndex) => (
              <div key={subIndex} className="flex items-center space-x-2">
                <input
                  placeholder="e.g., Section A"
                  className="s1-input-field"
                  type="text"
                  value={sub}
                  onChange={(e) =>
                    updateSubdivision(timetable.id, subIndex, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeSubdivision(timetable.id, subIndex)}
                  className="p-2 text-gray-400 hover:text-red-500"
                  aria-label="Remove subdivision"
                >
                  <MinusCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSubdivision(timetable.id)}
              className="flex items-center text-xs font-medium text-indigo-600"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Subdivision
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTimetableName}
        className="flex items-center text-sm font-medium text-indigo-600 mt-4"
      >
        <PlusCircleIcon />
        Add another division
      </button>
    </div>
  );
};

// --- Helper Functions for Time Calculation --- //
const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  if (totalMinutes === null || isNaN(totalMinutes)) return "";
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

// --- Main GeneralSettings App (MODIFIED) --- //
function GeneralSettings() {
  const {
    periodsPerDay,
    setPeriodsPerDay,
    timings,
    setTimings,
    semester, // --- ADDED ---
    setSemester, // --- ADDED ---
  } = useTimetableStore();
  const [showTimings, setShowTimings] = useState(false);

  // --- CORRECTED useEffect ---
  useEffect(() => {
    const existingPeriodsCount = (timings || []).filter(
      (t) => t.type === "period"
    ).length;
    const numPeriods = parseInt(periodsPerDay, 10) || 0;

    // Only regenerate the timings array if the number of periods has changed.
    // This prevents overwriting the stored timings on every page refresh.
    if (existingPeriodsCount === numPeriods) {
      return;
    }

    const newTimings = [];
    for (let i = 1; i <= numPeriods; i++) {
      newTimings.push({
        id: `period-${i}`,
        type: "period",
        number: i,
        startTime: "",
        endTime: "",
      });
    }
    setTimings(newTimings);
  }, [periodsPerDay, timings, setTimings]); // Added 'timings' to the dependency array

  const handlePeriodsChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setPeriodsPerDay(value);
  };

  const recalculateFromIndex = (timingsArray, startIndex) => {
    const firstPeriod = timingsArray.find((item) => item.type === "period");
    const periodDuration =
      timeToMinutes(firstPeriod?.endTime) -
      timeToMinutes(firstPeriod?.startTime);

    if (!periodDuration || periodDuration <= 0) return timingsArray;
    if (startIndex === 0 || !timingsArray[startIndex - 1]?.endTime)
      return timingsArray;

    let lastEndTime = timingsArray[startIndex - 1].endTime;
    const BREAK_DURATION = 15;
    const finalTimings = [...timingsArray];

    for (let i = startIndex; i < finalTimings.length; i++) {
      const item = finalTimings[i];
      const newStartTime = lastEndTime;

      let currentDuration;
      if (item.type === "break" && item.startTime && item.endTime) {
        const manualDuration =
          timeToMinutes(item.endTime) - timeToMinutes(item.startTime);
        currentDuration = manualDuration > 0 ? manualDuration : BREAK_DURATION;
      } else {
        currentDuration =
          item.type === "period" ? periodDuration : BREAK_DURATION;
      }

      const newEndTime = minutesToTime(
        timeToMinutes(newStartTime) + currentDuration
      );

      finalTimings[i] = {
        ...item,
        startTime: newStartTime,
        endTime: newEndTime,
      };
      lastEndTime = newEndTime;
    }
    return finalTimings;
  };

  const handleTimeChange = (id, field, value) => {
    const currentTimings = timings;
    const changedIndex = currentTimings.findIndex((item) => item.id === id);
    let newTimings = currentTimings.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    const firstPeriodId = newTimings.find((i) => i.type === "period")?.id;

    if (
      field === "endTime" ||
      (field === "startTime" && id === firstPeriodId)
    ) {
      const finalTimings = recalculateFromIndex(newTimings, changedIndex + 1);
      setTimings(finalTimings);
    } else {
      setTimings(newTimings);
    }
  };

  const addBreakAfter = (periodId) => {
    const periodIndex = timings.findIndex((item) => item.id === periodId);
    if (periodIndex === -1) return;
    const newBreak = {
      id: `break-${Date.now()}`,
      type: "break",
      startTime: "",
      endTime: "",
    };
    let newTimings = [...timings];
    newTimings.splice(periodIndex + 1, 0, newBreak);
    setTimings(recalculateFromIndex(newTimings, periodIndex + 1));
  };

  const removeBreak = (id) => {
    const currentTimings = timings;
    const breakIndex = currentTimings.findIndex((item) => item.id === id);
    if (breakIndex === -1) return;
    const newTimings = currentTimings.filter((item) => item.id !== id);
    setTimings(recalculateFromIndex(newTimings, breakIndex));
  };

  return (
    <>
      <div className="s1-main-wrapper">
        <div className="s1-content-area">
          <div className="s1-content-inner">
            {/* --- NEW SEMESTER CARD --- */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
              <div className="flex items-center mb-4">
                <InfoIcon />
                <h2 className="text-lg font-semibold text-gray-900">
                  General Information
                </h2>
              </div>
              <div>
                <label htmlFor="semester" className="s1-label">
                  Semester / Term Name
                </label>
                <input
                  id="semester"
                  placeholder="e.g., Semester 3"
                  className="s1-input-field"
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
            </div>

            <TimetableNames />

            <div className="s1-card shadow-sm mb-5">
              <div className="s1-card-header s1-mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="s1-card-icon-main"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  ></path>
                </svg>
                <h2 className="s1-card-title">Time Settings</h2>
              </div>
              <div className="s1-grid-col-1 s1-gap-6 s1-mb-6">
                <div>
                  <label className="s1-label">Periods Per Day</label>
                  <input
                    className="s1-input-field"
                    id="periodsPerDay"
                    type="number"
                    min="0"
                    value={periodsPerDay}
                    onChange={handlePeriodsChange}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTimings(!showTimings)}
                className="s1-link-button s1-mb-4"
              >
                {showTimings ? <ChevronUpIcon /> : <ChevronDownIcon />}
                {showTimings ? "Hide" : "Show"} Period &amp; Break Timings
              </button>

              {showTimings && (
                <div className="border-t border-gray-200 pt-6 bg-gray-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-8">
                    Set up your periods and breaks. The duration of periods will
                    try to stay consistent.
                  </p>
                  <div className="space-y-4">
                    {(timings || []).map((item) => {
                      if (item.type === "period") {
                        const currentPeriodIndex = (timings || []).findIndex(
                          (p) => p.id === item.id
                        );
                        const hasBreakAfter =
                          (timings || [])[currentPeriodIndex + 1]?.type ===
                          "break";
                        return (
                          <div key={item.id}>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                              <label className="w-24 text-sm font-medium text-gray-700">
                                Period {item.number}
                              </label>
                              <div className="relative flex-1">
                                <input
                                  type="time"
                                  value={item.startTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      item.id,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white border-gray-200 rounded-lg p-2.5 text-center text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                />
                              </div>
                              <span className="text-gray-400">-</span>
                              <div className="relative flex-1">
                                <input
                                  type="time"
                                  value={item.endTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      item.id,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white border-gray-200 rounded-lg p-2.5 text-center text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            {!hasBreakAfter && item.number < periodsPerDay && (
                              <div className="flex justify-center mt-3">
                                <button
                                  onClick={() => addBreakAfter(item.id)}
                                  className="flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors duration-200"
                                >
                                  <PlusCircleIcon />
                                  Add Break After Period {item.number}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      } else if (item.type === "break") {
                        return (
                          <div key={item.id}>
                            <div className="flex items-center space-x-2 sm:space-x-4 bg-blue-50/50 p-3 rounded-lg">
                              <label className="w-24 text-sm font-medium text-blue-800">
                                Break
                              </label>
                              <div className="relative flex-1">
                                <input
                                  type="time"
                                  value={item.startTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      item.id,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white border-gray-200 rounded-lg p-2.5 text-center text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                />
                              </div>
                              <span className="text-gray-400">-</span>
                              <div className="relative flex-1">
                                <input
                                  type="time"
                                  value={item.endTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      item.id,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-white border-gray-200 rounded-lg p-2.5 text-center text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex justify-center mt-3">
                              <button
                                onClick={() => removeBreak(item.id)}
                                className="flex items-center text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors duration-200"
                              >
                                <MinusCircleIcon />
                                Remove Break
                              </button>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <DaysConfiguration />

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <div className="flex justify-between items-center">
                <Link
                  to=""
                  className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-not-allowed"
                  data-discover="true"
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
                    ></path>
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </Link>

                <div className="text-sm text-gray-500 text-center px-2">
                  Step <span className="font-semibold text-gray-700">2</span> of{" "}
                  <span className="font-semibold text-gray-700">7</span>
                </div>

                <Link
                  to="/dashboard/timetable/new/subjects"
                  className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  aria-disabled="false"
                  data-discover="true"
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
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneralSettings;
