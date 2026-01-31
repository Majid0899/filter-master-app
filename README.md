# Full-Stack Records Table (Infinite Scroll, Sorting, Filtering & Presets)

This project is a full-stack web application demonstrating server-side pagination, sorting, advanced filtering (AND/OR logic), and filter presets, built as part of a coding assignment.

---

## ✨ Features

### Frontend (React + TypeScript)
- Infinite scrolling table (~1,000 records)
- Column sorting via table headers
- Advanced filtering:
  - Multiple filter rules
  - Operators: equals, contains, >, <, etc.
  - AND / OR logic between rules
  - Clear / None option (resets filters, keeps sorting)
- Filter presets:
  - Save current filter configuration
  - Load saved presets
  - One default preset auto-applies on page load
- Clean UI built with Tailwind CSS & Radix UI

### Backend (Node.js + Express + MongoDB)
- Server-side pagination (cursor / offset based)
- Server-side sorting
- Server-side complex filtering (AND / OR)
- CRUD APIs for filter presets
- Fast responses suitable for infinite scrolling

---

## 🧱 Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Axios

**Backend**
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose

---

## 📁 Project Structure

root/
├── backend/
│ ├── src/
│ ├── package.json
│ └── tsconfig.json
│
├── frontend/
│ ├── src/
│ ├── package.json
│ └── vite.config.ts
│
└── README.md


---

## ⚙️ Prerequisites

- Node.js ≥ 18
- npm or yarn
- MongoDB (local or cloud, e.g. MongoDB Atlas)

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Majid0899/filter-master-app.git
cd filter-master-app


Backend Setup
    cd backend
    npm install

    Create a .env file in the backend directory:
        PORT=5000
        URL=http://localhost
        MONGODB_URI=mongodb://localhost:27017/product_database
    
    npm run dev

Fronted Setup
    cd frontend
    npm install

    npm run dev


API Overview (Backend)

GET /records

Pagination, sorting, filtering (AND / OR rules)

POST /presets

Save a filter preset

GET /presets

Fetch saved presets

PUT /presets/:id/default

Set a preset as default

GET /presets/default

Load default preset on app start

Notes & Design Choices

All sorting, filtering, and pagination are handled server-side

Infinite scrolling fetches data incrementally for smooth UX

Filters are represented as a structured JSON rule tree

Clearing filters resets the dataset but preserves current sorting

Presets are persisted in the database and applied end-to-end
