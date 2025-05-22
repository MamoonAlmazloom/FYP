// scheduler.js
import dotenv from "dotenv";
import deadlineModel from "./models/deadlineModel.js";

// Initialize dotenv
dotenv.config();

// Run the deadline processor
async function runScheduler() {
  try {
    console.log(
      `[${new Date().toISOString()}] Starting deadline notification scheduler`
    );

    // Process deadlines for the next 7 days
    const count = await deadlineModel.processUpcomingDeadlines(7);

    console.log(
      `[${new Date().toISOString()}] Processed ${count} upcoming deadlines`
    );
    return count;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in scheduler:`, error);
    throw error;
  }
}

// If this script is run directly (not imported)
if (import.meta.url === import.meta.main) {
  runScheduler()
    .then((count) => {
      console.log(`Processed ${count} deadlines. Exiting.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Scheduler error:", err);
      process.exit(1);
    });
}

export default { runScheduler };
