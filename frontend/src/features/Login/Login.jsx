import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  // Simulate a successful login and redirect
  const handleLogin = () => {
    // In a real app, you would have your authentication logic here.
    // For now, we'll just navigate directly.
    console.log("Login successful, redirecting to dashboard...");
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      {/* You can add your form inputs here */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;