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
  });
  connection.on("error", (err) => {
    logger.error("Error while connecting to redis", err);
    connection = null;
  });
  try {
    await connection.connect();
    logger.info("Connected to redis 🎊");
  } catch (err) {
    logger.error("Failed to establish connection with redis", err);
    connection = null;
    return null;
  }
  return connection;
}
