// models/deadlineModel.js
import pool from "../db.js";
import notificationModel from "./notificationModel.js";

/**
 * Get all project-related deadlines coming up in the next X days
 * @param {number} daysAhead - Number of days to look ahead
 * @returns {Promise<Array>} - Array of upcoming deadlines
 */
const getUpcomingDeadlines = async (daysAhead = 7) => {
  try {
    const today = new Date();
    // Add daysAhead to today
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    // Format dates for SQL query
    const todayFormatted = today.toISOString().split("T")[0];
    const futureDateFormatted = futureDate.toISOString().split("T")[0];

    // Get upcoming progress log deadlines
    // This assumes there's a due_date field, but you may need to adapt this
    // based on your actual database schema
    const [logDeadlines] = await pool.query(
      `
      SELECT 
        p.project_id,
        p.title AS project_title,
        'progress_log' AS deadline_type,
        'Weekly Progress Log' AS item_title,
        u.user_id,
        u.name AS student_name,
        DATE_ADD(MAX(l.submission_date), INTERVAL 7 DAY) AS due_date
      FROM Project p
      JOIN Progress_Log l ON p.project_id = l.project_id
      JOIN User u ON l.student_id = u.user_id
      GROUP BY p.project_id, u.user_id
      HAVING due_date BETWEEN ? AND ?
    `,
      [todayFormatted, futureDateFormatted]
    );

    // Get upcoming progress report deadlines
    // Similar approach, check when the next report is due
    const [reportDeadlines] = await pool.query(
      `
      SELECT 
        p.project_id,
        p.title AS project_title,
        'progress_report' AS deadline_type,
        'Monthly Progress Report' AS item_title,
        u.user_id,
        u.name AS student_name,
        DATE_ADD(MAX(r.submission_date), INTERVAL 30 DAY) AS due_date
      FROM Project p
      JOIN Progress_Report r ON p.project_id = r.project_id
      JOIN User u ON r.student_id = u.user_id
      GROUP BY p.project_id, u.user_id
      HAVING due_date BETWEEN ? AND ?
    `,
      [todayFormatted, futureDateFormatted]
    );

    // Combine all deadlines
    return [...logDeadlines, ...reportDeadlines];
  } catch (error) {
    console.error("Error in getUpcomingDeadlines:", error);
    throw error;
  }
};

/**
 * Process all upcoming deadlines and send notifications
 * @param {number} daysAhead - Number of days to look ahead
 */
const processUpcomingDeadlines = async (daysAhead = 7) => {
  try {
    const deadlines = await getUpcomingDeadlines(daysAhead);
    console.log(
      `Found ${deadlines.length} upcoming deadlines in the next ${daysAhead} days`
    );

    const today = new Date();

    for (const deadline of deadlines) {
      const dueDate = new Date(deadline.due_date);
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      // Only notify for 1, 3, 7 days before deadline
      if ([1, 3, 7].includes(daysLeft)) {
        await notificationModel.notifyForUpcomingDeadline(
          deadline.user_id,
          deadline.deadline_type,
          daysLeft,
          deadline.item_title
        );
        console.log(
          `Notification sent to ${deadline.student_name} about ${deadline.deadline_type} due in ${daysLeft} days`
        );
      }
    }

    return deadlines.length;
  } catch (error) {
    console.error("Error in processUpcomingDeadlines:", error);
    throw error;
  }
};

export default {
  getUpcomingDeadlines,
  processUpcomingDeadlines,
};
