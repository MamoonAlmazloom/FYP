// models/notificationModel.js
import pool from "../db.js";

/**
 * Create notification event type if it doesn't exist
 * @param {string} eventName - The name of the event type
 * @returns {Promise<number>} - The ID of the event type
 */
const createEventTypeIfNotExists = async (eventName) => {
  try {
    // Check if event type exists
    const [existingTypes] = await pool.query(
      `SELECT event_type_id FROM Event_Type WHERE event_name = ?`,
      [eventName]
    );

    if (existingTypes.length > 0) {
      return existingTypes[0].event_type_id;
    }

    // Create new event type
    const [result] = await pool.query(
      `INSERT INTO Event_Type (event_name) VALUES (?)`,
      [eventName]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in createEventTypeIfNotExists:", error);
    throw error;
  }
};

/**
 * Create a notification for a user
 * @param {number} userId - The ID of the user to notify
 * @param {string} eventName - The name of the event type
 * @param {string} message - The notification message
 * @returns {Promise<number>} - The ID of the created notification
 */
const createNotification = async (userId, eventName, message) => {
  try {
    const eventTypeId = await createEventTypeIfNotExists(eventName);

    const [result] = await pool.query(
      `INSERT INTO Notification (user_id, event_type_id, message, timestamp, is_read)
       VALUES (?, ?, ?, NOW(), 0)`,
      [userId, eventTypeId, message]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in createNotification:", error);
    throw error;
  }
};

/**
 * Get notifications for a user
 * @param {number} userId - The ID of the user
 * @param {number} limit - Maximum number of notifications to retrieve (optional)
 * @param {boolean} onlyUnread - Whether to retrieve only unread notifications (optional)
 * @returns {Promise<Array>} - Array of notifications
 */
const getUserNotifications = async (userId, limit = 10, onlyUnread = false) => {
  try {
    let query = `
      SELECT n.notification_id, n.message, n.timestamp, n.is_read, et.event_name
      FROM Notification n
      JOIN Event_Type et ON n.event_type_id = et.event_type_id
      WHERE n.user_id = ?
    `;

    if (onlyUnread) {
      query += ` AND n.is_read = 0`;
    }

    query += ` ORDER BY n.timestamp DESC LIMIT ?`;

    const [notifications] = await pool.query(query, [userId, limit]);
    return notifications;
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - The ID of the notification
 * @returns {Promise<boolean>} - True if marked as read successfully
 */
const markNotificationAsRead = async (notificationId) => {
  try {
    const [result] = await pool.query(
      `UPDATE Notification SET is_read = 1 WHERE notification_id = ?`,
      [notificationId]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<number>} - Number of notifications marked as read
 */
const markAllNotificationsAsRead = async (userId) => {
  try {
    const [result] = await pool.query(
      `UPDATE Notification SET is_read = 1 WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    return result.affectedRows;
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error);
    throw error;
  }
};

// Helper function to create notifications for relevant events
const notifyForProposalEvent = async (proposalId, eventType) => {
  try {
    // Get proposal details with submitter and reviewer
    const [proposalDetails] = await pool.query(
      `SELECT 
        p.proposal_id, p.title, p.description, p.submitted_by, p.submitted_to,
        u_submitter.name as submitter_name, u_submitter.email as submitter_email,
        u_reviewer.name as reviewer_name, u_reviewer.email as reviewer_email
      FROM Proposal p
      JOIN User u_submitter ON p.submitted_by = u_submitter.user_id
      LEFT JOIN User u_reviewer ON p.submitted_to = u_reviewer.user_id
      WHERE p.proposal_id = ?`,
      [proposalId]
    );

    if (proposalDetails.length === 0) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }

    const proposal = proposalDetails[0];
    let notificationMessage = "";
    let targetUserId = null;

    switch (eventType) {
      case "proposal_submitted":
        notificationMessage = `New proposal "${proposal.title}" submitted by ${
          proposal.submitter_name
        } (${
          proposal.submitter_email
        }). Description: ${proposal.description.substring(0, 200)}${
          proposal.description.length > 200 ? "..." : ""
        }`;
        targetUserId = proposal.submitted_to;
        console.log(
          `Creating proposal submission notification for reviewer ${proposal.reviewer_name} (ID: ${targetUserId})`
        );
        break;
      case "proposal_approved":
        notificationMessage = `Your proposal "${proposal.title}" has been approved by ${proposal.reviewer_name}`;
        targetUserId = proposal.submitted_by;
        break;
      case "proposal_rejected":
        notificationMessage = `Your proposal "${proposal.title}" has been rejected by ${proposal.reviewer_name}`;
        targetUserId = proposal.submitted_by;
        break;
      case "proposal_needs_modification":
        notificationMessage = `Your proposal "${proposal.title}" needs modification as requested by ${proposal.reviewer_name}`;
        targetUserId = proposal.submitted_by;
        break;
      case "proposal_modified":
        notificationMessage = `Proposal "${proposal.title}" has been modified by ${proposal.submitter_name}`;
        targetUserId = proposal.submitted_to;
        break;
    }

    if (targetUserId && notificationMessage) {
      await createNotification(targetUserId, eventType, notificationMessage);
      console.log(
        `Successfully created ${eventType} notification for user ${targetUserId}`
      );
    } else {
      console.warn(
        `No notification created for ${eventType} - targetUserId: ${targetUserId}, message: ${!!notificationMessage}`
      );
    }
  } catch (error) {
    console.error(`Error in notifyForProposalEvent (${eventType}):`, error);
    throw error;
  }
};

const notifyForFeedbackEvent = async (feedbackId) => {
  try {
    // Get feedback details
    const [feedbackDetails] = await pool.query(
      `SELECT 
        f.feedback_id, f.proposal_id, f.log_id, f.report_id, 
        f.reviewer_id, f.comments,
        u_reviewer.name as reviewer_name
      FROM Feedback f
      JOIN User u_reviewer ON f.reviewer_id = u_reviewer.user_id
      WHERE f.feedback_id = ?`,
      [feedbackId]
    );

    if (feedbackDetails.length === 0) {
      throw new Error(`Feedback not found: ${feedbackId}`);
    }

    const feedback = feedbackDetails[0];
    let targetUserId = null;
    let itemType = "";
    let itemTitle = "";

    // Determine which type of feedback it is and get the appropriate user to notify
    if (feedback.proposal_id) {
      const [proposalDetails] = await pool.query(
        `SELECT p.title, p.submitted_by FROM Proposal p WHERE p.proposal_id = ?`,
        [feedback.proposal_id]
      );
      if (proposalDetails.length > 0) {
        targetUserId = proposalDetails[0].submitted_by;
        itemType = "proposal";
        itemTitle = proposalDetails[0].title;
      }
    } else if (feedback.log_id) {
      const [logDetails] = await pool.query(
        `SELECT l.student_id FROM Progress_Log l WHERE l.log_id = ?`,
        [feedback.log_id]
      );
      if (logDetails.length > 0) {
        targetUserId = logDetails[0].student_id;
        itemType = "progress log";
        itemTitle = `Log #${feedback.log_id}`;
      }
    } else if (feedback.report_id) {
      const [reportDetails] = await pool.query(
        `SELECT r.title, r.student_id FROM Progress_Report r WHERE r.report_id = ?`,
        [feedback.report_id]
      );
      if (reportDetails.length > 0) {
        targetUserId = reportDetails[0].student_id;
        itemType = "progress report";
        itemTitle = reportDetails[0].title;
      }
    }

    if (targetUserId) {
      const message = `New feedback from ${feedback.reviewer_name} on your ${itemType} "${itemTitle}"`;
      await createNotification(targetUserId, "feedback_received", message);
    }
  } catch (error) {
    console.error("Error in notifyForFeedbackEvent:", error);
    throw error;
  }
};

const notifyForUpcomingDeadline = async (
  userId,
  deadlineType,
  daysLeft,
  itemTitle
) => {
  try {
    const message = `Reminder: Your ${deadlineType} "${itemTitle}" is due in ${daysLeft} day${
      daysLeft !== 1 ? "s" : ""
    }`;
    await createNotification(userId, "upcoming_deadline", message);
    return true;
  } catch (error) {
    console.error("Error in notifyForUpcomingDeadline:", error);
    throw error;
  }
};

const notifyForProgressSubmission = async (submissionType, submissionId) => {
  try {
    let query, params, targetUserId, submissionTitle;

    if (submissionType === "log") {
      query = `
        SELECT 
          l.log_id, l.student_id, l.project_id, l.details,
          p.title as project_title,
          u.name as student_name,
          (SELECT user_id FROM Supervisor_Project sp WHERE sp.project_id = l.project_id) as supervisor_id
        FROM Progress_Log l
        JOIN Project p ON l.project_id = p.project_id
        JOIN User u ON l.student_id = u.user_id
        WHERE l.log_id = ?
      `;
      params = [submissionId];
    } else if (submissionType === "report") {
      query = `
        SELECT 
          r.report_id, r.student_id, r.project_id, r.title,
          p.title as project_title,
          u.name as student_name,
          (SELECT user_id FROM Supervisor_Project sp WHERE sp.project_id = r.project_id) as supervisor_id
        FROM Progress_Report r
        JOIN Project p ON r.project_id = p.project_id
        JOIN User u ON r.student_id = u.user_id
        WHERE r.report_id = ?
      `;
      params = [submissionId];
    } else {
      throw new Error(`Invalid submission type: ${submissionType}`);
    }

    const [results] = await pool.query(query, params);

    if (results.length === 0) {
      throw new Error(
        `${submissionType} submission not found: ${submissionId}`
      );
    }

    const submission = results[0];
    targetUserId = submission.supervisor_id;
    submissionTitle =
      submissionType === "log"
        ? `Progress Log for ${submission.project_title}`
        : submission.title;

    if (targetUserId) {
      const message = `${submission.student_name} has submitted a new ${
        submissionType === "log" ? "progress log" : "progress report"
      } for "${submission.project_title}"`;
      await createNotification(
        targetUserId,
        `${submissionType}_submitted`,
        message
      );
    }
  } catch (error) {
    console.error(
      `Error in notifyForProgressSubmission (${submissionType}):`,
      error
    );
    throw error;
  }
};

/**
 * Notify student when examiner is assigned
 * @param {number} projectId - The project ID
 * @param {number} studentId - The student ID
 * @param {number} examinerId - The examiner ID
 * @returns {Promise<void>}
 */
const notifyExaminerAssignment = async (projectId, studentId, examinerId) => {
  try {
    // Get project and examiner details
    const [details] = await pool.query(
      `SELECT 
        p.title as project_title,
        u_examiner.name as examiner_name,
        u_student.name as student_name
      FROM Project p
      JOIN User u_examiner ON u_examiner.user_id = ?
      JOIN User u_student ON u_student.user_id = ?
      WHERE p.project_id = ?`,
      [examinerId, studentId, projectId]
    );

    if (details.length === 0) {
      throw new Error(`Project or user details not found`);
    }

    const { project_title, examiner_name, student_name } = details[0];

    // Notify student
    const studentMessage = `Your project "${project_title}" has been assigned to examiner ${examiner_name} for evaluation`;
    await createNotification(studentId, "examiner_assigned", studentMessage);

    // Notify examiner
    const examinerMessage = `You have been assigned to evaluate the project "${project_title}" by student ${student_name}`;
    await createNotification(examinerId, "examiner_assigned", examinerMessage);
  } catch (error) {
    console.error("Error in notifyExaminerAssignment:", error);
    throw error;
  }
};

/**
 * Notify student when project is evaluated
 * @param {number} projectId - The project ID
 * @param {number} examinerId - The examiner ID
 * @param {string} evaluationResult - The evaluation result (e.g., "Pass", "Fail", "Resubmit")
 * @param {number} score - The score given (optional)
 * @returns {Promise<void>}
 */
const notifyProjectEvaluation = async (
  projectId,
  examinerId,
  evaluationResult,
  score = null
) => {
  try {
    // Get project and student details
    const [details] = await pool.query(
      `SELECT 
        p.title as project_title,
        pr.submitted_by as student_id,
        u_examiner.name as examiner_name,
        u_student.name as student_name
      FROM Project p
      JOIN Proposal pr ON p.project_id = pr.project_id
      JOIN User u_examiner ON u_examiner.user_id = ?
      JOIN User u_student ON pr.submitted_by = u_student.user_id
      WHERE p.project_id = ?`,
      [examinerId, projectId]
    );

    if (details.length === 0) {
      throw new Error(`Project details not found for project ID: ${projectId}`);
    }

    const { project_title, student_id, examiner_name } = details[0];

    // Create message based on evaluation result
    let message = `Your project "${project_title}" has been evaluated by ${examiner_name}. Result: ${evaluationResult}`;
    if (score !== null) {
      message += ` (Score: ${score})`;
    }

    await createNotification(student_id, "project_evaluated", message);
  } catch (error) {
    console.error("Error in notifyProjectEvaluation:", error);
    throw error;
  }
};

/**
 * Notify supervisor when student submits a new log or report
 * @param {string} submissionType - Type of submission ("log" or "report")
 * @param {number} submissionId - The submission ID
 * @param {number} studentId - The student ID
 * @param {number} projectId - The project ID
 * @returns {Promise<void>}
 */
const notifyProgressSubmissionToSupervisor = async (
  submissionType,
  submissionId,
  studentId,
  projectId
) => {
  try {
    let submissionTitle = "";
    let submissionDetails = "";

    if (submissionType === "log") {
      const [logDetails] = await pool.query(
        `SELECT details FROM Progress_Log WHERE log_id = ?`,
        [submissionId]
      );
      submissionTitle = `Progress Log #${submissionId}`;
      submissionDetails = logDetails.length > 0 ? logDetails[0].details : "";
    } else if (submissionType === "report") {
      const [reportDetails] = await pool.query(
        `SELECT title, details FROM Progress_Report WHERE report_id = ?`,
        [submissionId]
      );
      if (reportDetails.length > 0) {
        submissionTitle = reportDetails[0].title;
        submissionDetails = reportDetails[0].details || "";
      } else {
        submissionTitle = "Progress Report";
      }
    }

    // Get project and student details with better error handling
    const [details] = await pool.query(
      `SELECT 
        p.title as project_title,
        u_student.name as student_name,
        u_student.email as student_email,
        sp.user_id as supervisor_id,
        u_supervisor.name as supervisor_name
      FROM Project p
      JOIN User u_student ON u_student.user_id = ?
      JOIN Supervisor_Project sp ON sp.project_id = p.project_id
      JOIN User u_supervisor ON u_supervisor.user_id = sp.user_id
      WHERE p.project_id = ?`,
      [studentId, projectId]
    );

    if (details.length === 0) {
      console.error(
        `No supervisor found for project ${projectId} and student ${studentId}`
      );
      // Try alternative approach - check if project exists at all
      const [projectCheck] = await pool.query(
        `SELECT title FROM Project WHERE project_id = ?`,
        [projectId]
      );
      if (projectCheck.length === 0) {
        throw new Error(`Project not found: ${projectId}`);
      } else {
        throw new Error(`No supervisor assigned to project ${projectId}`);
      }
    }

    const {
      project_title,
      student_name,
      student_email,
      supervisor_id,
      supervisor_name,
    } = details[0];

    const message = `${student_name} (${student_email}) has submitted a new ${
      submissionType === "log" ? "progress log" : "progress report"
    } "${submissionTitle}" for project "${project_title}". ${
      submissionType === "log" ? "Log details" : "Report summary"
    }: ${submissionDetails.substring(0, 200)}${
      submissionDetails.length > 200 ? "..." : ""
    }`;

    console.log(
      `Creating notification for supervisor ${supervisor_name} (ID: ${supervisor_id}) about ${submissionType} submission`
    );

    await createNotification(
      supervisor_id,
      `${submissionType}_submitted`,
      message
    );

    console.log(
      `Successfully notified supervisor about ${submissionType} submission`
    );
  } catch (error) {
    console.error(
      `Error in notifyProgressSubmissionToSupervisor (${submissionType}):`,
      error
    );
    throw error;
  }
};

/**
 * Notify student when they receive feedback on log or report
 * @param {string} feedbackType - Type of feedback ("log" or "report")
 * @param {number} feedbackId - The feedback ID
 * @param {number} reviewerId - The reviewer ID
 * @param {number} targetId - The log_id or report_id
 * @returns {Promise<void>}
 */
const notifyFeedbackReceived = async (
  feedbackType,
  feedbackId,
  reviewerId,
  targetId
) => {
  try {
    let studentId = null;
    let itemTitle = "";

    // Get student and item details based on feedback type
    if (feedbackType === "log") {
      const [logDetails] = await pool.query(
        `SELECT 
          pl.student_id,
          p.title as project_title
        FROM Progress_Log pl
        JOIN Project p ON pl.project_id = p.project_id
        WHERE pl.log_id = ?`,
        [targetId]
      );

      if (logDetails.length > 0) {
        studentId = logDetails[0].student_id;
        itemTitle = `Progress Log for "${logDetails[0].project_title}"`;
      }
    } else if (feedbackType === "report") {
      const [reportDetails] = await pool.query(
        `SELECT 
          pr.student_id,
          pr.title as report_title
        FROM Progress_Report pr
        WHERE pr.report_id = ?`,
        [targetId]
      );

      if (reportDetails.length > 0) {
        studentId = reportDetails[0].student_id;
        itemTitle = `Progress Report "${reportDetails[0].report_title}"`;
      }
    }

    if (!studentId) {
      throw new Error(`Student not found for ${feedbackType} ID: ${targetId}`);
    }

    // Get reviewer name
    const [reviewerDetails] = await pool.query(
      `SELECT name FROM User WHERE user_id = ?`,
      [reviewerId]
    );

    const reviewerName =
      reviewerDetails.length > 0 ? reviewerDetails[0].name : "Unknown Reviewer";

    const message = `You have received new feedback from ${reviewerName} on your ${itemTitle}`;

    await createNotification(studentId, "feedback_received", message);
  } catch (error) {
    console.error(`Error in notifyFeedbackReceived (${feedbackType}):`, error);
    throw error;
  }
};

export default {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  notifyForProposalEvent,
  notifyForFeedbackEvent,
  notifyForUpcomingDeadline,
  notifyForProgressSubmission,
  notifyExaminerAssignment,
  notifyProjectEvaluation,
  notifyProgressSubmissionToSupervisor,
  notifyFeedbackReceived,
};
