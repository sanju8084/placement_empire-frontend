import React, { useState } from "react";
import "./Login.css"; // Add this line

const Login = ({ setIsAdmin }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
    } else {
      alert("Incorrect admin password.");
    }
  };

  return (
    <div className="login-box">
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login as Admin</button>
    </div>
  );
};

export default Login;
