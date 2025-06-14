import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAvailableProjects, selectProject } from "../../API/StudentAPI";

const SelectTitle = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectingProject, setSelectingProject] = useState(null);

  useEffect(() => {
    const fetchAvailableProjects = async () => {
      try {
        if (!user?.id) {
          setError('User not found. Please log in again.');
          return;
        }

        setLoading(true);
        const response = await getAvailableProjects(user.id);
        
        if (response.success) {
          console.log('Available projects:', response.projects);
          setProjects(response.projects || []);
        } else {
          setError(response.error || 'Failed to load available projects');
        }
      } catch (err) {
        console.error('Error fetching available projects:', err);
        setError('Failed to load available projects');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableProjects();
  }, [user]);

  const handleSelectProject = async (projectId) => {
    try {
      setSelectingProject(projectId);
      
      const response = await selectProject(user.id, projectId);
      
      if (response.success) {
        alert('Project selected successfully! You can now start working on your project.');
        // Navigate to project work or refresh the page
        window.location.href = '/student/project-work';
      } else {
        alert('Failed to select project: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error selecting project:', error);
      alert('Failed to select project. Please try again.');
    } finally {
      setSelectingProject(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/student/choose-path"
            className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline"
          >
            Back to Select Path
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Select a Project Title
        </h2>

        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-6">No available projects at the moment.</p>
            <Link
              to="/student/propose-project"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline"
            >
              Propose Your Own Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        <strong>Supervisor:</strong> {project.supervisor_name || 'N/A'}
                      </span>
                      <span>
                        <strong>Type:</strong> {project.type || 'N/A'}
                      </span>
                      <span>
                        <strong>Specialization:</strong> {project.specialization || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectProject(project.project_id)}
                    disabled={selectingProject === project.project_id}
                    className={`ml-4 px-6 py-2 rounded-lg font-semibold transition-colors ${
                      selectingProject === project.project_id
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {selectingProject === project.project_id ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Selecting...
                      </div>
                    ) : (
                      'Select Project'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
