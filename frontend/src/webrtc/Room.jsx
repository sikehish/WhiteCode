// src/components/Room.js

import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BiMicrophone, BiMicrophoneOff, BiPhone, BiVideo, BiVideoOff } from 'react-icons/bi'

function Room() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const navigate= useNavigate();

  let localStream;
  let peerConnection;

  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;

        peerConnection = new RTCPeerConnection();

        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            // Send the ICE candidate to the other peer (via your signaling server)
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer to the other peer (via your signaling server)
      } catch (error) {
        console.error('Error setting up WebRTC:', error);
      }
    };

    setupWebRTC();
  }, []);

  const toggleVideo = () => {
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsVideoEnabled(track.enabled);
    });
  };

  const toggleAudio = () => {
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsAudioMuted(!track.enabled);
    });
  };
  const endCall = () => {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    peerConnection.close();
    // Redirect to the room list or home page
    navigate('/')
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">WhiteCode Video Call</h1>
      <div className="flex justify-center space-x-4">
        <video ref={localVideoRef} autoPlay playsInline muted={!isVideoEnabled} className="w-1/2" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2" />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={toggleVideo} className="btn">
          {isVideoEnabled ? <BiVideo /> : <BiVideoOff />}
        </button>
        <button onClick={toggleAudio} className="btn">
          {isAudioMuted ? <BiMicrophoneOff /> : <BiMicrophone />}
        </button>
        <button onClick={endCall} className="btn btn-red">
          <BiPhone />
        </button>
      </div>
    </div>
  );
}

export default Room;