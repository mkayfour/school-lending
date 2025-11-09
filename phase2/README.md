# Phase 2 – Automated Development
School Equipment Lending Portal

This document describes the design, architecture, and implementation details of Phase 2 of the School Equipment Lending Portal, which was developed using AI-assisted workflows.
Tools such as Cursor IDE and ChatGPT were used to accelerate development, generate boilerplate code, optimize UI, and assist in debugging.
---

# 1. Overview

Phase 2 contains an enhanced version of the School Equipment Lending Portal, built using the same technologies as Phase 1 but with AI-assisted improvements.

Key additions in Phase 2 include:
    - Faster new component development using AI-assisted tooling
    - Improved UI and layouts
    - Additional validations
    - Better filter logic and state updates
    - Cleaned codebase (removed unused imports, files, console logs)
    - Improved Swagger documentation
    - Reduced bugs and fixed logic issues with AI debugging help

---

# 2. Tech Stack

- Backend
    - Node.js
    - Express
    - PostgreSQL
    - Sequelize ORM
    - JWT Authentication
    - Swagger

- Frontend
    - React with TypeScript
    - Vite
    - Material UI
    - Axios for API calls
    - React Router for navigation

# 3. Authentication & Roles

Users authenticate with email + password.
Token-based authentication is implemented using JWT.

- Roles:
    - STUDENT - can view equipment, request borrow, view own requests
    - STAFF - can manage equipment & approve requests
    - ADMIN - full access (inventory + users + requests)

The backend enforces role-based access using custom middleware.

# 4. Swagger Docs
Available at:  http://localhost:4000/docs

# 5. Running the Project

## Backend Setup

```
cd phase1/backend
npm install
# fill in the .env file with the correct values
npm run dev
```

runs on: http://localhost:4000

## Frontend Setup

```
cd phase1/frontend
npm install
npm run dev
```

runs on: http://localhost:5173

# 6. Project Structure

```
phase1/
└── backend/
    ├── src/
    │   ├── config/
    │   │   └── config.json
    │   ├── models/
    │   │   └── index.ts
    │   ├── controllers/
    │   │   └── index.ts
    │   ├── routes/
    │   │   └── index.ts
    │   ├── middleware/
    │   │   └── index.ts
    │   ├── swagger/
    │   │   └── swagger.ts
    │   └── server.ts
    ├── package.json
    └── README.md
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   └── Login.tsx
    │   │   └── Signup.tsx
    │   │   └── Dashboard.tsx
    │   │   └── Profile.tsx
    │   │   └── Equipment.tsx
    │   │   └── Borrow.tsx
    │   │   └── Return.tsx
    │   │   └── Admin.tsx
    │   │   └── Staff.tsx
    │   └── App.tsx
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    └── README.md
```
