import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "./IconsHeader/Logo.svg";
import support from "./IconsHeader/Support.svg";
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = () => {
    // Only close the menu if it is currently open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // This effect runs whenever the `isMenuOpen` state changes
  useEffect(() => {
    if (isMenuOpen) {
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Enable scrolling
      document.body.style.overflow = "unset";
    }

    // Cleanup function to re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    // e.g. Firebase logout or localStorage.clear()
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <>
      <div className="header-container">
        <nav className="header-nav">
          <a className="header-logo">
            <div className="header-logo-container">
              <img src={logo} className="header-logosvg"></img>
              <span className="header-part-1">timetable</span>
              <span className="header-part-2">master</span>
            </div>
          </a>
        </nav>

        <nav className="header-nav">
          <div className="header-right-container">
            <button className="header-support-btn">
              <img src={support}></img> Support
            </button>

            <div className="profile-button-container">
              <button className="profile-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  ></path>
                </svg>
                <span className="text">Sneh</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="arrow-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="header-hamburger-container" onClick={toggleMenu}>
              <div className="header-hamburger-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div
        className={`overlay ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>

      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="header-side">
          <div className="header-info-card-container">
            <div className="header-info-wrapper">
              <div className="header-info-avatar-container">
                <span className="header-info-avatar-text">TM</span>
              </div>
              <div className="header-info-user-details-wrapper">
                <h2 className="header-info-user-name" title="Sneh bera's Org">
                  Sneh bera's Org
                </h2>
                <p
                  className="header-info-user-email"
                  title="berasneh645@gmail.com"
                >
                  berasneh645@gmail.com
                </p>
              </div>
            </div>
            {isMenuOpen && (
              <button className="header-info-close-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="aside-close-container"
                  onClick={toggleMenu}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  ></path>
                </svg>
              </button>
            )}
          </div>

          <div className="side-wrapper">
            <div className="side-container">
              <h3 className="side-title">MAIN</h3>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `aside-btn ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"></path>
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"></path>
                </svg>
                <div className="aside-btn-text-container">
                  <div className="aside-btn-text">Dashboard</div>
                </div>
              </NavLink>

              {/* Corrected NavLink for Timetables */}
              <NavLink
                to="timetable"
                className={({ isActive }) =>
                  `aside-btn ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  ></path>
                </svg>
                <div>
                  <div className="aside-btn-text">My Timetables</div>
                </div>
              </NavLink>
              <h3 className="side-title">MANAGEMENT</h3>
              <NavLink
                to="user"
                end
                className={({ isActive }) =>
                  `aside-btn ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  ></path>
                </svg>
                <div>
                  <div className="aside-btn-text">User</div>
                </div>
              </NavLink>
              <NavLink
                to="Settings"
                className={({ isActive }) =>
                  `aside-btn ${isActive ? "active" : ""}`
                }
                onClick={handleNavLinkClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                  ></path>
                </svg>
                <div>
                  <div className="aside-btn-text">Settings</div>
                </div>
              </NavLink>

              <h3 className="side-title">ACCOUNT</h3>
              <NavLink
                to="/login"
                className={({ isActive }) => `aside-btn ${isActive ? "" : ""}`}
                onClick={handleLogout}
              >
                <div className="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  <div className="aside-btn-text">Logout</div>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
