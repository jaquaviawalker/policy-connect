import { useState } from 'react'
import { Login } from './components/login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'
import { Admin } from './components/Admin'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Component to capture login state from URL
const LoginWithMessage = () => {
  const location = useLocation();
  const message = location.state?.message || '';

  return (
    <div className="app-container">
      <h1>Policy Connect</h1>
      <Login message={message} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard route without app header */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin route without app header */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Login route with app header */}
        <Route path="/login" element={<LoginWithMessage />} />
        
        {/* Register route with app header */}
        <Route path="/register" element={
          <div className="app-container">
            <h1>Policy Connect</h1>
            <Register />
          </div>
        } />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
