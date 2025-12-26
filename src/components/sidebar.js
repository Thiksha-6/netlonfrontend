import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar, // Icon for Quotation
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation(); // Get current route
  const [active, setActive] = useState(location.pathname); // Use path as active

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
    { name: "Quotation", icon: <FaFileInvoiceDollar />, path: "/quotation" }, // <-- Quotation
    { name: "Invoice", icon: <FaFileInvoiceDollar />, path: "/invoice" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>ERP Panel</h3>

      <ul style={styles.menu}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            style={{
              ...styles.item,
              ...(active === item.path ? styles.activeItem : {}),
            }}
            onClick={() => setActive(item.path)}
          >
            <Link
              to={item.path}
              style={{ display: "flex", alignItems: "center", gap: "12px", color: "#fff", textDecoration: "none", width: "100%" }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  sidebar: {
    position: "fixed",
    top: "70px", // below fixed header
    left: 0,
    width: "220px",
    height: "calc(100vh - 70px)",
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: "20px 12px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
    zIndex: 1000,
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "10px",
    transition: "all 0.3s ease",
  },

  icon: {
    fontSize: "16px",
  },

  activeItem: {
    backgroundColor: "#2563eb",
    boxShadow: "0 4px 10px rgba(37,99,235,0.4)",
  },
};

export default Sidebar;
