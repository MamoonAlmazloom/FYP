import { Link } from "react-router-dom";

const StudentChoosePath = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Select Your Path
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Choose how you would like to proceed with your FYP selection.
        </p>

        <div className="space-y-4">
          <Link
            to="/student/select-title"
            className="block w-full py-4 px-6 text-center text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 no-underline"
          >
            Select from Available Titles
          </Link>

          <Link
            to="/student/propose-project"
            className="block w-full py-4 px-6 text-center text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 no-underline"
          >
            Propose a New Project
          </Link>

          <Link
            to="/student/project-status"
            className="block w-full py-4 px-6 text-center text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 no-underline"
          >
            View Project Status
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentChoosePath;
