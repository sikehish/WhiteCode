import React, { useState } from 'react';
import { FiVideo, FiMic } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RoomPage = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    // Generate a random room ID or use any other logic to create room IDs
    const newRoomId = Math.random().toString(36).substring(7);
    navigate(`/video/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim() === '') {
      alert('Please enter a valid room ID.');
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Video Conference Rooms</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={createRoom} className="bg-green-500 text-white py-2 px-4 rounded-lg">
          Create Room
        </button>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none"
        />
        <button onClick={joinRoom} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
          Join Room
        </button>
      </div>
      <p className="text-gray-600 text-sm">
        Create a new room to start a video conference or enter a room code to join an existing one.
      </p>
      <div className="flex space-x-4 mt-8">
        <div className="bg-gray-200 p-4 rounded-lg flex items-center">
          <FiVideo className="text-green-500 mr-2" />
          <span className="font-semibold">HD Video</span>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg flex items-center">
          <FiMic className="text-green-500 mr-2" />
          <span className="font-semibold">Crystal Clear Audio</span>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
