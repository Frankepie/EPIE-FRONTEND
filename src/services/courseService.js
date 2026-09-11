const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";


// ==========================================
// GET MY ENROLLED COURSES
// ==========================================

export const getMyCourses = async (token) => {

  const response =
    await fetch(
      `${API_URL}/api/enrollments/my-courses`,
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
      "Failed to load your courses"
    );

  }


  return data;

};