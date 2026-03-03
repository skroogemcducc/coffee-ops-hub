# Schema V1

## Database standard

- Database engine: PostgreSQL
- Primary key strategy: UUID for all internal tables
- Timestamp standard: `timestamptz`
- Audit fields: use `created_at` everywhere and `updated_at` on mutable records

## Enums

### `user_role`

- `owner`
- `manager`
- `staff`

### `task_status`

- `open`
- `in_progress`
- `blocked`
- `completed`
- `archived`

### `task_priority`

- `low`
- `medium`
- `high`
- `urgent`

### `goal_status`

- `active`
- `paused`
- `completed`
- `cancelled`

### `activity_entity_type`

- `task`
- `task_comment`
- `goal`
- `goal_update`
- `note`

### `activity_action_type`

- `task_created`
- `task_updated`
- `task_assigned`
- `task_completed`
- `task_reopened`
- `comment_added`
- `goal_created`
- `goal_updated`
- `goal_status_changed`
- `note_created`
- `note_updated`

## Tables

### `users`

Purpose: internal user record used for roles, ownership, and business logic.

Fields:

- `id` UUID primary key
- `auth_provider` text not null default `clerk`
- `auth_subject` text not null unique
- `email` text not null unique
- `display_name` text not null
- `role` `user_role` not null default `owner`
- `is_active` boolean not null default `true`
- `last_seen_at` timestamptz null
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

Indexes:

- unique index on `auth_subject`
- unique index on `email`
- index on `role`
- index on `is_active`

### `tasks`

Purpose: stores work items that require action.

Fields:

- `id` UUID primary key
- `title` text not null
- `description` text null
- `status` `task_status` not null default `open`
- `priority` `task_priority` not null default `medium`
- `due_date` date null
- `created_by_user_id` UUID not null references `users(id)`
- `assigned_to_user_id` UUID null references `users(id)`
- `completed_at` timestamptz null
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

Indexes:

- index on `status`
- index on `priority`
- index on `due_date`
- index on `created_by_user_id`
- index on `assigned_to_user_id`

Constraints:

- if `status = completed`, `completed_at` should be populated
- if `status != completed`, `completed_at` should be null

### `task_comments`

Purpose: task-linked communication only. This is the V1 replacement for chat.

Fields:

- `id` UUID primary key
- `task_id` UUID not null references `tasks(id)` on delete cascade
- `author_user_id` UUID not null references `users(id)`
- `body` text not null
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

Indexes:

- index on `task_id`
- index on `author_user_id`
- index on `created_at`

### `goals`

Purpose: stores business goals shared between owners.

Fields:

- `id` UUID primary key
- `title` text not null
- `description` text null
- `status` `goal_status` not null default `active`
- `target_metric` text null
- `target_value` numeric(14,2) null
- `target_date` date null
- `owner_user_id` UUID not null references `users(id)`
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

Indexes:

- index on `status`
- index on `target_date`
- index on `owner_user_id`

### `goal_updates`

Purpose: stores progress entries for a goal.

Fields:

- `id` UUID primary key
- `goal_id` UUID not null references `goals(id)` on delete cascade
- `author_user_id` UUID not null references `users(id)`
- `summary` text not null
- `metric_value` numeric(14,2) null
- `created_at` timestamptz not null

Indexes:

- index on `goal_id`
- index on `author_user_id`
- index on `created_at`

### `notes`

Purpose: reserved for future structured notes. Keep the table in the schema design, but do not build V1 UI against it yet.

Fields:

- `id` UUID primary key
- `title` text not null
- `body` text not null
- `created_by_user_id` UUID not null references `users(id)`
- `visibility_scope` text not null default `owners`
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

Indexes:

- index on `created_by_user_id`
- index on `visibility_scope`

### `activity_entries`

Purpose: immutable audit-style feed of meaningful business actions.

Fields:

- `id` UUID primary key
- `actor_user_id` UUID not null references `users(id)`
- `entity_type` `activity_entity_type` not null
- `entity_id` UUID not null
- `action_type` `activity_action_type` not null
- `summary` text not null
- `metadata_json` jsonb not null default `'{}'::jsonb`
- `created_at` timestamptz not null

Indexes:

- index on `actor_user_id`
- index on `entity_type`
- index on `entity_id`
- index on `action_type`
- index on `created_at`
- composite index on `entity_type, entity_id`

## V1 write rules

- Every task create, update, assignment change, completion, and reopen action writes an `activity_entries` row
- Every task comment insert writes an `activity_entries` row
- Every goal create, update, status change, and goal update insert writes an `activity_entries` row
- `activity_entries` is append-only in V1

## Deferred schema areas

These tables should not be implemented in the first migration, but the naming and relationships above should remain compatible with adding:

- `inventory_items`
- `vendors`
- `purchase_orders`
- `purchase_order_lines`
- `invoices`
- `storage_locations`

