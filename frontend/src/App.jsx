import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/loginpage';
import GuestPage from './pages/guestpage';
import VideoCall from './webrtc/VideoCall'
function App() {
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
