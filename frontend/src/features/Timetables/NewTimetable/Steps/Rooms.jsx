import React, { useState, useMemo, useEffect } from "react";
import useTimetableStore from "../../../../Stores/TimetableStore";
import { Link } from "react-router-dom"; // Corrected import for react-router-dom

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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6m-6 3h6m-6 3h6m-6 3h6m-6 3h6m-6 3h6"
    />
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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);
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

// --- Lab Assignment Modal --- //
const LabAssignmentModal = ({ subdivision, onClose }) => {
  const { subjects, rooms, updateRoomName } = useTimetableStore();

  const subjectsWithLabs = useMemo(
    () => (subjects || []).filter((s) => s.labsPerWeek > 0),
    [subjects]
  );

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
            if (!lab) return null;

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

// --- Main Rooms App --- //
export default function Rooms() {
  const { rooms, timetableNames, subjects, initializeRooms, updateRoomName } =
    useTimetableStore();
  const [editingSubdivision, setEditingSubdivision] = useState(null);

  useEffect(() => {
    initializeRooms();
  }, [initializeRooms, timetableNames, subjects]);

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
              labCount: 0,
            });
          }
        }
      });
    });

    const subjectsWithLabsCount = (subjects || []).filter(
      (s) => s.labsPerWeek > 0
    ).length;
    if (subjectsWithLabsCount > 0) {
      subMap.forEach((sub) => subList.push(sub));
    }

    return { classrooms: classList, subdivisionsWithLabs: subList };
  }, [rooms, timetableNames, subjects]);

  return (
    <>
      <div className="font-sans p-6 min-h-screen">
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BuildingOfficeIcon /> Rooms & Labs Assignment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Classrooms are created per division. Labs are assigned per
                  subdivision.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Classrooms Section */}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Home Room For
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* --- MODIFIED SECTION FOR CLASSROOMS --- */}
                      {classrooms.length > 0 ? (
                        classrooms.map((room) => (
                          <tr key={room.id} className="hover:bg-indigo-50/30">
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {room.divisionName || "Unnamed Division"}
                            </td>
                            <td className="px-6 py-4">
                              <input
                                placeholder="e.g., C-101"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                value={room.name || ""}
                                onChange={(e) =>
                                  updateRoomName(room.id, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-6 py-10 text-center text-sm text-gray-500"
                          >
                            No classrooms to display.
                            <br />
                            Please add divisions in the General Settings step.
                          </td>
                        </tr>
                      )}
                      {/* --- END MODIFIED SECTION --- */}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Labs Section */}
              <div>
                <div className="flex items-center mb-4">
                  <HomeIcon />
                  <h3 className="text-lg font-semibold text-gray-800">Labs</h3>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subdivision
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* --- MODIFIED SECTION FOR LABS --- */}
                      {subdivisionsWithLabs.length > 0 ? (
                        subdivisionsWithLabs.map((sub) => (
                          <tr
                            key={`${sub.timetableId}-${sub.subIndex}`}
                            className="hover:bg-indigo-50/30"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {sub.name}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setEditingSubdivision(sub)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                              >
                                Assign Labs
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-6 py-10 text-center text-sm text-gray-500"
                          >
                            No labs to assign.
                            <br />
                            This requires subjects with labs and named
                            subdivisions.
                          </td>
                        </tr>
                      )}
                      {/* --- END MODIFIED SECTION --- */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center">
              <Link
                to="/dashboard/timetable/new/classes"
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
                  ></path>
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </Link>

              <div className="text-sm text-gray-500 text-center px-2">
                Step <span className="font-semibold text-gray-700">5</span> of{" "}
                <span className="font-semibold text-gray-700">7</span>
              </div>

              <Link
                to="/dashboard/timetable/new/review"
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
                  ></path>
                </svg>
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
