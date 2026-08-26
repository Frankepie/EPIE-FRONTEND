// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


// ==========================================
// AUTHENTICATION
// ==========================================

// REGISTER
export const registerUser = async (userData) => {

  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(userData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Registration failed"
    );
  }

  return data;
};


// ==========================================
// VERIFY REGISTRATION OTP
// ==========================================

export const verifyRegistrationOTP = async (data) => {

  const response = await fetch(
    `${API_URL}/api/auth/verify-registration-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to verify OTP"
    );
  }

  return result;
};


// ==========================================
// RESEND REGISTRATION OTP
// ==========================================

export const resendRegistrationOTP = async (data) => {

  const response = await fetch(
    `${API_URL}/api/auth/resend-registration-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to resend OTP"
    );
  }

  return result;
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (data) => {

  const response = await fetch(
    `${API_URL}/api/auth/forgot-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to send reset code"
    );
  }

  return result;
};


// ==========================================
// VERIFY PASSWORD RESET OTP
// ==========================================

export const verifyPasswordResetOTP = async (data) => {

  const response = await fetch(
    `${API_URL}/api/auth/verify-reset-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to verify reset code"
    );
  }

  return result;
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (data) => {

  const response = await fetch(
    `${API_URL}/api/auth/reset-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to reset password"
    );
  }

  return result;
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (credentials) => {

  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(credentials)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Login failed"
    );
  }

  return data;
};


// ==========================================
// COURSES
// ==========================================

// GET ALL COURSES

export const getCourses = async () => {

  const response = await fetch(
    `${API_URL}/api/courses`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load courses"
    );
  }

  return data;
};


// GET SINGLE COURSE

export const getCourseById = async (id) => {

  const response = await fetch(
    `${API_URL}/api/courses/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load course"
    );
  }

  return data;
};


// ==========================================
// ENROLLMENTS
// ==========================================

// ENROLL IN COURSE

export const enrollInCourse = async (
  courseId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/enrollments`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify({
        courseId
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Enrollment failed"
    );
  }

  return data;
};


// GET MY COURSES

export const getMyCourses = async (token) => {

  const response = await fetch(
    `${API_URL}/api/enrollments/my-courses`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load your courses"
    );
  }

  return data;
};


// GET INSTRUCTOR STUDENTS

export const getInstructorStudents = async (token) => {

  const response = await fetch(
    `${API_URL}/api/enrollments/instructor/students`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load students"
    );
  }

  return data;
};


// ==========================================
// INSTRUCTOR COURSES
// ==========================================

export const getInstructorCourses = async (token) => {

  const response = await fetch(
    `${API_URL}/api/courses/instructor/my-courses`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load instructor courses"
    );
  }

  return data;
};


// UPDATE COURSE

export const updateCourse = async (
  courseId,
  courseData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/courses/${courseId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(courseData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update course"
    );
  }

  return data;
};


// DELETE COURSE

export const deleteCourse = async (
  courseId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/courses/${courseId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to delete course"
    );
  }

  return data;
};


// ==========================================
// MODULES
// ==========================================

// GET COURSE MODULES

export const getCourseModules = async (
  courseId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/modules/course/${courseId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load modules"
    );
  }

  return data;
};


// CREATE MODULE

export const createModule = async (
  moduleData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/modules`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(moduleData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create module"
    );
  }

  return data;
};


// UPDATE MODULE

export const updateModule = async (
  moduleId,
  moduleData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/modules/${moduleId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(moduleData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update module"
    );
  }

  return data;
};


// DELETE MODULE

export const deleteModule = async (
  moduleId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/modules/${moduleId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to delete module"
    );
  }

  return data;
};


// ==========================================
// LESSONS
// ==========================================

// GET MODULE LESSONS

export const getModuleLessons = async (
  moduleId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/lessons/module/${moduleId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load lessons"
    );
  }

  return data;
};


// CREATE LESSON

