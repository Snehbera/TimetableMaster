import React from "react";
import "./GeneralSettings.css";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useTimetableStore from '../../../../Stores/TimetableStore';

// --- SVG Icon Components --- //
// Using components for icons makes the main JSX cleaner
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
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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

// --- Days Configuration Component --- //
const DaysConfiguration = () => {
  const [days, setDays] = useState([
    { name: "Sun", fullName: "Sunday", isSchoolDay: false },
    { name: "Mon", fullName: "Monday", isSchoolDay: true },
    { name: "Tue", fullName: "Tuesday", isSchoolDay: true },
    { name: "Wed", fullName: "Wednesday", isSchoolDay: true },
    { name: "Thu", fullName: "Thursday", isSchoolDay: true },
    { name: "Fri", fullName: "Friday", isSchoolDay: true },
    { name: "Sat", fullName: "Saturday", isSchoolDay: true },
  ]);

  const toggleDay = (dayName) => {
    setDays((currentDays) =>
      currentDays.map((day) =>
        day.name === dayName ? { ...day, isSchoolDay: !day.isSchoolDay } : day
      )
    );
  };

  const schoolDays = days.filter((d) => d.isSchoolDay);
  const daysOff = days.filter((d) => !d.isSchoolDay);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex flex-col xs:flex-row items-start xs:items-center mb-4">
        <div className="s1-card-header s1-mb-3">
          <CalendarIcon />
          <h2 className="s1-card-title">Days Configuration</h2>
        </div>
        <span className="xs:ml-3 text-sm text-gray-500">
          ({schoolDays.length} school days selected)
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3">
        Select which days are school days. The remaining days will be considered
        days off.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-6">
        {days.map((day) => (
          <button
            key={day.name}
            type="button"
            onClick={() => toggleDay(day.name)}
            className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center border text-center ${
              day.isSchoolDay
                ? "bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-500"
            }`}
          >
            <span className="font-medium">{day.name}</span>
            <span className="text-xs mt-1">
              {day.isSchoolDay ? (
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              ) : (
                <SunIcon className="w-4 h-4 text-orange-500" />
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            School Days
          </h3>
          <div className="flex flex-wrap gap-2">
            {schoolDays.length > 0 ? (
              schoolDays.map((day) => (
                <div
                  key={day.fullName}
                  className="flex items-center px-3 py-1.5 bg-white rounded-md border border-green-200"
                >
                  <span className="font-medium text-gray-700 text-sm">
                    {day.fullName}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No school days selected.</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
            <SunIcon className="w-5 h-5 text-orange-500 mr-2" />
            Days Off
          </h3>
          <div className="flex flex-wrap gap-2">
            {daysOff.length > 0 ? (
              daysOff.map((day) => (
                <div
                  key={day.fullName}
                  className="flex items-center px-3 py-1.5 bg-white rounded-md border border-gray-200"
                >
                  <span className="font-medium text-gray-700 text-sm">
                    {day.fullName}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No days off selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Timetable Names Components --- //
const TimetableNames = () => {
  const [names, setNames] = useState(["Untitled"]);

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addName = () => {
    setNames([...names, ""]);
  };

  const removeName = (index) => {
    if (names.length > 1) {
      setNames(names.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center mb-4">
        <TimetableIcon />
        <h2 className="text-lg font-semibold text-gray-900">Timetable Names</h2>
      </div>
      <div className="space-y-3">
        {names.map((name, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              placeholder="e.g., Grade 5, Section A"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeName(index)}
              className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              disabled={names.length <= 1}
              aria-label="Remove name"
            >
              <MinusCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addName}
        className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mt-4"
      >
        <PlusCircleIcon />
        Add another timetable name
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

function GeneralSettings() {
  // const [periodsPerDay, setPeriodsPerDay] = useState(6);
 const { 
    periodsPerDay, 
    setPeriodsPerDay, 
    timings, 
    setTimings 
  } = useTimetableStore();

  const [showTimings, setShowTimings] = useState(false);
  // const [timings, setTimings] = useState([]);

  useEffect(() => {
    // This logic remains the same, but now it calls the store's action
    const newTimings = [];
    const numPeriods = parseInt(periodsPerDay, 10) || 0;

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
  }, [periodsPerDay]);

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
    // Logic is refactored to not use a state updater callback
    const currentTimings = timings; // Get current timings from the store
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
      setTimings(finalTimings); // Update the store with the final array
    } else {
      setTimings(newTimings); // Update the store
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
    setTimings(recalculateFromIndex(newTimings, periodIndex + 1)); // Update the store
  };

  const removeBreak = (id) => {
    const currentTimings = timings; // Get current timings from the store
    const breakIndex = currentTimings.findIndex((item) => item.id === id);
    if (breakIndex === -1) return;
    const newTimings = currentTimings.filter((item) => item.id !== id);
    setTimings(recalculateFromIndex(newTimings, breakIndex)); // Update the store
  };

  return (
    <>
      <div className="s1-main-wrapper">
        <div className="s1-content-area">
          <div className="s1-content-inner">
            <TimetableNames />

            <div className="s1-card">
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
                    {timings.map((item) => {
                      if (item.type === "period") {
                        const currentPeriodIndex = timings.findIndex(
                          (p) => p.id === item.id
                        );
                        const hasBreakAfter =
                          timings[currentPeriodIndex + 1]?.type === "break";
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

            <div className="s1-navigation-container">
              <div className="s1-navigation-inner">
                <button
                  disabled=""
                  type="button"
                  className="s1-nav-button s1-nav-button-disabled"
                  aria-disabled="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="s1-nav-button-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    ></path>
                  </svg>
                  Previous
                </button>
                <div className="s1-step-indicator">
                  Step <span className="s1-step-current">1</span> of{" "}
                  <span className="s1-step-total">7</span>
                </div>
                <Link
                  to="/dashboard/timetable/new/subjects"
                  className="s1-nav-button s1-nav-button-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="s1-nav-button-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                    ></path>
                  </svg>
                  Next
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
