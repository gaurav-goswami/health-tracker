import app from "./app";
import { CONNECT_DB } from "./config/db";
import logger from "./config/logger";
import { getRedisConnection } from "./lib/redis";

const PORT = process.env.PORT || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    CONNECT_DB().catch((error) => {
      logger.error("Database connection failed:", error);
      process.exit(1);
    });
    getRedisConnection().catch((error) => {
      logger.error("Redis connection error", error);
    });
  });
};

startServer();
