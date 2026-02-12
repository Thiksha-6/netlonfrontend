import React, { useEffect, useState } from "react";
import {
  FaFileInvoice,
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  const [quotations, setQuotations] = useState([]);
  const [stats, setStats] = useState({
    total_quotations: 0,
    this_month: 0,
    total_value: 0,
    growth_percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/quotations?page=1&per_page=10`);
      const data = res.data;

      console.log("Dashboard data:", data); // For debugging

      setQuotations(data.quotations || []);

      // Properly map the stats from API response
      setStats({
        total_quotations: data.stats?.total_quotations || data.pagination?.total || 0,
        this_month: data.stats?.this_month || 0,
        total_value: data.stats?.total_value || 0,
        growth_percentage: data.stats?.growth_percentage || 0
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button onClick={fetchDashboardData} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Quotations",
      value: stats.total_quotations,
      icon: <FaFileInvoice size={28} />,
      color: "#4e73df",
      bgColor: "rgba(78, 115, 223, 0.1)",
    },
    {
      title: "This Month",
      value: stats.this_month,
      icon: <FaCalendarCheck size={28} />,
      color: "#1cc88a",
      bgColor: "rgba(28, 200, 138, 0.1)",
    },
    {
      title: "Total Value",
      value: `₹ ${Number(stats.total_value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <FaMoneyBillWave size={28} />,
      color: "#f6c23e",
      bgColor: "rgba(246, 194, 62, 0.1)",
    },
    {
      title: "Recent Records",
      value: quotations.length,
      icon: <FaClipboardList size={28} />,
      color: "#36b9cc",
      bgColor: "rgba(54, 185, 204, 0.1)",
    },
  ];

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get customer name from nested customerInfo object
  const getCustomerName = (quotation) => {
    return quotation.customerInfo?.billTo || quotation.bill_to || "N/A";
  };

  // Get grand total from nested totals object
  const getGrandTotal = (quotation) => {
    return quotation.totals?.grandTotal || quotation.grand_total || 0;
  };

  return (
    <div style={styles.container}>
      {/* Header with Welcome Message */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Dashboard</h1>
          <p style={styles.subheading}>
            Welcome back! Here's what's happening with your quotations today.
          </p>
        </div>
        <div style={styles.headerStats}>
          <span style={styles.growthBadge}>
            {stats.growth_percentage > 0 ? "↑" : "↓"} {Math.abs(stats.growth_percentage || 0)}% from last month
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.cardGrid}>
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              borderLeft: `5px solid ${card.color}`,
              backgroundColor: card.bgColor,
            }}
          >
            <div>
              <p style={styles.cardTitle}>{card.title}</p>
              <h3 style={{ ...styles.cardValue, color: card.color }}>
                {card.value}
              </h3>
              {card.title === "Total Value" && stats.growth_percentage !== 0 && (
                <p style={styles.cardGrowth}>
                  {stats.growth_percentage > 0 ? "+" : ""}
                  {stats.growth_percentage}% from last month
                </p>
              )}
            </div>
            <div style={{ ...styles.cardIcon, backgroundColor: card.bgColor, color: card.color }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Quotations Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h4 style={styles.sectionTitle}>Recent Quotations</h4>
          <span style={styles.recordCount}>
            Total: {stats.total_quotations} quotations
          </span>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Quotation No</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Estimate No</th>
                <th style={styles.th}>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {quotations.slice(0, 5).map((q) => (
                <tr key={q.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.quotationNo}>{q.quotation_no || `Q-${q.id}`}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.customerInfo}>
                      <span style={styles.customerName}>{getCustomerName(q)}</span>
                      {q.customerInfo?.stateName && (
                        <span style={styles.customerState}>{q.customerInfo.stateName}</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.contactNo}>{q.customerInfo?.contactNo || "-"}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.date}>
                      {formatDate(q.quotation_date || q.customerInfo?.estimateDate)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.estimateNo}>
                      {q.customerInfo?.estimateNo || "-"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.amount}>
                      ₹ {Number(getGrandTotal(q)).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {quotations.length === 0 && (
            <div style={styles.emptyState}>
              <FaClipboardList size={48} style={{ color: "#d1d3e2", marginBottom: "15px" }} />
              <p style={styles.emptyStateText}>No quotations available</p>
              <p style={styles.emptyStateSubtext}>Create your first quotation to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: "90px",
    paddingLeft: "25px",
    paddingRight: "25px",
    backgroundColor: "#f8f9fc",
    minHeight: "100vh",
  },
  loadingContainer: {
    paddingTop: "100px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #4e73df",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    color: "#5a5c69",
    fontSize: "1.1rem",
  },
  errorContainer: {
    paddingTop: "100px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  errorText: {
    color: "#e74a3b",
    fontSize: "1.1rem",
    marginBottom: "20px",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#4e73df",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  heading: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#5a5c69",
  },
  subheading: {
    margin: "5px 0 0",
    fontSize: "14px",
    color: "#858796",
  },
  headerStats: {
    display: "flex",
    alignItems: "center",
  },
  growthBadge: {
    padding: "8px 16px",
    backgroundColor: "#e3e6f0",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4e73df",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    },
  },
  cardTitle: {
    margin: 0,
    fontSize: "13px",
    color: "#858796",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  cardValue: {
    margin: "10px 0 5px",
    fontSize: "24px",
    fontWeight: "700",
  },
  cardGrowth: {
    margin: 0,
    fontSize: "12px",
    color: "#1cc88a",
    fontWeight: "600",
  },
  cardIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#5a5c69",
  },
  recordCount: {
    fontSize: "14px",
    color: "#858796",
    backgroundColor: "#f8f9fc",
    padding: "5px 12px",
    borderRadius: "15px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  th: {
    padding: "15px",
    textAlign: "left",
    borderBottom: "2px solid #e3e6f0",
    color: "#858796",
    fontWeight: "700",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: "#f8f9fc",
  },
  tr: {
    borderBottom: "1px solid #e3e6f0",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f8f9fc",
    },
  },
  td: {
    padding: "15px",
    fontSize: "14px",
    color: "#5a5c69",
  },
  quotationNo: {
    fontWeight: "700",
    color: "#4e73df",
  },
  customerInfo: {
    display: "flex",
    flexDirection: "column",
  },
  customerName: {
    fontWeight: "600",
    color: "#5a5c69",
  },
  customerState: {
    fontSize: "12px",
    color: "#858796",
    marginTop: "3px",
  },
  contactNo: {
    color: "#858796",
  },
  date: {
    color: "#858796",
  },
  estimateNo: {
    color: "#858796",
  },
  amount: {
    fontWeight: "700",
    color: "#1cc88a",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyStateText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#5a5c69",
    marginBottom: "10px",
  },
  emptyStateSubtext: {
    fontSize: "14px",
    color: "#858796",
  },
};

// Add animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;