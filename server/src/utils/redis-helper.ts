import logger from "../config/logger";
import { getRedisConnection } from "../lib/redis";

export async function getRedisKeyValue(key: string): Promise<string | null> {
  const redis = await getRedisConnection();
  if (!redis) return null;

  try {
    return await redis.get(key);
  } catch (err) {
    logger.error("Error while getting redis key", err);
    return null;
  }
}

export async function setRedisKeyValue(
  key: string,
  value: string,
  expiryInSeconds: number
): Promise<boolean> {
  const redis = await getRedisConnection();
  if (!redis) return false;

  try {
    if (expiryInSeconds > 0) {
      await redis.setEx(key, expiryInSeconds || 300, value);
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch (err) {
    logger.error("Error while setting redis key", err);
    return false;
  }
}
