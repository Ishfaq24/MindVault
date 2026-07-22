import { connectDatabase } from "./database/database.js";
import { startServer } from "./app/server.js";

async function bootstrap() {
  try {
    await connectDatabase();
    await startServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

bootstrap();
