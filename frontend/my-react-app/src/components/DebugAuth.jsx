import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DebugAuth = () => {
  const { user, authenticated, loading, token } = useAuth();

  // Get data from localStorage for comparison
  const localStorageUser = JSON.parse(localStorage.getItem("user") || "{}");
  const localStorageToken = localStorage.getItem("token");

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🐛 Auth Debug Info</h3>

      <div className="mb-2">
        <strong>Auth Context:</strong>
        <div>• Authenticated: {authenticated ? "✅" : "❌"}</div>
        <div>• Loading: {loading ? "⏳" : "✅"}</div>
        <div>• User ID: {user?.id || "None"}</div>
        <div>• User Name: {user?.name || "None"}</div>
        <div>• User Role: {user?.roles?.[0] || "None"}</div>
        <div>• Token exists: {token ? "✅" : "❌"}</div>
      </div>

      <div className="mb-2">
        <strong>localStorage:</strong>
        <div>• User ID: {localStorageUser?.id || "None"}</div>
        <div>• User Name: {localStorageUser?.name || "None"}</div>
        <div>• User Role: {localStorageUser?.roles?.[0] || "None"}</div>
        <div>• Token exists: {localStorageToken ? "✅" : "❌"}</div>
      </div>

      <div className="text-gray-300">
        <strong>Full User Object:</strong>
        <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-32">
          {JSON.stringify(
            { contextUser: user, localUser: localStorageUser },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default DebugAuth;
