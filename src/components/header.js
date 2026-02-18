import React from "react";
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

const Header = ({ onLogout, onMenuToggle }) => {
  return (
    <header style={styles.header} className="header">
      <div style={styles.left}>
        
        {/* MOBILE TOGGLE BUTTON */}
        <button
          className="mobile-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>

        <h2 style={styles.logo}>Sri Raja Netlon</h2>
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo} className="user-info">
          <FaUserCircle size={26} />
          <span style={styles.username}>Admin</span>
        </div>

        <button style={styles.logoutBtn} onClick={onLogout} className="logout-btn">
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "70px",
    background: "linear-gradient(90deg, #004aad, #00bfff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    color: "#fff",
    zIndex: 1001,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "25px",
  },
  username: {
    fontSize: "15px",
    fontWeight: "500",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "#fff",
    color: "#004aad",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Header;
