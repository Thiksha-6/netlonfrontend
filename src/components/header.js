import React from "react";
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

const Header = ({ onLogout, onMenuToggle }) => {
  return (
    <header style={styles.header} className="header">
      <div style={styles.left}>
        {/* Menu Toggle Button - Now inside Header */}
        <button
          className="mobile-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          style={styles.menuButton}
        >
          <FaBars />
        </button>
        <h2 style={styles.logo}>Sri Raja Netlon</h2>
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo} className="user-info">
          <FaUserCircle size={26} style={styles.userIcon} />
          <span style={styles.username}>Admin</span>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout} className="logout-btn">
          <FaSignOutAlt />
          <span style={styles.logoutText} className="logout-text">Logout</span>
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
    boxSizing: "border-box",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  menuButton: {
    // This will be overridden by CSS class
    display: "none",
  },
  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
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
    backdropFilter: "blur(5px)",
  },
  userIcon: {
    cursor: "pointer",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
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
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  logoutText: {
    fontWeight: "600",
  },
};

// Add dynamic styles based on screen width
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 768px) {
    .header {
      height: 60px;
      padding: 0 15px 0 70px !important;
    }
    
    .logo {
      font-size: 18px;
    }
    
    .user-info {
      padding: 6px 12px;
      gap: 8px;
    }
    
    .username {
      font-size: 13px;
    }
    
    .logout-btn {
      padding: 8px 16px;
      font-size: 14px;
    }
    
    .user-icon {
      font-size: 22px;
    }
  }
  
  @media (max-width: 480px) {
    .header {
      padding-right: 10px;
    }
    
    .logo {
      font-size: 16px;
    }
    
    .user-info {
      display: none !important;
    }
    
    .logout-text {
      display: none !important;
    }
    
    .logout-btn {
      padding: 8px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logout-btn svg {
      margin: 0;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Header;