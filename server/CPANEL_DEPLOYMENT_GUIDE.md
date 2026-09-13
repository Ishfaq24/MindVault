# MindVault Backend — cPanel Deployment Guide

This guide details how to deploy the MindVault Node.js/TypeScript backend to any cPanel hosting account running CloudLinux / Phusion Passenger (or standard cPanel Application Manager).

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:
1. **cPanel Access** with:
   - **Setup Node.js App** (CloudLinux NodeJS Selector) or **Terminal / SSH** access.
   - **File Manager** access.
2. **Node.js 18.x, 20.x, or 22.x** available in cPanel (Node 20.x LTS is strongly recommended).
3. **A Domain or Subdomain** created in cPanel (e.g., `api.yourdomain.com` or `mindvault-api.yourdomain.com`).
4. **Neon PostgreSQL Database URL** (with pgvector enabled).
5. **Supabase Storage credentials** (or local storage enabled).
6. **NVIDIA API Key** (for embeddings and chat).

---

## 🚀 Step 1: Package the Backend Locally

Run the packaging script inside the `server/` directory:

```bash
cd server
npm run package:deploy
```

This command will:
1. Compile your TypeScript code cleanly into `./build`.
2. Stage all required production runtime files (`build/`, `prisma/`, `app.js`, `package.json`, `package-lock.json`, `.env.example`, `.htaccess.example`, and an empty `uploads/` directory).
3. Generate a clean archive: **`mindvault-backend-deploy.zip`** in the `server/` directory.

