# Acceptance Tests V1

## Auth and session

### Owner can sign in and reach the app

1. A configured owner signs in through Clerk.
2. The app creates or updates the internal `User` record.
3. The owner lands on the dashboard.
4. `GET /api/me` returns the internal user profile.

### Unauthenticated user is blocked

1. A user visits `/`, `/tasks`, or any `/api` route without a valid session.
2. Page access redirects to sign-in or denies access as appropriate.
3. API access returns `401`.

## Tasks

### Owner can create a task

1. The owner submits a valid task from `/tasks`.
2. The task is stored in the database.
3. The task appears in the task list.
4. An `activity_entries` record is created with `task_created`.

### Owner can create a task without a due date

1. The owner submits a valid task from `/tasks` without a due date.
2. The task is stored in the database with `due_date = null`.
3. The task appears in the task list with a clear undated state.
4. An `activity_entries` record is created with `task_created`.

### Owner can assign a task

1. The owner opens `/tasks/[taskId]`.
2. The owner assigns the task to a valid active owner.
3. The change persists.
4. An `activity_entries` record is created with `task_assigned`.

### Owner can complete and reopen a task

1. The owner marks a task as completed.
2. The task status becomes `completed` and `completed_at` is set.
3. The owner later reopens the task.
4. The task status changes from `completed` and `completed_at` is cleared.
5. Both actions generate activity entries.

### Task validation rejects bad input

1. A request submits an empty task title.
2. The API rejects the request with `422`.
3. No task is created.
4. No activity entry is created.

## Task comments

### Owner can comment on a task

1. The owner opens a task detail page.
2. The owner posts a non-empty comment.
3. The comment is stored in `task_comments`.
4. The comment appears in the task thread in chronological order.
5. An `activity_entries` record is created with `comment_added`.

## Goals

### Owner can create a goal

1. The owner submits a valid goal from `/goals`.
2. The goal is stored in the database.
3. The goal appears in the goals list.
4. An `activity_entries` record is created with `goal_created`.

### Owner can add a goal update

1. The owner opens `/goals/[goalId]`.
2. The owner posts a progress update with a summary and optional metric value.
3. The update is stored in `goal_updates`.
4. The update appears in reverse chronological order or newest-first order if that UI choice is made consistently.
5. An `activity_entries` record is created with `goal_updated`.

## Activity feed

### Activity feed shows recent business events

1. The owner creates a task, comments on it, creates a goal, and posts a goal update.
2. The owner opens `/activity`.
3. The feed shows all resulting activity entries in reverse chronological order.
4. Each item includes actor, action summary, entity type, and timestamp.

## Authorization

### Inactive user is blocked

1. A valid authenticated user has `is_active = false` in the internal `users` table.
2. The user attempts to load protected pages or submit writes.
3. The app denies access with `403` after session validation.

### Non-owner roles remain disabled in V1

1. A user record exists with `manager` or `staff`.
2. The user attempts to access owner-only write flows.
3. The app denies access with `403`.

## Explicit non-goals

The following must not appear in V1:

- direct messaging or chat screens
- inventory pages
- vendor pages
- purchase order pages
- invoice pages
- document upload flows
