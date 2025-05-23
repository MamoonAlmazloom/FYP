# FYP Management System - Backend

This repository contains the backend implementation for the Final Year Project (FYP) Management System, designed to streamline the process of managing final year projects at educational institutions.

## Project Structure

The backend follows an MVC architecture with the following components:

- **Routes**: Define API endpoints for different user roles
- **Controllers**: Handle request processing and business logic
- **Models**: Manage database operations and data validation

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MySQL**: Database management system
- **JWT**: Authentication mechanism
- **bcrypt**: Password hashing

## API Endpoints

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students/:studentId | Get student profile |
| GET | /api/students/:studentId/proposals | List all proposals for a student |
| POST | /api/students/:studentId/proposals | Submit a new proposal |
| PUT | /api/students/:studentId/proposals/:proposalId | Update a proposal |
| GET | /api/students/:studentId/proposals/:proposalId/status | Get proposal status |
| GET | /api/students/:studentId/progress-logs | Get all progress logs |
| POST | /api/students/:studentId/progress-logs | Submit a new progress log |
| GET | /api/students/:studentId/progress-reports | Get all progress reports |
| POST | /api/students/:studentId/progress-reports | Submit a new progress report |
| GET | /api/students/:studentId/available-projects | Get available projects for selection |
| POST | /api/students/:studentId/select-project | Select a project from available list |
| GET | /api/students/:studentId/feedback | Get feedback for a student |

### Supervisor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/supervisors/:supervisorId/proposals | List all proposals assigned to supervisor |
| POST | /api/supervisors/:supervisorId/proposal-decision/:proposalId | Submit decision on a proposal |
| GET | /api/supervisors/:supervisorId/students | List all students under supervision |
| GET | /api/supervisors/:supervisorId/student-progress/:studentId | Track student progress |
| POST | /api/supervisors/:supervisorId/feedback | Provide feedback |
| POST | /api/supervisors/:supervisorId/projects | Propose new projects |

### Moderator Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/moderators/:moderatorId/proposals | List all proposals for review |
| POST | /api/moderators/:moderatorId/proposal-decision/:proposalId | Submit decision on a proposal |
| POST | /api/moderators/:moderatorId/feedback | Provide feedback |
| GET | /api/moderators/:moderatorId/approved-projects | List all approved projects |

### Manager Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/managers/:managerId/students | List all students for eligibility management |
| PUT | /api/managers/:managerId/user-eligibility/:userId | Update user eligibility |
| POST | /api/managers/:managerId/register-user | Register a new user |
| POST | /api/managers/:managerId/assign-examiner | Assign examiner to a project |
| GET | /api/managers/:managerId/approved-projects | List approved projects |
| GET | /api/managers/:managerId/student-logs/:studentId | View student logs |

### Examiner Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/examiners/:examinerId/assigned-projects | List projects assigned for examination |
| GET | /api/examiners/:examinerId/project-details/:projectId | Get project details |
| POST | /api/examiners/:examinerId/examination-feedback/:projectId | Provide examination feedback |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
cd fyp-management-system-backend
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=fyp
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Start the development server
```bash
npm run dev
```

## Implementation Status

- ✅ Student functionality (fully implemented)
- ⚠️ Supervisor functionality (routes defined, implementation pending)
- ⚠️ Moderator functionality (routes defined, implementation pending)
- ⚠️ Manager functionality (routes defined, implementation pending)
- ⚠️ Examiner functionality (routes defined, implementation pending)

## Next Steps

1. Complete the implementation of supervisor, moderator, manager, and examiner controllers and models
2. Implement JWT-based authentication
3. Add file upload functionality for documents and reports
4. Implement real-time notifications

## License

This project is licensed under the MIT License.