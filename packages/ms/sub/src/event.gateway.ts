import { HttpService } from '@nestjs/axios';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { Status } from './redis';

@WebSocketGateway(3003, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private http: HttpService) {
    console.log(new Date().toISOString() + ' | EventGateway constructor');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('event.gateway:handleConnection:connected');
    console.log('event.gateway:handleConnection:client: ' + client.id);
  }

  handleDisconnect() {
    console.log('Client disconnected');
  }

  @SubscribeMessage('test')
  onEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<number>> {
    console.log(
      new Date().toISOString() + ' | EventGateway | onEvent | ' + data,
    );
    if (!data?.uuid) throw new Error('uuid is required');
    const event = `users.uuid.${data.uuid}`;
    const response = [1, 2, 3];
    client.emit(event, 'response');
    return from(response).pipe(map((data) => ({ event, data })));
  }

  emitEvent(event: string, data: Status) {
    console.log(
      new Date().toISOString() + ' | EventGateway | emitEvent | ' + event,
    );
    this.server.emit(event, data);
  }
}
