import { createClient } from 'redis';

declare global {
  // Allow a global variable to hold the Redis client so it persists across module reloads.
  var __redisClient: ReturnType<typeof createClient> | undefined;
  var __redisConnecting: Promise<void> | undefined;
}

const client = globalThis.__redisClient || createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.error('Redis: Max reconnection attempts reached');
                return null;
            }
            return Math.min(retries * 100, 3000);
        }
    }
});

if (!globalThis.__redisClient) {
  globalThis.__redisClient = client;
  client.on('error', (err) => console.error('Redis Client Error', err));

  // Only connect if not already connected or connecting
  if (!client.isOpen && !globalThis.__redisConnecting) {
    globalThis.__redisConnecting = client.connect().then(() => {
      globalThis.__redisConnecting = undefined;
    }).catch(() => {
      globalThis.__redisConnecting = undefined;
    });
    await globalThis.__redisConnecting;
  }
}

export default client;
