import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { FiVideo, FiMic, FiPhoneCall, FiPhoneOff, FiVideoOff, FiMicOff } from 'react-icons/fi';

function VideoCall() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isError, setIsError] = useState(false);
  const [peer, setPeer] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [call, setCall] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const initializePeer = () => {
    const peer = new Peer();

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    peer.on('call', (incomingCall) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          localVideoRef.current.srcObject = stream;

          setCall(incomingCall);

          incomingCall.answer(stream);
          incomingCall.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
          });
        })
        .catch((error) => {
          console.error('Error accessing webcam/microphone:', error);
          setIsError(true);
        });
    });

    setPeer(peer);
  };

  useEffect(() => {
    initializePeer();
  }, []);

  const startCall = () => {
    const friendId = prompt('Enter your friend\'s PeerJS ID:');
    if (!friendId) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const call = peer.call(friendId, stream);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error('Error accessing webcam/microphone:', error);
        setIsError(true);
      });
  };

  const endCall = () => {
    if (call) {
      call.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCall(null);
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicMuted;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="my-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2" />
      </div>
      <div className="my-4">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2" />
      </div>
      <div className="flex space-x-4 my-4">
        {isError && <p>Error accessing webcam/microphone</p>}
        {call ? (
          <button onClick={endCall} className="text-red-600">
            <FiPhoneOff size={32} />
          </button>
        ) : (
          <button onClick={startCall} className="text-green-600">
            <FiPhoneCall size={32} />
          </button>
        )}
        <button onClick={toggleMic} className={isMicMuted ? "text-red-600" : "text-green-600"}>
          {isMicMuted ? <FiMic size={32} /> : <FiMicOff size={32} />}
        </button>
        <button onClick={toggleVideo} className={isVideoOff ? "text-red-600" : "text-green-600"}>
          {isVideoOff ? <FiVideoOff size={32} /> : <FiVideo size={32} />}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
