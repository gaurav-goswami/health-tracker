import logger from "../../src/config/logger";
import { seedUserTable } from "./user-table";

const DEV_ENV = process.env.NODE_ENV === "development";

async function main() {
  if (!DEV_ENV) {
    logger.error("DB SEED IS ONLY FOR DEVELOPMENT ENVIRONMENT");
    process.exit(1);
  }

  try {
    await seed();
    // logger.info("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Error during database seeding:", error);
    process.exit(1);
  }
}

async function seed() {
  await seedUserTable();
}

void main();
