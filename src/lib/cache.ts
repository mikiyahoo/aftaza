import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const CACHE_KEYS = {
  PROPERTIES_LIST: 'properties:list',
  PROPERTY_DETAIL: (id: number) => `property:${id}`,
  FEATURED_PROPERTIES: 'properties:featured',
  COMPANY_PROPERTIES: (companyId: string) => `company:${companyId}:properties`,
  SEARCH_RESULTS: (query: string) => `search:${query}`,
  STATS: 'dashboard:stats',
  COMPANIES_LIST: 'companies:list',
  TESTIMONIALS: 'testimonials:featured',
  INQUIRIES_RECENT: 'inquiries:recent'
};

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400 // 24 hours
};

export class CacheManager {
  // Get data from cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set data in cache
  static async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Delete from cache
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Clear cache by pattern
  static async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Invalidate property-related caches
  static async invalidateProperty(propertyId?: number): Promise<void> {
    await Promise.all([
      this.clearPattern('properties:list*'),
      this.clearPattern('properties:featured*'),
      this.clearPattern('search:*'),
      this.clearPattern('company:*:properties*'),
      propertyId ? this.delete(CACHE_KEYS.PROPERTY_DETAIL(propertyId)) : null
    ]);
  }

  // Invalidate company-related caches
  static async invalidateCompany(companyId?: string): Promise<void> {
    await Promise.all([
      this.delete(CACHE_KEYS.COMPANIES_LIST),
      this.clearPattern('company:*:properties*'),
      companyId ? this.delete(CACHE_KEYS.COMPANY_PROPERTIES(companyId)) : null
    ]);
  }

  // Invalidate all caches
  static async clearAll(): Promise<void> {
    try {
      await redis.flushdb();
    } catch (error) {
      console.error('Cache clear all error:', error);
    }
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Get cache stats
  static async getStats(): Promise<any> {
    try {
      const info = await redis.info('memory');
      const keyspace = await redis.info('keyspace');
      return {
        memory: info,
        keyspace: keyspace,
        connected: redis.status === 'ready'
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return null;
    }
  }
}

// Middleware for caching API responses
export function withCache(handler: Function, key: string, ttl: number = CACHE_TTL.MEDIUM) {
  return async (req: Request, ...args: any[]) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return handler(req, ...args);
    }

    // Try to get from cache
    const cached = await CacheManager.get(key);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { 
          'Content-Type': 'application/json', 
          'X-Cache': 'HIT',
          'X-Cache-Key': key
        }
      });
    }

    // Get fresh data
    const response = await handler(req, ...args);
    const data = await response.json();

    // Store in cache
    await CacheManager.set(key, data, ttl);

    // Return with cache miss header
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json', 
        'X-Cache': 'MISS',
        'X-Cache-Key': key
      }
    });
  };
}

// Cache decorator for functions
export function cacheable(keyGenerator: (...args: any[]) => string, ttl: number = CACHE_TTL.MEDIUM) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      
      // Try to get from cache
      const cached = await CacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get fresh data
      const result = await originalMethod.apply(this, args);

      // Store in cache
      await CacheManager.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

// Cache invalidation decorators
export function invalidateCache(pattern: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Invalidate cache after successful operation
      if (result) {
        await CacheManager.clearPattern(pattern);
      }

      return result;
    };

    return descriptor;
  };
}

// Health check for Redis
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}