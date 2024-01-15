import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { RedisService } from './redis.service';
import { Status } from './redis';
import { EventGateway } from './event.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private redisService: RedisService,
    private eventGateway: EventGateway,
  ) {
    console.log(new Date().toISOString() + ' | AppController constructor');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('user.uuid.*')
  saveData(@Payload() payload: Status, @Ctx() ctx: RedisContext): any {
    if (!payload) return false;
    const channel = ctx.getChannel();
    console.log(
      new Date().toISOString() +
        ' | AppController | saveData | ' +
        channel +
        ' | ' +
        payload.status,
    );

    const data = this.redisService.redis.set(channel, JSON.stringify(payload));

    this.eventGateway.emitEvent(channel, payload);

    return data;
  }
}
