# Architecture Notes

## Product direction

This should be built as a real web application with structured data, authentication, and durable records. It should not be treated as a larger spreadsheet or a loose collection of documents.

## User model

The first release is owner-first, but the architecture should support role expansion later. The system should be designed so staff access can be added without reworking the core model.

## Required platform capabilities

The eventual application should support:

- authentication
- role-based access control
- audit and activity history
- structured records and relationships
- maintainable expansion into later modules

## Chosen V1 technical direction

The V1 implementation should use:

- Next.js with the App Router for the web application shell
- TypeScript across the application codebase
- PostgreSQL as the primary relational database
- Prisma ORM for schema management and type-safe data access
- Clerk for authentication and session management
- Route Handlers for HTTP write endpoints and client-driven reads
- Server Components for page-level data loading

This combination keeps the product in a single web codebase while preserving a durable database model and clean expansion paths for later modules.

## Auth and access model

Authentication should be handled by Clerk, but the app should maintain its own internal `User` record for roles and business ownership.

The internal role model should support:

- `owner`
- `manager`
- `staff`

Only `owner` should be active in the first release, but the schema and authorization checks should be written so the later roles can be enabled without a redesign.

## Current phase

This repository is still pre-code. The current work has moved from broad product planning into an implementation-ready specification.

No framework files or runtime dependencies have been added yet. The next phase is code scaffolding against the locked V1 specification.

