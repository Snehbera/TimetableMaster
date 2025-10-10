import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import useTimetableStore from "../../../../Stores/TimetableStore";

// --- SVG Icon Components (No Changes) ---
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const CalendarIcon = ({ className = "w-3.5 h-3.5 mr-1 text-green-600" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);
const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    className="w-3 h-3 ml-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-5 h-5 inline-block"
  >
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
      clipRule="evenodd"
    />
  </svg>
);
const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="h-4 w-4 mr-2"
  >
    <path
      fillRule="evenodd"
      d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);
const ImportIcon = ({ className = "h-4 w-4 mr-2" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="h-4 w-4 mr-2"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
      clipRule="evenodd"
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
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-4 h-4 inline-block"
  >
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
      clipRule="evenodd"
    />
  </svg>
);
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-4 h-4 inline-block"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

// --- NEW: Time Formatting Helper Function ---
const formatTime12h = (timeString) => {
  if (!timeString) return "";
  const [hourString, minute] = timeString.split(":");
  const hour = parseInt(hourString, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const convertedHour = hour % 12 || 12; // Converts "0" to "12"
  return `${convertedHour.toString().padStart(2, "0")}:${minute} ${suffix}`;
};

// --- Availability Modal --- //
const AvailabilityModal = ({ subject, onClose, onSave }) => {
  const { timings, days } = useTimetableStore();
  const [grid, setGrid] = useState([]);

  // Wrap the definitions in useMemo to prevent re-creation on every render
  const schoolDays = useMemo(
    () => (days || []).filter((day) => day.isSchoolDay),
    [days]
  );

  const periodsOnly = useMemo(
    () => (timings || []).filter((timeSlot) => timeSlot.type === "period"),
    [timings]
  );

  useEffect(() => {
    if (periodsOnly.length === 0 || schoolDays.length === 0) return;

    const numPeriods = periodsOnly.length;
    const numDays = schoolDays.length;

    const isGridValid =
      subject.availability &&
      subject.availability.length === numPeriods &&
      subject.availability[0]?.length === numDays;

    if (isGridValid) {
      setGrid(JSON.parse(JSON.stringify(subject.availability)));
    } else {
      const newGrid = Array(numPeriods)
        .fill(null)
        .map(() => Array(numDays).fill(true));
      setGrid(newGrid);
    }
  }, [periodsOnly, schoolDays, subject.availability]);

  const toggleCell = (periodIndex, dayIndex) => {
    setGrid((currentGrid) =>
      currentGrid.map((row, pIndex) => {
        if (pIndex !== periodIndex) {
          return row;
        }
        return row.map((cell, dIndex) => {
          if (dIndex !== dayIndex) {
            return cell;
          }
          return !cell;
        });
      })
    );
  };

  const toggleDay = (dayIndex) => {
    setGrid((currentGrid) =>
      currentGrid.map((row) =>
        row.map((cell, dIndex) => (dIndex === dayIndex ? !cell : cell))
      )
    );
  };

  const togglePeriod = (periodIndex) => {
    setGrid((currentGrid) =>
      currentGrid.map((row, pIndex) =>
        pIndex === periodIndex ? row.map((cell) => !cell) : row
      )
    );
  };

  const handleClose = () => {
    onSave(subject.id, grid);
    onClose();
  };

  if (!subject) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-h-[90vh] flex flex-col relative mx-4 max-w-4xl">
        <div className="p-6 pb-3">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close Availability Modal"
          >
            <CloseIcon />
          </button>
          <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
            Manage Availability for {subject.name}
          </h2>
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm">
            <div className="flex">
              <InfoIcon className="h-10 w-10 mx-auto text-blue-400" />
              <div>
                <p className="text-blue-700">
                  Mark periods when <strong>{subject.name}</strong> is{" "}
                  <strong>not available</strong> for scheduling.
                </p>
                <ul className="mt-1 text-blue-600 list-disc pl-4">
                  <li>Click any cell to toggle its availability status</li>
                  <li>
                    Click a day name (column header) to toggle the entire day
                  </li>
                  <li>
                    Click a period (row header) to toggle the entire period
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-green-200 mr-2 text-green-800 font-bold rounded">
                <CheckIcon />
              </span>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-red-200 mr-2 text-red-800 font-bold rounded">
                <CrossIcon />
              </span>
              <span className="text-sm text-gray-700">Time Off</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex-grow overflow-hidden">
          <div className="overflow-auto max-h-[calc(90vh-20rem)] border rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="border px-2 py-2 text-left bg-gray-100 min-w-[140px] w-[140px] text-sm font-semibold">
                    Period/Day
                  </th>
                  {schoolDays.map((day, dayIndex) => (
                    <th
                      key={day.name}
                      onClick={() => toggleDay(dayIndex)}
                      className="border px-2 py-2 text-center cursor-pointer hover:bg-gray-200 transition-colors relative group min-w-[120px] w-[120px]"
                      title="Click to toggle entire column"
                    >
                      {day.fullName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.length > 0 &&
                  periodsOnly.map((period, periodIndex) => (
                    <tr key={period.id}>
                      <td
                        onClick={() => togglePeriod(periodIndex)}
                        className="border px-2 py-2 font-semibold cursor-pointer hover:bg-gray-100 transition-colors relative group min-w-[140px] w-[140px] bg-gray-50"
                        title="Click to toggle entire row"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-semibold truncate">
                            Period {period.number}
                          </span>
                          <span className="text-xs text-gray-500 font-normal">
                            {period.startTime && period.endTime
                              ? `${formatTime12h(
                                  period.startTime
                                )} - ${formatTime12h(period.endTime)}`
                              : "Not set"}
                          </span>
                        </div>
                      </td>
                      {schoolDays.map((_, dayIndex) => (
                        <td
                          key={dayIndex}
                          onClick={() => toggleCell(periodIndex, dayIndex)}
                          className={`border px-2 py-2 text-center cursor-pointer transition-all duration-200 min-w-[120px] w-[120px] ${
                            grid[periodIndex]?.[dayIndex]
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                          title={
                            grid[periodIndex]?.[dayIndex]
                              ? "Available"
                              : "Time Off"
                          }
                        >
                          {grid[periodIndex]?.[dayIndex] ? (
                            <CheckIcon />
                          ) : (
                            <CrossIcon />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end items-center px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Bulk Import Modal for Subjects--- //
const BulkImportModal = ({ isOpen, onClose, onImport }) => {
  const [importType, setImportType] = useState("csv"); // 'csv' or 'text'
  const [textInput, setTextInput] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const lines = csvData
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (lines.length > 0) {
          if (lines[0].toLowerCase().includes("subject")) lines.shift();
          setTextInput(lines.join("\n"));
        }
      };
      reader.readAsText(file);
    }
  };

  const subjectsToImport = textInput
    .split("\n")
    .filter((line) => line.trim() !== "") // Filter out empty lines
    .map((line) => {
      const parts = line.split(" - ");
      if (parts.length > 1) {
        // Handle "ShortName - FullName" format
        const shortName = parts[0].trim();
        const name = parts.slice(1).join(" - ").trim(); // Join the rest in case the name itself has a hyphen
        return { shortName, name };
      }
      // Fallback for lines without the separator
      return { shortName: "", name: line.trim() };
    });

  const handleImport = () => {
    onImport(subjectsToImport); // Pass the array of objects
    onClose();
  };

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Subject Name\nMath\nScience\nHistory";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_subjects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Import Subjects/Courses
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Add all subjects or courses you want to include in your timetable.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close Import Modal"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setImportType("csv")}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                importType === "csv"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center mb-1">
                <ImportIcon />
                <span className="font-medium text-sm">CSV File Import</span>
                <span className="ml-2 bg-green-100 text-green-600 text-xs font-medium rounded-full px-2 py-0.5">
                  RECOMMENDED
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Upload from Excel, Google Sheets, or any CSV file
              </div>
            </button>
            <button
              onClick={() => setImportType("text")}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                importType === "text"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-medium text-sm ml-6">Text Import</span>
              </div>
              <div className="text-xs text-gray-600 ml-6">
                Paste names directly, one per line
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {importType === "csv" && (
            <div>
              <div className="mb-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <InfoIcon className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="text-xs font-medium text-blue-800">
                      How to Export from Excel or Google Sheets
                    </h3>
                    <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
                      <li>
                        • <strong>Excel:</strong> File → Save As → Choose "CSV
                        (Comma delimited)" format
                      </li>
                      <li>
                        • <strong>Google Sheets:</strong> File → Download →
                        Comma-separated values (.csv)
                      </li>
                      <li>
                        • Your CSV should have a column with subjects names
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center text-sm">
                    <ImportIcon className="h-4 w-4 mr-2 text-gray-600" />
                    Step 1: Download Sample
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Download a sample CSV to see the expected format.
                  </p>
                  <button
                    onClick={handleDownloadSample}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ImportIcon className="h-3 w-3 mr-1.5" />
                    Download Sample
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center text-sm">
                    <ImportIcon className="h-4 w-4 mr-2 text-indigo-600" />
                    Step 2: Upload Your CSV
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Select your CSV file with subjects data.
                  </p>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ImportIcon className="h-3 w-3 mr-1.5" />
                    Select CSV File
                  </button>
                  <input
                    ref={fileInputRef}
                    accept=".csv"
                    className="hidden"
                    type="file"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
              {fileName && (
                <p className="text-xs text-gray-600 mt-2">
                  Selected file: <span className="font-medium">{fileName}</span>
                  . Ready to import {subjectsToImport.length} subjects.
                </p>
              )}
            </div>
          )}
          {importType === "text" && (
            <div>
              <label
                htmlFor="text-import"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Enter subjects names (one per line):
              </label>
              <textarea
                id="text-import"
                rows="8"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="OS - Operating System&#10;SE - Software Engineering..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                {subjectsToImport.length} subjects ready to import.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            {subjectsToImport.length > 0
              ? `${subjectsToImport.length} subjects selected`
              : "Select a CSV file or paste text to continue"}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={subjectsToImport.length === 0}
              className="px-4 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Import {subjectsToImport.length} subjects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Subjects App --- //
export default function Subjects() {
  const {
    subjects,
    timings,
    days,
    addSubject,
    removeSubject,
    updateSubjectName,
    updateSubjectShortName,
    sortSubjects,
    bulkImportSubjects,
    updateSubjectAvailability,
  } = useTimetableStore();

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const areAllFieldsValid = useMemo(() => {
    if (subjects.length === 0) return false;
    return subjects.every(
      (subject) => subject.name.trim() !== "" && subject.shortName.trim() !== ""
    );
  }, [subjects]);

  const calculateAvailability = (availabilityGrid, periods, days) => {
    const schoolDays = (days || []).filter((d) => d.isSchoolDay);
    const periodsOnly = (periods || []).filter((p) => p.type === "period");

    if (
      !availabilityGrid ||
      periodsOnly.length === 0 ||
      schoolDays.length === 0 ||
      availabilityGrid.length !== periodsOnly.length ||
      availabilityGrid[0].length !== schoolDays.length
    ) {
      return { percentOff: 0, isAllAvailable: true };
    }

    const totalSlots = periodsOnly.length * schoolDays.length;
    const offSlots = availabilityGrid
      .flat()
      .filter((isAvailable) => !isAvailable).length;

    if (offSlots === 0) {
      return { percentOff: 0, isAllAvailable: true };
    }

    const percentOff = Math.round((offSlots / totalSlots) * 100);
    return { percentOff, isAllAvailable: false };
  };

  const renderAvailabilityBadge = (subject) => {
    const { percentOff, isAllAvailable } = calculateAvailability(
      subject.availability,
      timings,
      days
    );
    return isAllAvailable ? (
      <div
        onClick={() => setEditingSubject(subject)}
        className="inline-flex items-center space-x-1 cursor-pointer px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition group shadow-sm border border-green-200"
        title="Click to manage Availability configuration"
      >
        <CalendarIcon />
        <span>All Available</span>
        <PencilIcon />
      </div>
    ) : (
      <div
        onClick={() => setEditingSubject(subject)}
        className="inline-flex items-center space-x-1 cursor-pointer px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition group shadow-sm border border-red-200"
        title="Click to manage Availability configuration"
      >
        <CalendarIcon className="w-3.5 h-3.5 mr-1 text-red-600" />
        <span>{percentOff}% Off</span>
        <PencilIcon />
      </div>
    );
  };

  return (
    <>
      <div className="font-sans flex items-center justify-center p-4 md:p-6">
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpenIcon />
                  Subjects/Courses
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add all the subjects or courses you want to schedule.
                </p>
              </div>
            </div>

            <div>
              {subjects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-3">
                  <InfoIcon className="h-10 w-10 mx-auto text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-900">
                    No subjects added yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get started by adding your first subject.
                  </p>
                </div>
              ) : (
                <>
                  {/* --- RESPONSIVE CHANGE: DESKTOP TABLE (hidden on mobile) --- */}
                  <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/5">
                            Short Name / Full Name
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                            Availability
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subjects.map((subject) => {
                          const isShortNameInvalid =
                            subject.shortName.trim() === "";
                          const isNameInvalid = subject.name.trim() === "";
                          return (
                            <tr
                              key={subject.id}
                              className="hover:bg-gray-50"
                              style={{
                                borderLeft: `4px solid ${subject.color}`,
                                backgroundColor: `${subject.color}10`,
                              }}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <input
                                    placeholder="e.g., APY"
                                    className={`w-1/4 p-2 border rounded-lg focus:ring-2 focus:outline-none font-medium ${
                                      isShortNameInvalid
                                        ? "border-red-400 ring-red-300"
                                        : "border-gray-300 focus:ring-indigo-500"
                                    }`}
                                    type="text"
                                    value={subject.shortName}
                                    onChange={(e) =>
                                      updateSubjectShortName(
                                        subject.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    placeholder="e.g., Advanced Python Programming"
                                    className={`w-3/4 p-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                      isNameInvalid
                                        ? "border-red-400 ring-red-300"
                                        : "border-gray-300 focus:ring-indigo-500"
                                    }`}
                                    type="text"
                                    value={subject.name}
                                    onChange={(e) =>
                                      updateSubjectName(
                                        subject.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {renderAvailabilityBadge(subject)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-600 focus:outline-none"
                                  aria-label="Remove Subject"
                                  onClick={() => removeSubject(subject.id)}
                                >
                                  <TrashIcon />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* --- RESPONSIVE CHANGE: MOBILE CARDS (visible only on mobile) --- */}
                  <div className="space-y-4 md:hidden">
                    {subjects.map((subject) => {
                      const isShortNameInvalid =
                        subject.shortName.trim() === "";
                      const isNameInvalid = subject.name.trim() === "";
                      return (
                        <div
                          key={subject.id}
                          className="p-4 border rounded-lg"
                          style={{
                            borderLeft: `4px solid ${subject.color}`,
                            backgroundColor: `${subject.color}10`,
                          }}
                        >
                          {/* Short/Full Name Section */}
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase">
                              Short Name / Full Name
                            </label>
                            <input
                              placeholder="e.g., APY"
                              className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none font-medium ${
                                isShortNameInvalid
                                  ? "border-red-400 ring-red-300"
                                  : "border-gray-300 focus:ring-indigo-500"
                              }`}
                              type="text"
                              value={subject.shortName}
                              onChange={(e) =>
                                updateSubjectShortName(
                                  subject.id,
                                  e.target.value
                                )
                              }
                            />
                            <input
                              placeholder="e.g., Advanced Python Programming"
                              className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                isNameInvalid
                                  ? "border-red-400 ring-red-300"
                                  : "border-gray-300 focus:ring-indigo-500"
                              }`}
                              type="text"
                              value={subject.name}
                              onChange={(e) =>
                                updateSubjectName(subject.id, e.target.value)
                              }
                            />
                          </div>
                          {/* Availability Section */}
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <label className="block text-xs font-medium text-gray-500 uppercase">
                              Availability
                            </label>
                            {renderAvailabilityBadge(subject)}
                          </div>
                          {/* Actions Section */}
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <label className="block text-xs font-medium text-gray-500 uppercase">
                              Action
                            </label>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-600 focus:outline-none"
                              aria-label="Remove Subject"
                              onClick={() => removeSubject(subject.id)}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* --- RESPONSIVE CHANGE: ACTION BUTTONS --- */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-4 mt-6">
              <button
                type="button"
                onClick={sortSubjects}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                <SortIcon />
                Sort A-Z
              </button>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ImportIcon />
                Bulk Import
              </button>
              <button
                type="button"
                onClick={addSubject}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <AddIcon />
                Add Subject
              </button>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 mt-6">
            <div class="flex justify-between items-center">
              <Link
                to="/dashboard/timetable/new"
                class="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                data-discover="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 sm:mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  ></path>
                </svg>
                <span class="hidden sm:inline">Previous</span>
              </Link>

              <div class="text-sm text-gray-500 text-center px-2">
                Step <span class="font-semibold text-gray-700">2</span> of{" "}
                <span class="font-semibold text-gray-700">7</span>
              </div>

              <Link
                to="/dashboard/timetable/new/faculty"
                class="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                aria-disabled="false"
                data-discover="true"
              >
                <span class="hidden sm:inline">Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 sm:ml-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={bulkImportSubjects}
      />
      {editingSubject && (
        <AvailabilityModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSave={updateSubjectAvailability}
        />
      )}
    </>
  );
}
