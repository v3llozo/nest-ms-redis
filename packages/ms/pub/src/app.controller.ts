import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async getStatus(@Body() body: any): Promise<object> {
    return await this.appService.getStatus(body.uuid);
  }

  @Post('/triggerWebhook')
  async triggerWebhook(@Body() body: any): Promise<object> {
    this.appService.triggerWebhook(body.uuid);
    return { message: 'webhook trigerred' };
  }

  @Post('webhook')
  async webhook(@Res() res: Response, @Body() body: any) {
    console.log('app.controller:webhook:body = ', body);
    await this.appService.publishStatus(body.uuid, body.status);
    return res.status(200).send();
  }
}
