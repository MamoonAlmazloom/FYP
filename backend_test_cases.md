# Backend Test Cases

This document outlines backend test cases for the FYP Management System. Each test case focuses on API interactions, data validation, business logic, and database integrity.

## Assumptions

*   **API Structure:** Endpoints are assumed to be RESTful (e.g., `/users`, `/proposals`). Specific endpoint names are illustrative.
*   **Authentication:** Most endpoints require authentication (e.g., JWT in Authorization header). Tests should cover scenarios with valid, invalid, or missing tokens, and incorrect roles.
*   **Error Responses:** Consistent error response formats are expected (e.g., `{"error": "message", "details": [...]}`).
*   **Database Interactions:** "DB" refers to the application's database. Expected changes in state are described.
*   **Notifications:** Testing focuses on the *triggering* of notification generation, not the actual delivery mechanism (e.g., email/SMS sending). This might involve checking for a "notification created" record or a call to a notification service mock.

---

## F1: User Account Management

### TC-B1.1: User Login
*   **Original Frontend TC-ID:** TC-F1.1
*   **Description:** Verify user login functionality via API.
*   **Assumed Endpoint:** `POST /auth/login`
*   **Request Body (Success):** `{"email": "student@example.com", "password": "validpassword"}`
*   **Steps & Expected Results:**
    1.  **Valid Credentials:**
        *   Send request with valid email and password.
        *   **Expected:** HTTP 200 OK. Response contains auth token (e.g., JWT) and user details (e.g., user ID, role, name).
    2.  **Invalid Credentials (Wrong Password):**
        *   Send request with valid email and invalid password.
        *   **Expected:** HTTP 401 Unauthorized. Error message indicates invalid credentials.
    3.  **Invalid Credentials (User Not Found):**
        *   Send request with non-existent email.
        *   **Expected:** HTTP 401 Unauthorized or HTTP 404 Not Found. Error message indicates user not found or invalid credentials.
    4.  **Missing Fields:**
        *   Send request with missing email or password.
        *   **Expected:** HTTP 400 Bad Request. Error message indicates missing fields.
    5.  **Malformed Email:**
        *   Send request with a malformed email address.
        *   **Expected:** HTTP 400 Bad Request. Error message indicates invalid email format.

### TC-B1.2: User Logout
*   **Original Frontend TC-ID:** TC-F1.2
*   **Description:** Verify user logout functionality via API.
*   **Assumed Endpoint:** `POST /auth/logout` (Requires authentication token)
*   **Steps & Expected Results:**
    1.  **Valid Logout:**
        *   User is logged in (has a valid token). Send request with the token.
        *   **Expected:** HTTP 200 OK or HTTP 204 No Content. Session/token is invalidated (e.g., token added to a blacklist). Subsequent requests with this token should fail.
    2.  **Logout without Token:**
        *   Send request without authentication token.
        *   **Expected:** HTTP 401 Unauthorized.
    3.  **Logout with Invalid/Expired Token:**
        *   Send request with an invalid or expired token.
        *   **Expected:** HTTP 401 Unauthorized.

### TC-B1.3: User Registration
*   **Original Frontend TC-ID:** TC-F1.3
*   **Description:** Verify user registration via API. (Note: Supervisors might be created by admin, this TC focuses on self-registration roles like Student).
*   **Assumed Endpoint:** `POST /users/register`
*   **Request Body (Success - Student):** `{"name": "New Student", "email": "newstudent@example.com", "password": "strongpassword123", "role": "student", "student_id_number": "S12345"}`
*   **Steps & Expected Results:**
    1.  **Successful Registration (Student):**
        *   Send request with valid and complete data for a student.
        *   **Expected:** HTTP 201 Created. Response contains details of the created user (excluding sensitive info like password hash). User record created in DB with correct role and hashed password.
    2.  **Email Already Exists:**
        *   Send request with an email that is already registered.
        *   **Expected:** HTTP 409 Conflict. Error message indicates email already in use.
    3.  **Missing Required Fields:**
        *   Send request with missing `name`, `email`, `password`, or `role`.
        *   **Expected:** HTTP 400 Bad Request. Error messages indicate missing fields.
    4.  **Invalid Email Format:**
        *   Send request with a malformed email.
        *   **Expected:** HTTP 400 Bad Request. Error message indicates invalid email format.
    5.  **Weak Password:**
        *   Send request with a password that doesn't meet complexity requirements (if any).
        *   **Expected:** HTTP 400 Bad Request. Error message indicates password requirements not met.
    6.  **Invalid Role (if applicable for this endpoint):**
        *   Send request with a role that cannot self-register (e.g., "supervisor", "admin" if this endpoint is only for students).
        *   **Expected:** HTTP 400 Bad Request or HTTP 403 Forbidden. Error message indicates invalid role for registration.
    7.  **Student ID Already Exists (if unique constraint):**
        *   Send request with a `student_id_number` that is already in use.
        *   **Expected:** HTTP 409 Conflict. Error message indicates student ID already in use.

