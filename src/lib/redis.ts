import { createClient, RedisClientType } from "redis";
import logger from "../config/logger";

let connection: RedisClientType | null = null;

export async function getRedisConnection(): Promise<RedisClientType | null> {
  if (!process.env.REDIS_URL) {
    logger.error("Redis connection URL not available");
    return null;
  }

  connection = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: () => {
        logger.error("Redis reconnect attempt blocked");
        return new Error("Redis reconnect disabled");
      },
    },
  });

  connection.on("error", (err) => {
    logger.error("Error while connecting to Redis", err);
  });

  try {
    await connection.connect();
    // logger.info("Connected to Redis 🎊");
    return connection;
  } catch (err) {
    logger.error("Failed to establish connection with Redis", err);
    connection = null;
    return null;
  }
}
