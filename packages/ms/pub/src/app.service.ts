import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    private httpService: HttpService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getStatus(uuid: string): Promise<object> {
    const dataPath = `user.uuid.${uuid}`;
    console.log('app.service:getStatus:dataPath = ', dataPath);
    const status = JSON.parse(
      (await this.redisService.redis.get(dataPath)) || '',
    );
    console.log('app.service:getStatus:status = ', status);
    console.log('app.service:getStatus:triggerWebhook');
    return status;
  }

  async triggerWebhook(uuid: string) {
    const url = 'http://host.docker.internal:3002';
    const data = { uuid: uuid, url: 'http://localhost:3000/webhook' };

    console.log('app.service:triggerWebhook:url = ', url);
    try {
      console.log('app.service:triggerWebhook:try');
      this.httpService.post(url, data).subscribe((res) => {
        console.log('app.service:triggerWebhook:res = ', res.status);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async publishStatus(uuid: string, status: string): Promise<boolean> {
    const dataPath = `user.uuid.${uuid}`;
    console.log('app.service:publishStatus:uuid = ', uuid);
    console.log('app.service:publishStatus:status = ', status);
    const result = await this.redisService.redis.publish(
      dataPath,
      JSON.stringify({ status: status, updatedAt: new Date().toISOString() }),
    );
    console.log('app.service:publishStatus:result = ', result);
    return !!0;
  }
}
