# Notification System - Comprehensive Implementation

## Overview

The notification system has been fully implemented with triggers for all major events in the FYP system. The system provides real-time notifications to users when relevant events occur.

## ✅ Implemented Notification Triggers

### 1. 🎯 Examiner Assignment to Student

**Trigger**: When a manager assigns an examiner to evaluate a student's project
**Recipients**:

- Student: Gets notified that an examiner has been assigned
- Examiner: Gets notified about their new assignment
  **Implementation**:
- Location: `Backend/models/managerModel.js` - `assignExaminer()` function
- Event: `examiner_assigned`
- Auto-triggered when manager assigns examiner via API

### 2. 📊 Project Evaluation Completion

**Trigger**: When an examiner completes evaluation of a project
**Recipients**:

- Student: Gets notified about evaluation result and score
  **Implementation**:
- Location: `Backend/controllers/examinerController.js` - `evaluateProject()` function
- Event: `project_evaluated`
- Auto-triggered when examiner submits evaluation via API

### 3. 💬 Feedback on Log/Report

**Trigger**: When supervisor provides feedback on student's progress log or report
**Recipients**:

- Student: Gets notified about new feedback received
  **Implementation**:
- Location: `Backend/controllers/supervisorController.js` - `provideFeedbackOnLog()`, `provideFeedbackOnReport()`
- Event: `feedback_received`
- Auto-triggered when supervisor submits feedback via API

### 4. 📝 Progress Submission to Supervisor

**Trigger**: When student submits a new progress log or report
**Recipients**:

- Supervisor: Gets notified about new submission from their student
  **Implementation**:
- Location: `Backend/controllers/studentController.js` - `submitProgressLog()`, `submitProgressReport()`
- Event: `log_submitted`, `report_submitted`
- Auto-triggered when student submits progress via API

## Additional Existing Triggers

### 5. 📝 Proposal Events

- **Proposal Submitted**: Notifies supervisor when student submits proposal
- **Proposal Approved**: Notifies student when proposal is approved
- **Proposal Rejected**: Notifies student when proposal is rejected
- **Proposal Needs Modification**: Notifies student when changes are requested

### 6. ⏰ Deadline Reminders

- **Upcoming Deadlines**: Notifies users about approaching deadlines
- **Overdue Items**: Notifies about missed deadlines

## Technical Implementation

### Backend Components

#### Notification Model (`models/notificationModel.js`)

```javascript
// Core functions
-createNotification(userId, eventName, message) -
  getUserNotifications(userId, limit, onlyUnread) -
  markNotificationAsRead(notificationId) -
  markAllNotificationsAsRead(userId) -
  // Event-specific triggers
  notifyExaminerAssignment(projectId, studentId, examinerId) -
  notifyProjectEvaluation(projectId, examinerId, result, score) -
  notifyProgressSubmissionToSupervisor(
    type,
    submissionId,
    studentId,
    projectId
  ) -
  notifyFeedbackReceived(feedbackType, feedbackId, reviewerId, targetId) -
  notifyForProposalEvent(proposalId, eventType) -
  notifyForUpcomingDeadline(userId, deadlineType, daysLeft, itemTitle);
```

#### Database Tables

- `Notification`: Stores notification records
- `Event_Type`: Stores event type definitions
- `User`: Links notifications to users

#### API Endpoints

- `GET /api/notifications/:userId` - Get user notifications
- `PATCH /api/notifications/:notificationId/read` - Mark as read
- `PATCH /api/notifications/:userId/read-all` - Mark all as read
- `POST /api/notifications` - Create custom notification
- `GET /api/notifications/test` - Test endpoint

### Frontend Components

#### NotificationCenter Component (`components/NotificationCenter.jsx`)

- Real-time notification display
- Unread count badges
- Mark as read functionality
- Event-specific icons
- Timestamp formatting
- Auto-refresh capability

#### Integration Points

