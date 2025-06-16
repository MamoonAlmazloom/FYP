import React from "react";
import { Link } from "react-router-dom";

const ManagerDebug = () => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData.id;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          Manager Authentication Debug
        </h1>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Authentication Token:</h3>
            <p className="break-all bg-gray-100 p-2 rounded">
              {token ? token.substring(0, 50) + "..." : "No token found"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">User ID:</h3>
            <p className="bg-gray-100 p-2 rounded">
              {userId || "No user ID found"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">User Profile:</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Test Login:</h3>
            <p>Use these credentials to test:</p>
            <ul className="list-disc list-inside">
              <li>Email: admin@gmail.com</li>
              <li>Password: admin</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </Link>
          <Link
            to="/manager/dashboard"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Manager Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDebug;
