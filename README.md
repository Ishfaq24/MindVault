# MindVault 🧠⚡
> **Enterprise-grade Intelligent Knowledge Base & Retrieval-Augmented Generation (RAG) AI Platform**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue.svg)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo%20Server%205-E10098.svg)](https://graphql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

---

## 📖 Overview

**MindVault** is a full-stack, AI-powered knowledge management and conversational intelligence system. It enables users to upload enterprise documents (PDF, DOCX, TXT, Markdown), automatically chunks and embeds content into a vector database, and performs accurate semantic search and Retrieval-Augmented Generation (RAG) to deliver grounded answers with precise document citations.

Built on top of a modular architecture featuring **React 19**, **Express 5**, **Apollo GraphQL**, **Prisma ORM**, and **PostgreSQL with pgvector**, MindVault is built for scalability, security, and developer ergonomics.

---

## ✨ Key Features

- 📄 **Multi-Format Document Ingestion**: Ingest and parse PDF (`pdf-parse`), DOCX (`mammoth`), Markdown, and plain text files with automatic metadata extraction.
- 🧩 **Smart Tokenization & Chunking**: Context-aware chunking powered by `js-tiktoken` preserving semantic coherence.
- ⚡ **Vector Search & Semantic RAG**: High-performance vector embeddings via OpenAI / NVIDIA NIM models stored in PostgreSQL with `pgvector` indexing for sub-second semantic retrieval.
- 💬 **Context-Grounded Conversational AI**: Multi-turn chat interface with grounded answers, conversation history persistence, and source chunk references.
- 🔐 **Secure Authentication & Session Management**: Robust JWT access and refresh token rotation, bcrypt password hashing, and secure HTTP cookies.
- 🗄️ **Flexible Storage Layer**: Seamlessly switch between **Supabase Storage** (cloud bucket) and **Local Filesystem Storage** (`USE_LOCAL_STORAGE=true`) for local development or air-gapped environments.
- 🚀 **Dual GraphQL & REST Architecture**: Apollo Server 5 for declarative data querying and type-safe mutations, combined with streaming REST endpoints for high-throughput multipart uploads.
- 🎨 **Modern Responsive UI**: Clean interface built with React 19, Tailwind CSS v4, Motion (Framer Motion) animations, and Lucide icons with full dark/light theme support.

---

## 🏗️ Architecture & System Design

```mermaid
graph TD
    Client["Client Browser (React 19 + Tailwind v4 + Apollo Client)"]
    Proxy["Frontend Express Proxy Server (:3000)"]
    Server["Backend Express 5 Server (:4000)"]
    GraphQL["Apollo GraphQL Engine"]
    REST["REST Upload Controller (Multer)"]
    Prisma["Prisma ORM"]
    PG[("PostgreSQL + pgvector (Neon / Supabase / Local)")]
    AI["AI Embeddings & LLM (OpenAI / NVIDIA NIM)"]
    Storage["Storage Engine (Supabase Storage / Local Disk)"]

    Client -->|Web Traffic / UI| Proxy
    Proxy -->|Forward /graphql & /api| Server
    Server --> GraphQL
    Server --> REST
    GraphQL --> Prisma
    REST --> Storage
    REST --> Prisma
    Prisma --> PG
    GraphQL --> AI
    GraphQL --> PG
```

---

## 📂 Project Structure

```text
MindVault/
├── frontend/                     # React 19 SPA + Express Dev/Prod Server
│   ├── src/
│   │   ├── app/                  # Router & Context Providers (Apollo, Auth, Theme)
│   │   ├── components/           # Reusable UI component library
│   │   ├── contexts/             # Authentication & Theme contexts
│   │   ├── features/             # Feature-specific components & logic (auth, chat, docs)
│   │   ├── graphql/              # GraphQL operations (queries, mutations)
│   │   ├── hooks/                # Custom React hooks
│   │   └── types/                # TypeScript interfaces & types
│   ├── server.ts                 # Dev Vite server + production reverse proxy
│   ├── package.json
│   └── vite.config.ts
│
├── server/                       # Node.js + Express 5 Backend API
│   ├── prisma/                   # Modular Prisma schema definitions & migrations
│   │   ├── chat/                 # Chat & message models
│   │   ├── identity/             # User, auth, membership & refresh token models
│   │   ├── knowledge/            # Documents, files, chunks & vector models
│   │   ├── system/               # Activity logs & notifications
│   │   └── schema.prisma         # Main Prisma generator configuration
│   ├── src/
│   │   ├── app/                  # Express app & HTTP/WebSocket server entry points
│   │   ├── config/               # Environment variable validation (Zod) & logger
│   │   ├── database/             # Prisma client & database connectivity
│   │   ├── graphql/              # Apollo schema, scalar resolvers & context
│   │   ├── modules/
│   │   │   ├── auth/             # JWT auth, registration, login & token lifecycle
│   │   │   ├── chat/             # LLM orchestration, prompts & conversation history
│   │   │   ├── documents/        # Ingestion pipeline, parsers & chunking
│   │   │   ├── embeddings/       # Vector generation & pgvector similarity search
│   │   │   ├── health/           # Liveness & readiness probes
│   │   │   ├── search/           # Semantic vector search resolvers
│   │   │   └── uploads/          # File upload handlers & storage drivers
│   │   └── index.ts              # Server bootstrapper
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ⚙️ Prerequisites

Before running MindVault, ensure you have the following installed:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher (or `pnpm` / `bun`)
- **PostgreSQL**: PostgreSQL 15+ with the [`pgvector`](https://github.com/pgvector/pgvector) extension installed (available natively on [Neon](https://neon.tech), [Supabase](https://supabase.com), or Docker).
- **AI API Key**: OpenAI API Key or NVIDIA NIM API Key for embeddings and chat generation.

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Ishfaq24/MindVault.git
cd MindVault
```

### 2. Configure Environment Variables

#### Backend Environment (`server/.env`)
Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

```env
NODE_ENV=development
PORT=4000

# PostgreSQL Database with pgvector extension enabled
DATABASE_URL="postgresql://user:password@localhost:5432/mindvault?sslmode=prefer"
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/mindvault?sslmode=prefer"

# JWT Authentication Secrets (Generate secure 32+ char strings)
JWT_ACCESS_SECRET="your-super-secret-access-token-key-min-32-chars-long"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-min-32-chars-long"
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=12

# File Storage Configuration
# Set USE_LOCAL_STORAGE=true to store files locally in server/uploads
USE_LOCAL_STORAGE=true
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
SUPABASE_SECRET_KEY="your-supabase-secret-key"
SUPABASE_STORAGE_BUCKET="uploads-ai"

# AI Provider Configuration (NVIDIA NIM or OpenAI)
NVIDIA_API_KEY="your-nvidia-nim-api-key"
NVIDIA_BASE_URL="https://integrate.api.nvidia.com/v1"
# OPENAI_API_KEY="your-openai-api-key" # Optional alternative
```

#### Frontend Environment (`frontend/.env`)
Create a `.env` file in the `frontend` directory:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
# Backend target (for the frontend dev server proxy)
VITE_BACKEND_URL="http://localhost:4000"
VITE_GRAPHQL_URL="/graphql"
VITE_API_BASE_URL="/api"
PORT=3000
```

---

### 3. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 4. Setup Database & Migrations

In the `server` directory, run the database migrations and generate the Prisma client:

```bash
cd server

# Apply database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

> [!TIP]
> **Enabling pgvector**: Ensure `CREATE EXTENSION IF NOT EXISTS vector;` is executed on your PostgreSQL instance if not using managed Neon/Supabase instances where extensions are auto-loaded.

---

### 5. Start Development Servers

Start both servers in separate terminal tabs or background jobs:

#### Terminal 1 — Backend API
```bash
cd server
npm run dev
```
*Backend will be running at [http://localhost:4000](http://localhost:4000) (GraphQL Playground at `/graphql`).*

#### Terminal 2 — Frontend Application
```bash
cd frontend
npm run dev
```
*MindVault web app will be accessible at **[http://localhost:3000](http://localhost:3000)**.*

---

## 🔧 Environment Variables Reference

### Backend (`server/.env`)

| Variable | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | `string` | `development` | No | Environment mode (`development`, `production`, `test`) |
| `PORT` | `number` | `4000` | No | Express and Apollo Server port |
| `DATABASE_URL` | `string` | — | **Yes** | Connection pooling URL for PostgreSQL |
| `DIRECT_DATABASE_URL` | `string` | — | No | Direct connection string for Prisma migrations |
| `JWT_ACCESS_SECRET` | `string` | — | **Yes** | Secret used to sign access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | `string` | — | **Yes** | Secret used to sign refresh tokens (min 32 chars) |
| `ACCESS_TOKEN_EXPIRES_IN` | `string` | `15m` | No | Access token expiration duration |
| `REFRESH_TOKEN_EXPIRES_IN`| `string` | `30d` | No | Refresh token expiration duration |
| `BCRYPT_ROUNDS` | `number` | `12` | No | Salt rounds for hashing user passwords |
| `USE_LOCAL_STORAGE` | `boolean` | `false` | No | If `true`, saves uploaded files to local disk |
| `SUPABASE_URL` | `string` | — | If Cloud Storage | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY`| `string` | — | If Cloud Storage | Supabase anon/public API key |
| `SUPABASE_SECRET_KEY` | `string` | — | If Cloud Storage | Supabase service-role secret key |
| `SUPABASE_STORAGE_BUCKET` | `string` | `uploads-ai` | No | Storage bucket name for file uploads |
| `NVIDIA_API_KEY` | `string` | — | If NVIDIA NIM | API key for NVIDIA NIM AI models |
| `NVIDIA_BASE_URL` | `string` | — | If NVIDIA NIM | Base URL for NVIDIA AI endpoints |
| `OPENAI_API_KEY` | `string` | — | If OpenAI | API key for OpenAI models |

### Frontend (`frontend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `number` | `3000` | Port for the frontend Express server |
| `VITE_BACKEND_URL` | `string` | `http://localhost:4000` | Destination URL for proxying GraphQL & REST requests |
| `VITE_GRAPHQL_URL` | `string` | `/graphql` | Relative or absolute path to GraphQL endpoint |
| `VITE_API_BASE_URL` | `string` | `/api` | Relative or absolute path to REST API |

---

## 📡 API Endpoints

### GraphQL API (`/graphql`)

| Operation | Type | Description |
| :--- | :--- | :--- |
| `register(input)` | Mutation | Create a new user account |
| `login(input)` | Mutation | Authenticate user and receive access/refresh tokens |
| `refreshToken` | Mutation | Issue a new access token via refresh token cookie |
| `logout` | Mutation | Invalidate active refresh token session |
| `documents` | Query | List ingested documents with chunk status and metadata |
| `searchChunks(query, limit)` | Query | Perform semantic vector similarity search |
| `createConversation(title)` | Mutation | Initialize a new conversational thread |
| `sendMessage(conversationId, content)` | Mutation | Send a query and receive RAG-augmented AI responses |
| `health` | Query | Health and liveness probe |

### REST API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/uploads` | Multipart file upload (PDF, DOCX, TXT, MD up to 20MB) |
| `GET` | `/uploads/:filename` | Static file serving when running in local storage mode |

---

## 🚢 Production Deployment

### 1. Build Frontend & Server

```bash
# Build Server
cd server
npm run build

# Build Frontend (Vite bundle + production proxy runner)
cd ../frontend
npm run build
```

### 2. Run in Production

#### Start Backend:
```bash
cd server
NODE_ENV=production npm start
```

#### Start Frontend:
```bash
cd frontend
NODE_ENV=production npm start
```

### 3. Docker Support (Example `Dockerfile`)

```dockerfile
# Multi-stage production build example
FROM node:20-alpine AS base
WORKDIR /app

# Backend Build
FROM base AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server ./
RUN npx prisma generate && npm run build

# Frontend Build
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Production Runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/node_modules ./server/node_modules
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY --from=frontend-build /app/frontend/node_modules ./frontend/node_modules

EXPOSE 3000 4000
CMD ["node", "server/dist/index.js"]
```

---

## 🛠️ NPM Scripts Summary

### `server/`
| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `tsx watch src/index.ts` | Start backend in development mode with live reload |
| `npm run build` | `tsc` | Compile TypeScript source code to `build/` |
| `npm start` | `node build/index.js` | Run compiled backend in production |
| `npm run migrate:local-keys` | `tsx scripts/migrate-local-storage-keys.ts` | Migrate storage keys for local files |

### `frontend/`
| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | Start Vite dev server with proxy middleware |
| `npm run build` | `vite build && esbuild server.ts ...` | Build client assets and compile production server |
| `npm start` | `node dist/server.cjs` | Run production frontend server |
| `npm run lint` | `tsc --noEmit` | Type-check frontend code |
| `npm run clean` | `rm -rf dist server.js` | Clean build artifacts |

---

## 🛡️ Security Best Practices

- **Token Security**: Store refresh tokens in `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
- **Input Sanitization & Validation**: All payloads validated using strict `zod` schemas.
- **File Upload Limits**: Enforces 20MB file size limit and MIME-type verification before parsing.
- **Vector Isolation**: Document chunks are linked to user / organization IDs to guarantee strict multi-tenant data boundaries during similarity search.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "feat: add your feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
