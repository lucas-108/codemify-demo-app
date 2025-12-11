import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Valid users
  const validUsers = [
    "standard_user",
    "locked_out_user"
  ];
  const validPassword = "my_secret_code";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate username
    if (!username) {
      setError("Username is required");
      return;
    }

    // Validate password
    if (!password) {
      setError("Password is required");
      return;
    }

    // Check if user is locked out
    if (username === "locked_out_user") {
      setError("Sorry, this user has been locked out.");
      return;
    }

    // Check if username is valid
    if (!validUsers.includes(username)) {
      setError("Username and password do not match any user in this service");
      return;
    }

    // Check password
    if (password !== validPassword) {
      setError("Username and password do not match any user in this service");
      return;
    }

    // Successful login
    onLogin(username);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">🛒 Codemify Store</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Please login to continue</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-test="username"
          />
          
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-test="password"
          />
          
          {error && <div className="login-error" data-test="error">{error}</div>}
          
          <button type="submit" className="login-button" data-test="login-button">
            Login
          </button>
        </form>

        <div className="login-credentials">
          <div className="credentials-section">
            <h3>Accepted usernames are:</h3>
            <p>standard_user</p>
            <p>locked_out_user</p>
          </div>
          
          <div className="credentials-section">
            <h3>Password for all users:</h3>
            <p>my_secret_code</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
