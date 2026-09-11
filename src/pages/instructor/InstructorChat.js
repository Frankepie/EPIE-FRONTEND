import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaMicrophone,
  FaPhone,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
  FaEllipsisV,
  FaComments,
  FaMicrophoneSlash
} from "react-icons/fa";

import {
  io
} from "socket.io-client";

import {
  useAuth
} from "../../context/AuthContext";

import "../../styles/InstructorChat.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const InstructorChat = () => {

  const {
    token,
    user
  } = useAuth();

  const {
    conversationId
  } = useParams();

  const navigate =
    useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [
    conversation,
    setConversation
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    sending,
    setSending
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  // ==========================================
  // AUDIO CALL STATE
  // ==========================================

  const [
    audioCallActive,
    setAudioCallActive
  ] = useState(false);

  const [
    audioCallConnecting,
    setAudioCallConnecting
  ] = useState(false);

  const [
    audioCallMuted,
    setAudioCallMuted
  ] = useState(false);

  const [
    audioCallError,
    setAudioCallError
  ] = useState("");

  const [
    audioCallSeconds,
    setAudioCallSeconds
  ] = useState(0);


  // ==========================================
  // VIDEO CALL STATE
  // ==========================================

  const [
    videoCallActive,
    setVideoCallActive
  ] = useState(false);

  const [
    videoCallConnecting,
    setVideoCallConnecting
  ] = useState(false);

  const [
    videoCallMuted,
    setVideoCallMuted
  ] = useState(false);

  const [
    videoCameraOff,
    setVideoCameraOff
  ] = useState(false);

  const [
    videoCallError,
    setVideoCallError
  ] = useState("");

  const [
    videoCallSeconds,
    setVideoCallSeconds
  ] = useState(0);


  // ==========================================
  // GENERAL CALL REFS
  // ==========================================

  const messagesEndRef =
    useRef(null);

  const socketRef =
    useRef(null);


  // ==========================================
  // AUDIO CALL REFS
  // ==========================================

  const audioPeerConnectionRef =
    useRef(null);

  const localAudioStreamRef =
    useRef(null);

  const remoteAudioRef =
    useRef(null);

  const activeAudioCallRef =
    useRef(null);

  const audioCallTimerRef =
    useRef(null);

  const pendingAudioIceCandidatesRef =
    useRef([]);


  // ==========================================
  // VIDEO CALL REFS
  // ==========================================

  const videoPeerConnectionRef =
    useRef(null);

  const localVideoStreamRef =
    useRef(null);

  const localVideoRef =
    useRef(null);

  const remoteVideoRef =
    useRef(null);

  const activeVideoCallRef =
    useRef(null);

  const videoCallTimerRef =
    useRef(null);

  const pendingVideoIceCandidatesRef =
    useRef([]);


  // ==========================================
  // LOAD CONVERSATION
  // ==========================================

  useEffect(() => {

    const loadConversation =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await fetch(
              `${API_URL}/api/communication/conversation/${conversationId}`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load conversation"
            );

          }


          setConversation(
            data.conversation
          );

          setMessages(
            data.messages || []
          );


        } catch (err) {

          console.error(
            "Load conversation error:",
            err
          );

          setError(
            err.message ||
            "Failed to load conversation."
          );

        } finally {

          setLoading(false);

        }

      };


    if (
      token &&
      conversationId
    ) {

      loadConversation();

    }

  }, [
    token,
    conversationId
  ]);


  // ==========================================
  // GET STUDENT
  // ==========================================

  const student =
    conversation?.participants?.find(
      participant =>
        participant._id !== user?._id
    );


  // ==========================================
  // AUDIO CALL CLEANUP
  // ==========================================

  const cleanupAudioCall =
    () => {

      if (
        localAudioStreamRef.current
      ) {

        localAudioStreamRef.current
          .getTracks()
          .forEach(
            track => track.stop()
          );

      }


      localAudioStreamRef.current =
        null;


      if (
        audioPeerConnectionRef.current
      ) {

        try {

          audioPeerConnectionRef.current.close();

        } catch (err) {

          console.error(
            "Audio peer cleanup error:",
            err
          );

        }

      }


      audioPeerConnectionRef.current =
        null;


      if (
        remoteAudioRef.current
      ) {

        remoteAudioRef.current.srcObject =
          null;

      }


      if (
        audioCallTimerRef.current
      ) {

        clearInterval(
          audioCallTimerRef.current
        );

        audioCallTimerRef.current =
          null;

      }


      pendingAudioIceCandidatesRef.current =
        [];


      activeAudioCallRef.current =
        null;


      setAudioCallActive(
        false
      );

      setAudioCallConnecting(
        false
      );

      setAudioCallMuted(
        false
      );

      setAudioCallSeconds(
        0
      );

    };


  // ==========================================
  // VIDEO CALL CLEANUP
  // ==========================================

  const cleanupVideoCall =
    () => {

      if (
        localVideoStreamRef.current
      ) {

        localVideoStreamRef.current
          .getTracks()
          .forEach(
            track => track.stop()
          );

      }


      localVideoStreamRef.current =
        null;


      if (
        videoPeerConnectionRef.current
      ) {

        try {

          videoPeerConnectionRef.current.close();

        } catch (err) {

          console.error(
            "Video peer cleanup error:",
            err
          );

        }

      }


      videoPeerConnectionRef.current =
        null;


      if (
        localVideoRef.current
      ) {

        localVideoRef.current.srcObject =
          null;

      }


      if (
        remoteVideoRef.current
      ) {

        remoteVideoRef.current.srcObject =
          null;

      }


      if (
        videoCallTimerRef.current
      ) {

        clearInterval(
          videoCallTimerRef.current
        );

        videoCallTimerRef.current =
          null;

      }


      pendingVideoIceCandidatesRef.current =
        [];


      activeVideoCallRef.current =
        null;


      setVideoCallActive(
        false
      );

      setVideoCallConnecting(
        false
      );

      setVideoCallMuted(
        false
      );

      setVideoCameraOff(
        false
      );

      setVideoCallSeconds(
        0
      );

    };


  // ==========================================
  // CREATE AUDIO PEER CONNECTION
  // ==========================================

  const createAudioPeerConnection =
    () => {

      const peerConnection =
        new RTCPeerConnection({

          iceServers: [

            {
              urls:
                "stun:stun.l.google.com:19302"
            },

            {
              urls:
                "stun:stun1.l.google.com:19302"
            }

          ]

        });


      peerConnection.onicecandidate =
        event => {

          if (
            !event.candidate ||
            !activeAudioCallRef.current
          ) {

            return;

          }


          const socket =
            socketRef.current;


          if (!socket) {

            return;

          }


          const callData =
            activeAudioCallRef.current;


          socket.emit(
            "ice_candidate",
            {

              callId:
                callData.callId,

              conversationId,

              targetUserId:
                callData.targetUserId,

              candidate:
                event.candidate

            }
          );

        };


      peerConnection.ontrack =
        event => {

          if (
            remoteAudioRef.current
          ) {

            remoteAudioRef.current.srcObject =
              event.streams[0];


            const playPromise =
              remoteAudioRef.current.play();


            if (
              playPromise &&
              typeof playPromise.catch ===
                "function"
            ) {

              playPromise.catch(
                playError => {

                  console.warn(
                    "Remote audio autoplay blocked:",
                    playError
                  );

                }
              );

            }

          }

        };


      peerConnection.onconnectionstatechange =
        () => {

          const state =
            peerConnection.connectionState;


          console.log(
            "Instructor audio WebRTC state:",
            state
          );


          if (
            state === "connected"
          ) {

            setAudioCallConnecting(
              false
            );

            setAudioCallActive(
              true
            );

          }


          if (
            state === "failed"
          ) {

            setAudioCallConnecting(
              false
            );

            setAudioCallError(
              "The audio connection failed."
            );

          }

        };


      audioPeerConnectionRef.current =
        peerConnection;


      return peerConnection;

    };


  // ==========================================
  // CREATE VIDEO PEER CONNECTION
  // ==========================================

  const createVideoPeerConnection =
    () => {

      const peerConnection =
        new RTCPeerConnection({

          iceServers: [

            {
              urls:
                "stun:stun.l.google.com:19302"
            },

            {
              urls:
                "stun:stun1.l.google.com:19302"
            }

          ]

        });


      peerConnection.onicecandidate =
        event => {

          if (
            !event.candidate ||
            !activeVideoCallRef.current
          ) {

            return;

          }


          const socket =
            socketRef.current;


          if (!socket) {

            return;

          }


          const callData =
            activeVideoCallRef.current;


          socket.emit(
            "ice_candidate",
            {

              callId:
                callData.callId,

              conversationId,

              targetUserId:
                callData.targetUserId,

              candidate:
                event.candidate

            }
          );

        };


      peerConnection.ontrack =
        event => {

          console.log(
            "Remote student video track received."
          );


          if (
            remoteVideoRef.current
          ) {

            remoteVideoRef.current.srcObject =
              event.streams[0];


            const playPromise =
              remoteVideoRef.current.play();


            if (
              playPromise &&
              typeof playPromise.catch ===
                "function"
            ) {

              playPromise.catch(
                playError => {

                  console.warn(
                    "Remote video autoplay blocked:",
                    playError
                  );

                }
              );

            }

          }

        };


      peerConnection.onconnectionstatechange =
        () => {

          const state =
            peerConnection.connectionState;


          console.log(
            "Instructor video WebRTC state:",
            state
          );


          if (
            state === "connected"
          ) {

            setVideoCallConnecting(
              false
            );

            setVideoCallActive(
              true
            );

          }


          if (
            state === "failed"
          ) {

            setVideoCallConnecting(
              false
            );

            setVideoCallError(
              "The video connection failed."
            );

          }


          if (
            state === "disconnected"
          ) {

            setVideoCallError(
              "The student connection was interrupted."
            );

          }

        };


      videoPeerConnectionRef.current =
        peerConnection;


      return peerConnection;

    };


  // ==========================================
  // SOCKET.IO CONNECTION
  // ==========================================

  useEffect(() => {

    if (
      !token ||
      !conversationId
    ) {

      return;

    }


    const socket =
      io(
        API_URL,
        {
          auth: {
            token
          }
        }
      );


    socketRef.current =
      socket;


    socket.on(
      "connect",
      () => {

        console.log(
          "Instructor Forum Socket.IO connected:",
          socket.id
        );


        socket.emit(
          "join_conversation",
          {
            conversationId
          }
        );

      }
    );


    socket.on(
      "conversation_joined",
      data => {

        console.log(
          "Instructor joined forum:",
          data
        );

      }
    );


    // ======================================
    // CALL ACCEPTED
    // ======================================

    socket.on(
      "call_accepted",
      async callData => {

        console.log(
          "Call accepted:",
          callData
        );


        // ==================================
        // AUDIO CALL
        // ==================================

        if (
          activeAudioCallRef.current &&
          activeAudioCallRef.current.callId ===
            callData.callId
        ) {

          try {

            setAudioCallConnecting(
              true
            );


            const peerConnection =
              audioPeerConnectionRef.current;


            if (!peerConnection) {

              throw new Error(
                "Audio peer connection is unavailable."
              );

            }


            const offer =
              await peerConnection.createOffer({
                offerToReceiveAudio: true
              });


            await peerConnection.setLocalDescription(
              offer
            );


            socket.emit(
              "call_offer",
              {

                callId:
                  callData.callId,

                conversationId,

                targetUserId:
                  callData.acceptedBy,

                offer

              }
            );


          } catch (err) {

            console.error(
              "Create audio offer error:",
              err
            );

            setAudioCallError(
              "Unable to start the audio connection."
            );

          }

          return;

        }


        // ==================================
        // VIDEO CALL
        // ==================================

        if (
          activeVideoCallRef.current &&
          activeVideoCallRef.current.callId ===
            callData.callId
        ) {

          try {

            setVideoCallConnecting(
              true
            );


            const peerConnection =
              videoPeerConnectionRef.current;


            if (!peerConnection) {

              throw new Error(
                "Video peer connection is unavailable."
              );

            }


            const offer =
              await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
              });


            await peerConnection.setLocalDescription(
              offer
            );


            socket.emit(
              "call_offer",
              {

                callId:
                  callData.callId,

                conversationId,

                targetUserId:
                  callData.acceptedBy,

                offer

              }
            );


          } catch (err) {

            console.error(
              "Create video offer error:",
              err
            );

            setVideoCallError(
              "Unable to start the video connection."
            );

          }

        }

      }
    );


    // ======================================
    // CALL ANSWER
    // ======================================

    socket.on(
      "call_answer",
      async callData => {

        console.log(
          "Call answer received:",
          callData
        );


        // ==================================
        // AUDIO
        // ==================================

        if (
          activeAudioCallRef.current &&
          activeAudioCallRef.current.callId ===
            callData.callId
        ) {

          try {

            const peerConnection =
              audioPeerConnectionRef.current;


            if (!peerConnection) {

              return;

            }


            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(
                callData.answer
              )
            );


            const pendingCandidates =
              pendingAudioIceCandidatesRef.current;


            for (
              const candidate
              of pendingCandidates
            ) {

              try {

                await peerConnection.addIceCandidate(
                  new RTCIceCandidate(
                    candidate
                  )
                );

              } catch (candidateError) {

                console.error(
                  "Pending audio ICE error:",
                  candidateError
                );

              }

            }


            pendingAudioIceCandidatesRef.current =
              [];


            setAudioCallConnecting(
              false
            );

            setAudioCallActive(
              true
            );


          } catch (err) {

            console.error(
              "Set audio answer error:",
              err
            );

            setAudioCallError(
              "Unable to establish the audio connection."
            );

          }

          return;

        }


        // ==================================
        // VIDEO
        // ==================================

        if (
          activeVideoCallRef.current &&
          activeVideoCallRef.current.callId ===
            callData.callId
        ) {

          try {

            const peerConnection =
              videoPeerConnectionRef.current;


            if (!peerConnection) {

              return;

            }


            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(
                callData.answer
              )
            );


            const pendingCandidates =
              pendingVideoIceCandidatesRef.current;


            for (
              const candidate
              of pendingCandidates
            ) {

              try {

                await peerConnection.addIceCandidate(
                  new RTCIceCandidate(
                    candidate
                  )
                );

              } catch (candidateError) {

                console.error(
                  "Pending video ICE error:",
                  candidateError
                );

              }

            }


            pendingVideoIceCandidatesRef.current =
              [];


            setVideoCallConnecting(
              false
            );

            setVideoCallActive(
              true
            );


          } catch (err) {

            console.error(
              "Set video answer error:",
              err
            );

            setVideoCallError(
              "Unable to establish the video connection."
            );

          }

        }

      }
    );


    // ======================================
    // ICE CANDIDATE
    // ======================================

    socket.on(
      "ice_candidate",
      async callData => {

        // ==================================
        // AUDIO
        // ==================================

        if (
          activeAudioCallRef.current &&
          activeAudioCallRef.current.callId ===
            callData.callId
        ) {

          const peerConnection =
            audioPeerConnectionRef.current;


          if (!peerConnection) {

            return;

          }


          try {

            if (
              peerConnection.remoteDescription
            ) {

              await peerConnection.addIceCandidate(
                new RTCIceCandidate(
                  callData.candidate
                )
              );

            } else {

              pendingAudioIceCandidatesRef.current.push(
                callData.candidate
              );

            }

          } catch (err) {

            console.error(
              "Audio ICE candidate error:",
              err
            );

          }

          return;

        }


        // ==================================
        // VIDEO
        // ==================================

        if (
          activeVideoCallRef.current &&
          activeVideoCallRef.current.callId ===
            callData.callId
        ) {

          const peerConnection =
            videoPeerConnectionRef.current;


          if (!peerConnection) {

            return;

          }


          try {

            if (
              peerConnection.remoteDescription
            ) {

              await peerConnection.addIceCandidate(
                new RTCIceCandidate(
                  callData.candidate
                )
              );

            } else {

              pendingVideoIceCandidatesRef.current.push(
                callData.candidate
              );

            }

          } catch (err) {

            console.error(
              "Video ICE candidate error:",
              err
            );

          }

        }

      }
    );


    // ======================================
    // CALL REJECTED
    // ======================================

    socket.on(
      "call_rejected",
      callData => {

        console.log(
          "Call rejected:",
          callData
        );


        if (
          activeAudioCallRef.current &&
          activeAudioCallRef.current.callId ===
            callData.callId
        ) {

          setAudioCallError(
            "The student declined the audio call."
          );

          cleanupAudioCall();

          return;

        }


        if (
          activeVideoCallRef.current &&
          activeVideoCallRef.current.callId ===
            callData.callId
        ) {

          setVideoCallError(
            "The student declined the video call."
          );

          cleanupVideoCall();

        }

      }
    );


    // ======================================
    // CALL ENDED
    // ======================================

    socket.on(
      "call_ended",
      callData => {

        console.log(
          "Call ended:",
          callData
        );


        if (
          activeAudioCallRef.current &&
          activeAudioCallRef.current.callId ===
            callData.callId
        ) {

          cleanupAudioCall();

          return;

        }


        if (
          activeVideoCallRef.current &&
          activeVideoCallRef.current.callId ===
            callData.callId
        ) {

          cleanupVideoCall();

        }

      }
    );


    // ======================================
    // SOCKET ERROR
    // ======================================

    socket.on(
      "connect_error",
      socketError => {

        console.error(
          "Instructor Socket.IO error:",
          socketError
        );

      }
    );


    return () => {

      socket.removeAllListeners();

      socket.disconnect();

      socketRef.current =
        null;

    };

  }, [
    token,
    conversationId
  ]);


  // ==========================================
  // START AUDIO CALL
  // ==========================================

  const handleStartAudioCall =
    async () => {

      if (
        !student?._id ||
        !conversationId
      ) {

        setAudioCallError(
          "Student information is unavailable."
        );

        return;

      }


      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {

        setAudioCallError(
          "Your browser does not support microphone access."
        );

        return;

      }


      if (
        activeAudioCallRef.current ||
        activeVideoCallRef.current
      ) {

        return;

      }


      try {

        setAudioCallError("");

        setAudioCallSeconds(0);

        setAudioCallConnecting(true);


        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true
            }
          );


        localAudioStreamRef.current =
          stream;


        const callId =
          `audio-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;


        activeAudioCallRef.current = {

          callId,

          conversationId,

          targetUserId:
            student._id,

          callType:
            "audio"

        };


        pendingAudioIceCandidatesRef.current =
          [];


        const peerConnection =
          createAudioPeerConnection();


        stream.getTracks().forEach(
          track => {

            peerConnection.addTrack(
              track,
              stream
            );

          }
        );


        const socket =
          socketRef.current;


        if (!socket) {

          throw new Error(
            "Socket connection is unavailable."
          );

        }


        socket.emit(
          "start_call",
          {

            callId,

            conversationId,

            targetUserId:
              student._id,

            callType:
              "audio"

          }
        );


        startAudioCallTimer();


      } catch (err) {

        console.error(
          "Start audio call error:",
          err
        );


        cleanupAudioCall();


        if (
          err.name ===
          "NotAllowedError"
        ) {

          setAudioCallError(
            "Microphone permission was denied."
          );

        } else {

          setAudioCallError(
            err.message ||
            "Unable to start audio call."
          );

        }

      }

    };


  // ==========================================
  // START VIDEO CALL
  // ==========================================

  const handleStartVideoCall =
    async () => {

      if (
        !student?._id ||
        !conversationId
      ) {

        setVideoCallError(
          "Student information is unavailable."
        );

        return;

      }


      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {

        setVideoCallError(
          "Your browser does not support camera and microphone access."
        );

        return;

      }


      if (
        activeAudioCallRef.current ||
        activeVideoCallRef.current
      ) {

        return;

      }


      try {

        setVideoCallError("");

        setVideoCallSeconds(0);

        setVideoCallConnecting(true);


        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: true
            }
          );


        localVideoStreamRef.current =
          stream;


        if (
          localVideoRef.current
        ) {

          localVideoRef.current.srcObject =
            stream;

          localVideoRef.current.muted =
            true;

          try {

            await localVideoRef.current.play();

          } catch (playError) {

            console.warn(
              "Local video autoplay blocked:",
              playError
            );

          }

        }


        const callId =
          `video-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;


        activeVideoCallRef.current = {

          callId,

          conversationId,

          targetUserId:
            student._id,

          callType:
            "video"

        };


        pendingVideoIceCandidatesRef.current =
          [];


        const peerConnection =
          createVideoPeerConnection();


        stream.getTracks().forEach(
          track => {

            peerConnection.addTrack(
              track,
              stream
            );

          }
        );


        const socket =
          socketRef.current;


        if (!socket) {

          throw new Error(
            "Socket connection is unavailable."
          );

        }


        socket.emit(
          "start_call",
          {

            callId,

            conversationId,

            targetUserId:
              student._id,

            callType:
              "video"

          }
        );


        startVideoCallTimer();


      } catch (err) {

        console.error(
          "Start video call error:",
          err
        );


        cleanupVideoCall();


        if (
          err.name ===
          "NotAllowedError"
        ) {

          setVideoCallError(
            "Camera or microphone permission was denied."
          );

        } else if (
          err.name ===
          "NotFoundError"
        ) {

          setVideoCallError(
            "No camera or microphone was found."
          );

        } else {

          setVideoCallError(
            err.message ||
            "Unable to start video call."
          );

        }

      }

    };


  // ==========================================
  // END AUDIO CALL
  // ==========================================

  const handleEndAudioCall =
    () => {

      if (
        activeAudioCallRef.current &&
        socketRef.current
      ) {

        socketRef.current.emit(
          "end_call",
          {

            callId:
              activeAudioCallRef.current.callId,

            conversationId,

            targetUserId:
              activeAudioCallRef.current.targetUserId

          }
        );

      }


      cleanupAudioCall();

    };


  // ==========================================
  // END VIDEO CALL
  // ==========================================

  const handleEndVideoCall =
    () => {

      if (
        activeVideoCallRef.current &&
        socketRef.current
      ) {

        socketRef.current.emit(
          "end_call",
          {

            callId:
              activeVideoCallRef.current.callId,

            conversationId,

            targetUserId:
              activeVideoCallRef.current.targetUserId

          }
        );

      }


      cleanupVideoCall();

    };


  // ==========================================
  // AUDIO MUTE
  // ==========================================

  const handleToggleAudioMute =
    () => {

      const stream =
        localAudioStreamRef.current;


      if (!stream) {

        return;

      }


      const audioTracks =
        stream.getAudioTracks();


      if (
        audioTracks.length === 0
      ) {

        return;

      }


      const newMutedState =
        !audioCallMuted;


      audioTracks.forEach(
        track => {

          track.enabled =
            !newMutedState;

        }
      );


      setAudioCallMuted(
        newMutedState
      );

    };


  // ==========================================
  // VIDEO MUTE
  // ==========================================

  const handleToggleVideoMute =
    () => {

      const stream =
        localVideoStreamRef.current;


      if (!stream) {

        return;

      }


      const audioTracks =
        stream.getAudioTracks();


      if (
        audioTracks.length === 0
      ) {

        return;

      }


      const newMutedState =
        !videoCallMuted;


      audioTracks.forEach(
        track => {

          track.enabled =
            !newMutedState;

        }
      );


      setVideoCallMuted(
        newMutedState
      );

    };


  // ==========================================
  // VIDEO CAMERA TOGGLE
  // ==========================================

  const handleToggleVideoCamera =
    () => {

      const stream =
        localVideoStreamRef.current;


      if (!stream) {

        return;

      }


      const videoTracks =
        stream.getVideoTracks();


      if (
        videoTracks.length === 0
      ) {

        return;

      }


      const newCameraOff =
        !videoCameraOff;


      videoTracks.forEach(
        track => {

          track.enabled =
            !newCameraOff;

        }
      );


      setVideoCameraOff(
        newCameraOff
      );

    };


  // ==========================================
  // AUDIO TIMER
  // ==========================================

  const startAudioCallTimer =
    () => {

      if (
        audioCallTimerRef.current
      ) {

        clearInterval(
          audioCallTimerRef.current
        );

      }


      audioCallTimerRef.current =
        setInterval(
          () => {

            setAudioCallSeconds(
              previous =>
                previous + 1
            );

          },
          1000
        );

    };


  // ==========================================
  // VIDEO TIMER
  // ==========================================

  const startVideoCallTimer =
    () => {

      if (
        videoCallTimerRef.current
      ) {

        clearInterval(
          videoCallTimerRef.current
        );

      }


      videoCallTimerRef.current =
        setInterval(
          () => {

            setVideoCallSeconds(
              previous =>
                previous + 1
            );

          },
          1000
        );

    };


  // ==========================================
  // FORMAT CALL TIME
  // ==========================================

  const formatCallTime =
    seconds => {

      const minutes =
        Math.floor(
          seconds / 60
        );

      const remainingSeconds =
        seconds % 60;


      return (
        `${String(minutes)
          .padStart(2, "0")}:${String(
          remainingSeconds
        ).padStart(2, "0")}`
      );

    };


  // ==========================================
  // CLEANUP WHEN LEAVING PAGE
  // ==========================================

  useEffect(() => {

    return () => {

      if (
        activeAudioCallRef.current &&
        socketRef.current
      ) {

        socketRef.current.emit(
          "end_call",
          {

            callId:
              activeAudioCallRef.current.callId,

            conversationId,

            targetUserId:
              activeAudioCallRef.current.targetUserId

          }
        );

      }


      if (
        activeVideoCallRef.current &&
        socketRef.current
      ) {

        socketRef.current.emit(
          "end_call",
          {

            callId:
              activeVideoCallRef.current.callId,

            conversationId,

            targetUserId:
              activeVideoCallRef.current.targetUserId

          }
        );

      }


      cleanupAudioCall();

      cleanupVideoCall();

    };

  }, [
    conversationId
  ]);


  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [
    messages
  ]);


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSendMessage =
    async event => {

      event.preventDefault();


      const trimmedMessage =
        message.trim();


      if (
        !trimmedMessage ||
        sending
      ) {

        return;

      }


      try {

        setSending(true);


        const response =
          await fetch(
            `${API_URL}/api/communication/messages`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body: JSON.stringify({

                conversationId,

                content:
                  trimmedMessage,

                type:
                  "text"

              })

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to send message"
          );

        }


        if (data.message) {

          setMessages(
            previous => [
              ...previous,
              data.message
            ]
          );

        }


        setMessage("");


      } catch (err) {

        console.error(
          "Send message error:",
          err
        );

        setError(
          err.message ||
          "Failed to send message."
        );

      } finally {

        setSending(false);

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="instructor-chat-page">

        <div className="instructor-chat-loading">

          <FaComments />

          <p>
            Loading conversation...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (
    error ||
    !conversation
  ) {

    return (

      <div className="instructor-chat-page">

        <div className="instructor-chat-error">

          <FaComments />

          <h2>
            Unable to open chat
          </h2>

          <p>
            {error ||
              "Conversation not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/instructor/communication"
              )
            }
          >
            Back to Communication
          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // CHAT
  // ==========================================

  return (

    <div className="instructor-chat-page">


      {/* ======================================
          HIDDEN REMOTE AUDIO
      ====================================== */}

      <audio
        ref={
          remoteAudioRef
        }
        autoPlay
        playsInline
      />


      {/* ======================================
          VIDEO CALL OVERLAY
      ====================================== */}

      {(
        videoCallActive ||
        videoCallConnecting
      ) && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#111111",
            display: "flex",
            flexDirection: "column"
          }}
        >

          {/* VIDEO AREA */}

          <div
            style={{
              position: "relative",
              flex: 1,
              minHeight: 0,
              overflow: "hidden"
            }}
          >

            {/* REMOTE VIDEO */}

            <video
              ref={
                remoteVideoRef
              }
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                background: "#202020"
              }}
            />


            {/* WAITING STATE */}

            {videoCallConnecting && (

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  background:
                    "rgba(0,0,0,0.45)"
                }}
              >

                <div
                  className="chat-user-avatar"
                  style={{
                    width: "90px",
                    height: "90px",
                    marginBottom: "15px"
                  }}
                >

                  {student?.profileImage ? (

                    <img
                      src={
                        student.profileImage
                      }
                      alt={
                        student.name
                      }
                    />

                  ) : (

                    <span>
                      {(student?.name ||
                        "S")
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                  )}

                </div>

                <h2>
                  {student?.name ||
                    "Student"}
                </h2>

                <p>
                  Waiting for student to connect...
                </p>

              </div>

            )}


            {/* LOCAL VIDEO */}

            <div
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                width: "220px",
                height: "145px",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#000000",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.4)",
                border:
                  "2px solid rgba(255,255,255,0.7)"
              }}
            >

              <video
                ref={
                  localVideoRef
                }
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform:
                    "scaleX(-1)"
                }}
              />

              {videoCameraOff && (

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#202020",
                    color: "#ffffff",
                    fontSize: "30px"
                  }}
                >

                  <FaVideoSlash />

                </div>

              )}

            </div>

          </div>


          {/* CALL INFORMATION */}

          <div
            style={{
              padding: "14px 20px 8px",
              background: "#111111",
              color: "#ffffff",
              textAlign: "center"
            }}
          >

            <strong>
              {student?.name ||
                "Student"}
            </strong>

            <div
              style={{
                opacity: 0.75,
                marginTop: "4px"
              }}
            >

              {videoCallConnecting
                ? "Connecting video call..."
                : `Video call • ${formatCallTime(
                    videoCallSeconds
                  )}`}

            </div>


            {videoCallError && (

              <div
                style={{
                  marginTop: "8px",
                  color: "#ff8a8a"
                }}
              >
                {videoCallError}
              </div>

            )}

          </div>


          {/* CONTROLS */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              padding:
                "15px 20px 30px",
              background: "#111111"
            }}
          >

            <button
              type="button"
              onClick={
                handleToggleVideoMute
              }
              title={
                videoCallMuted
                  ? "Unmute microphone"
                  : "Mute microphone"
              }
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
              }}
            >

              {videoCallMuted ? (
                <FaMicrophoneSlash />
              ) : (
                <FaMicrophone />
              )}

            </button>


            <button
              type="button"
              onClick={
                handleToggleVideoCamera
              }
              title={
                videoCameraOff
                  ? "Turn camera on"
                  : "Turn camera off"
              }
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
              }}
            >

              {videoCameraOff ? (
                <FaVideoSlash />
              ) : (
                <FaVideo />
              )}

            </button>


            <button
              type="button"
              onClick={
                handleEndVideoCall
              }
              title="End video call"
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                border: "none",
                background:
                  "#dc3545",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "19px"
              }}
            >

              <FaPhoneSlash />

            </button>

          </div>

        </div>

      )}


      {/* ======================================
          AUDIO CALL STATUS
      ====================================== */}

      {(
        audioCallActive ||
        audioCallConnecting
      ) && !(
        videoCallActive ||
        videoCallConnecting
      ) && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background:
              "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px 24px",
              textAlign: "center",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)"
            }}
          >

            <div
              className="chat-user-avatar"
              style={{
                margin:
                  "0 auto 15px"
              }}
            >

              {student?.profileImage ? (

                <img
                  src={
                    student.profileImage
                  }
                  alt={
                    student.name
                  }
                />

              ) : (

                <span>
                  {(student?.name ||
                    "S")
                    .charAt(0)
                    .toUpperCase()}
                </span>

              )}

            </div>


            <h2>
              {student?.name ||
                "Student"}
            </h2>


            <p
              style={{
                marginTop: "8px",
                opacity: 0.7
              }}
            >

              {audioCallConnecting
                ? "Connecting audio call..."
                : "Audio call in progress"}

            </p>


            {!audioCallConnecting && (

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "24px",
                  fontWeight: "600"
                }}
              >
                {formatCallTime(
                  audioCallSeconds
                )}
              </div>

            )}


            {audioCallError && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  borderRadius: "8px",
                  background:
                    "#ffe8e8",
                  color:
                    "#c62828",
                  fontSize: "14px"
                }}
              >
                {audioCallError}
              </div>

            )}


            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "25px"
              }}
            >

              <button
                type="button"
                onClick={
                  handleToggleAudioMute
                }
                disabled={
                  audioCallConnecting
                }
                title={
                  audioCallMuted
                    ? "Unmute microphone"
                    : "Mute microphone"
                }
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: "none",
                  cursor:
                    audioCallConnecting
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >

                {audioCallMuted ? (
                  <FaMicrophoneSlash />
                ) : (
                  <FaMicrophone />
                )}

              </button>


              <button
                type="button"
                onClick={
                  handleEndAudioCall
                }
                title="End call"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    "#dc3545",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}
              >

                <FaPhoneSlash />

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================
          AUDIO CALL ERROR
      ====================================== */}

      {audioCallError &&
        !audioCallActive &&
        !audioCallConnecting && (

          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 10000,
              maxWidth: "320px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#ffe8e8",
              color: "#c62828",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.15)"
            }}
          >

            {audioCallError}

          </div>

        )}


      {/* ======================================
          VIDEO CALL ERROR
      ====================================== */}

      {videoCallError &&
        !videoCallActive &&
        !videoCallConnecting && (

          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 10000,
              maxWidth: "320px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#ffe8e8",
              color: "#c62828",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.15)"
            }}
          >

            {videoCallError}

          </div>

        )}


      {/* ======================================
          CHAT HEADER
      ====================================== */}

      <header className="instructor-chat-header">

        <button
          type="button"
          className="chat-back-button"
          onClick={() =>
            navigate(
              "/instructor/communication"
            )
          }
        >

          <FaArrowLeft />

        </button>


        <div className="chat-user-avatar">

          {student?.profileImage ? (

            <img
              src={
                student.profileImage
              }
              alt={
                student.name
              }
            />

          ) : (

            <span>
              {(student?.name ||
                "S")
                .charAt(0)
                .toUpperCase()}
            </span>

          )}

        </div>


        <div className="chat-user-info">

          <h2>
            {student?.name ||
              "Student"}
          </h2>

          <span>
            {student?.email ||
              "Student"}
          </span>

        </div>


        {/* ==================================
            CALL ACTIONS
        ================================== */}

        <div className="chat-header-actions">

          <button
            type="button"
            title="Audio call"
            className="chat-call-button"
            onClick={
              handleStartAudioCall
            }
            disabled={
              audioCallActive ||
              audioCallConnecting ||
              videoCallActive ||
              videoCallConnecting ||
              !student?._id
            }
          >

            <FaPhone />

          </button>


          <button
            type="button"
            title="Video call"
            className="chat-video-button"
            onClick={
              handleStartVideoCall
            }
            disabled={
              audioCallActive ||
              audioCallConnecting ||
              videoCallActive ||
              videoCallConnecting ||
              !student?._id
            }
          >

            <FaVideo />

          </button>


          <button
            type="button"
            title="More"
            className="chat-more-button"
          >

            <FaEllipsisV />

          </button>

        </div>

      </header>


      {/* ======================================
          COURSE INFORMATION
      ====================================== */}

      <div className="chat-course-bar">

        <FaComments />

        <span>
          {conversation.course?.title ||
            "Course Communication"}
        </span>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="chat-inline-error">

          {error}

        </div>

      )}


      {/* ======================================
          MESSAGES
      ====================================== */}

      <main className="chat-messages">

        {messages.length === 0 ? (

          <div className="chat-empty">

            <FaComments />

            <h3>
              Start a conversation
            </h3>

            <p>
              Send a message to your
              student.
            </p>

          </div>

        ) : (

          messages.map(
            currentMessage => {

              const isMine =
                currentMessage.sender?._id ===
                  user?._id ||
                currentMessage.sender ===
                  user?._id;


              return (

                <div
                  key={
                    currentMessage._id
                  }
                  className={
                    isMine
                      ? "chat-message-row mine"
                      : "chat-message-row"
                  }
                >

                  <div
                    className={
                      isMine
                        ? "chat-message-bubble mine"
                        : "chat-message-bubble"
                    }
                  >

                    {currentMessage.type ===
                    "text" ? (

                      <p>
                        {
                          currentMessage.content
                        }
                      </p>

                    ) : (

                      <p>
                        {
                          currentMessage.type
                        }
                      </p>

                    )}


                    <span className="chat-message-time">

                      {currentMessage.createdAt
                        ? new Date(
                            currentMessage.createdAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit"
                            }
                          )
                        : ""}

                    </span>

                  </div>

                </div>

              );

            }

          )

        )}


        <div
          ref={
            messagesEndRef
          }
        />

      </main>


      {/* ======================================
          MESSAGE INPUT
      ====================================== */}

      <form
        className="chat-input-area"
        onSubmit={
          handleSendMessage
        }
      >

        <button
          type="button"
          className="chat-input-action"
          title="Voice message"
          onClick={() =>
            console.log(
              "Voice messages will be added next"
            )
          }
        >

          <FaMicrophone />

        </button>


        <input
          type="text"
          placeholder="Type a message..."
          value={
            message
          }
          onChange={
            event =>
              setMessage(
                event.target.value
              )
          }
          disabled={
            audioCallActive ||
            audioCallConnecting ||
            videoCallActive ||
            videoCallConnecting
          }
        />


        <button
          type="submit"
          className="chat-send-button"
          disabled={
            !message.trim() ||
            sending ||
            audioCallActive ||
            audioCallConnecting ||
            videoCallActive ||
            videoCallConnecting
          }
        >

          <FaPaperPlane />

        </button>

      </form>

    </div>

  );

};


export default InstructorChat;