### TC-B1.4: Reset Password
*   **Original Frontend TC-ID:** TC-F1.4
*   **Description:** Verify password reset functionality (request and confirmation).

    **Part 1: Request Password Reset Link**
*   **Assumed Endpoint:** `POST /auth/forgot-password`
*   **Request Body:** `{"email": "registeredstudent@example.com"}`
*   **Steps & Expected Results:**
    1.  **Valid Email - User Exists:**
        *   Send request with the email of a registered user.
        *   **Expected:** HTTP 200 OK. A unique, time-limited reset token is generated and stored in DB (associated with the user). An event to trigger a password reset email (containing the token or a link with the token) is initiated.
    2.  **User Not Found:**
        *   Send request with an email that is not registered.
        *   **Expected:** HTTP 404 Not Found (or HTTP 200 OK to prevent user enumeration, but backend logs an issue). Error message (if 404) indicates user not found.
    3.  **Invalid Email Format:**
        *   Send request with a malformed email.
        *   **Expected:** HTTP 400 Bad Request. Error message indicates invalid email format.

    **Part 2: Set New Password using Reset Token**
*   **Assumed Endpoint:** `POST /auth/reset-password`
*   **Request Body:** `{"token": "valid_reset_token_string", "new_password": "newStrongPassword456"}`
*   **Steps & Expected Results:**
    1.  **Valid Token and New Password:**
        *   Send request with a valid, non-expired reset token and a strong new password.
        *   **Expected:** HTTP 200 OK. User's password in DB is updated (hashed). The reset token is invalidated/deleted.
    2.  **Invalid/Expired Token:**
        *   Send request with an invalid or expired token.
        *   **Expected:** HTTP 400 Bad Request or HTTP 401 Unauthorized. Error message indicates invalid/expired token.
    3.  **Weak New Password:**
        *   Send request with a valid token but a password that doesn't meet complexity requirements.
        *   **Expected:** HTTP 400 Bad Request. Error message indicates password requirements not met.
    4.  **Missing Fields:**
        *   Send request with missing `token` or `new_password`.
        *   **Expected:** HTTP 400 Bad Request. Error messages indicate missing fields.
---

## F2: Proposal Management

### TC-B2.1: Submit Project Proposal (Student)
*   **Original Frontend TC-ID:** TC-F2.1
*   **Description:** Verify a student can submit a new project proposal.
*   **Assumed Endpoint:** `POST /proposals` (Requires student role authentication)
*   **Request Body (Success):** `{"title": "New AI Project", "description": "Detailed project plan...", "objectives": "...", "student_id": "current_user_id"}` (student_id might be inferred from token)
*   **Steps & Expected Results:**
    1.  **Successful Submission:**
        *   Student sends request with all required proposal fields.
        *   **Expected:** HTTP 201 Created. Response contains the created proposal with an ID and status "Pending". Proposal record created in DB.
    2.  **Missing Required Fields:**
        *   Send request with missing `title` or `description`.
        *   **Expected:** HTTP 400 Bad Request. Error messages for missing fields.
    3.  **Unauthorized User Role:**
        *   Send request with a token of a non-student user (e.g., supervisor).
        *   **Expected:** HTTP 403 Forbidden.
    4.  **Exceeds Proposal Limit (if any):**
        *   Student attempts to submit a proposal when they already have a max number of active/pending proposals.
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict. Message indicates limit reached.

