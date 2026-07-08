import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Thin, resilient cache wrapper around Redis. Cache is an optimization, never a
 * correctness dependency: if Redis is unavailable, every method degrades to a
 * miss/no-op so requests still succeed (just without caching).
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private healthy = false;

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
    this.client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 5 ? null : Math.min(times * 200, 2000)),
    });
    this.client.on('error', (err) => {
      if (this.healthy) this.logger.warn(`Redis error: ${err.message}`);
      this.healthy = false;
    });
    this.client.on('ready', () => {
      this.healthy = true;
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      this.healthy = true;
    } catch (err) {
      this.logger.warn(
        `Redis unavailable, continuing without cache: ${(err as Error).message}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch {
      // ignore shutdown errors
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.healthy) return null;
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.healthy) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // ignore cache write failures
    }
  }

  /** Deletes keys matching a glob pattern (used for cache invalidation). */
  async delByPattern(pattern: string): Promise<void> {
    if (!this.healthy) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) await this.client.del(...keys);
    } catch {
      // ignore
    }
  }
}
