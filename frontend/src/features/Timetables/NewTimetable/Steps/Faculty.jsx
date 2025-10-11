import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import useTimetableStore from "../../../../Stores/TimetableStore";

// --- SVG Icon Components ---
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mx-auto"
  >
    <path
      fillRule="evenodd"
      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
      clipRule="evenodd"
    />
  </svg>
);
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mx-auto"
  >
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
const UserGroupIcon = () => (
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
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
    ></path>
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
    {" "}
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
      clipRule="evenodd"
    />{" "}
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
    {" "}
    <path
      fillRule="evenodd"
      d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />{" "}
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
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />{" "}
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
    {" "}
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
      clipRule="evenodd"
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
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
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
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
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
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
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

// --- Assign Subjects Modal Component --- //
const AssignSubjectsModal = ({ facultyMember, onClose, onSave }) => {
  const { subjects } = useTimetableStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(
    facultyMember.assignedSubjects || []
  );

  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return subjects;
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subjects]);

  const handleToggleSubject = (subjectId) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSave = () => {
    onSave(facultyMember.id, selectedSubjectIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Assign Subjects to {facultyMember.name}
          </h2>
          <p className="text-sm text-gray-500">
            Select the subjects this faculty member can teach.
          </p>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <label
                key={subject.id}
                className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedSubjectIds.includes(subject.id)}
                  onChange={() => handleToggleSubject(subject.id)}
                />
                <span className="ml-3 text-sm text-gray-800 font-medium">
                  {subject.name}
                </span>
                <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {subject.shortName}
                </span>
              </label>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              No subjects found matching your search.
            </div>
          )}
        </div>
        <div className="flex justify-end items-center px-4 py-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Bulk Import Modal Component --- //
