# Domain Model

## Core planning entities

### `User`

- Purpose: represents a person who uses the system
- Core fields: `id`, `display_name`, `email`, `role`, `is_active`, `created_at`, `updated_at`
- Ownership rules: users manage their own identity details within their permissions; elevated roles manage access
- Relationships: owns tasks, comments, goal updates, notes, and activity entries as an actor
- Future notes: role design should support owner-first access with later staff expansion

### `Task`

- Purpose: tracks a unit of work that needs action
- Core fields: `id`, `title`, `description`, `status`, `priority`, `due_date`, `created_by_user_id`, `assigned_to_user_id`, `completed_at`, `created_at`, `updated_at`
- Ownership rules: creator can define the task; assigned user is responsible for execution; owners can reassign or close
- Relationships: belongs to a creator, may belong to an assignee, has many `TaskComment` records, can generate `ActivityEntry` records
- Future notes: may later link to vendors, inventory items, or purchase orders

### `TaskComment`

- Purpose: stores discussion tied directly to a task
- Core fields: `id`, `task_id`, `author_user_id`, `body`, `created_at`, `updated_at`
- Ownership rules: author controls the comment content subject to system rules; owners can moderate if needed
- Relationships: belongs to one `Task` and one `User`
- Future notes: this is the first communication model and replaces standalone chat in V1

### `Goal`

- Purpose: tracks a defined business objective over time
- Core fields: `id`, `title`, `description`, `status`, `target_metric`, `target_value`, `target_date`, `owner_user_id`, `created_at`, `updated_at`
- Ownership rules: the goal owner maintains the objective; owners can create and update shared goals
- Relationships: belongs to a `User`, has many `GoalUpdate` records, can generate `ActivityEntry` records
- Future notes: later versions may connect goals to spending, inventory, or revenue metrics

### `GoalUpdate`

- Purpose: records progress notes or metric changes for a goal
- Core fields: `id`, `goal_id`, `author_user_id`, `summary`, `metric_value`, `created_at`
- Ownership rules: update author owns the entry; owners can review and manage visibility
- Relationships: belongs to one `Goal` and one `User`
- Future notes: should preserve a chronological history of progress

### `Note`

- Purpose: captures structured internal notes that do not belong to a task or goal
- Core fields: `id`, `title`, `body`, `created_by_user_id`, `visibility_scope`, `created_at`, `updated_at`
- Ownership rules: creator owns the note within the visibility rules
- Relationships: belongs to one `User`; may generate `ActivityEntry` records
- Future notes: can evolve into a lightweight knowledge base for operations

### `ActivityEntry`

- Purpose: provides an audit-style feed of recent actions
- Core fields: `id`, `actor_user_id`, `entity_type`, `entity_id`, `action_type`, `summary`, `created_at`
- Ownership rules: system-generated based on business actions
- Relationships: belongs to an acting `User`; references other entities by type and id
- Future notes: should become the backbone of visibility and accountability across modules

## Deferred but planned entities

### `InventoryItem`

- Purpose: represents a stock-managed item such as cups, lids, beans, syrups, or dry goods
- Core fields: `id`, `name`, `sku`, `unit`, `par_level`, `on_hand_quantity`, `vendor_id`, `created_at`, `updated_at`
- Ownership rules: managed by owners initially, with later delegated access
- Relationships: may belong to a `Vendor`; may later connect to purchase orders and storage locations
- Future notes: deferred from V1 but must remain compatible with the task system

### `Vendor`

- Purpose: stores supplier information and purchasing context
- Core fields: `id`, `name`, `contact_name`, `email`, `phone`, `lead_time_days`, `notes`, `created_at`, `updated_at`
- Ownership rules: maintained by owners and later procurement-capable staff
- Relationships: has many `InventoryItem`, `PurchaseOrder`, and `Invoice` records
- Future notes: deferred from V1 but central to later purchasing workflows

### `PurchaseOrder`

- Purpose: tracks an order placed with a vendor
- Core fields: `id`, `vendor_id`, `po_number`, `status`, `order_date`, `expected_date`, `total_amount`, `created_by_user_id`, `created_at`, `updated_at`
- Ownership rules: created and managed by authorized users
- Relationships: belongs to a `Vendor` and a `User`; will later link to inventory items and invoices
- Future notes: deferred from V1 but a major later operational module

### `Invoice`

- Purpose: records vendor billing and payment-related documents
- Core fields: `id`, `vendor_id`, `invoice_number`, `status`, `invoice_date`, `due_date`, `amount`, `document_ref`, `created_at`, `updated_at`
- Ownership rules: maintained by authorized users with finance visibility
- Relationships: belongs to a `Vendor`; may later link to purchase orders and receipts
- Future notes: deferred from V1 but required for finance support

