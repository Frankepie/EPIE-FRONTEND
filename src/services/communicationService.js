const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


// ==========================================
// GET COURSE FORUM
// ==========================================

export const getCourseCommunication = async (
  courseId,
  token
) => {

  const response =
    await fetch(
      `${API_URL}/api/communication/course/${courseId}`,
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


  return data;

};


// ==========================================
// GET COURSE STUDENTS
// ==========================================

export const getCourseStudents = async (
  courseId,
  token
) => {

  const response =
    await fetch(
      `${API_URL}/api/communication/course/${courseId}/students`,
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
      "Failed to load course students"
    );

  }


  return data;

};


// ==========================================
// CREATE / GET COURSE FORUM
// ==========================================

export const createConversation = async (
  courseId,
  token
) => {

  const response =
    await fetch(
      `${API_URL}/api/communication/conversation`,
      {
        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`

        },

        body: JSON.stringify({

          courseId

        })

      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Failed to open course forum"
    );

  }


  return data;

};


// ==========================================
// GET FORUM MESSAGES
// ==========================================

export const getConversationMessages = async (
  conversationId,
  token
) => {

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
      "Failed to load forum messages"
    );

  }


  return data;

};


// ==========================================
// SEND TEXT MESSAGE
// ==========================================

export const sendMessage = async (
  conversationId,
  content,
  token
) => {

  const response =
    await fetch(
      `${API_URL}/api/communication/message`,
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

          content,

          type: "text"

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


  return data;

};