### TC-B2.2: Review/Approve Proposal (Supervisor)
*   **Original Frontend TC-ID:** TC-F2.2
*   **Description:** Verify a supervisor can review, approve, reject, or request modification for an assigned proposal.
*   **Assumed Endpoint:** `PUT /proposals/{proposal_id}/review` or `PATCH /proposals/{proposal_id}` (Requires supervisor role authentication)
*   **Request Body (Approve):** `{"status": "ApprovedBySupervisor", "feedback": "Looks good."}`
*   **Request Body (Reject):** `{"status": "RejectedBySupervisor", "feedback": "Not feasible."}`
*   **Request Body (Request Modification):** `{"status": "NeedsModificationBySupervisor", "feedback": "Please clarify section 3."}`
*   **Steps & Expected Results (for each action: Approve, Reject, Request Mod):**
    1.  **Successful Action (e.g., Approve):**
        *   Supervisor (assigned to the student/proposal) sends request with valid `proposal_id`, new status, and feedback.
        *   **Expected:** HTTP 200 OK. Proposal status in DB updated. Feedback stored.
    2.  **Proposal Not Found:**
        *   Send request with an invalid `proposal_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Unauthorized Supervisor:**
        *   Send request by a supervisor not assigned/authorized for this proposal.
        *   **Expected:** HTTP 403 Forbidden.
    4.  **Invalid Status Transition:**
        *   Send request with a status transition that is not allowed (e.g., trying to approve an already rejected proposal without proper flow).
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict. Message indicates invalid state change.
    5.  **Missing Feedback (if required for reject/modification):**
        *   Send request to reject or request modification without feedback.
        *   **Expected:** HTTP 400 Bad Request.

### TC-B2.3: Approve Proposal (Moderator)
*   **Original Frontend TC-ID:** TC-F2.3
*   **Description:** Verify a moderator can review, approve, reject, or request modification for a proposal.
*   **Assumed Endpoint:** `PUT /proposals/{proposal_id}/moderate` or `PATCH /proposals/{proposal_id}` (Requires moderator role authentication)
*   **Request Body (Approve):** `{"status": "ApprovedByModerator", "feedback": "Final approval granted."}` (or simply "Approved")
*   **Steps & Expected Results:** Similar to TC-B2.2, but with moderator role and potentially different status transitions (e.g., "ApprovedBySupervisor" -> "Approved").
    1.  **Successful Action (e.g., Approve):**
        *   Moderator sends request for a proposal that is in a state ready for moderation (e.g., "ApprovedBySupervisor").
        *   **Expected:** HTTP 200 OK. Proposal status updated to "Approved" (or "Rejected", "NeedsModificationByModerator"). Feedback stored.
    2.  **Proposal Not Ready for Moderation:**
        *   Moderator attempts to act on a proposal not yet approved by a supervisor.
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict. Message indicates proposal not ready.
    3.  **Other checks:** Proposal Not Found, Unauthorized Moderator (if specific moderators assigned), Invalid Status Transition, Missing Feedback (if required).

### TC-B2.4: View Submitted Proposal (Student)
*   **Original Frontend TC-ID:** TC-F2.4
*   **Description:** Verify a student can view their own submitted proposals.
*   **Assumed Endpoint:** `GET /proposals/my` or `GET /students/{student_id}/proposals` (Requires student role authentication; student_id from token or path)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Student sends request.
        *   **Expected:** HTTP 200 OK. Response contains a list of proposals submitted by this student, including their current status and details.
    2.  **No Proposals Submitted:**
        *   Student has not submitted any proposals.
        *   **Expected:** HTTP 200 OK. Response is an empty list.
    3.  **Attempt to View Other Student's Proposals (if endpoint is specific like `/proposals/my`):**
        *   This should be prevented by using the authenticated user's ID. If `/students/{student_id}/proposals` is used, ensure student can only access their own ID.
        *   **Expected:** (If trying to access other's via manipulated ID and not authorized) HTTP 403 Forbidden.

### TC-B2.5: Select Project from Available List (Student)
*   **Original Frontend TC-ID:** TC-F2.5
*   **Description:** Verify a student can select a project from a list of available projects (those proposed by supervisors/admin).
*   **Assumed Endpoint:** `POST /projects/available/{project_id}/select` (Requires student role authentication)
*   **Request Body (optional):** May not need a body if project_id is in URL and student_id from token.
*   **Steps & Expected Results:**
    1.  **Successful Selection:**
        *   Student sends request for an available project.
        *   **Expected:** HTTP 200 OK or HTTP 201 Created. Project in DB is assigned to the student. Student might now have a "proposal" record linked to this project, or the project status changes.
    2.  **Project Not Found or Not Available:**
        *   Send request with invalid `project_id` or for a project that is not available for selection (e.g., already taken, not approved).
        *   **Expected:** HTTP 404 Not Found or HTTP 400 Bad Request.
    3.  **Student Already Has a Project/Proposal:**
        *   Student attempts to select a project when they already have an active project/proposal (if limit is 1).
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict.
    4.  **Unauthorized User Role:**
        *   Send request with a token of a non-student user.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B2.6: View Proposal Status (Student)
*   **Original Frontend TC-ID:** TC-F2.6
*   **Description:** Verify student can see the current status of their proposals. (Covered by TC-B2.4 - ensure status field is accurate and present).
*   **Note:** This is effectively a data verification aspect of TC-B2.4.

### TC-B2.7: Modify Submitted Proposal (Student)
*   **Original Frontend TC-ID:** TC-F2.7
*   **Description:** Verify a student can edit and resubmit a proposal that requires modification.
*   **Assumed Endpoint:** `PUT /proposals/{proposal_id}` (Requires student role authentication)
*   **Request Body (Success):** `{"title": "Updated AI Project", "description": "Revised project plan...", ...}`
*   **Steps & Expected Results:**
    1.  **Successful Modification:**
        *   Student sends request for their own proposal that has a status like "NeedsModificationBySupervisor" or "NeedsModificationByModerator".
        *   **Expected:** HTTP 200 OK. Proposal details in DB are updated. Status might change to "Pending" or "PendingResubmission".
    2.  **Proposal Not Found:**
        *   Send request with invalid `proposal_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Not Authorized to Modify:**
        *   Student attempts to modify another student's proposal.
        *   **Expected:** HTTP 403 Forbidden.
    4.  **Proposal Not in Modifiable State:**
        *   Student attempts to modify a proposal that is "Approved" or "Pending" (and not marked for modification).
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict. Message indicates proposal cannot be modified in current state.
    5.  **Missing Required Fields (if update makes them missing):**
        *   Send request that removes a required field like `title`.
        *   **Expected:** HTTP 400 Bad Request.

