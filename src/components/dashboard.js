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
      title: "Total Customers",
      value: "128",
      icon: <FaUsers size={30} />,
      color: "#4e73df",
    },
    {
      title: "Pending Quotations",
      value: "24",
      icon: <FaClipboardList size={30} />,
      color: "#1cc88a",
    },
    {
      title: "This Month Bills",
      value: "56",
      icon: <FaCalendarCheck size={30} />,
      color: "#36b9cc",
    },
    {
      title: "Monthly Revenue",
      value: "₹ 1,45,670",
      icon: <FaMoneyBillWave size={30} />,
      color: "#f6c23e",
    },
  ];

  const recentInvoices = [
    { id: "INV-1254", customer: "Raja Textiles", date: "21-12-2025", amount: "₹ 8,500", status: "Paid" },
    { id: "INV-1253", customer: "Modern Furnishings", date: "20-12-2025", amount: "₹ 12,300", status: "Paid" },
    { id: "INV-1252", customer: "City Hardware", date: "20-12-2025", amount: "₹ 5,670", status: "Pending" },
    { id: "INV-1251", customer: "Green Homes", date: "19-12-2025", amount: "₹ 9,800", status: "Paid" },
    { id: "INV-1250", customer: "Royal Constructions", date: "19-12-2025", amount: "₹ 15,200", status: "Pending" },
    { id: "INV-1249", customer: "Premium Interiors", date: "18-12-2025", amount: "₹ 7,400", status: "Paid" },
  ];

  const recentQuotes = [
    { id: "QUO-0341", customer: "Ramesh Traders", status: "Pending" },
    { id: "QUO-0340", customer: "Kumar Hardware", status: "Converted" },
    { id: "QUO-0339", customer: "Velu Furnishings", status: "Pending" },
    { id: "QUO-0338", customer: "Sri Balaji Stores", status: "Converted" },
  ];

  return (
    <div style={styles.container} className="dashboard-container">
      <h2 style={styles.heading}>Dashboard - Netlon Billing System</h2>

      {/* Stat Cards */}
      <div style={styles.cardGrid} className="stats-grid">
        {stats.map((item, index) => (
          <div
            key={index}
            style={{ ...styles.card, borderLeft: `6px solid ${item.color}` }}
            className="stat-card"
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
      <div style={styles.section} className="dashboard-section">
        <h4 style={styles.sectionTitle}>Recent Billing Activities</h4>
        <div style={styles.tableWrapper}>
          <table style={styles.table} className="dashboard-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice, index) => (
                <tr key={index}>
                  <td data-label="Invoice No">{invoice.id}</td>
                  <td data-label="Customer">{invoice.customer}</td>
                  <td data-label="Date">{invoice.date}</td>
                  <td data-label="Amount">{invoice.amount}</td>
                  <td data-label="Status" style={invoice.status === "Paid" ? styles.success : styles.pending}>
                    {invoice.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats & Recent Quotations */}
      <div style={styles.bottomGrid} className="bottom-grid">
        <div style={styles.section} className="dashboard-section">
          <h4 style={styles.sectionTitle}>Quick Stats</h4>
          <div style={styles.statsGrid} className="quick-stats-grid">
            <div style={styles.statItem} className="quick-stat-item">
              <p style={styles.statLabel}>Today's Sales</p>
              <p style={styles.statValue}>₹ 8,500</p>
            </div>
            <div style={styles.statItem} className="quick-stat-item">
              <p style={styles.statLabel}>This Week</p>
              <p style={styles.statValue}>₹ 45,670</p>
            </div>
            <div style={styles.statItem} className="quick-stat-item">
              <p style={styles.statLabel}>Active Products</p>
              <p style={styles.statValue}>15</p>
            </div>
            <div style={styles.statItem} className="quick-stat-item">
              <p style={styles.statLabel}>Avg. Bill Value</p>
              <p style={styles.statValue}>₹ 2,850</p>
            </div>
          </div>
        </div>

        <div style={styles.section} className="dashboard-section">
          <h4 style={styles.sectionTitle}>Recent Quotations</h4>
          <div style={styles.quoteList} className="quote-list">
            {recentQuotes.map((quote, index) => (
              <div key={index} style={styles.quoteItem} className="quote-item">
                <span>{quote.id} - {quote.customer}</span>
                <span style={quote.status === "Converted" ? styles.success : styles.pending}>
                  {quote.status}
                </span>
              </div>
            ))}
          </div>
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
    boxSizing: "border-box",
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
    marginBottom: "20px",
  },
  sectionTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600",
  },
  tableWrapper: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },
  success: {
    color: "green",
    fontWeight: "600",
  },
  pending: {
    color: "orange",
    fontWeight: "600",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  statItem: {
    padding: "10px",
    textAlign: "center",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#6c757d",
  },
  statValue: {
    margin: "5px 0 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
  },
  quoteList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  quoteItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
};

// Media queries for Dashboard
const dashboardMediaQueries = `
  /* Tablet styles */
  @media (max-width: 768px) {
    .dashboard-container {
      padding-top: 70px !important;
      padding-left: 15px !important;
      padding-right: 15px !important;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 15px !important;
    }
    
    .stat-card {
      padding: 15px !important;
    }
    
    .dashboard-section {
      padding: 15px !important;
    }
    
    .section-title {
      font-size: 16px !important;
    }
    
    .heading {
      font-size: 22px !important;
      margin-bottom: 15px !important;
    }
    
    .card-value {
      font-size: 20px !important;
    }
    
    .bottom-grid {
      grid-template-columns: 1fr !important;
      gap: 15px !important;
    }
    
    .dashboard-table {
      min-width: 500px !important;
    }
    
    .stat-value {
      font-size: 18px !important;
    }
  }
  
  /* Mobile styles */
  @media (max-width: 480px) {
    .dashboard-container {
      padding-top: 65px !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    
    .stats-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
    
    .stat-card {
      padding: 12px !important;
    }
    
    .dashboard-section {
      padding: 12px !important;
    }
    
    .heading {
      font-size: 20px !important;
      text-align: center !important;
    }
    
    .card-value {
      font-size: 18px !important;
    }
    
    .card-title {
      font-size: 13px !important;
    }
    
    .quick-stats-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
    
    .quick-stat-item {
      padding: 8px !important;
    }
    
    .stat-value {
      font-size: 16px !important;
    }
    
    .stat-label {
      font-size: 13px !important;
    }
    
    /* Make table responsive */
    .dashboard-table thead {
      display: none !important;
    }
    
    .dashboard-table tr {
      display: block !important;
      margin-bottom: 10px !important;
      border: 1px solid #ddd !important;
      border-radius: 8px !important;
      padding: 10px !important;
    }
    
    .dashboard-table td {
      display: block !important;
      text-align: right !important;
      padding: 8px 10px !important;
      position: relative !important;
      border-bottom: 1px solid #eee !important;
    }
    
    .dashboard-table td:last-child {
      border-bottom: none !important;
    }
    
    .dashboard-table td::before {
      content: attr(data-label) !important;
      position: absolute !important;
      left: 10px !important;
      font-weight: 600 !important;
      color: #333 !important;
    }
    
    /* Responsive quote items */
    .quote-item {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 5px !important;
    }
  }
`;

// Add dashboard styles
const dashboardStyleSheet = document.createElement("style");
dashboardStyleSheet.textContent = dashboardMediaQueries;
document.head.appendChild(dashboardStyleSheet);

export default Dashboard;