# App Map V1

## Navigation structure

Primary navigation should include:

- Dashboard
- Tasks
- Goals
- Activity
- Settings

The first release should keep navigation shallow and operational.

## Page routes

### `/`

Purpose: owner dashboard.

Content:

- tasks due soon
- open task counts by status
- active goals snapshot
- latest activity preview

### `/tasks`

Purpose: primary task management screen.

Content:

- task list
- filters by status, priority, assignee, and optional due date state
- create task action
- task creation must allow saving without a due date

### `/tasks/[taskId]`

Purpose: task detail and collaboration screen.

Content:

- task metadata
- edit task fields
- assignment controls
- status controls
- comment thread

### `/goals`

Purpose: goal overview screen.

Content:

- active and completed goals
- create goal action
- goal status summary

### `/goals/[goalId]`

Purpose: goal detail and update history.

Content:

- goal metadata
- progress history
- add update action
- status controls

### `/activity`

Purpose: full recent activity feed.

Content:

- reverse-chronological activity list
- filters by entity type and actor

### `/settings`

Purpose: basic owner-only settings shell.

Content:

- current user profile summary
- future placeholder for user and role management

### `/sign-in`

Purpose: authentication entry route handled by Clerk.

## Route handler map

### `POST /api/tasks`

Create a task.

### `GET /api/tasks`

Return task list data with supported filters.

### `GET /api/tasks/[taskId]`

Return a single task and its comment thread.

### `PATCH /api/tasks/[taskId]`

Update editable task fields, including assignment and status changes.

### `POST /api/tasks/[taskId]/comments`

Add a task comment.

### `POST /api/goals`

Create a goal.

### `GET /api/goals`

Return goal list data.

### `GET /api/goals/[goalId]`

Return a single goal and its update history.

### `PATCH /api/goals/[goalId]`

Update goal metadata or status.

### `POST /api/goals/[goalId]/updates`

Add a goal update.

### `GET /api/activity`

Return recent activity data with filter support.

### `GET /api/me`

Return the current internal user profile after session validation.

## Feature boundaries

- Build tasks as the first complete module
- Build goals as the second complete module
- Build activity as the third module once task and goal mutations are stable
- Keep settings minimal in V1
- Do not add a notes page in V1, even though the `notes` entity exists in the longer-term schema plan

## UI composition rules

- Reuse list, detail, form, and activity components across feature areas where possible
- Keep comments embedded inside the task detail page
- Keep goal updates embedded inside the goal detail page
- Avoid separate messaging surfaces in V1
