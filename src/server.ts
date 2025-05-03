import app from "./app";
import { CONNECT_DB } from "./config/db";
import logger from "./config/logger";
import Queue from "./lib/queue";
import { getRedisConnection } from "./lib/redis";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT);
    logger.info(`Server is running on port ${PORT}`);

    await CONNECT_DB();
    await getRedisConnection();

    await Queue.consume("health_updates");
  } catch (error) {
    logger.error("Error in server startup:", error);
    process.exit(1);
  }
};

void startServer();
