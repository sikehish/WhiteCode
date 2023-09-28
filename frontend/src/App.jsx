import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GuestPage from './pages/GuestPage';
import VideoCall from './webrtc/VideoCall'
import Room from './webrtc/Room';
import { useAuthContext } from './context/AuthContext';
function App() {
  const {state}=useAuthContext()
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage isLogin={true} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<LoginPage isLogin={false} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={<GuestPage />} />
        <Route path="/dashboard/*" element={<HomePage isAuthenticated={isAuthenticated}/>} />
        <Route path="/video" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
