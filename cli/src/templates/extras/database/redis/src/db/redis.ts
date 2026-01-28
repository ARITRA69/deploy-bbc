import { createClient } from "redis";

/**
 * Redis client setup
 * Docs: https://github.com/redis/node-redis
 */

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

/**
 * Create Redis client instance
 */
export const redis_client = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("❌ Redis connection failed after 10 retries");
        return new Error("Redis connection failed");
      }
      // Exponential backoff: 50ms, 100ms, 200ms, etc.
      return Math.min(retries * 50, 3000);
    },
  },
});

/**
 * Connect to Redis
 */
export async function connect_redis(): Promise<void> {
  try {
    await redis_client.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    throw error;
  }
}

/**
 * Disconnect from Redis
 * Call this when shutting down the application
 */
export async function disconnect_redis(): Promise<void> {
  await redis_client.quit();
  console.log("Redis connection closed");
}

/**
 * Test Redis connection
 */
export async function test_connection(): Promise<boolean> {
  try {
    await redis_client.ping();
    console.log("✅ Redis ping successful");
    return true;
  } catch (error) {
    console.error("❌ Redis ping failed:", error);
    return false;
  }
}

// Event listeners
redis_client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redis_client.on("connect", () => {
  console.log("Redis client connected");
});

redis_client.on("ready", () => {
  console.log("Redis client ready");
});

redis_client.on("reconnecting", () => {
  console.log("Redis client reconnecting...");
});

// Helper functions for common operations
export const redis = {
  /**
   * Set a key-value pair
   */
  set: async (key: string, value: string, expireSeconds?: number) => {
    if (expireSeconds) {
      return await redis_client.setEx(key, expireSeconds, value);
    }
    return await redis_client.set(key, value);
  },

  /**
   * Get value by key
   */
  get: async (key: string) => {
    return await redis_client.get(key);
  },

  /**
   * Delete a key
   */
  del: async (key: string) => {
    return await redis_client.del(key);
  },

  /**
   * Check if key exists
   */
  exists: async (key: string) => {
    return await redis_client.exists(key);
  },

  /**
   * Set expiration on a key
   */
  expire: async (key: string, seconds: number) => {
    return await redis_client.expire(key, seconds);
  },

  /**
   * Get all keys matching pattern
   */
  keys: async (pattern: string) => {
    return await redis_client.keys(pattern);
  },

  /**
   * Increment a value
   */
  incr: async (key: string) => {
    return await redis_client.incr(key);
  },

  /**
   * Decrement a value
   */
  decr: async (key: string) => {
    return await redis_client.decr(key);
  },

  /**
   * Hash operations
   */
  hash: {
    set: async (key: string, field: string, value: string) => {
      return await redis_client.hSet(key, field, value);
    },
    get: async (key: string, field: string) => {
      return await redis_client.hGet(key, field);
    },
    getAll: async (key: string) => {
      return await redis_client.hGetAll(key);
    },
    del: async (key: string, field: string) => {
      return await redis_client.hDel(key, field);
    },
  },

  /**
   * List operations
   */
  list: {
    push: async (key: string, ...values: string[]) => {
      return await redis_client.lPush(key, values);
    },
    pop: async (key: string) => {
      return await redis_client.lPop(key);
    },
    range: async (key: string, start: number, stop: number) => {
      return await redis_client.lRange(key, start, stop);
    },
    length: async (key: string) => {
      return await redis_client.lLen(key);
    },
  },

  /**
   * Set operations
   */
  set_ops: {
    add: async (key: string, ...members: string[]) => {
      return await redis_client.sAdd(key, members);
    },
    members: async (key: string) => {
      return await redis_client.sMembers(key);
    },
    isMember: async (key: string, member: string) => {
      return await redis_client.sIsMember(key, member);
    },
    remove: async (key: string, ...members: string[]) => {
      return await redis_client.sRem(key, members);
    },
  },
};

// Example usage:
/*
// Simple key-value
await redis.set("user:1:name", "John Doe");
await redis.set("session:abc123", "user_data", 3600); // Expires in 1 hour
const name = await redis.get("user:1:name");

// Hash (for objects)
await redis.hash.set("user:1", "email", "john@example.com");
await redis.hash.set("user:1", "age", "30");
const userData = await redis.hash.getAll("user:1");

// Lists (queues)
await redis.list.push("tasks", "task1", "task2");
const task = await redis.list.pop("tasks");

// Sets (unique values)
await redis.set_ops.add("online_users", "user1", "user2");
const isOnline = await redis.set_ops.isMember("online_users", "user1");
*/
