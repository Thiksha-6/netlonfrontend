import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
      onLogin();

    } catch (err) {
      console.error(err);
      setError("Server not reachable");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img 
            src="/asset/logo.png" 
            alt="Company Logo" 
            style={styles.logo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;base64," + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                  <rect width="80" height="80" fill="#004aad" rx="10"/>
                  <text x="40" y="35" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">SRI RAJA</text>
                  <text x="40" y="50" text-anchor="middle" fill="#ecf0f1" font-family="Arial" font-size="10">MOSQUITO NET</text>
                  <text x="40" y="65" text-anchor="middle" fill="#bdc3c7" font-family="Arial" font-size="8">SERVICES</text>
                </svg>
              `);
            }}
          />
          
        </div>

        <h3 style={styles.title}>Welcome Back</h3>
        <p style={styles.subtitle}>Please login to continue</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <div style={styles.passwordBox}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={styles.footerText}>
          © 2025 SRI RAJA MOSQUITO NETLON SERVICES
        </div>
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
    background: "linear-gradient(135deg, #004aad, #00bfff)",
    padding: "20px",
  },
  card: {
    width: "400px",
    maxWidth: "90%",
    padding: "40px 30px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  companyName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#004aad",
    margin: 0,
    lineHeight: "1.3",
  },
  title: {
    marginBottom: "8px",
    color: "#333",
    fontSize: "22px",
    fontWeight: "600",
  },
  subtitle: {
    marginBottom: "25px",
    fontSize: "14px",
    color: "#666",
  },
  error: {
    color: "#dc3545",
    fontSize: "14px",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "6px",
    border: "1px solid #f5c6cb",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    transition: "border 0.3s",
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "25px",
    transition: "border 0.3s",
  },
  passwordInput: {
    flex: 1,
    padding: "14px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    borderRadius: "8px 0 0 8px",
  },
  eyeIcon: {
    padding: "14px 15px",
    cursor: "pointer",
    color: "#666",
    backgroundColor: "#f8f9fa",
    borderRadius: "0 8px 8px 0",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #004aad, #00bfff)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 12px rgba(0, 74, 173, 0.3)",
  },
  footerText: {
    marginTop: "30px",
    fontSize: "12px",
    color: "#999",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
  },
};

// Add hover effects
Object.assign(styles.button, {
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 74, 173, 0.4)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
});

Object.assign(styles.input, {
  ':focus': {
    borderColor: '#004aad',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0, 74, 173, 0.1)',
  },
});

Object.assign(styles.passwordBox, {
  ':focus-within': {
    borderColor: '#004aad',
    boxShadow: '0 0 0 3px rgba(0, 74, 173, 0.1)',
  },
});

export default LoginPage;