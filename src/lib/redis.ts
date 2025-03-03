import { createClient } from 'redis';

declare global {
  // Allow a global variable to hold the Redis client so it persists across module reloads.
  var __redisClient: ReturnType<typeof createClient> | undefined;
}

const client = globalThis.__redisClient || createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
    }
});

if (!globalThis.__redisClient) {
  globalThis.__redisClient = client;
  client.on('error', (err) => console.error('Redis Client Error', err));
  await client.connect();
}

export default client;
