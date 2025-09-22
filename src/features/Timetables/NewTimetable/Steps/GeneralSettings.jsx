import React from "react";
import "./GeneralSettings.css";

function GeneralSettings() {
  return (
    <>
      <div className="s1-main-wrapper">
        <div className="s1-content-area">
          <div className="s1-content-inner">
            <div className="s1-card s1-mb-6">
              <div className="s1-card-header">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="s1-card-icon-main"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  ></path>
                </svg>
                <h2 className="s1-card-title">Timetable Name</h2>
              </div>
              <input
                placeholder="e.g., Greenfield High School 2023-2024"
                className="s1-input-field"
                type="text"
                value="Untitled"
              />
            </div>

            <div className="s1-card s1-mb-6">
              <div className="s1-card-header s1-mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="s1-card-icon-main"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  ></path>
                </svg>
                <h2 className="s1-card-title">Time Settings</h2>
              </div>
              <div className="s1-grid-col-1 s1-gap-6 s1-mb-6">
                <div>
                  <label className="s1-label">Periods Per Day</label>
                  <input
                    min="0"
                    className="s1-input-field"
                    type="number"
                    value="6"
                  />
                </div>
              </div>
              <button type="button" className="s1-link-button s1-mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className="s1-link-button-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  ></path>
                </svg>
                Show Period &amp; Break Timings
              </button>
            </div>

            <div className="s1-card s1-mb-6">
              <div className="s1-card-header s1-justify-between s1-mb-6">
                <div className="s1-card-header s1-card-header-480px">
                  <div className="s1-p3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="s1-card-icon-main"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      ></path>
                    </svg>
                    <h2 className="s1-card-title">Days Configuration</h2>
                  </div>
                  <span className="s1-days-count">
                    (6 school days selected)
                  </span>
                </div>
                {/* <div className="s1-switch-button-wrapper">
                            <span className="s1-switch-text">Weekly Timetable</span>
                            <button type="button" className="s1-switch-button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="s1-switch-button-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"></path>
                                </svg>
                                <span>Switch to Fortnightly</span>
                            </button>
                        </div> */}
              </div>
              <div className="s1-mb-4">
                <p className="s1-description-text s1-mb-3">
                  Select which days are school days. The remaining days will be
                  considered days off.
                </p>
                <div className="s1-days-grid">
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-active"
                  >
                    <span className="s1-day-button-text">Sun</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-check-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-active"
                  >
                    <span className="s1-day-button-text">Mon</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-check-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-active"
                  >
                    <span className="s1-day-button-text">Tue</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-check-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-active"
                  >
                    <span className="s1-day-button-text">Wed</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-check-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-active"
                  >
                    <span className="s1-day-button-text">Thu</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-check-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-active"
                  >
                    <span className="s1-day-button-text">Fri</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-check-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="s1-day-button s1-day-button-inactive"
                  >
                    <span className="s1-day-button-text">Sat</span>
                    <span className="s1-day-button-icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        className="s1-cross-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div className="s1-days-summary-grid s1-mt-6">
                <div className="s1-school-days-card">
                  <h3 className="s1-summary-title">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="s1-summary-icon-green"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      ></path>
                    </svg>
                    School Days
                  </h3>
                  <div className="s1-flex-wrap s1-gap-2">
                    <div className="s1-summary-day-tag">
                      <span className="s1-summary-day-text">Sunday</span>
                    </div>
                    <div className="s1-summary-day-tag">
                      <span className="s1-summary-day-text">Monday</span>
                    </div>
                    <div className="s1-summary-day-tag">
                      <span className="s1-summary-day-text">Tuesday</span>
                    </div>
                    <div className="s1-summary-day-tag">
                      <span className="s1-summary-day-text">Wednesday</span>
                    </div>
                    <div className="s1-summary-day-tag">
                      <span className="s1-summary-day-text">Thursday</span>
                    </div>
                    <div className="s1-summary-day-tag">
                      <span className="s1-summary-day-text">Friday</span>
                    </div>
                  </div>
                </div>
                <div className="s1-days-off-card">
                  <h3 className="s1-summary-title">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      className="s1-summary-icon-orange"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      ></path>
                    </svg>
                    Days Off
                  </h3>
                  <div className="s1-flex-wrap s1-gap-2">
                    <div className="s1-summary-day-tag s1-summary-day-tag-off">
                      <span className="s1-summary-day-text">Saturday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="s1-navigation-container s1-mt-6">
              <div className="s1-navigation-inner">
                <button
                  disabled=""
                  type="button"
                  className="s1-nav-button s1-nav-button-disabled"
                  aria-disabled="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="s1-nav-button-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    ></path>
                  </svg>
                  Previous
                </button>
                <div className="s1-step-indicator">
                  Step <span className="s1-step-current">1</span> of{" "}
                  <span className="s1-step-total">7</span>
                </div>
                <button
                  type="button"
                  className="s1-nav-button s1-nav-button-primary"
                  aria-disabled="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="s1-nav-button-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                    ></path>
                  </svg>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="s1-sidebar">
            <div className="s1-sidebar-sticky">
                <div className="s1-tips-card">
                    <div className="s1-tips-header">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-icon-main" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                        </svg>
                        <h3 className="s1-tips-title">Tips &amp; Tricks</h3>
                    </div>
                    <div className="s1-tips-list-container">
                        <div className="s1-tips-item">
                            <div className="s1-tips-item-icon-wrapper">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                                </svg>
                            </div>
                            <p className="s1-tips-item-text">Give a name to the timetable.</p>
                        </div>
                        <div className="s1-tips-item">
                            <div className="s1-tips-item-icon-wrapper">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                                </svg>
                            </div>
                            <p className="s1-tips-item-text">Add your desired number of periods.</p>
                        </div>
                        <div className="s1-tips-item">
                            <div className="s1-tips-item-icon-wrapper">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                                </svg>
                            </div>
                            <p className="s1-tips-item-text">Optionally you can add the period timings also, not required.</p>
                        </div>
                        <div className="s1-tips-item">
                            <div className="s1-tips-item-icon-wrapper">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                                </svg>
                            </div>
                            <p className="s1-tips-item-text">Optionally you can add breaks too if you want them to be shown in the printed timetable.</p>
                        </div>
                        <div className="s1-tips-item">
                            <div className="s1-tips-item-icon-wrapper">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                                </svg>
                            </div>
                            <p className="s1-tips-item-text">Select the days when your institute is operational.</p>
                        </div>
                        <div className="s1-tips-item">
                            <div className="s1-tips-item-icon-wrapper">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" className="s1-tips-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path>
                                </svg>
                            </div>
                            <p className="s1-tips-item-text">You can also switch to fortnightly timetable if your institute has bi-weekly schedule.</p>
                        </div>
                    </div>
                    <div className="s1-tips-video-wrapper">
                        <a href="https://www.youtube.com/watch?v=HfUks3epbt4" target="_blank" rel="noopener noreferrer" className="s1-video-tutorial-link">
                            <div className="s1-video-tutorial-card">
                                <div className="s1-video-icon-wrapper">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="s1-video-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="s1-video-tutorial-title">Demo Video Tutorial</div>
                                    <div className="s1-video-tutorial-subtitle">Click to watch in a new tab</div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="s1-help-card s1-mt-4">
                    <div className="s1-help-card-content">
                        <div className="s1-help-icon-wrapper">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="s1-help-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                            </svg>
                        </div>
                        <h4 className="s1-help-title">Need help?</h4>
                        <p className="s1-help-text">A timetable assistant will be there to answer your questions.</p>
                        <a target="_blank" rel="noopener noreferrer" className="s1-schedule-call-button" href="https://cal.com/timetablemaster/30min">Schedule a Call</a>
                    </div>
                </div>
            </div>
        </div> */}
      </div>
    </>
  );
}

export default GeneralSettings;
