# 🧰 AutoParts Management System

A **full-stack auto parts management application** built with **Next.js**, **Express.js**, **Prisma**, and **MySQL**, fully Dockerized for seamless local development and deployment.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login using **JWT** authentication  
- Secure password hashing with **bcrypt**

### 🧩 Product Management
- Create, update, and manage auto parts
- Upload product images with **Multer**

### 🧠 Validation & State Management
- Form validation using **Zod** & **React Hook Form**
- Global state with **Zustand**

### ⚙️ Database & ORM
- **MySQL** as database
- **Prisma ORM** for schema management & migrations

### 🎨 Frontend (Next.js)
- Built with **Next.js 13**
- Tailwind CSS for fast and responsive UI design
- Icons from **Lucide-react**

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js, React, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express.js, Prisma |
| **Database** | MySQL (Dockerized) |
| **Authentication** | JWT + Bcrypt |
| **Validation** | Zod |
| **Containerization** | Docker & Docker Compose |

---

## 📦 NPM Packages Overview

| Package | Use Case |
|----------|-----------|
| **express** | Web framework for backend APIs |
| **prisma** / **@prisma/client** | ORM for database access |
| **bcrypt** | Hash user passwords securely |
| **jsonwebtoken** | Create and verify JWT tokens |
| **multer** | Handle image/file uploads |
| **zod** | Schema validation |
| **cors** | Handle cross-origin requests |
| **dotenv** | Load environment variables |
| **react-hook-form** | Manage form states easily |
| **zustand** | Lightweight global state management |
| **lucide-react** | Modern icons |
| **tailwindcss** | Utility-first CSS framework |

---
```bash
## 🗂️ Folder Structure
autoparts/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── auth.ts
│ │ │ └── parts.ts
│ │ ├── middleware/
│ │ ├── utils/
│ │ ├── app.ts
│ │ └── server.ts
│ ├── prisma/
│ │ └── schema.prisma
│ ├── Dockerfile.dev
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── lib/
│ ├── Dockerfile.dev
│ ├── package.json
│ └── .env.local
│
├── docker-compose.yml
├── README.md
└── CONTRIBUTING.md
```
---

## 🐳 Running Locally (with Docker)

Follow these steps to run the full stack locally using Docker Compose.

### 1️⃣ Clone the Repository

```bash
git clone [https://github.com/shafaet3/home-assignment.git]
cd autoparts
```

### 2️⃣ Environment Setup

Create .env files in:

/backend/.env

/frontend/.env.local

Example configuration:

backend/.env:
```bash
PORT=4000
DATABASE_URL=mysql://root:root@db:3306/autoparts_db
JWT_SECRET=ReplaceWithStrongSecret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
COOKIE_NAME=autoparts_token
API_BASE_URL=http://localhost:4000

```
frontend/.env.local:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
INTERNAL_API_BASE=http://backend:4000/api
```
### 3️⃣ Start the Project
```bash
docker-compose -f docker-compose.dev.yml up --build
```
Once running:
- Frontend → http://localhost:3000
- Backend API → http://localhost:4000/api
- Database → MySQL accessible at port 3307

### 4️⃣ Stop Containers
```bash
docker-compose -f docker-compose.dev.yml down -v
```
⚙️ Prisma Commands (if needed)
Inside the backend container:
```bash
docker exec -it autoparts_backend bash
npx prisma generate
npx prisma migrate deploy
```
