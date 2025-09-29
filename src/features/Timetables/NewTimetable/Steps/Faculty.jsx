import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useTimetableStore from "../../../../Stores/TimetableStore";

// --- SVG Icon Components ---
const UserGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2 text-indigo-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.289 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m7.289 2.72a8.97 8.97 0 01-7.289-2.72m0 0a8.97 8.97 0 017.289 2.72M8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z"
    />{" "}
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
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className= "h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-2"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />{" "}
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

// --- Assign Subjects Modal Component --- //
const AssignSubjectsModal = ({ facultyMember, onClose, onSave }) => {
  const { subjects } = useTimetableStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(
    facultyMember.assignedSubjects
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
            <InfoIcon />
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

// --- Main Faculty App --- //
export default function Faculty() {
  const {
    faculty,
    subjects,
    addFaculty,
    removeFaculty,
    updateFacultyName,
    updateFacultyShortName,
    setFacultyAssignment,
    sortFaculty,
    bulkImportFaculty,
  } = useTimetableStore();

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  // --- CHANGE 1: VALIDATION LOGIC ---
  // This checks that there is at least one faculty member and all names are filled.
  const areAllFieldsValid = useMemo(() => {
    if (faculty.length === 0) return false;
    return faculty.every(
      (f) => f.name.trim() !== "" && f.shortName.trim() !== ""
    );
  }, [faculty]);

  // Helper function to render the assign subjects button, avoiding code duplication
  const renderAssignSubjectsButton = (facultyMember) => {
    const assignedSubjects = subjects.filter((s) =>
      facultyMember.assignedSubjects.includes(s.id)
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
              {/* --- CHANGE 2: EMPTY STATE --- */}
              {faculty.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No faculty members added
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Click "Add Faculty" to get started.
                  </p>
                </div>
              ) : (
                <>
                  {/* --- CHANGE 3: RESPONSIVE LAYOUT (DESKTOP TABLE) --- */}
                  <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                            Short Name / Full Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                            <div className="flex items-center">
                              <BookOpenIcon />
                              Assigned Subjects
                            </div>
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {faculty.map((facultyMember) => {
                          const isShortNameInvalid =
                            facultyMember.shortName.trim() === "";
                          const isNameInvalid =
                            facultyMember.name.trim() === "";
                          return (
                            <tr
                              key={facultyMember.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <input
                                    placeholder="e.g., AP"
                                    className={`w-1/4 p-2 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 rounded-lg font-medium ${
                                      isShortNameInvalid
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
                                    className={`w-3/4 p-2 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 rounded-lg ${
                                      isNameInvalid
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
                              <td className="px-6 py-4 text-center">
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-600 focus:outline-none"
                                  onClick={() =>
                                    removeFaculty(facultyMember.id)
                                  }
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

                  {/* --- CHANGE 3: RESPONSIVE LAYOUT (MOBILE CARDS) --- */}
                  <div className="space-y-4 md:hidden">
                    {faculty.map((facultyMember) => {
                      const isShortNameInvalid =
                        facultyMember.shortName.trim() === "";
                      const isNameInvalid = facultyMember.name.trim() === "";
                      return (
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
                                isShortNameInvalid
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
                                isNameInvalid
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
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <label className="block text-xs font-medium text-gray-500 uppercase">
                              Action
                            </label>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-600 focus:outline-none"
                              onClick={() => removeFaculty(facultyMember.id)}
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

            {/* --- RESPONSIVE ACTION BUTTONS --- */}
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
                <AddIcon /> Add Faculty
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard/timetable/new/subjects"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <PrevIcon /> Previous
              </Link>
              <div className="text-sm text-gray-500">
                Step <span className="font-semibold text-gray-700">3</span> of 7
              </div>
              {/* --- VALIDATION ON NEXT BUTTON --- */}
              <Link
                to={
                  areAllFieldsValid ? "/dashboard/timetable/new/classes" : "#"
                }
                onClick={(e) => !areAllFieldsValid && e.preventDefault()}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  areAllFieldsValid
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-300 cursor-not-allowed"
                }`}
                aria-disabled={!areAllFieldsValid}
                title={
                  !areAllFieldsValid
                    ? "Please fill in all faculty names to continue."
                    : ""
                }
              >
                Next <NextIcon />
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
          onSave={setFacultyAssignment}
        />
      )}
    </>
  );
}
