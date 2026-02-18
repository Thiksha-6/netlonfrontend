import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaTimes,
  FaBars,
  FaBoxes
} from "react-icons/fa";

const Sidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed,
  setIsCollapsed
}) => {

  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobileMenuOpen]);

  const toggleSidebar = () => {
    if (windowWidth > 768) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
    { name: "Quotation", icon: <FaFileInvoiceDollar />, path: "/quotation" },
    { name: "Inventory", icon: <FaBoxes />, path: "/inventory" },
  ];

  const sidebarWidth =
    windowWidth <= 768
      ? "100vw"
      : isCollapsed && !isHovered
        ? "80px"
        : "250px";

  return (
    <>
      {/* Desktop Collapse Button */}
      {windowWidth > 768 && (
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "85px",
            left: isCollapsed ? "90px" : "260px",
            zIndex: 1002,
            background: "#2563eb",
            border: "none",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: "0 8px 8px 0",
            cursor: "pointer"
          }}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: windowWidth <= 768 ? "60px" : "70px",   // 🔥 FIXED
          left: 0,
          height:
            windowWidth <= 768
              ? "calc(100vh - 60px)"                  // 🔥 FIXED
              : "calc(100vh - 70px)",                 // 🔥 FIXED
          width: sidebarWidth,
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: "20px 0",
          zIndex: 1000,
          transition: "all 0.3s ease",
          transform:
            windowWidth <= 768
              ? `translateX(${isMobileMenuOpen ? "0" : "-100%"})`
              : "translateX(0)"
        }}
        onMouseEnter={() => windowWidth > 768 && setIsHovered(true)}
        onMouseLeave={() => windowWidth > 768 && setIsHovered(false)}
      >
        {/* Mobile Close Button */}
        {windowWidth <= 768 && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            <FaTimes />
          </button>
        )}

        <ul style={{ listStyle: "none", padding: "0 15px", margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.name} style={{ marginBottom: "10px" }}>
              <Link
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "12px",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  background:
                    location.pathname === item.path
                      ? "#2563eb"
                      : "transparent"
                }}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && windowWidth <= 768 && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