const BulkImportModal = ({ isOpen, onClose, onImport }) => {
  const [textInput, setTextInput] = useState("");

  if (!isOpen) return null;

  const facultyToImport = textInput
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [facultyPart, subjectsPart] = line.split("|").map((p) => p.trim());
      const facultyNameParts = facultyPart.split(" - ");

      const shortName =
        facultyNameParts.length > 1 ? facultyNameParts[0].trim() : "";
      const name =
        facultyNameParts.length > 1
          ? facultyNameParts.slice(1).join(" - ").trim()
          : facultyPart;

      const assignedSubjectsShortNames = subjectsPart
        ? subjectsPart.split(",").map((s) => s.trim())
        : [];

      return { shortName, name, assignedSubjectsShortNames };
    });

  const handleImport = () => {
    onImport(facultyToImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Import Faculty</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <label
            htmlFor="text-import"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Enter faculty and their assigned subjects (one per line):
          </label>
          <textarea
            id="text-import"
            rows="8"
            className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="SN - Full Name | SUB1, SUB2, SUB3"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 mt-2">
            <InfoIcon className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                Use the format:{" "}
                <strong>ShortName - FullName | SUB1, SUB2</strong>
              </p>
              <p>
                <strong>Example:</strong> AP - Alice Pauline | APY, IOT
              </p>
              <p>
                The part after the pipe `|` is a comma-separated list of{" "}
                <strong>Subject Short Names</strong>.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
          <div className="text-xs text-gray-600">
            {facultyToImport.length > 0
              ? `${facultyToImport.length} faculty selected`
              : "Paste text to continue"}
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={facultyToImport.length === 0}
              className="px-4 py-1.5 rounded-lg text-sm bg-indigo-600 text-white disabled:bg-gray-300"
            >
              Import {facultyToImport.length} Faculty
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Faculty Availability Modal Component ---
const FacultyAvailabilityModal = ({ facultyMember, onClose, onSave }) => {
  const { timings, days } = useTimetableStore();
  const [grid, setGrid] = useState([]);
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
      facultyMember.availability &&
      facultyMember.availability.length === numPeriods &&
      facultyMember.availability[0]?.length === numDays;
    if (isGridValid) {
      setGrid(JSON.parse(JSON.stringify(facultyMember.availability)));
    } else {
      const newGrid = Array(numPeriods)
        .fill(null)
        .map(() => Array(numDays).fill(true));
      setGrid(newGrid);
    }
  }, [periodsOnly, schoolDays, facultyMember.availability]);

  const toggleCell = (pIndex, dIndex) =>
    setGrid((g) =>
      g.map((r, pi) =>
        pi !== pIndex ? r : r.map((c, di) => (di !== dIndex ? c : !c))
      )
    );
  const toggleDay = (dIndex) =>
    setGrid((g) => g.map((r) => r.map((c, di) => (di === dIndex ? !c : c))));
  const togglePeriod = (pIndex) =>
    setGrid((g) => g.map((r, pi) => (pi === pIndex ? r.map((c) => !c) : r)));

  const handleClose = () => {
    onSave(facultyMember.id, grid);
    onClose();
  };

  if (!facultyMember) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-h-[90vh] flex flex-col relative mx-4 max-w-4xl">
        <div className="p-6 pb-3">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <CloseIcon />
          </button>
          <h2 className="text-xl font-bold mb-3 text-gray-800">
            Manage Availability for {facultyMember.name}
          </h2>
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm">
            <p className="text-blue-700">
              Mark periods when <strong>{facultyMember.name}</strong> is{" "}
              <strong>not available</strong>.
            </p>
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
              <span className="text-sm text-gray-700">Not Available</span>
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
                      className="border px-2 py-2 text-center cursor-pointer hover:bg-gray-200 min-w-[120px] w-[120px]"
                      title="Toggle column"
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
                        className="border px-2 py-2 cursor-pointer hover:bg-gray-100 min-w-[140px] w-[140px] bg-gray-50"
                        title="Toggle row"
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
                          className={`border px-2 py-2 text-center cursor-pointer min-w-[120px] w-[120px] ${
                            grid[periodIndex]?.[dayIndex]
                              ? "bg-green-100 hover:bg-green-200"
                              : "bg-red-100 hover:bg-red-200"
                          }`}
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
        <div className="flex justify-end items-center px-4 py-3 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Faculty App ---
export default function Faculty() {
  const {
    faculty,
    subjects,
    addFaculty,
    removeFaculty,
    updateFacultyName,
    updateFacultyShortName,
    setAssignedSubjects,
    sortFaculty,
    bulkImportFaculty,
    setFacultyAvailability,
    timings,
    days,
  } = useTimetableStore();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingAvailability, setEditingAvailability] = useState(null);

  const areAllFieldsValid = useMemo(() => {
    if (faculty.length === 0) return false;
    return faculty.every(
      (f) => f.name.trim() !== "" && f.shortName.trim() !== ""
    );
  }, [faculty]);

  const calculateAvailability = (availabilityGrid) => {
    const schoolDays = (days || []).filter((d) => d.isSchoolDay);
    const periodsOnly = (timings || []).filter((p) => p.type === "period");

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

  const renderAvailabilityBadge = (facultyMember) => {
    const { percentOff, isAllAvailable } = calculateAvailability(
      facultyMember.availability
    );

    return isAllAvailable ? (
      <button
        onClick={() => setEditingAvailability(facultyMember)}
        className="inline-flex items-center space-x-1 cursor-pointer px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition group shadow-sm border border-green-200"
        title="Click to manage Availability"
      >
        <CalendarIcon className="w-3.5 h-3.5 mr-1" />
        <span>All Available</span>
        <PencilIcon />
      </button>
    ) : (
      <button
        onClick={() => setEditingAvailability(facultyMember)}
        className="inline-flex items-center space-x-1 cursor-pointer px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition group shadow-sm border border-red-200"
        title="Click to manage Availability"
      >
        <CalendarIcon className="w-3.5 h-3.5 mr-1 text-red-600" />
        <span>{percentOff}% Off</span>
        <PencilIcon />
      </button>
    );
  };

  const renderAssignSubjectsButton = (facultyMember) => {
    const assignedSubjects = subjects.filter((s) =>
      (facultyMember.assignedSubjects || []).includes(s.id)
    );
    return (
      <button
        onClick={() => setEditingFaculty(facultyMember)}
        className="w-full text-left bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {assignedSubjects.length === 0 ? (
          <span className="text-gray-500">Assign Subjects...</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {assignedSubjects.map((s) => (
              <span
                key={s.id}
                className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {s.shortName || s.name}
              </span>
            ))}
          </div>
        )}
      </button>
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
                  <UserGroupIcon />
                  Faculty / Instructors
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage faculty and assign the subjects they teach.
                </p>
              </div>
            </div>
            <div>
              {faculty.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-3">
                  <InfoIcon className="h-10 w-10 mx-auto text-blue-400" />
                  <h3 className="text-sm font-medium text-gray-900">
                    No faculty members added
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Click "Add Faculty" to get started.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                            Short Name / Full Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                            Assigned Subjects
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                            Availability
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {faculty.map((facultyMember) => (
                          <tr
                            key={facultyMember.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  placeholder="e.g., AP"
                                  className={`w-1/4 p-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-lg font-medium ${
                                    facultyMember.shortName.trim() === ""
                                      ? "border-red-400 ring-red-300"
                                      : ""
                                  }`}
                                  type="text"
                                  value={facultyMember.shortName}
                                  onChange={(e) =>
                                    updateFacultyShortName(
                                      facultyMember.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  placeholder="e.g., Alice Pauline"
                                  className={`w-3/4 p-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-lg ${
                                    facultyMember.name.trim() === ""
                                      ? "border-red-400 ring-red-300"
                                      : ""
                                  }`}
                                  type="text"
                                  value={facultyMember.name}
                                  onChange={(e) =>
                                    updateFacultyName(
                                      facultyMember.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {renderAssignSubjectsButton(facultyMember)}
                            </td>
                            <td className="px-6 py-4">
                              {renderAvailabilityBadge(facultyMember)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                onClick={() => removeFaculty(facultyMember.id)}
                              >
                                <TrashIcon />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-4 md:hidden">
                    {faculty.map((facultyMember) => (
                      <div
                        key={facultyMember.id}
                        className="p-4 border border-l-4 border-l-indigo-500 bg-gray-50/50 rounded-lg"
                      >
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase">
                            Short / Full Name
                          </label>
                          <input
                            placeholder="e.g., AP"
                            className={`w-full p-2 border rounded-lg font-medium ${
                              facultyMember.shortName.trim() === ""
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                            type="text"
                            value={facultyMember.shortName}
                            onChange={(e) =>
                              updateFacultyShortName(
                                facultyMember.id,
                                e.target.value
                              )
                            }
                          />
                          <input
                            placeholder="e.g., Alice Pauline"
                            className={`w-full p-2 border rounded-lg ${
                              facultyMember.name.trim() === ""
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                            type="text"
                            value={facultyMember.name}
                            onChange={(e) =>
                              updateFacultyName(
                                facultyMember.id,
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                            Assigned Subjects
                          </label>
                          {renderAssignSubjectsButton(facultyMember)}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                            Availability
                          </label>
                          {renderAvailabilityBadge(facultyMember)}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <label className="block text-xs font-medium text-gray-500 uppercase">
                            Action
                          </label>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            onClick={() => removeFaculty(facultyMember.id)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-4 mt-6">
              <button
                onClick={sortFaculty}
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                <SortIcon /> Sort A-Z
              </button>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ImportIcon /> Bulk Import
              </button>
              <button
                onClick={addFaculty}
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <AddIcon /> Add Facultysubjects
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard/timetable/new/subjects"
                className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
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
                to="/dashboard/timetable/new/classNamees"
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
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={bulkImportFaculty}
      />
      {editingFaculty && (
        <AssignSubjectsModal
          facultyMember={editingFaculty}
          onClose={() => setEditingFaculty(null)}
          onSave={setAssignedSubjects}
        />
      )}
      {editingAvailability && (
        <FacultyAvailabilityModal
          facultyMember={editingAvailability}
          onClose={() => setEditingAvailability(null)}
          onSave={setFacultyAvailability}
        />
      )}
    </>
  );
}
