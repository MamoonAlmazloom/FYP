/* eslint-disable */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { login as authLogin, initializeAuth } from "./API/authAPI";
import { handleUserRouting } from "./utils/authUtils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login: contextLogin, logout } = useAuth();

  // Check for disabled account message on component mount
  useEffect(() => {
    const accountDisabled = localStorage.getItem("accountDisabled");
    if (accountDisabled === "true") {
      setErrors({
        submit:
          "Your account has been disabled by an administrator. Please contact support for assistance.",
      });
      localStorage.removeItem("accountDisabled"); // Clear the flag after showing
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      // Relaxed for demo
      newErrors.password = "Password must be at least 3 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Clear any existing auth data first
      logout();

      console.log("Attempting login for:", email);

      // Call the actual login API
      const response = await authLogin(email, password);

      console.log("Login API response:", response);

      if (response.success) {
        console.log("Login successful:", response);

        // Initialize auth headers
        initializeAuth();

        // Update the AuthContext with new user data
        contextLogin(response.user, response.token);

        console.log("User data set in context:", response.user);

        // Small delay to ensure context is updated
        setTimeout(async () => {
          // Route user based on their role and project status
          await handleUserRouting(navigate, response.user);
        }, 100);
      } else {
        setErrors({
          submit: response.error || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.error || "Invalid credentials";
        setErrors({ submit: errorMessage });
      } else if (error.request) {
        // Network error
        setErrors({ submit: "Unable to connect to server. Please try again." });
      } else {
        // Other error
        setErrors({
          submit: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Demo credentials for different roles
  const demoCredentials = [
    { role: "Manager", email: "admin@gmail.com", password: "admin" },
    { role: "Student", email: "mamoon@example.com", password: "password123" },
    {
      role: "Supervisor",
      email: "sarah.johnson@example.com",
      password: "password123",
    },
    {
      role: "Supervisor 2",
      email: "supervisor@example.com",
      password: "password123",
    },
    { role: "Moderator", email: "emily.carter@example.com", password: "password123" },
    { role: "Examiner", email: "robert.brown@example.com", password: "password123" },
  ];

  const fillDemoCredentials = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
               University of XYZ
            </h1>
            <p className="text-sm text-slate-500">
              Final Year Project <br /> Management System
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Main Login Card */}
        <div className="border-0 bg-white/80 backdrop-blur-md shadow-2xl rounded-lg">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-slate-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-slate-700 font-medium text-sm"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white/50 border rounded-lg px-4 pr-12 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500"
                    }`}
                    required
                  />
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-slate-700 font-medium text-sm"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-white/50 border rounded-lg px-4 pr-12 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-blue-500"
                    }`}
                    required
                  />
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Demo Credentials Card */}
        <div className="border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg rounded-lg">
          <div className="p-6">
            <h3 className="font-semibold text-amber-800 mb-4">
              Demo Credentials:
            </h3>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200"
                >
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">{cred.role}</p>
                    <p className="text-amber-700">{cred.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials(cred)}
                    className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-4">
              Click "Use" to automatically fill credentials for testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
