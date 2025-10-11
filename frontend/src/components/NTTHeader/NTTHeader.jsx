import React from "react";
import "./NTTHeader.css";
import { Link, NavLink } from "react-router-dom";

// Helper function to create an SVG icon
const createIcon = (paths) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    {paths.map((path, i) => (
      <path key={i} strokeLinecap="round" strokeLinejoin="round" d={path} />
    ))}
  </svg>
);

function NTTHeader() {
  const navItems = [
    {
      path: "/dashboard/timetable/new",
      label: "General Settings",
      icon: createIcon([
        "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z",
        "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
      ]),
    },
    {
      path: "/dashboard/timetable/new/subjects",
      label: "Subjects/Courses",
      icon: createIcon([
        "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
      ]),
    },
    {
      path: "/dashboard/timetable/new/faculty",
      label: "Faculty/Instructor",
      icon: createIcon([
        "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
      ]),
      noDividerBefore: true,
    },
    {
      path: "/dashboard/timetable/new/classes",
      label: "Lab/Lectures",
      icon: createIcon([
        "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
      ]),
      noDividerBefore: true,
    },
    {
      path: "/dashboard/timetable/new/rooms",
      label: "Rooms",
      icon: createIcon([
        "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
      ]),
      noDividerBefore: true,
    },
    {
      path: "/dashboard/timetable/new/review",
      label: "Review & Generate",
      icon: createIcon([
        "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
      ]),
      noDividerBefore: true,
    },
    {
      path: "/dashboard/timetable/new/Viewtimetable",
      label: "View Timetable",
      icon: createIcon([
        "M69.76,4.06C69.76,1.83,72,0,74.71,0s5,1.81,5,4.06V21.8c0,2.23-2.2,4.06-5,4.06s-4.95-1.81-4.95-4.06V4.06ZM87.08,75.55a3.16,3.16,0,1,1,6.31,0V89.36h9.86a3.16,3.16,0,1,1,0,6.31h-13a3.17,3.17,0,0,1-3.16-3.16v-17Zm-72.71,2.5H25.71A1.31,1.31,0,0,1,27,79.36v8.38a1.31,1.31,0,0,1-1.31,1.31H14.37a1.31,1.31,0,0,1-1.31-1.31V79.36a1.31,1.31,0,0,1,1.31-1.31ZM57.79,54.17H69.13a1.32,1.32,0,0,1,.9.36A40.37,40.37,0,0,0,58.66,65.18h-.87a1.31,1.31,0,0,1-1.31-1.31V55.49a1.32,1.32,0,0,1,1.31-1.32Zm-21.71,0H47.42a1.31,1.31,0,0,1,1.31,1.31v8.38a1.31,1.31,0,0,1-1.31,1.31H36.08a1.31,1.31,0,0,1-1.31-1.31V55.48a1.31,1.31,0,0,1,1.31-1.31Zm-21.71,0H25.71A1.31,1.31,0,0,1,27,55.48v8.38a1.31,1.31,0,0,1-1.31,1.31H14.37a1.31,1.31,0,0,1-1.31-1.31V55.48a1.31,1.31,0,0,1,1.31-1.31ZM36.08,78.05H47.42a1.31,1.31,0,0,1,1.31,1.31v8.38a1.31,1.31,0,0,1-1.31,1.31H36.08a1.31,1.31,0,0,1-1.31-1.31V79.36a1.31,1.31,0,0,1,1.31-1.31Zm67.41-18.51a31.41,31.41,0,1,1-43.43,29A31.92,31.92,0,0,1,79.61,59.33a33.06,33.06,0,0,1,23.88.21Zm6.63,10.87c-13-13-34.95-9.33-42.56,7A26.36,26.36,0,1,0,115.2,77a24.36,24.36,0,0,0-5.08-6.62ZM25.33,4.06c0-2.23,2.2-4.06,5-4.06s4.95,1.81,4.95,4.06V21.8c0,2.23-2.21,4.06-4.95,4.06s-5-1.81-5-4.06V4.06ZM99.66,38.8V18.37a2.46,2.46,0,0,0-.73-1.76,2.51,2.51,0,0,0-1.76-.73h-9a2.74,2.74,0,1,1,0-5.48h9a8,8,0,0,1,8,8V50.82a41,41,0,0,0-5.56-1.49V44.26H5.45V97.17a2.46,2.46,0,0,0,.73,1.76,2.51,2.51,0,0,0,1.76.73H52.71a40.27,40.27,0,0,0,1.92,5.54H8a8,8,0,0,1-8-8V18.39a8,8,0,0,1,8-8h9.64a2.74,2.74,0,1,1,0,5.48H8a2.46,2.46,0,0,0-1.76.73,2.51,2.51,0,0,0-.73,1.76V38.8ZM43.13,15.87a2.74,2.74,0,0,1,0-5.48H61.52a2.74,2.74,0,1,1,0,5.48Z",
      ]),
      noDividerBefore: true,
    },
    // Add other nav items here...
  ];

  return (
    <div className="ntt-header-bar">
      <div className="ntt-header-part1">
        <div className="ntt-header-left-section">
          <Link to="/dashboard">
            <button className="ntt-header-back-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="ntt-header-back-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                ></path>
              </svg>
            </button>
          </Link>
          <div className="ntt-header-timetable-icon-wrapper">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              className="ntt-header-timetable-icon"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
            </svg>
          </div>
          <div className="ntt-header-title-wrapper">
            <h1 className="ntt-header-title">Edit Timetable</h1>
            <p className="ntt-header-subtitle">Untitled</p>
          </div>
        </div>
      </div>

      <div className="ntt-header-tabs-container">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {/*
              This logic now checks for the 'noDividerBefore' flag.
              The '!' means "not".
            */}
            {index > 0 && !item.noDividerBefore && (
              <div className="ntt-header-tab-divider" />
            )}

            <NavLink
              to={item.path}
              end={item.path === "/dashboard/timetable/new"}
              className={({ isActive }) =>
                isActive
                  ? "ntt-header-tab ntt-header-tab-active"
                  : "ntt-header-tab"
              }
            >
              {/* ... icon and label ... */}
              <div className="ntt-header-tab-icon">{item.icon}</div>
              <span>{item.label}</span>
            </NavLink>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default NTTHeader;
