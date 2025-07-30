import { Login } from './components/login'
import { Register } from './components/Register'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Policy Connect</h1>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<div>Dashboard Page (to be implemented)</div>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