### TC-B2.8: View Project List (Moderator)
*   **Original Frontend TC-ID:** TC-F2.8
*   **Description:** Verify a moderator can see all proposals/projects relevant for moderation.
*   **Assumed Endpoint:** `GET /proposals?status=PendingModeration` or `GET /proposals` (Requires moderator role authentication, with server-side filtering)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Moderator sends request.
        *   **Expected:** HTTP 200 OK. Response contains a list of proposals, potentially filtered by statuses requiring moderator attention (e.g., "ApprovedBySupervisor", "PendingModeratorReview").
    2.  **No Proposals for Moderation:**
        *   No proposals are currently in a state requiring moderator action.
        *   **Expected:** HTTP 200 OK. Response is an empty list.
    3.  **Unauthorized User Role:**
        *   Send request with a token of a non-moderator user.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B2.9: Select Proposal from Project List (Moderator)
*   **Original Frontend TC-ID:** TC-F2.9
*   **Description:** Verify a moderator can view details of a specific proposal.
*   **Assumed Endpoint:** `GET /proposals/{proposal_id}` (Requires moderator role authentication)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Moderator sends request with a valid `proposal_id`.
        *   **Expected:** HTTP 200 OK. Response contains detailed information about the specified proposal.
    2.  **Proposal Not Found:**
        *   Send request with an invalid `proposal_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Unauthorized User Role (if trying to access non-moderator view, though typically moderator sees all):**
        *   **Expected:** HTTP 403 Forbidden (if applicable).

### TC-B2.10: Make Decision on Proposal (Moderator)
*   **Original Frontend TC-ID:** TC-F2.10
*   **Description:** Verify moderator can approve/reject/request modification.
*   **Note:** This is covered by TC-B2.3.

### TC-B2.11: Add Comments to Proposal (Moderator)
*   **Original Frontend TC-ID:** TC-F2.11
*   **Description:** Verify a moderator can add comments to a proposal. (This might be part of the review/moderate action or a separate feature).
*   **Assumed Endpoint:** `POST /proposals/{proposal_id}/comments` (Requires moderator role authentication)
*   **Request Body:** `{"text": "This needs further clarification from the supervisor before I can approve."}`
*   **Steps & Expected Results:**
    1.  **Successful Comment Addition:**
        *   Moderator sends request with valid `proposal_id` and comment text.
        *   **Expected:** HTTP 201 Created. Comment is saved in DB and associated with the proposal and the moderator.
    2.  **Proposal Not Found:**
        *   Send request with an invalid `proposal_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Empty Comment (if not allowed):**
        *   Send request with empty comment text.
        *   **Expected:** HTTP 400 Bad Request.
    4.  **Unauthorized User Role:**
        *   Send request with a token of a non-moderator user.
        *   **Expected:** HTTP 403 Forbidden.
---

## F3: Progress Tracking

### TC-B3.1: Submit Report (Student)
*   **Original Frontend TC-ID:** TC-F3.1
*   **Description:** Verify a student can submit a report.
*   **Assumed Endpoint:** `POST /reports` or `POST /projects/{project_id}/reports` (Requires student role authentication)
*   **Request Body (Success - multipart/form-data):** `{"title": "Midterm Report", "report_file": (file_content), "project_id": "proj123", "milestone_id": "mile456" (optional)}`
*   **Steps & Expected Results:**
    1.  **Successful Submission:**
        *   Student sends request with report title, file, and associated project/milestone ID.
        *   **Expected:** HTTP 201 Created. Report metadata (title, file path/ID, uploader, project_id) stored in DB. File saved to storage. Response includes report details.
    2.  **Missing Required Fields (title, file, project_id):**
        *   Send request missing essential data.
        *   **Expected:** HTTP 400 Bad Request.
    3.  **Invalid File Type/Size (if restrictions apply):**
        *   Send request with a file that exceeds size limits or is of an unsupported type.
        *   **Expected:** HTTP 400 Bad Request. Error message indicates file issue.
    4.  **Project Not Found or Not Authorized:**
        *   Student attempts to submit a report for a project that doesn't exist or isn't theirs.
        *   **Expected:** HTTP 404 Not Found or HTTP 403 Forbidden.
    5.  **Unauthorized User Role:**
        *   Send request with a token of a non-student user.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B3.2: Submit Progress Log (Student)
