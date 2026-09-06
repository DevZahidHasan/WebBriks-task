# WebBricks-task

A production-grade, collaborative Kanban board and workflow management platform built with **NestJS**, **Prisma**, **PostgreSQL**, and **Next.js 14** (App Router).

---

## 🌟 Key Architectural Highlights

* **Atomic Reordering Engine:** All task movements (same-column reordering and cross-column transfers) run inside an isolated PostgreSQL ACID transaction (`prisma.$transaction`) with contiguous integer positioning.
* **Anti-IDOR Multi-Tenant RBAC:** Custom `BoardAccessGuard` intercepts nested routes (`/boards`, `/columns`, `/tasks`), verifies parent tenant ownership via indexed junction table lookups, and stops unauthorized cross-tenant mutations with `403 Forbidden`.
* **Zero-Gaps Deletion:** Deleting a task in the middle of a column automatically decrements positions of subsequent sibling tasks in an atomic transaction to prevent index fragmentation.
* **Tactile Drag-and-Drop:** Smooth physics with `@hello-pangea/dnd`, real-time card rotation, and optimistic UI updates with automatic rollback on network error.
* **Production-Grade TypeScript:** 100% strict TypeScript compilation (`strict: true`, `noImplicitAny: true`, zero `any`).

---

## 🚀 Quickstart with Docker Compose

The easiest way to run the entire stack (PostgreSQL + NestJS API + Next.js Frontend) is using Docker Compose:

```bash
docker compose up --build
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:4000/api](http://localhost:4000/api)
* **PostgreSQL:** `localhost:5432` (`kanban_db`)

---

## 💻 Manual Local Development

### 1. Prerequisites
* Node.js 18+ or 20+
* PostgreSQL running locally or in Docker

### 2. Backend Setup
```bash
cd backend
npm install

# Setup environment variables (.env)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/karban-task?schema=public"
# JWT_SECRET="your-jwt-secret"
# PORT=4000

# Push schema to database
npx prisma db push

# Seed demo users, boards, columns, and tasks
npx prisma db seed

# Run backend development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start Next.js development server on port 3000
npm run dev
```

---

## 🔑 Pre-Seeded Demo Credentials

The database seed script creates realistic demo users ready for immediate login:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Board Owner** | `alex.morgan@example.com` | `Password123!` |
| **Board Member** | `sarah.connor@example.com` | `Password123!` |

*(You can also register any new account directly from the register screen).*

---

## ☁️ Production Cloud Deployment Guide

You can deploy this application completely free using modern cloud providers:

### 1. Database (Neon / Supabase)
1. Create a free serverless PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the connection string (`postgresql://user:password@host/dbname?sslmode=require`).

### 2. Backend API (Render / Railway)
1. Push your repository to GitHub.
2. In [Render.com](https://render.com), create a new **Web Service** pointing to the repository.
3. Set **Root Directory** to `backend`.
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npx prisma db push && node dist/main.js`
6. Add Environment Variables:
   * `DATABASE_URL`: *(Your Neon/Supabase PostgreSQL connection string)*
   * `JWT_SECRET`: *(A long random secret string)*
   * `PORT`: `4000`
7. Deploy. Render will provide a public URL (e.g. `https://kanban-api.onrender.com`).

### 3. Frontend (Vercel)
1. In [Vercel](https://vercel.com), import the GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   * `NEXT_PUBLIC_API_URL`: `https://kanban-api.onrender.com/api` (your backend URL + `/api`)
4. Click **Deploy**. Vercel will build and assign your production domain.

---

## 📡 API Reference Overview

### Auth
* `POST /api/auth/register` — Register a new account
* `POST /api/auth/login` — Sign in and receive JWT Bearer token
* `GET /api/auth/me` — Retrieve current authenticated profile

### Boards
* `GET /api/boards` — List user's active boards
* `POST /api/boards` — Create a new board (creator is auto-assigned `OWNER`)
* `GET /api/boards/:id` — Get board details with ordered columns and tasks
* `PATCH /api/boards/:id` — Update board title or description
* `DELETE /api/boards/:id` — Delete board (Owner only)
* `POST /api/boards/:id/members` — Invite teammate by email (`MEMBER` or `VIEWER`)
* `DELETE /api/boards/:id/members/:userId` — Remove member

### Columns
* `POST /api/boards/:boardId/columns` — Create column (auto-calculated position)
* `PATCH /api/columns/:id` — Rename column
* `DELETE /api/columns/:id` — Cascade delete column

### Tasks
* `POST /api/columns/:columnId/tasks` — Create task in column
* `PATCH /api/tasks/:id` — Update task details (title, description, priority, dueDate, assignee)
* `DELETE /api/tasks/:id` — Atomic gap-filling task deletion
* `PATCH /api/tasks/:id/move` — Atomic task movement & reordering engine
