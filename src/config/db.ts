import { PrismaClient } from "../../prisma/src/generated/client";
import logger from "./logger";

const prisma = new PrismaClient();

export const CONNECT_DB = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    // logger.info("Successfully connected to the database");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`DB Connection Error: ${error.message}`);
    } else {
      logger.error("Unknown error occurred during DB connection");
    }
    return false;
  }
};

export default prisma;
