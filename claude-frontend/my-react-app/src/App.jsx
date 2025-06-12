import { Routes, Route } from "react-router-dom";
import LoginPage from "./Login";

// Student Components - Choose A Path (in subfolder)
import StudentChoosePath from "./student/chooseAPath/StudentChoosePath";
import SelectTitle from "./student/chooseAPath/SelectTitle";
import ProjectTitle from "./student/chooseAPath/ProjectTitle";
import ProjectStatus from "./student/chooseAPath/ProjectStatus";
import ProposeProject from "./student/chooseAPath/ProposeProject";

// Student Components - Project Work (in root student directory)
import ProjectWork from "./student/ProjectWork";
import ModifyProposal from "./student/ModifyProposal";
import ProgressLogForm from "./student/ProgressLogForm";
import ProgressReportForm from "./student/ProgressReportForm";
import SelectLog from "./student/SelectLog";
import SelectReport from "./student/SelectReport";
import ViewProgressLog from "./student/ViewProgressLog";
import ViewProgressReport from "./student/ViewProgressReport";
import ViewProposal from "./student/ViewProposal";

// Supervisor Components
import SupervisorDashboard from "./supervisor/SupervisorDashboard";
import MyStudents from "./supervisor/MyStudents";
import SupervisorProposeProject from "./supervisor/ProposeProject";
import ProposedTitles from "./supervisor/ProposedTitles";
import StudentDetails from "./supervisor/StudentDetails";
import ProposalAction from "./supervisor/ProposalAction";
import SupervisorViewProposal from "./supervisor/ViewProposal";
import SupervisorModifyProposal from "./supervisor/ModifyProposal";
import PreviousProjects from "./supervisor/PreviousProjects";
import PreviousProjectDetails from "./supervisor/PreviousProjectDetails";
import SupervisorViewProgressLog from "./supervisor/ViewProgressLog";
import SupervisorViewProgressReport from "./supervisor/ViewProgressReport";

// Manager Components
import ManagerDashboard from "./manager/ManagerDashboard";
import ManageUsers from "./manager/ManageUsers";
import RegisterUser from "./manager/RegisterUser";
import ManageUserEligibility from "./manager/ManageUserEligibility";
import AssignExaminers from "./manager/AssignExaminers";
import ApprovedProjectsLogs from "./manager/ApprovedProjectsLogs";
import ManagerPreviousProjects from "./manager/PreviousProjects";
import ManagerPreviousProjectDetails from "./manager/PreviousProjectDetails";
import ViewProjectLog from "./manager/ViewProjectLog";

// Moderator Components
import ModeratorDashboard from "./moderator/ModeratorDashboard";
import ModeratorProposedTitles from "./moderator/ModeratorProposedTitles";
import ModeratorProposalAction from "./moderator/ModeratorProposalAction";
import ModeratorPreviousProjects from "./moderator/ModeratorPreviousProjects";
import ModeratorPreviousProjectDetails from "./moderator/ModeratorPreviousProjectDetails";

// Examiner Components
import ExaminerDashboard from "./examiner/ExaminerDashboard";

// Placeholder components for other roles (to be implemented later)

// Placeholder for additional student features
const Resources = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Resources</h1>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student Routes - Choose A Path (from chooseAPath subfolder) */}
      <Route path="/student/choose-path" element={<StudentChoosePath />} />
      <Route path="/student/select-title" element={<SelectTitle />} />
      <Route path="/student/project-title" element={<ProjectTitle />} />
      <Route path="/student/project-status" element={<ProjectStatus />} />
      <Route path="/student/propose-project" element={<ProposeProject />} />

      {/* Student Routes - Project Work (from root student directory) */}
      <Route path="/student/project-work" element={<ProjectWork />} />
      <Route path="/student/modify-proposal" element={<ModifyProposal />} />
      <Route path="/student/progress-log-form" element={<ProgressLogForm />} />
      <Route
        path="/student/progress-report-form"
        element={<ProgressReportForm />}
      />
      <Route path="/student/select-log" element={<SelectLog />} />
      <Route path="/student/select-report" element={<SelectReport />} />
      <Route path="/student/view-progress-log" element={<ViewProgressLog />} />
      <Route
        path="/student/view-progress-report"
        element={<ViewProgressReport />}
      />
      <Route path="/student/view-proposal" element={<ViewProposal />} />

      {/* Student Additional Routes */}
      <Route path="/student/resources" element={<Resources />} />

      {/* Supervisor Routes */}
      <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
      <Route path="/supervisor/my-students" element={<MyStudents />} />
      <Route
        path="/supervisor/propose-project"
        element={<SupervisorProposeProject />}
      />
      <Route path="/supervisor/proposed-titles" element={<ProposedTitles />} />
      <Route path="/supervisor/student-details" element={<StudentDetails />} />
      <Route path="/supervisor/proposal-action" element={<ProposalAction />} />
      <Route
        path="/supervisor/view-proposal"
        element={<SupervisorViewProposal />}
      />
      <Route
        path="/supervisor/modify-proposal"
        element={<SupervisorModifyProposal />}
      />
      <Route
        path="/supervisor/previous-projects"
        element={<PreviousProjects />}
      />
      <Route
        path="/supervisor/previous-project-details"
        element={<PreviousProjectDetails />}
      />
      <Route
        path="/supervisor/view-progress-log"
        element={<SupervisorViewProgressLog />}
      />
      <Route
        path="/supervisor/view-progress-report"
        element={<SupervisorViewProgressReport />}
      />

      {/* Manager Routes */}
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/manager/manage-users" element={<ManageUsers />} />
      <Route path="/manager/register-user" element={<RegisterUser />} />
      <Route
        path="/manager/manage-user-eligibility"
        element={<ManageUserEligibility />}
      />
      <Route path="/manager/assign-examiners" element={<AssignExaminers />} />
      <Route
        path="/manager/approved-projects-logs"
        element={<ApprovedProjectsLogs />}
      />
      <Route
        path="/manager/previous-projects"
        element={<ManagerPreviousProjects />}
      />
      <Route
        path="/manager/previous-project-details"
        element={<ManagerPreviousProjectDetails />}
      />
      <Route path="/manager/view-project-log" element={<ViewProjectLog />} />

      {/* Examiner Routes */}
      <Route path="/examiner/dashboard" element={<ExaminerDashboard />} />

      {/* Moderator Routes */}
      <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
      <Route
        path="/moderator/proposed-titles"
        element={<ModeratorProposedTitles />}
      />
      <Route
        path="/moderator/proposal-action"
        element={<ModeratorProposalAction />}
      />
      <Route
        path="/moderator/previous-projects"
        element={<ModeratorPreviousProjects />}
      />
      <Route
        path="/moderator/previous-project-details"
        element={<ModeratorPreviousProjectDetails />}
      />

      {/* Fallback route for 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
