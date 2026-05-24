import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MonitorUp,
} from "lucide-react";
import { User } from "../../types";
import { Avatar } from "../ui/Avatar";

interface VideoCallOverlayProps {
  partner: User;
  onClose: () => void;
}

export const VideoCallOverlay: React.FC<VideoCallOverlayProps> = ({
  partner,
  onClose,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const pc1Ref = useRef<RTCPeerConnection | null>(null);
  const pc2Ref = useRef<RTCPeerConnection | null>(null);

  // The active stream pointer
  const localStreamRef = useRef<MediaStream | null>(null);

  // THE FIX: An array to catch EVERY stream ever created so none get left behind
  const allRequestedStreams = useRef<MediaStream[]>([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState("Connecting via WebRTC...");

  // The Ultimate Hardware Cleanup Function
  const killAllHardwareStreams = () => {
    allRequestedStreams.current.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop(); // Force stop every audio/video track
      });
    });
    allRequestedStreams.current = []; // Clear the array

    // Disconnect the video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  useEffect(() => {
    let isMounted = true;

    const startWebRTCCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Register this stream in our master kill list
        allRequestedStreams.current.push(stream);

        if (!isMounted) {
          killAllHardwareStreams();
          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc1 = new RTCPeerConnection();
        const pc2 = new RTCPeerConnection();
        pc1Ref.current = pc1;
        pc2Ref.current = pc2;

        pc1.onicecandidate = (e) =>
          e.candidate && pc2.addIceCandidate(e.candidate);
        pc2.onicecandidate = (e) =>
          e.candidate && pc1.addIceCandidate(e.candidate);

        pc2.ontrack = (e) => {
          if (isMounted) {
            setCallStatus("Connected");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = e.streams[0];
            }
          }
        };

        stream.getTracks().forEach((track) => pc1.addTrack(track, stream));

        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);

        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);
      } catch (error) {
        console.error("Error starting WebRTC call:", error);
        if (isMounted) setCallStatus("Camera/Mic access denied.");
      }
    };

    startWebRTCCall();

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);

      // Cleanup on unmount
      killAllHardwareStreams();
      if (pc1Ref.current) pc1Ref.current.close();
      if (pc2Ref.current) pc2Ref.current.close();
    };
  }, []);

  const handleHangUp = () => {
    killAllHardwareStreams(); // Nuke the hardware
    if (pc1Ref.current) pc1Ref.current.close();
    if (pc2Ref.current) pc2Ref.current.close();
    onClose(); // Tell the parent to hide the UI
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = isMuted));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoOff));
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing && navigator.mediaDevices.getDisplayMedia) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        allRequestedStreams.current.push(screenStream); // Add to kill list

        const screenTrack = screenStream.getVideoTracks()[0];

        if (pc1Ref.current) {
          const sender = pc1Ref.current
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => stopScreenShare();
        setIsScreenSharing(true);
      } else {
        stopScreenShare();
      }
    } catch (err) {
      console.error("Screen share failed", err);
    }
  };

  const stopScreenShare = async () => {
    setIsScreenSharing(false);
    try {
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: !isVideoOff,
        audio: !isMuted,
      });
      allRequestedStreams.current.push(webcamStream); // Add to kill list

      localStreamRef.current = webcamStream;

      const webcamTrack = webcamStream.getVideoTracks()[0];
      if (pc1Ref.current) {
        const sender = pc1Ref.current
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(webcamTrack);
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = webcamStream;
      }
    } catch (err) {
      console.error("Failed to restore webcam", err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col animate-fade-in">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-gray-950/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-4">
          <Avatar src={partner.avatarUrl} alt={partner.name} size="md" />
          <div>
            <h2 className="text-white font-semibold text-lg">{partner.name}</h2>
            <p className="text-gray-300 text-sm font-medium">
              {formatTime(callDuration)} • {callStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={(e) => e.currentTarget.play()}
          className={`w-full h-full object-cover ${isScreenSharing ? "" : "scale-x-[-1]"} opacity-90 transition-opacity duration-300`}
        />

        <div className="absolute bottom-6 md:bottom-24 right-6 w-32 h-48 md:w-48 md:h-64 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 z-20 transition-all duration-300">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={(e) => e.currentTarget.play()}
            className={`w-full h-full object-cover ${isScreenSharing ? "" : "scale-x-[-1]"} ${isVideoOff ? "hidden" : "block"}`}
          />

          {isVideoOff && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
              <Avatar src="" alt="Me" size="lg" className="mb-2 opacity-50" />
              <span className="text-[10px] md:text-xs text-gray-500 font-medium tracking-widest uppercase">
                Camera Off
              </span>
            </div>
          )}

          {isMuted && (
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-red-500 rounded-full p-1.5 shadow-md z-20">
              <MicOff size={14} className="text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="h-20 md:h-24 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-center gap-4 md:gap-6 px-4 md:px-6 relative z-10">
        <button
          onClick={toggleMute}
          className={`p-3 md:p-4 rounded-full transition-all duration-200 ${isMuted ? "bg-white text-gray-900 shadow-lg" : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"}`}
        >
          {isMuted ? (
            <MicOff size={20} className="md:w-6 md:h-6" />
          ) : (
            <Mic size={20} className="md:w-6 md:h-6" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 md:p-4 rounded-full transition-all duration-200 ${isVideoOff ? "bg-white text-gray-900 shadow-lg" : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"}`}
        >
          {isVideoOff ? (
            <VideoOff size={20} className="md:w-6 md:h-6" />
          ) : (
            <VideoIcon size={20} className="md:w-6 md:h-6" />
          )}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-3 md:p-4 rounded-full transition-all duration-200 ${isScreenSharing ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"}`}
        >
          <MonitorUp size={20} className="md:w-6 md:h-6" />
        </button>

        <div className="w-px h-6 md:h-8 bg-gray-700 mx-1 md:mx-2"></div>

        <button
          onClick={handleHangUp}
          className="p-3 md:p-4 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 transition-transform hover:scale-105"
        >
          <PhoneOff size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};
