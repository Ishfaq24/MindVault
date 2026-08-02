import "dotenv/config";
import { prisma } from "../src/database/prisma.js";

async function main() {
  console.log("Starting migration: prefixing LOCAL storage keys with 'local:'");

  const files = await prisma.file.findMany({
    where: {
      storageProvider: "LOCAL",
      // storageKey not starting with local:
      AND: [
        {
          NOT: {
            storageKey: {
              startsWith: "local:",
            },
          },
        },
      ],
    },
  });

  console.log(`Found ${files.length} files to migrate`);

  for (const f of files) {
    const newKey = `local:${f.storageKey}`;
    await prisma.file.update({
      where: { id: f.id },
      data: { storageKey: newKey },
    });
    console.log(`Updated ${f.id} -> ${newKey}`);
  }

  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
