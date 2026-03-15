import { Prisma } from '@prisma/client';

export const performanceMiddleware = Prisma.defineExtension({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const start = performance.now();
      const result = await query(args);
      const end = performance.now();
      const time = end - start;

      // Log slow queries (>100ms)
      if (time > 100) {
        console.warn(`⚠️ Slow query (${time.toFixed(2)}ms):`, {
          model,
          operation,
          args: JSON.stringify(args).substring(0, 200)
        });
      }

      // Log to monitoring service in production
      if (process.env.NODE_ENV === 'production' && time > 200) {
        // Send to your monitoring service
        try {
          await fetch(process.env.MONITORING_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'slow_query',
              model,
              operation,
              time,
              timestamp: new Date().toISOString(),
              args: JSON.stringify(args).substring(0, 500)
            })
          });
        } catch (error) {
          console.error('Failed to send monitoring data:', error);
        }
      }

      return result;
    }
  }
});

// Performance monitoring utilities
export class PerformanceMonitor {
  private static timers = new Map<string, number>();

  // Start timing a function
  static startTimer(label: string): void {
    this.timers.set(label, performance.now());
  }

  // End timing and log result
  static endTimer(label: string, threshold: number = 100): number {
    const start = this.timers.get(label);
    if (!start) {
      console.warn(`Timer "${label}" was not started`);
      return 0;
    }

    const end = performance.now();
    const duration = end - start;
    this.timers.delete(label);

    if (duration > threshold) {
      console.warn(`⚠️ Slow operation (${duration.toFixed(2)}ms): ${label}`);
    }

    return duration;
  }

  // Measure async function performance
  static async measure<T>(label: string, fn: () => Promise<T>, threshold: number = 100): Promise<T> {
    this.startTimer(label);
    try {
      const result = await fn();
      const duration = this.endTimer(label, threshold);
      return result;
    } catch (error) {
      const duration = this.endTimer(label, threshold);
      console.error(`❌ Error in ${label} (${duration.toFixed(2)}ms):`, error);
      throw error;
    }
  }

  // Measure sync function performance
  static measureSync<T>(label: string, fn: () => T, threshold: number = 100): T {
    this.startTimer(label);
    try {
      const result = fn();
      const duration = this.endTimer(label, threshold);
      return result;
    } catch (error) {
      const duration = this.endTimer(label, threshold);
      console.error(`❌ Error in ${label} (${duration.toFixed(2)}ms):`, error);
      throw error;
    }
  }

  // Get performance metrics
  static getMetrics(): any {
    return {
      timers: Array.from(this.timers.entries()),
      timestamp: new Date().toISOString()
    };
  }

  // Clear all timers
  static clearTimers(): void {
    this.timers.clear();
  }
}

// API response time monitoring
export function monitorApiResponse(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const start = performance.now();
    
    try {
      const response = await handler(req, ...args);
      const end = performance.now();
      const duration = end - start;

      // Add performance headers
      const headers = new Headers(response.headers);
      headers.set('X-Response-Time', `${duration.toFixed(2)}ms`);
      headers.set('X-Node-Env', process.env.NODE_ENV || 'development');

      if (duration > 1000) {
        console.warn(`⚠️ Slow API response (${duration.toFixed(2)}ms): ${req.method} ${req.url}`);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      console.error(`❌ API Error (${duration.toFixed(2)}ms): ${req.method} ${req.url}`, error);
      throw error;
    }
  };
}

// Database query performance tracking
export class QueryTracker {
  private static queries = new Map<string, { count: number; totalTime: number; avgTime: number }>();

  static trackQuery(operation: string, model: string, time: number): void {
    const key = `${model}.${operation}`;
    const existing = this.queries.get(key) || { count: 0, totalTime: 0, avgTime: 0 };
    
    existing.count++;
    existing.totalTime += time;
    existing.avgTime = existing.totalTime / existing.count;
    
    this.queries.set(key, existing);
  }

  static getQueryStats(): any {
    const stats = Array.from(this.queries.entries()).map(([key, data]) => ({
      query: key,
      ...data
    }));

    return stats.sort((a, b) => b.totalTime - a.totalTime);
  }

  static clearStats(): void {
    this.queries.clear();
  }
}

// Memory usage monitoring
export function getMemoryUsage(): any {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024) + ' MB', // Resident Set Size
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB', // Total Size of the Heap
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB', // Heap Actually Used
      external: Math.round(usage.external / 1024 / 1024) + ' MB', // External memory usage
      arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024) + ' MB'
    };
  }
  return null;
}

// Request/response logging middleware
export function requestLogger(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const start = performance.now();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    console.log(`📝 ${method} ${url} - ${userAgent}`);

    try {
      const response = await handler(req, ...args);
      const end = performance.now();
      const duration = end - start;

      console.log(`✅ ${method} ${url} - ${response.status} - ${duration.toFixed(2)}ms`);
      
      return response;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      console.error(`❌ ${method} ${url} - Error - ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
}