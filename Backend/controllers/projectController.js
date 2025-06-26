// controllers/projectController.js
import * as projectModel from "../models/projectModel.js";
import * as notificationService from "../services/notificationService.js";

/**
 * Create a new project (Supervisor only)
 */
export const createProject = async (req, res, next) => {
  try {
    const { title, description, prerequisites, capacity } = req.body;
    const supervisorId = req.user.id; // Check if user has supervisor role
    if (!req.user.roles.includes("supervisor")) {
      return res.status(403).json({
        success: false,
        message: "Only supervisors can propose projects",
      });
    } // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // Create project data
    const projectData = {
      title,
      description,
      prerequisites,
      capacity,
      supervisor_id: supervisorId,
      status: "Available",
    };

    const project = await projectModel.createProject(projectData);

    return res.status(201).json({
      success: true,
      project: {
        id: project.id,
        status: "Available",
        ...projectData,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Student selects an available project
 */
export const selectProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const studentId = req.user.id; // Check if user has student role
    if (!req.user.roles.includes("student")) {
      return res.status(403).json({
        success: false,
        message: "Only students can select projects",
      });
    }

    // Check if project exists and is available
    const project = await projectModel.findProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    if (project.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Project is not available or at full capacity",
      });
    }

    // Check if project is at capacity
    if (
      project.capacity &&
      project.current_students_count >= project.capacity
    ) {
      return res.status(400).json({
        success: false,
        message: "Project is not available or at full capacity",
      });
    }

    // Check if student already has an active project
    const studentProjects = await projectModel.getProjectsByStudent(studentId);
    if (studentProjects && studentProjects.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student already has an active project",
      });
    }

    // Assign project to student
    await projectModel.assignProjectToStudent(projectId, studentId);

    return res.status(200).json({
      success: true,
      message: "Project selected successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get projects with optional filtering
 */
export const getProjects = async (req, res, next) => {
  try {
    const { status } = req.query;

    let projects;
    if (status) {
      projects = await projectModel.getProjectsByStatus(status);
    } else {
      projects = await projectModel.getAllProjects();
    }

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get archived projects for supervisor
 */
export const getArchivedProjects = async (req, res, next) => {
  try {
    const supervisorId = req.user.id;

    // Check if user has supervisor role
    if (!req.user.roles.includes("supervisor")) {
      return res.status(403).json({
        success: false,
        error: "Only supervisors can access archived projects",
      });
    }

    const projects = await projectModel.getProjectsBySupervisor({
      supervisor_id: supervisorId,
      status: "Archived",
    });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign examiner to project (Manager only)
 */
export const assignExaminer = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { examiner_user_id } = req.body;

    // Check if user has manager role
    if (!req.user.roles.includes("manager")) {
      return res.status(403).json({
        success: false,
        error: "Only managers can assign examiners",
      });
    }

    // Validate project exists
    const project = await projectModel.findProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    } // Check if project is in assignable state
    if (
      project.status !== "ReadyForExamination" &&
      project.status !== "Approved"
    ) {
      return res.status(400).json({
        success: false,
        message: "Project not in assignable state",
      });
    } // Assign examiner
    try {
      await projectModel.assignExaminerToProject(projectId, examiner_user_id);
    } catch (modelError) {
      // Handle model-level errors (e.g., invalid examiner)
      return res.status(400).json({
        success: false,
        message: modelError.message || "Invalid examiner or role",
      });
    }

    return res.status(200).json({
      success: true,
      project: {
        id: projectId,
        examiner_id: examiner_user_id,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign moderator to project (Manager only)
 */
export const assignModerator = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { moderator_user_id } = req.body;

    // Check if user has manager role
    if (!req.user.roles.includes("manager")) {
      return res.status(403).json({
        success: false,
        error: "Only managers can assign moderators",
      });
    }

    // Validate project exists
    const project = await projectModel.findProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Assign moderator
    await projectModel.assignModeratorToProject(projectId, moderator_user_id);

    return res.status(200).json({
      success: true,
      project: {
        id: projectId,
        moderator_id: moderator_user_id,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Archive project (Manager only)
 */
export const archiveProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Check if user has manager role
    if (!req.user.roles.includes("manager")) {
      return res.status(403).json({
        success: false,
        error: "Only managers can archive projects",
      });
    }

    // Validate project exists
    const project = await projectModel.findProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Archive project
    await projectModel.updateProjectStatus(projectId, "Archived");

    return res.status(200).json({
      success: true,
      project: {
        id: projectId,
        status: "Archived",
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createProject,
  selectProject,
  getProjects,
  getArchivedProjects,
  assignExaminer,
  assignModerator,
  archiveProject,
};
