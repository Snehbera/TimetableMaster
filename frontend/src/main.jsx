import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./Layout.jsx";
import Mytimetables from "./features/Timetables/Timetables.jsx";
import Dashboard from "./features/Dashboard/Dashboard.jsx";
import Settings from "./features/Settings/Settings.jsx";
import User from "./features/User/User.jsx";

import Landing from "./features/Landing/Landing.jsx";
import Login from "./features/Login/Login.jsx";
import Signup from "./features/Signup/Signup.jsx";

import NTTLayout from "./features/Timetables/NewTimetable/NTTLayout.jsx";
import GeneralSettings from "./features/Timetables/NewTimetable/Steps/GeneralSettings.jsx";
import Subjects from "./features/Timetables/NewTimetable/Steps/Subjects.jsx";
import Faculty from "./features/Timetables/NewTimetable/Steps/Faculty.jsx";
import Classes from "./features/Timetables/NewTimetable/Steps/Classes.jsx";
import Rooms from "./features/Timetables/NewTimetable/Steps/Rooms.jsx";
import GeneratedJSON from "./features/Timetables/NewTimetable/Steps/ReviewGenerate.jsx";
import Viewtimetable from "./features/Timetables/NewTimetable/Steps/Viewtimetable.jsx";

const router = createBrowserRouter([
  // Route for the landing page
  {
    path: "/",
    element: <Landing />,
  },
  // Route for the login page
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  // Route for the MAIN dashboard area (uses the main Header)
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        path: "", // This will be the default view for the path above
        element: <Dashboard />,
      },
      {
        path: "timetable",
        // NOTE: No children here anymore!
        element: <Mytimetables />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "user",
        element: <User />,
      },
    ],
  },

  // ✨ CORRECTED PART: New top-level route for the timetable generator ✨
  // This is a SIBLING to the "/dashboard" route above.
  // It uses its own layout (NTTLayout) and will unmount the old one.
  {
    path: "/dashboard/timetable/new", // A clear, descriptive path
    element: <NTTLayout />,
    children: [
      {
        path: "", // This will be the default view for the path above
        element: <GeneralSettings />,
      },
      {
        path: "subjects",
        element: <Subjects />,
      },
      {
        path: "faculty",
        element: <Faculty />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "rooms",
        element: <Rooms />,
      },
      {
        path: "review",
        element: <GeneratedJSON />,
      },
    ],
  },
  // 👇 ADD THIS NEW TOP-LEVEL ROUTE FOR VIEWING THE TIMETABLE
  // This is now a separate route and is not nested inside the "new" flow.
  {
    path: "/dashboard/timetable/Viewtimetable", // ✅ This path is lowercase and matches the navigate() call
    element: <Viewtimetable />, // Renders the ViewTimetable component directly
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
