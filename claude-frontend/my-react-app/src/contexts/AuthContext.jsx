/* eslint-disable */
import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  getCurrentUser,
  getToken,
  isAuthenticated,
  initializeAuth,
  logout as authLogout,
} from "../API/authAPI";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = getCurrentUser();
        const storedToken = getToken();

        console.log("Initializing auth with stored user:", storedUser);

        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
          initializeAuth(); // Set up axios headers
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear potentially corrupted data
        authLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData, authToken) => {
    console.log("AuthContext login called with:", userData);
    setUser(userData);
    setToken(authToken);
  };

  // Logout function
  const logout = () => {
    console.log("AuthContext logout called");
    authLogout(); // Clear localStorage and axios headers
    setUser(null);
    setToken(null);
  };

  // Update user data
  const updateUser = (userData) => {
    console.log("AuthContext updateUser called with:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user || !user.roles) {
      console.log("hasRole: No user or roles found", user);
      return false;
    }
    const result = user.roles.includes(role);
    console.log(
      `hasRole: Checking if user has role '${role}':`,
      result,
      "User roles:",
      user.roles
    );
    return result;
  };

  // Get user's primary role
  const getPrimaryRole = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      console.log("getPrimaryRole: No user or roles found", user);
      return null;
    }
    const primaryRole = user.roles[0];
    console.log(
      "getPrimaryRole: Primary role is:",
      primaryRole,
      "All roles:",
      user.roles
    );
    return primaryRole;
  };

  // Check if user is authenticated
  const authenticated = isAuthenticated();

  // Debug logging
  useEffect(() => {
    console.log("AuthContext state updated:", {
      user,
      token: token ? "exists" : "null",
      authenticated,
      userRoles: user?.roles,
    });
  }, [user, token, authenticated]);

  // Context value object
  const value = {
    user,
    token,
    loading,
    authenticated,
    login,
    logout,
    updateUser,
    hasRole,
    getPrimaryRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOC for protecting routes
export const withAuth = (Component, allowedRoles = []) => {
  return (props) => {
    const { user, authenticated, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!authenticated || !user) {
      console.log("withAuth: User not authenticated, redirecting to login");
      return <Navigate to="/login" replace />;
    }

    // Check role permissions if specified
    if (allowedRoles.length > 0) {
      const userRole = user?.roles?.[0];
      console.log("withAuth: User Role:", userRole);
      console.log("withAuth: Allowed Roles:", allowedRoles);
      console.log("withAuth: User object:", user);

      if (!allowedRoles.includes(userRole)) {
        console.log("withAuth: Access denied for user role:", userRole);
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">
                Access Denied
              </h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Your role: {userRole || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                Required roles: {allowedRoles.join(", ")}
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Login
              </button>
            </div>
          </div>
        );
      }
    }

    console.log("withAuth: Access granted, rendering component");
    return <Component {...props} />;
  };
};
