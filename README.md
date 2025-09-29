Here’s a clear, humanized README tailored for the “Scheduler with Recurring Slots” take‑home assignment, covering scope, stack, APIs, data model, and deployment flow.

# Scheduler with Recurring Slots

A full‑stack scheduler that lets users create weekly recurring time slots with per‑date exceptions, showing a weekly calendar with infinite scroll and CRUD on slots.[1]

### Live Links

- Frontend (Vercel/Netlify): "" [1]
- Backend (Render/Fly/Railway): "" [1]
- Database: PostgreSQL (Render/Neon/ElephantSQL).[1]

## What it does

- Create a slot on a weekday (e.g., Monday 9:00–11:00) and it auto‑repeats on all future same weekdays.[1]
- Each date can have at most 2 slots; validation enforces limits.[1]
- Edit/delete on a specific date creates an exception without touching the pattern.[1]
- UI shows the current week and loads next weeks on scroll (infinite scroll).[1]

## Tech stack

- Frontend: React + TypeScript + Tailwind CSS.[1]
- Backend: Node.js + TypeScript + Knex + Express‑style REST APIs.[1]
- DB: PostgreSQL with normalized schema for patterns and exceptions.[1]
- Hosting: Frontend on Vercel/Netlify, Backend on Render, DB on Render/Neon.[1]

## Core concepts

- Recurrence is weekly by weekday; only a single source pattern per slot definition.[1]
- Exceptions are stored per date to override or remove instances.[1]
- The API resolves “effective slots” per date by merging recurring patterns with exceptions.[1]
- Pagination is week‑based for smooth infinite scrolling.[1]

## Data model

- tables:
  - schedules: id, weekday (0–6), start_time, end_time, created_at, updated_at.[1]
  - schedule_exceptions: id, schedule_id, date (YYYY‑MM‑DD), type ('edit'|'delete'), start_time?, end_time?, note?. [1]
  - computed view (API level): effective_slots(date) from base schedules + exceptions, capped at 2 per date.[1]

## Recurrence resolution (backend)

- For each day in the requested week:
  - Start with all schedules where weekday matches.[1]
  - Apply exceptions for that date: delete removes, edit replaces time range.[1]
  - Deduplicate and cap to two slots after conflict checks.[1]

## Getting started

### Prerequisites

- Node 18+, pnpm/yarn/npm, PostgreSQL URL, Render/Neon DB.[1]

### Backend

- Env:
  - DATABASE_URL=postgres://user:pass@host/db[1]
  - PORT=5000[1]
- Scripts:
  - pnpm migrate to run Knex migrations.[1]
  - pnpm dev to start local server.[1]

### Frontend

- Env:
  - NEXT_PUBLIC_API_URL=https://your‑api.onrender.com[1]
- Scripts:
  - npm dev to run Next.js/Vite dev server.[1]
  - Deploy to Vercel/Netlify and set NEXT_PUBLIC_API_URL.[1]

## Deployment notes

- Backend: Deploy to Render with a Web Service; add DATABASE_URL and run migration on build.[1]
- Database: Use free Render Postgres or Neon; ensure public IP/SSL as required.[1]
- Frontend: Deploy to Vercel/Netlify; set NEXT_PUBLIC_API_URL to the backend URL.[1]

## Edge cases handled

- Editing a single date different from the pattern time range.[1]
- Deleting one instance while keeping future recurrences.[1]
- Preventing third slot on a busy date and blocking overlaps.[1]
- Scrolling far into the future without duplicating or missing instances.[1]

## Testing checklist

- Create a Monday 09:00–11:00 and verify it appears on all future Mondays.[1]
- Add a second Monday slot (e.g., 14:00–16:00), verify max 2/day.[1]
- Edit next week’s Monday 09:00–11:00 to 10:00–12:00 and confirm only that date changes.[1]
- Delete a single Wednesday occurrence and confirm other Wednesdays remain.[1]
- Infinite scroll shows continuous weeks without gaps or duplicates.[1]

## Project structure (suggestion)

- frontend/: React + TS + Tailwind app with weekly calendar and API hooks.[1]
- backend/: Node + TS + Knex + Express routes and recurrence/exception services.[1]
- db/: Knex migrations and seeds for sample slots.[1]
