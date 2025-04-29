# Log Entry Manager

A full-stack web application for managing event logs. Users can create, view, edit, and delete log entries — each consisting of a user's name, description, date, and location. Designed to be responsive and work offline locally (no cloud persistence required).

## ✨ Features

- ✅ Add / edit / delete log entries
- ✅ Auto-fill user name from previous entry (saved locally)
- ✅ Inline editing in the table
- ✅ Modal form for new logs
- ✅ Validation via Zod (frontend and backend)
- ✅ Responsive design (mobile + desktop)

---

## 🧠 Tech Stack

### Backend
- Node.js + TypeScript
- Express
- SQLite (via `better-sqlite3`)
- Zod for schema validation
- Vitest for unit testing

### Frontend
- React + TypeScript
- Material UI (MUI)
- React Query for data fetching and caching
- Axios for HTTP
- Wouter for routing
- Esbuild for bundling
- LocalStorage for user name persistence

---

## 📁 Project Structure
```
/backend
  ├── src/
  │   ├── controllers/          # Express route handlers
  │   ├── routes/               # Express route definitions
  │   ├── schemas/              # Zod validation schemas
  │   ├── models/               # Type definitions (e.g., LogEntry)
  │   ├── middleware/           # Reusable Express middleware (e.g. validateBody)
  │   ├── database.ts           # SQLite connection
  │   └── server.ts             # Express app entry point
  ├── tests/                    # Vitest unit tests
  ├── package.json
  └── tsconfig.json

/frontend
  ├── public/                   # index.html + output JS bundle
  ├── src/
  │   ├── pages/                # React pages (e.g., Home.tsx)
  │   ├── schema/               # Zod validation schema (frontend-side)
  │   ├── services/             # Axios API instance
  │   ├── validation/           # Zod validation schema
  │   ├── App.tsx               # Routing
  │   └── index.tsx             # App entry point
  ├── esbuild.config.ts         # Esbuild config (build + watch)
  ├── server.ts                 # Express dev server with live reload
  ├── package.json
  └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x preferred)

---

## 🖥️ Backend

### 📦 Install dependencies

```bash
cd backend
npm install
```

### ▶️ Run the backend server
```bash
npm run dev
```
Starts an Express server at http://localhost:4000

### 🧪 Run tests
```bash
npm run test
```
Uses Vitest to run unit tests on controllers

---

## 💻 Frontend
### 📦 Install dependencies
```bash
cd frontend
npm install
```
### ▶️ Run the frontend (with live reload)
```bash
npm run dev
```
Opens at http://localhost:3000, served via a lightweight `express` server + `esbuild --watch`

⚠️ Make sure the backend is also running at http://localhost:4000

---

## 📌 Notes
User name is stored in localStorage under the key logEntryUserName

Logs are stored in a local SQLite DB (backend/data.db)

Data does not persist across devices — by design

You can clear all logs by manually deleting data.db or resetting the database

---

## 🧹 Future Enhancements
- ✅ Use shared types between backend/frontend (planned)
- ⏳ Filter/search logs
- ⏳ Sortable columns
- ⏳ Export logs (CSV or JSON)

---

## 🧑‍💻 Author
Built by Skyler Coker — for demo, learning, and portfolio purposes.
