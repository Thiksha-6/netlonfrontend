import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/login";
import Dashboard from "./components/dashboard";
import Quotation from "./components/quotation";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Invoice from "./components/invoice";
import Inventory from "./components/inventory";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // 🔥 moved here
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleContentClick = () => {
    if (windowWidth <= 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Router>
          <Header
            onLogout={handleLogout}
            onMenuToggle={toggleMobileMenu}
          />

          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          <div
            className="main-content"
            style={{
              marginLeft:
  windowWidth > 768
    ? (isCollapsed ? "80px" : "250px")
    : "0",

              paddingTop: windowWidth > 768 ? "80px" : "70px",
              paddingBottom: windowWidth <= 768 ? "20px" : "0",
              minHeight: "100vh",
              backgroundColor: "#f8f9fa",
              transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onClick={handleContentClick}
          >
            <div
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: windowWidth <= 768 ? "15px" : "20px",
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/quotation" element={<Quotation />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="*" element={<Navigate to="/" />} />
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

export default App;