*   **Original Frontend TC-ID:** TC-F3.2
*   **Description:** Verify a student can fill in and submit a progress log.
*   **Assumed Endpoint:** `POST /progress-logs` or `POST /projects/{project_id}/logs` (Requires student role authentication)
*   **Request Body (Success):** `{"project_id": "proj123", "milestone_id": "mile456", "date": "YYYY-MM-DD", "activity_description": "Worked on X", "hours_spent": 3, "challenges": "None"}`
*   **Steps & Expected Results:**
    1.  **Successful Submission:**
        *   Student sends request with all required log details.
        *   **Expected:** HTTP 201 Created. Log entry saved in DB, linked to project/milestone and student.
    2.  **Missing Required Fields:**
        *   Send request missing `activity_description`, `date`, `project_id`.
        *   **Expected:** HTTP 400 Bad Request.
    3.  **Invalid Data Types (e.g., `hours_spent` not a number):**
        *   Send request with incorrectly formatted data.
        *   **Expected:** HTTP 400 Bad Request.
    4.  **Project Not Found or Not Authorized:**
        *   Student attempts to submit a log for a project that doesn't exist or isn't theirs.
        *   **Expected:** HTTP 404 Not Found or HTTP 403 Forbidden.

### TC-B3.3: Receive Feedback Notification (Student) - Backend Trigger Verification
*   **Original Frontend TC-ID:** TC-F3.3
*   **Description:** Verify that when a supervisor adds feedback to a log/report, a notification generation process is triggered for the student.
*   **Steps & Expected Results:**
    1.  **Supervisor Adds Feedback to Report (see TC-B3.6):**
        *   A supervisor successfully adds feedback to a student's report.
        *   **Expected:** Backend logic should identify the student associated with the report. A new notification record for that student should be created in the DB (e.g., `notifications` table with `user_id`, `message`, `type='feedback_report'`, `is_read=false`) OR a call to a notification microservice/handler is made with relevant details.
    2.  **Supervisor Adds Feedback to Log (see TC-B3.5):**
        *   A supervisor successfully adds feedback/signs a student's progress log.
        *   **Expected:** Similar to report feedback, a notification record/event for the student is generated.

### TC-B3.4: Propose New Project (Supervisor)
*   **Original Frontend TC-ID:** TC-F3.4
*   **Description:** Verify a supervisor can propose a new project to be available for students.
*   **Assumed Endpoint:** `POST /projects` (Requires supervisor role authentication)
*   **Request Body (Success):** `{"title": "New Research Project", "description": "...", "prerequisites": "...", "capacity": 3, "supervisor_id": "current_user_id"}` (supervisor_id might be from token)
*   **Steps & Expected Results:**
    1.  **Successful Project Proposal:**
        *   Supervisor sends request with all required project details.
        *   **Expected:** HTTP 201 Created. Project created in DB with status "Available" or "PendingApproval" (if projects need admin/moderator approval before becoming available). Linked to the supervisor.
    2.  **Missing Required Fields:**
        *   Send request with missing `title` or `description`.
        *   **Expected:** HTTP 400 Bad Request.
    3.  **Unauthorized User Role:**
        *   Send request with a token of a non-supervisor user.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B3.5: Review Feedback on Log (Supervisor)
*   **Original Frontend TC-ID:** TC-F3.5
*   **Description:** Verify a supervisor can add feedback and/or sign a student's progress log.
*   **Assumed Endpoint:** `PUT /progress-logs/{log_id}/review` or `PATCH /progress-logs/{log_id}` (Requires supervisor authentication)
*   **Request Body (Success):** `{"feedback": "Good progress, keep it up.", "is_signed": true}`
*   **Steps & Expected Results:**
    1.  **Successful Review/Feedback:**
        *   Supervisor (assigned to the student/project) sends request for a specific log.
        *   **Expected:** HTTP 200 OK. Feedback and signature status updated in DB for the log. Triggers notification for student (TC-B3.3).
    2.  **Log Not Found:**
        *   Send request with an invalid `log_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Unauthorized Supervisor:**
        *   Supervisor attempts to review a log for a student not under their supervision.
        *   **Expected:** HTTP 403 Forbidden.
    4.  **Log Already Signed/Finalized (if re-feedback is restricted):**
        *   Attempt to add feedback to a log that is in a state that prevents further changes.
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict.

### TC-B3.6: Review Feedback on Reports (Supervisor)
*   **Original Frontend TC-ID:** TC-F3.6
*   **Description:** Verify a supervisor can add feedback to a student's report.
*   **Assumed Endpoint:** `PUT /reports/{report_id}/review` or `PATCH /reports/{report_id}` (Requires supervisor authentication)
*   **Request Body (Success):** `{"feedback": "Well-written report, address comments on page 5.", "grade": "B+" (optional)}`
*   **Steps & Expected Results:**
    1.  **Successful Feedback Addition:**
        *   Supervisor (assigned to the student/project) sends request for a specific report.
        *   **Expected:** HTTP 200 OK. Feedback (and grade, if applicable) stored in DB for the report. Triggers notification for student (TC-B3.3).
    2.  **Report Not Found:**
        *   Send request with an invalid `report_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Unauthorized Supervisor:**
        *   Supervisor attempts to review a report for a student not under their supervision.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B3.7: Access Past Projects (Supervisor)
