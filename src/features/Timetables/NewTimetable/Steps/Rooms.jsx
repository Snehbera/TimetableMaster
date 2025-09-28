import React, { useState, useMemo, useEffect } from "react";
import useTimetableStore from "../../../../Stores/TimetableStore";
import { Link } from "react-router-dom";

// --- SVG Icon Components ---
const BuildingOfficeIcon = () => (
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
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6m-6 3h6m-6 3h6m-6 3h6m-6 3h6m-6 3h6"
    />{" "}
  </svg>
);
const BeakerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2 text-indigo-500"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 3.104v5.714a2.25 2.25 0 01-.211 1.004l-1.524 1.524a2.25 2.25 0 00-.211 1.004V18m-5.25 0h5.25m-5.25 0a2.25 2.25 0 01-2.25-2.25V15M15 18a2.25 2.25 0 002.25-2.25V15m-5.25-1.5L15 9.75M9 7.5l3 3m0 0l3-3m-3 3v5.25m3-13.5v5.714a2.25 2.25 0 00.211 1.004l1.524 1.524a2.25 2.25 0 01.211 1.004V18"
    />{" "}
  </svg>
);
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2 text-indigo-500"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />{" "}
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const PrevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
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
    strokeWidth={1.5}
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

// --- New Lab Assignment Modal ---
const LabAssignmentModal = ({ subdivision, onClose }) => {
  const { subjects, rooms, updateRoomName } = useTimetableStore();

  // Find all subjects that require a lab
  const subjectsWithLabs = useMemo(
    () => (subjects || []).filter((s) => s.labsPerWeek > 0),
    [subjects]
  );

  // This function finds the specific lab room object for a given subject and subdivision
  const getLabForSubject = (subjectId) => {
    return (rooms || []).find(
      (r) =>
        r.type === "lab" &&
        r.homeRoomFor?.timetableId === subdivision.timetableId &&
        r.homeRoomFor?.subIndex === subdivision.subIndex &&
        r.homeRoomFor?.subjectId === subjectId
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Assign Labs for {subdivision.name}
            </h2>
            <p className="text-sm text-gray-500">
              Enter the lab room for each required subject.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          {subjectsWithLabs.map((subject) => {
            const lab = getLabForSubject(subject.id);
            if (!lab) return null; // Should not happen if initializeRooms is correct

            return (
              <div
                key={subject.id}
                className="grid grid-cols-2 gap-4 items-center"
              >
                <label className="font-medium text-gray-700">
                  {subject.name} ({subject.shortName})
                </label>
                <input
                  placeholder="e.g., Physics Lab A"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  value={lab.name || ""}
                  onChange={(e) => updateRoomName(lab.id, e.target.value)}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Rooms Page Component ---
export default function Rooms() {
  const { rooms, timetableNames, subjects, initializeRooms, updateRoomName } =
    useTimetableStore();
  const [editingSubdivision, setEditingSubdivision] = useState(null);

  useEffect(() => {
    // This hook automatically creates classroom shells based on the divisions defined earlier.
    initializeRooms();
  }, [initializeRooms, timetableNames, subjects]);

  // This complex logic calculates which classrooms and labs need to be displayed.
  const { classrooms, subdivisionsWithLabs } = useMemo(() => {
    const classList = [];
    const subList = [];
    const subMap = new Map();

    (timetableNames || []).forEach((tt) => {
      const classAssignment = { timetableId: tt.id, subIndex: -1 };
      const classroom = rooms.find(
        (r) =>
          r.type === "classroom" &&
          JSON.stringify(r.homeRoomFor) === JSON.stringify(classAssignment)
      );
      if (classroom) {
        classList.push({ ...classroom, divisionName: tt.name });
      }

      (tt.subdivisions || []).forEach((sub, index) => {
        if (sub) {
          const key = `${tt.id}-${index}`;
          if (!subMap.has(key)) {
            subMap.set(key, {
              timetableId: tt.id,
              subIndex: index,
              name: `${tt.name} - ${sub}`,
            });
          }
        }
      });
    });

    // Only show the labs section if there are subjects that actually require labs.
    const subjectsWithLabsCount = (subjects || []).filter(
      (s) => s.labsPerWeek > 0
    ).length;
    if (subjectsWithLabsCount > 0) {
      subMap.forEach((sub) => subList.push(sub));
    }

    return { classrooms: classList, subdivisionsWithLabs: subList };
  }, [rooms, timetableNames, subjects]);

  // --- CHANGE 1: VALIDATION LOGIC ---
  // Checks if every classroom input field has a value.
  const areAllFieldsValid = useMemo(() => {
    if (classrooms.length === 0) return true; // If no classrooms, nothing to validate.
    return classrooms.every((room) => room.name && room.name.trim() !== "");
  }, [classrooms]);

  return (
    <>
      <div className="font-sans p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-6">
            <div className="flex items-start justify-between mb-6 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BuildingOfficeIcon /> Rooms & Labs Assignment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Assign a room number for each division's home classroom.
                </p>
              </div>
            </div>

            {/* --- CHANGE 2: EMPTY STATE --- */}
            {classrooms.length === 0 && subdivisionsWithLabs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No Rooms to Configure
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please go back to Step 1 and add Timetable Names (Divisions)
                  to create classrooms.
                </p>
              </div>
            ) : (
              // --- CHANGE 3: RESPONSIVE GRID LAYOUT ---
              // Stacks vertically on mobile, becomes a 2-column grid on medium screens and up.
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Classrooms Section */}
                {classrooms.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <HomeIcon />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Classrooms
                      </h3>
                    </div>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Home Room For
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Room Number
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {classrooms.map((room) => {
                            const isInvalid =
                              !room.name || room.name.trim() === "";
                            return (
                              <tr
                                key={room.id}
                                className="hover:bg-indigo-50/30"
                              >
                                <td className="px-4 py-4 font-medium text-gray-800">
                                  {room.divisionName}
                                </td>
                                <td className="px-4 py-4">
                                  <input
                                    placeholder="e.g., C-101"
                                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                      isInvalid
                                        ? "border-red-400 ring-red-300"
                                        : "border-gray-300 focus:ring-indigo-500"
                                    }`}
                                    type="text"
                                    value={room.name}
                                    onChange={(e) =>
                                      updateRoomName(room.id, e.target.value)
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Labs Section */}
                {subdivisionsWithLabs.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <BeakerIcon />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Labs
                      </h3>
                    </div>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subdivision
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subdivisionsWithLabs.map((sub) => (
                            <tr
                              key={`${sub.timetableId}-${sub.subIndex}`}
                              className="hover:bg-indigo-50/30"
                            >
                              <td className="px-4 py-4 font-medium text-gray-800">
                                {sub.name}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <button
                                  onClick={() => setEditingSubdivision(sub)}
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  Assign Labs
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard/timetable/new/classes"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 shadow-sm"
              >
                <PrevIcon /> Previous
              </Link>
              <div className="text-sm text-gray-600">
                Step <span className="font-semibold text-gray-800">5</span> of 7
              </div>
              {/* --- VALIDATION ON NEXT BUTTON --- */}
              <Link
                to={
                  areAllFieldsValid
                    ? "/dashboard/timetable/new/constraints"
                    : "#"
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
                    ? "Please fill in all room numbers to continue."
                    : ""
                }
              >
                Next <NextIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {editingSubdivision && (
        <LabAssignmentModal
          subdivision={editingSubdivision}
          onClose={() => setEditingSubdivision(null)}
        />
      )}
    </>
  );
}
