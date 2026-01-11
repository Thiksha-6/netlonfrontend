import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaTimes
} from "react-icons/fa";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileMenuOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
    { name: "Quotation", icon: <FaFileInvoiceDollar />, path: "/quotation" },
    { name: "Invoice", icon: <FaFileInvoiceDollar />, path: "/invoice" },
  ];

  const handleItemClick = (path) => {
    setActive(path);
    if (windowWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          transform: windowWidth <= 768 ? 
            (isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)") : 
            "translateX(0)"
        }}
        className="sidebar"
      >
        <div style={styles.sidebarHeader}>
          <h3 style={styles.title}>ERP Panel</h3>
          {windowWidth <= 768 && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={styles.closeButton}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <ul style={styles.menu}>
          {menuItems.map((item) => (
            <li
              key={item.name}
              style={{
                ...styles.item,
                ...(active === item.path ? styles.activeItem : {}),
              }}
              onClick={() => handleItemClick(item.path)}
              className="sidebar-item"
            >
              <Link
                to={item.path}
                style={styles.link}
              >
                <span style={styles.icon} className="icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div style={styles.sidebarFooter}>
          <p style={styles.version}>Version 1.0.0</p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && windowWidth <= 768 && (
        <div 
          style={styles.overlay} 
          onClick={() => setIsMobileMenuOpen(false)}
          className="sidebar-overlay"
        />
      )}
    </>
  );
};

const styles = {
  sidebar: {
    position: "fixed",
    top: "70px",
    left: 0,
    width: "250px",
    height: "calc(100vh - 70px)",
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: "20px 0",
    boxShadow: "2px 0 20px rgba(0,0,0,0.2)",
    zIndex: 1000,
    overflowY: "auto",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "1px",
    margin: 0,
  },
  closeButton: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px",
    display: "none",
  },
  menu: {
    listStyle: "none",
    padding: "0 15px",
    margin: 0,
    flex: 1,
  },
  item: {
    padding: "14px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#fff",
    textDecoration: "none",
    width: "100%",
  },
  icon: {
    fontSize: "16px",
    width: "20px",
    textAlign: "center",
  },
  activeItem: {
    backgroundColor: "#2563eb",
    boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  sidebarFooter: {
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: "auto",
    textAlign: "center",
  },
  version: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    margin: 0,
  },
};

// Add responsive styles
const sidebarStyleSheet = document.createElement("style");
sidebarStyleSheet.textContent = `
  @media (max-width: 768px) {
    .sidebar {
      width: 280px !important;
      top: 60px !important;
      height: calc(100vh - 60px) !important;
    }
    
    .close-button {
      display: block !important;
    }
    
    .sidebar-item {
      padding: 16px 20px !important;
      font-size: 16px !important;
      margin-bottom: 10px !important;
    }
    
    .icon {
      font-size: 18px !important;
      width: 24px !important;
    }
    
    .title {
      font-size: 17px !important;
    }
  }
  
  @media (max-width: 480px) {
    .sidebar {
      width: 85vw !important;
    }
    
    .menu-text {
      font-size: 16px !important;
    }
  }
`;
document.head.appendChild(sidebarStyleSheet);

export default Sidebar;