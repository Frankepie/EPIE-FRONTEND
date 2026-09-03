import { io } from "socket.io-client";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

let socket = null;


// ==========================================
// CONNECT SOCKET
// ==========================================

export const connectSocket = (token) => {

  if (!token) {
    return null;
  }


  // Prevent duplicate connections

  if (
    socket &&
    socket.connected
  ) {
    return socket;
  }


  socket =
    io(
      API_URL,
      {
        auth: {
          token
        },

        transports: [
          "websocket"
        ],

        autoConnect: true
      }
    );


  socket.on(
    "connect",
    () => {

      console.log(
        "EduLearn Socket connected:",
        socket.id
      );

    }
  );


  socket.on(
    "connect_error",
    (error) => {

      console.error(
        "EduLearn Socket connection error:",
        error.message
      );

    }
  );


  socket.on(
    "disconnect",
    (reason) => {

      console.log(
        "EduLearn Socket disconnected:",
        reason
      );

    }
  );


  return socket;
};


// ==========================================
// GET SOCKET
// ==========================================

export const getSocket = () => {

  return socket;

};


// ==========================================
// DISCONNECT SOCKET
// ==========================================

export const disconnectSocket = () => {

  if (socket) {

    socket.disconnect();

    socket = null;

  }

};


// ==========================================
// JOIN CONVERSATION
// ==========================================

export const joinConversation = (
  conversationId
) => {

  if (
    socket &&
    socket.connected &&
    conversationId
  ) {

    socket.emit(
      "join_conversation",
      conversationId
    );

  }

};


// ==========================================
// LEAVE CONVERSATION
// ==========================================

export const leaveConversation = (
  conversationId
) => {

  if (
    socket &&
    socket.connected &&
    conversationId
  ) {

    socket.emit(
      "leave_conversation",
      conversationId
    );

  }

};

