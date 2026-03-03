# Workflows

## Collaboration model

Version 1 communication is attached to work items. The app should support comments on tasks and updates on goals rather than standalone chat or direct messaging.

## Create task

1. A user creates a task with a title, optional description, priority, and optional due date.
2. The system records the creator and timestamps.
3. The system adds an activity entry for task creation.

## Assign or self-own task

1. The creator assigns the task to themselves or another user.
2. The task status remains open unless explicitly changed.
3. The system records the assignment change in the activity feed.

## Comment on a task

1. A user opens a task.
2. The user adds a comment tied to that task.
3. The comment is stored as a `TaskComment`.
4. The system adds an activity entry so recent collaboration is visible.

## Mark task complete

1. The assignee or an owner marks the task complete.
2. The system records `completed_at`.
3. The task is retained for history and recent activity.

## Create goal

1. A user creates a goal with a title, description, target, and optional target date.
2. The system records the owner of the goal.
3. The system creates an activity entry for the new goal.

## Post progress update on a goal

1. A user opens the goal.
2. The user records a progress note and optional metric value.
3. The system stores the update as a `GoalUpdate`.
4. The system adds an activity entry for the update.

## Review recent activity between owners

1. Owners open a shared recent activity view.
2. The view shows meaningful actions across tasks, comments, goals, and updates in reverse chronological order.
3. The feed is used to stay aligned without needing a separate chat stream.

