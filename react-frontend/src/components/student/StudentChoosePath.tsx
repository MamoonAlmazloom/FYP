import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Types
interface Project {
  project_id: number;
  title: string;
  description: string;
  supervisor_name?: string;
}

interface Proposal {
  proposal_id: number;
  title: string;
  description: string;
  status_name: string;
  project_id?: number;
}

interface Supervisor {
  user_id: number;
  name: string;
  email: string;
}

// Main Student Path Selection Component
const StudentChoosePath: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId");

  // Move fetchProposals inside useEffect to avoid missing dependency warning
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/students/${studentId}/proposals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProposals(data.proposals || []);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [studentId]);

  const pathOptions = [
    {
      title: "Select from Available Titles",
      description: "Browse and select from pre-approved project titles",
      icon: "📋",
      color: "from-blue-500 to-cyan-500",
      component: "SelectTitle",
    },
    {
      title: "Propose a New Project",
      description: "Submit your own project idea for approval",
      icon: "💡",
      color: "from-purple-500 to-pink-500",
      component: "ProposeProject",
    },
    {
      title: "View Project Status",
      description: "Check the status of your submitted proposals",
      icon: "📊",
      color: "from-green-500 to-emerald-500",
      component: "ProjectStatus",
    },
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select how you would like to proceed with your Final Year Project
          </p>
        </motion.div>

        {/* Path Options */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {pathOptions.map((option, index) => (
            <PathCard key={index} option={option} />
          ))}
        </motion.div>

        {/* Recent Proposals Status */}
        {!loading && proposals.length > 0 && (
          <motion.div
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Your Recent Proposals
            </h3>
            <div className="space-y-3">
              {proposals.slice(0, 3).map((proposal) => (
                <div
                  key={proposal.proposal_id}
                  className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-600/20"
                >
                  <div>
                    <h4 className="text-white font-medium">{proposal.title}</h4>
                    <p className="text-gray-300 text-sm">
                      {proposal.description.slice(0, 100)}...
                    </p>
                  </div>
                  <StatusBadge status={proposal.status_name} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Path Card Component
// Path Card Component
interface PathOption {
  title: string;
  description: string;
  icon: string;
  color: string;
  component: string;
}
const PathCard: React.FC<{ option: PathOption }> = ({ option }) => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(null);

  const handleClick = () => {
    setCurrentComponent(option.component);
  };

  if (currentComponent) {
    switch (currentComponent) {
      case "SelectTitle":
        return <SelectTitle onBack={() => setCurrentComponent(null)} />;
      case "ProposeProject":
        return <ProposeProject onBack={() => setCurrentComponent(null)} />;
      case "ProjectStatus":
        return <ProjectStatus onBack={() => setCurrentComponent(null)} />;
      default:
        return null;
    }
  }

  return (
    <motion.div
      className="group cursor-pointer"
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        hover: { scale: 1.02 },
      }}
      whileHover="hover"
      onClick={handleClick}
    >
      <div className="relative bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300 h-full shadow-lg">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} mb-6`}
        >
          <span className="text-2xl">{option.icon}</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">
          {option.title}
        </h3>
        <p className="text-gray-300">{option.description}</p>

        <div className="absolute top-4 right-4">
          <svg
            className="w-6 h-6 text-gray-400 group-hover:text-gray-200 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

// Select Title Component
const SelectTitle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchAvailableProjects();
  }, []);

  const fetchAvailableProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const studentId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/students/${studentId}/available-projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (project: Project) => {
    try {
      const token = localStorage.getItem("authToken");
      const studentId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/students/${studentId}/select-project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ project_id: project.project_id }),
        }
      );

      if (response.ok) {
        alert("Project selected successfully!");
        onBack();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error selecting project:", error);
      alert("Failed to select project");
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onSelect={handleSelectProject}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white">
            Select a Project Title
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <motion.div
                key={project.project_id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 cursor-pointer transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedProject(project)}
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-3">{project.description}</p>
                {project.supervisor_name && (
                  <p className="text-blue-400 text-sm">
                    Supervisor: {project.supervisor_name}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Project Details Component
const ProjectDetails: React.FC<{
  project: Project;
  onBack: () => void;
  onSelect: (project: Project) => void;
}> = ({ project, onBack, onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6 flex items-center justify-center">
      <motion.div
        className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/40 max-w-2xl w-full shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">{project.title}</h2>

        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Description:
            </h3>
            <p className="text-gray-300">{project.description}</p>
          </div>

          {project.supervisor_name && (
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Supervisor:
              </h3>
              <p className="text-gray-300">{project.supervisor_name}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => onSelect(project)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Apply for this Project
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-600/40 text-gray-300 rounded-lg hover:bg-gray-700/30 transition-colors"
          >
            Back to List
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Propose Project Component
const ProposeProject: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    specialization: "",
    outcome: "",
    submitted_to: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/supervisors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSupervisors(data.supervisors || []);
      }
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const studentId = localStorage.getItem("userId");
      const response = await fetch(`/api/students/${studentId}/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Proposal submitted successfully!");
        onBack();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white">
            Propose a New Project
          </h2>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Project Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/40 border border-gray-600/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Project Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/40 border border-gray-600/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your project idea"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Project Type
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800/40 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Research">Research</option>
                  <option value="Application">Application</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="e.g., Machine Learning, Web Development"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Expected Outcome
              </label>
              <textarea
                required
                rows={3}
                value={formData.outcome}
                onChange={(e) =>
                  setFormData({ ...formData, outcome: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="What do you expect to achieve with this project?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Preferred Supervisor
              </label>
              <select
                required
                value={formData.submitted_to}
                onChange={(e) =>
                  setFormData({ ...formData, submitted_to: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select Supervisor</option>
                {supervisors.map((supervisor) => (
                  <option key={supervisor.user_id} value={supervisor.user_id}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
            >
              {submitting ? "Submitting..." : "Submit Proposal"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

// Project Status Component
const ProjectStatus: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const studentId = localStorage.getItem("userId");
      const response = await fetch(`/api/students/${studentId}/proposals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals || []);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white">Project Status</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Proposals Yet
            </h3>
            <p className="text-gray-400">
              You haven't submitted any proposals yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <motion.div
                key={proposal.proposal_id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-600/30 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {proposal.title}
                  </h3>
                  <StatusBadge status={proposal.status_name} />
                </div>
                <p className="text-gray-300 mb-4">{proposal.description}</p>
                <div className="text-sm text-gray-400">
                  Proposal ID: {proposal.proposal_id}
                  {proposal.project_id && (
                    <span className="ml-4">
                      Project ID: {proposal.project_id}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "supervisor_approved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "modifications_required":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
        status
      )}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StudentChoosePath;
