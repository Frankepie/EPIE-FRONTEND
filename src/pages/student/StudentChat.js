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
  FaVideo,
  FaEllipsisV,
  FaComments,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaStop,
  FaTrash,
  FaPlay,
  FaPause,
  FaPhoneSlash,
  FaMicrophoneSlash,
  FaVideoSlash
} from "react-icons/fa";

import {
  io
} from "socket.io-client";

import {
  useAuth
} from "../../context/AuthContext";

import "../../styles/StudentChat.css";


const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


const StudentChat = () => {

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

  const [
    socketConnected,
    setSocketConnected
  ] = useState(false);


  // ==========================================
  // VOICE MESSAGE STATE
  // ==========================================

  const [
    isRecording,
    setIsRecording
  ] = useState(false);

  const [
    recordingSeconds,
    setRecordingSeconds
  ] = useState(0);

  const [
    audioBlob,
    setAudioBlob
  ] = useState(null);

  const [
    audioPreviewUrl,
    setAudioPreviewUrl
  ] = useState("");

  const [
    voiceSending,
    setVoiceSending
  ] = useState(false);

  const [
    voicePlaying,
    setVoicePlaying
  ] = useState(false);


  // ==========================================
  // AUDIO CALL STATE
  // ==========================================

  const [
    incomingCall,
    setIncomingCall
  ] = useState(null);

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
  // VOICE MESSAGE REFS
  // ==========================================

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const recordingTimerRef =
    useRef(null);

  const audioPreviewRef =
    useRef(null);


  // ==========================================
  // AUDIO WEBRTC REFS
  // ==========================================

  const audioPeerConnectionRef =
    useRef(null);

  const localAudioStreamRef =
    useRef(null);

  const remoteAudioRef =
    useRef(null);

  const audioActiveCallRef =
    useRef(null);

  const audioCallTimerRef =
    useRef(null);


  // ==========================================
  // VIDEO WEBRTC REFS
  // ==========================================

  const videoPeerConnectionRef =
    useRef(null);

  const localVideoStreamRef =
    useRef(null);

  const remoteVideoRef =
    useRef(null);

  const localVideoRef =
    useRef(null);

  const videoActiveCallRef =
    useRef(null);

  const videoCallTimerRef =
    useRef(null);

  const pendingVideoIceCandidatesRef =
    useRef([]);


  // ==========================================
  // CLEANUP AUDIO CALL
  // ==========================================

  const cleanupAudioCall =
    () => {

      if (
        localAudioStreamRef.current
      ) {

        localAudioStreamRef.current
          .getTracks()
          .forEach(
            track =>
              track.stop()
          );

        localAudioStreamRef.current =
          null;

      }


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

        audioPeerConnectionRef.current =
          null;

      }


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


      audioActiveCallRef.current =
        null;


      setIncomingCall(
        null
      );

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
  // CLEANUP VIDEO CALL
  // ==========================================

  const cleanupVideoCall =
    () => {

      if (
        localVideoStreamRef.current
      ) {

        localVideoStreamRef.current
          .getTracks()
          .forEach(
            track =>
              track.stop()
          );

        localVideoStreamRef.current =
          null;

      }


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

        videoPeerConnectionRef.current =
          null;

      }


      if (
        remoteVideoRef.current
      ) {

        remoteVideoRef.current.srcObject =
          null;

      }


      if (
        localVideoRef.current
      ) {

        localVideoRef.current.srcObject =
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


      videoActiveCallRef.current =
        null;

      pendingVideoIceCandidatesRef.current =
        [];


      setIncomingCall(
        null
      );

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
  // LOAD FORUM + CONNECT SOCKET
  // ==========================================

  useEffect(() => {

    if (
      !token ||
      !conversationId
    ) {

      return;

    }


    let mounted = true;


    const loadForum =
      async () => {

        try {

          setLoading(true);

          setError("");


          // ====================================
          // LOAD FORUM
          // ====================================

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
              "Failed to load course forum"
            );

          }


          if (!mounted) {
            return;
          }


          setConversation(
            data.conversation
          );

          setMessages(
            data.messages || []
          );


          // ====================================
          // SOCKET
          // ====================================

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


          // ====================================
          // SOCKET CONNECTED
          // ====================================

          socket.on(
            "connect",
            () => {

              console.log(
                "Student Forum Socket.IO connected:",
                socket.id
              );


              setSocketConnected(
                true
              );


              socket.emit(
                "join_conversation",
                conversationId
              );

            }
          );


          // ====================================
          // FORUM JOINED
          // ====================================

          socket.on(
            "conversation_joined",
            socketData => {

              console.log(
                "Course forum joined:",
                socketData
              );

            }
          );


          // ====================================
          // NEW MESSAGE
          // ====================================

          socket.on(
            "new_message",
            newMessage => {

              setMessages(
                previousMessages => {

                  const alreadyExists =
                    previousMessages.some(
                      existingMessage =>
                        existingMessage._id ===
                        newMessage._id
                    );


                  if (
                    alreadyExists
                  ) {

                    return previousMessages;

                  }


                  return [
                    ...previousMessages,
                    newMessage
                  ];

                }
              );

            }
          );


          // ====================================
          // INCOMING CALL
          // ====================================

          socket.on(
            "incoming_call",
            callData => {

              console.log(
                "Incoming forum call:",
                callData
              );


              if (
                callData?.callType !==
                  "audio" &&
                callData?.callType !==
                  "video"
              ) {

                return;

              }


              setIncomingCall(
                callData
              );


              setAudioCallError(
                ""
              );

              setVideoCallError(
                ""
              );

            }
          );


          // ====================================
          // CALL ACCEPTED
          // ====================================

          socket.on(
            "call_accepted",
            callData => {

              console.log(
                "Call accepted:",
                callData
              );

            }
          );


          // ====================================
          // WEBRTC OFFER
          // ====================================

          socket.on(
            "call_offer",
            async callData => {

              console.log(
                "WebRTC offer received:",
                callData
              );


              if (
                !callData?.callId ||
                !callData?.offer
              ) {

                return;

              }


              // ==================================
              // VIDEO OFFER
              // ==================================

              if (
                videoActiveCallRef.current?.callId ===
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
                      callData.offer
                    )
                  );


                  const answer =
                    await peerConnection.createAnswer();


                  await peerConnection.setLocalDescription(
                    answer
                  );


                  socket.emit(
                    "call_answer",
                    {
                      callId:
                        callData.callId,

                      targetUserId:
                        callData.callerId,

                      answer
                    }
                  );


                  setVideoCallConnecting(
                    false
                  );

                  setVideoCallActive(
                    true
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


                } catch (offerError) {

                  console.error(
                    "Handle video offer error:",
                    offerError
                  );


                  setVideoCallError(
                    "Unable to connect the video call."
                  );

                }


                return;

              }


              // ==================================
              // AUDIO OFFER
              // ==================================

              if (
                audioActiveCallRef.current?.callId !==
                callData.callId
              ) {

                return;

              }


              try {

                const peerConnection =
                  audioPeerConnectionRef.current;


                if (
                  !peerConnection
                ) {

                  return;

                }


                await peerConnection.setRemoteDescription(
                  new RTCSessionDescription(
                    callData.offer
                  )
                );


                const answer =
                  await peerConnection.createAnswer();


                await peerConnection.setLocalDescription(
                  answer
                );


                socket.emit(
                  "call_answer",
                  {
                    callId:
                      callData.callId,

                    targetUserId:
                      callData.callerId,

                    answer
                  }
                );


                setAudioCallConnecting(
                  false
                );

                setAudioCallActive(
                  true
                );


              } catch (offerError) {

                console.error(
                  "Handle audio offer error:",
                  offerError
                );


                setAudioCallError(
                  "Unable to connect the audio call."
                );

              }

            }
          );


          // ====================================
          // CALL ANSWER
          // ====================================

          socket.on(
            "call_answer",
            async callData => {

              /*
               * The student is normally the
               * answering party. This listener
               * is kept here for compatibility
               * with both signaling directions.
               */

              console.log(
                "Call answer received:",
                callData
              );

            }
          );


          // ====================================
          // ICE CANDIDATE
          // ====================================

          socket.on(
            "ice_candidate",
            async callData => {

              try {

                if (
                  !callData?.callId ||
                  !callData?.candidate
                ) {

                  return;

                }


                // ==================================
                // VIDEO ICE
                // ==================================

                if (
                  videoActiveCallRef.current?.callId ===
                  callData.callId
                ) {

                  const peerConnection =
                    videoPeerConnectionRef.current;


                  if (!peerConnection) {
                    return;
                  }


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


                  return;

                }


                // ==================================
                // AUDIO ICE
                // ==================================

                if (
                  audioActiveCallRef.current?.callId !==
                  callData.callId
                ) {

                  return;

                }


                const peerConnection =
                  audioPeerConnectionRef.current;


                if (
                  !peerConnection
                ) {

                  return;

                }


                await peerConnection.addIceCandidate(
                  new RTCIceCandidate(
                    callData.candidate
                  )
                );


              } catch (iceError) {

                console.error(
                  "Add ICE candidate error:",
                  iceError
                );

              }

            }
          );


          // ====================================
          // CALL REJECTED
          // ====================================

          socket.on(
            "call_rejected",
            callData => {

              console.log(
                "Call rejected:",
                callData
              );


              if (
                audioActiveCallRef.current?.callId ===
                callData?.callId
              ) {

                cleanupAudioCall();

                setAudioCallError(
                  "The instructor declined the call."
                );

              }


              if (
                videoActiveCallRef.current?.callId ===
                callData?.callId
              ) {

                cleanupVideoCall();

                setVideoCallError(
                  "The instructor declined the call."
                );

              }

            }
          );


          // ====================================
          // CALL ENDED
          // ====================================

          socket.on(
            "call_ended",
            callData => {

              console.log(
                "Call ended:",
                callData
              );


              if (
                audioActiveCallRef.current?.callId ===
                callData?.callId
              ) {

                cleanupAudioCall();

              }


              if (
                videoActiveCallRef.current?.callId ===
                callData?.callId
              ) {

                cleanupVideoCall();

              }

            }
          );


          // ====================================
          // SOCKET ERROR
          // ====================================

          socket.on(
            "communication_error",
            socketError => {

              console.error(
                "Forum socket error:",
                socketError
              );


              setError(
                socketError?.message ||
                "Forum communication error"
              );

              setSending(false);

            }
          );


          // ====================================
          // DISCONNECT
          // ====================================

          socket.on(
            "disconnect",
            reason => {

              console.log(
                "Student Forum Socket.IO disconnected:",
                reason
              );


              setSocketConnected(
                false
              );

            }
          );


          // ====================================
          // CONNECTION ERROR
          // ====================================

          socket.on(
            "connect_error",
            socketError => {

              console.error(
                "Forum socket connection error:",
                socketError
              );


              setSocketConnected(
                false
              );

              setError(
                "Unable to connect to the course forum."
              );

            }
          );

        } catch (err) {

          console.error(
            "Load student forum error:",
            err
          );


          if (mounted) {

            setError(
              err.message ||
              "Failed to load course forum."
            );

          }

        } finally {

          if (mounted) {

            setLoading(false);

          }

        }

      };


    loadForum();


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      mounted = false;


      cleanupAudioCall();

      cleanupVideoCall();


      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
        "inactive"
      ) {

        mediaRecorderRef.current.stop();

      }


      if (
        recordingTimerRef.current
      ) {

        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current =
          null;

      }


      if (
        audioPreviewUrl
      ) {

        URL.revokeObjectURL(
          audioPreviewUrl
        );

      }


      if (
        socketRef.current
      ) {

        socketRef.current.emit(
          "leave_conversation",
          conversationId
        );


        socketRef.current.disconnect();

        socketRef.current =
          null;

      }

    };

  }, [
    token,
    conversationId
  ]);


  // ==========================================
  // AUDIO CALL TIMER
  // ==========================================

  useEffect(() => {

    if (
      !audioCallActive
    ) {

      if (
        audioCallTimerRef.current
      ) {

        clearInterval(
          audioCallTimerRef.current
        );

        audioCallTimerRef.current =
          null;

      }

      return;

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


    return () => {

      if (
        audioCallTimerRef.current
      ) {

        clearInterval(
          audioCallTimerRef.current
        );

        audioCallTimerRef.current =
          null;

      }

    };

  }, [
    audioCallActive
  ]);


  // ==========================================
  // VIDEO CALL TIMER
  // ==========================================

  useEffect(() => {

    if (
      !videoCallActive
    ) {

      if (
        videoCallTimerRef.current
      ) {

        clearInterval(
          videoCallTimerRef.current
        );

        videoCallTimerRef.current =
          null;

      }

      return;

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


    return () => {

      if (
        videoCallTimerRef.current
      ) {

        clearInterval(
          videoCallTimerRef.current
        );

        videoCallTimerRef.current =
          null;

      }

    };

  }, [
    videoCallActive
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
  // FIND INSTRUCTOR
  // ==========================================

  const instructor =
    conversation?.participants?.find(
      participant =>
        participant?.role?.toLowerCase() ===
        "instructor"
    );


  // ==========================================
  // COURSE
  // ==========================================

  const course =
    conversation?.course;


  const courseTitle =
    course?.title ||
    "Course Forum";


  // ==========================================
  // FORMAT DURATION
  // ==========================================

  const formatDuration =
    seconds => {

      const totalSeconds =
        Math.max(
          0,
          Math.floor(
            Number(seconds) || 0
          )
        );


      const minutes =
        Math.floor(
          totalSeconds / 60
        );


      const remainingSeconds =
        totalSeconds % 60;


      return (
        `${String(minutes).padStart(2, "0")}:${String(
          remainingSeconds
        ).padStart(2, "0")}`
      );

    };


  // ==========================================
  // CREATE AUDIO PEER CONNECTION
  // ==========================================

  const createAudioPeerConnection =
    callData => {

      if (
        !socketRef.current
      ) {

        throw new Error(
          "Socket connection is not available."
        );

      }


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
            !event.candidate
          ) {

            return;

          }


          socketRef.current.emit(
            "ice_candidate",
            {

              callId:
                callData.callId,

              targetUserId:
                callData.callerId,

              candidate:
                event.candidate

            }
          );

        };


      peerConnection.ontrack =
        event => {

          if (
            remoteAudioRef.current &&
            event.streams?.[0]
          ) {

            remoteAudioRef.current.srcObject =
              event.streams[0];


            remoteAudioRef.current
              .play()
              .catch(
                playbackError =>
                  console.warn(
                    "Remote audio autoplay blocked:",
                    playbackError
                  )
              );

          }

        };


      peerConnection.onconnectionstatechange =
        () => {

          const state =
            peerConnection.connectionState;


          console.log(
            "Audio WebRTC state:",
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

            setAudioCallError(
              "Audio call connection failed."
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
    callData => {

      if (
        !socketRef.current
      ) {

        throw new Error(
          "Socket connection is not available."
        );

      }


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


      // ========================================
      // LOCAL ICE
      // ========================================

      peerConnection.onicecandidate =
        event => {

          if (
            !event.candidate
          ) {

            return;

          }


          socketRef.current.emit(
            "ice_candidate",
            {

              callId:
                callData.callId,

              targetUserId:
                callData.callerId,

              candidate:
                event.candidate

            }
          );

        };


      // ========================================
      // REMOTE VIDEO
      // ========================================

      peerConnection.ontrack =
        event => {

          console.log(
            "Remote video/audio track received."
          );


          if (
            remoteVideoRef.current &&
            event.streams?.[0]
          ) {

            remoteVideoRef.current.srcObject =
              event.streams[0];


            remoteVideoRef.current
              .play()
              .catch(
                playbackError =>
                  console.warn(
                    "Remote video autoplay blocked:",
                    playbackError
                  )
              );

          }

        };


      // ========================================
      // CONNECTION STATE
      // ========================================

      peerConnection.onconnectionstatechange =
        () => {

          const state =
            peerConnection.connectionState;


          console.log(
            "Video WebRTC state:",
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

            setVideoCallError(
              "Video call connection failed."
            );

          }

        };


      videoPeerConnectionRef.current =
        peerConnection;


      return peerConnection;

    };


  // ==========================================
  // ACCEPT AUDIO CALL
  // ==========================================

  const handleAcceptAudioCall =
    async () => {

      if (
        !incomingCall ||
        incomingCall.callType !==
        "audio" ||
        !socketRef.current
      ) {

        return;

      }


      try {

        setAudioCallError("");

        setAudioCallConnecting(true);


        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {

          throw new Error(
            "Microphone access is not supported by this browser."
          );

        }


        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true
          });


        localAudioStreamRef.current =
          stream;


        audioActiveCallRef.current = {

          callId:
            incomingCall.callId,

          conversationId:
            incomingCall.conversationId,

          callerId:
            incomingCall.callerId,

          callType:
            "audio"

        };


        const peerConnection =
          createAudioPeerConnection(
            incomingCall
          );


        stream
          .getTracks()
          .forEach(
            track => {

              peerConnection.addTrack(
                track,
                stream
              );

            }
          );


        socketRef.current.emit(
          "accept_call",
          {

            callId:
              incomingCall.callId,

            conversationId:
              incomingCall.conversationId,

            callerId:
              incomingCall.callerId

          }
        );


        setIncomingCall(
          null
        );

        setAudioCallSeconds(
          0
        );


      } catch (err) {

        console.error(
          "Accept audio call error:",
          err
        );


        setAudioCallError(
          err.message ||
          "Unable to access your microphone."
        );


        cleanupAudioCall();

      }

    };


  // ==========================================
  // ACCEPT VIDEO CALL
  // ==========================================

  const handleAcceptVideoCall =
    async () => {

      if (
        !incomingCall ||
        incomingCall.callType !==
        "video" ||
        !socketRef.current
      ) {

        return;

      }


      try {

        setVideoCallError("");

        setVideoCallConnecting(true);


        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {

          throw new Error(
            "Camera and microphone access are not supported by this browser."
          );

        }


        // ======================================
        // REQUEST CAMERA + MICROPHONE
        // ======================================

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: true
            }
          );


        localVideoStreamRef.current =
          stream;


        // ======================================
        // LOCAL PREVIEW
        // ======================================

        if (
          localVideoRef.current
        ) {

          localVideoRef.current.srcObject =
            stream;


          localVideoRef.current
            .play()
            .catch(
              playbackError =>
                console.warn(
                  "Local video playback blocked:",
                  playbackError
                )
            );

        }


        // ======================================
        // SAVE CALL
        // ======================================

        videoActiveCallRef.current = {

          callId:
            incomingCall.callId,

          conversationId:
            incomingCall.conversationId,

          callerId:
            incomingCall.callerId,

          callType:
            "video"

        };


        pendingVideoIceCandidatesRef.current =
          [];


        // ======================================
        // CREATE PEER
        // ======================================

        const peerConnection =
          createVideoPeerConnection(
            incomingCall
          );


        // ======================================
        // ADD CAMERA + MICROPHONE
        // ======================================

        stream
          .getTracks()
          .forEach(
            track => {

              peerConnection.addTrack(
                track,
                stream
              );

            }
          );


        // ======================================
        // ACCEPT CALL
        // ======================================

        socketRef.current.emit(
          "accept_call",
          {

            callId:
              incomingCall.callId,

            conversationId:
              incomingCall.conversationId,

            callerId:
              incomingCall.callerId

          }
        );


        setIncomingCall(
          null
        );

        setVideoCallSeconds(
          0
        );


        console.log(
          "Video call accepted"
        );


      } catch (err) {

        console.error(
          "Accept video call error:",
          err
        );


        setVideoCallError(
          err.message ||
          "Unable to access your camera and microphone."
        );


        cleanupVideoCall();

      }

    };


  // ==========================================
  // REJECT CALL
  // ==========================================

  const handleRejectCall =
    () => {

      if (
        !incomingCall ||
        !socketRef.current
      ) {

        return;

      }


      socketRef.current.emit(
        "reject_call",
        {

          callId:
            incomingCall.callId,

          targetUserId:
            incomingCall.callerId,

          conversationId:
            incomingCall.conversationId

        }
      );


      setIncomingCall(
        null
      );

      setAudioCallError("");
      setVideoCallError("");

    };


  // ==========================================
  // END AUDIO CALL
  // ==========================================

  const handleEndAudioCall =
    () => {

      const call =
        audioActiveCallRef.current;


      if (
        call &&
        socketRef.current
      ) {

        socketRef.current.emit(
          "end_call",
          {

            callId:
              call.callId,

            targetUserId:
              call.callerId,

            conversationId:
              call.conversationId

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

      const call =
        videoActiveCallRef.current;


      if (
        call &&
        socketRef.current
      ) {

        socketRef.current.emit(
          "end_call",
          {

            callId:
              call.callId,

            targetUserId:
              call.callerId,

            conversationId:
              call.conversationId

          }
        );

      }


      cleanupVideoCall();

    };


  // ==========================================
  // MUTE AUDIO CALL
  // ==========================================

  const handleToggleAudioMute =
    () => {

      const stream =
        localAudioStreamRef.current;


      if (!stream) {
        return;
      }


      const tracks =
        stream.getAudioTracks();


      if (
        tracks.length === 0
      ) {

        return;

      }


      const nextMuted =
        !audioCallMuted;


      tracks.forEach(
        track => {

          track.enabled =
            !nextMuted;

        }
      );


      setAudioCallMuted(
        nextMuted
      );

    };


  // ==========================================
  // MUTE VIDEO CALL
  // ==========================================

  const handleToggleVideoMute =
    () => {

      const stream =
        localVideoStreamRef.current;


      if (!stream) {
        return;
      }


      const tracks =
        stream.getAudioTracks();


      if (
        tracks.length === 0
      ) {

        return;

      }


      const nextMuted =
        !videoCallMuted;


      tracks.forEach(
        track => {

          track.enabled =
            !nextMuted;

        }
      );


      setVideoCallMuted(
        nextMuted
      );

    };


  // ==========================================
  // CAMERA ON / OFF
  // ==========================================

  const handleToggleVideoCamera =
    () => {

      const stream =
        localVideoStreamRef.current;


      if (!stream) {
        return;
      }


      const tracks =
        stream.getVideoTracks();


      if (
        tracks.length === 0
      ) {

        return;

      }


      const nextCameraOff =
        !videoCameraOff;


      tracks.forEach(
        track => {

          track.enabled =
            !nextCameraOff;

        }
      );


      setVideoCameraOff(
        nextCameraOff
      );

    };


  // ==========================================
  // VOICE RECORDING MIME TYPE
  // ==========================================

  const getSupportedMimeType =
    () => {

      if (
        typeof MediaRecorder ===
        "undefined"
      ) {

        return "";

      }


      const mimeTypes = [

        "audio/webm;codecs=opus",

        "audio/webm",

        "audio/ogg;codecs=opus",

        "audio/ogg"

      ];


      return (
        mimeTypes.find(
          mimeType =>
            MediaRecorder.isTypeSupported(
              mimeType
            )
        ) || ""
      );

    };


  // ==========================================
  // START RECORDING
  // ==========================================

  const handleStartRecording =
    async () => {

      if (
        isRecording ||
        voiceSending ||
        audioCallActive ||
        videoCallActive
      ) {

        return;

      }


      try {

        setError("");


        if (
          typeof MediaRecorder ===
          "undefined"
        ) {

          throw new Error(
            "Voice recording is not supported by this browser."
          );

        }


        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {

          throw new Error(
            "Microphone access is not supported by this browser."
          );

        }


        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true
            }
          );


        const mimeType =
          getSupportedMimeType();


        const recorder =
          mimeType
            ? new MediaRecorder(
                stream,
                {
                  mimeType
                }
              )
            : new MediaRecorder(
                stream
              );


        mediaRecorderRef.current =
          recorder;


        audioChunksRef.current =
          [];


        setAudioBlob(null);


        if (
          audioPreviewUrl
        ) {

          URL.revokeObjectURL(
            audioPreviewUrl
          );

          setAudioPreviewUrl("");

        }


        setRecordingSeconds(
          0
        );


        recorder.ondataavailable =
          event => {

            if (
              event.data &&
              event.data.size > 0
            ) {

              audioChunksRef.current.push(
                event.data
              );

            }

          };


        recorder.onstop =
          () => {

            const finalMimeType =
              recorder.mimeType ||
              mimeType ||
              "audio/webm";


            const blob =
              new Blob(
                audioChunksRef.current,
                {
                  type:
                    finalMimeType
                }
              );


            setAudioBlob(
              blob
            );


            const previewUrl =
              URL.createObjectURL(
                blob
              );


            setAudioPreviewUrl(
              previewUrl
            );


            stream
              .getTracks()
              .forEach(
                track =>
                  track.stop()
              );


            setIsRecording(
              false
            );


            mediaRecorderRef.current =
              null;

          };


        recorder.onerror =
          event => {

            console.error(
              "MediaRecorder error:",
              event
            );


            setError(
              "Unable to record the voice message."
            );


            stream
              .getTracks()
              .forEach(
                track =>
                  track.stop()
              );


            setIsRecording(
              false
            );

          };


        recorder.start(
          250
        );


        setIsRecording(
          true
        );


        recordingTimerRef.current =
          setInterval(
            () => {

              setRecordingSeconds(
                previous =>
                  previous + 1
              );

            },
            1000
          );

      } catch (err) {

        console.error(
          "Start voice recording error:",
          err
        );


        setError(
          err.message ||
          "Unable to access your microphone."
        );


        setIsRecording(
          false
        );

      }

    };


  // ==========================================
  // STOP RECORDING
  // ==========================================

  const handleStopRecording =
    () => {

      if (
        recordingTimerRef.current
      ) {

        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current =
          null;

      }


      const recorder =
        mediaRecorderRef.current;


      if (
        recorder &&
        recorder.state !==
        "inactive"
      ) {

        recorder.stop();

      }

    };


  // ==========================================
  // CANCEL VOICE
  // ==========================================

  const handleCancelRecording =
    () => {

      const recorder =
        mediaRecorderRef.current;


      if (
        recorder &&
        recorder.state !==
        "inactive"
      ) {

        recorder.stop();

      }


      if (
        recordingTimerRef.current
      ) {

        clearInterval(
          recordingTimerRef.current
        );

        recordingTimerRef.current =
          null;

      }


      if (
        audioPreviewUrl
      ) {

        URL.revokeObjectURL(
          audioPreviewUrl
        );

      }


      setAudioBlob(null);

      setAudioPreviewUrl("");

      setRecordingSeconds(0);

      setIsRecording(false);

      audioChunksRef.current = [];

      mediaRecorderRef.current = null;

    };


  // ==========================================
  // PREVIEW PLAYBACK
  // ==========================================

  const handlePreviewPlayback =
    () => {

      if (
        !audioPreviewRef.current
      ) {

        return;

      }


      if (
        audioPreviewRef.current.paused
      ) {

        audioPreviewRef.current
          .play()
          .catch(
            playbackError =>
              console.error(
                "Audio preview error:",
                playbackError
              )
          );

      } else {

        audioPreviewRef.current.pause();

      }

    };


  // ==========================================
  // SEND VOICE
  // ==========================================

  const handleSendVoiceMessage =
    async () => {

      if (
        !audioBlob ||
        voiceSending ||
        !conversationId
      ) {

        return;

      }


      try {

        setVoiceSending(true);

        setError("");


        const formData =
          new FormData();


        formData.append(
          "conversationId",
          conversationId
        );


        formData.append(
          "duration",
          recordingSeconds
        );


        formData.append(
          "audio",
          audioBlob,
          "voice-message.webm"
        );


        const response =
          await fetch(
            `${API_URL}/api/communication/voice`,
            {

              method:
                "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`
              },

              body:
                formData

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to send voice message."
          );

        }


        const newVoiceMessage =
          data.message ||
          data.data;


        if (
          newVoiceMessage
        ) {

          setMessages(
            previousMessages => {

              const alreadyExists =
                previousMessages.some(
                  existingMessage =>
                    existingMessage._id ===
                    newVoiceMessage._id
                );


              if (
                alreadyExists
              ) {

                return previousMessages;

              }


              return [
                ...previousMessages,
                newVoiceMessage
              ];

            }
          );

        }


        if (
          audioPreviewUrl
        ) {

          URL.revokeObjectURL(
            audioPreviewUrl
          );

        }


        setAudioBlob(null);

        setAudioPreviewUrl("");

        setRecordingSeconds(0);

        setVoiceSending(false);

      } catch (err) {

        console.error(
          "Send voice message error:",
          err
        );


        setError(
          err.message ||
          "Failed to send voice message."
        );


        setVoiceSending(false);

      }

    };


  // ==========================================
  // SEND TEXT
  // ==========================================

  const handleSendMessage =
    event => {

      event.preventDefault();


      const trimmedMessage =
        message.trim();


      if (
        !trimmedMessage ||
        sending
      ) {

        return;

      }


      if (
        !socketRef.current ||
        !socketConnected
      ) {

        setError(
          "Forum is not connected. Please wait a moment and try again."
        );

        return;

      }


      setSending(true);

      setError("");


      socketRef.current.emit(
        "send_message",
        {

          conversationId,

          content:
            trimmedMessage

        }
      );


      setMessage("");


      setTimeout(
        () => {

          setSending(false);

        },
        300
      );

    };


  // ==========================================
  // RENDER VOICE MESSAGE
  // ==========================================

  const renderVoiceMessage =
    currentMessage => {

      return (

        <div className="student-chat-voice-message">

          <div className="student-chat-voice-icon">

            <FaMicrophone />

          </div>


          <div className="student-chat-voice-content">

            <audio
              controls
              preload="metadata"
              src={
                currentMessage.mediaUrl
              }
            />


            <span className="student-chat-voice-duration">

              {formatDuration(
                currentMessage.duration
              )}

            </span>

          </div>

        </div>

      );

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="student-chat-page">

        <div className="student-chat-loading">

          <FaComments />

          <p>
            Loading course forum...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !conversation
  ) {

    return (

      <div className="student-chat-page">

        <div className="student-chat-error">

          <FaComments />

          <h2>
            Unable to open forum
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/communication"
              )
            }
          >
            Back to Forum
          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // FORUM PAGE
  // ==========================================

  return (

    <div className="student-chat-page">


      {/* ======================================
          INCOMING CALL
      ====================================== */}

      {incomingCall && (

        <div className="student-chat-call-overlay">

          <div className="student-chat-incoming-call">

            <div className="student-chat-incoming-call-icon">

              {incomingCall.callType ===
              "video" ? (
                <FaVideo />
              ) : (
                <FaPhone />
              )}

            </div>


            <h2>

              {incomingCall.callType ===
              "video"
                ? "Incoming Video Call"
                : "Incoming Audio Call"}

            </h2>


            <p>
              {incomingCall.callerName ||
                "Course Instructor"}
            </p>


            <span>
              {courseTitle}
            </span>


            {(
              audioCallError ||
              videoCallError
            ) && (

              <div className="student-chat-call-error">

                {incomingCall.callType ===
                "video"
                  ? videoCallError
                  : audioCallError}

              </div>

            )}


            <div className="student-chat-incoming-actions">

              <button
                type="button"
                className="student-chat-reject-call"
                onClick={
                  handleRejectCall
                }
              >

                <FaPhoneSlash />

                <span>
                  Reject
                </span>

              </button>


              <button
                type="button"
                className="student-chat-accept-call"
                onClick={
                  incomingCall.callType ===
                  "video"
                    ? handleAcceptVideoCall
                    : handleAcceptAudioCall
                }
              >

                {incomingCall.callType ===
                "video" ? (
                  <FaVideo />
                ) : (
                  <FaPhone />
                )}

                <span>
                  Accept
                </span>

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================
          ACTIVE AUDIO CALL
      ====================================== */}

      {audioCallActive && (

        <div className="student-chat-call-overlay">

          <div className="student-chat-active-call">

            <div className="student-chat-active-call-icon">

              <FaPhone />

            </div>


            <h2>
              Audio Call
            </h2>


            <p>
              {instructor?.name ||
                "Course Instructor"}
            </p>


            <span>
              {formatDuration(
                audioCallSeconds
              )}
            </span>


            {audioCallError && (

              <div className="student-chat-call-error">

                {audioCallError}

              </div>

            )}


            <div className="student-chat-active-call-actions">

              <button
                type="button"
                className={
                  audioCallMuted
                    ? "student-chat-call-control muted"
                    : "student-chat-call-control"
                }
                onClick={
                  handleToggleAudioMute
                }
                title={
                  audioCallMuted
                    ? "Unmute microphone"
                    : "Mute microphone"
                }
              >

                {audioCallMuted
                  ? <FaMicrophoneSlash />
                  : <FaMicrophone />}

              </button>


              <button
                type="button"
                className="student-chat-end-call"
                onClick={
                  handleEndAudioCall
                }
                title="End call"
              >

                <FaPhoneSlash />

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================
          ACTIVE VIDEO CALL
      ====================================== */}

      {(
        videoCallActive ||
        videoCallConnecting
      ) && (

        <div className="student-chat-video-call-overlay">

          {/* REMOTE VIDEO */}

          <video
            ref={
              remoteVideoRef
            }
            className="student-chat-remote-video"
            autoPlay
            playsInline
          />


          {/* FALLBACK WHEN CONNECTING */}

          {videoCallConnecting && (

            <div className="student-chat-video-connecting">

              <FaVideo />

              <h2>
                Connecting video call...
              </h2>

              <p>
                {instructor?.name ||
                  "Course Instructor"}
              </p>

            </div>

          )}


          {/* LOCAL VIDEO */}

          <div className="student-chat-local-video-container">

            <video
              ref={
                localVideoRef
              }
              className="student-chat-local-video"
              autoPlay
              muted
              playsInline
            />

          </div>


          {/* CALL INFORMATION */}

          <div className="student-chat-video-call-info">

            <strong>
              {instructor?.name ||
                "Course Instructor"}
            </strong>


            <span>
              {formatDuration(
                videoCallSeconds
              )}
            </span>

          </div>


          {/* CALL ERROR */}

          {videoCallError && (

            <div className="student-chat-video-call-error">

              {videoCallError}

            </div>

          )}


          {/* CONTROLS */}

          <div className="student-chat-video-controls">

            <button
              type="button"
              className={
                videoCallMuted
                  ? "student-chat-video-control active"
                  : "student-chat-video-control"
              }
              onClick={
                handleToggleVideoMute
              }
              title={
                videoCallMuted
                  ? "Unmute microphone"
                  : "Mute microphone"
              }
            >

              {videoCallMuted
                ? <FaMicrophoneSlash />
                : <FaMicrophone />}

            </button>


            <button
              type="button"
              className={
                videoCameraOff
                  ? "student-chat-video-control active"
                  : "student-chat-video-control"
              }
              onClick={
                handleToggleVideoCamera
              }
              title={
                videoCameraOff
                  ? "Turn camera on"
                  : "Turn camera off"
              }
            >

              {videoCameraOff
                ? <FaVideoSlash />
                : <FaVideo />}

            </button>


            <button
              type="button"
              className="student-chat-video-end"
              onClick={
                handleEndVideoCall
              }
              title="End video call"
            >

              <FaPhoneSlash />

            </button>

          </div>

        </div>

      )}


      {/* ======================================
          AUDIO ELEMENT
      ====================================== */}

      <audio
        ref={
          remoteAudioRef
        }
        autoPlay
        playsInline
      />


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="student-chat-header">

        <button
          type="button"
          className="student-chat-back-button"
          onClick={() =>
            navigate(
              "/student/communication"
            )
          }
        >

          <FaArrowLeft />

        </button>


        <div className="student-chat-user-avatar">

          <FaComments />

        </div>


        <div className="student-chat-user-info">

          <h2>
            {courseTitle}
          </h2>

          <span>
            Course Forum
          </span>

        </div>


        <div
          className={
            socketConnected
              ? "student-chat-online-status connected"
              : "student-chat-online-status"
          }
        >

          <span />

          {socketConnected
            ? "Online"
            : "Connecting..."}

        </div>


        {/* ====================================
            CALL BUTTONS
        ==================================== */}

        <div className="student-chat-header-actions">

          <button
            type="button"
            className="student-chat-call-button"
            title="Audio calls are started by the instructor"
            disabled
          >

            <FaPhone />

          </button>


          <button
            type="button"
            className="student-chat-video-button"
            title="Video calls are started by the instructor"
            disabled
          >

            <FaVideo />

          </button>


          <button
            type="button"
            className="student-chat-more-button"
            title="More"
          >

            <FaEllipsisV />

          </button>

        </div>

      </header>


      {/* ======================================
          COURSE / INSTRUCTOR BAR
      ====================================== */}

      <div className="student-chat-course-bar">

        <FaChalkboardTeacher />

        <span>

          Instructor:{" "}

          {instructor?.name ||
            instructor?.email ||
            "Course Instructor"}

        </span>

      </div>


      {/* ======================================
          INLINE ERROR
      ====================================== */}

      {error && (

        <div className="student-chat-inline-error">

          {error}

        </div>

      )}


      {/* ======================================
          MESSAGES
      ====================================== */}

      <main className="student-chat-messages">

        {messages.length === 0 ? (

          <div className="student-chat-empty">

            <FaComments />

            <h3>
              Welcome to the Course Forum
            </h3>

            <p>
              Start a discussion with your
              instructor and fellow enrolled
              students.
            </p>

          </div>

        ) : (

          messages.map(
            currentMessage => {

              const senderId =
                currentMessage.sender?._id ||
                currentMessage.sender;


              const isMine =
                senderId?.toString() ===
                user?._id?.toString();


              return (

                <div
                  key={
                    currentMessage._id
                  }
                  className={
                    isMine
                      ? "student-chat-message-row mine"
                      : "student-chat-message-row"
                  }
                >

                  {!isMine && (

                    <div className="student-chat-message-sender">

                      <FaUserGraduate />

                      <span>
                        {
                          currentMessage.sender?.name ||
                          "Forum Member"
                        }
                      </span>

                    </div>

                  )}


                  <div
                    className={
                      isMine
                        ? "student-chat-message-bubble mine"
                        : "student-chat-message-bubble"
                    }
                  >

                    {currentMessage.type ===
                    "text" ? (

                      <p>
                        {
                          currentMessage.content
                        }
                      </p>

                    ) : currentMessage.type ===
                      "audio" ? (

                      renderVoiceMessage(
                        currentMessage
                      )

                    ) : (

                      <p>
                        {
                          currentMessage.type ||
                          "Message"
                        }
                      </p>

                    )}


                    <span className="student-chat-message-time">

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
          VOICE PREVIEW
      ====================================== */}

      {(
        isRecording ||
        audioBlob
      ) && (

        <div className="student-chat-voice-preview">

          {isRecording ? (

            <>

              <div className="student-chat-recording-indicator">

                <span className="student-chat-recording-dot" />

                <FaMicrophone />

                <strong>
                  Recording
                </strong>

                <span>
                  {formatDuration(
                    recordingSeconds
                  )}
                </span>

              </div>


              <button
                type="button"
                className="student-chat-stop-recording"
                onClick={
                  handleStopRecording
                }
              >

                <FaStop />

                <span>
                  Stop
                </span>

              </button>

            </>

          ) : (

            <>

              <div className="student-chat-preview-audio">

                <button
                  type="button"
                  className="student-chat-preview-play"
                  onClick={
                    handlePreviewPlayback
                  }
                  title={
                    voicePlaying
                      ? "Pause preview"
                      : "Play preview"
                  }
                >

                  {voicePlaying
                    ? <FaPause />
                    : <FaPlay />}

                </button>


                <div className="student-chat-preview-info">

                  <strong>
                    Voice message
                  </strong>

                  <span>
                    {formatDuration(
                      recordingSeconds
                    )}
                  </span>

                </div>


                <audio
                  ref={
                    audioPreviewRef
                  }
                  src={
                    audioPreviewUrl
                  }
                  preload="metadata"
                  onPlay={() =>
                    setVoicePlaying(
                      true
                    )
                  }
                  onPause={() =>
                    setVoicePlaying(
                      false
                    )
                  }
                  onEnded={() =>
                    setVoicePlaying(
                      false
                    )
                  }
                  style={{
                    display:
                      "none"
                  }}
                />

              </div>


              <div className="student-chat-preview-actions">

                <button
                  type="button"
                  className="student-chat-delete-voice"
                  onClick={
                    handleCancelRecording
                  }
                  disabled={
                    voiceSending
                  }
                  title="Delete recording"
                >

                  <FaTrash />

                </button>


                <button
                  type="button"
                  className="student-chat-send-voice"
                  onClick={
                    handleSendVoiceMessage
                  }
                  disabled={
                    voiceSending
                  }
                >

                  {voiceSending
                    ? "Sending..."
                    : "Send voice"}

                </button>

              </div>

            </>

          )}

        </div>

      )}


      {/* ======================================
          MESSAGE INPUT
      ====================================== */}

      <form
        className="student-chat-input-area"
        onSubmit={
          handleSendMessage
        }
      >

        <button
          type="button"
          className={
            isRecording
              ? "student-chat-input-action recording"
              : "student-chat-input-action"
          }
          title={
            isRecording
              ? "Stop recording"
              : "Voice message"
          }
          onClick={
            isRecording
              ? handleStopRecording
              : handleStartRecording
          }
          disabled={
            voiceSending ||
            !conversationId ||
            audioCallActive ||
            videoCallActive
          }
        >

          {isRecording
            ? <FaStop />
            : <FaMicrophone />}

        </button>


        <input
          type="text"
          placeholder="Write something to the forum..."
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
            !socketConnected ||
            isRecording ||
            voiceSending ||
            audioCallActive ||
            videoCallActive
          }
        />


        <button
          type="submit"
          className="student-chat-send-button"
          disabled={
            !message.trim() ||
            sending ||
            !socketConnected ||
            isRecording ||
            voiceSending ||
            audioCallActive ||
            videoCallActive
          }
        >

          <FaPaperPlane />

        </button>

      </form>

    </div>

  );

};


export default StudentChat;