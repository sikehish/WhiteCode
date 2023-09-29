// In your React component (e.g., VideoCall.js)
import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useAuthContext } from '../context/AuthContext';

function VideoCall() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isError, setIsError]=useState(false);

  const { state } = useAuthContext()

  let localStream;
  let peer;

  useEffect(() => {
    // Initialize PeerJS with your own API key
    console.log(state)
    console.log(state)
    const fetchPeerId= async()=>{
      const res= await fetch(`/api/users/${state?.user?.email}/peerid`);
      const data= await res.json();
      return data;

}  

const peerId=fetchPeerId();
console.log(peerId)
 peer = new Peer(peerId);

    // Get access to user's webcam and microphone
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localStream = stream;

        // Define your PeerJS events (e.g., 'open', 'call', 'stream', 'close')
        peer.on('open', (id) => {
          // 'id' is the unique PeerJS ID for this client
          console.log('My peer ID is: ' + id);
        });

        // Handle incoming calls
        peer.on('call', (call) => {
          // Answer the call and add remote stream to the video element
          call.answer(localStream);
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
      })
      .catch((error) => {
        console.error('Error accessing webcam/microphone:', error);
      });

    return () => {
      // Cleanup: close the PeerJS connection and stop local stream
      if (peer) {
        peer.destroy();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [state?.user]);

  const startCall = () => {
    // Create a call to another PeerJS ID (recipientPeerId)
    const recipientPeerId = 'RECIPIENT_PEER_ID'; // Replace with the recipient's ID
    const call = peer.call(recipientPeerId, localStream);

    // Add remote stream to the video element
    call.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2" />
      <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2" />
      <button onClick={startCall}>Start Call</button>
    </div>
  );
}

export default VideoCall;
