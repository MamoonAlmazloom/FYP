import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./LoginPage";

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

// Auth components
import { withAuth } from "./contexts/AuthContext";

// Protected route components
const ProtectedStudentChoosePath = withAuth(StudentChoosePath, ["Student"]);
const ProtectedSelectTitle = withAuth(SelectTitle, ["Student"]);
const ProtectedProjectTitle = withAuth(ProjectTitle, ["Student"]);
const ProtectedProjectStatus = withAuth(ProjectStatus, ["Student"]);
const ProtectedStudentProposeProject = withAuth(ProposeProject, ["Student"]);
const ProtectedProjectWork = withAuth(ProjectWork, ["Student"]);
const ProtectedModifyProposal = withAuth(ModifyProposal, ["Student"]);
const ProtectedProgressLogForm = withAuth(ProgressLogForm, ["Student"]);
const ProtectedProgressReportForm = withAuth(ProgressReportForm, ["Student"]);
const ProtectedSelectLog = withAuth(SelectLog, ["Student"]);
const ProtectedSelectReport = withAuth(SelectReport, ["Student"]);
const ProtectedViewProgressLog = withAuth(ViewProgressLog, ["Student"]);
const ProtectedViewProgressReport = withAuth(ViewProgressReport, ["Student"]);
const ProtectedViewProposal = withAuth(ViewProposal, ["Student"]);

const ProtectedSupervisorDashboard = withAuth(SupervisorDashboard, [
  "Supervisor",
  "SV",
]);
const ProtectedMyStudents = withAuth(MyStudents, ["Supervisor", "SV"]);
const ProtectedSupervisorProposeProject = withAuth(SupervisorProposeProject, [
  "Supervisor",
  "SV",
]);
const ProtectedProposedTitles = withAuth(ProposedTitles, ["Supervisor", "SV"]);
const ProtectedStudentDetails = withAuth(StudentDetails, ["Supervisor", "SV"]);
const ProtectedProposalAction = withAuth(ProposalAction, ["Supervisor", "SV"]);
const ProtectedSupervisorViewProposal = withAuth(SupervisorViewProposal, [
  "Supervisor",
  "SV",
]);
const ProtectedSupervisorModifyProposal = withAuth(SupervisorModifyProposal, [
  "Supervisor",
  "SV",
]);
const ProtectedSupervisorPreviousProjects = withAuth(PreviousProjects, [
  "Supervisor",
  "SV",
]);
const ProtectedSupervisorPreviousProjectDetails = withAuth(
  PreviousProjectDetails,
  ["Supervisor", "SV"]
);
const ProtectedSupervisorViewProgressLog = withAuth(SupervisorViewProgressLog, [
  "Supervisor",
  "SV",
]);
const ProtectedSupervisorViewProgressReport = withAuth(
  SupervisorViewProgressReport,
  ["Supervisor", "SV"]
);

const ProtectedManagerDashboard = withAuth(ManagerDashboard, ["Manager"]);
const ProtectedManageUsers = withAuth(ManageUsers, ["Manager"]);
const ProtectedRegisterUser = withAuth(RegisterUser, ["Manager"]);
const ProtectedManageUserEligibility = withAuth(ManageUserEligibility, [
  "Manager",
]);
const ProtectedAssignExaminers = withAuth(AssignExaminers, ["Manager"]);
const ProtectedApprovedProjectsLogs = withAuth(ApprovedProjectsLogs, [
  "Manager",
]);
const ProtectedManagerPreviousProjects = withAuth(ManagerPreviousProjects, [
  "Manager",
]);
const ProtectedManagerPreviousProjectDetails = withAuth(
  ManagerPreviousProjectDetails,
  ["Manager"]
);
const ProtectedViewProjectLog = withAuth(ViewProjectLog, ["Manager"]);

const ProtectedModeratorDashboard = withAuth(ModeratorDashboard, ["Moderator"]);
const ProtectedModeratorProposedTitles = withAuth(ModeratorProposedTitles, [
  "Moderator",
]);
const ProtectedModeratorProposalAction = withAuth(ModeratorProposalAction, [
  "Moderator",
]);
const ProtectedModeratorPreviousProjects = withAuth(ModeratorPreviousProjects, [
  "Moderator",
]);
const ProtectedModeratorPreviousProjectDetails = withAuth(
  ModeratorPreviousProjectDetails,
  ["Moderator"]
);

const ProtectedExaminerDashboard = withAuth(ExaminerDashboard, ["Examiner"]);

