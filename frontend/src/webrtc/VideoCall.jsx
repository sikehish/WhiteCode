import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { FiVideo, FiMic, FiPhoneCall, FiPhoneOff, FiVideoOff, FiMicOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function VideoCall() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const callRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const navigate = useNavigate();

  const initializePeer = useCallback(() => {
    const savedSession = JSON.parse(localStorage.getItem('videoCallSession'));
    const p = new Peer(savedSession ? savedSession.peerId : undefined);

    p.on('open', (id) => {
      console.log('My peer ID is: ' + id);

      // Store session information in localStorage
      const sessionData = {
        peerId: id,
        isCallActive: savedSession ? savedSession.isCallActive : false,
      };
      localStorage.setItem('videoCallSession', JSON.stringify(sessionData));

      // Reconnect if a call is active
      if (savedSession && savedSession.isCallActive) {
        startCall();
      }
    });

    p.on('call', (incomingCall) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          localVideoRef.current.srcObject = stream;

          callRef.current = incomingCall;

          incomingCall.answer(stream);
          incomingCall.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            remoteVideoRef.current.srcObject = remoteStream;
            incomingCall.on('close', () => {
            // Clear session information when the call ends
            localStorage.removeItem('videoCallSession');

            // Close the call and streams
            if (callRef.current) {
              callRef.current.close();
            }
            setLocalStream(null);
            setRemoteStream(null);
            toast.success("Call ended!")
            // Navigate to the home page
            navigate('/');
          });
          });

          
        })
        .catch((error) => {
          console.error('Error accessing webcam/microphone:', error);
          setIsError(true);
        });
    });

    peerRef.current = p;
  }, []);

  const startCall = () => {
    const friendId = prompt('Enter your friend\'s PeerJS ID:');
    if (!friendId) {
      return;
    }
    // Store the friendId in localStorage
  localStorage.setItem('friendId', friendId);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const c = peerRef.current.call(friendId, stream);
        callRef.current = c;
        c.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        });

        // Store session information with active call
        const sessionData = {
          peerId: peerRef.current.id,
          isCallActive: true,
        };
        localStorage.setItem('videoCallSession', JSON.stringify(sessionData));
      })
      .catch((error) => {
        console.error('Error accessing webcam/microphone:', error);
        setIsError(true);
      });
  };

  useEffect(() => {
    initializePeer();
  
    // Listen for incoming data connections
    peerRef.current.on('connection', (dataConnection) => {
      dataConnection.on('data', (data) => {
        if (data === 'call-ended') {
          // Call has ended, navigate to the home page
          navigate('/');
          toast.success('Call ended by the other user.');
        }
      });
    });
  }, [initializePeer, navigate]);
  

  const sendCallEndedMessage = () => {
    const friendId = localStorage.getItem('friendId'); // Retrieve friendId from localStorage
    const dataConnection = peerRef.current.connect(friendId);
  
    dataConnection.on('open', () => {
      dataConnection.send('call-ended');
      dataConnection.close();
    });
  };
  
  
  const endCall = () => {
    localStorage.removeItem('videoCallSession');
    if (callRef.current) {
      callRef.current.close();
    }
    sendCallEndedMessage(); // Notify the other peer that the call has ended
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
      <div className='flex'>
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 mt-10 mx-5" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 mt-10 mx-5" />
      </div>
      <div className="flex space-x-4 my-4">
        {isError && <p>Error accessing webcam/microphone</p>}
        {callRef.current ? (
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
