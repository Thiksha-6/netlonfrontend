import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP validation (replace with API later)
    if (username && password) {
      console.log("Username:", username);
      console.log("Password:", password);

      onLogin(); // 🔥 THIS opens Dashboard
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login</h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        {/* Password */}
        <div style={styles.passwordBox}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
            required
          />
          <span
            style={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  form: {
    width: "320px",
    padding: "30px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  passwordInput: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  },
  eyeIcon: {
    padding: "10px",
    cursor: "pointer",
    color: "#555",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#004aad",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default LoginPage;
