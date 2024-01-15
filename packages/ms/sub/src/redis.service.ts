import { Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  @Client({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
    },
  })
  public client: ClientProxy;
  public redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    });
  }
}
