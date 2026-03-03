# Coffee Ops Hub

Coffee Ops Hub is a planned internal business operations web app for running the day-to-day side of the company from one place.

The product is intended to centralize owner coordination first, with room to expand into inventory, purchasing, vendors, invoices, and broader operating workflows later.

## Current status

The repository now includes a working Next.js application scaffold with a mobile-first UI shell and a documented V1 technical foundation.

The product and V1 technical direction are documented in:

- `docs/TECHNICAL_SPEC_V1.md`
- `docs/SCHEMA_V1.md`
- `docs/APP_MAP_V1.md`
- `docs/ACCEPTANCE_TESTS_V1.md`

## Project boundary

This project is intentionally separate from the existing Relay-to-Zoho converter located at `C:\Users\jayay\Desktop\relaytozoho`. Nothing in that project should be modified as part of this repository setup.

## Included in this scaffold

- Next.js App Router with TypeScript
- Tailwind CSS v4 setup
- mobile-first responsive app shell
- desktop sidebar plus mobile bottom navigation
- PWA manifest and install-ready metadata
- initial route structure for dashboard, tasks, goals, activity, settings, and sign-in
- Prisma schema for the V1 domain model
- environment placeholder file for Clerk and PostgreSQL

The UI currently uses mock data so it runs without a live database while the real backend is wired in.

## Immediate next milestone

Wire the scaffold into live services and replace the mock data:

- configure Clerk keys and protected routes
- connect PostgreSQL
- run the first Prisma migration
- replace mock reads with database-backed queries
- implement the first write flows for tasks
