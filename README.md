# 🎓 Smart Learning System

A full-stack Learning Management System built with **React**, **Node.js**, **Express**, and **MongoDB**.

## ✨ Features

- 🔐 **User Authentication** — JWT-based login/signup with role-based access
- 📚 **Course Catalog** — Browse, search, and filter courses by category
- 🎬 **Video & Notes** — YouTube video player + Markdown notes viewer
- 📝 **Quiz System** — Interactive quizzes with instant scoring and results
- 📊 **Progress Tracking** — Per-course progress bars and overall learning stats
- 🛡️ **Admin Panel** — Full CRUD for courses and quizzes
- 📱 **Responsive Design** — Mobile-first with Tailwind CSS
- 🌙 **Modern Dark UI** — Glassmorphism, gradients, and smooth animations

---

## 🚀 How to Run (Step by Step)

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** — Either:
  - Local install: [Download](https://www.mongodb.com/try/download/community)
  - **OR** MongoDB Atlas (cloud): [Sign up free](https://www.mongodb.com/atlas)

---

### Step 1: Clone / Open Project

Open the `Smart learning Management` folder in VS Code.

---

### Step 2: Setup Backend

Open a terminal in VS Code (`Ctrl + ~`) and run:

```bash
cd backend
npm install
```

#### Configure Environment

Edit `backend/.env` if needed:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smart-learning
JWT_SECRET=smartlearning_jwt_secret_key_2024
JWT_EXPIRE=7d
```

> 💡 For MongoDB Atlas, replace `MONGODB_URI` with your connection string.

#### Seed Sample Data

```bash
npm run seed
```

This creates:
- **Admin account**: `admin@learn.com` / `admin123`
- **User account**: `user@learn.com` / `user123`
- 3 sample courses with lessons and quizzes

#### Start Backend Server

```bash
npm run dev
```

Backend runs on: `http://localhost:5001`

---

### Step 3: Setup Frontend

Open a **new terminal** in VS Code and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

### Step 4: Open in Browser

Visit **http://localhost:3000** and sign in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@learn.com | admin123 |
| User | user@learn.com | user123 |

---

## 📁 Project Structure

```
Smart learning Management/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT auth middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Course.js          # Course + lessons schema
│   │   ├── Quiz.js            # Quiz + questions schema
│   │   └── Progress.js        # Progress tracking schema
│   ├── routes/
│   │   ├── auth.js            # Register, login, me
│   │   ├── courses.js         # List, detail, enroll
│   │   ├── quizzes.js         # Get & submit quizzes
│   │   ├── progress.js        # Progress tracking
│   │   └── admin.js           # Admin CRUD
│   ├── seed/seed.js           # Sample data seeder
│   ├── server.js              # Express entry point
│   ├── .env                   # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── context/           # Auth context provider
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Router
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Course detail |
| POST | `/api/courses/:id/enroll` | Enroll in course |

### Quizzes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/quizzes/:courseId` | Get quizzes |
| POST | `/api/quizzes/:quizId/submit` | Submit answers |

### Progress
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/progress/dashboard` | Dashboard data |
| GET | `/api/progress/:courseId` | Course progress |
| POST | `/api/progress/complete-lesson` | Mark complete |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/courses` | List courses |
| POST | `/api/admin/courses` | Create course |
| PUT | `/api/admin/courses/:id` | Update course |
| DELETE | `/api/admin/courses/:id` | Delete course |
| POST | `/api/admin/quizzes` | Create quiz |
| DELETE | `/api/admin/quizzes/:id` | Delete quiz |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

Built with ❤️ for learning.
