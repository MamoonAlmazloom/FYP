import { Link } from "react-router-dom";

const SelectTitle = () => {
  const projectTitles = [
    "Machine Learning for Healthcare Diagnostics",
    "Blockchain-based Supply Chain Management",
    "IoT Smart Home Automation System",
    "Mobile App for Mental Health Support",
    "AI-Powered Educational Platform",
    "Cybersecurity Framework for SMEs",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Select a Project Title
        </h2>

        <div className="space-y-3 mb-6">
          {projectTitles.map((title, index) => (
            <Link
              key={index}
              to={`/student/project-title?title=${encodeURIComponent(title)}`}
              className="block w-full p-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 no-underline text-center"
            >
              {title}
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/student/choose-path"
            className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline"
          >
            Back to Select Path
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SelectTitle;
