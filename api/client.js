import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// Better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response -> network / CORS / server down
    if (!error.response) {
      error.message = "Network error: cannot reach the server";
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 404) error.message = "Not found (404)";
    else if (status >= 500) error.message = "Server error (5xx)";
    else if (status === 400) error.message = "Bad request (400)";
    else if (status === 401) error.message = "Unauthorized (401)";
    else error.message = `Request failed (${status})`;

    return Promise.reject(error);
  }
);

export default api;