*(Note: `node_modules`, `src/`, `.git/`, and dev dependencies are intentionally excluded from the zip archive to keep it lightweight and ensure native dependencies are compiled for the server's Linux environment).*

---

## 🌐 Step 2: Create a Subdomain in cPanel

1. Log into your **cPanel**.
2. Go to **Domains** > **Domains** (or **Subdomains** depending on your cPanel theme).
3. Click **Create A New Domain**.
4. Enter your subdomain, e.g.: `api.yourdomain.com`.
5. Set the **Document Root** to a dedicated directory, e.g.: `public_html/api` or `domains/api.yourdomain.com`.
6. Click **Submit**.
7. *(Optional but recommended)* Go to **SSL/TLS Status** and run **AutoSSL** to generate a free Let's Encrypt SSL certificate for `api.yourdomain.com`.

---

## 📂 Step 3: Upload the Backend to cPanel

1. In cPanel, open **File Manager**.
2. Navigate to your user home directory (e.g., `/home/username/`).
3. Create a new folder named `mindvault-backend` (keeping it outside `public_html` is best practice for Node.js backends).
4. Enter the `mindvault-backend` folder and click **Upload**.
5. Upload `mindvault-backend-deploy.zip`.
6. Select the uploaded `.zip` file and click **Extract**.
7. Ensure the extracted files (`app.js`, `build/`, `prisma/`, `package.json`, etc.) are directly inside `/home/username/mindvault-backend/`.

---

## ⚙️ Step 4: Create the Node.js Application in cPanel

1. In cPanel, navigate to the **Software** section and click **Setup Node.js App**.
2. Click the blue **Create Application** button.
3. Configure the fields:
   - **Node.js version**: Choose `20.x` (or `18.x` / `22.x`).
   - **Application mode**: Select `Production`.
   - **Application root**: Enter `mindvault-backend` (the folder where your files were extracted).
   - **Application URL**: Select your subdomain (e.g., `api.yourdomain.com`).
   - **Application startup file**: Enter `app.js`.
4. Click **Create** (top right).
5. The application will be registered, and cPanel will create a virtual environment for your app.

---

## 🔐 Step 5: Configure Environment Variables

You can configure environment variables in one of two ways:

### Option A: Via cPanel GUI (Recommended)
In the **Setup Node.js App** screen for your application:
1. Scroll down to **Environment variables**.
2. Click **Add Variable** for each of the following:

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `DATABASE_URL` | `postgresql://...sslmode=require` | Neon pooled PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | `postgresql://...sslmode=require` | Neon direct connection string (migrations) |
| `JWT_ACCESS_SECRET` | *(64+ random characters)* | Secure secret for JWT access tokens |
| `JWT_REFRESH_SECRET` | *(64+ random characters)* | Secure secret for JWT refresh tokens |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` | Access token lifespan |
| `REFRESH_TOKEN_EXPIRES_IN` | `30d` | Refresh token lifespan |
| `BCRYPT_ROUNDS` | `12` | Password hash rounds |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Supabase public key |
| `SUPABASE_SECRET_KEY` | `sb_secret_...` | Supabase service role secret |
| `SUPABASE_STORAGE_BUCKET` | `uploads-ai` | Supabase storage bucket name |
| `USE_LOCAL_STORAGE` | `false` | `false` for Supabase; `true` for local disk |
| `NVIDIA_API_KEY` | `nvapi-...` | NVIDIA API Key for embeddings / chat |
| `NVIDIA_BASE_URL` | `https://integrate.api.nvidia.com/v1` | NVIDIA API endpoint |

3. Click **Save**.

### Option B: Via `.env` File
In cPanel File Manager:
1. Go into `/home/username/mindvault-backend/`.
2. Make sure hidden files are visible (Settings > Show Hidden Files).
3. Create or edit `.env` and paste your environment variables.

---

## 📦 Step 6: Install Dependencies on the Server

### Method 1: Using the cPanel UI
1. In **Setup Node.js App**, open your app.
2. Click the **Run NPM Install** button.
3. Wait for the notification that dependencies were installed successfully.

### Method 2: Using cPanel Terminal (Recommended if NPM Install times out)
1. At the top of the **Setup Node.js App** page, cPanel shows a command to activate your virtual environment, e.g.:
   ```bash
   source /home/username/nodevenv/mindvault-backend/20/bin/activate && cd /home/username/mindvault-backend
   ```
2. Open **Terminal** in cPanel.
3. Paste and run the activation command.
4. Run:
   ```bash
   npm install --omit=dev
   ```

---

## ▶️ Step 7: Start & Restart the Application

1. In **Setup Node.js App**, click **Restart**.
2. Make sure the application status indicates **Started / Running**.

---

## 🩺 Step 8: Verify Deployment

Open your browser and test the following endpoints:

1. **GraphQL Health Check**:
   Visit: `https://api.yourdomain.com/graphql`
   *(You should see an Apollo Server response or Apollo Sandbox interface)*.
2. **REST Health Check**:
   Visit: `https://api.yourdomain.com/api/uploads/health`
   *(Should return `{ "status": "ok" }` or upload route status)*.

---

## 💻 Step 9: Point the Frontend to the New Backend

Update your frontend configuration (in `frontend/.env.production` or your frontend hosting settings):

```env
VITE_GRAPHQL_URL=https://api.yourdomain.com/graphql
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Re-build and deploy the frontend, and verify login, chat, and document uploads.

---

## 🛠️ Common Troubleshooting

### 1. 503 Service Unavailable or Phusion Passenger Crash
- In cPanel File Manager, check for error logs:
  - `/home/username/mindvault-backend/stderr.log`
  - `/home/username/logs/passenger.log`
- Common cause: Missing environment variables (`DATABASE_URL`, `JWT_ACCESS_SECRET`, etc.).
- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are each at least 32 characters long.

### 2. File Upload Permissions (if `USE_LOCAL_STORAGE=true`)
- If using local disk for uploads, make sure the `uploads` folder has write permissions:
  ```bash
  chmod 755 /home/username/mindvault-backend/uploads
  ```

### 3. Native Addon (`bcrypt`) Issues
- If `npm install` fails on `bcrypt` during server-side installation, either:
  - Ensure python and gcc are available in your cPanel environment, OR
  - Run `npm install --build-from-source bcrypt` in the activated virtual environment.
