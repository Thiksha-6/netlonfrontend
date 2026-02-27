import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const isMobile = windowWidth <= 480;

  return (
    <div style={styles.container}>
      <form style={{
        ...styles.card,
        padding: isMobile ? "30px 20px" : "40px 30px",
      }} onSubmit={handleLogin}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <img 
            src="/asset/logo.png" 
            alt="Company Logo" 
            style={{
              ...styles.logo,
              width: isMobile ? "80px" : "100px",
              height: isMobile ? "80px" : "100px",
            }}
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

        <h3 style={{
          ...styles.title,
          fontSize: isMobile ? "20px" : "22px",
        }}>Welcome Back</h3>
        <p style={{
          ...styles.subtitle,
          fontSize: isMobile ? "13px" : "14px",
        }}>Please login to continue</p>

        {error && (
          <p style={{
            ...styles.error,
            fontSize: isMobile ? "13px" : "14px",
            padding: isMobile ? "8px" : "10px",
          }}>{error}</p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          style={{
            ...styles.input,
            padding: isMobile ? "12px" : "14px",
            fontSize: isMobile ? "14px" : "15px",
          }}
          required
        />

        <div style={{
          ...styles.passwordBox,
          marginBottom: isMobile ? "20px" : "25px",
        }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              ...styles.passwordInput,
              padding: isMobile ? "12px" : "14px",
              fontSize: isMobile ? "14px" : "15px",
            }}
            required
          />
          <button
            type="button"
            style={{
              ...styles.eyeButton,
              padding: isMobile ? "12px 15px" : "14px 15px",
            }}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={isMobile ? 18 : 20} /> : <FaEye size={isMobile ? 18 : 20} />}
          </button>
        </div>

        <button 
          type="submit" 
          style={{
            ...styles.button,
            padding: isMobile ? "12px" : "14px",
            fontSize: isMobile ? "15px" : "16px",
          }} 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{
          ...styles.footerText,
          fontSize: isMobile ? "11px" : "12px",
          marginTop: isMobile ? "25px" : "30px",
          paddingTop: isMobile ? "12px" : "15px",
        }}>
          © 2025 SRI RAJA MOSQUITO NETLON SERVICES
        </div>
      </form>

      {/* Add CSS for hover effects */}
      <style jsx>{`
        input:focus {
          border-color: #004aad !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 74, 173, 0.1);
        }
        .password-container:focus-within {
          border-color: #004aad !important;
          box-shadow: 0 0 0 3px rgba(0, 74, 173, 0.1);
        }
        button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 74, 173, 0.4);
        }
        button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }
        .eye-button:hover {
          background-color: #e9ecef;
        }
      `}</style>
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
    margin: 0,
    boxSizing: "border-box",
  },
  card: {
    width: "400px",
    maxWidth: "100%",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
    boxSizing: "border-box",
    margin: 0,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  logo: {
    objectFit: "contain",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "8px",
    color: "#333",
    fontWeight: "600",
  },
  subtitle: {
    marginBottom: "25px",
    color: "#666",
  },
  error: {
    color: "#dc3545",
    marginBottom: "15px",
    backgroundColor: "#f8d7da",
    borderRadius: "6px",
    border: "1px solid #f5c6cb",
    textAlign: "left",
    wordBreak: "break-word",
  },
  input: {
    width: "100%",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    transition: "border 0.3s",
    boxSizing: "border-box",
    display: "block",
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    transition: "border 0.3s",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
  },
  passwordInput: {
    flex: 1,
    border: "none",
    outline: "none",
    borderRadius: "8px 0 0 8px",
    width: "calc(100% - 50px)",
    boxSizing: "border-box",
  },
  eyeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#666",
    backgroundColor: "#f8f9fa",
    border: "none",
    borderLeft: "1px solid #ddd",
    transition: "background-color 0.2s",
    height: "100%",
    margin: 0,
    outline: "none",
  },
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #004aad, #00bfff)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 12px rgba(0, 74, 173, 0.3)",
    boxSizing: "border-box",
  },
  footerText: {
    color: "#999",
    borderTop: "1px solid #eee",
    wordBreak: "break-word",
  },
};

// Add CSS stylesheet for additional hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .eye-button:hover {
    background-color: #e9ecef !important;
  }
  .eye-button:active {
    background-color: #dee2e6 !important;
  }
  button[type="submit"]:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  @media (max-width: 480px) {
    .login-card {
      padding: 30px 20px;
    }
    input, .eye-button {
      font-size: 14px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default LoginPage;