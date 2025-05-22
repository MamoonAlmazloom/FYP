// controllers/deadlineController.js
import deadlineModel from "../models/deadlineModel.js";

/**
 * Manually trigger the deadline notification process
 * Useful for testing or for administrators to run on-demand
 */
const processDeadlineNotifications = async (req, res, next) => {
  try {
    const { daysAhead } = req.query;

    const daysToLookAhead = daysAhead ? parseInt(daysAhead, 10) : 7;

    const count = await deadlineModel.processUpcomingDeadlines(daysToLookAhead);

    res.status(200).json({
      success: true,
      message: `Processed ${count} upcoming deadlines in the next ${daysToLookAhead} days`,
      count,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a list of upcoming deadlines for administrative purposes
 */
const getUpcomingDeadlines = async (req, res, next) => {
  try {
    const { daysAhead } = req.query;

    const daysToLookAhead = daysAhead ? parseInt(daysAhead, 10) : 7;

    const deadlines = await deadlineModel.getUpcomingDeadlines(daysToLookAhead);

    res.status(200).json({
      success: true,
      deadlines,
      count: deadlines.length,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  processDeadlineNotifications,
  getUpcomingDeadlines,
};
