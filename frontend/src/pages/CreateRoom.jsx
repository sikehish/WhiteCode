import React, { useState } from 'react';
import Peer from 'peerjs';

function CreateRoom() {
  const [roomId, setRoomId] = useState('');
  const [roomLink, setRoomLink] = useState('');

  const generateRoom = () => {
    const peer = new Peer(); // Initialize PeerJS
    const newRoomId = peer.id; // Generate a unique room ID (PeerJS PeerID)
    const newRoomLink = `${window.location.origin}/room/${newRoomId}`; // Generate a room link

    setRoomId(newRoomId);
    setRoomLink(newRoomLink);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={generateRoom}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
      >
        Create Room
      </button>
      {roomLink && (
        <div className="mt-4">
          <p>Room ID: {roomId}</p>
          <p>Room Link:</p>
          <a href={roomLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">
            {roomLink}
          </a>
        </div>
      )}
    </div>
  );
}

export default CreateRoom;
