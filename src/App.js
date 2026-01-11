import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/login";
import Dashboard from "./components/dashboard";
import Quotation from "./components/quotation";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Invoice from "./components/invoice";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

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
          />
          <div 
            className="main-content"
            style={{
              marginLeft: windowWidth > 768 ? "250px" : "0",
              paddingTop: windowWidth > 768 ? "90px" : "70px",
            }}
            onClick={handleContentClick}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quotation" element={<Quotation />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

