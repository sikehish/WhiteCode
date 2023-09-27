// src/components/VideoCall.js

import React, { useEffect, useRef } from 'react';

function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let localStream;
  let peerConnection;

  useEffect(() => {
    // Function to initialize the WebRTC connection
    const setupWebRTC = async () => {
      try {
        // Get local media stream
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;

        // Create peer connection
        peerConnection = new RTCPeerConnection();

        // Add local stream to peer connection
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidate events
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            // Send the ICE candidate to the other peer (via your signaling server)
          }
        };

        // Create an offer to start the call
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer to the other peer (via your signaling server)
      } catch (error) {
        console.error('Error setting up WebRTC:', error);
      }
    };

    setupWebRTC();
  }, []);

  return (
    <div>
      <div className="flex justify-center space-x-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2" />
      </div>
    </div>
  );
}

export default VideoCall;
