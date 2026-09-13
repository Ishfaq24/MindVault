import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..");
const bundleDir = path.resolve(serverRoot, "deploy-bundle");
const zipPath = path.resolve(serverRoot, "mindvault-backend-deploy.zip");

console.log("🔨 Step 1: Compiling TypeScript backend...");
execSync("npm run build", { cwd: serverRoot, stdio: "inherit" });

console.log("📦 Step 2: Preparing staging folder for cPanel deployment...");
if (fs.existsSync(bundleDir)) {
  fs.rmSync(bundleDir, { recursive: true, force: true });
}
fs.mkdirSync(bundleDir, { recursive: true });

// Helper to recursively copy directories
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy build directory
console.log(" -> Copying build directory...");
copyDir(path.join(serverRoot, "build"), path.join(bundleDir, "build"));

// 2. Copy prisma directory
console.log(" -> Copying prisma directory...");
copyDir(path.join(serverRoot, "prisma"), path.join(bundleDir, "prisma"));

// 3. Create uploads directory with placeholder
console.log(" -> Ensuring uploads directory exists...");
const uploadsDir = path.join(bundleDir, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
fs.writeFileSync(path.join(uploadsDir, ".gitkeep"), "");

// 4. Copy individual root files
const filesToCopy = [
  "app.js",
  "package.json",
  "package-lock.json",
  ".env.example",
  ".htaccess.example",
];

for (const file of filesToCopy) {
  const src = path.join(serverRoot, file);
  if (fs.existsSync(src)) {
    console.log(` -> Copying ${file}...`);
    fs.copyFileSync(src, path.join(bundleDir, file));
  }
}

// 5. Create zip archive
console.log("🤐 Step 3: Compressing into mindvault-backend-deploy.zip...");
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

if (process.platform === "win32") {
  // Use PowerShell Compress-Archive on Windows
  execSync(
    `powershell.exe -NoProfile -Command "Compress-Archive -Path '${bundleDir}\\*' -DestinationPath '${zipPath}' -Force"`,
    { stdio: "inherit" }
  );
} else {
  // Use zip on Unix/Linux
  execSync(`zip -r "${zipPath}" .`, { cwd: bundleDir, stdio: "inherit" });
}

console.log("\n✅ Deployment bundle created successfully!");
console.log(`📍 Archive path: ${zipPath}`);
console.log(`📂 Staging folder: ${bundleDir}`);
console.log("\nYou can upload mindvault-backend-deploy.zip directly to your cPanel directory and extract it.\n");
