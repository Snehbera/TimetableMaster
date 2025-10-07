import React from "react";
import "./Timetables.css";
import "../styles/Hero-container.css";
import { Link, NavLink } from "react-router";

function Mytimetable() {
  return (
    <>
      <div className="Hero-wrapper">
        <div className="Hero-container">
          <div className="Hero-content">
            <header className="mytimetable-header">
              <div className="mytimetable-header-text">
                <h1>My Timetables</h1>
                <p>Manage all your timetables and track their status</p>
              </div>
              <div className="mytimetable-header-action">
                <Link
                  className="mytimetable-btn myt-btn-primary"
                  to="/dashboard/timetable/new"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon-sm"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    ></path>
                  </svg>
                  New Timetable
                </Link>
              </div>
            </header>

            {/* <!-- Stats Grid Section --> */}
            <div className="myt-stats-grid">
              <div className="myt-stat-card">
                <div className="myt-icon-wrapper myt-bg-blue">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon myt-text-blue"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="myt-stat-label">Total Timetables</p>
                  <p className="myt-stat-value">1</p>
                </div>
              </div>
              <div className="myt-stat-card">
                <div className="myt-icon-wrapper myt-bg-green">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon myt-text-green"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="myt-stat-label">Published</p>
                  <p className="myt-stat-value">0</p>
                </div>
              </div>
              <div className="myt-stat-card">
                <div className="myt-icon-wrapper myt-bg-amber">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon myt-text-amber"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="myt-stat-label">Drafts</p>
                  <p className="myt-stat-value">1</p>
                </div>
              </div>
            </div>

            {/* <!-- Timetables Section --> */}
            <div className="timetables-section">
              {/* <!-- Published Timetables --> */}
              <div className="timetable-group">
                <h3 className="section-heading">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon myt-text-green"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    ></path>
                  </svg>
                  Published Timetables
                </h3>
                <div className="myt-empty-state myt-bg-green">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon-lg myt-text-green"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    ></path>
                  </svg>
                  <p className="myt-empty-state-title myt-text-green">
                    No published timetables
                  </p>
                  <p className="myt-empty-state-subtitle myt-text-green">
                    Publish a timetable to start using the substitute management
                    system.
                  </p>
                </div>
              </div>

              {/* <!-- Draft Timetables --> */}
              <div className="timetable-group">
                <h3 className="section-heading">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="myt-icon myt-text-gray"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    ></path>
                  </svg>
                  Draft Timetables
                </h3>
                <div className="myt-timetable-card">
                  <div className="myt-card-main-content">
                    <div className="myt-avatar">AB</div>
                    <div className="myt-card-info">
                      <div className="myt-card-title-row">
                        <h3 className="myt-card-title">Atmiya BY</h3>
                        <span className="myt-status-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="myt-icon-xs"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            ></path>
                          </svg>
                          Draft
                        </span>
                      </div>
                      <div className="myt-card-details">
                        <div className="myt-detail-item">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="myt-icon-sm"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            ></path>
                          </svg>
                          <span>Updated: Sep 4, 2025</span>
                        </div>
                        <div className="myt-detail-item">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="myt-icon-sm"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            ></path>
                          </svg>
                          <span>Created: Sep 4, 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="myt-card-actions">
                    <button
                      type="button"
                      className="mytimetable-btn myt-btn-sm myt-btn-success"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="myt-icon-sm"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        ></path>
                      </svg>
                      Publish
                    </button>
                    <button
                      type="button"
                      className="mytimetable-btn myt-btn-sm myt-btn-secondary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="myt-icon-sm"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        ></path>
                      </svg>
                      Edit
                    </button>
                    <button className="myt-btn-more">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="myt-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Mytimetable;
