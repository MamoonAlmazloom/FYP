
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProjectTitle = () => {
  const [searchParams] = useSearchParams();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    const title = searchParams.get("title") || "Unknown Project";
    setProjectTitle(title);

    // Generate description based on title
    const descriptions = {
      "Machine Learning for Healthcare Diagnostics":
        "Develop an AI system to assist healthcare professionals in diagnosing diseases using medical imaging and patient data. This project involves deep learning algorithms, medical data analysis, and user interface design.",
      "Blockchain-based Supply Chain Management":
        "Create a transparent and secure supply chain tracking system using blockchain technology. Track products from manufacturer to consumer with immutable records.",
      "IoT Smart Home Automation System":
        "Design and implement a comprehensive IoT solution for home automation including lighting, security, temperature control, and energy management.",
      "Mobile App for Mental Health Support":
        "Develop a mobile application that provides mental health resources, mood tracking, and connects users with professional support services.",
      "AI-Powered Educational Platform":
        "Build an adaptive learning platform that uses AI to personalize educational content based on student performance and learning patterns.",
      "Cybersecurity Framework for SMEs":
        "Design a comprehensive cybersecurity framework specifically tailored for small and medium enterprises with limited IT resources.",
    };

    setProjectDescription(
      descriptions[title] ||
        `This is a comprehensive project focusing on ${title}. The project will involve research, design, implementation, and testing phases.`
    );
  }, [searchParams]);

  const handleApply = () => {
    // This would typically send an application to the backend
    alert(`Application submitted for: ${projectTitle}`);
    // In a real app, you might navigate to a confirmation page or back to status
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {projectTitle}
        </h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Project Description:
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {projectDescription}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Project Details:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <span className="font-semibold text-blue-800">Duration:</span>
              <p className="text-blue-700">2 Semesters</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <span className="font-semibold text-green-800">Type:</span>
              <p className="text-green-700">Individual Project</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <span className="font-semibold text-purple-800">
                Prerequisites:
              </span>
              <p className="text-purple-700">Data Structures, Programming</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <span className="font-semibold text-orange-800">Difficulty:</span>
              <p className="text-orange-700">Intermediate</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleApply}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold"
          >
            Apply for this Project
          </button>

          <Link
            to="/student/select-title"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-semibold text-center no-underline"
          >
            Back to Select Title
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectTitle;