export const createLesson =
  async (
    lessonData,
    token
  ) => {

    const response =
      await fetch(
        `${API_URL}/api/lessons`,
        {

          method: "POST",

          headers: {

            Authorization:
              `Bearer ${token}`

          },

          body:
            lessonData

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to create lesson"
      );

    }


    return data;

  };


// UPDATE LESSON

export const updateLesson = async (
  lessonId,
  lessonData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/lessons/${lessonId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(lessonData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update lesson"
    );
  }

  return data;
};


// DELETE LESSON

export const deleteLesson = async (
  lessonId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/lessons/${lessonId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to delete lesson"
    );
  }

  return data;
};


// ==========================================
// LESSON PROGRESS
// ==========================================

// MARK LESSON COMPLETE

export const markLessonComplete = async (
  lessonId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/lesson-progress/${lessonId}/complete`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to mark lesson complete"
    );
  }

  return data;
};


// GET MY LESSON PROGRESS

export const getMyLessonProgress = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/lesson-progress/my-progress`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to get progress"
    );
  }

  return data;
};


// ==========================================
// COURSE PROGRESS
// ==========================================

// GET MY PROGRESS

export const getMyProgress = async (token) => {

  const response = await fetch(
    `${API_URL}/api/progress/my-progress`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load progress"
    );
  }

  return data;
};


// GET COURSE PROGRESS

export const getCourseProgress = async (
  courseId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/course-progress/${courseId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load course progress"
    );
  }

  return data;
};


// ==========================================
// CERTIFICATES
// ==========================================

// GET MY CERTIFICATES

export const getMyCertificates = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/certificates/my-certificates`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load certificates"
    );
  }

  return data;
};


// GET ONE CERTIFICATE

export const getCertificate = async (
  certificateId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/certificates/${certificateId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load certificate"
    );
  }

  return data;
};


// CREATE CERTIFICATE

export const createCertificate = async (
  courseId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/certificates/course/${courseId}`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create certificate"
    );
  }

  return data;
};


// VERIFY CERTIFICATE

export const verifyCertificate = async (
  certificateId
) => {

  const response = await fetch(
    `${API_URL}/api/certificates/verify/${certificateId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Certificate not found"
    );
  }

  return data;
};


// ==========================================
// ASSIGNMENTS
// ==========================================

// CREATE ASSIGNMENT

export const createAssignment = async (
  assignmentData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(assignmentData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create assignment"
    );
  }

  return data;
};


// GET MODULE ASSIGNMENTS

export const getModuleAssignments = async (
  moduleId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments/module/${moduleId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load assignments"
    );
  }

  return data;
};


// GET INSTRUCTOR ASSIGNMENTS

export const getInstructorAssignments = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments/instructor/my-assignments`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load instructor assignments"
    );
  }

  return data;
};


// GET ONE ASSIGNMENT

export const getAssignmentById = async (
  assignmentId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments/${assignmentId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load assignment"
    );
  }

  return data;
};


// UPDATE ASSIGNMENT

export const updateAssignment = async (
  assignmentId,
  assignmentData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments/${assignmentId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(assignmentData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update assignment"
    );
  }

  return data;
};


// DELETE ASSIGNMENT

export const deleteAssignment = async (
  assignmentId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments/${assignmentId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to delete assignment"
    );
  }

  return data;
};


// GET MY ASSIGNMENTS

export const getMyAssignments = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignments/my-assignments`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load assignments"
    );
  }

  return data;
};


// SUBMIT ASSIGNMENT

export const submitAssignment = async (
  assignmentId,
  answer,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignment-submissions/${assignmentId}/submit`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify({
        answer
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to submit assignment"
    );
  }

  return data;
};


// GET MY SUBMISSION

