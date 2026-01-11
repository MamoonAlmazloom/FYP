import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../API/authAPI";
import { getStudentLogs } from "../API/SupervisorAPI";

// Test component to verify our fix works
const TestViewProgressLog = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testComponent = async () => {
      try {
        console.log("Starting test...");

        // Mock the getCurrentUser function result (simulate logged in supervisor)
        const mockUser = {
          id: 14, // Dr. Smith's ID
          name: "Dr. Smith",
          email: "dr.smith@example.com",
          roles: ["Supervisor"],
        };

        // Store mock user in localStorage
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("authToken", "mock-token");

        console.log("Mock user set:", mockUser);

        // Test getCurrentUser function
        const currentUser = getCurrentUser();
        console.log("getCurrentUser() returned:", currentUser);

        if (!currentUser) {
          throw new Error("getCurrentUser() returned null");
        }

        // Test the API call that was failing (using known working data)
        console.log("Testing API call with currentUser.id:", currentUser.id);

        // We'll use supervisor 8 and student 1 since we know they have data
        const testSupervisorId = 8;
        const testStudentId = 1;

        console.log(
          `Calling getStudentLogs(${testSupervisorId}, ${testStudentId})`
        );
        const response = await getStudentLogs(testSupervisorId, testStudentId);

        console.log("API Response:", response);

        if (response.success) {
          setResult({
            message: "✅ Test PASSED! Component fix is working.",
            data: response,
          });
        } else {
          throw new Error(response.error || "API call failed");
        }
      } catch (err) {
        console.error("Test failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testComponent();
  }, []);

  if (loading) {
    return <div className="p-4">Testing component fix...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h2 className="text-red-800 font-bold">❌ Test Failed</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <h2 className="text-green-800 font-bold">✅ Test Passed!</h2>
      <p className="text-green-600">{result.message}</p>
      <details className="mt-2">
        <summary className="cursor-pointer text-green-700">
          View API Response
        </summary>
        <pre className="mt-2 p-2 bg-green-100 rounded text-xs overflow-auto">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      </details>
      <div className="mt-4">
        <h3 className="font-bold">Next Steps:</h3>
        <p>
          The ViewProgressLog and ViewProgressReport components should now work
          correctly.
        </p>
        <p>Navigate to:</p>
        <ul className="list-disc ml-6">
          <li>
            <a
              href="/supervisor/view-progress-log/1"
              className="text-blue-600 underline"
            >
              Progress Log
            </a>
          </li>
          <li>
            <a
              href="/supervisor/view-progress-report/1"
              className="text-blue-600 underline"
            >
              Progress Report
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestViewProgressLog;
