# Deadline Notification System

This system handles automatic notifications for upcoming deadlines in the FYP Management application.

## Features

- Automatically checks for upcoming deadlines daily
- Sends notifications to students at 1, 3, and 7 days before deadlines
- Supports multiple types of deadlines (progress logs, reports, etc.)
- Provides API endpoints for manual checking and listing deadlines
- Includes test routes for development

## Components

### Models

- **`deadlineModel.js`**: Core functionality for finding and processing upcoming deadlines
- **`notificationModel.js`**: Handles creating and sending notifications

### Controllers and Routes

- **`deadlineController.js`** & **`deadlineRoutes.js`**: API endpoints for deadline management
- **`notificationController.js`** & **`notificationRoutes.js`**: API endpoints for notification management

### Scheduler

- **`scheduler.js`**: Script for running deadline checks
- Can be run manually, through app initialization, or via a cron job
- Integrated with main app.js for automatic daily checks

### Database

- Uses the existing `Progress_Log` and `Progress_Report` tables
- Requires the Event_Type and Notification tables (set up in notifications-setup.sql)
- Additional indexes added in deadline-setup.sql

## Usage

### Automatic Checking

The system runs in two ways:

1. Automatic daily check when the server is running
2. Configurable through external cron jobs for reliability

### Manual API Endpoints

- `POST /api/deadlines/process`: Manually trigger deadline notification processing
- `GET /api/deadlines/upcoming`: View a list of upcoming deadlines

## Setup

1. Run the SQL script to set up tables and indexes:

```
mysql -u username -p database_name < deadline-setup.sql
```

2. If using cron jobs, configure according to deadline-scheduler-setup.txt

## Testing

1. Use VSCode REST Client to execute requests in `test/deadline.http`
2. In development mode, use `POST /api/test/deadline-notification` to create test notifications

## Future Improvements

- Create a dedicated `Project_Deadline` table for better deadline management
- Add configurable reminder preferences for students
- Support for more deadline types (final submission, presentations, etc.)
