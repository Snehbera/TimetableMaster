import React, { useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    if (endHour < startHour) endHour += 12;
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    return currentTime >= startTime && currentTime < endTime;
  } catch (e) {
    return false;
  }
};

// --- Sub-Components ---

const Header = () => (
  <header className="text-center mb-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <div className="flex justify-center items-center gap-4 flex-wrap">
      <img
        src="https://atmiyauni.ac.in/images/logo.png"
        alt="Atmiya University Logo"
        className="h-16"
      />
      <div>
        <h1 className="text-3xl md:text-2xl font-bold text-gray-900">
          Atmiya University Timetable
        </h1>
        <p className="text-md text-gray-600">
          Yogidham Gurukul, Kalawad Road, Rajkot-360005, Gujarat (INDIA)
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
        <span className="font-semibold text-indigo-700 ml-2">
          {semester.number}
        </span>
      </div>
      <div>
        <span className="font-bold text-gray-700">Division:</span>
        <span className="font-semibold text-indigo-700 ml-2">{division}</span>
      </div>
      <div>
        <span className="font-bold text-gray-700">Branch:</span>
        <span className="font-semibold text-indigo-700 ml-2">
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
        className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          currentDivision === div
            ? "bg-indigo-600 text-white shadow-lg"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        DIVISION {div}
      </button>
    ))}
  </div>
);

// ✨ New component for handling actions
const ActionButtons = ({ timetableRef }) => {
  const navigate = useNavigate();

  const handleRegenerate = () => {
    navigate("/dashboard/timetable/new/review");
  };

  const handleSavePDF = () => {
    const input = timetableRef.current;
    if (!input) return;

    // Give a little time for the hover/active states to clear before capture
    setTimeout(() => {
      html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false, // Disables console logging from the library
        onclone: (document) => {
          // Remove the action buttons from the clone so they aren't in the PDF
          const buttons = document.getElementById("action-buttons");
          if (buttons) {
            buttons.style.display = "none";
          }
        },
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        // A4 page dimensions in pixels at 96 DPI: 794x1123 (portrait)
        // We use landscape so it's 1123x794
        const pdfWidth = 1123;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [pdfWidth, pdfHeight],
        });
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Timetable-${new Date().toISOString().slice(0, 10)}.pdf`);
      });
    }, 150);
  };

  return (
    <div
      id="action-buttons"
      className="flex justify-center items-center gap-4 my-8 print:hidden"
    >
      <button
        onClick={handleRegenerate}
        className="px-6 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
      >
        Regenerate
      </button>
      <button
        onClick={handleSavePDF}
        className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
      >
        Save as PDF
      </button>
    </div>
  );
};

// 🎨 UPDATED SlotContent component
const SlotContent = ({ slot }) => {
  if (!slot) return <div className="h-16"></div>;

  switch (slot.type) {
    case "Lec":
    case "DoubleLec":
      return (
        <div className="p-2 flex justify-center items-center h-full">
          <p className="font text-xs text-slate-800">{slot.subject}</p>
          <p className="text-xs text-slate-500 mt-1">({slot.faculty})</p>
        </div>
      );
    case "LabBlock":
      return (
        <div className="flex flex-col h-full">
          {slot.details.map((d, index) => (
            <div
              key={index}
              // ✅ CHANGE: Removed the border classes from this line
              className="flex-1 flex justify-center items-center text-xs p-1"
            >
              <p className="font-semibold text-slate-700">
                {d.partition}: {d.lab}
              </p>
              <p className="text-slate-500">({d.faculty})</p>
            </div>
          ))}
        </div>
      );
    default:
      return <div className="h-16"></div>;
  }
};

// 🎨 UPDATED Timetable component
const Timetable = React.forwardRef(({ config, timetableData }, ref) => {
  let rowspanTracker = new Array(config.working_days.length).fill(0);
  let srNo = 0;

  return (
    <div
      ref={ref}
      className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200 p-2"
    >
      <table className="w-full border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 border border-slate-300 font-bold uppercase text-xs text-slate-600">
              Sr. No
            </th>
            <th className="p-2 border border-slate-300 font-bold uppercase text-xs text-slate-600">
              Time
            </th>
            {config.working_days.map((day) => (
              <th
                key={day}
                className="p-2 border border-slate-300 font-bold uppercase text-xs text-slate-600"
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
                  className="bg-indigo-50 font-bold"
                >
                  <td
                    colSpan={config.working_days.length + 2}
                    className="p-1 text-center border border-slate-300 text-indigo-800 text-xs tracking-wider"
                  >
                    {item.time}
                  </td>
                </tr>
              );
            }

            srNo++;
            const currentPeriodIndex = item.index;

            return (
              <tr key={item.time} className="text-center">
                <td className="p-2 border border-slate-300 font-bold text-sm text-slate-700 bg-slate-50">
                  {srNo}
                </td>
                <td className="p-2 border border-slate-300 font-semibold text-sm text-slate-700 bg-slate-50">
                  {item.time}
                </td>
                {timetableData.map((dayData, dayIndex) => {
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
                          className="p-2 align-middle border border-slate-300 bg-slate-50 text-slate-400"
                          rowSpan={periodBlockSize}
                        >
                          <div className="flex items-center justify-center h-full min-h-[5rem]">
                            <span className="transform -rotate-90 whitespace-nowrap tracking-widest uppercase font-bold text-lg">
                              HOLIDAY
                            </span>
                          </div>
                        </td>
                      );
                    }
                    return null;
                  }

                  if (rowspanTracker[dayIndex] > 0) {
                    rowspanTracker[dayIndex]--;
                    return null;
                  }

                  const slot = dayData.slots[currentPeriodIndex];
                  const rowSpan =
                    slot?.type === "DoubleLec" || slot?.type === "LabBlock"
                      ? 2
                      : 1;
                  if (rowSpan > 1) rowspanTracker[dayIndex] = rowSpan - 1;

                  const isCurrent = isCurrentSlot(dayData.name, item.time);
                  const cellClasses = `p-0 border border-slate-300 relative align-top ${
                    isCurrent ? "ring-2 ring-indigo-500 z-10" : ""
                  }`;

                  return (
                    <td
                      key={`${dayData.name}-${item.time}`}
                      className={cellClasses}
                      rowSpan={rowSpan}
                    >
                      {isCurrent && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
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
});

const Footer = ({ timetableId }) => (
  <footer className="text-center mt-8 text-sm text-gray-500">
    <p>
      Timetable ID: <span className="font-semibold">{timetableId}</span> |
      Generated on{" "}
      <span className="font-semibold">{new Date().toLocaleString()}</span>
    </p>
  </footer>
);

// --- Main ViewTimetable Component ---

const ViewTimetable = () => {
  const location = useLocation();
  const data = location.state?.timetableData;
  const timetableRef = useRef(null); // ✨ Create a ref for the timetable component

  if (!data || !data.success) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            No Timetable Data Found
          </h2>
          <p className="text-gray-700 mb-6">
            Please generate a timetable first to view the results.
          </p>
          <Link
            to="/dashboard/timetable/new/review"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back to Generate
          </Link>
        </div>
      </div>
    );
  }

  const divisions = Object.keys(data.timetable);
  const [currentDivision, setCurrentDivision] = useState(divisions[0]);

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

        {/* ✨ Action buttons are added here */}
        <ActionButtons timetableRef={timetableRef} />

        <Timetable
          ref={timetableRef} // Pass the ref to the Timetable component
          config={data.config}
          timetableData={data.timetable[currentDivision]}
        />
        <Footer timetableId={data.timetableId} />
      </div>
    </div>
  );
};

export default ViewTimetable;
