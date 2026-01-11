import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor to handle disabled accounts
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is due to disabled account
    if (error.response?.status === 403 && error.response?.data?.disabled) {
      // Clear user data and redirect to login with disabled message
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Store the disabled message for display
      localStorage.setItem("accountDisabled", "true");

      // Redirect to login page
      window.location.href = "/login";

      return Promise.reject({
        ...error,
        isAccountDisabled: true,
        message: "Your account has been disabled by an administrator",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
