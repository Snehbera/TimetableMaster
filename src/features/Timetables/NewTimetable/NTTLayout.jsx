import React from "react";
import { Outlet } from "react-router-dom";
import NewTimetableHeader from "./NewTimetableHeader"; // Assuming the header is in the same folder

/**
 * NTTLayout serves as the dedicated layout for the multi-step timetable creation process.
 * It provides a consistent frame, including a specific header and a content area
 * where the different steps of the form will be rendered via the <Outlet /> component.
 */

function NTTLayout() {
  return (
    <div className="ntt-layout-container">
      {/* Renders the header specific to the new timetable flow */}
      <NewTimetableHeader />

      {/* The content area for the steps */}
      <main className="ntt-main-content">
        {/* React Router will render the current step's component here (e.g., GeneralSettings) */}
        <Outlet />
      </main>
    </div>
  );
}

export default NTTLayout;
