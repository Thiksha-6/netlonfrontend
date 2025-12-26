import React from "react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Header = ({ onLogout }) => {
  return (
    <header style={styles.header}>
      {/* Left */}
      <div style={styles.left}>
        <h2 style={styles.logo}>My ERP</h2>
      </div>

      {/* Right */}
      <div style={styles.right}>
        <FaUserCircle size={26} style={styles.userIcon} />
        <span style={styles.username}>Admin</span>
        <button style={styles.logoutBtn} onClick={onLogout}>
          <FaSignOutAlt /> Logout
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
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userIcon: {
    cursor: "pointer",
  },
  username: {
    fontSize: "14px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    background: "#fff",
    color: "#004aad",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Header;
