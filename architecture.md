# Running MindVault Locally

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd MindVault

# 2. Install all dependencies
               # root
cd frontend && npm i  # frontend
cd ../server && npm i # backend

# 3. Start development servers (two terminals)
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend  
cd server
npm run dev
```

That's it! The app will be running at `http://localhost:3000`.

## Project Structure
- `frontend/` – React/Next.js UI
- `server/` – Node.js/Express API