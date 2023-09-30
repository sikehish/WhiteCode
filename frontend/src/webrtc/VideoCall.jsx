import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { FiVideo, FiMic, FiPhoneCall, FiPhoneOff, FiVideoOff, FiMicOff } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function VideoCall() {
  const { id }=useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const callRef = useRef(null);
  const [roomId, setRoomId] = useState(id);
  const [isError, setIsError] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const navigate = useNavigate();



  const initializePeer = useCallback(() => {
    const savedSession = JSON.parse(localStorage.getItem('videoCallSession'));
    const peerId = savedSession ? savedSession.peerId : undefined;
    const p = new Peer(peerId);

    p.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      // Store session information in localStorage
      const sessionData = {
        peerId: id,
        isCallActive: savedSession ? savedSession.isCallActive : false,
      };
      localStorage.setItem('videoCallSession', JSON.stringify(sessionData));
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

            // Handle call ended by the other user
            incomingCall.on('close', () => {
              endCall();
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

  const joinRoom = () => {
    if (roomId.trim() === '') {
      return;
    }

    // Construct room-specific friendId
    const friendId = `room-${roomId}`;
    setRoomId('');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        // Call the room-specific friendId
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
  }, [initializePeer]);

  const endCall = () => {
    // Clear session information when the call ends
    localStorage.removeItem('videoCallSession');

    if (callRef.current) {
      callRef.current.close();
    }

    // Stop and close the local media stream and tracks
    if (localStream) {
      const tracks = localStream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    // Set localStream and remoteStream to null to turn off the video
    setLocalStream(null);
    setRemoteStream(null);

    // Notify the other user that the call has ended
    sendCallEndedMessage();
  };

  const sendCallEndedMessage = () => {
    const friendId = `room-${roomId}`;
    const dataConnection = peerRef.current.connect(friendId);

    dataConnection.on('open', () => {
      dataConnection.send('call-ended');
      dataConnection.close();
    });

    toast.success('Call ended successfully');
    // Navigate to the home page or the room page
    navigate('/');
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
      <div className="flex">
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
          <button onClick={joinRoom} className="text-green-600">
            <FiPhoneCall size={32} />
          </button>
        )}
        <button onClick={toggleMic} className={isMicMuted ? 'text-red-600' : 'text-green-600'}>
          {isMicMuted ? <FiMic size={32} /> : <FiMicOff size={32} />}
        </button>
        <button onClick={toggleVideo} className={isVideoOff ? 'text-red-600' : 'text-green-600'}>
          {isVideoOff ? <FiVideoOff size={32} /> : <FiVideo size={32} />}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
