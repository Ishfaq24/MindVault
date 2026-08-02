import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { getStorageService } from "../src/modules/uploads/services/storage.factory.js";

async function main() {
  const storage = getStorageService();

  const filePath = path.resolve(process.cwd(), "scripts", "test-file.txt");
  await fs.promises.writeFile(filePath, "storage-test-content");
  const buffer = await fs.promises.readFile(filePath);

  console.log("Uploading test file...");
  const res = await storage.upload(buffer, "test-file.txt", "text/plain");
  console.log("Upload result:", res);

  const signed = await storage.getSignedUrl(res.storageKey);
  console.log("Signed URL:", signed);

  const downloaded = await storage.download(res.storageKey);
  console.log("Downloaded size:", downloaded.length);

  console.log("Deleting...");
  await storage.delete(res.storageKey);
  console.log("Deleted.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
