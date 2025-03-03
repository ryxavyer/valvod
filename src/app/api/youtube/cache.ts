import redis from '@src/lib/redis';
import { VOD } from './types';

export async function getRedisVods(cache_key: string): Promise<VOD[]> {
  const cachedData = await redis.get(cache_key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return [];
}
