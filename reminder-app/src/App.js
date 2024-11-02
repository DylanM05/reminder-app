import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import { UserProvider } from './Components/UserContext';


function App() {
  return (
    <UserProvider>
    <Router>
      <div>
        <header>
          <h1>Reminder App</h1>
        </header>
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;