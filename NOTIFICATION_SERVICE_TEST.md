# Notification Service Test Script

## Overview

This document demonstrates how to test the notification service that connects the backend and claude-frontend.

## Backend Service Status ✅

- **Backend Server**: Running on `http://localhost:5000`
- **Notification API**: Connected and functional
- **Database Models**: Set up with notification tables
- **Routes**: Configured for all notification endpoints

## Frontend Integration Status ✅

- **React Frontend**: Running on `http://localhost:5174`
- **Notification Service**: Connected to backend API
- **NotificationCenter Component**: Created and functional
- **Dashboard Integration**: Updated Manager and Moderator dashboards

## Test Endpoints

### 1. Health Check

```bash
GET http://localhost:5000/api/health
```

### 2. Test Notification Service (No Auth Required)

```bash
GET http://localhost:5000/api/notifications/test
```

### 3. Get User Notifications (Auth Required)

```bash
GET http://localhost:5000/api/notifications/{userId}?limit=10&onlyUnread=false
Headers: Authorization: Bearer {token}
```

### 4. Mark Notification as Read (Auth Required)

```bash
PATCH http://localhost:5000/api/notifications/{notificationId}/read
Headers: Authorization: Bearer {token}
```

### 5. Create Custom Notification (Manager Only)

```bash
POST http://localhost:5000/api/notifications
Headers: Authorization: Bearer {token}
Body: {
  "userId": 1,
  "eventName": "test_notification",
  "message": "Test message"
}
```

## Frontend Components

### NotificationCenter Component

- **Location**: `src/components/NotificationCenter.jsx`
- **Features**:
  - Fetches notifications from backend
  - Real-time updates
  - Mark as read functionality
  - Event type icons
  - Timestamp formatting
  - Unread count badge

### Updated Dashboards

- **Manager Dashboard**: `src/manager/ManagerDashboard.jsx`
- **Moderator Dashboard**: `src/moderator/ModeratorDashboard.jsx`

### Test Page

- **URL**: `http://localhost:5174/notification-test`
- **Features**:
  - Test API connection
  - Create custom notifications
  - Live notification center demo

## How to Test

1. **Start Backend Server**:

   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend Server**:

   ```bash
   cd claude-frontend/my-react-app
   npm run dev
   ```

3. **Open Test Page**:
   Navigate to `http://localhost:5174/notification-test`

4. **Test Features**:
   - Click "Test Notification API" to verify backend connection
   - View live notifications in the notification center
   - Test different notification types and timestamps

## Key Features Implemented

✅ **Backend Service**

- Express.js server with notification routes
- Database models for notifications and event types
- CORS configuration for frontend integration
- Error handling and logging

✅ **Frontend Integration**

- Reusable NotificationCenter component
- Service layer for API communication
- Real-time notification updates
- Dashboard integration

✅ **User Experience**

- Visual notification indicators
- Unread count badges
- Timestamp formatting (e.g., "2h ago", "3d ago")
- Event-specific icons
- Mark as read functionality

## Production Considerations

For production deployment, ensure:

- Authentication tokens are properly managed
- Database is configured and connected
- Environment variables are set
- CORS origins are properly configured
- Error handling is comprehensive

## Notification Types Supported

- `proposal_submitted` 📝
- `proposal_approved` ✅
- `proposal_rejected` ❌
- `proposal_needs_modification` 🔄
- `deadline_reminder` ⏰
- Custom notification types 📢

The notification service is now fully functional and integrated between the backend and frontend!