// Placeholder components for additional features
const Resources = withAuth(
  () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Resources</h1>
        <p className="text-gray-600">Coming Soon...</p>
      </div>
    </div>
  ),
  ["Student"]
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes - Choose A Path (from chooseAPath subfolder) */}
        <Route
          path="/student/choose-path"
          element={<ProtectedStudentChoosePath />}
        />
        <Route
          path="/student/select-title"
          element={<ProtectedSelectTitle />}
        />
        <Route
          path="/student/project-title"
          element={<ProtectedProjectTitle />}
        />
        <Route
          path="/student/project-status"
          element={<ProtectedProjectStatus />}
        />
        <Route
          path="/student/propose-project"
          element={<ProtectedStudentProposeProject />}
        />

        {/* Student Routes - Project Work (from root student directory) */}
        <Route
          path="/student/project-work"
          element={<ProtectedProjectWork />}
        />
        <Route
          path="/student/modify-proposal"
          element={<ProtectedModifyProposal />}
        />
        <Route
          path="/student/progress-log-form"
          element={<ProtectedProgressLogForm />}
        />
        <Route
          path="/student/progress-report-form"
          element={<ProtectedProgressReportForm />}
        />
        <Route path="/student/select-log" element={<ProtectedSelectLog />} />
        <Route
          path="/student/select-report"
          element={<ProtectedSelectReport />}
        />
        <Route
          path="/student/view-progress-log"
          element={<ProtectedViewProgressLog />}
        />
        <Route
          path="/student/view-progress-report"
          element={<ProtectedViewProgressReport />}
        />
        <Route
          path="/student/view-proposal"
          element={<ProtectedViewProposal />}
        />
        <Route path="/student/resources" element={<Resources />} />

        {/* Supervisor Routes */}
        <Route
          path="/supervisor/dashboard"
          element={<ProtectedSupervisorDashboard />}
        />
        <Route
          path="/supervisor/my-students"
          element={<ProtectedMyStudents />}
        />
        <Route
          path="/supervisor/propose-project"
          element={<ProtectedSupervisorProposeProject />}
        />
        <Route
          path="/supervisor/proposed-titles"
          element={<ProtectedProposedTitles />}
        />
        <Route
          path="/supervisor/student-details"
          element={<ProtectedStudentDetails />}
        />
        <Route
          path="/supervisor/proposal-action"
          element={<ProtectedProposalAction />}
        />
        <Route
          path="/supervisor/view-proposal"
          element={<ProtectedSupervisorViewProposal />}
        />
        <Route
          path="/supervisor/modify-proposal"
          element={<ProtectedSupervisorModifyProposal />}
        />
        <Route
          path="/supervisor/previous-projects"
          element={<ProtectedSupervisorPreviousProjects />}
        />
        <Route
          path="/supervisor/previous-project-details"
          element={<ProtectedSupervisorPreviousProjectDetails />}
        />
        <Route
          path="/supervisor/view-progress-log"
          element={<ProtectedSupervisorViewProgressLog />}
        />
        <Route
          path="/supervisor/view-progress-report"
          element={<ProtectedSupervisorViewProgressReport />}
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={<ProtectedManagerDashboard />}
        />
        <Route
          path="/manager/manage-users"
          element={<ProtectedManageUsers />}
        />
        <Route
          path="/manager/register-user"
          element={<ProtectedRegisterUser />}
        />
        <Route
          path="/manager/manage-user-eligibility"
          element={<ProtectedManageUserEligibility />}
        />
        <Route
          path="/manager/assign-examiners"
          element={<ProtectedAssignExaminers />}
        />
        <Route
          path="/manager/approved-projects-logs"
          element={<ProtectedApprovedProjectsLogs />}
        />
        <Route
          path="/manager/previous-projects"
          element={<ProtectedManagerPreviousProjects />}
        />
        <Route
          path="/manager/previous-project-details"
          element={<ProtectedManagerPreviousProjectDetails />}
        />
        <Route
          path="/manager/view-project-log"
          element={<ProtectedViewProjectLog />}
        />

        {/* Examiner Routes */}
        <Route
          path="/examiner/dashboard"
          element={<ProtectedExaminerDashboard />}
        />

        {/* Moderator Routes */}
        <Route
          path="/moderator/dashboard"
          element={<ProtectedModeratorDashboard />}
        />
        <Route
          path="/moderator/proposed-titles"
          element={<ProtectedModeratorProposedTitles />}
        />
        <Route
          path="/moderator/proposal-action"
          element={<ProtectedModeratorProposalAction />}
        />
        <Route
          path="/moderator/previous-projects"
          element={<ProtectedModeratorPreviousProjects />}
        />
        <Route
          path="/moderator/previous-project-details"
          element={<ProtectedModeratorPreviousProjectDetails />}
        />

        {/* Default redirect - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Fallback route for 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a
                  href="/login"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back to Login
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
