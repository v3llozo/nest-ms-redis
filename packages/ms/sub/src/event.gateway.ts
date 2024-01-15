import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AppService } from './app.service';

@WebSocketGateway(3000, { namespace: 'list' })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  client: ClientProxy;
  constructor(private readonly appService: AppService) {
    console.log(new Date().toISOString() + '\tEvent constructor');
  }

  @SubscribeMessage('list')
  handleEvent(): string[] {
    return this.appService.getData();
  }

  afterInit() {
    console.log(new Date().toISOString() + '\tEvent afterInit');
    return true;
  }

  handleConnection() {
    console.log(new Date().toISOString() + '\tEvent handleConnection');
    return true;
  }

  handleDisconnect() {
    console.log(new Date().toISOString() + '\tEvent handleDisconnect');
    return true;
  }
}
