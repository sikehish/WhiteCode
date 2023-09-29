import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GuestPage from './pages/GuestPage';
import VideoCall from './webrtc/VideoCall'
import Room from './webrtc/Room';
import { useAuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {state}=useAuthContext()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage isLogin={true}  />} />
        <Route path="/signup" element={<LoginPage isLogin={false}  />} />
        <Route path="/" element={<GuestPage />} />
        <Route path="/dashboard/*" element={<HomePage />} />
        <Route path="/video" element={<VideoCall />} />
      </Routes>
      <ToastContainer position="top-right"/>
    </Router>
  );
}

export default App;
