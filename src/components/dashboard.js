import React from "react";
import {
  FaUsers,
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: 128,
      icon: <FaUsers size={30} />,
      color: "#4e73df",
    },
    {
      title: "Total Tasks",
      value: 56,
      icon: <FaClipboardList size={30} />,
      color: "#1cc88a",
    },
    {
      title: "Attendance Today",
      value: "92%",
      icon: <FaCalendarCheck size={30} />,
      color: "#36b9cc",
    },
    {
      title: "Monthly Expenses",
      value: "₹ 45,000",
      icon: <FaMoneyBillWave size={30} />,
      color: "#f6c23e",
    },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard</h2>

      {/* Stat Cards */}
      <div style={styles.cardGrid}>
        {stats.map((item, index) => (
          <div
            key={index}
            style={{ ...styles.card, borderLeft: `6px solid ${item.color}` }}
          >
            <div>
              <p style={styles.cardTitle}>{item.title}</p>
              <h3 style={styles.cardValue}>{item.value}</h3>
            </div>
            <div style={{ color: item.color }}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Recent Activities</h4>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mahalakshmi</td>
              <td>Marked Attendance</td>
              <td>21-12-2025</td>
              <td style={styles.success}>Completed</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>Approved Leave</td>
              <td>20-12-2025</td>
              <td style={styles.success}>Approved</td>
            </tr>
            <tr>
              <td>Ramesh</td>
              <td>Submitted Expense</td>
              <td>20-12-2025</td>
              <td style={styles.pending}>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  container: {
    paddingTop: "90px", // space for fixed header only
    paddingLeft: "25px",
    paddingRight: "25px",
    backgroundColor: "#f8f9fc",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#333",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "14px",
    color: "#6c757d",
  },
  cardValue: {
    margin: "5px 0 0",
    fontSize: "24px",
    fontWeight: "600",
  },
  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  success: {
    color: "green",
    fontWeight: "600",
  },
  pending: {
    color: "orange",
    fontWeight: "600",
  },
};

export default Dashboard;
