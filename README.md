# FYP Management System

A comprehensive web-based Final Year Project Management System designed to streamline and automate the entire FYP lifecycle for academic institutions.

## 📋 Project Overview

The FYP Management System is a full-stack application that addresses the challenges faced by universities in managing student projects, supervisor allocations, progress tracking, and evaluation. It provides a centralized platform for efficient project oversight from initial proposal submission to final report submission and grading.

**Developer:** Mamoon T. M. Almazloom  
**Student ID:** 1211304501  
**Institution:** Multimedia University, Malaysia  
**Program:** Bachelor of Computer Science (Software Engineering)  
**Project ID:** FYP02-SE-T2510-0080

 ![Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![Build](https://img.shields.io/badge/Build-Passing-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## ✨ Key Features

- **Multi-Role Authentication**: Secure role-based access for Students, Supervisors, Managers, Moderators, and Examiners
- **Proposal Management**: Complete lifecycle management from submission to approval
- **Progress Tracking**: Weekly logs and monthly reports with supervisor feedback
- **User Management**: Administrative tools for user registration and eligibility management
- **Notification System**: Real-time alerts for proposal status, feedback, and deadlines
- **Project Archive**: Historical project database for reference and quality assurance

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS (core utilities only)
- **Routing**: React Router
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Session Management**: express-session
- **CORS**: cors middleware

### Database
- **DBMS**: MySQL
- **Driver**: mysql2 with Promises support

### Testing
- **Framework**: Jest
- **API Testing**: Postman

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL (v8.0 or higher)

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE fyp_management;
```

2. Import the database schema (located in `/Backend/database/schema.sql`)

3. Configure database connection in `/Backend/config/database.js`

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with:
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=fyp_management
# JWT_SECRET=your_secret_key
# PORT=5000

# Start the server
npm run start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd claude-frontend/my-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🚀 Running the Application

### Development Mode

1. **Start the Backend:**
```bash
cd Backend
npm run start
```

2. **Start the Frontend** (in a new terminal):
```bash
cd claude-frontend/my-react-app
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
# Build frontend
cd claude-frontend/my-react-app
npm run build

# The built files will be in the 'dist' directory
```

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Submit proposals, track progress, submit logs/reports, view feedback |
| **Supervisor** | Review proposals, provide feedback, monitor student progress, propose projects |
| **Moderator** | Final approval of proposals, view project archives |
| **Manager** | User management, examiner assignment, system oversight |
| **Examiner** | View assigned projects, submit evaluations |

## 📁 Project Structure

```
FYPimplenmentation/
├── Backend/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   ├── config/         # Configuration files
│   └── tests/          # Jest test files
│
└── claude-frontend/
    └── my-react-app/
        ├── src/
        │   ├── components/  # React components
        │   ├── API/        # API integration
        │   ├── context/    # React Context (Auth)
        │   └── pages/      # Page components
        └── public/         # Static assets
```

## 🧪 Testing

### Backend Tests

```bash
cd Backend
npm test
```

Test coverage includes:
- Authentication (login, logout)
- Proposal management
- Progress logs and reports
- User management
- Manager functions

### Frontend Tests

```bash
cd claude-frontend/my-react-app
npm test
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-Based Access Control (RBAC)
- Input validation and sanitization
- HTTPS configuration ready
- Protected API endpoints

## 📊 Database Schema

Key entities:
- Users (with role assignments)
- Projects
- Proposals
- Progress Logs
- Progress Reports
- Feedback
- Notifications

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password recovery

### Students
- `POST /api/students/:studentId/proposals` - Submit proposal
- `GET /api/students/available-projects` - View available projects
- `POST /api/students/:studentId/progress-logs` - Submit progress log

### Supervisors
- `GET /api/supervisors/:supervisorId/proposals` - View proposals
- `POST /api/supervisors/:supervisorId/proposals/:proposalId/decision` - Approve/reject
- `GET /api/supervisors/:supervisorId/students` - View assigned students

### Managers
- `POST /api/managers/register` - Register new user
- `PUT /api/managers/users/:userId/eligibility` - Manage eligibility
- `POST /api/managers/assign-examiner` - Assign examiner

## 🤝 Contributing

This is an academic project. For any inquiries or suggestions, please contact the developer.

## 📄 License

This project is submitted as part of academic requirements at Multimedia University.

## 📞 Contact

**Developer:** Mamoon T. M. Almazloom,  linkedin: MamoonAlmazloom
**Supervisor:** Sharaf El-Deen Sami Mohammed Al-Horani  
**Institution:** Multimedia University, Faculty of Computing and Informatics

## 🙏 Acknowledgments

Special thanks to:
- Supervisor Sharaf El-Deen Sami Mohammed Al-Horani for guidance and support
- Multimedia University for providing resources and opportunities
- Family for their unwavering support

---

**Project Completion:** February 2025  

**Status:** ✅ Completed and Tested

**Project grade by Universty**: A+