export const getMySubmission = async (
  assignmentId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignment-submissions/${assignmentId}/my-submission`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load submission"
    );
  }

  return data;
};


// ==========================================
// ASSIGNMENT SUBMISSIONS - INSTRUCTOR
// ==========================================

// GET SUBMISSIONS

export const getAssignmentSubmissions = async (
  assignmentId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignment-submissions/${assignmentId}/submissions`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load assignment submissions"
    );
  }

  return data;
};


// GRADE SUBMISSION

export const gradeAssignmentSubmission = async (
  submissionId,
  marks,
  feedback,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/assignment-submissions/${submissionId}/grade`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify({
        marks,
        feedback
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to grade submission"
    );
  }

  return data;
};


// ==========================================
// BOOKMARKS
// ==========================================

// ADD BOOKMARK

export const addBookmark = async (
  lessonId,
  courseId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/bookmarks/${lessonId}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify({
        course: courseId
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to bookmark lesson"
    );
  }

  return data;
};


// REMOVE BOOKMARK

export const removeBookmark = async (
  lessonId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/bookmarks/${lessonId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to remove bookmark"
    );
  }

  return data;
};


// CHECK BOOKMARK

export const checkBookmark = async (
  lessonId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/bookmarks/check/${lessonId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to check bookmark"
    );
  }

  return data;
};


// GET MY BOOKMARKS

export const getMyBookmarks = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/bookmarks/my-bookmarks`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load bookmarks"
    );
  }

  return data;
};


// ==========================================
// DISCUSSIONS
// ==========================================

// CREATE DISCUSSION

export const createDiscussion = async (
  discussionData,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/discussions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(discussionData)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create discussion"
    );
  }

  return data;
};


// GET ALL DISCUSSIONS

export const getDiscussions = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/discussions`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load discussions"
    );
  }

  return data;
};


// GET ONE DISCUSSION

export const getDiscussionById = async (
  discussionId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/discussions/${discussionId}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load discussion"
    );
  }

  return data;
};


// DELETE DISCUSSION

export const deleteDiscussion = async (
  discussionId,
  token
) => {

  const response = await fetch(
    `${API_URL}/api/discussions/${discussionId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to delete discussion"
    );
  }

  return data;
};

// ==========================================
// COMMUNICATION
// ==========================================

// GET COURSE COMMUNICATION
export const getCourseCommunication = async (
  courseId,
  token
) => {

  const response = await fetch(
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
      "Failed to load course communication"
    );

  }

  return data;
};


// ==========================================
// GET ENROLLED STUDENTS
// ==========================================

export const getCourseStudents = async (
  courseId,
  token
) => {

  const response = await fetch(
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
// CREATE CONVERSATION
// ==========================================

export const createConversation = async (
  courseId,
  participantId,
  token
) => {

  const response = await fetch(
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
        courseId,
        participantId
      })
    }
  );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Failed to create conversation"
    );

  }

  return data;
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export const getAdminDashboard = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/api/admin/dashboard`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json"
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load admin dashboard"
    );
  }

  return data;
};


// ==========================================
// ADMIN NOTIFICATIONS
// ==========================================

export const getAdminNotifications = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/notifications`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load notifications"
    );
  }

  return data;
};


// MARK NOTIFICATION AS READ

export const markNotificationAsRead = async (
  token,
  notificationId
) => {

  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update notification"
    );
  }

  return data;
};


// MARK ALL NOTIFICATIONS AS READ

export const markAllNotificationsAsRead = async (
  token
) => {

  const response = await fetch(
    `${API_URL}/notifications/read-all`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update notifications"
    );
  }

  return data;
};
// =====================================
// GET USER SETTINGS
// =====================================

export const getSettings = async (token) => {

  const response = await fetch(
    `${API_URL}/api/settings`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Failed to load settings"
    );

  }


  return data;

};
// =====================================
// UPDATE USER SETTINGS
// =====================================

export const updateSettings = async (
  token,
  settings
) => {

  const response = await fetch(
    `${API_URL}/api/settings`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(settings)
    }
  );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Failed to update settings"
    );

  }


  return data;

};