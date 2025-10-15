# Take home assignment

## Auto Parts Inventory & Ordering System

### Goal

Build a mini full-stack application for managing and browsing auto parts.
It should have:
- A public product listing (SSR + SSG + CSR mix)
- A simple backend API with authentication and CRUD
- MySQL as the database
- Next.js (frontend) and Express.js (backend) communication via REST API

#### Frontend (Next.js)

Use Next.js (React + TypeScript optional) and demonstrate:
- SSR (Server-Side Rendering) – e.g., the homepage or product list should be rendered on the server.
- SSG (Static Site Generation) – e.g., individual product detail pages should be pre-generated at build time.
- CSR (Client-Side Rendering) – e.g., user dashboard or order creation handled dynamically on the client side.

##### Pages to Include:

- / → SSR page showing list of all parts (from backend API)
- /parts/[id] → SSG page showing product details
- /dashboard → CSR page (only for logged-in users) showing ability to:
  - Add, edit, or delete parts
  - View basic analytics (e.g., total parts, categories count)
 
##### Features:

- Responsive design
- Basic search/filter (client-side)
- Form validation (React Hook Form, Zod, or similar)
- API integration via fetch or Axios
- Authentication via JWT (login, logout, protected routes)

#### Backend (Express.js)

Use Express.js with MySQL (via Sequelize, Prisma, or Knex).
Endpoints to Include:

| Method   | Endpoint             | Description                        |
| -------- | -------------------- | ---------------------------------- |
| `POST`   | `/api/auth/register` | Register new user                  |
| `POST`   | `/api/auth/login`    | Login and return JWT               |
| `GET`    | `/api/parts`         | Get list of all parts              |
| `GET`    | `/api/parts/:id`     | Get single part details            |
| `POST`   | `/api/parts`         | Add a new part (auth required)     |
| `PUT`    | `/api/parts/:id`     | Edit existing part (auth required) |
| `DELETE` | `/api/parts/:id`     | Delete a part (auth required)      |


##### Tables:

users

| id | name | email | password_hash | created_at |

parts

| id | name | brand | price | stock | category | created_at |

Requirements:

- JWT authentication middleware
- Proper validation (e.g., Joi, Yup, Zod)
- Error handling (e.g., 400/401/500 responses)
- Use .env for sensitive data (DB credentials, JWT secret)
- Database migrations or schema setup script