*   **Original Frontend TC-ID:** TC-F3.7
*   **Description:** Verify a supervisor can access a list of their past/archived projects.
*   **Assumed Endpoint:** `GET /projects/archive` or `GET /projects?supervisor_id={id}&status=archived` (Requires supervisor authentication)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Supervisor (ID from token or param) sends request.
        *   **Expected:** HTTP 200 OK. Response contains a list of projects supervised by this supervisor that have an "Archived" or "Completed" status.
    2.  **No Archived Projects:**
        *   Supervisor has no projects in an archived state.
        *   **Expected:** HTTP 200 OK. Response is an empty list.
    3.  **Unauthorized Access (if trying to access global archive without permission or other supervisor's archive):**
        *   **Expected:** HTTP 403 Forbidden.

### TC-B3.8: View Current Student List (Supervisor)
*   **Original Frontend TC-ID:** TC-F3.8
*   **Description:** Verify a supervisor can view a list of their currently supervised students.
*   **Assumed Endpoint:** `GET /supervisors/{supervisor_id}/students` or `GET /students?supervisor_id={id}&status=active` (Requires supervisor authentication)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Supervisor (ID from token or param) sends request.
        *   **Expected:** HTTP 200 OK. Response contains a list of student details (ID, name, project title) currently assigned to this supervisor with active projects.
    2.  **No Current Students:**
        *   Supervisor has no students currently assigned or with active projects.
        *   **Expected:** HTTP 200 OK. Response is an empty list.

### TC-B3.9: View FYP Report from Previous Project (Supervisor)
*   **Original Frontend TC-ID:** TC-F3.9
*   **Description:** Verify a supervisor can view a specific report from a past/archived project.
*   **Assumed Endpoint:** `GET /reports/{report_id}` (Requires supervisor authentication)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Supervisor requests a `report_id` that belongs to one of their past/archived projects.
        *   **Expected:** HTTP 200 OK. Response contains the report details (metadata, possibly a link to the file). The backend must verify that the supervisor is authorized for the project associated with this report.
    2.  **Report Not Found:**
        *   Send request with an invalid `report_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Unauthorized Access:**
        *   Supervisor attempts to access a report not associated with their supervised projects (past or present).
        *   **Expected:** HTTP 403 Forbidden.
---

## F4: Notifications (Backend Trigger Verification)

**General Note on Notification Tests:** These tests primarily verify that the *conditions* for sending a notification are met and that the backend *initiates* the notification generation process (e.g., creates a notification record in the DB, or calls a notification service). They do not typically test the actual delivery (e.g., email sending).

### TC-B4.1: Proposal Decision Notification (All relevant users)
*   **Original Frontend TC-ID:** TC-F4.1
*   **Description:** Verify notification generation when a proposal's status changes due to a decision.
*   **Triggering Actions:**
    *   Supervisor approves/rejects/requests modification (TC-B2.2).
    *   Moderator approves/rejects/requests modification (TC-B2.3).
*   **Steps & Expected Results:**
    1.  **Supervisor Action (e.g., Approves Proposal):**
        *   A supervisor successfully changes a proposal's status (e.g., to "ApprovedBySupervisor").
        *   **Expected:**
            *   **For Student:** A notification record is created for the student who owns the proposal, indicating the decision and who made it.
            *   **For Moderators (if applicable):** If the new status requires moderator action (e.g., "ApprovedBySupervisor" -> "PendingModeratorReview"), notification records are created for relevant moderators.
    2.  **Moderator Action (e.g., Rejects Proposal):**
        *   A moderator successfully changes a proposal's status (e.g., to "Rejected").
        *   **Expected:**
            *   **For Student:** A notification record is created for the student.
            *   **For Supervisor:** A notification record is created for the student's supervisor.

### TC-B4.2: Deadline Reminder Notification (Student)
*   **Original Frontend TC-ID:** TC-F4.2
*   **Description:** Verify notification generation for approaching submission deadlines. This likely involves a scheduled task/job on the backend.
*   **Assumed Mechanism:** A scheduled job (e.g., daily cron job) that queries for upcoming deadlines.
*   **Assumed Endpoint (for manual trigger/test):** `POST /admin/tasks/trigger-deadline-reminders` (Requires admin/system auth)
*   **Steps & Expected Results:**
    1.  **Setup:**
        *   Ensure there are projects/milestones with deadlines approaching (e.g., within X days, configurable).
        *   Ensure relevant students are associated with these items.
    2.  **Trigger Deadline Check:**
        *   Execute the scheduled task or call the manual trigger endpoint.
        *   **Expected:** For each student with an approaching deadline, a notification record is created in the DB (e.g., `notifications` table with `user_id`, `message` like "Reminder: Report for Project X is due on YYYY-MM-DD", `type='deadline_reminder'`).
    3.  **No Approaching Deadlines:**
        *   Execute task when no deadlines are imminent.
        *   **Expected:** No new reminder notifications are generated.

### TC-B4.3: Supervisor Notification for New Proposal/Report Submission
*   **Original Frontend TC-ID:** TC-F4.3
*   **Description:** Verify notification generation for supervisors when a student submits a new proposal or report.
*   **Triggering Actions:**
    *   Student submits a new proposal (TC-B2.1).
    *   Student submits a new report (TC-B3.1).
*   **Steps & Expected Results:**
    1.  **Student Submits Proposal:**
        *   A student successfully submits a new proposal.
        *   **Expected:** A notification record is created for the student's assigned supervisor (or relevant unassigned supervisors/pool if not yet assigned) indicating a new proposal requires review.
    2.  **Student Submits Report:**
        *   A student successfully submits a new report for their project.
        *   **Expected:** A notification record is created for the student's assigned supervisor indicating a new report has been submitted.

### TC-B4.4: Moderator Notification for Proposals Requiring Review
*   **Original Frontend TC-ID:** TC-F4.4
*   **Description:** Verify notification generation for moderators when a proposal reaches a state requiring their review.
*   **Triggering Actions:**
    *   Proposal status changes to a state like "PendingModeratorReview" or "ApprovedBySupervisor" (often after supervisor action - TC-B2.2).
*   **Steps & Expected Results:**
    1.  **Proposal Ready for Moderation:**
        *   A proposal's status is updated (e.g., by a supervisor) to a state that requires moderator action.
        *   **Expected:** Notification records are created for users with the moderator role (or specific assigned moderators, if applicable) indicating a proposal needs their attention.
---

## F5: Manager Functional Requirements

### TC-B5.1: Assign Examiner (Manager)
*   **Original Frontend TC-ID:** TC-F5.1
*   **Description:** Verify a manager can assign an examiner (likely a supervisor/faculty user) to a project.
*   **Assumed Endpoint:** `POST /projects/{project_id}/assign-examiner` or `PUT /projects/{project_id}/examiner` (Requires manager role authentication)
*   **Request Body:** `{"examiner_user_id": "faculty_user_id_123"}`
*   **Steps & Expected Results:**
    1.  **Successful Assignment:**
        *   Manager sends request with valid `project_id` and `examiner_user_id` (who has a suitable role, e.g., 'supervisor' or 'faculty').
        *   **Expected:** HTTP 200 OK. Project record in DB updated with the assigned examiner's ID.
    2.  **Project Not Found:**
        *   Send request with invalid `project_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Examiner User Not Found or Invalid Role:**
        *   Send request with a non-existent `examiner_user_id` or a user ID that does not have an examinable role.
        *   **Expected:** HTTP 400 Bad Request or HTTP 404 Not Found. Error message indicates issue with examiner ID.
    4.  **Project Not in Assignable State (e.g., not approved yet):**
        *   Manager attempts to assign examiner to a project not yet approved or in a suitable state.
        *   **Expected:** HTTP 400 Bad Request or HTTP 409 Conflict.
    5.  **Unauthorized User Role (non-manager attempting):**
        *   Send request with a token of a non-manager user.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B5.2: Manage Student Eligibility (Manager)
*   **Original Frontend TC-ID:** TC-F5.2
*   **Description:** Verify a manager can add/remove students from an FYP eligibility list.
*   **Assumed Endpoints:**
    *   `POST /admin/eligibility/students` (Requires manager role authentication) - Add student
    *   `DELETE /admin/eligibility/students/{student_user_id}` (Requires manager role authentication) - Remove student
*   **Request Body (Add):** `{"student_user_id": "student_id_to_make_eligible"}` or `{"email": "student_email_to_make_eligible"}`
*   **Steps & Expected Results:**
    1.  **Add Student to Eligibility List:**
        *   Manager sends request with valid student identifier.
        *   **Expected:** HTTP 200 OK or HTTP 201 Created. Student's eligibility status/flag updated in DB, or student added to an eligibility table.
    2.  **Remove Student from Eligibility List:**
        *   Manager sends request with valid student identifier.
        *   **Expected:** HTTP 200 OK or HTTP 204 No Content. Student's eligibility status/flag reverted or removed from eligibility table.
    3.  **Student Not Found (for both add/remove):**
        *   Send request with an invalid/non-existent student identifier.
        *   **Expected:** HTTP 404 Not Found.
    4.  **Student Already Eligible (for add):**
        *   Manager attempts to add an already eligible student.
        *   **Expected:** HTTP 409 Conflict or HTTP 200 OK (idempotent).
    5.  **Student Not Eligible (for remove):**
        *   Manager attempts to remove a student who is not currently on the eligibility list.
        *   **Expected:** HTTP 404 Not Found or HTTP 200 OK (idempotent).
    6.  **Unauthorized User Role:**
        *   Send request to either endpoint with a non-manager token.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B5.3: Assign Moderators to Projects (Manager)
*   **Original Frontend TC-ID:** TC-F5.3
*   **Description:** Verify a manager can assign a moderator (user with moderator role) to a project or a set of projects (e.g., by department).
*   **Assumed Endpoint:** `POST /projects/{project_id}/assign-moderator` or `PUT /projects/{project_id}/moderator` (Requires manager role authentication)
*   **Request Body:** `{"moderator_user_id": "moderator_id_456"}`
*   **Steps & Expected Results:**
    1.  **Successful Assignment:**
        *   Manager sends request with valid `project_id` and `moderator_user_id` (who has 'moderator' role).
        *   **Expected:** HTTP 200 OK. Project record in DB updated with assigned moderator.
    2.  **Project Not Found:**
        *   Send request with invalid `project_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Moderator User Not Found or Invalid Role:**
        *   Send request with non-existent `moderator_user_id` or a user not in moderator role.
        *   **Expected:** HTTP 400 Bad Request or HTTP 404 Not Found.
    4.  **Unauthorized User Role:**
        *   Send request with non-manager token.
        *   **Expected:** HTTP 403 Forbidden.
    *Alternative: Assigning moderator to a category/department might be a different endpoint like `POST /admin/departments/{dept_id}/moderators`*

### TC-B5.4: View/Manage Approved Projects (Manager)
*   **Original Frontend TC-ID:** TC-F5.4
*   **Description:** Verify a manager can view a list of all approved projects and potentially manage them (e.g., archive, unapprove - though unapprove might be rare).
*   **Assumed Endpoints:**
    *   View: `GET /projects?status=Approved` (Requires manager role authentication)
    *   Manage (e.g., Archive): `POST /projects/{project_id}/archive` (Requires manager role authentication)
    *   Manage (e.g., Change Status): `PUT /projects/{project_id}/status` (Requires manager role authentication)
*   **Request Body (Change Status):** `{"status": "Archived"}` or `{"status": "Pending"}` (if unapproving)
*   **Steps & Expected Results:**
    1.  **View Approved Projects:**
        *   Manager sends GET request.
        *   **Expected:** HTTP 200 OK. Response contains a list of all projects with "Approved" status.
    2.  **Archive an Approved Project:**
        *   Manager sends POST request to archive endpoint for an approved project.
        *   **Expected:** HTTP 200 OK. Project status in DB changed to "Archived".
    3.  **Change Project Status (e.g., Unapprove - if allowed):**
        *   Manager sends PUT request to change status (e.g., back to "Pending" or a special "Unapproved" status).
        *   **Expected:** HTTP 200 OK. Project status updated. Consider implications (e.g., notifications).
    4.  **Project Not Found (for manage actions):**
        *   Send request with invalid `project_id`.
        *   **Expected:** HTTP 404 Not Found.
    5.  **Invalid Status Transition (for manage actions):**
        *   Attempting to change status to an invalid state.
        *   **Expected:** HTTP 400 Bad Request.
    6.  **Unauthorized User Role:**
        *   Send request to any endpoint with non-manager token.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B5.5: View Student Logs (Manager)
*   **Original Frontend TC-ID:** TC-F5.5
*   **Description:** Verify a manager can view progress logs for any student.
*   **Assumed Endpoint:** `GET /students/{student_id}/progress-logs` or `GET /progress-logs?student_id={student_id}` (Requires manager role authentication)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Manager sends request with a valid `student_id`.
        *   **Expected:** HTTP 200 OK. Response contains a list of all progress logs for the specified student.
    2.  **Student Not Found:**
        *   Send request with an invalid `student_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Student Has No Logs:**
        *   Student exists but has not submitted any logs.
        *   **Expected:** HTTP 200 OK. Response is an empty list.
    4.  **Unauthorized User Role:**
        *   Send request with non-manager token.
        *   **Expected:** HTTP 403 Forbidden.

### TC-B5.6: View Student Reports (Manager)
*   **Original Frontend TC-ID:** TC-F5.6
*   **Description:** Verify a manager can view reports submitted by any student.
*   **Assumed Endpoint:** `GET /students/{student_id}/reports` or `GET /reports?student_id={student_id}` (Requires manager role authentication)
*   **Steps & Expected Results:**
    1.  **Successful Retrieval:**
        *   Manager sends request with a valid `student_id`.
        *   **Expected:** HTTP 200 OK. Response contains a list of all reports (metadata, links to files) for the specified student.
    2.  **Student Not Found:**
        *   Send request with an invalid `student_id`.
        *   **Expected:** HTTP 404 Not Found.
    3.  **Student Has No Reports:**
        *   Student exists but has not submitted any reports.
        *   **Expected:** HTTP 200 OK. Response is an empty list.
    4.  **Unauthorized User Role:**
        *   Send request with non-manager token.
        *   **Expected:** HTTP 403 Forbidden.
---
