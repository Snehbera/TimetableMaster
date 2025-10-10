import React, { useState, useEffect } from "react";

// --- Timetable Data ---
// In a real application, this would likely be fetched from an API.
const timetableJSON = {
  success: true,
  semester: { number: 5, name: "5th Semester" },
  timetableId: 230,
  runtimeSeconds: 0.149669,
  config: {
    working_days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    slots_and_breaks: [
      { index: 0, time: "07:30-08:25", type: "period" },
      { index: 1, time: "08:25-09:20", type: "period" },
      { index: null, time: "BREAK (09:20-09:50)", type: "break" },
      { index: 2, time: "09:50-10:45", type: "period" },
      { index: 3, time: "10:45-11:40", type: "period" },
      { index: null, time: "SHORT BREAK (11:40-11:50)", type: "break" },
      { index: 4, time: "11:50-12:45", type: "period" },
      { index: 5, time: "12:45-01:40", type: "period" },
    ],
  },
  timetable: {
    BX: [
      {
        name: "Monday",
        is_offday: true,
        slots: [
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
        ],
      },
      {
        name: "Tuesday",
        is_offday: false,
        slots: [
          {
            type: "LabBlock",
            details: [
              { partition: "BX1", lab: "AP", faculty: "DRP" },
              { partition: "BX2", lab: "IOT", faculty: "YBS" },
              { partition: "BX3", lab: "ADA", faculty: "BUT" },
            ],
          },
          { type: "Placeholder" },
          {
            type: "LabBlock",
            details: [
              { partition: "BX1", lab: "IOT", faculty: "YBS" },
              { partition: "BX2", lab: "AP", faculty: "DRP" },
              { partition: "BX3", lab: "OS", faculty: "KVP" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BX", subject: "ADA", faculty: "BUT" },
          { type: "Lec", division: "BX", subject: "IOT", faculty: "YBS" },
        ],
      },
      {
        name: "Wednesday",
        is_offday: false,
        slots: [
          { type: "DoubleLec", division: "BX", subject: "CAP", faculty: "NRV" },
          { type: "Placeholder" },
          {
            type: "LabBlock",
            details: [
              { partition: "BX1", lab: "ADA", faculty: "BUT" },
              { partition: "BX2", lab: "OS", faculty: "KVP" },
              { partition: "BX3", lab: "SE", faculty: "NPB" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BX", subject: "ADA", faculty: "BUT" },
          { type: "Lec", division: "BX", subject: "IOT", faculty: "YBS" },
        ],
      },
      {
        name: "Thursday",
        is_offday: false,
        slots: [
          {
            type: "LabBlock",
            details: [
              { partition: "BX1", lab: "SE", faculty: "NPB" },
              { partition: "BX2", lab: "ADA", faculty: "BUT" },
              { partition: "BX3", lab: "IOT", faculty: "YBS" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BX", subject: "ADA", faculty: "BUT" },
          { type: "Lec", division: "BX", subject: "OS", faculty: "KVP" },
          {
            type: "LabBlock",
            details: [
              { partition: "BX1", lab: "OS", faculty: "KVP" },
              { partition: "BX2", lab: "SE", faculty: "NPB" },
              { partition: "BX3", lab: "AP", faculty: "DRP" },
            ],
          },
          { type: "Placeholder" },
        ],
      },
      {
        name: "Friday",
        is_offday: false,
        slots: [
          { type: "Lec", division: "BX", subject: "IOT", faculty: "YBS" },
          { type: "Lec", division: "BX", subject: "OS", faculty: "KVP" },
          { type: "Lec", division: "BX", subject: "SE", faculty: "NPB" },
          { type: "Lec", division: "BX", subject: "C2P", faculty: "NMV" },
          { type: "Lec", division: "BX", subject: "AP", faculty: "DRP" },
          { type: "Lec", division: "BX", subject: "MN", faculty: "SNJ" },
        ],
      },
      {
        name: "Saturday",
        is_offday: false,
        slots: [
          { type: "Lec", division: "BX", subject: "OS", faculty: "KVP" },
          { type: "Lec", division: "BX", subject: "SE", faculty: "NPB" },
          { type: "Lec", division: "BX", subject: "C2P", faculty: "NMV" },
          { type: "Lec", division: "BX", subject: "AP", faculty: "DRP" },
          null,
          null,
        ],
      },
    ],
    BY: [
      {
        name: "Monday",
        is_offday: false,
        slots: [
          {
            type: "LabBlock",
            details: [
              { partition: "BY1", lab: "APY", faculty: "KSR" },
              { partition: "BY2", lab: "SE", faculty: "NPB" },
            ],
          },
          { type: "Placeholder" },
          {
            type: "LabBlock",
            details: [
              { partition: "BY1", lab: "ADA", faculty: "BUT" },
              { partition: "BY2", lab: "APY", faculty: "KSR" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BY", subject: "ADA", faculty: "BUT" },
          { type: "Lec", division: "BY", subject: "APY", faculty: "KSR" },
        ],
      },
      {
        name: "Tuesday",
        is_offday: false,
        slots: [
          { type: "DoubleLec", division: "BY", subject: "CAP", faculty: "HHM" },
          { type: "Placeholder" },
          {
            type: "LabBlock",
            details: [
              { partition: "BY1", lab: "OS", faculty: "NMV" },
              { partition: "BY2", lab: "ADA", faculty: "BUT" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BY", subject: "IOT", faculty: "YNM" },
          { type: "Lec", division: "BY", subject: "OS", faculty: "NMV" },
        ],
      },
      {
        name: "Wednesday",
        is_offday: false,
        slots: [
          {
            type: "LabBlock",
            details: [
              { partition: "BY1", lab: "IOT", faculty: "YNM" },
              { partition: "BY2", lab: "OS", faculty: "NMV" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BY", subject: "APY", faculty: "KSR" },
          { type: "Lec", division: "BY", subject: "C2P", faculty: "DRP" },
          {
            type: "LabBlock",
            details: [
              { partition: "BY1", lab: "SE", faculty: "NPB" },
              { partition: "BY2", lab: "IOT", faculty: "YNM" },
            ],
          },
          { type: "Placeholder" },
        ],
      },
      {
        name: "Thursday",
        is_offday: false,
        slots: [
          { type: "Lec", division: "BY", subject: "IOT", faculty: "YNM" },
          { type: "Lec", division: "BY", subject: "OS", faculty: "NMV" },
          { type: "Lec", division: "BY", subject: "SE", faculty: "NPB" },
          { type: "Lec", division: "BY", subject: "ADA", faculty: "BUT" },
          { type: "Lec", division: "BY", subject: "MN", faculty: "ARV" },
          null,
        ],
      },
      {
        name: "Friday",
        is_offday: false,
        slots: [
          { type: "Lec", division: "BY", subject: "ADA", faculty: "BUT" },
          { type: "Lec", division: "BY", subject: "IOT", faculty: "YNM" },
          { type: "Lec", division: "BY", subject: "OS", faculty: "NMV" },
          { type: "Lec", division: "BY", subject: "C2P", faculty: "DRP" },
          { type: "Lec", division: "BY", subject: "SE", faculty: "NPB" },
          null,
        ],
      },
      {
        name: "Saturday",
        is_offday: true,
        slots: [
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
        ],
      },
    ],
    BZ: [
      {
        name: "Monday",
        is_offday: true,
        slots: [
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
          { type: "OffDay" },
        ],
      },
      {
        name: "Tuesday",
        is_offday: false,
        slots: [
          {
            type: "LabBlock",
            details: [
              { partition: "BZ1", lab: "OS", faculty: "NMV" },
              { partition: "BZ2", lab: "SE", faculty: "NPB" },
            ],
          },
          { type: "Placeholder" },
          {
            type: "LabBlock",
            details: [
              { partition: "BZ1", lab: "APY", faculty: "KSR" },
              { partition: "BZ2", lab: "IOT", faculty: "YNM" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BZ", subject: "APY", faculty: "KSR" },
          { type: "Lec", division: "BZ", subject: "IOT", faculty: "YNM" },
        ],
      },
      {
        name: "Wednesday",
        is_offday: false,
        slots: [
          {
            type: "LabBlock",
            details: [
              { partition: "BZ1", lab: "SE", faculty: "NPB" },
              { partition: "BZ2", lab: "APY", faculty: "KSR" },
            ],
          },
          { type: "Placeholder" },
          {
            type: "LabBlock",
            details: [
              { partition: "BZ1", lab: "IOT", faculty: "YNM" },
              { partition: "BZ2", lab: "OS", faculty: "NMV" },
            ],
          },
          { type: "Placeholder" },
          { type: "Lec", division: "BZ", subject: "APY", faculty: "KSR" },
          { type: "Lec", division: "BZ", subject: "OS", faculty: "NMV" },
        ],
      },
      {
        name: "Thursday",
        is_offday: false,
        slots: [
          { type: "DoubleLec", division: "BZ", subject: "CAP", faculty: "NRV" },
          { type: "Placeholder" },
          { type: "Lec", division: "BZ", subject: "IOT", faculty: "YNM" },
          { type: "Lec", division: "BZ", subject: "OS", faculty: "NMV" },
          null,
          null,
        ],
      },
      {
        name: "Friday",
        is_offday: false,
        slots: [
          { type: "Lec", division: "BZ", subject: "IOT", faculty: "YNM" },
          { type: "Lec", division: "BZ", subject: "SE", faculty: "NPB" },
          { type: "Lec", division: "BZ", subject: "C2P", faculty: "DRP" },
          { type: "Lec", division: "BZ", subject: "MN", faculty: "ARV" },
          { type: "Lec", division: "BZ", subject: "OS", faculty: "NMV" },
          null,
        ],
      },
      {
        name: "Saturday",
        is_offday: false,
        slots: [
          { type: "Lec", division: "BZ", subject: "SE", faculty: "NPB" },
          { type: "Lec", division: "BZ", subject: "C2P", faculty: "DRP" },
          null,
          null,
          null,
          null,
        ],
      },
    ],
  },
};

// --- Helper Functions ---
const isCurrentSlot = (dayName, timeRange) => {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayName = days[now.getDay()];

  if (currentDayName !== dayName) return false;

  try {
    const [startTimeStr, endTimeStr] = timeRange.split("-");
    const [startHour, startMinute] = startTimeStr.split(":").map(Number);

    let endHour = parseInt(endTimeStr.split(":")[0], 10);
    const endMinute = parseInt(endTimeStr.split(":")[1], 10);

    // Simple logic to handle PM times (e.g., 01:40 is 13:40)
    if (endHour < startHour) endHour += 12;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime < endTime;
  } catch (e) {
    console.error("Error parsing time:", timeRange, e);
    return false;
  }
};

// --- Sub-Components ---

const Header = () => (
  <header className="text-center mb-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <div className="flex justify-center items-center gap-4 flex-wrap">
      <img
        src="https://placehold.co/80x80/e2e8f0/334155?text=Logo"
        alt="University Logo"
        className="h-16 w-16 rounded-full"
      />
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          University Timetable System
        </h1>
        <p className="text-md text-gray-600">
          Yogidham Gurukul, Kalawad Road, Rajkot - 360005, Gujarat (INDIA)
        </p>
      </div>
    </div>
  </header>
);

const InfoBar = ({ semester, division }) => (
  <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div>
        <span className="font-bold text-gray-700">B.Tech. Semester:</span>
        <span className="font-semibold text-blue-700 ml-2">
          {semester.number}
        </span>
      </div>
      <div>
        <span className="font-bold text-gray-700">Division:</span>
        <span className="font-semibold text-blue-700 ml-2">{division}</span>
      </div>
      <div>
        <span className="font-bold text-gray-700">Branch:</span>
        <span className="font-semibold text-blue-700 ml-2">
          Computer Engineering
        </span>
      </div>
    </div>
  </div>
);

const DivisionSwitcher = ({
  divisions,
  currentDivision,
  setCurrentDivision,
}) => (
  <div className="flex justify-center items-center flex-wrap gap-2 mb-8 p-2 bg-white rounded-full shadow-md w-fit mx-auto border border-gray-200">
    {divisions.map((div) => (
      <button
        key={div}
        onClick={() => setCurrentDivision(div)}
        className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${
          currentDivision === div
            ? "bg-gray-900 text-white shadow-lg"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        DIVISION {div}
      </button>
    ))}
  </div>
);

const SlotContent = ({ slot }) => {
  if (!slot) return null;

  switch (slot.type) {
    case "Lec":
    case "DoubleLec":
      return (
        <div className="p-2">
          <p className="font-bold text-sm md:text-base">{slot.subject}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            ({slot.faculty})
          </p>
        </div>
      );
    case "LabBlock":
      return (
        <div className="flex flex-col">
          {slot.details.map((d, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-xs md:text-sm p-1.5 border-b border-gray-300 last:border-b-0"
            >
              <span>
                <strong className="font-semibold">{d.partition}:</strong>{" "}
                {d.lab}
              </span>
              <span className="font-medium text-gray-600">({d.faculty})</span>
            </div>
          ))}
        </div>
      );
    case "OffDay":
      // This case is not actively used in the table rendering for off days,
      // but kept for completeness.
      return <p className="font-semibold">Off Day</p>;
    default:
      return null;
  }
};

const Timetable = ({ config, timetableData }) => {
  // Using a plain variable for tracking rowspans within a single render pass.
  // It gets re-initialized on every render, which is what we want.
  let rowspanTracker = new Array(config.working_days.length).fill(0);
  let srNo = 0;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table
        className="w-full"
        style={{
          borderCollapse: "separate",
          borderSpacing: 0,
          border: "1px solid #d1d5db",
        }}
      >
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border border-gray-300 font-bold uppercase text-gray-700 w-1/12">
              Sr. No
            </th>
            <th className="p-3 border border-gray-300 font-bold uppercase text-gray-700">
              Time
            </th>
            {config.working_days.map((day) => (
              <th
                key={day}
                className="p-3 border border-gray-300 font-bold uppercase text-gray-700"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {config.slots_and_breaks.map((item, rowIndex) => {
            if (item.type === "break") {
              return (
                <tr
                  key={`break-${rowIndex}`}
                  className="bg-red-100 text-red-800 font-bold"
                >
                  <td
                    colSpan={config.working_days.length + 2}
                    className="p-2 text-center border border-gray-300 tracking-widest"
                  >
                    {item.time}
                  </td>
                </tr>
              );
            }

            srNo++;
            const currentPeriodIndex = item.index;

            return (
              <tr key={item.time}>
                <td className="p-3 text-center border border-gray-300 font-bold bg-gray-50">
                  {srNo}
                </td>
                <td className="p-3 text-center border border-gray-300 font-semibold bg-gray-50">
                  {item.time}
                </td>
                {timetableData.map((dayData, dayIndex) => {
                  // Handle Off Days with correct rowspan for period blocks
                  if (dayData.is_offday) {
                    const isStartOfPeriodBlock =
                      rowIndex === 0 ||
                      config.slots_and_breaks[rowIndex - 1]?.type === "break";
                    if (isStartOfPeriodBlock) {
                      let periodBlockSize = 0;
                      for (
                        let i = rowIndex;
                        i < config.slots_and_breaks.length;
                        i++
                      ) {
                        if (config.slots_and_breaks[i].type === "period")
                          periodBlockSize++;
                        else break;
                      }
                      return (
                        <td
                          key={`${dayData.name}-off-${rowIndex}`}
                          className="p-2 text-center align-middle border border-gray-300 bg-gray-100 text-gray-400"
                          rowSpan={periodBlockSize}
                        >
                          <div className="flex items-center justify-center h-full min-h-[6rem]">
                            <span className="transform -rotate-90 whitespace-nowrap tracking-widest uppercase font-bold text-xl">
                              HOLIDAY
                            </span>
                          </div>
                        </td>
                      );
                    }
                    return null; // This slot is part of an already rendered rowspan block
                  }

                  // Handle regular working days
                  if (rowspanTracker[dayIndex] > 0) {
                    rowspanTracker[dayIndex]--;
                    return null;
                  }

                  const slot = dayData.slots[currentPeriodIndex];
                  const rowSpan =
                    slot?.type === "DoubleLec" || slot?.type === "LabBlock"
                      ? 2
                      : 1;

                  if (rowSpan > 1) {
                    rowspanTracker[dayIndex] = rowSpan - 1;
                  }

                  const isCurrent = isCurrentSlot(dayData.name, item.time);

                  const cellClasses = `p-0 text-center border border-gray-300 relative ${
                    isCurrent
                      ? "shadow-inner shadow-blue-400 ring-2 ring-blue-500 z-10"
                      : ""
                  }`;

                  return (
                    <td
                      key={`${dayData.name}-${item.time}`}
                      className={cellClasses}
                      rowSpan={rowSpan}
                    >
                      {isCurrent && (
                        <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                      )}
                      <SlotContent slot={slot} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Footer = ({ timetableId }) => (
  <footer className="text-center mt-8 text-sm text-gray-500">
    <p>
      Timetable ID: <span className="font-semibold">{timetableId}</span> |
      Generated on{" "}
      <span className="font-semibold">{new Date().toLocaleString()}</span>
    </p>
  </footer>
);

// --- Main App Component ---

export default function App() {
  const [data] = useState(timetableJSON);
  const divisions = Object.keys(data.timetable);
  const [currentDivision, setCurrentDivision] = useState(divisions[0]);

  if (!data.success) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: Timetable data could not be loaded.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Header />
        <InfoBar semester={data.semester} division={currentDivision} />
        <DivisionSwitcher
          divisions={divisions}
          currentDivision={currentDivision}
          setCurrentDivision={setCurrentDivision}
        />
        <Timetable
          config={data.config}
          timetableData={data.timetable[currentDivision]}
        />
        <Footer timetableId={data.timetableId} />
      </div>
    </div>
  );
}
