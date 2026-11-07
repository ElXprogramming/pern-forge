# ⚡ PERN Forge — The Complete PERN Stack Learning Platform

> An interactive educational platform and starter boilerplate for mastering the **PERN stack**: **PostgreSQL**, **Express.js**, **React**, and **Node.js**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FElXprogramming%2Fpern-forge)

---

## 📚 Curriculum & Learning Guide

### 1. 📜 Stack Origins & History
- **PostgreSQL (1986)**: Conceived at UC Berkeley by Turing Award winner **Michael Stonebraker** as POSTGRES (the successor to Ingres). In 1996, SQL query language support was added. It has grown into the world's most advanced open-source object-relational database with rock-solid ACID compliance, custom extensions, and JSONB indexing.
- **Node.js (2009)**: Created by **Ryan Dahl**. Dahl took Google Chrome's fast V8 JavaScript engine and merged it with `libuv` (a cross-platform C library) to bring non-blocking, event-driven asynchronous I/O to JavaScript on the server.
- **Express.js (2010)**: Created by **TJ Holowaychuk**, inspired by Ruby's Sinatra framework. Express introduced a minimalist, unopinionated routing layer and the concept of middleware pipelines, becoming the default server abstraction for Node.js.
- **React (2013)**: Developed by **Jordan Walke** at Facebook (initially internal prototype "FaxJS" in 2011). React transformed web development by introducing declarative component-driven UI, unidirectional data flow, the Virtual DOM reconciliation algorithm, and functional Hooks (2019).
- **The Evolution from LAMP to MEAN/MERN to PERN**:
  - **LAMP (1995-2005)**: Monolithic server-rendered pages (PHP/Apache/MySQL).
  - **MEAN/MERN (2013-2016)**: The JavaScript revolution popularized MongoDB for flexible JSON documents. However, startups quickly suffered from schema drift, lack of ACID guarantees across documents, and slow relational operations.
  - **PERN (2016-Present)**: Replaces MongoDB with PostgreSQL. Developers retain full-stack JavaScript/TypeScript speed while gaining strict relational schemas, foreign-key constraints, and JSONB document capabilities when needed.

---

### 2. 📖 Core Terminology Glossary

| Term | Category | Definition |
| :--- | :--- | :--- |
| **ACID** | PostgreSQL | **A**tomicity, **C**onsistency, **I**solation, **D**urability — guarantees data integrity even during hardware failure. |
| **Connection Pooling** | Database / `pg` | A managed cache of open database connections (`pg.Pool`) that server threads reuse, avoiding expensive TCP/TLS handshakes per query. |
| **JSONB** | PostgreSQL | Binary-encoded JSON stored with decomposed keys and indexed via GIN (Generalized Inverted Index) for instant sub-document queries. |
| **Middleware** | Express | Functions with access to `req`, `res`, and `next()`. They execute sequentially to log requests, authenticate tokens, and parse payloads. |
| **CORS** | Browser / Express | **Cross-Origin Resource Sharing**. Browser security rule blocking frontends from accessing APIs on different ports unless the server sends permissive headers. |
| **Parameterized Queries** | Security / SQL | Using placeholders (`$1`, `$2`) to pass query parameters separately from the SQL statement, neutralizing SQL Injection attacks. |
| **Event Loop & Libuv** | Node.js | Single-threaded engine loop that delegates file and network I/O to background C++ threads, returning callbacks or resolving promises without blocking. |
| **Virtual DOM (VDOM)** | React | In-memory JavaScript representation of the DOM. React diffs changes and batches minimal real DOM mutations. |
| **React Hooks** | React | Primitives (`useState`, `useEffect`, `useContext`, `useMemo`) enabling state and lifecycle management in functional components. |
| **Stateless JWT** | Auth | JSON Web Tokens cryptographically signed with a server secret, removing the need for server session storage. |

---

### 3. 📦 Major Ecosystem Libraries

| Tool | Purpose | Install Command |
| :--- | :--- | :--- |
| **`pg` (node-postgres)** | Low-overhead native PostgreSQL client with pooling | `npm i pg` |
| **Prisma ORM** | Type-safe declarative database modeling and queries | `npm i @prisma/client` |
| **Express** | Minimalist web server routing & middleware pipeline | `npm i express` |
| **cors** | Configures Cross-Origin Resource Sharing headers | `npm i cors` |
| **dotenv** | Loads `.env` configuration files into `process.env` | `npm i dotenv` |
| **bcryptjs** | Salted cryptographic password hashing | `npm i bcryptjs` |
| **jsonwebtoken** | Generates and validates signed JWT auth tokens | `npm i jsonwebtoken` |
| **React Router** | Client-side routing for Single Page Applications | `npm i react-router-dom` |
| **TanStack Query** | Server state management, auto-caching, and background revalidation | `npm i @tanstack/react-query` |
| **Axios** | Promise-based HTTP client with request/response interceptors | `npm i axios` |
| **Zustand** | Lightweight global client state management using hooks | `npm i zustand` |

---

### 4. 💻 Syntaxes & Code Examples

#### A. PostgreSQL (`server/schema.sql`)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_projects_metadata_gin ON projects USING GIN(metadata);
```

#### B. Express Backend (`server/server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

app.get('/api/projects', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});
```

#### C. React Client (`index.html`)
```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/projects', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setProjects(data.data))
    .catch(err => { if (err.name !== 'AbortError') setError(err.message); });
  return () => controller.abort();
}, []);
```

---

## 🚀 Running the Project

### 1. Interactive Learning Webapp
Open `index.html` in any web browser to explore:
- Interactive History and Stack timeline
- Searchable & filterable glossary of terms
- Major libraries comparison directory
- Fullstack lifecycle simulator (step-by-step request flow)
- Interactive knowledge mastery quiz

### 2. Express & PostgreSQL Backend
```bash
cd server
npm install
cp ../.env.example .env
# Update .env with your PostgreSQL credentials
node server.js
```

### 3. ☁️ Deploy to Vercel
You can deploy this application directly to Vercel in seconds:
1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FElXprogramming%2Fpern-forge)** button or visit [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import `ElXprogramming/pern-forge`.
3. *(Optional)* Add `DATABASE_URL` in the **Environment Variables** section if you have a hosted PostgreSQL database (e.g. from Neon, Supabase, or Vercel Postgres).
4. Click **Deploy**! Vercel serves the static learning webapp at `/` and serverless API functions at `/api/*`.

---

## 👤 Author
- **Eldion Ryan Godius** ([@ElXprogramming](https://github.com/ElXprogramming))
