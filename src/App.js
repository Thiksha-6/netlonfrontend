import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/login";
import Dashboard from "./components/dashboard";
import Quotation from "./components/quotation"; // Quotation Page
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Invoice from "./components/invoice";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Router>
          <Header onLogout={handleLogout} />
          <div style={styles.layout}>
            <Sidebar />
            <div style={styles.mainContent}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/quotation" element={<Quotation />} /> {/* Quotation Route */}
                <Route path="/invoice" element={<Invoice />} /> {/* Invoice Route */}
                <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
              </Routes>
            </div>
          </div>
        </Router>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  layout: {
    display: "flex",
  },

  mainContent: {
    marginLeft: "220px", // Same width as Sidebar
    width: "100%",
  },
};

export default App;
