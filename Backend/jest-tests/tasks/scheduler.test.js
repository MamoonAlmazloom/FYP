// Test cases for scheduled tasks like deadline reminders
// F4: Notifications (partial - TC-B4.2 Deadline Reminder)

// Mock the model that provides deadline information
jest.mock("../../models/deadlineModel.js", () => ({
  // Assuming deadlineModel.js exists
  getUpcomingDeadlines: jest.fn(),
}));
import deadlineModel from "../../models/deadlineModel.js";

// Mock the notification service
jest.mock("../../services/notificationService.js", () => ({
  notifyUser: jest.fn(),
}));
import notificationService from "../../services/notificationService.js";

// Hypothetical function that encapsulates the scheduler job's logic
// In a real app, this might be a function exported from your scheduler.js file
const runDeadlineReminderJob = async () => {
  console.log("Simulating deadline reminder job run...");
  const upcomingDeadlines = await deadlineModel.getUpcomingDeadlines({
    daysAhead: 7,
  }); // Example: remind for deadlines 7 days ahead

  if (!upcomingDeadlines || upcomingDeadlines.length === 0) {
    console.log("No upcoming deadlines found.");
    return;
  }

  for (const deadline of upcomingDeadlines) {
    // Assuming deadline object has student_id, project_name, deadline_date, type (e.g. 'report', 'proposal_modification')
    const message = `Reminder: The ${deadline.type} for project "${
      deadline.project_name
    }" is due on ${new Date(deadline.deadline_date).toLocaleDateString()}.`;
    const details = {
      deadlineId: deadline.id,
      projectId: deadline.project_id,
      studentId: deadline.student_id,
      type: "deadline_reminder",
    };
    await notificationService.notifyUser(deadline.student_id, message, details);
    console.log(
      `Notification sent to student ${deadline.student_id} for deadline ${deadline.id}`
    );
  }
  console.log(`Processed ${upcomingDeadlines.length} deadline reminders.`);
};

describe("Scheduled Tasks (TC-B4.2: Deadline Reminder)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should query for upcoming deadlines and send notifications to relevant students", async () => {
    const mockDeadlines = [
      {
        id: "d1",
        student_id: "student001",
        project_id: "projA",
        project_name: "Project Alpha",
        deadline_date: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        type: "Report Submission",
      },
      {
        id: "d2",
        student_id: "student002",
        project_id: "projB",
        project_name: "Project Beta",
        deadline_date: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        type: "Milestone Update",
      },
    ];
    deadlineModel.getUpcomingDeadlines.mockResolvedValue(mockDeadlines);

    await runDeadlineReminderJob();

    expect(deadlineModel.getUpcomingDeadlines).toHaveBeenCalledWith({
      daysAhead: 7,
    }); // Or whatever your job logic uses
    expect(notificationService.notifyUser).toHaveBeenCalledTimes(
      mockDeadlines.length
    );

    expect(notificationService.notifyUser).toHaveBeenCalledWith(
      "student001",
      expect.stringContaining('Report Submission for project "Project Alpha"'),
      expect.objectContaining({ deadlineId: "d1", type: "deadline_reminder" })
    );
    expect(notificationService.notifyUser).toHaveBeenCalledWith(
      "student002",
      expect.stringContaining('Milestone Update for project "Project Beta"'),
      expect.objectContaining({ deadlineId: "d2", type: "deadline_reminder" })
    );
  });

  it("should do nothing if no upcoming deadlines are found", async () => {
    deadlineModel.getUpcomingDeadlines.mockResolvedValue([]); // No deadlines

    await runDeadlineReminderJob();

    expect(deadlineModel.getUpcomingDeadlines).toHaveBeenCalledWith({
      daysAhead: 7,
    });
    expect(notificationService.notifyUser).not.toHaveBeenCalled();
  });
});