- Manager Dashboard: Shows system notifications
- Moderator Dashboard: Shows pending proposals and notifications
- Student Dashboard: Shows project-related notifications
- Supervisor Dashboard: Shows student submission notifications

## Event Types and Icons

| Event Type                    | Icon | Description                     |
| ----------------------------- | ---- | ------------------------------- |
| `examiner_assigned`           | 🎯   | Examiner assigned to project    |
| `project_evaluated`           | 📊   | Project evaluation completed    |
| `feedback_received`           | 💬   | Feedback received on submission |
| `log_submitted`               | 📝   | Progress log submitted          |
| `report_submitted`            | 📝   | Progress report submitted       |
| `proposal_submitted`          | 📝   | Proposal submitted for review   |
| `proposal_approved`           | ✅   | Proposal approved               |
| `proposal_rejected`           | ❌   | Proposal rejected               |
| `proposal_needs_modification` | 🔄   | Proposal needs changes          |
| `deadline_reminder`           | ⏰   | Deadline approaching            |

## Testing

### Test Endpoints

Available at `http://localhost:5174/notification-test`:

1. **API Connection Test**: Verify backend connectivity
2. **Examiner Assignment Test**: Test examiner-to-student assignment notification
3. **Project Evaluation Test**: Test project evaluation notification
4. **Progress Submission Test**: Test log/report submission notification
5. **Feedback Received Test**: Test feedback notification
6. **Custom Notification**: Create custom notifications

### Test Commands

```bash
# Test examiner assignment
POST /api/notifications/test/examiner-assignment
{
  "projectId": 1,
  "studentId": 1,
  "examinerId": 2
}

# Test project evaluation
POST /api/notifications/test/project-evaluation
{
  "projectId": 1,
  "examinerId": 2,
  "evaluationResult": "Pass",
  "score": 85
}

# Test progress submission
POST /api/notifications/test/progress-submission
{
  "submissionType": "log",
  "submissionId": 1,
  "studentId": 1,
  "projectId": 1
}

# Test feedback received
POST /api/notifications/test/feedback-received
{
  "feedbackType": "report",
  "feedbackId": 1,
  "reviewerId": 2,
  "targetId": 1
}
```

## Usage Examples

### 1. When Manager Assigns Examiner

```javascript
// In managerController.js
const assignmentId = await managerModel.assignExaminer(projectId, examinerId);
// Notification automatically sent to both student and examiner
```

### 2. When Examiner Evaluates Project

```javascript
// In examinerController.js
const evaluationId = await examinerModel.createEvaluation(
  examinerId,
  projectId,
  feedback,
  grade
);
await notificationModel.notifyProjectEvaluation(
  projectId,
  examinerId,
  "Pass",
  85
);
```

### 3. When Student Submits Progress Log

```javascript
// In studentController.js
const logId = await studentModel.createProgressLog(
  studentId,
  projectId,
  details
);
await notificationModel.notifyProgressSubmissionToSupervisor(
  "log",
  logId,
  studentId,
  projectId
);
```

### 4. When Supervisor Gives Feedback

```javascript
// In supervisorController.js
const feedbackId = await supervisorModel.provideFeedbackOnLog(
  logId,
  supervisorId,
  comments
);
await notificationModel.notifyForFeedbackEvent(feedbackId);
```

## Benefits

1. **Real-time Communication**: Users get instant notifications about relevant events
2. **Improved Workflow**: Clear visibility into project status and required actions
3. **Better User Experience**: Users don't miss important updates
4. **Audit Trail**: Complete record of all notifications sent
5. **Customizable**: Easy to add new notification types as needed

## Future Enhancements

1. **Email Notifications**: Send email for critical notifications
2. **Push Notifications**: Browser push notifications for real-time alerts
3. **Notification Preferences**: User-configurable notification settings
4. **Batch Notifications**: Group related notifications together
5. **Rich Notifications**: Include attachments or rich content

The notification system is now fully functional and integrated across all major workflows in the FYP management system! 🎉
