# Technical Spec V1

## Objective

Build the first working version of Coffee Ops Hub as an owner-first internal web application focused on shared tasks, work-item comments, shared goals, goal updates, and a recent activity feed.

V1 is intentionally narrow. It should establish the durable collaboration foundation that later inventory, purchasing, vendor, and invoice modules can build on.

## Chosen stack

- Framework: Next.js with the App Router
- Language: TypeScript
- UI approach: server-rendered application shell with targeted client components for forms and interactive updates
- Database: PostgreSQL
- ORM: Prisma ORM
- Authentication: Clerk
- Authorization: app-managed role checks backed by the internal `User` table

## Why this stack

- Next.js supports a full-stack web application in one codebase and fits the owner dashboard style of product
- The App Router is the forward path for modern Next.js features
- PostgreSQL gives a reliable relational model for tasks, comments, goals, and future operational modules
- Prisma keeps schema, migrations, and data access strongly typed
- Clerk reduces the amount of custom authentication work while still allowing app-owned roles and permissions

## Application architecture

### Frontend

- Use the Next.js App Router for all pages
- Use Server Components by default for page-level reads
- Use Client Components only where local interaction is needed, such as forms, optimistic UI, and live state changes
- Keep the UI modular by feature area: dashboard, tasks, goals, activity, and settings

### Backend

- Implement data writes through Next.js Route Handlers under `/api`
- Use JSON request and response bodies for all V1 API routes
- Keep validation at the route boundary before database writes
- Centralize authorization checks in reusable server-side helpers
- Every successful write that changes business state must create a corresponding `ActivityEntry`

### Data layer

- Use Prisma as the single database access layer
- Keep all business entities in one PostgreSQL database
- Use explicit foreign keys and indexes for all relational links
- Use soft future-compatibility design for later modules by keeping stable IDs and consistent audit fields

### Authentication and user bootstrap

- Use Clerk as the external authentication provider
- On a valid session, upsert the internal `User` record by matching Clerk user identity to an internal `auth_subject`
- All business authorization decisions must use the internal user record, not direct provider role data

## V1 feature set

### Included

- owner sign-in
- dashboard summary
- task list
- task detail view
- task creation
- optional task due dates
- task assignment
- task status updates
- task comments
- goals list
- goal detail view
- goal creation
- goal progress updates
- recent activity feed
- basic owner profile view

### Excluded

- direct chat
- staff-facing workflows
- inventory management UI
- vendor management UI
- purchasing and PO creation
- invoice management
- file uploads and document storage

## Role model

### `owner`

- Full access to all V1 pages and actions
- Can create, edit, assign, complete, and comment on tasks
- Can create goals and post updates
- Can view all activity
- Can manage user activation for future expansion

### `manager`

- Reserved in schema only
- Not enabled in V1 UI
- No seeded access in first launch

### `staff`

- Reserved in schema only
- Not enabled in V1 UI
- No seeded access in first launch

## API design rules

- Use route groupings by entity
- Return JSON only
- Return normalized IDs and timestamps in every entity response
- Reject unauthorized requests before any database access beyond session lookup
- Reject invalid payloads with field-level validation errors
- Use consistent error shapes for all V1 endpoints

## Error handling rules

- Unauthenticated requests return `401`
- Authenticated but unauthorized requests return `403`
- Missing records return `404`
- Validation failures return `422`
- Unexpected server failures return `500`

## Audit requirements

Every mutation that changes a task, task comment, goal, or goal update must create an `ActivityEntry` that captures:

- acting internal user
- affected entity type
- affected entity id
- action type
- short human-readable summary
- timestamp

## Non-functional requirements

- The application must prioritize clarity and speed over decorative complexity
- The first build should remain simple enough for local owner use while preserving clean production architecture
- The codebase should remain organized by feature module instead of by technical layer only
- Database design must remain compatible with future inventory and purchasing modules

## Implementation order

1. Scaffold the Next.js application and TypeScript project
2. Integrate Clerk authentication
3. Configure PostgreSQL and Prisma
4. Implement internal user bootstrap and role checks
5. Build task APIs and task UI
6. Build goal APIs and goal UI
7. Build activity feed
8. Add dashboard summary and settings shell
