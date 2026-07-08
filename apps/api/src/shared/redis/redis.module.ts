import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

/** Global so any module can inject the shared cache service. */
@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
