import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaTimes,
  FaBars,
  FaBoxes,
  FaFileAlt,
  FaCog,
  FaUser
} from "react-icons/fa";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setIsCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileMenuOpen]);

  useEffect(() => {
    if (windowWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, windowWidth, setIsMobileMenuOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
    { name: "Quotation", icon: <FaFileInvoiceDollar />, path: "/quotation" },
    { name: "Inventory", icon: <FaBoxes />, path: "/inventory" },
  ];

  const handleItemClick = (path) => {
    setActive(path);
    if (windowWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsAnimating(true);
    if (windowWidth > 768) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sidebarWidth = windowWidth <= 768 
    ? "85vw" 
    : isCollapsed && !isHovered 
      ? "80px" 
      : "250px";

  const shouldShowSidebar = windowWidth <= 768 
    ? isMobileMenuOpen 
    : true;

  const shouldCollapse = windowWidth > 768 && isCollapsed && !isHovered;

  // Calculate button positions with smooth transitions
  const getCollapseButtonLeft = () => {
    if (shouldCollapse) {
      return isAnimating ? "85px" : "90px";
    }
    return isAnimating ? "255px" : "260px";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {windowWidth <= 768 && (
        <button
          onClick={toggleSidebar}
          style={{
            ...styles.menuButton,
            transform: isMobileMenuOpen ? 'scale(0.9)' : 'scale(1)',
            opacity: isMobileMenuOpen ? 0 : 1,
            pointerEvents: isMobileMenuOpen ? 'none' : 'auto',
          }}
          className="mobile-menu-button"
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>
      )}

      {/* Desktop Collapse Button */}
      {windowWidth > 768 && (
        <button
          onClick={toggleSidebar}
          style={{
            ...styles.collapseButton,
            left: getCollapseButtonLeft(),
            transform: `rotate(${shouldCollapse ? 180 : 0}deg)`,
            opacity: isHovered ? 1 : 0.9,
          }}
          className="collapse-button"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          width: sidebarWidth,
          transform: windowWidth <= 768 
            ? (isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)")
            : "translateX(0)",
          transition: isAnimating 
            ? "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
            : "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={() => {
          if (windowWidth > 768) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (windowWidth > 768) {
            setIsHovered(false);
          }
        }}
        className={`sidebar ${shouldCollapse ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <div style={{
          ...styles.sidebarHeader,
          transition: 'padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: shouldCollapse ? '0 10px 20px' : '0 20px 20px',
        }}>
          {!shouldCollapse ? (
            <h3 style={{
              ...styles.title,
              animation: isAnimating ? 'none' : 'fadeIn 0.3s ease',
            }}>ERP System</h3>
          ) : (
            <h3 style={styles.collapsedTitle}>ERP</h3>
          )}
          
          {windowWidth <= 768 && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                ...styles.closeButton,
                transform: 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              aria-label="Close menu"
              className="close-button"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <ul style={styles.menu}>
          {menuItems.map((item, index) => (
            <li
              key={item.name}
              style={{
                ...styles.item,
                ...(active === item.path ? styles.activeItem : {}),
                ...(shouldCollapse ? styles.collapsedItem : {}),
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideIn 0.3s ease ${index * 0.05}s both`,
              }}
              onClick={() => handleItemClick(item.path)}
              className={`sidebar-item ${active === item.path ? 'active' : ''}`}
              title={shouldCollapse ? item.name : ''}
            >
              <Link
                to={item.path}
                style={{
                  ...styles.link,
                  justifyContent: shouldCollapse ? 'center' : 'flex-start',
                }}
              >
                <span style={{
                  ...styles.icon,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: active === item.path ? 'scale(1.1)' : 'scale(1)',
                }} className="icon">{item.icon}</span>
                {!shouldCollapse && (
                  <span 
                    style={{
                      animation: isAnimating ? 'none' : 'fadeIn 0.3s ease',
                    }}
                    className="menu-text"
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        <div style={{
          ...styles.sidebarFooter,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: shouldCollapse ? '15px 5px' : '20px',
        }}>
          {!shouldCollapse ? (
            <p style={styles.version}>Version 2.0.0</p>
          ) : (
            <p style={styles.version}>v2.0</p>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && windowWidth <= 768 && (
        <div 
          style={{
            ...styles.overlay,
            animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }} 
          onClick={() => setIsMobileMenuOpen(false)}
          className="sidebar-overlay"
        />
      )}
    </>
  );
};

const styles = {
  menuButton: {
    position: "fixed",
    top: "15px",
    left: "15px",
    zIndex: 1100,
    background: "#2563eb",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  collapseButton: {
    position: "fixed",
    top: "85px",
    zIndex: 1001,
    background: "#2563eb",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: "0 8px 8px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: "20px 0",
    boxShadow: "2px 0 20px rgba(0,0,0,0.2)",
    zIndex: 1000,
    overflowY: "auto",
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
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "1px",
    margin: 0,
    background: "linear-gradient(45deg, #fff, #e0f2fe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  collapsedTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
  closeButton: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    listStyle: "none",
    padding: "0 15px",
    margin: 0,
    flex: 1,
  },
  item: {
    padding: "12px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    marginBottom: "6px",
  },
  collapsedItem: {
    padding: "12px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: "18px",
    width: "24px",
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
    backdropFilter: "blur(4px)",
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

// Add improved responsive styles and animations
const sidebarStyleSheet = document.createElement("style");
sidebarStyleSheet.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 85vw !important;
      top: 0 !important;
      left: 0 !important;
      box-shadow: 0 0 30px rgba(0,0,0,0.3) !important;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .sidebar.collapsed {
      width: 85vw !important;
    }
    
    .close-button {
      display: flex !important;
    }
    
    .mobile-menu-button {
      display: flex !important;
    }
    
    .collapse-button {
      display: none !important;
    }
    
    .sidebar-item {
      padding: 16px 20px !important;
      font-size: 16px !important;
      margin-bottom: 8px !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .sidebar-item:active {
      transform: scale(0.98);
    }
    
    .sidebar-item.active {
      background: #2563eb !important;
    }
    
    .icon {
      font-size: 20px !important;
      width: 26px !important;
    }
    
    .menu-text {
      font-size: 16px !important;
      font-weight: 500 !important;
    }
    
    .sidebar-overlay {
      animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
  }
  
  @media (max-width: 480px) {
    .sidebar {
      width: 90vw !important;
    }
    
    .menu-text {
      font-size: 15px !important;
    }
    
    .mobile-menu-button {
      top: 12px !important;
      left: 12px !important;
      padding: 8px 10px !important;
      font-size: 18px !important;
    }
  }
  
  /* Custom scrollbar for sidebar */
  .sidebar::-webkit-scrollbar {
    width: 4px;
  }
  
  .sidebar::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    transition: background 0.3s ease;
  }
  
  .sidebar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  
  .sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }
  
  /* Hover effects with smooth transitions */
  .sidebar-item {
    position: relative;
    overflow: hidden;
  }
  
  .sidebar-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: rgba(255,255,255,0.1);
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }
  
  .sidebar-item:hover::before {
    width: 100%;
  }
  
  .sidebar-item.active:hover::before {
    background: rgba(255,255,255,0.2);
  }
  
  .close-button:hover {
    background: rgba(255,255,255,0.2) !important;
  }
  
  .mobile-menu-button:hover,
  .collapse-button:hover {
    background: #1d4ed8 !important;
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(37,99,235,0.4);
  }
  
  /* Smooth width transition for sidebar */
  .sidebar {
    will-change: transform, width;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
  }
  
  /* Icon animation */
  .icon {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar-item:hover .icon {
    transform: scale(1.1);
  }
  
  /* Collapse button rotation */
  .collapse-button {
    will-change: left, transform;
    backface-visibility: hidden;
  }
`;

document.head.appendChild(sidebarStyleSheet);

export default Sidebar;