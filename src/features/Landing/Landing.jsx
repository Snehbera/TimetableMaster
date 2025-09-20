import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-container">
      <h1>Welcome to Your App</h1>
      <p>This is the landing page. Please log in to continue.</p>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
}

export default Landing;
